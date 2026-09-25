import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { AdminCandidate, CandidateStatus } from '../../types/AdminCandidate'
import { candidateStatusLabels } from '../../types/AdminCandidate'
import AdminIcon from './AdminIcon'
import AdminStatusSelect from './AdminStatusSelect'
import '../../styles/AdminCandidateModal.css'

interface CandidateDetailsModalProps {
    candidate: AdminCandidate
    onChange: (candidate: AdminCandidate) => Promise<void> | void
    onClose: () => void
}

type CandidateTab = 'perfil' | 'trajetoria' | 'cultura'

const dateFormatter = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
const monthFormatter = new Intl.DateTimeFormat('pt-BR', { month: 'short', year: 'numeric' })
const currencyFormatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

const educationStatusLabels = {
    cursando: 'Cursando',
    concluido: 'Concluído',
    trancado: 'Trancado',
}
const statusOptions = Object.entries(candidateStatusLabels).map(([value, label]) => ({ value, label }))

function getInitials(name: string) {
    const parts = name.trim().split(/\s+/)
    return `${parts[0]?.[0] ?? ''}${parts.at(-1)?.[0] ?? ''}`.toUpperCase()
}

function formatMonth(date?: string) {
    if (!date) return 'Atualmente'
    const parsed = new Date(`${date}T12:00:00`)
    return Number.isNaN(parsed.getTime()) ? 'Não informado' : monthFormatter.format(parsed)
}

function formatDate(date?: string) {
    if (!date) return 'Não informado'
    const parsed = new Date(date.includes('T') ? date : `${date}T12:00:00`)
    return Number.isNaN(parsed.getTime()) ? 'Não informado' : dateFormatter.format(parsed)
}

