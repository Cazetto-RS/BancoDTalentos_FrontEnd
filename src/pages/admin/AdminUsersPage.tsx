import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { api } from '../../services/api'
import '../../styles/AdminUsersPage.css'
import DeleteAccountModal from '../../components/common/DeleteAccountModal'

interface StaffUser { id:number; nome_completo:string; email:string; cargo:'admin'|'rh'|'candidato'; criado_em:string }

export default function AdminUsersPage({ embedded = false }: { embedded?: boolean }) {
    const [users, setUsers] = useState<StaffUser[]>([])
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [saving, setSaving] = useState(false)
    const [showPassword,setShowPassword]=useState(false)
    const [deleting,setDeleting]=useState<StaffUser|null>(null)
    const load = () => api<StaffUser[]>('/usuarios').then((rows) => setUsers(rows.filter((item) => item.cargo !== 'candidato')))
    useEffect(() => { load().catch((reason) => setError(reason instanceof Error ? reason.message : 'Não foi possível carregar os usuários.')) }, [])

    const submit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault(); setSaving(true); setError(''); setSuccess('')
        const form = new FormData(event.currentTarget)
        try {
            await api('/usuarios/admin/criar-usuario', { method:'POST', body:JSON.stringify(Object.fromEntries(form)) })
            event.currentTarget.reset(); setSuccess('Usuário criado com sucesso.'); await load()
        } catch (reason) { setError(reason instanceof Error ? reason.message : 'Não foi possível criar o usuário.') }
        finally { setSaving(false) }
    }

    return <section className={`admin-users-page${embedded ? ' is-embedded' : ''}`}>
        {!embedded && <header><h1>Usuários</h1><p>Crie e consulte contas administrativas e de Recursos Humanos.</p></header>}
        <div className="admin-users-grid">
            <form className="admin-users-card" onSubmit={submit}>
                <h2>Novo usuário</h2>
                <label><span>Nome completo</span><input name="nome_completo" required maxLength={120}/></label>
                <label><span>E-mail</span><input name="email" type="email" required maxLength={120}/></label>
                <label><span>Senha temporária</span><div className="admin-password-field"><input name="senha" type={showPassword?'text':'password'} required minLength={8} maxLength={72}/><button type="button" onClick={()=>setShowPassword(v=>!v)} aria-label={showPassword?'Ocultar senha':'Mostrar senha'}>{showPassword?'🙈':'👁'}</button></div></label>
                <label><span>Tipo de acesso</span><select name="cargo" defaultValue="rh"><option value="rh">Recursos Humanos</option><option value="admin">Administrador</option></select></label>
                {error && <p className="admin-users-message is-error" role="alert">{error}</p>}
                {success && <p className="admin-users-message is-success" role="status">{success}</p>}
                <button type="submit" disabled={saving}>{saving ? 'Criando...' : 'Criar usuário'}</button>
            </form>
            <div className="admin-users-card"><h2>Equipe cadastrada</h2><div className="admin-users-list">
                {users.map((item) => <article key={item.id}><div><strong>{item.nome_completo}</strong><span>{item.email}</span></div><small>{item.cargo === 'admin' ? 'Administrador' : 'RH'}</small><button className="admin-user-delete" type="button" onClick={()=>setDeleting(item)}>Excluir</button></article>)}
                {!users.length && <p>Nenhum funcionário encontrado.</p>}
            </div></div>
        </div>{deleting&&<DeleteAccountModal targetId={deleting.id} onClose={()=>setDeleting(null)} onDone={()=>void load()}/>} 
    </section>
}
