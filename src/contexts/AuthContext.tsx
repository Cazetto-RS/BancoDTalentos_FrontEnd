/* oxlint-disable react/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react'
import { api } from '../services/api'

export type UserRole = 'candidato' | 'rh' | 'admin'
export interface AuthUser { id: number; nome_completo: string; email: string; cargo: UserRole }
interface AuthContextValue {
    user: AuthUser | null; token: string | null; isAuthenticated: boolean
    login: (email: string, senha: string) => Promise<AuthUser>; logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)
const TOKEN_KEY = 'talentos:token'; const USER_KEY = 'talentos:user'

function readUser(): AuthUser | null {
    try { return JSON.parse(localStorage.getItem(USER_KEY) || 'null') } catch { return null }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))
    const [user, setUser] = useState<AuthUser | null>(readUser)

    const clear = () => { localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(USER_KEY); setToken(null); setUser(null) }

    useEffect(() => {
        const unauthorized = () => clear()
        window.addEventListener('talentos:unauthorized', unauthorized)
        return () => window.removeEventListener('talentos:unauthorized', unauthorized)
    }, [])

    const login = async (email: string, senha: string) => {
        const result = await api<{ token: string; usuario: AuthUser }>('/usuarios/login', { method: 'POST', body: JSON.stringify({ email, senha }) })
        localStorage.setItem(TOKEN_KEY, result.token); localStorage.setItem(USER_KEY, JSON.stringify(result.usuario))
        setToken(result.token); setUser(result.usuario); return result.usuario
    }

    const logout = async () => { try { if (token) await api('/usuarios/logout', { method: 'POST' }) } finally { clear() } }
    const value = { user, token, isAuthenticated: Boolean(user && token), login, logout }
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
    const value = useContext(AuthContext)
    if (!value) throw new Error('useAuth deve ser usado dentro de AuthProvider.')
    return value
}
