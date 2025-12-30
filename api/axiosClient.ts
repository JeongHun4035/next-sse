import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type AxiosError,
  type AxiosRequestHeaders,
  type InternalAxiosRequestConfig,
} from 'axios'

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080'

const instance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 요청 인터셉터
instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token')

    if (token) {
      const headers = (config.headers ?? {}) as AxiosRequestHeaders
      headers.Authorization = `Bearer ${token}`
      config.headers = headers
    }
  }

  return config
})

// 응답 인터셉터
instance.interceptors.response.use(
  (res: AxiosResponse) => res,
  (error: AxiosError) => {
    const status = error.response?.status ?? 500
    const data = error.response?.data as { message?: string } | undefined

    const message =
      data?.message ??
      error.message ??
      'Axios Error'

    console.error('[AXIOS ERROR]', status, message)

    return Promise.reject({ status, message })
  },
)

export const axiosRequest = {
  get<T>(url: string, config?: AxiosRequestConfig) {
    return instance.get<T>(url, config)
  },
  post<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
    return instance.post<T>(url, data, config)
  },
  put<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
    return instance.put<T>(url, data, config)
  },
  patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
    return instance.patch<T>(url, data, config)
  },
  delete<T>(url: string, config?: AxiosRequestConfig) {
    return instance.delete<T>(url, config)
  },
}
