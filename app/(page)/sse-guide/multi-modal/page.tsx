'use client'

import { useState } from 'react'

import MultiModal from '@/app/components/sse-pack/MultiModal'

export default function MultiModalPage() {
  const [files, setFiles] = useState<File[]>([])

  return (
    <div>
      <main>
        <MultiModal
          accept="image/*,.pdf"
          useClear
          files={files}
          onFilesChange={picked => setFiles(prev => [...prev, ...picked])}
          onRemoveFile={index => setFiles(prev => prev.filter((_, i) => i !== index))}
          onClearFiles={() => setFiles([])}
          onSend={({ text, files }) => {
            console.log('text:', text)
            console.log('files:', files)
          }}
        />
      </main>
    </div>
  )
}
