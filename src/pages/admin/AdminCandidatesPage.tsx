import { useMemo, useState } from 'react'
import AdminIcon from '../../components/admin/AdminIcon'
import AdminStatusSelect from '../../components/admin/AdminStatusSelect'
import AdminSummaryCards from '../../components/admin/AdminSummaryCards'
import CandidateDetailsModal from '../../components/admin/CandidateDetailsModal'
import type { AdminCandidate, CandidateStatus } from '../../types/AdminCandidate'
import { candidateStatusLabels } from '../../types/AdminCandidate'
import '../../styles/AdminCandidatesPage.css'

const initialCandidates: AdminCandidate[] = [
    {
        id: 1,
        userId: 101,
        fullName: 'Mariana Oliveira',
        email: 'mariana.oliveira@email.com',
        phone: '+55 15 99842-1160',
        city: 'Tatuí',
        state: 'SP',
        birthDate: '1999-04-18',
        createdAt: '2026-09-08T10:30:00',
        application: {
            id: 201,
            jobId: 1,
            jobTitle: 'Desenvolvedor Web Sênior',
            area: 'Desenvolvimento Web',
            status: 'novo',
            favorite: true,
            salaryExpectation: 4500,
            availability: 'integral',
            contractPreference: 'PJ',
            workModelPreference: 'hibrido',
            createdAt: '2026-09-08T10:30:00',
        },
        culture: {
            motivation: 'Quero participar de projetos digitais que tenham impacto real para os usuários e evoluir junto com uma equipe colaborativa.',
            values: 'Transparência, responsabilidade, respeito e aprendizado contínuo são os valores que mais orientam meu trabalho.',
            presentation: 'Desenvolvedora front-end com experiência na criação de aplicações responsivas, componentes reutilizáveis e integração com APIs REST.',
            recommendationUrl: 'https://docs.pointmedia.com.br/recomendacoes/mariana-oliveira.pdf',
        },
        skills: [
            { name: 'React', category: 'hard', level: 5, experienceLevel: 'senior' },
            { name: 'TypeScript', category: 'hard', level: 4, experienceLevel: 'pleno' },
            { name: 'Comunicação', category: 'soft', level: 5, experienceLevel: 'senior' },
        ],
        interests: ['Desenvolvimento Web', 'UX/UI', 'Tecnologia'],
        education: [{ course: 'Análise e Desenvolvimento de Sistemas', institution: 'Fatec Tatuí', currentSemester: 6, shift: 'noite', status: 'cursando', startDate: '2024-02-01' }],
        experiences: [{ company: 'Studio Connect', role: 'Desenvolvedora Front-end', description: 'Desenvolvimento de interfaces em React e manutenção de design system.', startDate: '2023-03-01', current: true }],
    },
    {
        id: 2,
        userId: 102,
        fullName: 'Lucas Ferreira',
        email: 'lucas.ferreira@email.com',
        phone: '+55 11 99210-4785',
        city: 'Sorocaba',
        state: 'SP',
        birthDate: '1997-11-03',
        createdAt: '2026-09-08T09:10:00',
        application: {
            id: 202, jobId: 3, jobTitle: 'Analista de Dados', area: 'Dados', status: 'em análise', favorite: false,
            salaryExpectation: 5200, availability: 'integral', contractPreference: 'CLT', workModelPreference: 'presencial', createdAt: '2026-09-08T09:10:00',
        },
        culture: {
            motivation: 'Tenho interesse em transformar dados em informações claras que apoiem decisões de negócio.',
            values: 'Organização, ética no uso de dados e colaboração entre as áreas.',
            presentation: 'Analista de dados com domínio de SQL, Python e criação de dashboards gerenciais.',
        },
        skills: [
            { name: 'SQL', category: 'hard', level: 5, experienceLevel: 'senior' },
            { name: 'Python', category: 'hard', level: 4, experienceLevel: 'pleno' },
            { name: 'Pensamento analítico', category: 'soft', level: 5, experienceLevel: 'senior' },
        ],
        interests: ['Dados', 'Business Intelligence'],
        education: [{ course: 'Ciência de Dados', institution: 'Universidade de Sorocaba', shift: 'noite', status: 'concluido', startDate: '2020-02-01', endDate: '2023-12-15', certificateUrl: 'https://docs.pointmedia.com.br/certificados/lucas-ferreira.pdf' }],
        experiences: [{ company: 'Data Loop', role: 'Analista de BI', description: 'Criação de indicadores, consultas SQL e painéis em Power BI.', startDate: '2022-06-01', current: true }],
    },
    {
        id: 3,
        userId: 103,
        fullName: 'Camila Santos',
        email: 'camila.santos@email.com',
        phone: '+55 15 99731-2209',
        city: 'Itapetininga',
        state: 'SP',
        birthDate: '2001-02-21',
        createdAt: '2026-09-07T16:45:00',
        application: {
            id: 203, jobId: 2, jobTitle: 'Designer de Produto', area: 'Design', status: 'em triagem', favorite: true,
            salaryExpectation: 4200, availability: 'tarde', contractPreference: 'PJ', workModelPreference: 'remoto', createdAt: '2026-09-07T16:45:00',
        },
        culture: {
            motivation: 'Busco criar experiências simples e inclusivas, sempre partindo das necessidades reais das pessoas.',
            values: 'Empatia, diversidade, escuta ativa e qualidade.',
            presentation: 'Product Designer com experiência em pesquisa, prototipação e testes de usabilidade.',
        },
        skills: [
            { name: 'Figma', category: 'hard', level: 5, experienceLevel: 'senior' },
            { name: 'UX Research', category: 'hard', level: 4, experienceLevel: 'pleno' },
            { name: 'Empatia', category: 'soft', level: 5, experienceLevel: 'senior' },
        ],
        interests: ['UX/UI', 'Design de Produto', 'Pesquisa'],
        education: [{ course: 'Design Gráfico', institution: 'Centro Universitário Belas Artes', shift: 'manhã', status: 'concluido', startDate: '2019-02-01', endDate: '2022-12-01' }],
        experiences: [{ company: 'Nexo Digital', role: 'UX Designer', description: 'Pesquisa com usuários e prototipação de produtos digitais.', startDate: '2022-08-01', current: true }],
    },
    {
        id: 4,
        userId: 104,
        fullName: 'Rafael Almeida',
        email: 'rafael.almeida@email.com',
        phone: '+55 15 99648-9034',
        city: 'Boituva',
        state: 'SP',
        birthDate: '1996-08-12',
        createdAt: '2026-09-06T14:20:00',
        application: {
            id: 204, jobId: 4, jobTitle: 'Desenvolvedor Mobile', area: 'Desenvolvimento Mobile', status: 'contratado', favorite: true,
            salaryExpectation: 6000, availability: 'integral', contractPreference: 'CLT', workModelPreference: 'hibrido', createdAt: '2026-09-06T14:20:00',
        },
        culture: {
            motivation: 'Quero construir aplicativos estáveis e acessíveis que facilitem tarefas do cotidiano.',
            values: 'Compromisso, autonomia responsável e trabalho em equipe.',
            presentation: 'Desenvolvedor mobile especializado em React Native e integração com serviços web.',
        },
        skills: [
            { name: 'React Native', category: 'hard', level: 5, experienceLevel: 'senior' },
            { name: 'APIs REST', category: 'hard', level: 4, experienceLevel: 'pleno' },
            { name: 'Trabalho em equipe', category: 'soft', level: 5, experienceLevel: 'senior' },
        ],
        interests: ['Desenvolvimento Mobile', 'Tecnologia'],
        education: [{ course: 'Engenharia de Software', institution: 'Universidade Paulista', shift: 'noite', status: 'concluido', startDate: '2016-02-01', endDate: '2020-12-01' }],
        experiences: [{ company: 'Appwise', role: 'Desenvolvedor Mobile', description: 'Desenvolvimento e publicação de aplicativos multiplataforma.', startDate: '2021-01-01', current: true }],
    },
    {
        id: 5,
        userId: 105,
        fullName: 'Beatriz Costa',
        email: 'beatriz.costa@email.com',
        phone: '+55 15 99154-6628',
        city: 'Cerquilho',
        state: 'SP',
        birthDate: '2000-06-29',
        createdAt: '2026-09-05T11:05:00',
        application: {
            id: 205, jobId: 1, jobTitle: 'Desenvolvedor Web Sênior', area: 'Desenvolvimento Web', status: 'em análise', favorite: false,
            salaryExpectation: 4800, availability: 'noite', contractPreference: 'PJ', workModelPreference: 'remoto', createdAt: '2026-09-05T11:05:00',
        },
        culture: {
            motivation: 'Tenho interesse em desafios técnicos e em ambientes que valorizem troca de conhecimento.',
            values: 'Qualidade, transparência e evolução contínua.',
            presentation: 'Desenvolvedora full stack com foco em TypeScript, React e Node.js.',
        },
        skills: [
            { name: 'TypeScript', category: 'hard', level: 4, experienceLevel: 'pleno' },
            { name: 'Node.js', category: 'hard', level: 4, experienceLevel: 'pleno' },
            { name: 'Proatividade', category: 'soft', level: 4, experienceLevel: 'pleno' },
        ],
        interests: ['Desenvolvimento Web', 'Arquitetura de Software'],
        education: [{ course: 'Sistemas de Informação', institution: 'Universidade de Sorocaba', currentSemester: 7, shift: 'noite', status: 'cursando', startDate: '2023-02-01' }],
        experiences: [{ company: 'Pixel Code', role: 'Desenvolvedora Full Stack', description: 'Desenvolvimento de aplicações web e integrações com APIs.', startDate: '2024-01-01', current: true }],
    },
    {
        id: 6,
        userId: 106,
        fullName: 'João Henrique Lima',
        email: 'joao.lima@email.com',
        phone: '+55 11 99520-7812',
        city: 'São Paulo',
        state: 'SP',
        birthDate: '1998-01-15',
        createdAt: '2026-09-04T08:40:00',
        application: {
            id: 206, jobId: 3, jobTitle: 'Analista de Dados', area: 'Dados', status: 'dispensado', favorite: false,
            salaryExpectation: 7000, availability: 'integral', contractPreference: 'CLT', workModelPreference: 'hibrido', createdAt: '2026-09-04T08:40:00',
        },
        culture: {
            motivation: 'Procuro uma equipe orientada a dados onde eu possa contribuir com automações e análises preditivas.',
            values: 'Precisão, responsabilidade e objetividade.',
            presentation: 'Profissional de dados com experiência em Python, modelagem e automação de relatórios.',
        },
        skills: [
            { name: 'Python', category: 'hard', level: 5, experienceLevel: 'senior' },
            { name: 'Power BI', category: 'hard', level: 4, experienceLevel: 'pleno' },
            { name: 'Organização', category: 'soft', level: 4, experienceLevel: 'pleno' },
        ],
        interests: ['Dados', 'Inteligência Artificial'],
        education: [{ course: 'Estatística', institution: 'Universidade Estadual de Campinas', shift: 'manhã', status: 'concluido', startDate: '2017-02-01', endDate: '2021-12-01' }],
        experiences: [{ company: 'Insight Analytics', role: 'Cientista de Dados', description: 'Modelagem de dados e automação de análises recorrentes.', startDate: '2021-09-01', current: true }],
    },
    {
        id: 7,
        userId: 107,
        fullName: 'Ana Clara Souza',
        email: 'ana.souza@email.com',
        phone: '+55 15 99863-4051',
        city: 'Tatuí',
        state: 'SP',
        birthDate: '2002-09-07',
        createdAt: '2026-09-03T15:15:00',
        application: {
            id: 207, jobId: 2, jobTitle: 'Designer de Produto', area: 'Design', status: 'novo', favorite: false,
            salaryExpectation: 3500, availability: 'tarde', contractPreference: 'PJ', workModelPreference: 'remoto', createdAt: '2026-09-03T15:15:00',
        },
        culture: {
            motivation: 'Quero iniciar minha trajetória em produto digital aprendendo com profissionais experientes.',
            values: 'Curiosidade, respeito e abertura para feedback.',
            presentation: 'Designer em início de carreira com projetos acadêmicos de interface e prototipação.',
        },
        skills: [
            { name: 'Figma', category: 'hard', level: 4, experienceLevel: 'junior' },
            { name: 'Prototipagem', category: 'hard', level: 3, experienceLevel: 'junior' },
            { name: 'Criatividade', category: 'soft', level: 4, experienceLevel: 'junior' },
        ],
        interests: ['UX/UI', 'Design Gráfico'],
        education: [{ course: 'Design Digital', institution: 'Faculdade de Tecnologia de Tatuí', currentSemester: 4, shift: 'noite', status: 'cursando', startDate: '2025-02-01' }],
        experiences: [],
    },
    {
        id: 8,
        userId: 108,
        fullName: 'Gabriel Rodrigues',
        email: 'gabriel.rodrigues@email.com',
        phone: '+55 15 99447-3086',
        city: 'Itu',
        state: 'SP',
        birthDate: '1995-12-20',
        createdAt: '2026-09-02T13:50:00',
        application: {
            id: 208, jobId: 4, jobTitle: 'Desenvolvedor Mobile', area: 'Desenvolvimento Mobile', status: 'em triagem', favorite: true,
            salaryExpectation: 5800, availability: 'integral', contractPreference: 'CLT', workModelPreference: 'hibrido', createdAt: '2026-09-02T13:50:00',
        },
        culture: {
            motivation: 'Gosto de resolver problemas complexos e melhorar continuamente a experiência dos aplicativos.',
            values: 'Cooperação, consistência e responsabilidade com as entregas.',
            presentation: 'Desenvolvedor mobile com experiência em React Native, testes e publicação de aplicativos.',
            recommendationUrl: 'https://docs.pointmedia.com.br/recomendacoes/gabriel-rodrigues.pdf',
        },
        skills: [
            { name: 'React Native', category: 'hard', level: 4, experienceLevel: 'pleno' },
            { name: 'Testes', category: 'hard', level: 4, experienceLevel: 'pleno' },
            { name: 'Comunicação', category: 'soft', level: 4, experienceLevel: 'pleno' },
        ],
        interests: ['Desenvolvimento Mobile', 'Qualidade de Software'],
        education: [{ course: 'Análise e Desenvolvimento de Sistemas', institution: 'Fatec Itu', shift: 'noite', status: 'concluido', startDate: '2018-02-01', endDate: '2020-12-01' }],
        experiences: [
            { company: 'Move Apps', role: 'Desenvolvedor Mobile', description: 'Manutenção de aplicativos e implementação de testes automatizados.', startDate: '2022-02-01', current: true },
            { company: 'Web Mais', role: 'Desenvolvedor Júnior', description: 'Desenvolvimento de interfaces web responsivas.', startDate: '2020-08-01', endDate: '2022-01-01', current: false },
        ],
    },
]

