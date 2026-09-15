import type { JobCategoryKey } from '../constants/jobCategories'

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
    shareUrl: string
}

export interface JobModalData {
    id?: number
    title: string
    category: JobCategoryKey
    salary: string
    details: string
    description?: string
    skills: string[]
}
