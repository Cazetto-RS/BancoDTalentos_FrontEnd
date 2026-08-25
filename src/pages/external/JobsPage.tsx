import { useState } from 'react'
import '../../styles/externalInterface.css'
import '../../styles/JobsPage.css'
import JobApplicationModal, { type JobModalData } from '../../components/jobs/JobApplicationModal'

const jobs: JobModalData[] = [
    { title: 'Desenvolvedor Web', salary: 'R$ 3.500,00 - R$ 5.000,00', details: 'PJ • Híbrido • Pleno', skills: ['React', 'JavaScript', 'TypeScript'] },
    { title: 'Designer Gráfico', salary: 'R$ 4.500,00 - R$ 6.000,00', details: 'PJ • Híbrido • Sênior', skills: ['Adobe', 'Photoshop', 'Illustrator'] },
    { title: 'Desenvolvedor Mobile', salary: 'R$ 4.000,00 - R$ 6.500,00', details: 'CLT • Remoto • Pleno', skills: ['React Native', 'Node.js', 'MongoDB'] },
    { title: 'Analista de Dados', salary: 'R$ 5.000,00 - R$ 7.500,00', details: 'PJ • Híbrido • Sênior', skills: ['Python', 'SQL', 'Power BI'] },
    { title: 'UX/UI Designer', salary: 'R$ 4.500,00 - R$ 6.000,00', details: 'CLT • Presencial • Pleno', skills: ['Figma', 'Adobe XD', 'Prototipagem'] },
    { title: 'DevOps Engineer', salary: 'R$ 6.000,00 - R$ 9.000,00', details: 'PJ • Remoto • Sênior', skills: ['Docker', 'Kubernetes', 'AWS'] },
    { title: 'Front-end Developer', salary: 'R$ 4.000,00 - R$ 6.000,00', details: 'CLT • Híbrido • Júnior', skills: ['Vue.js', 'Tailwind', 'Nuxt'] },
    { title: 'Product Designer', salary: 'R$ 5.500,00 - R$ 8.000,00', details: 'PJ • Remoto • Sênior', skills: ['Figma', 'User Research', 'Prototyping'] },
    { title: 'Back-end Developer', salary: 'R$ 5.000,00 - R$ 7.500,00', details: 'CLT • Presencial • Pleno', skills: ['Java', 'Spring', 'PostgreSQL'] },
    { title: 'QA Engineer', salary: 'R$ 4.000,00 - R$ 6.000,00', details: 'CLT • Híbrido • Pleno', skills: ['Cypress', 'Selenium', 'Jest'] },
    { title: 'Analista de Segurança', salary: 'R$ 5.500,00 - R$ 8.500,00', details: 'PJ • Remoto • Sênior', skills: ['Cloud', 'Linux', 'SIEM'] },
    { title: 'Product Manager', salary: 'R$ 6.000,00 - R$ 9.000,00', details: 'CLT • Híbrido • Sênior', skills: ['Scrum', 'Discovery', 'Analytics'] },
]

function JobsPage() {
    const [selectedJob, setSelectedJob] = useState<JobModalData | null>(null)

    return (
        <main className="jobs">
            <section className="jobs__hero">
                <div className="jobs__container">
                    <h1 className="jobs__title">Vagas <span>Abertas</span></h1>
                    <p className="subtitle__page_left jobs__subtitle">
                        Encontre as melhores oportunidades de estágio e emprego na área de Tecnologia da Informação.<br />
                        Pesquise, filtre e candidate-se às vagas que mais combinam com seu perfil.
                    </p>

                    <div className="jobs__search-row">
                        <div className="input__Search_div jobs__search">
                            <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <path d="M15.5043 13.6153L11.7143 10.3923C11.3223 10.0393 10.9033 9.87832 10.5653 9.89332C11.5712 8.71384 12.0815 7.19085 11.9894 5.64346C11.8973 4.09606 11.2099 2.64437 10.0712 1.59256C8.93249 0.540752 7.43092 -0.0295414 5.88109 0.00117975C4.33126 0.0319009 2.85347 0.661252 1.75736 1.75736C0.661252 2.85347 0.0319009 4.33126 0.00117975 5.88109C-0.0295414 7.43092 0.540752 8.93249 1.59256 10.0712C2.64437 11.2099 4.09606 11.8973 5.64346 11.9894C7.19085 12.0815 8.71384 11.5712 9.89332 10.5653C9.87732 10.9033 10.0393 11.3223 10.3923 11.7143L13.6153 15.5043C14.1673 16.1173 15.0683 16.1693 15.6183 15.6193C16.1683 15.0693 16.1163 14.1673 15.5033 13.6163L15.5043 13.6153ZM6.00032 9.99932C4.93945 9.99932 3.92203 9.57789 3.17189 8.82774C2.42174 8.0776 2.00032 7.06018 2.00032 5.99932C2.00032 4.93845 2.42174 3.92103 3.17189 3.17089C3.92203 2.42074 4.93945 1.99932 6.00032 1.99932C7.06118 1.99932 8.0786 2.42074 8.82874 3.17089C9.57889 3.92103 10.0003 4.93845 10.0003 5.99932C10.0003 7.06018 9.57889 8.0776 8.82874 8.82774C8.0786 9.57789 7.06118 9.99932 6.00032 9.99932Z" />
                            </svg>
                            <input type="search" className="input__Search" aria-label="Pesquisar vagas" placeholder="Cargo, tecnologia ou área..." />
                        </div>
                        <button className="jobs__filter-button" type="button" aria-label="Filtrar vagas">
                            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M7 12h10M10 18h4" /></svg>
                        </button>
                    </div>
                </div>
            </section>

            <section className="jobs__list" aria-label="Vagas disponíveis">
                <div className="jobs__container jobs__grid">
                    {jobs.map((job) => (
                        <button className="job-card" type="button" key={job.title} onClick={() => setSelectedJob(job)} aria-label={`Ver detalhes da vaga ${job.title}`}>
                            <div className="job-card__icon" aria-hidden="true" />
                            <h2>{job.title}</h2>
                            <p className="job-card__salary">{job.salary}</p>
                            <p className="job-card__details">{job.details}</p>
                            <ul className="job-card__skills" aria-label="Tecnologias">
                                {job.skills.map((skill) => <li key={skill}>{skill}</li>)}
                            </ul>
                        </button>
                    ))}
                </div>
            </section>

            {selectedJob && <JobApplicationModal job={selectedJob} onClose={() => setSelectedJob(null)} />}
        </main>
    )
}

export default JobsPage
