import type { JobModalData } from '../types/Job'

export interface PublicJob extends JobModalData {
  workModel: string
  contractType: string
}
export interface JobFilters {
  search: string
  area: string
  model: string
  contract: string
}

/** Normaliza acentos para que “estagio” também encontre “Estágio”. */
export function normalizeSearch(value: string): string {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR').trim()
}

/** Os filtros são cumulativos; cada palavra pode estar em um campo diferente. */
export function filterJobs(jobs: PublicJob[], filters: JobFilters): PublicJob[] {
  const terms = normalizeSearch(filters.search).split(/\s+/).filter(Boolean)
  return jobs.filter(job => {
    const text = normalizeSearch([job.title, job.area || '', job.details, ...job.skills].join(' '))
    return terms.every(term => text.includes(term))
      && (!filters.area || job.area === filters.area)
      && (!filters.model || job.workModel === filters.model)
      && (!filters.contract || job.contractType === filters.contract)
  })
}
