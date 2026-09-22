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
    const token = localStorage.getItem('talentos:token')
    const response = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
            ...(options.body ? { 'Content-Type': 'application/json' } : {}),
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

export const apiUrl = API_URL
