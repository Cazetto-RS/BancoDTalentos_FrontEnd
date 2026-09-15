import { useEffect, useId, useRef } from 'react'
import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import '../../styles/AlertModal.css'

interface ConfirmModalProps {
    isOpen: boolean
    title: string
    message: string
    icon?: ReactNode
    confirmText?: string
    cancelText?: string
    onConfirm: () => void
    onClose: () => void
}

function ConfirmModal({
    isOpen,
    title,
    message,
    icon,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    onConfirm,
    onClose,
}: ConfirmModalProps) {
    const titleId = useId()
    const messageId = useId()
    const dialogRef = useRef<HTMLElement>(null)

    useEffect(() => {
        if (!isOpen) return

        const previousOverflow = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        dialogRef.current?.focus()

        const closeOnEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose()
        }

        window.addEventListener('keydown', closeOnEscape)
        return () => {
            document.body.style.overflow = previousOverflow
            window.removeEventListener('keydown', closeOnEscape)
        }
    }, [isOpen, onClose])

    if (!isOpen) return null

    return createPortal(
        <div className="alert-modal__overlay" onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose()
        }}>
            <section className="alert-modal alert-modal--danger" role="alertdialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={messageId} tabIndex={-1} ref={dialogRef}>
                <button className="alert-modal__close" type="button" onClick={onClose} aria-label="Fechar confirmação">×</button>
                <div className="alert-modal__icon" aria-hidden="true">{icon ?? '!'}</div>
                <h2 id={titleId}>{title}</h2>
                <p id={messageId}>{message}</p>
                <div className="alert-modal__actions">
                    <button className="alert-modal__button alert-modal__button--secondary" type="button" onClick={onClose} autoFocus>{cancelText}</button>
                    <button className="alert-modal__button alert-modal__button--danger" type="button" onClick={onConfirm}>{confirmText}</button>
                </div>
            </section>
        </div>,
        document.body,
    )
}

export default ConfirmModal
