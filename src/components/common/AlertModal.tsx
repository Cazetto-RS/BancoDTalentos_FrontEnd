import { useEffect, useId } from 'react'
import '../../styles/AlertModal.css'

type AlertModalProps = {
    isOpen: boolean
    title: string
    message: string
    onClose: () => void
    buttonText?: string
}

function AlertModal({ isOpen, title, message, onClose, buttonText = 'Entendi' }: AlertModalProps) {
    const titleId = useId()
    const messageId = useId()

    useEffect(() => {
        if (!isOpen) return

        const closeOnEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose()
        }

        window.addEventListener('keydown', closeOnEscape)
        return () => window.removeEventListener('keydown', closeOnEscape)
    }, [isOpen, onClose])

    if (!isOpen) return null

    return (
        <div
            className="alert-modal__overlay"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) onClose()
            }}
        >
            <section
                className="alert-modal"
                role="alertdialog"
                aria-modal="true"
                aria-labelledby={titleId}
                aria-describedby={messageId}
            >
                <button className="alert-modal__close" type="button" onClick={onClose} aria-label="Fechar aviso">×</button>
                <div className="alert-modal__icon" aria-hidden="true">!</div>
                <h2 id={titleId}>{title}</h2>
                <p id={messageId}>{message}</p>
                <button className="alert-modal__button" type="button" onClick={onClose} autoFocus>{buttonText}</button>
            </section>
        </div>
    )
}

export default AlertModal
