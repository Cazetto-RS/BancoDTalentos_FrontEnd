import { useEffect, useId, useRef, useState } from 'react'
import type { CSSProperties, FormEvent } from 'react'
import { createPortal } from 'react-dom'
import { getJobCategoryTheme } from '../../constants/jobCategories'
import type { JobModalData } from '../../types/Job'
import JobCategoryIcon from './JobCategoryIcon'
import '../../styles/JobApplicationModal.css'
import { api } from '../../services/api'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

interface JobApplicationModalProps {
    job: JobModalData
    onClose: () => void
    mode?: 'apply' | 'details'
}

function JobApplicationModal({ job, onClose, mode = 'apply' }: JobApplicationModalProps) {
    const [step, setStep] = useState(1)
    const [error, setError] = useState(''); const [loading, setLoading] = useState(false)
    const { user } = useAuth(); const navigate = useNavigate()
    const titleId = useId()
    const dialogRef = useRef<HTMLDivElement>(null)
    const [contract = 'Contrato a combinar', workModel = 'Modelo a combinar'] = job.details.split(' • ')
    const theme = getJobCategoryTheme(job.category)
    const categoryStyle = {
        '--job-accent': theme.color,
        '--job-accent-soft': theme.softColor,
    } as CSSProperties

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

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (!user) return navigate('/login')
        if (user.cargo !== 'candidato') return setError('Somente candidatos podem se inscrever.')
        const form = new FormData(event.currentTarget); setLoading(true); setError('')
        try {
            await api('/candidaturas/inscrever', { method:'POST', body:JSON.stringify({
                vaga_id: job.id, pretensao_salarial: Number(String(form.get('salary')).replace(/[^\d,]/g,'').replace(',','.')),
                disponibilidade: form.get('availability'), preferencia_contrato: form.get('contract'), preferencia_modelo_trabalho: form.get('workModel'),
            }) }); setStep(3)
        } catch (reason) { setError(reason instanceof Error ? reason.message : 'Não foi possível concluir a candidatura.') }
        finally { setLoading(false) }
    }

    return createPortal(
        <div className="job-modal__backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
            <div className="job-modal" style={categoryStyle} role="dialog" aria-modal="true" aria-labelledby={titleId} ref={dialogRef} tabIndex={-1}>
                <header className="job-modal__header">
                    <div className="job-modal__icon" aria-hidden="true"><JobCategoryIcon category={job.category} /></div>
                    <div>
                        <h2 id={titleId}>{job.title}</h2>
                        <p>{mode === 'details' ? 'Informações da vaga em que você se inscreveu' : 'Oportunidade em Tecnologia'}</p>
                    </div>
                    <button className="job-modal__close" type="button" onClick={onClose} aria-label="Fechar modal">×</button>
                </header>

                {mode === 'apply' && (
                    <div className="job-modal__progress" aria-label={`Etapa ${step} de 3`}>
                        {[1, 2, 3].map((item) => <span className={item <= step ? 'is-active' : ''} key={item} />)}
                    </div>
                )}

                {step === 1 && (
                    <div className="job-modal__body">
                        <div className="job-modal__section"><span>Cargo</span><strong>{job.title}</strong></div>
                        <div className="job-modal__columns">
                            <div className="job-modal__section"><span>Modelo de trabalho</span><strong>{workModel}</strong></div>
                            <div className="job-modal__section"><span>Tipo de contrato</span><strong>{contract}</strong></div>
                        </div>
                        <div className="job-modal__section">
                            <span>Descrição</span>
                            <p>{job.description ?? 'Buscamos uma pessoa colaborativa, curiosa e comprometida com boas práticas para integrar nossa equipe e desenvolver soluções que gerem impacto.'}</p>
                        </div>
                        <div className="job-modal__section"><span>Salário</span><strong>{job.salary}</strong></div>
                        <div className="job-modal__section">
                            <span>Conhecimentos desejados</span>
                            <ul className="job-modal__tags">{job.skills.map((skill) => <li key={skill}>{skill}</li>)}</ul>
                        </div>
                        <footer className="job-modal__actions job-modal__actions--end">
                            {mode === 'details' ? (
                                <button className="job-modal__primary" type="button" onClick={onClose}>Fechar</button>
                            ) : (
                                <button className="job-modal__primary" type="button" onClick={() => setStep(2)}>Próximo</button>
                            )}
                        </footer>
                    </div>
                )}

                {mode === 'apply' && step === 2 && (
                    <form className="job-modal__body" onSubmit={handleSubmit}>
                        <label className="job-modal__field">
                            <span>Pretensão salarial</span>
                            <input name="salary" type="text" inputMode="decimal" placeholder="R$ 0.000,00" required />
                        </label>
                        <fieldset className="job-modal__field">
                            <legend>Disponibilidade de horário</legend>
                            <select name="availability" defaultValue="" required><option value="" disabled>Selecione</option><option value="manhã">Manhã</option><option value="tarde">Tarde</option><option value="noite">Noite</option><option value="integral">Integral</option></select>
                        </fieldset>
                        <label className="job-modal__field">
                            <span>Tipo de contrato desejado</span>
                            <select name="contract" defaultValue="" required><option value="" disabled>Selecione uma opção</option><option value="CLT">CLT</option><option value="PJ">PJ</option><option value="Estágio">Estágio</option></select>
                        </label>
                        <label className="job-modal__field">
                            <span>Modelo de trabalho desejado</span>
                            <select name="workModel" defaultValue="" required><option value="" disabled>Selecione uma opção</option><option value="hibrido">Híbrido</option><option value="remoto">Remoto</option><option value="presencial">Presencial</option></select>
                        </label>
                        <footer className="job-modal__actions">
                            <button className="job-modal__secondary" type="button" onClick={() => setStep(1)}>Voltar</button>
                            <button className="job-modal__primary" type="submit" disabled={loading}>{loading ? 'Enviando...' : 'Confirmar candidatura'}</button>
                        </footer>
                        {error && <p role="alert">{error}</p>}
                    </form>
                )}

                {mode === 'apply' && step === 3 && (
                    <div className="job-modal__body">
                        <div className="job-modal__success">
                            <div className="job-modal__check" aria-hidden="true">
                                <svg viewBox="0 0 500 384" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M18.125 191.625L76 133.792L191.75 249.458L423.25 18.125L481.125 75.9583L191.75 365.125L18.125 191.625Z" strokeWidth="36.25" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
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
