import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import AlertModal from '../../components/common/AlertModal'
import '../../styles/RegistrationPage.css'

const MAX_REPEATABLE_ITEMS = 5

const steps = [
    {
        label: 'Dados', icon: <svg width="32" height="37" viewBox="0 0 32 37" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 21.3333C10.6595 21.3333 0 24.6318 0 31.1795V36.1026H32V31.1795C32 24.6318 21.3405 21.3333 16 21.3333Z" />
            <path d="M16.0003 18.0513C20.985 18.0513 25.0259 14.0104 25.0259 9.02564C25.0259 4.04092 20.985 0 16.0003 0C11.0155 0 6.97461 4.04092 6.97461 9.02564C6.97461 14.0104 11.0155 18.0513 16.0003 18.0513Z" />
        </svg>
    },
    {
        label: 'Profissional', icon: <svg width="38" height="36" viewBox="0 0 38 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 36V7.57895H11.4V0H26.6V7.57895H38V36H0ZM15.2 7.57895H22.8V3.78947H15.2V7.57895Z" />
        </svg>
    },
    {
        label: 'Experiências', icon: <svg width="41" height="34" viewBox="0 0 41 34" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M37.2727 26.4444V13.4111L20.5 22.6667L0 11.3333L20.5 0L41 11.3333V26.4444H37.2727ZM20.5 34L7.45455 26.8222V17.3778L20.5 24.5556L33.5455 17.3778V26.8222L20.5 34Z" />
        </svg>
    },
    {
        label: 'Formações', icon: <svg width="30" height="37" viewBox="0 0 30 37" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.9999 10.5235L9.12008 0.808579C8.66832 0.0639279 7.7231 -0.204974 6.94468 0.181142L0.925844 3.16664C0.0987752 3.57344 -0.234833 4.56631 0.175227 5.3868L5.01254 14.9776C2.92054 17.315 1.65561 20.3901 1.65561 23.7618C1.65561 31.0704 7.63275 37 14.9999 37C22.3671 37 28.3442 31.0704 28.3442 23.7618C28.3442 20.3901 27.0723 17.315 24.9873 14.9776L29.8246 5.3868C30.2347 4.56631 29.9011 3.57344 29.0809 3.16664L23.0551 0.174247C22.2767 -0.211869 21.3246 0.063928 20.8797 0.801684L14.9999 10.5235ZM17.1406 20.3488C17.2379 20.5418 17.4186 20.6728 17.6271 20.7004L21.1091 21.2037C21.6443 21.2796 21.8528 21.9277 21.4705 22.3069L18.9476 24.7477C18.7947 24.8994 18.7252 25.1063 18.76 25.32L19.3577 28.7606C19.448 29.2846 18.892 29.6914 18.4124 29.4432L15.2988 27.816C15.1111 27.7194 14.8818 27.7194 14.6941 27.816L11.5804 29.4432C11.1009 29.6914 10.5449 29.2915 10.6352 28.7606L11.2329 25.32C11.2677 25.1132 11.1982 24.8994 11.0453 24.7477L8.52237 22.3069C8.13316 21.9346 8.34861 21.2865 8.88378 21.2037L12.3658 20.7004C12.5743 20.6728 12.762 20.5349 12.8523 20.3488L14.4092 17.2185C14.6455 16.7358 15.3335 16.7358 15.5768 17.2185L17.1336 20.3488H17.1406Z" />
        </svg>
    },
    {
        label: 'Cultura', icon: <svg width="34" height="38" viewBox="0 0 34 38" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.3361 26.2675C23.8157 24.7792 24.5556 22.99 24.5556 20.9H9.44444C9.44444 22.99 10.1843 24.7792 11.6639 26.2675C13.1435 27.7558 14.9222 28.5 17 28.5C19.0778 28.5 20.8565 27.7558 22.3361 26.2675ZM17 38C14.6389 38 12.4276 37.5491 10.3662 36.6472C8.30481 35.7453 6.51037 34.5262 4.98289 32.9897C3.45541 31.4532 2.24337 29.6482 1.34678 27.5747C0.450185 25.5012 0.00125926 23.2763 0 20.9V0H34V20.9C34 23.275 33.5517 25.4999 32.6551 27.5747C31.7585 29.6495 30.5465 31.4545 29.019 32.9897C27.4915 34.5249 25.6971 35.7441 23.6357 36.6472C21.5743 37.5503 19.3624 38.0013 17 38ZM7.55556 13.3H15.1111C15.1111 12.255 14.7415 11.3607 14.0023 10.6172C13.2631 9.87367 12.3735 9.50127 11.3333 9.5C10.2932 9.49873 9.40415 9.87113 8.66622 10.6172C7.9283 11.3633 7.55807 12.2575 7.55556 13.3ZM18.8889 13.3H26.4444C26.4444 12.255 26.0749 11.3607 25.3357 10.6172C24.5965 9.87367 23.7068 9.50127 22.6667 9.5C21.6265 9.49873 20.7375 9.87113 19.9996 10.6172C19.2616 11.3633 18.8914 12.2575 18.8889 13.3Z" />
        </svg>
    },
    {
        label: 'Competências', icon: <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.801 38L13.0448 31.92C12.6352 31.7617 12.2495 31.5717 11.8878 31.35C11.526 31.1283 11.1712 30.8908 10.8234 30.6375L5.199 33.0125L0 23.9875L4.86816 20.2825C4.83665 20.0608 4.8209 19.8474 4.8209 19.6422V18.3597C4.8209 18.1532 4.83665 17.9392 4.86816 17.7175L0 14.0125L5.199 4.9875L10.8234 7.3625C11.17 7.10917 11.5323 6.87167 11.9104 6.65C12.2886 6.42833 12.6667 6.23833 13.0448 6.08L13.801 0H24.199L24.9552 6.08C25.3648 6.23833 25.7511 6.42833 26.1141 6.65C26.4771 6.87167 26.8313 7.10917 27.1766 7.3625L32.801 4.9875L38 14.0125L33.1318 17.7175C33.1634 17.9392 33.1791 18.1532 33.1791 18.3597V19.6403C33.1791 19.8468 33.1476 20.0608 33.0846 20.2825L37.9527 23.9875L32.7537 33.0125L27.1766 30.6375C26.83 30.8908 26.4677 31.1283 26.0896 31.35C25.7114 31.5717 25.3333 31.7617 24.9552 31.92L24.199 38H13.801ZM19.0945 25.65C20.9221 25.65 22.4818 25.0008 23.7736 23.7025C25.0655 22.4042 25.7114 20.8367 25.7114 19C25.7114 17.1633 25.0655 15.5958 23.7736 14.2975C22.4818 12.9992 20.9221 12.35 19.0945 12.35C17.2355 12.35 15.6676 12.9992 14.3908 14.2975C13.1141 15.5958 12.4764 17.1633 12.4776 19C12.4789 20.8367 13.1172 22.4042 14.3927 23.7025C15.6682 25.0008 17.2355 25.65 19.0945 25.65Z" />
        </svg>
    },
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
    const [experienceCount, setExperienceCount] = useState(1)
    const [courseCompleted, setCourseCompleted] = useState<Array<'yes' | 'no' | null>>([null])
    const [skillCount, setSkillCount] = useState(3)
    const [limitModalOpen, setLimitModalOpen] = useState(false)

    const repeatableItemName = step === 3 ? 'experiências' : step === 4 ? 'formações' : 'competências'

    const addAnother = () => {
        if (step === 3) {
            if (experienceCount >= MAX_REPEATABLE_ITEMS) return setLimitModalOpen(true)
            setExperienceCount((current) => current + 1)
        }

        if (step === 4) {
            if (courseCompleted.length >= MAX_REPEATABLE_ITEMS) return setLimitModalOpen(true)
            setCourseCompleted((current) => [...current, null])
        }

        if (step === 6) {
            if (skillCount >= MAX_REPEATABLE_ITEMS) return setLimitModalOpen(true)
            setSkillCount((current) => current + 1)
        }
    }

    const removeLast = () => {
        if (step === 3) {
            setExperienceCount((current) => Math.max(1, current - 1))
        }

        if (step === 4) {
            setCourseCompleted((current) =>
                current.length > 1 ? current.slice(0, -1) : current
            )
        }

        if (step === 6) {
            setSkillCount((current) => Math.max(3, current - 1))
        }
    }

    const updateCourseCompleted = (index: number, value: 'yes' | 'no') => {
        setCourseCompleted((current) => current.map((item, itemIndex) => itemIndex === index ? value : item))
    }

    const nextStep = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (step === steps.length) setCompleted(true)
        else setStep((current) => current + 1)
    }

    if (completed) {
        return (
            <main className="registration-page registration-page--success">
                <section className="registration-success">
                    <div className="registration-success__icon" aria-hidden="true">
                        <svg viewBox="0 0 500 384" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M18.125 191.625L76 133.792L191.75 249.458L423.25 18.125L481.125 75.9583L191.75 365.125L18.125 191.625Z" strokeWidth="36.25" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>

                    </div>
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
                                        <path fillRule="evenodd" clipRule="evenodd" d="M18.125 191.625L76 133.792L191.75 249.458L423.25 18.125L481.125 75.9583L191.75 365.125L18.125 191.625Z" strokeWidth="36.25" strokeLinecap="round" strokeLinejoin="round" />
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

                        {step === 3 && <div className="registration-repeat-list">
                            {Array.from({ length: experienceCount }, (_, index) => (
                                <div className="registration-repeat-item" key={`experience-${index}`}>
                                    <Field label="Empresa" placeholder="Nome da empresa" />
                                    <Field label="Data de entrada" type="date" placeholder="DD/MM/AAAA" />
                                    <Field label="Cargo" placeholder="Cargo exercido" />
                                    <Field label="Data de saída" type="date" placeholder="Deixe vazio se ainda trabalha lá" />
                                    <label className="registration-field registration-field--wide"><span>Descrição</span><textarea placeholder="Descreva suas principais atividades" /></label>

                                    {experienceCount > 1 && index === experienceCount - 1 && (
                                        <button
                                            className="registration-remove-button"
                                            type="button"
                                            onClick={removeLast}
                                        >
                                            Remover experiência
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>}

                        {step === 4 && <div className="registration-repeat-list">
                            {courseCompleted.map((completedCourse, index) => (
                                <div className="registration-repeat-item" key={`course-${index}`}>
                                    <Field label="Curso" placeholder="Nome do curso" />
                                    <div className="registration-date-pair"><Field label="Data de entrada" type="date" placeholder="DD/MM/AAAA" /><Field label="Data de conclusão" type="date" placeholder="DD/MM/AAAA" /></div>
                                    <Field label="Instituição" placeholder="Nome da instituição" />
                                    <fieldset className="registration-options">
                                        <legend>Já concluiu o curso?</legend>
                                        <label><input type="radio" name={`completed-course-${index}`} checked={completedCourse === 'yes'} onChange={() => updateCourseCompleted(index, 'yes')} /> Sim</label>
                                        <label><input type="radio" name={`completed-course-${index}`} checked={completedCourse === 'no'} onChange={() => updateCourseCompleted(index, 'no')} /> Não</label>
                                    </fieldset>

                                    {completedCourse === 'yes' && (
                                        <label className="registration-field registration-upload">
                                            <span>Certificado</span>
                                            <input type="file" accept=".pdf" />
                                            <strong>Enviar documento em PDF</strong>
                                        </label>
                                    )}

                                    {completedCourse === 'no' && <>
                                        <Field label="Semestre atual" type="number" placeholder="Digite apenas números" />
                                        <fieldset className="registration-options">
                                            <legend>Qual é a situação atual?</legend>
                                            <label><input type="radio" name={`course-status-${index}`} /> Cursando</label>
                                            <label><input type="radio" name={`course-status-${index}`} /> Trancado</label>
                                        </fieldset>
                                        <fieldset className="registration-options">
                                            <legend>Qual período você estuda?</legend>
                                            <label><input type="checkbox" /> Manhã</label>
                                            <label><input type="checkbox" /> Tarde</label>
                                            <label><input type="checkbox" /> Noite</label>
                                        </fieldset>
                                    </>}
                                    {courseCompleted.length > 1 && index === courseCompleted.length - 1 && (
                                        <button
                                            className="registration-remove-button"
                                            type="button"
                                            onClick={removeLast}
                                        >
                                            Remover formação
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>}

                        {step === 5 && <>
                            <Field label="Motivação" placeholder="O que te motiva a trabalhar conosco?" />
                            <label className="registration-field registration-field--tall"><span>Apresentação</span><textarea placeholder="Fale um pouco sobre você" /></label>
                            <Field label="Valores" placeholder="Quais são os seus valores?" />
                            <label className="registration-field registration-upload"><span>Carta de indicação (opcional)</span><input type="file" accept=".pdf" /><strong>Enviar indicação em PDF</strong></label>
                        </>}

                        {step === 6 && <div className="registration-skills">
                            {Array.from({ length: skillCount }, (_, index) => <div className="registration-skill" key={`skill-${index}`}>
                                <Field label="Competência" placeholder="Nome da habilidade" />
                                <label className="registration-field"><span>Nível</span><select defaultValue=""><option value="" disabled>Selecione</option><option>1 - Básico</option><option>2 - Iniciante</option><option>3 - Intermediário</option><option>4 - Avançado</option><option>5 - Especialista</option></select></label>
                                <label className="registration-field"><span>Categoria</span><select defaultValue=""><option value="" disabled>Selecione</option><option>Hard skill</option><option>Soft skill</option></select></label>
                                <label className="registration-field"><span>Experiência</span><select defaultValue=""><option value="" disabled>Selecione</option><option>Júnior</option><option>Pleno</option><option>Sênior</option></select></label>
                                {skillCount > 3 && index === skillCount - 1 && (
                                    <button
                                        className="registration-remove-button"
                                        type="button"
                                        onClick={removeLast}
                                    >
                                        Remover competência
                                    </button>
                                )}
                            </div>)}
                        </div>}
                    </div>

                    <footer className="registration-actions">
                        <button className="registration-button registration-button--secondary" type="button" disabled={step === 1} onClick={() => setStep((current) => current - 1)}>Voltar</button>
                        <div>
                            {(step === 3 || step === 4 || step === 6) && <button className="registration-button registration-button--secondary" type="button" onClick={addAnother}>Adicionar outro</button>}
                            <button className="registration-button registration-button--primary" type="submit">{step === steps.length ? 'Finalizar' : 'Próximo'}</button>
                        </div>
                    </footer>
                </form>
            </section>
            <AlertModal
                isOpen={limitModalOpen}
                title="Limite atingido"
                message={`Você pode adicionar no máximo ${MAX_REPEATABLE_ITEMS} ${repeatableItemName}.`}
                onClose={() => setLimitModalOpen(false)}
            />
        </main>
    )
}

export default RegistrationPage
