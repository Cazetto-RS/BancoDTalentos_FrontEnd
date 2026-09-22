import { useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import '../../styles/LoginPage.css'

function LoginPage() {
    const { login, isAuthenticated, user } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    if (isAuthenticated) {
        return <Navigate to={user?.cargo === 'candidato' ? '/perfil' : '/admin/dashboard'} replace />
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setError('')
        setLoading(true)

        const data = new FormData(event.currentTarget)
        try {
            const loggedUser = await login(String(data.get('email')), String(data.get('senha')))
            const requestedPath = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname
            navigate(requestedPath || (loggedUser.cargo === 'candidato' ? '/perfil' : '/admin/dashboard'), { replace: true })
        } catch (reason) {
            setError(reason instanceof Error ? reason.message : 'Não foi possível entrar.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="login-page">
            <section className="login-card" aria-labelledby="login-title">
                <header className="login-card__header">
                    <h1 id="login-title">Entrar</h1>
                    <p>Seja bem-vindo de volta!</p>
                </header>

                <form className="login-form" onSubmit={handleSubmit}>
                    <label className="login-field">
                        <span>E-mail</span>
                        <input
                            type="email"
                            name="email"
                            placeholder="seu@email.com"
                            autoComplete="email"
                            required
                        />
                    </label>

                    <label className="login-field">
                        <span>Senha</span>
                        <input
                            type="password"
                            name="senha"
                            placeholder="Sua senha"
                            autoComplete="current-password"
                            required
                        />
                    </label>

                    <label className="login-remember">
                        <input type="checkbox" name="remember" />
                        <span>Manter conectado</span>
                    </label>

                    {error && <p className="login-error" role="alert">{error}</p>}

                    <button className="login-submit" type="submit" disabled={loading}>
                        {loading ? 'Entrando...' : 'Entrar'}
                    </button>
                </form>

                <p className="login-register">
                    Não tem conta? <Link to="/cadastro">Cadastre-se</Link>
                </p>
            </section>
        </main>
    )
}

export default LoginPage
