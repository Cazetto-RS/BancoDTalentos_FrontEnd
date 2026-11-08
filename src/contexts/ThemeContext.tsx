import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

export type Theme = 'light' | 'dark'
const STORAGE_KEY = 'talentos:theme'
const LEGACY_KEY = 'admin-theme'

function initialTheme(): Theme {
    try {
        const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_KEY)
        if (saved === 'light' || saved === 'dark') return saved
    } catch { /* Armazenamento indisponível: usar preferência do sistema. */ }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const ThemeContext = createContext<{ theme: Theme; setTheme: (theme: Theme) => void } | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setTheme] = useState<Theme>(initialTheme)
    useEffect(() => {
        document.documentElement.dataset.theme = theme
        document.documentElement.style.colorScheme = theme
        try { localStorage.setItem(STORAGE_KEY, theme); localStorage.setItem(LEGACY_KEY, theme) } catch { /* Navegação privada */ }
    }, [theme])
    useEffect(() => {
        const handleStorage = (event: StorageEvent) => {
            if ((event.key === STORAGE_KEY || event.key === LEGACY_KEY) && (event.newValue === 'light' || event.newValue === 'dark')) setTheme(event.newValue)
        }
        window.addEventListener('storage', handleStorage)
        return () => window.removeEventListener('storage', handleStorage)
    }, [])
    return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
    const value = useContext(ThemeContext)
    if (!value) throw new Error('useTheme fora do ThemeProvider')
    return value
}
