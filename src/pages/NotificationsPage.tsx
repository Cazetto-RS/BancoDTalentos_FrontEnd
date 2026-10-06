import { useEffect, useMemo, useState } from 'react'
import { api } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import '../styles/NotificationsPage.css'
import ConfirmModal from '../components/common/ConfirmModal'

interface Notice { id:number; tipo:string; titulo:string; mensagem:string; lida:boolean; criado_em:string; dados?:{autor_nome?:string;autor_email?:string} }

export default function NotificationsPage(){
 const{user}=useAuth(),[items,setItems]=useState<Notice[]>([]),[page,setPage]=useState(1),[filter,setFilter]=useState<'todas'|'nao_lidas'>('todas'),[mobile,setMobile]=useState(()=>matchMedia('(max-width:600px)').matches),[loading,setLoading]=useState(true),[confirmClear,setConfirmClear]=useState(false),[error,setError]=useState('')
 useEffect(()=>{api<Notice[]>('/notificacoes').then(setItems).finally(()=>setLoading(false));const media=matchMedia('(max-width:600px)');const update=(event:MediaQueryListEvent)=>{setMobile(event.matches);setPage(1)};media.addEventListener('change',update);return()=>media.removeEventListener('change',update)},[])
 const filtered=items.filter(item=>filter==='todas'||!item.lida),pageSize=mobile?10:20,totalPages=Math.max(1,Math.ceil(filtered.length/pageSize)),visible=useMemo(()=>filtered.slice((page-1)*pageSize,page*pageSize),[filtered,page,pageSize]),unread=items.filter(item=>!item.lida).length
 const read=async(item:Notice)=>{if(item.lida)return;await api(`/notificacoes/${item.id}/ler`,{method:'PUT'});setItems(current=>current.map(notice=>notice.id===item.id?{...notice,lida:true}:notice))}
 const readAll=async()=>{await api('/notificacoes/ler-todas',{method:'PUT'});setItems(current=>current.map(notice=>({...notice,lida:true})))}
 const clearAll=async()=>{try{setError('');await api('/notificacoes',{method:'DELETE'});setItems([]);setPage(1);setConfirmClear(false)}catch(reason){setError(reason instanceof Error?reason.message:'Não foi possível apagar as notificações.');setConfirmClear(false)}}
 return <main className="notifications-page">
  <header className="notifications-header"><div><h1>Notificações</h1><p>{unread?`${unread} ${unread===1?'notificação não lida':'notificações não lidas'}`:'Você está em dia com as notificações'}</p></div><div className="notifications-header__actions">{unread>0&&<button type="button" onClick={()=>void readAll()}>Marcar todas como lidas</button>}{items.length>0&&<button className="is-danger" type="button" onClick={()=>setConfirmClear(true)}>Apagar todas</button>}</div></header>
  {error&&<p className="notifications-error" role="alert">{error}</p>}
  <div className="notifications-toolbar"><button className={filter==='todas'?'is-active':''} type="button" onClick={()=>{setFilter('todas');setPage(1)}}>Todas <span>{items.length}</span></button><button className={filter==='nao_lidas'?'is-active':''} type="button" onClick={()=>{setFilter('nao_lidas');setPage(1)}}>Não lidas <span>{unread}</span></button></div>
  <section className="notifications-list">{loading&&<div className="notifications-empty">Carregando notificações...</div>}{!loading&&visible.map(item=><button className={`notification-item${item.lida?'':' is-unread'}`} type="button" key={item.id} onClick={()=>void read(item)}><span className="notification-item__marker" aria-hidden="true"/><div><header><h2>{item.titulo}</h2>{!item.lida&&<span>Não lida</span>}</header><p>{item.mensagem}</p>{user?.cargo==='admin'&&<strong>Responsável: {item.dados?.autor_nome||item.dados?.autor_email||'sistema'}</strong>}</div><time dateTime={item.criado_em}>{new Date(item.criado_em).toLocaleString('pt-BR')}</time></button>)}{!loading&&!visible.length&&<div className="notifications-empty"><strong>Nenhuma notificação</strong><p>Não há itens para exibir neste filtro.</p></div>}</section>
  {totalPages>1&&<nav className="notifications-pagination" aria-label="Páginas de notificações"><button type="button" onClick={()=>setPage(current=>Math.max(1,current-1))} disabled={page===1}>Anterior</button><span>{page} de {totalPages}</span><button type="button" onClick={()=>setPage(current=>Math.min(totalPages,current+1))} disabled={page===totalPages}>Próxima</button></nav>}
  <ConfirmModal isOpen={confirmClear} title="Apagar todas as notificações?" message="Todas as notificações da sua conta serão removidas permanentemente. Esta ação não pode ser desfeita." confirmText="Apagar todas" onConfirm={()=>void clearAll()} onClose={()=>setConfirmClear(false)}/>
 </main>
}
