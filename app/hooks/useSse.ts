'use client'

import { useCallback } from 'react'

import { fetchRequest } from '@/api/fetchClient'

type SseTriggerMethod = 'GET' | 'POST'

type SseTriggerArgs<TBody = unknown> = {
  method: SseTriggerMethod
  path: string

  /** GET일 때 query로 붙일 것들 (clientId, text 포함 아무거나) */
  params?: Record<string, string | number | boolean | null | undefined>

  /** POST일 때 body로 보낼 것들 (clientId, text 포함 아무거나) */
  body?: TBody
}

const toQuery = (params?: SseTriggerArgs['params']) => {
  if (!params) return ''
  const usp = new URLSearchParams()
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null) continue
    usp.set(k, String(v))
  }
  const qs = usp.toString()
  return qs ? `?${qs}` : ''
}

export function useSSE() {
  const sse = useCallback(async <TRes = any, TBody = unknown>(args: SseTriggerArgs<TBody>) => {
    const { method, path, params, body } = args
    const url = `${path}${toQuery(params)}`

    if (method === 'GET') {
      return fetchRequest.get<TRes>(url)
    }
    return fetchRequest.post<TRes>(url, body)
  }, [])

  return { sse }
}
