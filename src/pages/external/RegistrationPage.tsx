import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import '../../styles/RegistrationPage.css'

const steps = [
    { label: 'Dados', icon: '●' },
    { label: 'Profissional', icon: '■' },
    { label: 'Experiências', icon: '◆' },
    { label: 'Formações', icon: '▲' },
    { label: 'Cultura', icon: '♥' },
    { label: 'Competências', icon: '✦' },
]

const Field = ({ label, type = 'text', placeholder }: { label: string; type?: string; placeholder: string }) => (
    <label className="registration-field">
        <span>{label}</span>
        <input type={type} placeholder={placeholder} />
    </label>
)

function RegistrationPage() {
    const [step, setStep] = useState(1)
    const [completed, setCompleted] = useState(false)
    const [courseCompleted, setCourseCompleted] = useState<'yes' | 'no' | null>(null)

    const nextStep = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (step === steps.length) setCompleted(true)
        else setStep((current) => current + 1)
    }

    if (completed) {
        return (
            <main className="registration-page registration-page--success">
                <section className="registration-success">
                    <div className="registration-success__icon" aria-hidden="true">✓</div>
                    <h1>Cadastro concluído!</h1>
                    <p>Seu perfil foi criado com sucesso. Agora você já pode se candidatar às vagas e encontrar novas oportunidades.</p>
                    <div className="registration-success__actions">
                        <Link className="registration-button registration-button--secondary" to="/perfil">Ver perfil</Link>
                        <Link className="registration-button registration-button--primary" to="/vagas-abertas">Ver vagas</Link>
                    </div>
                </section>
            </main>
        )
    }

    return (
        <main className="registration-page">
            <section className="registration-card">
                <header className="registration-header">
                    <div><span>CADASTRO DE TALENTOS</span><h1>Criar perfil</h1><p>Etapa {step} de {steps.length}</p></div>
                </header>

                <ol className="registration-progress" aria-label="Progresso do cadastro">
                    {steps.map((item, index) => {
                        const position = index + 1
                        const status = position < step ? 'is-complete' : position === step ? 'is-current' : ''
                        return (
                            <li className={status} aria-current={position === step ? 'step' : undefined} key={item.label}>
                                <span className="registration-progress__icon">{position < step ? 
                                <svg viewBox="0 0 500 384" fill="none" xmlns="http://www.w3.org/2000/svg" className='svgCheck'>
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M18.125 191.625L76 133.792L191.75 249.458L423.25 18.125L481.125 75.9583L191.75 365.125L18.125 191.625Z" stroke-width="36.25" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                                    : item.icon}</span>
                                <small>{item.label}</small>
                            </li>
                        )
                    })}
                </ol>

                <form className="registration-form" onSubmit={nextStep}>
                    <div className="registration-fields">
                        {step === 1 && <>
                            <Field label="Nome completo" placeholder="Digite seu nome completo" />
                            <Field label="CEP" placeholder="00000-000" />
                            <Field label="E-mail" type="email" placeholder="E-mail pessoal" />
                            <Field label="Data de nascimento" type="date" placeholder="DD/MM/AAAA" />
                            <Field label="Senha" type="password" placeholder="Mínimo de 6 dígitos" />
                            <label className="registration-field registration-upload"><span>Foto</span><input type="file" accept="image/*" /><strong>Enviar foto pessoal</strong></label>
                            <Field label="Telefone" type="tel" placeholder="+55 (00) 00000-0000" />
                        </>}

                        {step === 2 && <>
                            <Field label="LinkedIn" type="url" placeholder="linkedin.com/in/usuario" />
                            <label className="registration-field registration-upload"><span>Currículo</span><input type="file" accept=".pdf" /><strong>Enviar currículo em PDF</strong></label>
                            <Field label="Portfólio" type="url" placeholder="https://seuportfolio.com" />
                            <Field label="Cargo desejado" placeholder="Ex.: Desenvolvedor Front-end" />
                        </>}

                        {step === 3 && <>
                            <Field label="Empresa" placeholder="Nome da empresa" />
                            <Field label="Data de entrada" type="date" placeholder="DD/MM/AAAA" />
                            <Field label="Cargo" placeholder="Cargo exercido" />
                            <Field label="Data de saída" type="date" placeholder="Deixe vazio se ainda trabalha lá" />
                            <label className="registration-field registration-field--wide"><span>Descrição</span><textarea placeholder="Descreva suas principais atividades" /></label>
                        </>}

                        {step === 4 && <>
                            <Field label="Curso" placeholder="Nome do curso" />
                            <div className="registration-date-pair"><Field label="Data de entrada" type="date" placeholder="DD/MM/AAAA" /><Field label="Data de conclusão" type="date" placeholder="DD/MM/AAAA" /></div>
                            <Field label="Instituição" placeholder="Nome da instituição" />
                            <fieldset className="registration-options">
                                <legend>Já concluiu o curso?</legend>
                                <label><input type="radio" name="completed-course" checked={courseCompleted === 'yes'} onChange={() => setCourseCompleted('yes')} /> Sim</label>
                                <label><input type="radio" name="completed-course" checked={courseCompleted === 'no'} onChange={() => setCourseCompleted('no')} /> Não</label>
                            </fieldset>

                            {courseCompleted === 'yes' && (
                                <label className="registration-field registration-upload">
                                    <span>Certificado</span>
                                    <input type="file" accept=".pdf" />
                                    <strong>Enviar documento em PDF</strong>
                                </label>
                            )}

                            {courseCompleted === 'no' && <>
                                <Field label="Semestre atual" type="number" placeholder="Digite apenas números" />
                                <fieldset className="registration-options">
                                    <legend>Qual é a situação atual?</legend>
                                    <label><input type="radio" name="course-status" /> Cursando</label>
                                    <label><input type="radio" name="course-status" /> Trancado</label>
                                </fieldset>
                                <fieldset className="registration-options">
                                    <legend>Qual período você estuda?</legend>
                                    <label><input type="checkbox" /> Manhã</label>
                                    <label><input type="checkbox" /> Tarde</label>
                                    <label><input type="checkbox" /> Noite</label>
                                </fieldset>
                            </>}
                        </>}

                        {step === 5 && <>
                            <Field label="Motivação" placeholder="O que te motiva a trabalhar conosco?" />
                            <label className="registration-field registration-field--tall"><span>Apresentação</span><textarea placeholder="Fale um pouco sobre você" /></label>
                            <Field label="Valores" placeholder="Quais são os seus valores?" />
                            <label className="registration-field registration-upload"><span>Carta de indicação (opcional)</span><input type="file" accept=".pdf" /><strong>Enviar indicação em PDF</strong></label>
                        </>}

                        {step === 6 && <div className="registration-skills">
                            {[1, 2, 3].map((item) => <div className="registration-skill" key={item}>
                                <Field label="Competência" placeholder="Nome da habilidade" />
                                <label className="registration-field"><span>Nível</span><select defaultValue=""><option value="" disabled>Selecione</option><option>1 - Básico</option><option>2 - Iniciante</option><option>3 - Intermediário</option><option>4 - Avançado</option><option>5 - Especialista</option></select></label>
                                <label className="registration-field"><span>Categoria</span><select defaultValue=""><option value="" disabled>Selecione</option><option>Hard skill</option><option>Soft skill</option></select></label>
                                <label className="registration-field"><span>Experiência</span><select defaultValue=""><option value="" disabled>Selecione</option><option>Júnior</option><option>Pleno</option><option>Sênior</option></select></label>
                            </div>)}
                        </div>}
                    </div>

                    <footer className="registration-actions">
                        <button className="registration-button registration-button--secondary" type="button" disabled={step === 1} onClick={() => setStep((current) => current - 1)}>Voltar</button>
                        <div>
                            {(step === 3 || step === 4 || step === 6) && <button className="registration-button registration-button--secondary" type="button">Adicionar outro</button>}
                            <button className="registration-button registration-button--primary" type="submit">{step === steps.length ? 'Finalizar' : 'Próximo'}</button>
                        </div>
                    </footer>
                </form>
            </section>
        </main>
    )
}

export default RegistrationPage
