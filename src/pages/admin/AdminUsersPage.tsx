import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { api } from '../../services/api'
import '../../styles/AdminUsersPage.css'
import DeleteAccountModal from '../../components/common/DeleteAccountModal'
import { PasswordVisibilityIcon } from '../../components/common/InterfaceIcons'

interface StaffUser { id: number; nome_completo: string; email: string; cargo: 'admin' | 'rh' | 'candidato'; criado_em: string }
interface StaffCreationResponse { email?: string; verificacao_pendente?: boolean; requer_verificacao?: boolean }

// A API atual cria contas de equipe imediatamente. A etapa pendente só é exibida
// se uma futura versão da API declarar explicitamente que exige verificação.
export default function AdminUsersPage({ embedded = false }: { embedded?: boolean }) {
    const [users, setUsers] = useState<StaffUser[]>([])
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [saving, setSaving] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [deleting, setDeleting] = useState<StaffUser | null>(null)
    const [pendingEmail, setPendingEmail] = useState<string | null>(null)
    const [verificationCode, setVerificationCode] = useState('')
    const [verifying, setVerifying] = useState(false)
    const [resendSeconds, setResendSeconds] = useState(0)
    const [resending, setResending] = useState(false)
    const load = () => api<StaffUser[]>('/usuarios').then(rows => setUsers(rows.filter(item => item.cargo !== 'candidato')))

    useEffect(() => { load().catch(reason => setError(reason instanceof Error ? reason.message : 'Não foi possível carregar os usuários.')) }, [])
    useEffect(() => {
        if (!pendingEmail || resendSeconds <= 0) return
        const timeout = window.setTimeout(() => setResendSeconds(current => Math.max(0, current - 1)), 1000)
        return () => window.clearTimeout(timeout)
    }, [pendingEmail, resendSeconds])

    const submit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        // currentTarget deixa de ser confiável após await: capturar antes.
        const formElement = event.currentTarget
        const form = new FormData(formElement)
        const email = String(form.get('email') || '').trim()
        setSaving(true)
        setError('')
        setSuccess('')
        try {
            const response = await api<StaffCreationResponse>('/usuarios/admin/criar-usuario', {
                method: 'POST', body: JSON.stringify(Object.fromEntries(form)),
            })
            formElement.reset()
            setShowPassword(false)
            load().catch(() => setError('Usuário processado, mas não foi possível atualizar a lista da equipe.'))
            if (response?.verificacao_pendente === true || response?.requer_verificacao === true) {
                setPendingEmail(response.email || email)
                setVerificationCode('')
                setResendSeconds(60)
                setSuccess('Um código de confirmação foi solicitado para o e-mail informado.')
            } else {
                // Não afirmar que houve verificação: API atual não implementa esse fluxo.
                setSuccess('Usuário criado. A API atual ainda não exige confirmação de e-mail para contas RH/Admin.')
            }
        } catch (reason) {
            setError(reason instanceof Error ? reason.message : 'Não foi possível criar o usuário.')
        } finally { setSaving(false) }
    }

    const confirmEmail = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (!pendingEmail || !/^\d{6}$/.test(verificationCode)) return
        setVerifying(true)
        setError('')
        setSuccess('')
        try {
            // A API deve aceitar também contas RH/Admin pendentes para habilitar este fluxo.
            await api('/usuarios/verificar-email', {
                method: 'POST', body: JSON.stringify({ email: pendingEmail, codigo: verificationCode }),
            })
            setPendingEmail(null)
            setVerificationCode('')
            setResendSeconds(0)
            setSuccess('E-mail confirmado e conta ativada com sucesso.')
            await load()
        } catch (reason) {
            setError(reason instanceof Error ? reason.message : 'Não foi possível confirmar o código.')
        } finally { setVerifying(false) }
    }

    const resendCode = async () => {
        if (!pendingEmail || resendSeconds > 0 || resending) return
        setResending(true)
        setError('')
        setSuccess('')
        try {
            await api('/usuarios/reenviar-codigo', {
                method: 'POST', body: JSON.stringify({ email: pendingEmail }),
            })
            setResendSeconds(60)
            setSuccess('Solicitação de reenvio realizada. Confira seu e-mail.')
        } catch (reason) {
            setError(reason instanceof Error ? reason.message : 'Não foi possível reenviar o código.')
        } finally { setResending(false) }
    }

    return <section className={`admin-users-page${embedded ? ' is-embedded' : ''}`}>
        {!embedded && <header><h1>Usuários</h1><p>Crie e consulte contas administrativas e de Recursos Humanos.</p></header>}
        <div className="admin-users-grid">
            {pendingEmail ? (
                <form className="admin-users-card admin-users-verification" onSubmit={confirmEmail}>
                    <h2>Confirmar e-mail da equipe</h2>
                    <p>Informe o código de seis dígitos enviado para <strong>{pendingEmail}</strong>.</p>
                    <label><span>Código de verificação</span><input name="codigo" type="text" value={verificationCode}
                        onChange={event => setVerificationCode(event.target.value.replace(/\D/g, '').slice(0, 6))}
                        placeholder="000000" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} required /></label>
                    {error && <p className="admin-users-message is-error" role="alert">{error}</p>}
                    {success && <p className="admin-users-message is-success" role="status">{success}</p>}
                    <button type="submit" disabled={verifying || verificationCode.length !== 6}>
                        {verifying ? 'Verificando...' : 'Confirmar código'}
                    </button>
                    <button className="admin-users-secondary" type="button" onClick={() => void resendCode()} disabled={resending || resendSeconds > 0}>
                        {resending ? 'Reenviando...' : resendSeconds > 0 ? `Reenviar código em ${resendSeconds}s` : 'Reenviar código'}
                    </button>
                    <button className="admin-users-secondary" type="button" onClick={() => { setPendingEmail(null); setVerificationCode(''); setError(''); setSuccess('') }}>
                        Voltar ao cadastro
                    </button>
                </form>
            ) : (
                <form className="admin-users-card" onSubmit={submit}>
                    <h2>Novo usuário</h2>
                    <label><span>Nome completo</span><input name="nome_completo" required maxLength={120} /></label>
                    <label><span>E-mail</span><input name="email" type="email" required maxLength={120} /></label>
                    <label><span>Senha temporária</span><div className="admin-password-field"><input name="senha" type={showPassword ? 'text' : 'password'} required minLength={8} maxLength={72} autoComplete="new-password" /><button type="button" onClick={() => setShowPassword(value => !value)} aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}><PasswordVisibilityIcon visible={showPassword} /></button></div></label>
                    <label><span>Tipo de acesso</span><select name="cargo" defaultValue="rh"><option value="rh">Recursos Humanos</option><option value="admin">Administrador</option></select></label>
                    {error && <p className="admin-users-message is-error" role="alert">{error}</p>}
                    {success && <p className="admin-users-message is-success" role="status">{success}</p>}
                    <button type="submit" disabled={saving}>{saving ? 'Criando...' : 'Criar usuário'}</button>
                </form>
            )}
            <div className="admin-users-card"><h2>Equipe cadastrada</h2><div className="admin-users-list">
                {users.map(item => <article key={item.id}><div><strong>{item.nome_completo}</strong><span>{item.email}</span></div><small>{item.cargo === 'admin' ? 'Administrador' : 'RH'}</small><button className="admin-user-delete" type="button" onClick={() => setDeleting(item)}>Excluir</button></article>)}
                {!users.length && <p>Nenhum funcionário encontrado.</p>}
            </div></div>
        </div>
        {deleting && <DeleteAccountModal targetId={deleting.id} onClose={() => setDeleting(null)} onDone={() => void load()} />}
    </section>
}
