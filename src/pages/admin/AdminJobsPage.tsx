import { useEffect, useMemo, useState } from 'react'
import AdminIcon, { type AdminIconName } from '../../components/admin/AdminIcon'
import AdminStatusSelect from '../../components/admin/AdminStatusSelect'
import AdminSummaryCards from '../../components/admin/AdminSummaryCards'
import JobFormModal from '../../components/admin/JobFormModal'
import JobShareModal from '../../components/admin/JobShareModal'
import ConfirmModal from '../../components/common/ConfirmModal'
import { createJobShareUrl } from '../../services/jobStorage'
import { api } from '../../services/api'
import type { AdminJob, JobStatus } from '../../types/Job'
import '../../styles/AdminJobsPage.css'

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

function mapApiJob(row: Record<string, any>): AdminJob {
    return {
        id: row.id,
        title: row.titulo,
        area: row.area_nome || 'Tecnologia',
        description: row.descricao || '',
        workModel: row.modelo_trabalho,
        contractType: row.tipo_contrato,
        salaryMin: Number(row.salario_min || 0),
        salaryMax: Number(row.salario_max || 0),
        status: row.status,
        createdAt: row.criado_em ? new Date(row.criado_em).toLocaleDateString('pt-BR') : 'Agora',
        visibility: row.visibilidade === 'privada' ? 'Privado' : 'Público',
        candidates: Number(row.candidatos || 0),
        skills: row.habilidades?.map((skill: { nome?: string }) => skill.nome).filter(Boolean) || [],
        shareUrl: createJobShareUrl(row.id),
        icon: row.icone || 'code',
        color: row.cor || '#169CF9',
    }
}

function AdminJobsPage() {
    const [jobs, setJobs] = useState<AdminJob[]>([])
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState<'todos' | JobStatus>('todos')
    const [sortBy, setSortBy] = useState<'recentes' | 'candidatos' | 'titulo'>('recentes')
    const [currentPage, setCurrentPage] = useState(1)
    const [editingJob, setEditingJob] = useState<AdminJob | null>(null)
    const [sharingJob, setSharingJob] = useState<AdminJob | null>(null)
    const [deletingJob, setDeletingJob] = useState<AdminJob | null>(null)
    const [creatingJob, setCreatingJob] = useState(false)
    const [applicantsJob, setApplicantsJob] = useState<AdminJob | null>(null)
    const [applicants, setApplicants] = useState<Array<Record<string, any>>>([])
    const [applicantsLoading, setApplicantsLoading] = useState(false)
    const [loadError, setLoadError] = useState('')
    const loadJobs = () => api<Array<Record<string, any>>>('/vagas/admin/todas').then((rows) => {
        setJobs(rows.map(mapApiJob))
        setLoadError('')
    })
    useEffect(() => {
        loadJobs().catch((reason) => {
            setJobs([])
            setLoadError(reason instanceof Error ? reason.message : 'Não foi possível carregar as vagas.')
        })
    }, [])

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

    const payload = (job: AdminJob) => ({ titulo:job.title, descricao:job.description, modelo_trabalho:job.workModel, tipo_contrato:job.contractType, salario_min:job.salaryMin, salario_max:job.salaryMax, status:job.status, icone:job.icon, cor:job.color, visibilidade:job.visibility === 'Privado' ? 'privada' : 'publica' })
    const saveEditedJob = async (job: AdminJob) => {
        const updated = await api<Record<string, any>>(`/vagas/update/${job.id}`, { method:'PUT', body:JSON.stringify(payload(job)) })
        setJobs((current) => current.map((item) => item.id === job.id ? mapApiJob({ ...updated, candidatos: item.candidates }) : item))
        setCurrentPage(1)
        setEditingJob(null)
        loadJobs().catch(() => setLoadError('A vaga foi atualizada, mas a listagem não pôde ser recarregada.'))
    }

    const createJob = async (job: AdminJob) => {
        const created = await api<Record<string, any>>('/vagas/create', { method:'POST', body:JSON.stringify(payload(job)) })
        setJobs((current) => [mapApiJob(created), ...current.filter((item) => item.id !== created.id)])
        setCurrentPage(1)
        setCreatingJob(false)
        loadJobs().catch(() => setLoadError('A vaga foi criada, mas a listagem não pôde ser atualizada.'))
    }

    const updateStatus = async (jobId: number, status: JobStatus) => {
        await api(`/vagas/update/${jobId}`, { method:'PUT', body:JSON.stringify({ status }) }); setJobs(current => current.map(job => job.id === jobId ? {...job,status} : job))
    }

    const deleteJob = async () => {
        if (!deletingJob) return
        await api(`/vagas/delete/${deletingJob.id}`, { method:'DELETE' }); setJobs(current => current.filter(job => job.id !== deletingJob.id)); setCurrentPage(1); setDeletingJob(null)
    }
    const openApplicants = async (job: AdminJob) => {
        setApplicantsJob(job); setApplicants([]); setApplicantsLoading(true)
        try { setApplicants(await api<Array<Record<string, any>>>(`/candidaturas/vaga/${job.id}`)) }
        catch (reason) { setLoadError(reason instanceof Error ? reason.message : 'Não foi possível carregar os inscritos.') }
        finally { setApplicantsLoading(false) }
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

            {loadError && <p className="admin-jobs-load-error" role="alert">{loadError}</p>}

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
                                    <span className="admin-job-row__icon" style={{ backgroundColor:`${job.color}20`, color:job.color }} aria-hidden="true"><AdminIcon name={job.icon || getJobIcon(job.area)} /></span>
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

                                <button className="admin-job-row__candidates admin-job-row__candidates--button" type="button" onClick={()=>void openApplicants(job)} aria-label={`Ver inscritos em ${job.title}`}>
                                    <strong>{job.candidates}</strong>
                                    <span>inscritos</span>
                                </button>

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
                                    <button className="admin-job-row__delete" type="button" onClick={() => setDeletingJob(job)} aria-label={`Excluir vaga ${job.title}`} title="Excluir vaga">
                                        <AdminIcon name="trash" aria-hidden="true" />
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
            {applicantsJob && <div className="admin-applicants-modal" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)setApplicantsJob(null)}}><section role="dialog" aria-modal="true" aria-labelledby="applicants-title"><header><div><span>INSCRITOS</span><h2 id="applicants-title">{applicantsJob.title}</h2></div><button type="button" onClick={()=>setApplicantsJob(null)} aria-label="Fechar">×</button></header><div className="admin-applicants-list">{applicantsLoading?<p>Carregando...</p>:applicants.map(item=><article key={item.candidatura_id}><div><strong>{item.candidato_nome}</strong><span>{item.candidato_email}</span></div><div><strong>{item.candidatura_status}</strong><span>{item.data_inscricao?new Date(item.data_inscricao).toLocaleDateString('pt-BR'):''}</span></div></article>)}{!applicantsLoading&&!applicants.length&&<p>Nenhum candidato inscrito nesta vaga.</p>}</div></section></div>}
            <ConfirmModal
                isOpen={Boolean(deletingJob)}
                title="Excluir vaga?"
                message={deletingJob ? `A vaga “${deletingJob.title}” será removida da administração e da página pública. Esta ação não pode ser desfeita.` : ''}
                icon={<AdminIcon name="trash" />}
                confirmText="Excluir vaga"
                onConfirm={deleteJob}
                onClose={() => setDeletingJob(null)}
            />
        </section>
    )
}

export default AdminJobsPage
