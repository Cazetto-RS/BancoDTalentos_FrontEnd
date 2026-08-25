import { useEffect, useId, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { createPortal } from 'react-dom'
import '../../styles/JobApplicationModal.css'

export interface JobModalData {
    title: string
    salary: string
    details: string
    skills: string[]
}

interface JobApplicationModalProps {
    job: JobModalData
    onClose: () => void
}

function JobApplicationModal({ job, onClose }: JobApplicationModalProps) {
    const [step, setStep] = useState(1)
    const titleId = useId()
    const dialogRef = useRef<HTMLDivElement>(null)
    const [contract = 'Contrato a combinar', workModel = 'Modelo a combinar'] = job.details.split(' • ')

    useEffect(() => {
        const previouslyFocused = document.activeElement as HTMLElement | null
        const scrollContainer = document.querySelector<HTMLElement>('.external-layout__content')
        const previousOverflow = scrollContainer?.style.overflow

        if (scrollContainer) scrollContainer.style.overflow = 'hidden'
        dialogRef.current?.focus()

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose()
        }

        document.addEventListener('keydown', handleKeyDown)
        return () => {
            document.removeEventListener('keydown', handleKeyDown)
            if (scrollContainer) scrollContainer.style.overflow = previousOverflow ?? ''
            previouslyFocused?.focus()
        }
    }, [onClose])

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setStep(3)
    }

    return createPortal(
        <div className="job-modal__backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
            <div className="job-modal" role="dialog" aria-modal="true" aria-labelledby={titleId} ref={dialogRef} tabIndex={-1}>
                <header className="job-modal__header">
                    <div className="job-modal__icon" aria-hidden="true" />
                    <div>
                        <h2 id={titleId}>{job.title}</h2>
                        <p>Oportunidade em Tecnologia</p>
                    </div>
                    <button className="job-modal__close" type="button" onClick={onClose} aria-label="Fechar modal">×</button>
                </header>

                <div className="job-modal__progress" aria-label={`Etapa ${step} de 3`}>
                    {[1, 2, 3].map((item) => <span className={item <= step ? 'is-active' : ''} key={item} />)}
                </div>

                {step === 1 && (
                    <div className="job-modal__body">
                        <div className="job-modal__section"><span>Cargo</span><strong>{job.title}</strong></div>
                        <div className="job-modal__columns">
                            <div className="job-modal__section"><span>Modelo de trabalho</span><strong>{workModel}</strong></div>
                            <div className="job-modal__section"><span>Tipo de contrato</span><strong>{contract}</strong></div>
                        </div>
                        <div className="job-modal__section">
                            <span>Descrição</span>
                            <p>Buscamos uma pessoa colaborativa, curiosa e comprometida com boas práticas para integrar nossa equipe e desenvolver soluções que gerem impacto.</p>
                        </div>
                        <div className="job-modal__section"><span>Salário</span><strong>{job.salary}</strong></div>
                        <div className="job-modal__section">
                            <span>Conhecimentos desejados</span>
                            <ul className="job-modal__tags">{job.skills.map((skill) => <li key={skill}>{skill}</li>)}</ul>
                        </div>
                        <footer className="job-modal__actions job-modal__actions--end">
                            <button className="job-modal__primary" type="button" onClick={() => setStep(2)}>Próximo</button>
                        </footer>
                    </div>
                )}

                {step === 2 && (
                    <form className="job-modal__body" onSubmit={handleSubmit}>
                        <label className="job-modal__field">
                            <span>Pretensão salarial</span>
                            <input type="text" inputMode="decimal" placeholder="R$ 0.000,00" required />
                        </label>
                        <fieldset className="job-modal__field">
                            <legend>Disponibilidade de horário</legend>
                            <div className="job-modal__columns">
                                <input type="time" aria-label="Horário inicial" required />
                                <input type="time" aria-label="Horário final" required />
                            </div>
                        </fieldset>
                        <label className="job-modal__field">
                            <span>Tipo de contrato desejado</span>
                            <select defaultValue="" required><option value="" disabled>Selecione uma opção</option><option>CLT</option><option>PJ</option><option>Estágio</option></select>
                        </label>
                        <label className="job-modal__field">
                            <span>Modelo de trabalho desejado</span>
                            <select defaultValue="" required><option value="" disabled>Selecione uma opção</option><option>Híbrido</option><option>Remoto</option><option>Presencial</option></select>
                        </label>
                        <footer className="job-modal__actions">
                            <button className="job-modal__secondary" type="button" onClick={() => setStep(1)}>Voltar</button>
                            <button className="job-modal__primary" type="submit">Confirmar candidatura</button>
                        </footer>
                    </form>
                )}

                {step === 3 && (
                    <div className="job-modal__body">
                        <div className="job-modal__success">
                            <div className="job-modal__check" aria-hidden="true">✓</div>
                            <h3>Sua inscrição foi confirmada!</h3>
                            <strong>{job.title}</strong>
                            <span>{job.salary}</span>
                            <p>Obrigado por confiar em nossa empresa. Seu perfil será analisado e retornaremos em breve.</p>
                        </div>
                        <footer className="job-modal__actions job-modal__actions--end">
                            <button className="job-modal__primary" type="button" onClick={onClose}>Concluir</button>
                        </footer>
                    </div>
                )}
            </div>
        </div>,
        document.body,
    )
}

export default JobApplicationModal
