import { useEffect, useMemo, useRef, useState } from 'react'
import Chart from 'chart.js/auto'
import type { Plugin } from 'chart.js'
import { useOutletContext } from 'react-router-dom'
import type { AdminTheme } from '../../layouts/Admin/AdminLayout'
import AdminSummaryCards from '../../components/admin/AdminSummaryCards'
import { api } from '../../services/api'
import '../../styles/DashboardPage.css'

interface DashboardApplication { candidatura_id:number; candidatura_status:string; data_inscricao:string; candidato_id:number; candidato_nome:string; area_nome?:string; vaga_titulo?:string }
interface DashboardJob { status:string }
const STATUS_DEFINITIONS = [
    { key: 'novo', label: 'Novos', color: '#169cf9' },
    { key: 'em análise', label: 'Em análise', color: '#438bec' },
    { key: 'em triagem', label: 'Em triagem', color: '#f4a20a' },
    { key: 'contratado', label: 'Contratados', color: '#16b786' },
    { key: 'dispensado', label: 'Dispensados', color: '#ff2685' },
]

const centerTextPlugin: Plugin<'doughnut'> = {
    id: 'centerText',
    afterDraw(chart) {
        const { ctx, chartArea } = chart
        if (!chartArea) return

        ctx.save()
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--color-text').trim() || '#30303a'
        ctx.font = '700 1.25rem Inter, sans-serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        const total = chart.data.datasets[0]?.data.reduce((sum, value) => sum + Number(value || 0), 0) ?? 0
        ctx.fillText(String(total), (chartArea.left + chartArea.right) / 2, (chartArea.top + chartArea.bottom) / 2)
        ctx.restore()
    },
}

