import { useState } from 'react'
import type { FormEvent } from 'react'
import { createPortal } from 'react-dom'
import { api } from '../../services/api'
import { useAuth } from '../../contexts/AuthContext'
import '../../styles/ProfileEditModal.css'

interface Props { profile:Record<string,any>; culture:Record<string,any>; onClose:()=>void; onSaved:(profile:Record<string,any>,culture:Record<string,any>)=>void }

export default function ProfileEditModal({ profile, culture, onClose, onSaved }:Props) {
    const { user, updateUser } = useAuth()
    const [form, setForm] = useState<Record<string, any>>({ ...profile, nome_completo:user?.nome_completo || '', email:user?.email || '', motivacao:culture.motivacao || '', apresentacao:culture.apresentacao || '', descricao_valores:culture.descricao_valores || '' })
    const [loadingCep,setLoadingCep]=useState(false), [saving,setSaving]=useState(false), [error,setError]=useState('')
    const change=(key:string,value:string)=>setForm((current)=>({...current,[key]:value}))
    const lookupCep=async(value:string)=>{
        const cep=value.replace(/\D/g,''); change('cep',cep); if(cep.length!==8)return
        setLoadingCep(true); setError('')
        try{const response=await fetch(`https://viacep.com.br/ws/${cep}/json/`); if(!response.ok)throw new Error(); const data=await response.json(); if(data.erro)throw new Error(); setForm((current)=>({...current,cep,logradouro:data.logradouro||'',bairro:data.bairro||'',cidade:data.localidade||'',estado:data.uf||''}))}
        catch{setError('CEP não encontrado. Confira os números ou preencha o endereço manualmente.')}
        finally{setLoadingCep(false)}
    }
    const submit=async(event:FormEvent)=>{event.preventDefault();setSaving(true);setError('')
        try{
            const base={telefone:form.telefone||null,cep:form.cep||null,numero_rua:form.numero_rua||null,logradouro:form.logradouro||null,bairro:form.bairro||null,cidade:form.cidade||null,estado:form.estado||null,data_nascimento:form.data_nascimento?.slice(0,10)||null,linkedin_url:form.linkedin_url||null,portfolio_url:form.portfolio_url||null,curriculo_url:form.curriculo_url||null,cargo_desejado:form.cargo_desejado||null,url_foto:form.url_foto||null}
            const [savedProfile,savedCulture,savedUser]=await Promise.all([
                api<Record<string,any>>('/candidatos/perfil-base',{method:'POST',body:JSON.stringify(base)}),
                api<Record<string,any>>('/candidatos/cultura',{method:'POST',body:JSON.stringify({motivacao:form.motivacao||null,apresentacao:form.apresentacao||null,descricao_valores:form.descricao_valores||null})}),
                api<Record<string,any>>(`/usuarios/atualizar/${user!.id}`,{method:'PUT',body:JSON.stringify({nome_completo:form.nome_completo,email:form.email})})
            ])
            updateUser(savedUser); onSaved(savedProfile,savedCulture); onClose()
        }catch(reason){setError(reason instanceof Error?reason.message:'Não foi possível salvar o perfil.')}finally{setSaving(false)}
    }
    return createPortal(<div className="profile-edit-overlay" onMouseDown={(e)=>e.target===e.currentTarget&&onClose()}><div className="profile-edit-modal" role="dialog" aria-modal="true"><header><div><span>MEU PERFIL</span><h2>Editar informações</h2></div><button type="button" onClick={onClose} aria-label="Fechar">×</button></header><form onSubmit={submit}><div className="profile-edit-grid">
        <label><span>Nome completo</span><input value={form.nome_completo} onChange={e=>change('nome_completo',e.target.value)} required/></label><label><span>E-mail</span><input type="email" value={form.email} onChange={e=>change('email',e.target.value)} required/></label>
        <label><span>Telefone</span><input value={form.telefone||''} onChange={e=>change('telefone',e.target.value)}/></label><label><span>Data de nascimento</span><input type="date" value={form.data_nascimento?.slice(0,10)||''} onChange={e=>change('data_nascimento',e.target.value)}/></label>
        <label><span>CEP {loadingCep&&'— buscando...'}</span><input value={form.cep||''} onChange={e=>void lookupCep(e.target.value)} inputMode="numeric" maxLength={8}/></label><label><span>Número</span><input value={form.numero_rua||''} onChange={e=>change('numero_rua',e.target.value)}/></label>
        <label className="wide"><span>Rua</span><input value={form.logradouro||''} onChange={e=>change('logradouro',e.target.value)}/></label><label><span>Bairro</span><input value={form.bairro||''} onChange={e=>change('bairro',e.target.value)}/></label><label><span>Cidade</span><input value={form.cidade||''} onChange={e=>change('cidade',e.target.value)}/></label><label><span>UF</span><input value={form.estado||''} onChange={e=>change('estado',e.target.value.toUpperCase())} maxLength={2}/></label>
        <label><span>Cargo desejado</span><input value={form.cargo_desejado||''} onChange={e=>change('cargo_desejado',e.target.value)}/></label><label><span>LinkedIn</span><input type="url" value={form.linkedin_url||''} onChange={e=>change('linkedin_url',e.target.value)}/></label><label className="wide"><span>Portfólio</span><input type="url" value={form.portfolio_url||''} onChange={e=>change('portfolio_url',e.target.value)}/></label>
        <label className="wide"><span>Apresentação</span><textarea value={form.apresentacao} onChange={e=>change('apresentacao',e.target.value)}/></label><label className="wide"><span>Motivação</span><textarea value={form.motivacao} onChange={e=>change('motivacao',e.target.value)}/></label>
    </div>{error&&<p className="profile-edit-error" role="alert">{error}</p>}<footer><button type="button" onClick={onClose}>Cancelar</button><button className="primary" type="submit" disabled={saving||loadingCep}>{saving?'Salvando...':'Salvar perfil'}</button></footer></form></div></div>,document.body)
}