function CandidateDetailsModal({ candidate, onChange, onClose }: CandidateDetailsModalProps) {
    const dialogRef = useRef<HTMLDivElement>(null)
    const [activeTab, setActiveTab] = useState<CandidateTab>('perfil')

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
            window.removeEventListener('keydown', closeOnEscape)
        }
    }, [onClose])

    const updateStatus = (status: CandidateStatus) => {
        void onChange({ ...candidate, application: { ...candidate.application, status } })
    }

    const toggleFavorite = () => {
        void onChange({ ...candidate, application: { ...candidate.application, favorite: !candidate.application.favorite } })
    }

    return createPortal(
        <div className="admin-candidate-modal__overlay" role="presentation" onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose()
        }}>
            <div className="admin-candidate-modal" role="dialog" aria-modal="true" aria-labelledby="admin-candidate-modal-title" tabIndex={-1} ref={dialogRef}>
                <header className="admin-candidate-modal__header">
                    <div className="admin-candidate-modal__identity">
                        <span className="admin-candidate-modal__avatar" aria-hidden="true">{getInitials(candidate.fullName)}</span>
                        <div>
                            <span>PERFIL DO CANDIDATO</span>
                            <h2 id="admin-candidate-modal-title">{candidate.fullName}</h2>
                            <p>{candidate.application.jobTitle}</p>
                        </div>
                    </div>

                    <div className="admin-candidate-modal__header-actions">
                        <button className={candidate.application.favorite ? 'is-favorite' : ''} type="button" onClick={toggleFavorite} aria-label={candidate.application.favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'} title="Favoritar candidato">
                            <AdminIcon name="star" aria-hidden="true" />
                        </button>
                        <button type="button" onClick={onClose} aria-label="Fechar modal">×</button>
                    </div>
                </header>

                <nav className="admin-candidate-modal__tabs" aria-label="Informações do candidato">
                    <button className={activeTab === 'perfil' ? 'is-active' : ''} type="button" onClick={() => setActiveTab('perfil')}>Visão geral</button>
                    <button className={activeTab === 'trajetoria' ? 'is-active' : ''} type="button" onClick={() => setActiveTab('trajetoria')}>Trajetória</button>
                    <button className={activeTab === 'cultura' ? 'is-active' : ''} type="button" onClick={() => setActiveTab('cultura')}>Cultura e valores</button>
                </nav>

                <div className="admin-candidate-modal__content">
                    {activeTab === 'perfil' && (
                        <div className="admin-candidate-modal__panel">
                            <section className="admin-candidate-modal__application">
                                <div className="admin-candidate-modal__section-heading">
                                    <div><span>CANDIDATURA</span><h3>Etapa do processo</h3></div>
                                    <AdminStatusSelect
                                        value={candidate.application.status}
                                        options={statusOptions}
                                        onChange={(status) => updateStatus(status as CandidateStatus)}
                                        ariaLabel="Alterar etapa do processo"
                                        className={`admin-candidate-modal__status admin-candidate-modal__status--${candidate.application.status.replaceAll(' ', '-').replace('á', 'a')}`}
                                    />
                                </div>

                                <div className="admin-candidate-modal__application-grid">
                                    <div><span>Vaga</span><strong>{candidate.application.jobTitle}</strong></div>
                                    <div><span>Área</span><strong>{candidate.application.area}</strong></div>
                                    <div><span>Pretensão salarial</span><strong>{currencyFormatter.format(candidate.application.salaryExpectation)}</strong></div>
                                    <div><span>Inscrição</span><strong>{formatDate(candidate.application.createdAt)}</strong></div>
                                    <div><span>Disponibilidade</span><strong className="text-capitalize">{candidate.application.availability}</strong></div>
                                    <div><span>Preferências</span><strong>{candidate.application.contractPreference} · <span className="text-capitalize">{candidate.application.workModelPreference}</span></strong></div>
                                </div>
                            </section>

                            <div className="admin-candidate-modal__columns">
                                <section className="admin-candidate-modal__card">
                                    <div className="admin-candidate-modal__section-heading">
                                        <div><span>CONTATO</span><h3>Informações pessoais</h3></div>
                                    </div>
                                    <dl className="admin-candidate-modal__data-list">
                                        <div><dt>E-mail</dt><dd>{candidate.email}</dd></div>
                                        <div><dt>Telefone</dt><dd>{candidate.phone}</dd></div>
                                        <div><dt>Localização</dt><dd>{candidate.city} - {candidate.state}</dd></div>
                                        <div><dt>Data de nascimento</dt><dd>{formatDate(candidate.birthDate)}</dd></div>
                                    </dl>
                                </section>

                                <section className="admin-candidate-modal__card">
                                    <div className="admin-candidate-modal__section-heading">
                                        <div><span>INTERESSES</span><h3>Áreas de interesse</h3></div>
                                    </div>
                                    <ul className="admin-candidate-modal__tags">
                                        {candidate.interests.map((interest) => <li key={interest}>{interest}</li>)}
                                    </ul>
                                </section>
                            </div>

                            <section className="admin-candidate-modal__card">
                                <div className="admin-candidate-modal__section-heading">
                                    <div><span>COMPETÊNCIAS</span><h3>Habilidades declaradas</h3></div>
                                    <small>Nível de 1 a 5</small>
                                </div>
                                <div className="admin-candidate-modal__skills">
                                    {candidate.skills.map((skill) => (
                                        <div className="admin-candidate-modal__skill" key={skill.name}>
                                            <div>
                                                <strong>{skill.name}</strong>
                                                <span>{skill.category === 'hard' ? 'Técnica' : 'Comportamental'} · <span className="text-capitalize">{skill.experienceLevel}</span></span>
                                            </div>
                                            <div className="admin-candidate-modal__skill-level" aria-label={`${skill.name}: nível ${skill.level} de 5`}>
                                                {Array.from({ length: 5 }, (_, index) => <i className={index < skill.level ? 'is-filled' : ''} key={index} />)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>
                    )}

                    {activeTab === 'trajetoria' && (
                        <div className="admin-candidate-modal__panel admin-candidate-modal__panel--trajectory">
                            <section className="admin-candidate-modal__card">
                                <div className="admin-candidate-modal__section-heading">
                                    <div><span>EXPERIÊNCIA</span><h3>Histórico profissional</h3></div>
                                    <strong>{candidate.experiences.length}</strong>
                                </div>
                                {candidate.experiences.length ? (
                                    <div className="admin-candidate-modal__timeline">
                                        {candidate.experiences.map((experience, index) => (
                                            <article key={`${experience.company}-${index}`}>
                                                <span className="admin-candidate-modal__timeline-dot" aria-hidden="true" />
                                                <div>
                                                    <h4>{experience.role}</h4>
                                                    <strong>{experience.company}</strong>
                                                    <small>{formatMonth(experience.startDate)} — {experience.current ? 'Atualmente' : formatMonth(experience.endDate)}</small>
                                                    <p>{experience.description}</p>
                                                </div>
                                            </article>
                                        ))}
                                    </div>
                                ) : <p className="admin-candidate-modal__empty-section">Nenhuma experiência profissional informada.</p>}
                            </section>

                            <section className="admin-candidate-modal__card">
                                <div className="admin-candidate-modal__section-heading">
                                    <div><span>FORMAÇÃO</span><h3>Histórico acadêmico</h3></div>
                                    <strong>{candidate.education.length}</strong>
                                </div>
                                <div className="admin-candidate-modal__education-list">
                                    {candidate.education.map((education, index) => (
                                        <article key={`${education.course}-${index}`}>
                                            <span className="admin-candidate-modal__education-icon" aria-hidden="true">
                                                <AdminIcon name="education" />
                                            </span>
                                            <div>
                                                <div><h4>{education.course}</h4><span>{educationStatusLabels[education.status]}</span></div>
                                                <strong>{education.institution}</strong>
                                                <small>{formatMonth(education.startDate)} — {formatMonth(education.endDate)} · <span className="text-capitalize">{education.shift}</span>{education.currentSemester ? ` · ${education.currentSemester}º semestre` : ''}</small>
                                                {education.certificateUrl && <a href={education.certificateUrl} target="_blank" rel="noreferrer">Abrir certificado <span aria-hidden="true">↗</span></a>}
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            </section>
                        </div>
                    )}

                    {activeTab === 'cultura' && (
                        <div className="admin-candidate-modal__panel admin-candidate-modal__panel--culture">
                            <section className="admin-candidate-modal__culture-highlight">
                                <span>APRESENTAÇÃO PROFISSIONAL</span>
                                <p>{candidate.culture.presentation}</p>
                            </section>

                            <div className="admin-candidate-modal__columns">
                                <section className="admin-candidate-modal__card">
                                    <div className="admin-candidate-modal__section-heading">
                                        <div><span>MOTIVAÇÃO</span><h3>Por que quer fazer parte?</h3></div>
                                    </div>
                                    <p className="admin-candidate-modal__long-text">{candidate.culture.motivation}</p>
                                </section>

                                <section className="admin-candidate-modal__card">
                                    <div className="admin-candidate-modal__section-heading">
                                        <div><span>VALORES</span><h3>O que orienta seu trabalho?</h3></div>
                                    </div>
                                    <p className="admin-candidate-modal__long-text">{candidate.culture.values}</p>
                                </section>
                            </div>

                            <section className="admin-candidate-modal__card admin-candidate-modal__documents">
                                <div className="admin-candidate-modal__section-heading">
                                    <div><span>DOCUMENTOS</span><h3>Arquivos enviados</h3></div>
                                </div>
                                {candidate.culture.recommendationUrl ? (
                                    <a href={candidate.culture.recommendationUrl} target="_blank" rel="noreferrer">
                                        <span aria-hidden="true"><AdminIcon name="document" /></span>
                                        <div><strong>Carta de recomendação</strong><small>Documento em PDF</small></div>
                                        <AdminIcon name="external" aria-hidden="true" />
                                    </a>
                                ) : <p className="admin-candidate-modal__empty-section">Nenhum documento de recomendação foi enviado.</p>}
                            </section>
                        </div>
                    )}
                </div>
            </div>
        </div>,
        document.body,
    )
}

export default CandidateDetailsModal
