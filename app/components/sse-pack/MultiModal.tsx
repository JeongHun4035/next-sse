'use client'

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Send, XCircle, Plus, Mic } from '@deemlol/next-icons'

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n))

const formatBytes = (bytes: number) => {
  const units = ['B', 'KB', 'MB', 'GB']
  let n = bytes
  let i = 0
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024
    i++
  }
  return `${n.toFixed(i === 0 ? 0 : 1)}${units[i]}`
}

type MultiModalProps = {
  placeholder?: string
  useAudio?: boolean
  useClear?: boolean
  accept?: string
  multiple?: boolean
  onFilesChange?: (files: File[]) => void
  files?: File[]
  onRemoveFile?: (index: number) => void
  onClearFiles?: () => void
  onSend?: (payload: { text: string; files: File[] }) => void
}

const  MultiModal = ({
  placeholder = '무엇이든 물어보세요',
  useAudio = false,
  useClear = false,
  accept = '*/*',
  multiple = true,
  onFilesChange,
  files = [],
  onRemoveFile,
  onClearFiles,
  onSend,
}: MultiModalProps) => {
  const BASE_H = 36
  const MIN_H = 36
  const MAX_H = 160

  const [value, setValue] = useState<string>('')
  const [focused, setFocused] = useState<boolean>(false)
  const [taHeight, setTaHeight] = useState<number>(44)
  const [open, setOpen] = useState(false)

  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const popoverWrapRef = useRef<HTMLDivElement | null>(null)

  // ✅ preview urls (image only)
  const previews = useMemo(() => {
    return files.map(file => ({
      file,
      isImage: file.type.startsWith('image/'),
      url: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
    }))
     
  }, [files.map(f => `${f.name}-${f.size}-${f.lastModified}`).join('|')])

  useEffect(() => {
    return () => {
      previews.forEach(p => p.url && URL.revokeObjectURL(p.url))
    }
  }, [previews])

  useLayoutEffect(() => {
    const el = textareaRef.current
    if (!el) return
    if (!value) {
      el.style.height = `${BASE_H}px`
      setTaHeight(BASE_H)
      return
    }
    el.style.height = '0px'
    const next = clamp(el.scrollHeight, MIN_H, MAX_H)
    el.style.height = `${next}px`
    setTaHeight(next)
  }, [value])

  const canSend = value.trim().length > 0 || files.length > 0
  const expanded = taHeight > 44 || value.includes('\n') || files.length > 0

  const handleSend = () => {
    if (!canSend) return

    const text = value.trim()
    const payload = { text, files: [...files] }

    onSend?.(payload)

    setValue('')
    onClearFiles?.()
  }


  const openFilePicker = (nextAccept?: string) => {
    const input = fileInputRef.current
    if (!input) return
    input.accept = nextAccept ?? accept
    input.multiple = multiple
    input.click()
  }

  const fileNameFromNow = (mime: string) => {
    const ext = mime.split('/')[1] || 'png'
    const ts = new Date()
      .toISOString()
      .replaceAll(':', '')
      .replaceAll('-', '')
      .replace('T', '_')
      .slice(0, 15)
    return `pasted_${ts}.${ext}`
  }

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files ?? [])
    if (picked.length) onFilesChange?.(picked)
    e.target.value = ''
  }

  // popover outside/esc close
  useEffect(() => {
    if (!open) return

    const onDown = (evt: MouseEvent) => {
      const root = popoverWrapRef.current
      if (!root) return
      const target = evt.target as Node
      if (!root.contains(target)) setOpen(false)
    }
    const onKey = (evt: KeyboardEvent) => {
      if (evt.key === 'Escape') setOpen(false)
    }

    window.addEventListener('mousedown', onDown)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div className="mx-auto w-full max-w-screen-md p-6">
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept={accept}
        multiple={multiple}
        onChange={handleFiles}
      />
      <div
        className={[
          'w-full border rounded-[28px]',
          'bg-white/90 backdrop-blur',
          'transition-[box-shadow,border-color,background-color] duration-200 ease-out',
          focused ? 'border-blue-300/70 ring-4 ring-blue-200/40' : 'border-black/10',
          'shadow-[0_18px_40px_-22px_rgba(0,0,0,0.28)]',
        ].join(' ')}
      >
        <div
          className={[
            'overflow-hidden transition-all duration-200 ease-out',
            files.length > 0 ? 'max-h-28 opacity-100' : 'max-h-0 opacity-0 pointer-events-none',
          ].join(' ')}
        >
          <div className="px-3 pt-3">
            <div className="flex gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {previews.map((p, idx) => {
                const ext = p.file.name.split('.').pop()?.toUpperCase() ?? 'FILE'
                return (
                  <div
                    key={`${p.file.name}-${p.file.size}-${p.file.lastModified}-${idx}`}
                    className="group flex shrink-0 items-center gap-2 rounded-2xl border border-black/10 bg-white/95 px-2 py-2"
                  >
                    <div className="h-12 w-12 overflow-hidden rounded-xl bg-black/5">
                      {p.isImage && p.url ? (
                        <img
                          src={p.url}
                          alt={p.file.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-neutral-600">
                          {ext}
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="max-w-[180px] truncate text-sm font-medium text-neutral-900">
                        {p.file.name}
                      </div>
                      <div className="text-xs text-neutral-500">{formatBytes(p.file.size)}</div>
                    </div>

                    {onRemoveFile && (
                      <button
                        type="button"
                        aria-label="Remove file"
                        onClick={() => onRemoveFile(idx)}
                        className="ml-1 inline-flex h-8 w-8 items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-black/5 hover:text-neutral-700"
                      >
                        <XCircle size={18} />
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* ✅ Input row */}
        <div
          className={[
            expanded ? 'flex items-end' : 'flex items-center',
            'gap-2 px-3 py-2',
          ].join(' ')}
        >
          {/* Popover wrap */}
          <div ref={popoverWrapRef} className="relative">
            <button
              type="button"
              aria-label="Add"
              onClick={() => setOpen(v => !v)}
              className="
                inline-flex h-9 w-9 items-center justify-center rounded-full
                text-neutral-600 transition-colors
                hover:bg-blue-50 hover:text-blue-700
              "
            >
              <Plus size={18} />
            </button>

            {open && (
              <div
                className="
                  absolute left-0 top-[44px] z-50 w-56 overflow-hidden rounded-2xl
                  border border-black/10 bg-white/95 shadow-[0_18px_40px_-22px_rgba(0,0,0,0.35)]
                  backdrop-blur
                "
              >
                <div className="p-1">
                  <button
                    type="button"
                    className="w-full rounded-xl px-3 py-2 text-left text-sm text-neutral-800 hover:bg-blue-50"
                    onClick={() => {
                      setOpen(false)
                      openFilePicker('*/*')
                    }}
                  >
                    파일 업로드
                  </button>

                  <button
                    type="button"
                    className="w-full rounded-xl px-3 py-2 text-left text-sm text-neutral-800 hover:bg-blue-50"
                    onClick={() => {
                      setOpen(false)
                      openFilePicker('image/*')
                    }}
                  >
                    이미지 업로드
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* textarea */}
          <div className="flex flex-1 items-center">
            <textarea
              ref={textareaRef}
              value={value}
              onChange={e => setValue(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder={placeholder}
              rows={1}
              className={[
                'w-full resize-none bg-transparent outline-none',
                'text-sm text-neutral-900 placeholder:text-neutral-400',
                'leading-[20px]',
                expanded ? 'py-2' : 'h-9 py-[7px]',
              ].join(' ')}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSend()
                }
              }}
              onPaste={e => {
                const items = Array.from(e.clipboardData?.items ?? [])
                const imageItems = items.filter(it => it.kind === 'file' && it.type.startsWith('image/'))
                if (imageItems.length === 0) return 
                e.preventDefault()
                const picked: File[] = []
                for (const it of imageItems) {
                  const f = it.getAsFile()
                  if (!f) continue

                  const name = f.name && f.name !== 'image.png' ? f.name : fileNameFromNow(f.type)
                  picked.push(new File([f], name, { type: f.type }))
                }

                if (picked.length) onFilesChange?.(picked)
              }}
            />
          </div>

          {useClear && (value.length > 0 || files.length > 0) && (
            <button
              type="button"
              aria-label="Clear"
              onClick={() => {
                setValue('')
                onClearFiles?.()
              }}
              className="
                inline-flex h-9 w-9 items-center justify-center rounded-full
                text-neutral-400 transition-colors
                hover:bg-blue-50 hover:text-blue-700
              "
            >
              <XCircle size={18} />
            </button>
          )}

          {useAudio && (
            <button
              type="button"
              aria-label="Mic"
              className="
                inline-flex h-9 w-9 items-center justify-center rounded-full
                text-neutral-600 transition-colors
                hover:bg-blue-50 hover:text-blue-700
              "
            >
              <Mic size={18} />
            </button>
          )}

          <button
            type="button"
            aria-label="Send"
            onClick={handleSend}
            disabled={!canSend}
            className={[
              'inline-flex h-9 w-9 items-center justify-center rounded-full transition-all',
              canSend ? 'bg-blue-600 text-white hover:bg-blue-500' : 'bg-black/10 text-black/30 cursor-not-allowed',
            ].join(' ')}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default MultiModal