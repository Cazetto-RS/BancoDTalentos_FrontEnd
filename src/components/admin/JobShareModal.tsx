import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { AdminJob } from '../../types/Job'
import AdminIcon from './AdminIcon'
import { api, apiUrl } from '../../services/api'
import '../../styles/AdminJobModal.css'

interface JobShareModalProps {
    job: AdminJob
    onClose: () => void
}

// Serviço público de QR Code: o conteúdo codificado é exclusivamente a URL pública da vaga.
// Não inclua tokens de sessão ou parâmetros privados neste endereço.
function getQrCodeUrl(shareUrl: string) {
    const url = new URL('https://api.qrserver.com/v1/create-qr-code/')
    url.searchParams.set('data', shareUrl)
    url.searchParams.set('size', '320x320')
    url.searchParams.set('format', 'png')
    url.searchParams.set('ecc', 'M')
    url.searchParams.set('qzone', '4')
    return url.toString()
}

function JobShareModal({ job, onClose }: JobShareModalProps) {
    const dialogRef = useRef<HTMLDivElement>(null)
    const copiedTimerRef = useRef<number | null>(null)
    const [copied, setCopied] = useState(false)
    const [qrFailed, setQrFailed] = useState(false)
    const [shareUrl, setShareUrl] = useState('')
    const [shareError, setShareError] = useState('')
    const [retry, setRetry] = useState(0)
    useEffect(() => {
        let active = true
        setShareUrl(''); setShareError(''); setQrFailed(false)
        api<{ path: string }>(`/vagas/admin/compartilhar/${job.id}`)
            .then(result => { if (active) setShareUrl(new URL(result.path, apiUrl).toString()) })
            .catch(() => { if (active) setShareError('Não foi possível gerar o link da vaga.') })
        return () => { active = false }
    }, [job.id, retry])
    const qrUrl = shareUrl ? getQrCodeUrl(shareUrl) : '' 
    const localAddress = /^(localhost|127\.0\.0\.1|0\.0\.0\.0)$/i.test(new URL(shareUrl || 'http://localhost').hostname)

    useEffect(() => {
        const scrollContainer = document.querySelector<HTMLElement>('.admin-layout__content')
        const previousOverflow = scrollContainer?.style.overflow
        if (scrollContainer) scrollContainer.style.overflow = 'hidden'
        dialogRef.current?.focus()
        const closeOnEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose()
        }

        window.addEventListener('keydown', closeOnEscape)
        return () => {
            if (scrollContainer) scrollContainer.style.overflow = previousOverflow ?? ''
            if (copiedTimerRef.current) window.clearTimeout(copiedTimerRef.current)
            window.removeEventListener('keydown', closeOnEscape)
        }
    }, [onClose])

    const copyUrl = async () => {
        let copiedSuccessfully = false

        try {
            await navigator.clipboard.writeText(shareUrl)
            copiedSuccessfully = true
        } catch {
            const textarea = document.createElement('textarea')
            textarea.value = shareUrl
            textarea.style.position = 'fixed'
            textarea.style.opacity = '0'
            document.body.appendChild(textarea)
            textarea.select()
            copiedSuccessfully = document.execCommand('copy')
            textarea.remove()
        }

        if (!copiedSuccessfully) return

        setCopied(true)
        if (copiedTimerRef.current) window.clearTimeout(copiedTimerRef.current)
        copiedTimerRef.current = window.setTimeout(() => setCopied(false), 2000)
    }

    return createPortal(
        <div className="admin-job-modal__overlay" role="presentation" onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose()
        }}>
            <div className="admin-job-modal admin-job-share-modal" role="dialog" aria-modal="true" aria-labelledby="admin-job-share-title" tabIndex={-1} ref={dialogRef}>
                <button className="admin-job-share-close" type="button" onClick={onClose} aria-label="Fechar modal">×</button>

                <header className="admin-job-share-modal__header">
                    <span className="admin-job-share-modal__icon" aria-hidden="true">
                        <AdminIcon name="share" />
                    </span>
                    <div>
                        <span>COMPARTILHAR VAGA</span>
                        <h2 id="admin-job-share-title">Compartilhar oportunidade</h2>
                        <p>Escaneie o QR Code ou copie o link de acesso à vaga.</p>
                    </div>
                </header>

                <div className="admin-job-share-modal__job">
                    <span aria-hidden="true"><AdminIcon name="briefcase" aria-hidden="true" /></span>
                    <div><small>{job.area}</small><strong>{job.title}</strong></div>
                </div>

                <div className="admin-job-share-modal__qr-card">
                    <div className="admin-job-share-modal__qr">
                        {shareError ? <div role="alert">{shareError}<button type="button" onClick={() => setRetry(value => value + 1)}>Tentar novamente</button></div> : !shareUrl ? <p role="status">Gerando link seguro...</p> : qrFailed ? (
                            <div className="admin-job-share-modal__qr-error" role="alert">
                                Não foi possível carregar o QR Code.
                                <button type="button" onClick={() => setQrFailed(false)}>Tentar novamente</button>
                            </div>
                        ) : (
                            <img
                                src={qrUrl}
                                alt={`QR Code para acessar a vaga ${job.title}`}
                                width="320"
                                height="320"
                                loading="eager"
                                referrerPolicy="no-referrer"
                                onError={() => setQrFailed(true)}
                            />
                        )}
                    </div>
                    <p>Aponte a câmera do celular para acessar a vaga</p>
                    {localAddress && <p role="status">O link aponta para localhost e não funciona em outro aparelho. Publique o site ou configure a URL do frontend em CORS_ORIGINS na API.</p>}
                    {job.visibility === 'Privado' && <p role="status">Acesso por convite: quem receber o link deverá entrar na conta para visualizar e se candidatar.</p>}
                </div>

                <div className="admin-job-share-modal__link">
                    <label htmlFor="admin-job-share-url">Link da vaga</label>
                    <div className="admin-job-share-modal__link-control">
                        <a id="admin-job-share-url" href={shareUrl || undefined} target="_blank" rel="noreferrer" title={shareUrl}>{shareUrl || "Gerando link..."}</a>
                        <button className={copied ? 'is-copied' : ''} type="button" onClick={copyUrl} disabled={!shareUrl} aria-label={copied ? 'Link copiado' : 'Copiar link da vaga'}>
                            {copied ? (
                                <AdminIcon name="check" aria-hidden="true" />
                            ) : (
                                <AdminIcon name="copy" aria-hidden="true" />
                            )}
                            <span>{copied ? 'Copiado!' : 'Copiar'}</span>
                        </button>
                    </div>
                    <span className="admin-job-share-modal__feedback" aria-live="polite">
                        {copied ? 'O link foi copiado para a área de transferência.' : ''}
                    </span>
                </div>
            </div>
        </div>,
        document.body,
    )
}

export default JobShareModal
