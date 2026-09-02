import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import '../../styles/LoginPage.css'

function LoginPage() {
    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
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
                            name="password"
                            placeholder="Sua senha"
                            autoComplete="current-password"
                            required
                        />
                    </label>

                    <label className="login-remember">
                        <input type="checkbox" name="remember" />
                        <span>Manter conectado</span>
                    </label>

                    <button className="login-submit" type="submit">Entrar</button>
                </form>

                <p className="login-register">
                    Não tem conta? <Link to="/cadastro">Cadastre-se</Link>
                </p>
            </section>
        </main>
    )
}

export default LoginPage
