import { spawn } from "node:child_process";
import type { PathLike } from "node:fs";
import { writeFile } from "node:fs/promises";
import { join } from "node:path";

const PROJ_PATH = process.env.PROJ_PATH || "Projects";

/**
 * Spawn a process that, upon success, will put Verso output in the provided
 * directory.
 * 
 * @param projectId - the project key (e.g. `"verso-server"`)
 * @param theLeanFileContents - text contents of a single-file Lean document
 * @param outputDir - an existing directory where the output is expected to be placed
 */
export async function compileVerso(
  projectId: string,
  theLeanFileContents: string,
  outputDir: string,
) {
  const theLeanFileLoc = join(PROJ_PATH, projectId, "TheLeanFile.lean");
  await writeFile(theLeanFileLoc, theLeanFileContents);
  return spawn("lake", ["--old", "exe", "mkdoc", "--output", outputDir], {
    cwd: join(PROJ_PATH, projectId),
  });
}
