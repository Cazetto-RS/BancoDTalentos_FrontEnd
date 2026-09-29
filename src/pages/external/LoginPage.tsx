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
    const [showPassword,setShowPassword]=useState(false)

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
                        <div className="password-field"><input
                            type={showPassword?'text':'password'}
                            name="senha"
                            placeholder="Sua senha"
                            autoComplete="current-password"
                            required
                        /><button type="button" onClick={()=>setShowPassword(v=>!v)} aria-label={showPassword?'Ocultar senha':'Mostrar senha'}>{showPassword? <svg viewBox="0 0 535 468" fill="none" xmlns="http://www.w3.org/2000/svg" style={{marginTop: 7}}>
                            <path d="M483.961 0C488.392 0.000105062 492.642 1.76024 495.775 4.89355C498.909 8.02702 500.669 12.2776 500.669 16.709C500.669 21.1402 498.909 25.3901 495.775 28.5234L61.9004 462.398C60.3489 463.95 58.5067 465.181 56.4795 466.021C54.4525 466.86 52.2799 467.292 50.0859 467.292C47.8917 467.292 45.7186 466.86 43.6914 466.021C41.6642 465.181 39.822 463.95 38.2705 462.398C36.719 460.847 35.4881 459.005 34.6484 456.978C33.8089 454.951 33.377 452.778 33.377 450.584C33.377 448.39 33.8088 446.217 34.6484 444.189C35.4881 442.162 36.719 440.32 38.2705 438.769L472.146 4.89355C475.279 1.76009 479.53 0 483.961 0ZM436.701 122.975C471.913 148.154 502.693 179.013 527.782 214.289C531.854 219.922 534.046 226.696 534.046 233.646C534.046 240.597 531.854 247.371 527.782 253.004C503.452 287.714 412.872 400.521 267.023 400.521C233.315 400.521 202.543 394.514 174.875 384.802L232.013 327.63C242.759 331.635 254.374 333.771 266.422 333.771C321.49 333.771 366.547 288.715 366.547 233.646C366.547 221.565 364.411 209.95 360.439 199.236L436.701 122.975ZM267.023 66.7715C298.408 66.7535 329.568 72.0681 359.172 82.4902L301.699 139.963C290.719 135.791 278.837 133.521 266.422 133.521C211.353 133.522 166.297 178.578 166.297 233.646C166.318 245.688 168.513 257.627 172.772 268.89L97.3447 344.317C49.8859 310.742 19.0141 271.16 6.26465 253.004C2.19256 247.371 8.34075e-05 240.597 0 233.646C0 226.696 2.19252 219.922 6.26465 214.289C30.595 179.579 121.175 66.7715 267.023 66.7715Z"/>
                            </svg>                            
                             :<svg viewBox="0 0 536 334" fill="none" xmlns="http://www.w3.org/2000/svg">
                             <path d="M528.917 147.518C504.553 112.808 413.773 0 267.59 0C121.408 0 30.6279 112.808 6.26418 147.518C2.19202 153.15 0 159.924 0 166.875C0 173.826 2.19202 180.6 6.26418 186.232C30.6279 220.942 121.408 333.75 267.59 333.75C413.773 333.75 504.553 220.942 528.917 186.232C532.989 180.6 535.181 173.826 535.181 166.875C535.181 159.924 532.989 153.15 528.917 147.518ZM267.59 267C212.522 267 167.465 221.944 167.465 166.875C167.465 111.806 212.522 66.75 267.59 66.75C322.659 66.75 367.715 111.806 367.715 166.875C367.715 221.944 322.659 267 267.59 267Z"/>
                             </svg> }</button></div>
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
