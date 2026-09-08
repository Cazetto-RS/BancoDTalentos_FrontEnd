import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { AdminJob } from '../../pages/admin/AdminJobsPage'
import '../../styles/AdminJobModal.css'

interface JobShareModalProps {
    job: AdminJob
    onClose: () => void
}

const qrPattern = [
    '111111101010101111111', '100000101101001000001', '101110101011101011101',
    '101110100101001011101', '101110101110101011101', '100000100011101000001',
    '111111101010101111111', '000000001101000000000', '101111111011111010101',
    '011010001100010111000', '110011101011101001111', '001101001110010110100',
    '101011111001111011101', '000000001010001010100', '111111101111101011111',
    '100000100100001000101', '101110101111101110111', '101110100010100010000',
    '101110101101111011101', '100000101010001100101', '111111101101101011111',
]

function JobShareModal({ job, onClose }: JobShareModalProps) {
    const dialogRef = useRef<HTMLDivElement>(null)
    const copiedTimerRef = useRef<number | null>(null)
    const [copied, setCopied] = useState(false)

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
            await navigator.clipboard.writeText(job.formUrl)
            copiedSuccessfully = true
        } catch {
            const textarea = document.createElement('textarea')
            textarea.value = job.formUrl
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
                        <svg viewBox="0 0 24 24" fill="none"><path d="M8.5 12.5 15.5 8M8.5 15.5l7 4M8.5 9.5l7-4M6 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM18 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM18 22a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" /></svg>
                    </span>
                    <div>
                        <span>COMPARTILHAR VAGA</span>
                        <h2 id="admin-job-share-title">Acesso ao formulário</h2>
                        <p>Escaneie o QR Code ou copie o link para compartilhar.</p>
                    </div>
                </header>

                <div className="admin-job-share-modal__job">
                    <span aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M4 7h16v13H4V7ZM9 7V4h6v3" /></svg></span>
                    <div><small>{job.area}</small><strong>{job.title}</strong></div>
                </div>

                <div className="admin-job-share-modal__qr-card">
                    <div className="admin-job-share-modal__qr">
                        <svg viewBox="0 0 21 21" role="img" aria-label="QR Code de acesso ao formulário da vaga" shapeRendering="crispEdges">
                            <rect width="21" height="21" fill="#fff" />
                            {qrPattern.flatMap((row, rowIndex) => [...row].map((cell, columnIndex) => cell === '1' ? (
                                <rect x={columnIndex} y={rowIndex} width="1" height="1" fill="#000" key={`${rowIndex}-${columnIndex}`} />
                            ) : null))}
                        </svg>
                    </div>
                    <p>Aponte a câmera do celular para acessar a vaga</p>
                </div>

                <div className="admin-job-share-modal__link">
                    <label htmlFor="admin-job-share-url">Link da vaga</label>
                    <div className="admin-job-share-modal__link-control">
                        <a id="admin-job-share-url" href={job.formUrl} target="_blank" rel="noreferrer" title={job.formUrl}>{job.formUrl}</a>
                        <button className={copied ? 'is-copied' : ''} type="button" onClick={copyUrl} aria-label={copied ? 'Link copiado' : 'Copiar link da vaga'}>
                            {copied ? (
                                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                    <path d="m5 12.5 4.2 4.2L19 7" />
                                </svg>
                            ) : (
                                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                    <rect x="8" y="8" width="11" height="11" rx="2" />
                                    <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
                                </svg>
                            )}
                            <span>{copied ? 'Copiado!' : 'Copiar'}</span>
                        </button>
                    </div>
                    <span className="admin-job-share-modal__feedback" aria-live="polite">
                        {copied ? 'O link foi copiado para a área de transferência.' : ''}
                    </span>
                </div>

                <a className="admin-job-share-modal__open" href={job.formUrl} target="_blank" rel="noreferrer">
                    Abrir formulário
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M14 5h5v5M19 5l-8 8M19 13v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5" /></svg>
                </a>
            </div>
        </div>,
        document.body,
    )
}

export default JobShareModal