function DashboardPage() {
    const applicationsCanvasRef = useRef<HTMLCanvasElement>(null)
    const statusCanvasRef = useRef<HTMLCanvasElement>(null)
    const { theme } = useOutletContext<{ theme: AdminTheme }>()
    const [applications, setApplications] = useState<DashboardApplication[]>([])
    const [jobs, setJobs] = useState<DashboardJob[]>([])
    const [loadError, setLoadError] = useState('')

    useEffect(() => {
        Promise.all([api<DashboardApplication[]>('/candidaturas'), api<DashboardJob[]>('/vagas/admin/todas')])
            .then(([applicationRows, jobRows]) => { setApplications(applicationRows); setJobs(jobRows); setLoadError('') })
            .catch((reason) => setLoadError(reason instanceof Error ? reason.message : 'Não foi possível carregar o painel.'))
    }, [])

    const candidateStatus = useMemo(() => STATUS_DEFINITIONS.map((status) => ({ ...status, value: applications.filter((item) => item.candidatura_status === status.key).length })), [applications])
    const totalCandidates = new Set(applications.map((item) => item.candidato_id)).size
    const summaryCards = [
        { label: 'Vagas ativas', value: jobs.filter((job) => job.status === 'ativo').length, icon: 'briefcase' as const },
        { label: 'Candidatos', value: totalCandidates, icon: 'users' as const },
        { label: 'Candidaturas', value: applications.length, icon: 'clipboard' as const },
        { label: 'Contratações', value: applications.filter((item) => item.candidatura_status === 'contratado').length, icon: 'check' as const },
    ]
    const monthlyApplications = useMemo(() => {
        const months = Array.from({ length: 6 }, (_, offset) => { const date = new Date(); date.setMonth(date.getMonth() - (5 - offset)); return date })
        return { labels: months.map((date) => date.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '').toUpperCase()), values: months.map((date) => applications.filter((item) => { const created = new Date(item.data_inscricao); return created.getMonth() === date.getMonth() && created.getFullYear() === date.getFullYear() }).length) }
    }, [applications])
    const mostRequestedAreas = Object.entries(applications.reduce<Record<string, number>>((areas, item) => { const area = item.area_nome || 'Não informada'; areas[area] = (areas[area] || 0) + 1; return areas }, {})).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([name, value]) => ({ name, value }))
    const recentCandidates = applications.slice(0, 6).map((item) => ({ name: item.candidato_nome, initials: item.candidato_nome.split(/\s+/).map((part) => part[0]).slice(0, 2).join('').toUpperCase(), area: item.vaga_titulo || item.area_nome || 'Vaga não informada' }))

    useEffect(() => {
        if (!applicationsCanvasRef.current || !statusCanvasRef.current) return

        const rootStyles = getComputedStyle(document.documentElement)
        const surfaceColor = rootStyles.getPropertyValue('--color-surface').trim() || '#ffffff'
        const mutedTextColor = rootStyles.getPropertyValue('--color-text-muted').trim() || '#77757e'
        const gridColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.09)' : 'rgba(48, 48, 58, 0.08)'
        const tooltipColor = theme === 'dark' ? '#15151b' : '#292832'

        const applicationsChart = new Chart(applicationsCanvasRef.current, {
            type: 'line',
            data: {
                labels: monthlyApplications.labels,
                datasets: [{
                    label: 'Inscrições',
                    data: monthlyApplications.values,
                    borderColor: '#169cf9',
                    backgroundColor: 'rgba(22, 156, 249, 0.10)',
                    borderWidth: 3,
                    fill: true,
                    tension: .28,
                    pointRadius: 3.5,
                    pointHoverRadius: 5,
                    pointBackgroundColor: surfaceColor,
                    pointBorderColor: '#169cf9',
                    pointBorderWidth: 2,
                }],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: { intersect: false, mode: 'index' },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: tooltipColor,
                        displayColors: false,
                        padding: 10,
                    },
                },
                scales: {
                    x: {
                        grid: { display: false },
                        border: { display: false },
                        ticks: { color: mutedTextColor, font: { size: 11 }, autoSkip: true, maxTicksLimit: 10, maxRotation: 0 },
                    },
                    y: {
                        beginAtZero: true,
                        ticks: { precision: 0, color: mutedTextColor, font: { size: 11 } },
                        grid: { color: gridColor },
                        border: { display: false },
                    },
                },
            },
        })

        const statusChart = new Chart(statusCanvasRef.current, {
            type: 'doughnut',
            data: {
                labels: candidateStatus.map((status) => status.label),
                datasets: [{
                    data: candidateStatus.map((status) => status.value),
                    backgroundColor: candidateStatus.map((status) => status.color),
                    borderColor: 'transparent',
                    borderWidth: 0,
                    hoverBorderColor: 'transparent',
                    hoverBorderWidth: 0,
                    hoverOffset: 4,
                }],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '65%',
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: (context) => `${context.label}: ${context.formattedValue}`,
                        },
                    },
                },
            },
            plugins: [centerTextPlugin],
        })

        return () => {
            applicationsChart.destroy()
            statusChart.destroy()
        }
    }, [candidateStatus, monthlyApplications, theme])

    return (
        <section className="dashboard-page">
            <header className="dashboard-header">
                <h1>Dashboard</h1>
                <p>Bem-vindo ao painel administrativo da Point Media</p>
            </header>

            <AdminSummaryCards items={summaryCards} ariaLabel="Resumo do painel" />
            {loadError && <p role="alert">{loadError}</p>}

            <div className="dashboard-charts">
                <article className="dashboard-card dashboard-card--applications">
                    <header className="dashboard-card__header">
                        <h2>Evolução de inscrições</h2>
                        <p>Inscrições mensais · Último semestre</p>
                    </header>
                    <div className="dashboard-line-chart">
                        <canvas ref={applicationsCanvasRef} role="img" aria-label="Gráfico da evolução mensal de inscrições" />
                    </div>
                </article>

                <article className="dashboard-card dashboard-card--status">
                    <header className="dashboard-card__header">
                        <h2>Status dos candidatos</h2>
                        <p>Distribuição por etapa do processo</p>
                    </header>
                    <div className="dashboard-status-chart">
                        <div className="dashboard-doughnut-chart">
                            <canvas ref={statusCanvasRef} role="img" aria-label="Gráfico de status dos candidatos" />
                        </div>
                        <ul className="dashboard-status-list">
                            {candidateStatus.map((status) => (
                                <li key={status.label}>
                                    <span className="dashboard-status-list__dot" style={{ backgroundColor: status.color }} aria-hidden="true" />
                                    <strong>{status.label}</strong>
                                    <span>{status.value} ({applications.length ? ((status.value / applications.length) * 100).toFixed(1) : '0.0'}%)</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </article>
            </div>

            <div className="dashboard-bottom">
                <article className="dashboard-card">
                    <header className="dashboard-card__header dashboard-card__header--simple">
                        <h2>Áreas mais disputadas</h2>
                    </header>
                    <div className="dashboard-areas">
                        {mostRequestedAreas.map((area) => (
                            <div className="dashboard-area" key={area.name}>
                                <div><span>{area.name}</span><strong>{area.value}</strong></div>
                                <div className="dashboard-area__track"><span style={{ width: `${(area.value / Math.max(...mostRequestedAreas.map((item) => item.value), 1)) * 100}%` }} /></div>
                            </div>
                        ))}
                    </div>
                </article>

                <article className="dashboard-card">
                    <header className="dashboard-card__header dashboard-card__header--simple">
                        <h2>Últimas inscrições</h2>
                    </header>
                    <div className="dashboard-candidates">
                        {recentCandidates.map((candidate, index) => (
                            <div className="dashboard-candidate" key={`${candidate.name}-${index}`}>
                                <span className="dashboard-candidate__avatar">{candidate.initials}</span>
                                <div><strong>{candidate.name}</strong><span>{candidate.area}</span></div>
                            </div>
                        ))}
                        {!recentCandidates.length && <p>Nenhuma inscrição encontrada.</p>}
                    </div>
                </article>
            </div>
        </section>
    )
}

export default DashboardPage
