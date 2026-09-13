import { useMemo, useState } from 'react'
import AdminIcon, { type AdminIconName } from '../../components/admin/AdminIcon'
import AdminStatusSelect from '../../components/admin/AdminStatusSelect'
import AdminSummaryCards from '../../components/admin/AdminSummaryCards'
import JobFormModal from '../../components/admin/JobFormModal'
import JobShareModal from '../../components/admin/JobShareModal'
import '../../styles/AdminJobsPage.css'

export type JobStatus = 'ativo' | 'pausado' | 'fechado'

export interface AdminJob {
    id: number
    title: string
    area: string
    description: string
    workModel: 'remoto' | 'hibrido' | 'presencial'
    contractType: 'CLT' | 'PJ'
    salaryMin: number
    salaryMax: number
    status: JobStatus
    createdAt: string
    visibility: 'Público' | 'Interno'
    candidates: number
    skills: string[]
    formUrl: string
}

const initialJobs: AdminJob[] = [
    {
        id: 1,
        title: 'Vaga para Desenvolvedor Web Sênior',
        area: 'Desenvolvimento Web',
        description: 'Atuação no desenvolvimento e manutenção de aplicações web, trabalhando em conjunto com as equipes de produto e design.',
        workModel: 'hibrido',
        contractType: 'PJ',
        salaryMin: 3500,
        salaryMax: 4500,
        status: 'ativo',
        createdAt: '3h atrás',
        visibility: 'Público',
        candidates: 112,
        skills: ['React', 'TypeScript', 'Node.js'],
        formUrl: 'https://forms.pointmedia.com.br/vaga/desenvolvedor-web-senior',
    },
    {
        id: 2,
        title: 'Vaga para Designer de Produto',
        area: 'Design',
        description: 'Criação de interfaces, protótipos e experiências digitais alinhadas às necessidades dos usuários e do negócio.',
        workModel: 'remoto',
        contractType: 'PJ',
        salaryMin: 4000,
        salaryMax: 6000,
        status: 'pausado',
        createdAt: '1 dia atrás',
        visibility: 'Público',
        candidates: 48,
        skills: ['Figma', 'UX Research', 'Prototipagem'],
        formUrl: 'https://forms.pointmedia.com.br/vaga/designer-produto',
    },
    {
        id: 3,
        title: 'Vaga para Analista de Dados',
        area: 'Dados',
        description: 'Análise de indicadores, construção de relatórios e apoio às decisões estratégicas das áreas internas.',
        workModel: 'presencial',
        contractType: 'CLT',
        salaryMin: 3800,
        salaryMax: 5200,
        status: 'fechado',
        createdAt: '4 dias atrás',
        visibility: 'Público',
        candidates: 76,
        skills: ['SQL', 'Python', 'Power BI'],
        formUrl: 'https://forms.pointmedia.com.br/vaga/analista-dados',
    },
    {
        id: 4,
        title: 'Vaga para Desenvolvedor Mobile',
        area: 'Desenvolvimento Mobile',
        description: 'Desenvolvimento de novas funcionalidades para aplicativos móveis e evolução dos produtos existentes.',
        workModel: 'hibrido',
        contractType: 'CLT',
        salaryMin: 4200,
        salaryMax: 6500,
        status: 'ativo',
        createdAt: '1 semana atrás',
        visibility: 'Público',
        candidates: 64,
        skills: ['React Native', 'TypeScript', 'APIs REST'],
        formUrl: 'https://forms.pointmedia.com.br/vaga/desenvolvedor-mobile',
    },
]

const statusLabels: Record<JobStatus, string> = {
    ativo: 'Ativo',
    pausado: 'Pausada',
    fechado: 'Fechada',
}

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
})

function getJobIcon(area: string): AdminIconName {
    const normalizedArea = area.toLocaleLowerCase('pt-BR')

    if (normalizedArea.includes('design')) return 'design'
    if (normalizedArea.includes('dados')) return 'data'
    if (normalizedArea.includes('mobile')) return 'mobile'

    return 'code'
}

const JOBS_PER_PAGE = 6
const statusOptions = Object.entries(statusLabels).map(([value, label]) => ({ value, label }))

