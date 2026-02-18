import { useEffect, useRef, useState } from 'react'
import { LeanWebPlugin } from '../config/docs'

interface VersoPreviewProps {
  currentTab: 'info' | LeanWebPlugin
  isUsingMobile: boolean
  code: string
  projectId: string
}

function VersoPreview({ currentTab, isUsingMobile, code, projectId }: VersoPreviewProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [previewedProject, setPreviewedProject] = useState<null | string>(null)
  const [previewedCode, setPreviewedCode] = useState<null | string>(null)
  const [hrefForIframe, setHrefForIframe] = useState<null | string>(null)
  const [output, setOutput] = useState<string[]>([])
  const scrollerRef = useRef<HTMLDivElement>(null)

  const loadCode = () => {
    setIsLoading(true)
    setOutput(['connecting...'])

    const read = new EventSource('/verso/api/stream')
    read.onerror = (x) => console.log({ error: x })
    read.onmessage = ({ data }) => {
      const line = JSON.parse(data)
      setOutput((info) => [...info, line.contents])
    }
    read.addEventListener('connect', (event) => {
      const streamId = event.data
      setOutput((info) => [...info, '...connected'])

      fetch(`/verso/api/singlepage?stream=${streamId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ projectId: projectId, fileContents: code }),
      })
        .then((resp) => resp.json())
        .then((json) => {
          setIsLoading(false)
          if (!json.success) {
            setOutput((info) => [...info, json.result ?? 'Unexpected response from server.'])
            console.error(json)
            return
          }
          setHrefForIframe(json.href)
          setPreviewedCode(code)
          setPreviewedProject(projectId)
        })
        .catch((err) => {
          setIsLoading(false)
          setOutput((info) => [...info, 'Unexpected response from server.'])
          console.error(err)
        })
        .finally(() => read.close())
    })
  }

  const [lastTab, setLastTab] = useState(currentTab)
  useEffect(() => {
    if (lastTab === currentTab) return
    setLastTab(currentTab)
    if (currentTab !== 'versobox') return
    if (code === previewedCode) return
    if (isLoading) return
    loadCode()
  }, [currentTab, lastTab])

  useEffect(() => {
    scrollerRef.current.scrollTop = scrollerRef.current.scrollHeight
  }, [output])

  return (
    <div
      className="verso-preview-tab"
      aria-labelledby="tab-preview"
      style={currentTab === 'versobox' ? {} : { display: 'none' }}
    >
      <button disabled={isLoading || previewedCode === code} onClick={loadCode}>
        {isLoading ? 'Loading...' : 'Load'}
      </button>
      <div ref={scrollerRef} style={{ overflow: 'scroll', width: '100%', height: '4em' }}>
        <div style={{ width: 'max-content', height: 'max-content' }} className="versostatus">
          {output.join('\n')}
        </div>
      </div>
      {hrefForIframe && <iframe key={previewedCode} src={hrefForIframe} />}
    </div>
  )
}

export default VersoPreview
