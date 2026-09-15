import type { JobCategoryKey } from '../constants/jobCategories'
import type { AdminJob, JobModalData } from '../types/Job'

const STORAGE_KEY = 'banco-talentos:created-jobs'

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
})

export function createJobShareUrl(jobId: number) {
    const origin = typeof window === 'undefined' ? 'https://pointmedia.com.br' : window.location.origin
    return `${origin}/vagas-abertas?vaga=${jobId}`
}

export function getStoredJobs(): AdminJob[] {
    if (typeof window === 'undefined') return []

    try {
        const storedJobs = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '[]')
        return Array.isArray(storedJobs) ? storedJobs : []
    } catch {
        return []
    }
}

export function hasStoredJobs() {
    return typeof window !== 'undefined' && window.localStorage.getItem(STORAGE_KEY) !== null
}

export function replaceStoredJobs(jobs: AdminJob[]) {
    if (typeof window === 'undefined') return

    try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs))
    } catch {
        // A interface continua funcionando mesmo se o navegador bloquear o armazenamento local.
    }
}

function getCategoryFromArea(area: string): JobCategoryKey {
    const normalizedArea = area.toLocaleLowerCase('pt-BR')

    if (normalizedArea.includes('design') && normalizedArea.includes('ux')) return 'ux'
    if (normalizedArea.includes('design')) return 'design'
    if (normalizedArea.includes('mobile')) return 'mobile'
    if (normalizedArea.includes('dado')) return 'dados'
    if (normalizedArea.includes('devops') || normalizedArea.includes('infra')) return 'devops'
    if (normalizedArea.includes('qualidade') || normalizedArea.includes('qa')) return 'qualidade'
    if (normalizedArea.includes('seguran')) return 'seguranca'
    if (normalizedArea.includes('produto')) return 'produto'

    return 'desenvolvimento'
}

export function toPublicJob(job: AdminJob): JobModalData {
    const workModel = job.workModel.charAt(0).toLocaleUpperCase('pt-BR') + job.workModel.slice(1)

    return {
        id: job.id,
        title: job.title,
        category: getCategoryFromArea(job.area),
        salary: `${currencyFormatter.format(job.salaryMin)} - ${currencyFormatter.format(job.salaryMax)}`,
        details: `${job.contractType} • ${workModel}`,
        description: job.description,
        skills: job.skills,
    }
}
