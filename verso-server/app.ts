import express, { type Response } from 'express'
import { z } from 'zod'
import { mkdir, mkdtemp } from 'node:fs/promises'
import { join } from 'node:path'
import { randomUUID } from 'node:crypto'
import { compileVerso, OUTPUT_ROOT_DIR } from './exec.ts'

export const app = express()
app.use(express.json())

const trackingRequests: { [id: string]: Response } = {}

app.get('/verso/api/stream', async (req, res) => {
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Connection', 'keep-alive')
  res.setHeader('X-Accel-Buffering', 'no')
  res.flushHeaders()

  const id = randomUUID()
  trackingRequests[id] = res
  res.write('event: connect\n')
  res.write(`data: ${id}\n\n`)
  console.log(`starting stream for ${id}`)
  req.on('close', () => {
    console.log(`stream for ${id} ended with an error`)
    delete trackingRequests[id]
  })
  req.on('end', () => {
    console.log(`stream for ${id} ended normally`)
    delete trackingRequests[id]
  })
})

const zBuildRequest = z.object({
  projectId: z.string().regex(/^[A-Za-z0-9][A-Za-z0-9.-]*$/),
  fileContents: z.string(),
})
app.post('/verso/api/singlepage', async (req, res) => {
  const id: string | null = req.query.stream ? `${req.query.stream}` : null
  if (id) {
    if (id in trackingRequests) {
      console.log(`connected /verso/api/singlepage to ${id}`)
    } else {
      console.log(`could not connect /verso/api/singlepage to ${id}`)
    }
  }
  function sendProgress(obj: unknown) {
    if (id === null) return
    if (id in trackingRequests) {
      const txt = JSON.stringify(obj)
      console.log(`to ${id}: ${txt}`)
      trackingRequests[id].write('data: ' + txt + '\n\n')
    }
  }

  const body = zBuildRequest.safeParse(req.body)
  if (!body.success) {
    res.status(400).send({ error: 'Poorly-formed request' })
    return
  }
  const uniqueDirName = randomUUID()
  const resultDir = join(OUTPUT_ROOT_DIR, uniqueDirName)
  mkdir(resultDir)
  const [resultPath, subprocess] = await compileVerso(body.data.projectId, body.data.fileContents)

  subprocess.stdout.on('data', (data) => {
    for (const line of `${data}`.trim().split('\n')) {
      sendProgress({ stream: 'stdout', contents: line })
    }
  })
  subprocess.stderr.on('data', (data) => {
    for (const line of `${data}`.trim().split('\n')) {
      sendProgress({ stream: 'stderr', contents: line })
    }
  })
  let finished = false
  subprocess.on('error', (data) => {
    finished = true
    res.send({ success: false, result: `${data}`.trim() })
  })
  subprocess.on('close', (data) => {
    if (finished) return
    if (data === 0) {
      sendProgress({ stream: 'stdout', contents: 'Finished successfully!' })
      res.send({ success: true, href: `/verso/view/${resultPath}/html-single` })
    } else {
      res.send({ success: false, result: `process returned non-zero exit code ${data}` })
    }
  })
})

console.log(`Serving static files from ${OUTPUT_ROOT_DIR}`)
app.use('/verso/view', express.static(OUTPUT_ROOT_DIR))
