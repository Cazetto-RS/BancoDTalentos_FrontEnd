export type CandidateStatus = 'novo' | 'em análise' | 'em triagem' | 'contratado' | 'dispensado'

export interface CandidateSkill {
    name: string
    category: 'hard' | 'soft'
    level: number
    experienceLevel: 'junior' | 'pleno' | 'senior' | 'especialista'
}

export interface CandidateEducation {
    course: string
    institution: string
    currentSemester?: number
    shift: 'manhã' | 'tarde' | 'noite'
    status: 'cursando' | 'concluido' | 'trancado'
    startDate: string
    endDate?: string
    certificateUrl?: string
}

export interface CandidateExperience {
    company: string
    role: string
    description: string
    startDate: string
    endDate?: string
    current: boolean
}

export interface AdminCandidate {
    id: number
    userId: number
    fullName: string
    email: string
    phone: string
    city: string
    state: string
    birthDate: string
    photoUrl?: string
    createdAt: string
    application: {
        id: number
        jobId: number
        jobTitle: string
        area: string
        status: CandidateStatus
        favorite: boolean
        salaryExpectation: number
        availability: 'manhã' | 'tarde' | 'noite' | 'integral'
        contractPreference: 'CLT' | 'PJ' | 'Estágio'
        workModelPreference: 'remoto' | 'hibrido' | 'presencial'
        createdAt: string
    }
    culture: {
        motivation: string
        values: string
        presentation: string
        recommendationUrl?: string
    }
    skills: CandidateSkill[]
    interests: string[]
    education: CandidateEducation[]
    experiences: CandidateExperience[]
}

export const candidateStatusLabels: Record<CandidateStatus, string> = {
    novo: 'Novo',
    'em análise': 'Em análise',
    'em triagem': 'Em triagem',
    contratado: 'Contratado',
    dispensado: 'Dispensado',
}