const dateFormatter = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
const PAGE_SIZE = 6
const statusOptions = Object.entries(candidateStatusLabels).map(([value, label]) => ({ value, label }))

function getInitials(name: string) {
    const parts = name.trim().split(/\s+/)
    return `${parts[0]?.[0] ?? ''}${parts.at(-1)?.[0] ?? ''}`.toUpperCase()
}

function AdminCandidatesPage() {
    const [candidates, setCandidates] = useState(initialCandidates)
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState<'todos' | CandidateStatus>('todos')
    const [jobFilter, setJobFilter] = useState('todas')
    const [sortBy, setSortBy] = useState<'recentes' | 'nome' | 'status'>('recentes')
    const [favoritesOnly, setFavoritesOnly] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [selectedCandidateId, setSelectedCandidateId] = useState<number | null>(null)

    const jobs = useMemo(() => [...new Set(candidates.map((candidate) => candidate.application.jobTitle))], [candidates])

    const summary = useMemo(() => ({
        total: candidates.length,
        newCandidates: candidates.filter((candidate) => candidate.application.status === 'novo').length,
        inProcess: candidates.filter((candidate) => ['em análise', 'em triagem'].includes(candidate.application.status)).length,
        hired: candidates.filter((candidate) => candidate.application.status === 'contratado').length,
    }), [candidates])

    const filteredCandidates = useMemo(() => {
        const normalizedSearch = search.trim().toLocaleLowerCase('pt-BR')

        const filtered = candidates.filter((candidate) => {
            const searchableFields = [
                candidate.fullName,
                candidate.email,
                candidate.city,
                candidate.application.jobTitle,
                candidate.application.area,
                ...candidate.skills.map((skill) => skill.name),
            ]

            return (!normalizedSearch || searchableFields.some((field) => field.toLocaleLowerCase('pt-BR').includes(normalizedSearch)))
                && (statusFilter === 'todos' || candidate.application.status === statusFilter)
                && (jobFilter === 'todas' || candidate.application.jobTitle === jobFilter)
                && (!favoritesOnly || candidate.application.favorite)
        })

        return [...filtered].sort((first, second) => {
            if (sortBy === 'nome') return first.fullName.localeCompare(second.fullName, 'pt-BR')
            if (sortBy === 'status') return candidateStatusLabels[first.application.status].localeCompare(candidateStatusLabels[second.application.status], 'pt-BR')
            return new Date(second.application.createdAt).getTime() - new Date(first.application.createdAt).getTime()
        })
    }, [candidates, favoritesOnly, jobFilter, search, sortBy, statusFilter])

    const totalPages = Math.max(1, Math.ceil(filteredCandidates.length / PAGE_SIZE))
    const safeCurrentPage = Math.min(currentPage, totalPages)
    const paginatedCandidates = filteredCandidates.slice((safeCurrentPage - 1) * PAGE_SIZE, safeCurrentPage * PAGE_SIZE)
    const selectedCandidate = candidates.find((candidate) => candidate.id === selectedCandidateId) ?? null
    const summaryCards = [
        { label: 'Total de candidatos', value: summary.total, icon: 'users' as const },
        { label: 'Novos perfis', value: summary.newCandidates, icon: 'plus' as const },
        { label: 'Em andamento', value: summary.inProcess, icon: 'clipboard' as const },
        { label: 'Contratados', value: summary.hired, icon: 'check' as const },
    ]

    const updateCandidate = (updatedCandidate: AdminCandidate) => {
        setCandidates((current) => current.map((candidate) => candidate.id === updatedCandidate.id ? updatedCandidate : candidate))
    }

    const updateStatus = (candidateId: number, status: CandidateStatus) => {
        setCandidates((current) => current.map((candidate) => candidate.id === candidateId
            ? { ...candidate, application: { ...candidate.application, status } }
            : candidate))
    }

    const toggleFavorite = (candidateId: number) => {
        setCandidates((current) => current.map((candidate) => candidate.id === candidateId
            ? { ...candidate, application: { ...candidate.application, favorite: !candidate.application.favorite } }
            : candidate))
    }

    const clearFilters = () => {
        setSearch('')
        setStatusFilter('todos')
        setJobFilter('todas')
        setSortBy('recentes')
        setFavoritesOnly(false)
    }

    return (
        <section className="admin-candidates-page">
            <header className="admin-candidates-header">
                <div>
                    <h1>Candidatos</h1>
                    <p>Acompanhe os perfis e organize cada etapa do processo seletivo</p>
                </div>
                <span className="admin-candidates-header__count">{filteredCandidates.length} {filteredCandidates.length === 1 ? 'resultado' : 'resultados'}</span>
            </header>

            <AdminSummaryCards items={summaryCards} ariaLabel="Resumo dos candidatos" />

            <div className="admin-candidates-toolbar">
                <label className="admin-candidates-search">
                    <span className="sr-only">Pesquisar candidatos</span>
                    <AdminIcon name="search" aria-hidden="true" />
                    <input type="search" value={search} onChange={(event) => { setSearch(event.target.value); setCurrentPage(1) }} placeholder="Nome, e-mail, habilidade ou cidade..." />
                </label>

                <label className="admin-candidates-select">
                    <span>Status</span>
                    <select value={statusFilter} onChange={(event) => { setStatusFilter(event.target.value as 'todos' | CandidateStatus); setCurrentPage(1) }}>
                        <option value="todos">Todos os status</option>
                        {Object.entries(candidateStatusLabels).map(([value, label]) => <option value={value} key={value}>{label}</option>)}
                    </select>
                </label>

                <label className="admin-candidates-select">
                    <span>Vaga</span>
                    <select value={jobFilter} onChange={(event) => { setJobFilter(event.target.value); setCurrentPage(1) }}>
                        <option value="todas">Todas as vagas</option>
                        {jobs.map((job) => <option value={job} key={job}>{job}</option>)}
                    </select>
                </label>

                <label className="admin-candidates-select admin-candidates-select--sort">
                    <span>Ordenar</span>
                    <select value={sortBy} onChange={(event) => { setSortBy(event.target.value as 'recentes' | 'nome' | 'status'); setCurrentPage(1) }}>
                        <option value="recentes">Mais recentes</option>
                        <option value="nome">Nome</option>
                        <option value="status">Status</option>
                    </select>
                </label>

                <button className={`admin-candidates-favorites${favoritesOnly ? ' is-active' : ''}`} type="button" onClick={() => { setFavoritesOnly((current) => !current); setCurrentPage(1) }} aria-pressed={favoritesOnly}>
                    <AdminIcon name="star" aria-hidden="true" />
                    <span>Favoritos</span>
                </button>
            </div>

            <div className="admin-candidates-table" aria-live="polite">
                <div className="admin-candidates-table__head" aria-hidden="true">
                    <span>Candidato</span>
                    <span>Vaga de interesse</span>
                    <span>Inscrição</span>
                    <span>Status</span>
                    <span>Ações</span>
                </div>

                <div className="admin-candidates-table__body">
                    {paginatedCandidates.length ? paginatedCandidates.map((candidate) => (
                        <article className="admin-candidate-row" key={candidate.id}>
                            <div className="admin-candidate-row__person">
                                <span className="admin-candidate-avatar" aria-hidden="true">{getInitials(candidate.fullName)}</span>
                                <div>
                                    <strong>{candidate.fullName}</strong>
                                    <span>{candidate.email}</span>
                                    <small>{candidate.city} - {candidate.state}</small>
                                </div>
                            </div>

                            <div className="admin-candidate-row__job" data-label="Vaga de interesse">
                                <strong>{candidate.application.jobTitle}</strong>
                                <span>{candidate.application.area}</span>
                            </div>

                            <div className="admin-candidate-row__date" data-label="Inscrição">
                                <strong>{dateFormatter.format(new Date(candidate.application.createdAt))}</strong>
                                <span>#{String(candidate.application.id).padStart(4, '0')}</span>
                            </div>

                            <AdminStatusSelect
                                value={candidate.application.status}
                                options={statusOptions}
                                onChange={(status) => updateStatus(candidate.id, status as CandidateStatus)}
                                ariaLabel={`Alterar status de ${candidate.fullName}`}
                                className={`admin-candidate-status admin-candidate-status--${candidate.application.status.replaceAll(' ', '-').replace('á', 'a')}`}
                            />

                            <div className="admin-candidate-row__actions">
                                <button className={candidate.application.favorite ? 'is-favorite' : ''} type="button" onClick={() => toggleFavorite(candidate.id)} aria-label={candidate.application.favorite ? `Remover ${candidate.fullName} dos favoritos` : `Adicionar ${candidate.fullName} aos favoritos`} title="Favoritar candidato">
                                    <AdminIcon name="star" aria-hidden="true" />
                                </button>
                                <button type="button" onClick={() => setSelectedCandidateId(candidate.id)} aria-label={`Visualizar perfil de ${candidate.fullName}`} title="Visualizar candidato">
                                    <AdminIcon name="arrow-right" aria-hidden="true" />
                                </button>
                            </div>
                        </article>
                    )) : (
                        <div className="admin-candidates-empty">
                            <span aria-hidden="true"><AdminIcon name="search" /></span>
                            <strong>Nenhum candidato encontrado</strong>
                            <p>Não encontramos perfis com os filtros selecionados.</p>
                            <button type="button" onClick={clearFilters}>Limpar filtros</button>
                        </div>
                    )}
                </div>
            </div>

            {filteredCandidates.length > PAGE_SIZE && (
                <nav className="admin-candidates-pagination" aria-label="Paginação de candidatos">
                    <span>Página {safeCurrentPage} de {totalPages}</span>
                    <div>
                        <button type="button" onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} disabled={safeCurrentPage === 1} aria-label="Página anterior">
                            <AdminIcon name="chevron-down" className="admin-icon--previous" aria-hidden="true" />
                        </button>
                        {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                            <button className={page === safeCurrentPage ? 'is-active' : ''} type="button" onClick={() => setCurrentPage(page)} aria-current={page === safeCurrentPage ? 'page' : undefined} key={page}>{page}</button>
                        ))}
                        <button type="button" onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))} disabled={safeCurrentPage === totalPages} aria-label="Próxima página">
                            <AdminIcon name="chevron-down" className="admin-icon--next" aria-hidden="true" />
                        </button>
                    </div>
                </nav>
            )}

            {selectedCandidate && (
                <CandidateDetailsModal
                    candidate={selectedCandidate}
                    onChange={updateCandidate}
                    onClose={() => setSelectedCandidateId(null)}
                />
            )}
        </section>
    )
}

export default AdminCandidatesPage
