import { useEffect, useRef, useState } from 'react'
import { api } from '../../services/api'
import { useAuth } from '../../contexts/AuthContext'
import '../../styles/NotificationCenter.css'

interface AppNotification { id:number; tipo:string; titulo:string; mensagem:string; lida:boolean; criado_em:string; dados?:{autor_nome?:string;autor_email?:string} }
const preferenceAllows = (type:string) => {
    try { const p=JSON.parse(localStorage.getItem('admin-preferences')||'{}'); if(type==='nova_candidatura')return p.newCandidateAlerts!==false; if(type==='status_candidatura')return p.statusUpdates!==false; if(type==='alerta_vaga')return p.vacancyAlerts!==false; if(type==='resumo_semanal')return p.weeklySummary===true; return true } catch{return type!=='resumo_semanal'}
}

export default function NotificationCenter(){
    const { isAuthenticated,user }=useAuth(), [items,setItems]=useState<AppNotification[]>([]), [open,setOpen]=useState(false), [selected,setSelected]=useState<number|null>(null)
    const seen=useRef(new Set<number>())
    useEffect(()=>{if(!isAuthenticated)return
        const load=()=>api<AppNotification[]>('/notificacoes').then((rows)=>{for(const item of rows){if(!item.lida&&!seen.current.has(item.id)&&preferenceAllows(item.tipo)&&'Notification'in window&&Notification.permission==='granted')new Notification(item.titulo,{body:item.mensagem});seen.current.add(item.id)}setItems(rows)}).catch(()=>undefined)
        void load();const timer=window.setInterval(load,30000);return()=>window.clearInterval(timer)
    },[isAuthenticated])
    if(!isAuthenticated)return null
    const visibleItems=items.filter(item=>preferenceAllows(item.tipo))
    const unread=visibleItems.filter(item=>!item.lida).length
    const markRead=async(item:AppNotification)=>{setSelected(current=>current===item.id?null:item.id);if(!item.lida){await api(`/notificacoes/${item.id}/ler`,{method:'PUT'});setItems(current=>current.map(n=>n.id===item.id?{...n,lida:true}:n))}}
    const markAll=async()=>{await api('/notificacoes/ler-todas',{method:'PUT'});setItems(current=>current.map(n=>({...n,lida:true})))}
    return <div className="notification-center"><button className="notification-center__bell" type="button" onClick={()=>setOpen(v=>!v)} aria-label={`${unread} notificações não lidas`}><svg viewBox="0 0 358 398" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M178.875 397.5C191.184 397.516 203.191 393.696 213.229 386.572C223.266 379.448 230.835 369.374 234.883 357.75H122.867C126.915 369.374 134.484 379.448 144.521 386.572C154.559 393.696 166.566 397.516 178.875 397.5ZM318 250.147V159C318 95.0621 274.573 41.2009 215.743 25.0028C209.92 10.335 195.689 0 178.875 0C162.061 0 147.83 10.335 142.007 25.0028C83.1769 41.2208 39.75 95.0621 39.75 159V250.147L5.82337 284.073C2.09583 287.8 0.00112567 292.854 0 298.125V318C0 323.271 2.09397 328.327 5.82125 332.054C9.54854 335.781 14.6038 337.875 19.875 337.875H337.875C343.146 337.875 348.201 335.781 351.929 332.054C355.656 328.327 357.75 323.271 357.75 318V298.125C357.749 292.854 355.654 287.8 351.927 284.073L318 250.147Z"/>
</svg>
{unread>0&&<span>{unread>9?'9+':unread}</span>}</button>{open&&<div className="notification-center__panel"><header><strong>Notificações</strong>{unread>0&&<button type="button" onClick={()=>void markAll()}>Marcar todas como lidas</button>}</header><div>{visibleItems.map(item=><button className={item.lida?'':'is-unread'} type="button" key={item.id} onClick={()=>void markRead(item)}><strong>{item.titulo}</strong><span>{item.mensagem}</span>{user?.cargo==='admin'&&selected===item.id&&<em>Alteração feita por: {item.dados?.autor_nome||item.dados?.autor_email||'sistema'}</em>}<small>{new Date(item.criado_em).toLocaleString('pt-BR')}</small></button>)}{!visibleItems.length&&<p>Nenhuma notificação.</p>}</div></div>}</div>
}
