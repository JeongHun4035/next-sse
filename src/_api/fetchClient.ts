const API_BASE_URL = ''

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

interface RequestOptions extends Omit<RequestInit, 'method' | 'body'> {
  body?: unknown
}

// 공통 fetch 함수
async function send<T>(
  method: HttpMethod,
  url: string,
  options: RequestOptions = {},
): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers ?? {}),
  }

  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token')
    if (token) {
      ;(headers as Record<string, string>).Authorization = `Bearer ${token}`
    }
  }

  const res = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    method,
    headers,
    body:
      options.body !== undefined
        ? JSON.stringify(options.body)
        : undefined,
  })

  if (!res.ok) {
    const errorBody = await res
      .json()
      .catch(() => ({ message: 'Fetch Error' }))

    const status = res.status
    const message =
      (errorBody).message ??
      `Fetch Error (status: ${status})`

    console.error('[FETCH ERROR]', status, message)

    throw { status, message }
  }

  if (res.status === 204) {
    return undefined as T
  }

  return (await res.json()) as T
}

export const fetchRequest = {
  get<T>(url: string, options?: RequestOptions) {
    return send<T>('GET', url, options)
  },
  post<T>(url: string, body?: unknown, options?: RequestOptions) {
    return send<T>('POST', url, { ...options, body })
  },
  put<T>(url: string, body?: unknown, options?: RequestOptions) {
    return send<T>('PUT', url, { ...options, body })
  },
  patch<T>(url: string, body?: unknown, options?: RequestOptions) {
    return send<T>('PATCH', url, { ...options, body })
  },
  delete<T>(url: string, options?: RequestOptions) {
    return send<T>('DELETE', url, options)
  },
}
