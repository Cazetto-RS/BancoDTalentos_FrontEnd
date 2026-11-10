import type { AdminCandidate } from '../types/AdminCandidate'
import { resolveUploadedUrl } from './api'

export function mapApiCandidate(row: Record<string, any>): AdminCandidate {
    return {
        id: Number(row.candidatura_id),
        userId: Number(row.usuario_id),
        fullName: row.candidato_nome || 'Candidato',
        email: row.candidato_email || '',
        phone: row.telefone || 'Não informado',
        city: row.cidade || 'Não informado',
        state: row.estado || '',
        birthDate: row.data_nascimento || '',
        photoUrl: row.url_foto || undefined,
        resumeUrl: row.curriculo_url || undefined,
        createdAt: row.candidato_criado_em || row.data_inscricao,
        application: {
            id: Number(row.candidatura_id),
            jobId: Number(row.vaga_id),
            jobTitle: row.vaga_titulo || 'Vaga removida',
            area: row.area_nome || 'Não informada',
            status: row.candidatura_status,
            favorite: Boolean(row.favorito),
            salaryExpectation: Number(row.pretensao_salarial || 0),
            availability: row.disponibilidade || 'integral',
            contractPreference: row.preferencia_contrato || 'CLT',
            workModelPreference: row.preferencia_modelo_trabalho || 'presencial',
            createdAt: row.data_inscricao,
        },
        culture: {
            motivation: row.motivacao || 'Não informado.',
            values: row.descricao_valores || 'Não informado.',
            presentation: row.apresentacao || 'Não informado.',
            recommendationUrl: row.arquivo_recomendacao || undefined,
        },
        skills: (row.habilidades || []).map((skill: Record<string, any>) => ({
            name: skill.nome,
            category: skill.categoria,
            level: Number(skill.nivel || 1),
            experienceLevel: skill.nivel_experiencia || 'junior',
        })),
        interests: row.interesses || [],
        education: (row.formacoes || []).map((education: Record<string, any>) => ({
            course: education.curso,
            institution: education.instituicao,
            currentSemester: education.semestre_atual || undefined,
            shift: education.turno || 'noite',
            status: education.status,
            startDate: education.data_inicio || '',
            endDate: education.data_fim || undefined,
            certificateUrl: education.url_certificado || undefined,
        })),
        experiences: (row.experiencias || []).map((experience: Record<string, any>) => ({
            company: experience.empresa,
            role: experience.cargo,
            description: experience.descricao || '',
            startDate: experience.data_inicio || '',
            endDate: experience.data_fim || undefined,
            current: Boolean(experience.atual),
        })),
    }
}

export async function hydrateCandidateFiles(row:Record<string,any>){
    const safe=async(value?:string)=>{try{return await resolveUploadedUrl(value)}catch{return undefined}}
    const [photo,resume,recommendation,forms]=await Promise.all([
        safe(row.url_foto),safe(row.curriculo_url),safe(row.arquivo_recomendacao),
        Promise.all((row.formacoes||[]).map(async(form:Record<string,any>)=>({...form,url_certificado:await safe(form.url_certificado)})))
    ])
    return {...row,url_foto:photo,curriculo_url:resume,arquivo_recomendacao:recommendation,formacoes:forms}
}

