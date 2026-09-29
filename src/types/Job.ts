import type { JobCategoryKey } from '../constants/jobCategories'

export type JobStatus = 'ativo' | 'pausado' | 'fechado'

export interface AdminJob {
    id: number
    title: string
    area: string
    description: string
    workModel: 'remoto' | 'hibrido' | 'presencial'
    contractType: 'CLT' | 'PJ' | 'Estágio'
    salaryMin: number
    salaryMax: number
    status: JobStatus
    createdAt: string
    visibility: 'Público' | 'Privado'
    candidates: number
    skills: string[]
    shareUrl: string
    icon: 'code' | 'design' | 'data' | 'mobile' | 'briefcase'
    color: string
}

export interface JobModalData {
    id?: number
    title: string
    category: JobCategoryKey
    salary: string
    details: string
    description?: string
    skills: string[]
    color?: string
    area?: string
}
