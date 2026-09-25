import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { createPortal } from 'react-dom'
import { createJobShareUrl } from '../../services/jobStorage'
import type { AdminJob } from '../../types/Job'
import AdminIcon from './AdminIcon'
import '../../styles/AdminJobModal.css'

interface JobFormModalProps {
    mode: 'create' | 'edit'
    job?: AdminJob
    nextId?: number
    onClose: () => void
    onSave: (job: AdminJob) => Promise<void> | void
}

const emptyJob = (id: number): AdminJob => ({
    id,
    title: '',
    area: '',
    description: '',
    workModel: 'hibrido',
    contractType: 'CLT',
    salaryMin: 0,
    salaryMax: 0,
    status: 'ativo',
    createdAt: 'Agora',
    visibility: 'Público',
    candidates: 0,
    skills: [],
    shareUrl: createJobShareUrl(id),
})

function JobFormModal({ mode, job, nextId = 1, onClose, onSave }: JobFormModalProps) {
    const [form, setForm] = useState<AdminJob>(() => job ? { ...job, skills: [...job.skills] } : emptyJob(nextId))
    const [skillsText, setSkillsText] = useState(() => job?.skills.join(', ') ?? '')
    const [saving, setSaving] = useState(false)
    const [saveError, setSaveError] = useState('')
    const dialogRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const previousOverflow = document.body.style.overflow
        const scrollContainer = document.querySelector<HTMLElement>('.admin-layout__content')
        const previousContainerOverflow = scrollContainer?.style.overflow
        document.body.style.overflow = 'hidden'
        if (scrollContainer) scrollContainer.style.overflow = 'hidden'
        dialogRef.current?.focus()

        const closeOnEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose()
        }

        window.addEventListener('keydown', closeOnEscape)
        return () => {
            document.body.style.overflow = previousOverflow
            if (scrollContainer) scrollContainer.style.overflow = previousContainerOverflow ?? ''
            window.removeEventListener('keydown', closeOnEscape)
        }
    }, [onClose])

    const submit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (saving) return
        setSaving(true)
        setSaveError('')
        try {
            await onSave({
                ...form,
                shareUrl: form.shareUrl || createJobShareUrl(form.id),
                skills: skillsText.split(',').map((skill) => skill.trim()).filter(Boolean),
            })
        } catch (reason) {
            setSaveError(reason instanceof Error ? reason.message : 'Não foi possível salvar a vaga.')
        } finally {
            setSaving(false)
        }
    }

    return createPortal(
        <div className="admin-job-modal__overlay" role="presentation" onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose()
        }}>
            <div className="admin-job-modal admin-job-form-modal" role="dialog" aria-modal="true" aria-labelledby="admin-job-form-title" tabIndex={-1} ref={dialogRef}>
                <header className="admin-job-modal__header">
                    <div className="admin-job-modal__identity">
                        <span className="admin-job-modal__header-icon" aria-hidden="true">
                            <AdminIcon name={mode === 'create' ? 'plus' : 'edit'} />
                        </span>
                        <div>
                            <span>GERENCIAMENTO DE VAGAS</span>
                            <h2 id="admin-job-form-title">{mode === 'create' ? 'Criar nova vaga' : 'Editar vaga'}</h2>
                            <p>{mode === 'create' ? 'Preencha os dados para publicar uma nova oportunidade.' : 'Revise e atualize as informações desta oportunidade.'}</p>
                        </div>
                    </div>
                    <button className="admin-job-modal__close" type="button" aria-label="Fechar modal" onClick={onClose}>×</button>
                </header>

                <form className="admin-job-form" onSubmit={submit}>
                    <div className="admin-job-form__content">
                        <section className="admin-job-form__section">
                            <div className="admin-job-form__section-heading">
                                <span className="admin-job-form__section-icon" aria-hidden="true"><AdminIcon name="briefcase" /></span>
                                <div><span>INFORMAÇÕES PRINCIPAIS</span><h3>Dados da oportunidade</h3></div>
                            </div>

                            <div className="admin-job-form__grid">
                                <label className="admin-job-field admin-job-field--wide">
                                    <span>Título da vaga</span>
                                    <input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="Ex.: Desenvolvedor Web Sênior" required />
                                </label>

                                <label className="admin-job-field">
                                    <span>Área</span>
                                    <input value={form.area} onChange={(event) => setForm({ ...form, area: event.target.value })} placeholder="Ex.: Desenvolvimento Web" required />
                                </label>

                                <label className="admin-job-field">
                                    <span>Status</span>
                                    <select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as AdminJob['status'] })}>
                                        <option value="ativo">Ativa</option>
                                        <option value="pausado">Pausada</option>
                                        <option value="fechado">Fechada</option>
                                    </select>
                                </label>

                                <label className="admin-job-field admin-job-field--wide">
                                    <span>Descrição</span>
                                    <textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Descreva as responsabilidades e os objetivos da vaga" required />
                                </label>
                            </div>
                        </section>

                        <section className="admin-job-form__section">
                            <div className="admin-job-form__section-heading">
                                <span className="admin-job-form__section-icon" aria-hidden="true"><AdminIcon name="money" /></span>
                                <div><span>CONDIÇÕES E PUBLICAÇÃO</span><h3>Detalhes da contratação</h3></div>
                            </div>

                            <div className="admin-job-form__grid">
                                <label className="admin-job-field">
                                    <span>Modelo de trabalho</span>
                                    <select value={form.workModel} onChange={(event) => setForm({ ...form, workModel: event.target.value as AdminJob['workModel'] })}>
                                        <option value="remoto">Remoto</option>
                                        <option value="hibrido">Híbrido</option>
                                        <option value="presencial">Presencial</option>
                                    </select>
                                </label>

                                <label className="admin-job-field">
                                    <span>Tipo de contrato</span>
                                    <select value={form.contractType} onChange={(event) => setForm({ ...form, contractType: event.target.value as AdminJob['contractType'] })}>
                                        <option value="CLT">CLT</option>
                                        <option value="PJ">PJ</option>
                                    </select>
                                </label>

                                <label className="admin-job-field">
                                    <span>Salário mínimo</span>
                                    <input value={form.salaryMin || ''} onChange={(event) => setForm({ ...form, salaryMin: Number(event.target.value) })} type="number" min="0" step="0.01" placeholder="0,00" required />
                                </label>

                                <label className="admin-job-field">
                                    <span>Salário máximo</span>
                                    <input value={form.salaryMax || ''} onChange={(event) => setForm({ ...form, salaryMax: Number(event.target.value) })} type="number" min={form.salaryMin} step="0.01" placeholder="0,00" required />
                                </label>

                                <label className="admin-job-field admin-job-field--wide">
                                    <span>Habilidades desejadas</span>
                                    <input value={skillsText} onChange={(event) => setSkillsText(event.target.value)} placeholder="React, TypeScript, SQL..." />
                                    <small>Separe cada habilidade por vírgula.</small>
                                </label>

                                <label className="admin-job-field admin-job-field--wide">
                                    <span>Visibilidade</span>
                                    <select value={form.visibility} onChange={(event) => setForm({ ...form, visibility: event.target.value as AdminJob['visibility'] })}>
                                        <option value="Público">Pública</option>
                                        <option value="Interno">Privada</option>
                                    </select>
                                    <small>
                                        {form.visibility === 'Público'
                                            ? 'A vaga aparecerá automaticamente na página de vagas abertas.'
                                            : 'A vaga ficará fora da listagem pública e deverá ser acessada pelo link de compartilhamento.'}
                                    </small>
                                </label>
                            </div>
                        </section>
                    </div>

                    <footer className="admin-job-form__actions">
                        {saveError && <p className="admin-job-form__error" role="alert">{saveError}</p>}
                        <button className="admin-job-button admin-job-button--secondary" type="button" onClick={onClose} disabled={saving}>Cancelar</button>
                        <button className="admin-job-button admin-job-button--primary" type="submit" disabled={saving}>{saving ? 'Salvando...' : mode === 'create' ? 'Criar vaga' : 'Salvar alterações'}</button>
                    </footer>
                </form>
            </div>
        </div>,
        document.body,
    )
}

export default JobFormModal
