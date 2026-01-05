'use client'

import { useMemo, useState } from 'react'

import MultiModal from '@/app/components/sse-pack/MultiModal'
import { useSSE } from '@/app/hooks/useSse'

type Mode = 'GET' | 'POST'

const SSEHookPage = () => {
  const { sse } = useSSE()

  const [files, setFiles] = useState<File[]>([])
  const [mode, setMode] = useState<Mode>('GET')
  const [mockStarted, setMockStarted] = useState<Record<Mode, boolean>>({
    GET: false,
    POST: false,
  })

  const clientId = useMemo(() => crypto.randomUUID(), [])

  return (
    <div className="p-6 space-y-4">
      {/* 토글 */}
      <header className="flex items-center gap-3">
        <div className="flex items-center rounded border overflow-hidden">
          <button
            type="button"
            onClick={() => setMode('GET')}
            className={`px-3 py-1 text-sm ${mode === 'GET' ? 'font-semibold' : 'opacity-70'}`}
          >
            GET
          </button>
          <div className="w-px h-6 bg-black/10" />
          <button
            type="button"
            onClick={() => setMode('POST')}
            className={`px-3 py-1 text-sm ${mode === 'POST' ? 'font-semibold' : 'opacity-70'}`}
          >
            POST
          </button>
        </div>
      </header>

      <main className="space-y-4">
        <MultiModal
          accept="image/*,.pdf"
          useClear
          files={files}
          onFilesChange={picked => setFiles(prev => [...prev, ...picked])}
          onRemoveFile={index => setFiles(prev => prev.filter((_, i) => i !== index))}
          onClearFiles={() => setFiles([])}
          onSend={async ({ text, files }) => {
            const trimmed = (text ?? '').trim()
            if (!trimmed && (!files || files.length === 0)) return

            if (mockStarted[mode]) return

            if (mode === 'GET') {
              await sse({
                method: 'GET',
                path: '/api/stream/mock',
                params: { clientId, text: trimmed },
              })
            } else {
              await sse({
                method: 'POST',
                path: '/api/stream/mock',
                body: { clientId, text: trimmed },
              })
            }

            setMockStarted(prev => ({ ...prev, [mode]: true }))
          }}
        />
      </main>
    </div>
  )
}

export default SSEHookPage
