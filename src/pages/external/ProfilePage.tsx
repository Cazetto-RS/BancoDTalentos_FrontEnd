import { useState } from 'react'
import '../../styles/ProfilePage.css'
import profileIcon from '../../assets/svgs/Profile.svg'
import JobApplicationModal from '../../components/jobs/JobApplicationModal'
import JobCategoryIcon from '../../components/jobs/JobCategoryIcon'
import type { JobModalData } from '../../types/Job'

const skills = [
    { name: 'React', level: 75 },
    { name: 'SQL', level: 70 },
    { name: 'React Native', level: 65 },
    { name: 'TypeScript', level: 60 },
    { name: 'Node.js', level: 55 },
]

const experiences = [
    { role: 'Desenvolvedor Front-end', company: 'Nome da Empresa', period: '2019 — Atualmente', current: true },
    { role: 'Desenvolvedor Júnior', company: 'Nome da Empresa', period: '2013 — 2019', current: false },
]

const education = [
    { course: 'Desenvolvimento de Software', institution: 'Fatec Tatuí', period: '2019 — 2022' },
    { course: 'Curso de especialização', institution: 'Instituição de ensino', period: '2023 — 2024' },
]

const currentApplication: JobModalData = {
    title: 'Desenvolvedor Web Sênior',
    category: 'desenvolvimento',
    salary: 'R$ 3.500,00 — R$ 4.500,00',
    details: 'PJ • Híbrido',
    description: 'Atuação no desenvolvimento e manutenção de aplicações web, trabalhando em conjunto com as equipes de produto e design.',
    skills: ['React', 'TypeScript', 'Node.js'],
}

function ProfilePage() {
    const [showJobDetails, setShowJobDetails] = useState(false)

    return (
        <main className="profile-page">
            <section className="profile-hero">

                <div className="profile-container profile-hero__content">
                    <div className="profile-photo">
                        <div className="profile-avatar">
                            <img src={profileIcon} alt="Foto de perfil de Fulano Silva Cardoso" />
                        </div>
                        <button className="profile-photo__edit" type="button" aria-label="Alterar foto do perfil">+</button>
                    </div>

                    <div className="profile-hero__identity">
                        <span className="profile-eyebrow">MEU PERFIL</span>
                        <h1>Fulano Silva Cardoso</h1>
                        <div className="profile-hero__role">
                            <p>Desenvolvedor Web</p>
                        </div>
                        <div className="profile-hero__meta">
                            <span>São Paulo, SP</span>
                            <span>Modelo híbrido</span>
                        </div>
                    </div>

                    <div className="profile-hero__actions">
                        <a className="profile-button profile-button--ghost" href="#curriculo">Ver currículo</a>
                        <button className="profile-button profile-button--primary" type="button">Editar perfil</button>
                    </div>
                </div>
            </section>

            <div className="profile-container profile-layout">
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
                            <div><dt>E-mail</dt><dd>fulano@gmail.com</dd></div>
                            <div><dt>Telefone</dt><dd>+55 11 9999-9999</dd></div>
                            <div><dt>Data de nascimento</dt><dd>06/01/1999</dd></div>
                            <div><dt>Localização</dt><dd>São Paulo - SP</dd></div>
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
                            <a className="profile-link profile-link--linkedin" href="#"><span>LinkedIn</span><strong>↗</strong></a>
                            <a className="profile-link profile-link--portfolio" href="#"><span>Portfólio</span><strong>↗</strong></a>
                            <a className="profile-link profile-link--resume" href="#"><span>Currículo</span><strong>↓</strong></a>
                        </div>
                    </section>
                </aside>

                <div className="profile-main">
                    <section className="profile-card profile-summary">
                        <div className="profile-card__heading profile-card__heading--row">
                            <div><span>APRESENTAÇÃO</span><h2>Sobre mim</h2></div>
                        </div>
                        <p>
                            Desenvolvedor Web com experiência na criação de interfaces responsivas e aplicações modernas.
                            Tenho interesse em soluções acessíveis, bem estruturadas e que entreguem uma ótima experiência ao usuário.
                        </p>
                    </section>

                    <section className="profile-card">
                        <div className="profile-card__heading">
                            <span>OBJETIVOS</span>
                            <h2>Áreas de interesse</h2>
                        </div>
                        <ul className="profile-tags">
                            <li className="profile-tag profile-tag">Desenvolvimento Web</li>
                            <li className="profile-tag profile-tag">Aplicativos Mobile</li>
                            <li className="profile-tag profile-tag-">Banco de Dados</li>
                        </ul>
                    </section>

                    <section className="profile-card">
                        <div className="profile-card__heading profile-card__heading--row">
                            <div><span>COMPETÊNCIAS</span><h2>Habilidades técnicas</h2></div>
                            <small>Nível informado pelo candidato</small>
                        </div>
                        <div className="profile-skills">
                            {skills.map((skill) => (
                                <div className="profile-skill" key={skill.name}>
                                    <div className="profile-skill__label">
                                        <span>{skill.name}</span>
                                        <strong>{skill.level}%</strong>
                                    </div>
                                    <div className="profile-skill__track" role="progressbar" aria-label={skill.name} aria-valuenow={skill.level} aria-valuemin={0} aria-valuemax={100}>
                                        <span style={{ width: `${skill.level}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="profile-grid">
                        <article className="profile-card">
                            <div className="profile-card__heading">
                                <span>TRAJETÓRIA</span>
                                <h2>Experiência profissional</h2>
                            </div>
                            <div className="profile-timeline">
                                {experiences.map((experience) => (
                                    <div className={experience.current ? 'is-current' : ''} key={`${experience.role}-${experience.period}`}>
                                        <span className="profile-timeline__dot" aria-hidden="true" />
                                        <small>{experience.period}</small>
                                        <h3>{experience.role}</h3>
                                        <p>{experience.company}</p>
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
                                {education.map((item) => (
                                    <div key={`${item.course}-${item.period}`}>
                                        <span className="profile-timeline__dot" aria-hidden="true" />
                                        <small>{item.period}</small>
                                        <h3>{item.course}</h3>
                                        <p>{item.institution}</p>
                                    </div>
                                ))}
                            </div>
                        </article>
                    </section>

                    <section className="profile-card profile-application">
                        <div className="profile-card__heading profile-card__heading--row">
                            <div><span>CANDIDATURA</span><h2>Processo seletivo atual</h2></div>
                            <span className="profile-job__status">Em análise</span>
                        </div>
                        <div className="profile-job">
                            <div className="profile-job__icon" aria-hidden="true"><JobCategoryIcon category="desenvolvimento" /></div>
                            <div className="profile-job__content">
                                <h3>Desenvolvedor Web Sênior</h3>
                                <p>Desenvolvimento Web <span>•</span> PJ <span>•</span> Híbrido</p>
                                <strong>R$ 3.500,00 — R$ 4.500,00</strong>
                            </div>
                            <button className="profile-job__button" type="button" onClick={() => setShowJobDetails(true)}>Ver vaga</button>
                        </div>
                    </section>
                </div>
            </div>

            {showJobDetails && (
                <JobApplicationModal job={currentApplication} mode="details" onClose={() => setShowJobDetails(false)} />
            )}
        </main>
    )
}

export default ProfilePage
