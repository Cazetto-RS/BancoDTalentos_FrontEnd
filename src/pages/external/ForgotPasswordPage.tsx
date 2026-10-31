import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { PasswordVisibilityIcon } from '../../components/common/InterfaceIcons'
import { api } from '../../services/api'
import '../../styles/LoginPage.css'

type Step = 'email' | 'reset' | 'done'

export default function ForgotPasswordPage() {
    const [step, setStep] = useState<Step>('email')
    const [email, setEmail] = useState('')
    const [codigo, setCodigo] = useState('')
    const [senha, setSenha] = useState('')
    const [confirmacao, setConfirmacao] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const requestCode = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault(); setError(''); setLoading(true)
        try { await api('/usuarios/esqueci-senha', { method: 'POST', body: JSON.stringify({ email }) }); setStep('reset') }
        catch (reason) { setError(reason instanceof Error ? reason.message : 'Não foi possível enviar o código.') }
        finally { setLoading(false) }
    }

    const resetPassword = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault(); setError('')
        if (!/^\d{6}$/.test(codigo)) return setError('Digite o código de 6 dígitos.')
        if (senha.length < 8) return setError('A senha precisa ter pelo menos 8 caracteres.')
        if (senha !== confirmacao) return setError('As senhas não coincidem.')
        setLoading(true)
        try { await api('/usuarios/redefinir-senha', { method: 'POST', body: JSON.stringify({ email, codigo, nova_senha: senha }) }); setStep('done') }
        catch (reason) { setError(reason instanceof Error ? reason.message : 'Não foi possível alterar a senha.') }
        finally { setLoading(false) }
    }

    return <main className="login-page"><section className="login-card" aria-labelledby="recovery-title">
        {step === 'email' && <><header className="login-card__header"><h1 id="recovery-title">Recuperar senha</h1><p>Informe seu e-mail para receber um código de segurança.</p></header><form className="login-form" onSubmit={requestCode}><label className="login-field"><span>E-mail</span><input type="email" value={email} onChange={event => setEmail(event.target.value)} autoComplete="email" placeholder="seu@email.com" required /></label>{error && <p className="login-error" role="alert">{error}</p>}<button className="login-submit" disabled={loading}>{loading ? 'Enviando...' : 'Enviar código'}</button></form></>}
        {step === 'reset' && <><header className="login-card__header"><h1 id="recovery-title">Crie uma nova senha</h1><p>Se o e-mail existir, o código chegará em alguns instantes. Confira também o spam.</p></header><form className="login-form" onSubmit={resetPassword}><label className="login-field"><span>Código</span><input className="recovery-code" value={codigo} onChange={event => setCodigo(event.target.value.replace(/\D/g, '').slice(0, 6))} inputMode="numeric" autoComplete="one-time-code" placeholder="000000" required /></label><label className="login-field"><span>Nova senha</span><div className="password-field"><input type={showPassword ? 'text' : 'password'} value={senha} onChange={event => setSenha(event.target.value)} autoComplete="new-password" minLength={8} required /><button type="button" onClick={() => setShowPassword(value => !value)} aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}><PasswordVisibilityIcon visible={showPassword} /></button></div></label><label className="login-field"><span>Confirmar nova senha</span><div className="password-field"><input type={showPassword ? 'text' : 'password'} value={confirmacao} onChange={event => setConfirmacao(event.target.value)} autoComplete="new-password" minLength={8} required /><button type="button" onClick={() => setShowPassword(value => !value)} aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}><PasswordVisibilityIcon visible={showPassword} /></button></div></label>{error && <p className="login-error" role="alert">{error}</p>}<button className="login-submit" disabled={loading}>{loading ? 'Alterando...' : 'Alterar senha'}</button><button className="login-link-button" type="button" disabled={loading} onClick={() => void api('/usuarios/esqueci-senha', { method: 'POST', body: JSON.stringify({ email }) })}>Reenviar código</button></form></>}
        {step === 'done' && <div className="recovery-success"><h1 id="recovery-title">Senha alterada</h1><p>Sua nova senha já pode ser usada. As sessões anteriores foram encerradas por segurança.</p><Link className="login-submit login-submit--link" to="/login">Voltar para o login</Link></div>}
        {step !== 'done' && <p className="login-register"><Link to="/login">Voltar para o login</Link></p>}
    </section></main>
}
