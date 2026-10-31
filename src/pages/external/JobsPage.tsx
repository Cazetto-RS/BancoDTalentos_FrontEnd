import { Fragment, useEffect, useRef, useState, type CSSProperties } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import '../../styles/externalInterface.css'
import '../../styles/JobsPage.css'
import JobApplicationModal from '../../components/jobs/JobApplicationModal'
import JobCategoryIcon from '../../components/jobs/JobCategoryIcon'
import { getJobCategoryTheme } from '../../constants/jobCategories'
import type { JobModalData } from '../../types/Job'
import { api } from '../../services/api'
import { filterJobs, type PublicJob, type JobFilters } from '../../utils/jobSearch'

interface ApiJob {
    id: number
    titulo: string
    descricao?: string
    modelo_trabalho?: string
    tipo_contrato?: string
    salario_min?: number
    salario_max?: number
    habilidades: Array<{ nome: string }>
    icone?: string
    cor?: string
    area_nome?: string
}

const iconCategory = (icon?: string): JobModalData['category'] =>
    icon === 'design' ? 'design' : icon === 'data' ? 'dados' : icon === 'mobile' ? 'mobile' : 'desenvolvimento'
const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

const fromApi = (job: ApiJob): PublicJob => ({
    workModel: job.modelo_trabalho || '',
    contractType: job.tipo_contrato || '',
    id: job.id,
    title: job.titulo,
    category: iconCategory(job.icone),
    color: job.cor,
    description: job.descricao,
    area: job.area_nome,
    salary: job.salario_min != null && job.salario_max != null
        ? `${money.format(job.salario_min)} - ${money.format(job.salario_max)}`
        : 'A combinar',
    details: `${job.tipo_contrato || 'Contrato a combinar'} • ${job.modelo_trabalho || 'Modelo a combinar'}`,
    skills: job.habilidades?.map((item) => item.nome) || [],
})

