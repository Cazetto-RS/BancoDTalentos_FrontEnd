import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import '../../styles/externalInterface.css'
import '../../styles/JobsPage.css'
import JobApplicationModal from '../../components/jobs/JobApplicationModal'
import JobCategoryIcon from '../../components/jobs/JobCategoryIcon'
import { getJobCategoryTheme } from '../../constants/jobCategories'
import type { JobModalData } from '../../types/Job'
import { api } from '../../services/api'

interface ApiJob { id:number; titulo:string; descricao?:string; modelo_trabalho?:string; tipo_contrato?:string; salario_min?:number; salario_max?:number; habilidades:Array<{nome:string}> }
const money = new Intl.NumberFormat('pt-BR', { style:'currency', currency:'BRL' })
const fromApi = (job: ApiJob): JobModalData => ({
    id: job.id, title: job.titulo, category: 'desenvolvimento', description: job.descricao,
    salary: job.salario_min != null && job.salario_max != null ? `${money.format(job.salario_min)} - ${money.format(job.salario_max)}` : 'A combinar',
    details: `${job.tipo_contrato || 'Contrato a combinar'} • ${job.modelo_trabalho || 'Modelo a combinar'}`,
    skills: job.habilidades?.map((item) => item.nome) || [],
})

const DESKTOP_PAGE_SIZE = 12
const MOBILE_PAGE_SIZE = 6
const MOBILE_BREAKPOINT = '(max-width: 600px)'

function JobsPage() {
    const [selectedJob, setSelectedJob] = useState<JobModalData | null>(null)
    const [jobs, setJobs] = useState<JobModalData[]>([])
    const [search, setSearch] = useState('')
    const [loadError, setLoadError] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(() => window.matchMedia(MOBILE_BREAKPOINT).matches ? MOBILE_PAGE_SIZE : DESKTOP_PAGE_SIZE)
    const listRef = useRef<HTMLElement>(null)

    useEffect(() => {
        api<ApiJob[]>('/vagas').then((data) => {
            const mapped = data.map(fromApi); setJobs(mapped); setCurrentPage(1); setLoadError('')
            const requested = Number(new URLSearchParams(location.search).get('vaga'))
            if (requested) setSelectedJob(mapped.find((job) => job.id === requested) || null)
        }).catch((reason) => {
            setJobs([])
            setLoadError(reason instanceof Error ? reason.message : 'Não foi possível carregar as vagas.')
        })
    }, [])

    useEffect(() => {
        const mediaQuery = window.matchMedia(MOBILE_BREAKPOINT)
        const updatePageSize = (event: MediaQueryListEvent) => {
            setPageSize(event.matches ? MOBILE_PAGE_SIZE : DESKTOP_PAGE_SIZE)
            setCurrentPage(1)
        }

        mediaQuery.addEventListener('change', updatePageSize)
        return () => mediaQuery.removeEventListener('change', updatePageSize)
    }, [])


    const normalizedSearch = search.trim().toLocaleLowerCase('pt-BR')
    const filteredJobs = jobs.filter((job) => !normalizedSearch || [job.title, job.details, ...job.skills]
        .some((value) => value.toLocaleLowerCase('pt-BR').includes(normalizedSearch)))
    const totalPages = Math.ceil(filteredJobs.length / pageSize)
    const firstJobIndex = (currentPage - 1) * pageSize
    const visibleJobs = filteredJobs.slice(firstJobIndex, firstJobIndex + pageSize)

    const changePage = (page: number) => {
        setCurrentPage(page)
        requestAnimationFrame(() => listRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
    }

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
                            <input type="search" className="input__Search" aria-label="Pesquisar vagas" placeholder="Cargo, tecnologia ou área..." value={search} onChange={(event) => { setSearch(event.target.value); setCurrentPage(1) }} />
                        </div>
                        <button className="jobs__filter-button" type="button" aria-label="Filtrar vagas">
                            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M7 12h10M10 18h4" /></svg>
                        </button>
                    </div>
                </div>
            </section>

            <section className="jobs__list" aria-label="Vagas disponíveis" ref={listRef}>
                <div className="jobs__container jobs__grid">
                    {loadError && <p className="jobs__feedback" role="alert">{loadError}</p>}
                    {!loadError && !visibleJobs.length && <p className="jobs__feedback">Nenhuma vaga encontrada.</p>}
                    {visibleJobs.map((job, index) => {
                        const theme = getJobCategoryTheme(job.category)
                        const categoryStyle = {
                            '--job-accent': theme.color,
                            '--job-accent-soft': theme.softColor,
                        } as CSSProperties

                        return (
                            <button className="job-card" style={categoryStyle} type="button" key={`${job.title}-${firstJobIndex + index}`} onClick={() => setSelectedJob(job)} aria-label={`Ver detalhes da vaga ${job.title}`}>
                                <div className="job-card__icon" aria-hidden="true"><JobCategoryIcon category={job.category} /></div>
                                <h2>{job.title}</h2>
                                <p className="job-card__salary">{job.salary}</p>
                                <p className="job-card__details">{job.details}</p>
                                <ul className="job-card__skills" aria-label="Tecnologias">
                                    {job.skills.map((skill) => <li key={skill}>{skill}</li>)}
                                </ul>
                            </button>
                        )
                    })}
                </div>

                {totalPages > 1 && (
                    <nav className="jobs__container jobs__pagination" aria-label="Navegação entre páginas de vagas">
                        <button type="button" onClick={() => changePage(currentPage - 1)} disabled={currentPage === 1} aria-label="Página anterior">‹</button>
                        {Array.from({ length: totalPages }, (_, index) => {
                            const page = index + 1
                            return <button className={page === currentPage ? 'is-current' : ''} type="button" onClick={() => changePage(page)} aria-current={page === currentPage ? 'page' : undefined} key={page}>{page}</button>
                        })}
                        <button type="button" onClick={() => changePage(currentPage + 1)} disabled={currentPage === totalPages} aria-label="Próxima página">›</button>
                    </nav>
                )}
            </section>

            {selectedJob && <JobApplicationModal job={selectedJob} onClose={() => setSelectedJob(null)} />}
        </main>
    )
}

export default JobsPage
