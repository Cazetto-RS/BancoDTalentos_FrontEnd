import { useEffect, useRef } from 'react'
import Chart from 'chart.js/auto'
import type { Plugin } from 'chart.js'
import '../../styles/DashboardPage.css'

const summaryCards = [
    { label: 'Vagas ativas', value: 24, icon: 'jobs' },
    { label: 'Candidatos', value: 156, icon: 'candidates' },
    { label: 'Candidaturas', value: 89, icon: 'applications' },
    { label: 'Contratações', value: 12, icon: 'hires' },
]

const candidateStatus = [
    { label: 'Novos', value: 56, color: '#169cf9' },
    { label: 'Em triagem', value: 20, color: '#438bec' },
    { label: 'Em entrevista', value: 30, color: '#f4a20a' },
    { label: 'Em negociação', value: 10, color: '#ff2685' },
    { label: 'Contratados', value: 40, color: '#16b786' },
]

const mostRequestedAreas = [
    { name: 'Desenvolvimento Web', value: 49 },
    { name: 'Web Design', value: 20 },
    { name: 'Desenvolvedor de Software', value: 15 },
]

const recentCandidates = [
    { initials: 'NS', name: 'Nome Sobrenome', area: 'Desenvolvedor Web' },
    { initials: 'NS', name: 'Nome Sobrenome', area: 'Desenvolvedor Web' },
    { initials: 'NS', name: 'Nome Sobrenome', area: 'Desenvolvedor Web' },
    { initials: 'NS', name: 'Nome Sobrenome', area: 'Desenvolvedor Web' },
    { initials: 'NS', name: 'Nome Sobrenome', area: 'Desenvolvedor Web' },
    { initials: 'NS', name: 'Nome Sobrenome', area: 'Desenvolvedor Web' },
]

const totalCandidates = candidateStatus.reduce((total, status) => total + status.value, 0)

const centerTextPlugin: Plugin<'doughnut'> = {
    id: 'centerText',
    afterDraw(chart) {
        const { ctx, chartArea } = chart
        if (!chartArea) return

        ctx.save()
        ctx.fillStyle = '#292832'
        ctx.font = '700 1.25rem Inter, sans-serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(String(totalCandidates), (chartArea.left + chartArea.right) / 2, (chartArea.top + chartArea.bottom) / 2)
        ctx.restore()
    },
}

function DashboardPage() {
    const applicationsCanvasRef = useRef<HTMLCanvasElement>(null)
    const statusCanvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        if (!applicationsCanvasRef.current || !statusCanvasRef.current) return

        const applicationsChart = new Chart(applicationsCanvasRef.current, {
            type: 'line',
            data: {
                labels: ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT'],
                datasets: [{
                    label: 'Inscrições',
                    data: [29, 33, 36, 43, 39, 46, 49, 53, 51, 56],
                    borderColor: '#169cf9',
                    backgroundColor: 'rgba(22, 156, 249, 0.10)',
                    borderWidth: 3,
                    fill: true,
                    tension: .28,
                    pointRadius: 3.5,
                    pointHoverRadius: 5,
                    pointBackgroundColor: '#ffffff',
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
                        backgroundColor: '#292832',
                        displayColors: false,
                        padding: 10,
                    },
                },
                scales: {
                    x: {
                        grid: { display: false },
                        border: { display: false },
                        ticks: { color: '#77757e', font: { size: 11 }, autoSkip: true, maxTicksLimit: 10, maxRotation: 0 },
                    },
                    y: {
                        beginAtZero: true,
                        max: 65,
                        ticks: { stepSize: 13, color: '#77757e', font: { size: 11 } },
                        grid: { color: 'rgba(48, 48, 58, 0.08)' },
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
                    borderColor: '#ffffff',
                    borderWidth: 2,
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
    }, [])

    return (
        <section className="dashboard-page">
            <header className="dashboard-header">
                <h1>Dashboard</h1>
                <p>Bem-vindo ao painel administrativo da Point Media</p>
            </header>

            <div className="dashboard-summary" aria-label="Resumo do painel">
                {summaryCards.map((card) => (
                    <article className="dashboard-stat" key={card.label}>
                        <span className="dashboard-stat__icon" data-icon={card.icon} aria-hidden="true">
                            {/* Coloque o ícone deste indicador aqui */}
                        </span>
                        <div>
                            <span>{card.label}</span>
                            <strong>{card.value}</strong>
                        </div>
                    </article>
                ))}
            </div>

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
                                    <span>{status.value} ({((status.value / totalCandidates) * 100).toFixed(1)}%)</span>
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
                                <div className="dashboard-area__track"><span style={{ width: `${(area.value / 49) * 100}%` }} /></div>
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
                    </div>
                </article>
            </div>
        </section>
    )
}

export default DashboardPage