function JobsPage() {
    const [searchParams] = useSearchParams()
    const { isAuthenticated } = useAuth()
    const location = useLocation()
    const navigate = useNavigate()
    const [invitedJob, setInvitedJob] = useState<PublicJob | null>(null)
    const [invitationError, setInvitationError] = useState('')
    const [invitationLoading, setInvitationLoading] = useState(false)
    const invitation = searchParams.get('convite')
    const invitedId = searchParams.get('vaga')

    const queryKey = searchParams.toString()
    const [jobs, setJobs] = useState<PublicJob[]>([])
    const [loading, setLoading] = useState(true)
    const [loadError, setLoadError] = useState('')
    const [reloadKey, setReloadKey] = useState(0)
    const [filtersOpen, setFiltersOpen] = useState(() => ['area', 'modelo', 'contrato'].some(key => searchParams.has(key)))
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(() => window.matchMedia('(max-width: 600px)').matches ? 6 : 12)
    const listRef = useRef<HTMLElement>(null)
    const [filters, setFilters] = useState<JobFilters>(() => ({ search: searchParams.get('busca') || '', area: searchParams.get('area') || '', model: searchParams.get('modelo') || '', contract: searchParams.get('contrato') || '' }))
    const [selectedJobId, setSelectedJobId] = useState<number | null>(() => Number(searchParams.get('vaga')) || null)
    const activeFilterCount = [filters.area, filters.model, filters.contract].filter(Boolean).length
    const selectedJob = invitedJob?.id === selectedJobId ? invitedJob : jobs.find(job => job.id === selectedJobId) || null

    // Links externos e o histórico atualizam a busca. Digitar não dispara navegação.
    useEffect(() => {
        const params = new URLSearchParams(queryKey)
        setFilters({ search: params.get('busca') || '', area: params.get('area') || '', model: params.get('modelo') || '', contract: params.get('contrato') || '' })
        setSelectedJobId(Number(params.get('vaga')) || null)
        setCurrentPage(1)
    }, [queryKey])

    useEffect(() => {
        const controller = new AbortController()
        setLoading(true)
        setLoadError('')
        api<ApiJob[]>('/vagas', { signal: controller.signal }).then(data => {
            if (!controller.signal.aborted) setJobs(data.map(fromApi))
        }).catch(reason => {
            if (!controller.signal.aborted) {
                setJobs([])
                setLoadError(reason instanceof TypeError ? 'Não foi possível conectar ao servidor. Tente novamente em instantes.' : reason instanceof Error ? reason.message : 'Não foi possível carregar as vagas.')
            }
        }).finally(() => { if (!controller.signal.aborted) setLoading(false) })
        return () => controller.abort()
    }, [reloadKey])

    useEffect(() => {
        if (!invitation || !invitedId || !/^\d+$/.test(invitedId)) { setInvitedJob(null); setInvitationError(''); return }
        if (!isAuthenticated) {
            navigate('/login', { replace: true, state: { from: { pathname: location.pathname, search: location.search } } })
            return
        }
        const controller = new AbortController()
        setInvitationLoading(true); setInvitationError(''); setInvitedJob(null)
        api<ApiJob>(`/vagas/convite/${invitedId}/${encodeURIComponent(invitation)}`, { signal: controller.signal })
            .then(result => { if (!controller.signal.aborted) { setInvitedJob(fromApi(result)); setSelectedJobId(result.id) } })
            .catch(() => { if (!controller.signal.aborted) setInvitationError('Convite inválido, expirado ou vaga indisponível.') })
            .finally(() => { if (!controller.signal.aborted) setInvitationLoading(false) })
        return () => controller.abort()
    }, [invitation, invitedId, isAuthenticated, navigate, location.pathname, location.search])

    useEffect(() => {
        const media = window.matchMedia('(max-width: 600px)')
        const update = () => { setPageSize(media.matches ? 6 : 12); setCurrentPage(1) }
        media.addEventListener('change', update)
        return () => media.removeEventListener('change', update)
    }, [])

    const updateFilter = (key: keyof JobFilters, value: string) => {
        setFilters(current => ({ ...current, [key]: value }))
        setCurrentPage(1)
    }
    const clearFilters = () => {
        setFilters({ search: '', area: '', model: '', contract: '' })
        setCurrentPage(1)
    }
    const filteredJobs = filterJobs(jobs, filters)
    const totalPages = Math.ceil(filteredJobs.length / pageSize)
    const page = Math.min(currentPage, Math.max(1, totalPages))
    const visibleJobs = filteredJobs.slice((page - 1) * pageSize, page * pageSize)
    const options = (field: 'area' | 'workModel' | 'contractType') => [...new Set(jobs.map(job => job[field]).filter((value): value is string => Boolean(value)))].sort((a, b) => a.localeCompare(b, 'pt-BR'))
    const changePage = (next: number) => {
        setCurrentPage(next)
        requestAnimationFrame(() => listRef.current?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' }))
    }

    return (
        <main className="jobs page-transition">
            <section className="jobs__hero">
                <div className="jobs__container">
                    <h1 className="jobs__title">Vagas <span>Abertas</span></h1>
                    <p className="subtitle__page_left jobs__subtitle">Encontre as melhores oportunidades de estágio e emprego na área de Tecnologia da Informação.<br />Pesquise, filtre e candidate-se às vagas que mais combinam com seu perfil.</p>
                    <div className="jobs__search-row">
                        <div className="input__Search_div jobs__search">
                            <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <path d="M15.5043 13.6153L11.7143 10.3923C11.3223 10.0393 10.9033 9.87832 10.5653 9.89332C11.5712 8.71384 12.0815 7.19085 11.9894 5.64346C11.8973 4.09606 11.2099 2.64437 10.0712 1.59256C8.93249 0.540752 7.43092 -0.0295414 5.88109 0.00117975C4.33126 0.0319009 2.85347 0.661252 1.75736 1.75736C0.661252 2.85347 0.0319009 4.33126 0.00117975 5.88109C-0.0295414 7.43092 0.540752 8.93249 1.59256 10.0712C2.64437 11.2099 4.09606 11.8973 5.64346 11.9894C7.19085 12.0815 8.71384 11.5712 9.89332 10.5653C9.87732 10.9033 10.0393 11.3223 10.3923 11.7143L13.6153 15.5043C14.1673 16.1173 15.0683 16.1693 15.6183 15.6193C16.1683 15.0693 16.1163 14.1673 15.5033 13.6163L15.5043 13.6153ZM6.00032 9.99932C4.93945 9.99932 3.92203 9.57789 3.17189 8.82774C2.42174 8.0776 2.00032 7.06018 2.00032 5.99932C2.00032 4.93845 2.42174 3.92103 3.17189 3.17089C3.92203 2.42074 4.93945 1.99932 6.00032 1.99932C7.06118 1.99932 8.0786 2.42074 8.82874 3.17089C9.57889 3.92103 10.0003 4.93845 10.0003 5.99932C10.0003 7.06018 9.57889 8.0776 8.82874 8.82774C8.0786 9.57789 7.06118 9.99932 6.00032 9.99932Z" />
                            </svg>
                            <input type="search" className="input__Search" aria-label="Pesquisar vagas" placeholder="Cargo, tecnologia ou área..." value={filters.search} onChange={event => updateFilter('search', event.target.value)} />
                        </div>
                        <button className="jobs__filter-button" type="button" aria-label="Filtrar vagas" aria-expanded={filtersOpen} aria-controls="filtros-vagas" onClick={() => setFiltersOpen(open => !open)}>
                            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M7 12h10M10 18h4" /></svg>
                            <span>Filtros{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}</span>
                        </button>
                    </div>
                    {filtersOpen && <div className="jobs__filters" id="filtros-vagas">
                        <label>Área de atuação<select value={filters.area} onChange={event => updateFilter('area', event.target.value)}><option value="">Todas as áreas</option>{options('area').map(value => <option key={value}>{value}</option>)}</select></label>
                        <label>Modelo de trabalho<select value={filters.model} onChange={event => updateFilter('model', event.target.value)}><option value="">Todos os modelos</option>{options('workModel').map(value => <option key={value}>{value}</option>)}</select></label>
                        <label>Tipo de contrato<select value={filters.contract} onChange={event => updateFilter('contract', event.target.value)}><option value="">Todos os contratos</option>{options('contractType').map(value => <option key={value}>{value}</option>)}</select></label>
                    </div>}
                </div>
            </section>
            {invitationLoading && <p role="status" className="jobs__container">Carregando vaga compartilhada...</p>}
            {invitationError && <p role="alert" className="jobs__container">{invitationError}</p>}
            <section className="jobs__list" aria-label="Vagas disponíveis" aria-busy={loading} ref={listRef}>
                <div className="jobs__container jobs__result-bar">
                    <p role="status" aria-live="polite">{loading ? 'Buscando oportunidades...' : loadError ? 'Oportunidades' : `${filteredJobs.length} ${filteredJobs.length === 1 ? 'oportunidade encontrada' : 'oportunidades encontradas'}`}</p>
                    {(filters.search || activeFilterCount > 0) && <button type="button" onClick={clearFilters}>Limpar filtros</button>}
                </div>
                <div className="jobs__container jobs__grid">
                    {loading && Array.from({ length: 4 }, (_, index) => <div className="job-skeleton" key={index} aria-hidden="true"><i /><span /><span /><span /></div>)}
                    {!loading && loadError && <div className="jobs__feedback" role="alert"><h2>Não conseguimos carregar as vagas</h2><p>{loadError}</p><button type="button" onClick={() => setReloadKey(key => key + 1)}>Tentar novamente</button></div>}
                    {!loading && !loadError && !visibleJobs.length && <div className="jobs__feedback"><h2>{jobs.length ? 'Nenhuma vaga com esses filtros' : 'Novas oportunidades em breve'}</h2><p>{jobs.length ? 'Experimente outro cargo, tecnologia ou área de interesse.' : 'Você pode criar seu perfil no banco de talentos e voltar para acompanhar novas vagas.'}</p>{jobs.length ? <button type="button" onClick={clearFilters}>Limpar filtros</button> : <Link to="/cadastro">Cadastrar meu perfil</Link>}</div>}
                    {!loading && visibleJobs.map(job => {
                        const theme = getJobCategoryTheme(job.category)
                        const categoryStyle = { '--job-accent': job.color || theme.color, '--job-accent-soft': job.color && /^#[0-9a-f]{6}$/i.test(job.color) ? `${job.color}20` : theme.softColor } as CSSProperties
                        return <button className="job-card" style={categoryStyle} type="button" key={job.id} onClick={() => setSelectedJobId(job.id ?? null)} aria-label={`Ver detalhes da vaga ${job.title}`}>
                            <div className="job-card__icon" aria-hidden="true"><JobCategoryIcon category={job.category} /></div>
                            <h2>{job.title}</h2><p className="job-card__salary">{job.salary}</p><p className="job-card__details">{job.details}</p>
                            <ul className="job-card__skills" aria-label="Tecnologias">{job.skills.map(skill => <li key={skill}>{skill}</li>)}</ul>
                            <span className="job-card__cta">Ver oportunidade <span aria-hidden="true">→</span></span>
                        </button>
                    })}
                </div>
                {!loading && totalPages > 1 && <nav className="jobs__container jobs__pagination" aria-label="Navegação entre páginas de vagas">
                    <button type="button" onClick={() => changePage(page - 1)} disabled={page === 1} aria-label="Página anterior">‹</button>
                    {Array.from({ length: totalPages }, (_, index) => index + 1).filter(number => number === 1 || number === totalPages || Math.abs(number - page) <= 2).map((number, index, pages) => <Fragment key={number}>{index > 0 && number - pages[index - 1] > 1 && <span className="jobs__pagination-gap" aria-hidden="true">…</span>}<button className={number === page ? 'is-current' : ''} type="button" onClick={() => changePage(number)} aria-label={`Página ${number}`} aria-current={number === page ? 'page' : undefined}>{number}</button></Fragment>)}
                    <button type="button" onClick={() => changePage(page + 1)} disabled={page === totalPages} aria-label="Próxima página">›</button>
                </nav>}
            </section>
            {selectedJob && <JobApplicationModal job={selectedJob} invitationToken={invitedJob?.id === selectedJob.id ? (invitation || undefined) : undefined} onClose={() => setSelectedJobId(null)} />}
        </main>
    )
}
export default JobsPage
