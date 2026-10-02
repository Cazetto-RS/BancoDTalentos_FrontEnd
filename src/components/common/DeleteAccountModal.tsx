import { useState } from 'react'
import { createPortal } from 'react-dom'
import { api } from '../../services/api'
import '../../styles/DeleteAccountModal.css'

export default function DeleteAccountModal({targetId,onClose,onDone}:{targetId?:number;onClose:()=>void;onDone?:()=>void}){
 const [password,setPassword]=useState(''),[show,setShow]=useState(false),[error,setError]=useState(''),[saving,setSaving]=useState(false)
 const submit=async(e:React.FormEvent)=>{e.preventDefault();setSaving(true);setError('');try{await api(targetId?`/usuarios/admin/solicitar-exclusao/${targetId}`:'/usuarios/solicitar-exclusao',{method:'POST',body:JSON.stringify({senha:password})});onDone?.();onClose()}catch(reason){setError(reason instanceof Error?reason.message:'Não foi possível agendar a exclusão.')}finally{setSaving(false)}}
 return createPortal(<div className="delete-account-overlay" onMouseDown={e=>{if(e.target===e.currentTarget)onClose()}}><form className="delete-account-modal" role="dialog" aria-modal="true" onSubmit={submit}><h2>Excluir conta?</h2><p>A conta será desativada imediatamente e excluída definitivamente após <strong>7 dias</strong>. Durante esse período ela não poderá ser acessada.</p><label>Confirme com sua senha<div><input type={show?'text':'password'} value={password} onChange={e=>setPassword(e.target.value)} required/><button type="button" onClick={()=>setShow(v=>!v)}>{show?'🙈':'👁'}</button></div></label>{error&&<p className="is-error">{error}</p>}<footer><button type="button" onClick={onClose}>Voltar</button><button className="danger" type="submit" disabled={saving}>{saving?'Agendando...':'Desativar e excluir em 7 dias'}</button></footer></form></div>,document.body)
}
