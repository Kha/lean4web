import express from "express";
import { z } from "zod";
import { mkdir, mkdtemp } from "node:fs/promises";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import { compileVerso, OUTPUT_ROOT_DIR } from "./exec.ts";

export const app = express();
app.use(express.json());

const zBuildRequest = z.object({
  projectId: z.string().regex(/^[A-Za-z0-9][A-Za-z0-9.-]*$/),
  fileContents: z.string(),
});
app.post("/verso/api/singlepage", async (req, res) => {
  function send(obj: unknown) {
    const txt = JSON.stringify(obj);
    console.log("sending " + txt);
    res.write("data: " + txt + "\n\n");
  }

  const body = zBuildRequest.safeParse(req.body);
  if (!body.success) {
    res.status(400).send({ error: "Poorly-formed request" });
  } else {
    // Stream responses
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    const uniqueDirName = randomUUID();
    const resultDir = join(OUTPUT_ROOT_DIR, uniqueDirName);
    mkdir(resultDir);
    const [resultPath, subprocess] = await compileVerso(
      body.data.projectId,
      body.data.fileContents,
    );

    subprocess.stdout.on("data", (data) => {
      send({ stream: "stdout", contents: `${data}` });
    });
    subprocess.stderr.on("data", (data) => {
      send({ stream: "stderr", contents: `${data}` });
    });
    let finished = false;
    subprocess.on("error", (data) => {
      finished = true;
      send({ success: false, result: `${data}` });
      res.end();
    });
    subprocess.on("close", (data) => {
      if (finished) return;
      if (data === 0) {
        send({ success: true, href: `/verso/view/${resultPath}/html-single` });
      } else {
        send({ success: false, result: `process returned non-zero exit code ${data}` });
      }
      res.end();
    });
  }
});

console.log(`Serving static files from ${OUTPUT_ROOT_DIR}`)
app.use("/verso/view", express.static(OUTPUT_ROOT_DIR));
