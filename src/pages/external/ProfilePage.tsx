import { useEffect, useState } from 'react'
import '../../styles/ProfilePage.css'
import profileIcon from '../../assets/svgs/Profile.svg'
import JobApplicationModal from '../../components/jobs/JobApplicationModal'
import JobCategoryIcon from '../../components/jobs/JobCategoryIcon'
import type { JobModalData } from '../../types/Job'
import { useAuth } from '../../contexts/AuthContext'
import { api } from '../../services/api'

const currentApplication: JobModalData = {
    title: 'Desenvolvedor Web Sênior',
    category: 'desenvolvimento',
    salary: 'R$ 3.500,00 — R$ 4.500,00',
    details: 'PJ • Híbrido',
    description: 'Atuação no desenvolvimento e manutenção de aplicações web, trabalhando em conjunto com as equipes de produto e design.',
    skills: ['React', 'TypeScript', 'Node.js'],
}

const formatDate = (value?: string) => {
    if (!value) return 'Não informado'
    const date = new Date(`${value.slice(0, 10)}T12:00:00`)
    return Number.isNaN(date.getTime()) ? 'Não informado' : date.toLocaleDateString('pt-BR')
}

function ProfilePage() {
    const { user } = useAuth()
    const [showJobDetails, setShowJobDetails] = useState(false)
    const [profile, setProfile] = useState<Record<string, any>>({})
    const [culture, setCulture] = useState<Record<string, any>>({})
    const [profileSkills, setProfileSkills] = useState<Array<Record<string, any>>>([])
    const [profileExperiences, setProfileExperiences] = useState<Array<Record<string, any>>>([])
    const [profileEducation, setProfileEducation] = useState<Array<Record<string, any>>>([])
    const [interests, setInterests] = useState<Array<Record<string, any>>>([])
    const [applications, setApplications] = useState<Array<Record<string, any>>>([])
    const [loadError, setLoadError] = useState('')

    useEffect(() => {
        Promise.allSettled([
            api<Record<string, any>>('/candidatos/meu-perfil'),
            api<Record<string, any>>('/candidatos/buscar-cultura'),
            api<{ experiencias: Array<Record<string, any>> }>('/historico/experiencias'),
            api<{ formacoes: Array<Record<string, any>> }>('/historico/formacoes'),
            api<Array<Record<string, any>>>('/habilidades-candidatos/buscar'),
            api<Array<Record<string, any>>>('/interesses-candidato'),
            api<Array<Record<string, any>>>('/candidaturas/minhas-candidaturas'),
        ]).then(([profileResult, cultureResult, experiencesResult, educationResult, skillsResult, interestsResult, applicationsResult]) => {
            if (profileResult.status === 'fulfilled') setProfile(profileResult.value)
            if (cultureResult.status === 'fulfilled') setCulture(cultureResult.value)
            if (experiencesResult.status === 'fulfilled') setProfileExperiences(experiencesResult.value.experiencias)
            if (educationResult.status === 'fulfilled') setProfileEducation(educationResult.value.formacoes)
            if (skillsResult.status === 'fulfilled') setProfileSkills(skillsResult.value)
            if (interestsResult.status === 'fulfilled') setInterests(interestsResult.value)
            if (applicationsResult.status === 'fulfilled') setApplications(applicationsResult.value)
            if (profileResult.status === 'rejected') setLoadError(profileResult.reason instanceof Error ? profileResult.reason.message : 'Não foi possível carregar o perfil.')
        })
    }, [])

    const latestApplication = applications[0]
    const applicationJob: JobModalData | null = latestApplication ? {
        id: latestApplication.vaga_id,
        title: latestApplication.vaga_titulo,
        category: 'desenvolvimento',
        salary: latestApplication.pretensao_salarial ? `Pretensão: ${Number(latestApplication.pretensao_salarial).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}` : 'Pretensão não informada',
        details: `${latestApplication.vaga_contrato || 'Contrato a combinar'} • ${latestApplication.vaga_modelo || 'Modelo a combinar'}`,
        skills: [],
    } : null

    return (
        <main className="profile-page">
            <section className="profile-hero">

                <div className="profile-container profile-hero__content">
                    <div className="profile-photo">
                        <div className="profile-avatar">
                            <img src={profile.url_foto || profileIcon} alt={`Foto de perfil de ${user?.nome_completo || 'candidato'}`} />
                        </div>
                        <button className="profile-photo__edit" type="button" aria-label="Alteração de foto ainda indisponível" title="Alteração de foto ainda indisponível" disabled>+</button>
                    </div>

                    <div className="profile-hero__identity">
                        <span className="profile-eyebrow">MEU PERFIL</span>
                        <h1>{user?.nome_completo || 'Candidato'}</h1>
                        <div className="profile-hero__role">
                            <p>{profile.cargo_desejado || 'Cargo desejado não informado'}</p>
                        </div>
                        <div className="profile-hero__meta">
                            <span>{[profile.cidade, profile.estado].filter(Boolean).join(', ') || 'Localização não informada'}</span>
                        </div>
                    </div>

                    <div className="profile-hero__actions">
                        {profile.curriculo_url && <a className="profile-button profile-button--ghost" href={profile.curriculo_url} target="_blank" rel="noreferrer">Ver currículo</a>}
                        <button className="profile-button profile-button--primary" type="button" title="Edição de perfil ainda indisponível" disabled>Editar perfil</button>
                    </div>
                </div>
            </section>

            <div className="profile-container profile-layout">
                {loadError && <p className="profile-load-error" role="alert">{loadError}</p>}
                <aside className="profile-sidebar" aria-label="Informações do perfil">
                    <section className="profile-card profile-completion">
                        <div className="profile-completion__top">
                            <div>
                                <span>SEU PERFIL</span>
                                <h2>Perfil quase completo</h2>
                            </div>
                            <strong>85%</strong>
                        </div>
                        <div className="profile-completion__track" role="progressbar" aria-label="Perfil completo" aria-valuenow={85} aria-valuemin={0} aria-valuemax={100}>
                            <span />
                        </div>
                        <p>Adicione seus certificados para deixar o perfil ainda mais completo.</p>
                    </section>

                    <section className="profile-card">
                        <div className="profile-card__heading">
                            <span>CONTATO</span>
                            <h2>Informações pessoais</h2>
                        </div>
                        <dl className="profile-data-list">
                            <div><dt>E-mail</dt><dd>{user?.email || 'Não informado'}</dd></div>
                            <div><dt>Telefone</dt><dd>{profile.telefone || 'Não informado'}</dd></div>
                            <div><dt>Data de nascimento</dt><dd>{formatDate(profile.data_nascimento)}</dd></div>
                            <div><dt>Localização</dt><dd>{[profile.cidade, profile.estado].filter(Boolean).join(' - ') || 'Não informada'}</dd></div>
                        </dl>
                    </section>

                    <section className="profile-card">
                        <div className="profile-card__heading">
                            <span>PREFERÊNCIAS</span>
                            <h2>Disponibilidade</h2>
                        </div>
                        <div className="profile-preferences">
                            <div><span>Horário</span><strong>Matutino</strong></div>
                            <div><span>Trabalho</span><strong>Híbrido</strong></div>
                            <div><span>Contrato</span><strong>CLT ou PJ</strong></div>
                        </div>
                    </section>

                    <section className="profile-card" id="curriculo">
                        <div className="profile-card__heading">
                            <span>LINKS</span>
                            <h2>Presença profissional</h2>
                        </div>
                        <div className="profile-links">
                            {profile.linkedin_url && <a className="profile-link profile-link--linkedin" href={profile.linkedin_url} target="_blank" rel="noreferrer"><span>LinkedIn</span><strong>↗</strong></a>}
                            {profile.portfolio_url && <a className="profile-link profile-link--portfolio" href={profile.portfolio_url} target="_blank" rel="noreferrer"><span>Portfólio</span><strong>↗</strong></a>}
                            {profile.curriculo_url && <a className="profile-link profile-link--resume" href={profile.curriculo_url} target="_blank" rel="noreferrer"><span>Currículo</span><strong>↓</strong></a>}
                        </div>
                    </section>
                </aside>

                <div className="profile-main">
                    <section className="profile-card profile-summary">
                        <div className="profile-card__heading profile-card__heading--row">
                            <div><span>APRESENTAÇÃO</span><h2>Sobre mim</h2></div>
                        </div>
                        <p>{culture.apresentacao || 'Apresentação profissional ainda não informada.'}</p>
                    </section>

                    <section className="profile-card">
                        <div className="profile-card__heading">
                            <span>OBJETIVOS</span>
                            <h2>Áreas de interesse</h2>
                        </div>
                        <ul className="profile-tags">
                            {interests.length ? interests.map((interest) => <li className="profile-tag" key={interest.interesse_id}>{interest.nome}</li>) : <li className="profile-tag">Nenhuma área informada</li>}
                        </ul>
                    </section>

                    <section className="profile-card">
                        <div className="profile-card__heading profile-card__heading--row">
                            <div><span>COMPETÊNCIAS</span><h2>Habilidades técnicas</h2></div>
                            <small>Nível informado pelo candidato</small>
                        </div>
                        <div className="profile-skills">
                            {profileSkills.map((skill) => {
                                const level = Math.max(0, Math.min(5, Number(skill.nivel || 0))) * 20
                                return <div className="profile-skill" key={skill.habilidade_id}>
                                    <div className="profile-skill__label">
                                        <span>{skill.nome}</span>
                                        <strong>{level}%</strong>
                                    </div>
                                    <div className="profile-skill__track" role="progressbar" aria-label={skill.nome} aria-valuenow={level} aria-valuemin={0} aria-valuemax={100}>
                                        <span style={{ width: `${level}%` }} />
                                    </div>
                                </div>
                            })}
                        </div>
                    </section>

                    <section className="profile-grid">
                        <article className="profile-card">
                            <div className="profile-card__heading">
                                <span>TRAJETÓRIA</span>
                                <h2>Experiência profissional</h2>
                            </div>
                            <div className="profile-timeline">
                                {profileExperiences.map((experience) => (
                                    <div className={experience.atual ? 'is-current' : ''} key={experience.id}>
                                        <span className="profile-timeline__dot" aria-hidden="true" />
                                        <small>{formatDate(experience.data_inicio)} — {experience.atual ? 'Atualmente' : formatDate(experience.data_fim)}</small>
                                        <h3>{experience.cargo}</h3>
                                        <p>{experience.empresa}</p>
                                    </div>
                                ))}
                            </div>
                        </article>

                        <article className="profile-card">
                            <div className="profile-card__heading">
                                <span>FORMAÇÃO</span>
                                <h2>Formação acadêmica</h2>
                            </div>
                            <div className="profile-timeline profile-timeline--education">
                                {profileEducation.map((item) => (
                                    <div key={item.id}>
                                        <span className="profile-timeline__dot" aria-hidden="true" />
                                        <small>{formatDate(item.data_inicio)} — {formatDate(item.data_fim)}</small>
                                        <h3>{item.curso}</h3>
                                        <p>{item.instituicao}</p>
                                    </div>
                                ))}
                            </div>
                        </article>
                    </section>

                    {latestApplication && applicationJob && <section className="profile-card profile-application">
                        <div className="profile-card__heading profile-card__heading--row">
                            <div><span>CANDIDATURA</span><h2>Processo seletivo atual</h2></div>
                            <span className="profile-job__status">{latestApplication.status}</span>
                        </div>
                        <div className="profile-job">
                            <div className="profile-job__icon" aria-hidden="true"><JobCategoryIcon category="desenvolvimento" /></div>
                            <div className="profile-job__content">
                                <h3>{latestApplication.vaga_titulo}</h3>
                                <p>{latestApplication.vaga_contrato || 'Contrato a combinar'} <span>•</span> {latestApplication.vaga_modelo || 'Modelo a combinar'}</p>
                                <strong>{applicationJob.salary}</strong>
                            </div>
                            <button className="profile-job__button" type="button" onClick={() => setShowJobDetails(true)}>Ver vaga</button>
                        </div>
                    </section>}
                </div>
            </div>

            {showJobDetails && (
                <JobApplicationModal job={applicationJob || currentApplication} mode="details" onClose={() => setShowJobDetails(false)} />
            )}
        </main>
    )
}

export default ProfilePage