function AdminJobsPage() {
    const [jobs, setJobs] = useState(initialJobs)
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState<'todos' | JobStatus>('todos')
    const [sortBy, setSortBy] = useState<'recentes' | 'candidatos' | 'titulo'>('recentes')
    const [currentPage, setCurrentPage] = useState(1)
    const [editingJob, setEditingJob] = useState<AdminJob | null>(null)
    const [sharingJob, setSharingJob] = useState<AdminJob | null>(null)
    const [creatingJob, setCreatingJob] = useState(false)

    const summary = useMemo(() => ({
        total: jobs.length,
        active: jobs.filter((job) => job.status === 'ativo').length,
        paused: jobs.filter((job) => job.status === 'pausado').length,
        closed: jobs.filter((job) => job.status === 'fechado').length,
    }), [jobs])

    const filteredJobs = useMemo(() => {
        const normalizedSearch = search.trim().toLocaleLowerCase('pt-BR')

        const matchingJobs = jobs.filter((job) => {
            const matchesStatus = statusFilter === 'todos' || job.status === statusFilter
            const matchesSearch = !normalizedSearch || [job.title, job.area, ...job.skills]
                .some((value) => value.toLocaleLowerCase('pt-BR').includes(normalizedSearch))

            return matchesStatus && matchesSearch
        })

        return [...matchingJobs].sort((first, second) => {
            if (sortBy === 'candidatos') return second.candidates - first.candidates
            if (sortBy === 'titulo') return first.title.localeCompare(second.title, 'pt-BR')
            return second.id - first.id
        })
    }, [jobs, search, sortBy, statusFilter])

    const totalPages = Math.max(1, Math.ceil(filteredJobs.length / JOBS_PER_PAGE))
    const safeCurrentPage = Math.min(currentPage, totalPages)
    const paginatedJobs = filteredJobs.slice(
        (safeCurrentPage - 1) * JOBS_PER_PAGE,
        safeCurrentPage * JOBS_PER_PAGE,
    )

    const summaryCards = [
        { label: 'Total de vagas', value: summary.total, icon: 'briefcase' as const },
        { label: 'Vagas ativas', value: summary.active, icon: 'check' as const },
        { label: 'Vagas pausadas', value: summary.paused, icon: 'pause' as const },
        { label: 'Vagas fechadas', value: summary.closed, icon: 'clipboard' as const },
    ]

    const saveEditedJob = (job: AdminJob) => {
        setJobs((current) => current.map((item) => item.id === job.id ? job : item))
        setCurrentPage(1)
        setEditingJob(null)
    }

    const createJob = (job: AdminJob) => {
        setJobs((current) => [job, ...current])
        setCurrentPage(1)
        setCreatingJob(false)
    }

    const updateStatus = (jobId: number, status: JobStatus) => {
        setJobs((current) => current.map((job) => job.id === jobId ? { ...job, status } : job))
    }

    return (
        <section className="admin-jobs-page">
            <header className="admin-jobs-header">
                <div>
                    <h1>Vagas</h1>
                    <p>Crie oportunidades e acompanhe o desempenho de cada processo seletivo</p>
                </div>
                <span className="admin-jobs-header__count">{filteredJobs.length} {filteredJobs.length === 1 ? 'resultado' : 'resultados'}</span>
            </header>

            <AdminSummaryCards items={summaryCards} ariaLabel="Resumo das vagas" />

            <div className="admin-jobs-toolbar">
                <label className="admin-jobs-search">
                    <span className="sr-only">Pesquisar vagas</span>
                    <AdminIcon name="search" aria-hidden="true" />
                    <input value={search} onChange={(event) => { setSearch(event.target.value); setCurrentPage(1) }} type="search" placeholder="Cargo, tecnologia ou área..." />
                </label>

                <label className="admin-jobs-select">
                    <span>Status</span>
                    <select value={statusFilter} onChange={(event) => { setStatusFilter(event.target.value as 'todos' | JobStatus); setCurrentPage(1) }}>
                        <option value="todos">Todos os status</option>
                        <option value="ativo">Ativas</option>
                        <option value="pausado">Pausadas</option>
                        <option value="fechado">Fechadas</option>
                    </select>
                </label>

                <label className="admin-jobs-select">
                    <span>Ordenar</span>
                    <select value={sortBy} onChange={(event) => { setSortBy(event.target.value as 'recentes' | 'candidatos' | 'titulo'); setCurrentPage(1) }}>
                        <option value="recentes">Mais recentes</option>
                        <option value="candidatos">Mais candidatos</option>
                        <option value="titulo">Título da vaga</option>
                    </select>
                </label>

                <button className="admin-jobs-create" type="button" onClick={() => setCreatingJob(true)}>
                    <AdminIcon name="plus" aria-hidden="true" />
                    Criar vaga
                </button>
            </div>

            <div className="admin-jobs-results">
                <div>
                    <span>OPORTUNIDADES</span>
                    <h2>Vagas cadastradas</h2>
                </div>
                <p><strong>{filteredJobs.length}</strong> de {jobs.length} vagas exibidas</p>
            </div>

            {filteredJobs.length ? (
                <div className="admin-jobs-table" aria-live="polite">
                    <div className="admin-jobs-table__head" aria-hidden="true">
                        <span>Vaga</span>
                        <span>Regime</span>
                        <span>Status</span>
                        <span>Candidatos</span>
                        <span>Publicação</span>
                        <span>Ações</span>
                    </div>

                    <div className="admin-jobs-table__body">
                        {paginatedJobs.map((job) => (
                            <article className="admin-job-row" key={job.id}>
                                <div className="admin-job-row__identity">
                                    <span className="admin-job-row__icon" aria-hidden="true"><AdminIcon name={getJobIcon(job.area)} /></span>
                                    <div>
                                        <strong>{job.title}</strong>
                                        <span>{job.area}</span>
                                        <small>{job.description}</small>
                                    </div>
                                </div>

                                <div className="admin-job-row__regime">
                                    <strong>{job.contractType} · <span className="text-capitalize">{job.workModel}</span></strong>
                                    <span>{currencyFormatter.format(job.salaryMin)} – {currencyFormatter.format(job.salaryMax)}</span>
                                </div>

                                <AdminStatusSelect
                                    value={job.status}
                                    options={statusOptions}
                                    onChange={(status) => updateStatus(job.id, status as JobStatus)}
                                    ariaLabel={`Alterar status da vaga ${job.title}`}
                                    className={`admin-job-status admin-job-status--${job.status}`}
                                />

                                <div className="admin-job-row__candidates">
                                    <strong>{job.candidates}</strong>
                                    <span>inscritos</span>
                                </div>

                                <div className="admin-job-row__publication">
                                    <strong>{job.visibility}</strong>
                                    <span>Criada {job.createdAt}</span>
                                </div>

                                <div className="admin-job-row__actions">
                                    <button type="button" onClick={() => setSharingJob(job)} aria-label={`Compartilhar vaga ${job.title}`} title="Compartilhar vaga">
                                        <AdminIcon name="share" aria-hidden="true" />
                                    </button>
                                    <button type="button" onClick={() => setEditingJob(job)} aria-label={`Editar vaga ${job.title}`} title="Editar vaga">
                                        <AdminIcon name="edit" aria-hidden="true" />
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            ) : (
                    <div className="admin-jobs-empty">
                        <span aria-hidden="true"><AdminIcon name="search" /></span>
                        <strong>Nenhuma vaga encontrada</strong>
                        <p>Tente alterar a pesquisa ou selecionar outro status.</p>
                        <button type="button" onClick={() => { setSearch(''); setStatusFilter('todos'); setCurrentPage(1) }}>Limpar filtros</button>
                    </div>
            )}

            {filteredJobs.length > JOBS_PER_PAGE && (
                <nav className="admin-jobs-pagination" aria-label="Paginação das vagas">
                    <button type="button" onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} disabled={safeCurrentPage === 1} aria-label="Página anterior">
                        <AdminIcon name="chevron-down" className="admin-icon--previous" aria-hidden="true" />
                    </button>

                    <div className="admin-jobs-pagination__pages">
                        {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                            <button className={page === safeCurrentPage ? 'is-active' : ''} type="button" key={page} onClick={() => setCurrentPage(page)} aria-label={`Ir para a página ${page}`} aria-current={page === safeCurrentPage ? 'page' : undefined}>
                                {page}
                            </button>
                        ))}
                    </div>

                    <button type="button" onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))} disabled={safeCurrentPage === totalPages} aria-label="Próxima página">
                        <AdminIcon name="chevron-down" className="admin-icon--next" aria-hidden="true" />
                    </button>
                </nav>
            )}

            {editingJob && <JobFormModal mode="edit" job={editingJob} onClose={() => setEditingJob(null)} onSave={saveEditedJob} />}
            {creatingJob && <JobFormModal mode="create" nextId={Math.max(0, ...jobs.map((job) => job.id)) + 1} onClose={() => setCreatingJob(false)} onSave={createJob} />}
            {sharingJob && <JobShareModal job={sharingJob} onClose={() => setSharingJob(null)} />}
        </section>
    )
}

export default AdminJobsPage
