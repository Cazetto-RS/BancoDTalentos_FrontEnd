import { useEffect, useRef } from 'react'
import Chart from 'chart.js/auto'
import type { Plugin } from 'chart.js'
import { useOutletContext } from 'react-router-dom'
import type { AdminTheme } from '../../layouts/Admin/AdminLayout'
import '../../styles/DashboardPage.css'

const summaryCards = [
    {
        label: 'Vagas ativas', value: 24, icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
            <path
                d="M160-120q-33 0-56.5-23.5T80-200v-440q0-33 23.5-56.5T160-720h160v-80q0-33 23.5-56.5T400-880h160q33 0 56.5 23.5T640-800v80h160q33 0 56.5 23.5T880-640v440q0 33-23.5 56.5T800-120H160Zm240-600h160v-80H400v80Z"
            />
        </svg>
    },
    {
        label: 'Candidatos', value: 156, icon: <svg viewBox="0 0 435 435" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M217.5 217C277.423 217 326 168.423 326 108.5C326 48.5771 277.423 0 217.5 0C157.577 0 109 48.5771 109 108.5C109 168.423 157.577 217 217.5 217Z" />
            <path fill-rule="evenodd" clip-rule="evenodd" d="M217.5 245C144.909 245 0 281.371 0 353.571V435H435V353.571C435 281.371 290.091 245 217.5 245Z" />
        </svg>
    },
    {
        label: 'Candidaturas', value: 89, icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
            <path
                d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm80-160h280v-80H280v80Zm0-160h400v-80H280v80Zm0-160h400v-80H280v80Z"
            />
        </svg>
    },
    {
        label: 'Contratações', value: 12, icon: <svg viewBox="0 0 500 384" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M18.125 191.625L76 133.792L191.75 249.458L423.25 18.125L481.125 75.9583L191.75 365.125L18.125 191.625Z" stroke-width="36.25" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
    },
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
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--color-text').trim() || '#30303a'
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
    const { theme } = useOutletContext<{ theme: AdminTheme }>()

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
                        max: 65,
                        ticks: { stepSize: 13, color: mutedTextColor, font: { size: 11 } },
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
                    borderColor: surfaceColor,
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
    }, [theme])

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
                            {card.icon}
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
