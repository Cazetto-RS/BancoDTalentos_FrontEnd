import test from 'node:test'
import assert from 'node:assert/strict'
import { filterJobs, normalizeSearch } from '../src/utils/jobSearch.ts'
const jobs = [
  { id: 1, title: 'Estágio em Desenvolvimento', area: 'Tecnologia', details: 'Estágio • Híbrido', skills: ['React', 'TypeScript'], workModel: 'Híbrido', contractType: 'Estágio' },
  { id: 2, title: 'Designer de Produto', area: 'Design', details: 'CLT • Remoto', skills: ['Figma'], workModel: 'Remoto', contractType: 'CLT' },
  { id: 3, title: 'Desenvolvedor React', area: 'Tecnologia', details: 'CLT • Remoto', skills: ['React'], workModel: 'Remoto', contractType: 'CLT' },
]
const base = { search: '', area: '', model: '', contract: '' }
test('busca ignora acentos, caixa e espaços externos', () => {
  assert.equal(normalizeSearch('  ESTÁGIO  '), 'estagio')
  assert.deepEqual(filterJobs(jobs, { ...base, search: 'estagio' }).map(j => j.id), [1])
})
test('busca combina termos de campos diferentes', () => {
  assert.deepEqual(filterJobs(jobs, { ...base, search: 'react hibrido' }).map(j => j.id), [1])
})
test('área, modelo e contrato restringem em conjunto', () => {
  assert.deepEqual(filterJobs(jobs, { ...base, area: 'Tecnologia', model: 'Remoto', contract: 'CLT' }).map(j => j.id), [3])
})
test('combinação sem resultado não exibe vagas incompatíveis', () => {
  assert.deepEqual(filterJobs(jobs, { ...base, area: 'Design', model: 'Híbrido' }), [])
})
test('limpar filtros devolve todas as vagas e não altera a lista original', () => {
  assert.equal(filterJobs(jobs, base).length, 3)
  assert.equal(jobs.length, 3)
  assert.deepEqual(filterJobs([], base), [])
})
