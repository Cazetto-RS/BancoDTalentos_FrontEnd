const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/$/, '')

export interface ApiResponse<T> { sucesso: boolean; mensagem: string; dados: T }

export class ApiError extends Error {
    status: number
    codigo?: string
    constructor(message: string, status: number, codigo?: string) {
        super(message); this.name = 'ApiError'; this.status = status; this.codigo = codigo
    }
}

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
    const token = localStorage.getItem('talentos:token') || sessionStorage.getItem('talentos:token')
    const isFormData = options.body instanceof FormData
    const response = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
            ...(options.body && !isFormData ? { 'Content-Type': 'application/json' } : {}),
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...options.headers,
        },
    })
    const payload = await response.json().catch(() => null)
    if (!response.ok) {
        if (response.status === 401) window.dispatchEvent(new Event('talentos:unauthorized'))
        throw new ApiError(payload?.mensagem || 'Não foi possível concluir a operação.', response.status, payload?.codigo)
    }
    return (payload?.dados ?? payload) as T
}

export type UploadType = 'foto' | 'curriculo' | 'recomendacao' | 'certificado'
export interface UploadedFile {
    caminho: string
    url_temporaria: string
    expira_em_segundos: number
    nome_original: string
    tamanho: number
    tipo: UploadType
}

export async function uploadFile(type: UploadType, file: File, previousPath?: string): Promise<UploadedFile> {
    const body = new FormData()
    body.append('arquivo', file)
    if (previousPath?.startsWith('storage:')) body.append('arquivo_anterior', previousPath)
    return api<UploadedFile>(`/uploads/${type}`, { method: 'POST', body })
}

const signedUrlCache = new Map<string, { url: string; expiresAt: number }>()
export async function resolveUploadedUrl(value?: string | null): Promise<string | undefined> {
    if (!value) return undefined
    if (!value.startsWith('storage:')) return value
    const cached = signedUrlCache.get(value)
    if (cached && cached.expiresAt > Date.now()) return cached.url
    const result = await api<{ url: string; expira_em_segundos: number }>(`/uploads/url?caminho=${encodeURIComponent(value)}`)
    signedUrlCache.set(value, { url: result.url, expiresAt: Date.now() + Math.max(30, result.expira_em_segundos - 30) * 1000 })
    return result.url
}

export const apiUrl = API_URL
