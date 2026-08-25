import '../../styles/ProfilePage.css'
import profileIcon from '../../assets/svgs/Profile.svg'

const interests = ['React Native', 'SQL', 'Desenvolvimento Web']

const skills = [
    { name: 'React', level: 75 },
    { name: 'SQL', level: 70 },
    { name: 'React Native', level: 65 },
    { name: 'TypeScript', level: 60 },
    { name: 'Node.js', level: 55 },
]

function ProfilePage() {
    return (
        <main className="profile-page">
            <section className="profile-hero">
                <div className="profile-container profile-hero__content">
                    <div className="profile-avatar">
                        <img src={profileIcon} alt="Foto de perfil" />
                    </div>

                    <div className="profile-hero__identity">
                        <span className="profile-eyebrow">MEU PERFIL</span>
                        <h1>Fulano Silva Cardoso</h1>
                        <p>Desenvolvedor Web</p>
                    </div>

                    <button className="profile-favorite" type="button" aria-label="Adicionar perfil aos favoritos" title="Adicionar aos favoritos">
                        <span aria-hidden="true">★</span>
                    </button>
                </div>
            </section>

            <div className="profile-container profile-content">
                <section className="profile-grid profile-grid--top">
                    <article className="profile-card">
                        <div className="profile-card__heading">
                            <span>CONTATO</span>
                            <h2>Informações pessoais</h2>
                        </div>
                        <dl className="profile-data-grid">
                            <div><dt>E-mail</dt><dd>fulano@gmail.com</dd></div>
                            <div><dt>Data de nascimento</dt><dd>06/01/1999</dd></div>
                            <div><dt>Telefone</dt><dd>+55 11 9999-9999</dd></div>
                            <div><dt>Cidade</dt><dd>São Paulo - SP</dd></div>
                        </dl>
                    </article>

                    <article className="profile-card">
                        <div className="profile-card__heading">
                            <span>PREFERÊNCIAS</span>
                            <h2>Outras informações</h2>
                        </div>
                        <dl className="profile-data-grid profile-data-grid--single">
                            <div><dt>Disponibilidade de horário</dt><dd>Matutino</dd></div>
                            <div><dt>Modelo de trabalho</dt><dd>Híbrido</dd></div>
                        </dl>
                    </article>
                </section>

                <section className="profile-card profile-summary">
                    <div className="profile-card__heading">
                        <span>APRESENTAÇÃO</span>
                        <h2>Resumo profissional e links</h2>
                    </div>
                    <p>
                        Desenvolvedor Web com experiência na criação de interfaces responsivas e aplicações modernas.
                        Tenho interesse em soluções acessíveis, bem estruturadas e que entreguem uma ótima experiência ao usuário.
                    </p>
                    <div className="profile-links">
                        <a className="profile-link profile-link--linkedin" href="#">LinkedIn</a>
                        <a className="profile-link profile-link--portfolio" href="#">Portfólio</a>
                        <a className="profile-link profile-link--resume" href="#">Currículo</a>
                    </div>
                </section>

                <section className="profile-card">
                    <div className="profile-card__heading">
                        <span>OBJETIVOS</span>
                        <h2>Áreas de interesse</h2>
                    </div>
                    <ul className="profile-tags">
                        {interests.map((interest) => <li key={interest}>{interest}</li>)}
                    </ul>
                </section>

                <section className="profile-card">
                    <div className="profile-card__heading">
                        <span>COMPETÊNCIAS</span>
                        <h2>Habilidades técnicas</h2>
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
                            <div><h3>Desenvolvedor Front-end</h3><p>Nome da Empresa</p><small>2019 — Atualmente</small></div>
                            <div><h3>Desenvolvedor Júnior</h3><p>Nome da Empresa</p><small>2013 — 2019</small></div>
                        </div>
                    </article>

                    <article className="profile-card">
                        <div className="profile-card__heading">
                            <span>FORMAÇÃO</span>
                            <h2>Formação acadêmica</h2>
                        </div>
                        <div className="profile-timeline">
                            <div><h3>Desenvolvimento de Software</h3><p>Fatec Tatuí</p><small>2019 — 2022</small></div>
                            <div><h3>Curso de especialização</h3><p>Instituição de ensino</p><small>2023 — 2024</small></div>
                        </div>
                    </article>
                </section>

                <section className="profile-card profile-application">
                    <div className="profile-card__heading">
                        <span>CANDIDATURA</span>
                        <h2>Vaga de interesse</h2>
                    </div>
                    <div className="profile-job">
                        <div className="profile-job__icon" aria-hidden="true" />
                        <div><h3>Desenvolvedor Web Sênior</h3><p>Desenvolvedor Web <span>•</span> PJ <span>•</span> R$ 3.500,00 - R$ 4.500,00</p></div>
                        <span className="profile-job__status">Em análise</span>
                    </div>
                </section>
            </div>
        </main>
    )
}

export default ProfilePage
