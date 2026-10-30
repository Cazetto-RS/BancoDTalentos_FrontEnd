import { PasswordVisibilityIcon } from '../../components/common/InterfaceIcons'
import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useLocation } from 'react-router-dom'
import AlertModal from '../../components/common/AlertModal'
import { useAuth } from '../../contexts/AuthContext'
import { api, uploadFile } from '../../services/api'
import type { UploadType } from '../../services/api'
import '../../styles/RegistrationPage.css'

const MAX_REPEATABLE_ITEMS = 5
const PREDEFINED_AREAS = ['Desenvolvimento Web','Desenvolvimento Mobile','Dados e BI','Design e UX','Marketing Digital','Recursos Humanos','Gestão de Projetos','Infraestrutura e Cloud','Segurança da Informação','Qualidade de Software','Atendimento e Sucesso do Cliente','Financeiro','Comercial','Inteligência Artificial','Produto']
const PREDEFINED_SKILLS = ['JavaScript','TypeScript','React','Node.js','Java','Spring Boot','Python','SQL','Power BI','Figma','UX Research','React Native','Docker','AWS','Git','Testes automatizados','Excel avançado','SEO','Google Ads','Scrum','Comunicação','Trabalho em equipe','Organização','Liderança','Criatividade','Pensamento analítico','Resolução de problemas','Proatividade','Empatia','Adaptabilidade']

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
    { label: 'Privacidade', icon: <svg width="34" height="38" viewBox="0 0 24 24"><path d="M12 2 4 5v6c0 5.1 3.4 9.8 8 11 4.6-1.2 8-5.9 8-11V5l-8-3Zm0 4a3 3 0 0 1 3 3v1h1v7H8v-7h1V9a3 3 0 0 1 3-3Zm0 2a1 1 0 0 0-1 1v1h2V9a1 1 0 0 0-1-1Z"/></svg> },
]

const Field = ({ label, name, type = 'text', placeholder, required = false, defaultValue, onBlur }: { label: string; name: string; type?: string; placeholder: string; required?: boolean; defaultValue?: string; onBlur?: React.FocusEventHandler<HTMLInputElement> }) => (
    <label className="registration-field">
        <span>{label}{required && <span className="registration-required" aria-hidden="true"> *</span>}</span>
        <input name={name} type={type} placeholder={placeholder} required={required} defaultValue={defaultValue} onBlur={onBlur} />
    </label>
)

const UploadField = ({ label, accept, file, currentValue, maxMb, onSelect }: { label:string; accept:string; file?:File; currentValue?:string; maxMb:number; onSelect:(file?:File)=>void }) => (
    <div className="registration-field">
        <span>{label}</span>
        <label className="registration-upload">
            <input type="file" aria-label={label} accept={accept} onChange={(event)=>onSelect(event.target.files?.[0])}/>
            <strong>{file ? 'Trocar arquivo' : currentValue ? 'Substituir arquivo' : 'Selecionar arquivo'}</strong>
        </label>
        <small className="registration-upload__status">{file ? file.name : currentValue ? 'Arquivo já enviado' : `Até ${maxMb} MB`}</small>
    </div>
)

function RegistrationPage() {
    const { login, acceptSession, user, updateUser } = useAuth()
    const location = useLocation()
    const editMode = location.pathname === '/perfil/editar'
    const [step, setStep] = useState(1)
    const headerRef = useRef<HTMLHeadingElement>(null)
    const previousStep = useRef(1)
    useEffect(() => {
        if (previousStep.current !== step) {
            previousStep.current = step
            headerRef.current?.focus({ preventScroll: true })
            headerRef.current?.scrollIntoView({ block: 'start', behavior: 'instant' })
        }
    }, [step])
    const [completed, setCompleted] = useState(false)
    const [experienceCount, setExperienceCount] = useState(1)
    const [courseCompleted, setCourseCompleted] = useState<Array<'yes' | 'no' | null>>([null])
    const [skillCount, setSkillCount] = useState(3)
    const [selectedAreas,setSelectedAreas]=useState<string[]>([])
    const [limitModalOpen, setLimitModalOpen] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState('')
    const [addressVersion, setAddressVersion] = useState(0)
    const [values, setValues] = useState<Record<string, string>>({})
    const [showPassword,setShowPassword]=useState(false)
    const [selectedFiles,setSelectedFiles]=useState<Record<string,File|undefined>>({})
    const [savingStage,setSavingStage]=useState('')
    const [awaitingVerification,setAwaitingVerification]=useState(false)
    const [verificationCode,setVerificationCode]=useState('')
    const [resendSeconds,setResendSeconds]=useState(0)
    const uploadedPaths=useRef<Record<string,string>>({})
    const savedStages = useRef({ registered: false, loggedIn: false, profile: false, culture: false, experiences: false, education: false })
    const existingExperiences = useRef<Array<Record<string, any>>>([])
    const existingEducation = useRef<Array<Record<string, any>>>([])
    const existingSkills = useRef<Array<Record<string, any>>>([])
    const existingInterests = useRef<Array<Record<string, any>>>([])

    useEffect(()=>{
        if(resendSeconds<=0)return
        const timer=window.setInterval(()=>setResendSeconds(value=>Math.max(0,value-1)),1000)
        return()=>window.clearInterval(timer)
    },[resendSeconds])

    useEffect(() => {
        if (!editMode || !user) return
        Promise.allSettled([
            api<Record<string, any>>('/candidatos/meu-perfil'), api<Record<string, any>>('/candidatos/buscar-cultura'),
            api<{ experiencias: Array<Record<string, any>> }>('/historico/experiencias'), api<{ formacoes: Array<Record<string, any>> }>('/historico/formacoes'),
            api<Array<Record<string, any>>>('/habilidades-candidatos/buscar'),api<Array<Record<string, any>>>('/interesses-candidato'),
        ]).then(([profileResult, cultureResult, experiencesResult, educationResult,skillsResult,interestsResult]) => {
            const profile = profileResult.status === 'fulfilled' ? profileResult.value : {}
            const culture = cultureResult.status === 'fulfilled' ? cultureResult.value : {}
            const experiences = experiencesResult.status === 'fulfilled' ? experiencesResult.value.experiencias : []
            const education = educationResult.status === 'fulfilled' ? educationResult.value.formacoes : []
            const skills=skillsResult.status==='fulfilled'?skillsResult.value:[]
            const interests=interestsResult.status==='fulfilled'?interestsResult.value:[]
            existingExperiences.current = experiences; existingEducation.current = education;existingSkills.current=skills;existingInterests.current=interests
            setExperienceCount(Math.max(1, experiences.length)); setCourseCompleted((education.length ? education : [{}]).map((item) => item.status === 'concluido' ? 'yes' : 'no'))
            setSkillCount(Math.max(3,skills.length));setSelectedAreas(interests.map(item=>item.nome))
            const prefilled: Record<string, string> = { ...profile, ...culture, nome_completo:user.nome_completo, email:user.email, consentimento_talentos:user.consentimento_talentos||'somente_candidatura', data_nascimento:profile.data_nascimento?.slice(0,10) || '' }
            experiences.forEach((item, i) => { prefilled[`empresa-${i}`]=item.empresa||''; prefilled[`experiencia-cargo-${i}`]=item.cargo||''; prefilled[`experiencia-descricao-${i}`]=item.descricao||''; prefilled[`experiencia-inicio-${i}`]=item.data_inicio?.slice(0,10)||''; prefilled[`experiencia-fim-${i}`]=item.data_fim?.slice(0,10)||'' })
            education.forEach((item, i) => { prefilled[`curso-${i}`]=item.curso||''; prefilled[`instituicao-${i}`]=item.instituicao||''; prefilled[`semestre-${i}`]=String(item.semestre_atual||''); prefilled[`turno-${i}`]=item.turno||''; prefilled[`course-status-${i}`]=item.status||''; prefilled[`formacao-inicio-${i}`]=item.data_inicio?.slice(0,10)||''; prefilled[`formacao-fim-${i}`]=item.data_fim?.slice(0,10)||'';prefilled[`certificado-${i}`]=item.url_certificado||'' })
            skills.forEach((item,i)=>{prefilled[`competencia-${i}`]=item.nome||'';prefilled[`nivel-${i}`]=String(item.nivel||'');prefilled[`experiencia-${i}`]=item.nivel_experiencia||''})
            setValues(prefilled); setAddressVersion((v)=>v+1)
        }).catch(() => setSubmitError('Não foi possível carregar todas as informações do perfil.'))
    }, [editMode, user])

    const repeatableItemName = step === 3 ? 'experiências' : step === 4 ? 'formações' : 'competências'

    const selectFile=(key:string,file:File|undefined,maxMb:number)=>{
        if(file&&file.size>maxMb*1024*1024){setSubmitError(`O arquivo excede o limite de ${maxMb} MB.`);return}
        setSubmitError('');setSelectedFiles(current=>({...current,[key]:file}))
    }

    const sendFile=async(key:string,type:UploadType,file:File|undefined,previous?:string)=>{
        if(!file)return previous||''
        if(uploadedPaths.current[key])return uploadedPaths.current[key]
        const uploaded=await uploadFile(type,file,previous)
        uploadedPaths.current[key]=uploaded.caminho
        return uploaded.caminho
    }

    const uploadSelectedFiles=async(data:Record<string,string>)=>{
        setSavingStage('Enviando arquivos...')
        const [foto,curriculo,recomendacao,...certificados]=await Promise.all([
            sendFile('url_foto','foto',selectedFiles.url_foto,data.url_foto),
            sendFile('curriculo_url','curriculo',selectedFiles.curriculo_url,data.curriculo_url),
            sendFile('arquivo_recomendacao','recomendacao',selectedFiles.arquivo_recomendacao,data.arquivo_recomendacao),
            ...courseCompleted.map((_,index)=>{const key=`certificado-${index}`;return sendFile(key,'certificado',selectedFiles[key],data[key])})
        ])
        data.url_foto=foto;data.curriculo_url=curriculo;data.arquivo_recomendacao=recomendacao
        certificados.forEach((caminho,index)=>{data[`certificado-${index}`]=caminho})
        setValues(current=>({...current,...data}))
    }

    const lookupCep = async (rawCep: string) => {
        const cep = rawCep.replace(/\D/g, '')
        if (cep.length !== 8) return
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
            const address = await response.json()
            if (!response.ok || address.erro) throw new Error()
            setValues((current) => ({ ...current, cep, logradouro: address.logradouro || '', bairro: address.bairro || '', cidade: address.localidade || '', estado: address.uf || '' }))
            setAddressVersion((current) => current + 1)
        } catch { setSubmitError('CEP não encontrado. Você pode preencher o endereço manualmente.') }
    }

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

    const saveCatalogData=async(data:Record<string,string>)=>{
        const [skillsCatalog,areasCatalog]=await Promise.all([api<Array<Record<string,any>>>('/habilidades'),api<Array<Record<string,any>>>('/areas-interesse')])
        const selectedSkillNames=Array.from({length:skillCount},(_,i)=>data[`competencia-${i}`]).filter(Boolean)
        const uniqueSkillNames=[...new Set(selectedSkillNames)]
        const habilidades=uniqueSkillNames.map(nome=>{const i=selectedSkillNames.indexOf(nome);const catalog=skillsCatalog.find(item=>item.nome===nome);return catalog?{habilidade_id:Number(catalog.id),nivel:Number(data[`nivel-${i}`]),nivel_experiencia:data[`experiencia-${i}`]}:null}).filter(Boolean)
        const areas_ids=selectedAreas.map(nome=>areasCatalog.find(item=>item.nome===nome)?.id).filter(Boolean).map(Number)
        await Promise.all([
            api('/habilidades-candidatos/vincular',{method:'POST',body:JSON.stringify({habilidades})}),
            api('/interesses-candidato/vincular',{method:'POST',body:JSON.stringify({areas_ids})})
        ])
        if(editMode){
            const selectedSkillIds=new Set(habilidades.map((item:any)=>item.habilidade_id));const selectedAreaIds=new Set(areas_ids)
            await Promise.all(existingSkills.current.filter(item=>!selectedSkillIds.has(Number(item.habilidade_id))).map(item=>api(`/habilidades-candidatos/desvincular/${item.habilidade_id}`,{method:'DELETE'})))
            await Promise.all(existingInterests.current.filter(item=>!selectedAreaIds.has(Number(item.interesse_id))).map(item=>api(`/interesses-candidato/desvincular/${item.interesse_id}`,{method:'DELETE'})))
        }
    }

    const completeNewRegistration=async(data:Record<string,string>)=>{
        if (!savedStages.current.loggedIn) {
            await login(data.email, data.senha)
            savedStages.current.loggedIn = true
        }
        await uploadSelectedFiles(data)
        setSavingStage('Salvando perfil...')
        const tarefas:Array<Promise<unknown>>=[]
        if (!savedStages.current.profile) tarefas.push(api('/candidatos/perfil-base', {
            method:'POST', body:JSON.stringify({
                telefone:data.telefone||null, cep:data.cep?.replace(/\D/g,'')||null,
                numero_rua:data.numero_rua||null, logradouro:data.logradouro||null,
                bairro:data.bairro||null, cidade:data.cidade||null, estado:data.estado||null,
                data_nascimento:data.data_nascimento||null, url_foto:data.url_foto||null,
                linkedin_url:data.linkedin_url||null, portfolio_url:data.portfolio_url||null,
                curriculo_url:data.curriculo_url||null, cargo_desejado:data.cargo_desejado||null
            })
        }))
        if (!savedStages.current.culture) tarefas.push(api('/candidatos/cultura', {
            method:'POST', body:JSON.stringify({
                motivacao:data.motivacao||null, apresentacao:data.apresentacao||null,
                descricao_valores:data.descricao_valores||null,
                arquivo_recomendacao:data.arquivo_recomendacao||null
            })
        }))
        const experiencias=Array.from({length:experienceCount},(_,index)=>({
            empresa:data[`empresa-${index}`], cargo:data[`experiencia-cargo-${index}`],
            descricao:data[`experiencia-descricao-${index}`]||null,
            data_inicio:data[`experiencia-inicio-${index}`],
            data_fim:data[`experiencia-fim-${index}`]||null,
            atual:!data[`experiencia-fim-${index}`]
        })).filter(item=>item.empresa&&item.cargo&&item.data_inicio)
        if(experiencias.length&&!savedStages.current.experiences)tarefas.push(api('/historico/experiencias/create',{method:'POST',body:JSON.stringify(experiencias)}))
        const formacoes=courseCompleted.map((completedCourse,index)=>({
            curso:data[`curso-${index}`], instituicao:data[`instituicao-${index}`],
            semestre_atual:data[`semestre-${index}`]?Number(data[`semestre-${index}`]):null,
            turno:data[`turno-${index}`]||null,
            status:completedCourse==='yes'?'concluido':data[`course-status-${index}`]||'cursando',
            data_inicio:data[`formacao-inicio-${index}`]||null,
            data_fim:data[`formacao-fim-${index}`]||null,
            url_certificado:data[`certificado-${index}`]||null
        })).filter(item=>item.curso&&item.instituicao)
        if(formacoes.length&&!savedStages.current.education)tarefas.push(api('/historico/formacoes/create',{method:'POST',body:JSON.stringify(formacoes)}))
        tarefas.push(saveCatalogData(data))
        tarefas.push(api('/usuarios/consentimento-talentos',{method:'PUT',body:JSON.stringify({consentimento_talentos:data.consentimento_talentos})}))
        await Promise.all(tarefas)
        savedStages.current.profile=true;savedStages.current.culture=true;savedStages.current.experiences=true;savedStages.current.education=true
        updateUser({consentimento_talentos:data.consentimento_talentos as 'sempre'|'somente_candidatura'})
        setCompleted(true)
    }

    const confirmEmail=async(event:FormEvent<HTMLFormElement>)=>{
        event.preventDefault();setSubmitError('')
        if(!/^\d{6}$/.test(verificationCode)){setSubmitError('Digite os 6 números do código.');return}
        setSubmitting(true);setSavingStage('Confirmando e-mail...')
        try{
            const autenticacao=await api<{token:string;usuario:{id:number;nome_completo:string;email:string;cargo:'candidato';criado_em?:string}}>('/usuarios/verificar-email',{method:'POST',body:JSON.stringify({email:values.email,codigo:verificationCode})})
            acceptSession(autenticacao)
            savedStages.current.loggedIn=true
            await completeNewRegistration(values)
        }catch(reason){setSubmitError(reason instanceof Error?reason.message:'Não foi possível confirmar o código.')}
        finally{setSubmitting(false);setSavingStage('')}
    }

    const resendCode=async()=>{
        if(resendSeconds>0)return
        setSubmitError('')
        try{await api('/usuarios/reenviar-codigo',{method:'POST',body:JSON.stringify({email:values.email})});setResendSeconds(60)}
        catch(reason){setSubmitError(reason instanceof Error?reason.message:'Não foi possível reenviar o código.')}
    }

    const nextStep = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setSubmitError('')

        const currentValues = new FormData(event.currentTarget)
        const submittedValues: Record<string, string> = {}
        currentValues.forEach((value, key) => {
            if (typeof value === 'string') submittedValues[key] = value
        })
        const allValues = { ...values, ...submittedValues }
        setValues(allValues)

        if(step===6&&selectedAreas.length===0){setSubmitError('Selecione ao menos uma área de interesse.');return}
        if (step !== steps.length) {
            setStep((current) => current + 1)
            return
        }

        setSubmitting(true)
        try {
            const data = allValues
            if (editMode) {
                await uploadSelectedFiles(data)
                setSavingStage('Salvando perfil...')
                await api(`/usuarios/atualizar/${user!.id}`, { method:'PUT', body:JSON.stringify({ nome_completo:data.nome_completo, email:data.email }) })
                updateUser({ nome_completo:data.nome_completo, email:data.email })
                await api('/candidatos/perfil-base', { method:'POST', body:JSON.stringify({ telefone:data.telefone||null, cep:data.cep?.replace(/\D/g,'')||null, numero_rua:data.numero_rua||null, logradouro:data.logradouro||null, bairro:data.bairro||null, cidade:data.cidade||null, estado:data.estado||null, data_nascimento:data.data_nascimento||null, url_foto:data.url_foto||null,linkedin_url:data.linkedin_url||null, portfolio_url:data.portfolio_url||null,curriculo_url:data.curriculo_url||null, cargo_desejado:data.cargo_desejado||null }) })
                await api('/candidatos/cultura', { method:'POST', body:JSON.stringify({ motivacao:data.motivacao||null, apresentacao:data.apresentacao||null, descricao_valores:data.descricao_valores||null,arquivo_recomendacao:data.arquivo_recomendacao||null }) })
                const experiences = Array.from({length:experienceCount},(_,i)=>({ empresa:data[`empresa-${i}`], cargo:data[`experiencia-cargo-${i}`], descricao:data[`experiencia-descricao-${i}`]||null, data_inicio:data[`experiencia-inicio-${i}`], data_fim:data[`experiencia-fim-${i}`]||null, atual:!data[`experiencia-fim-${i}`] })).filter(item=>item.empresa&&item.cargo&&item.data_inicio)
                await Promise.all(experiences.map((item,i)=> existingExperiences.current[i] ? api(`/historico/experiencias/editar/${existingExperiences.current[i].id}`,{method:'PUT',body:JSON.stringify(item)}) : api('/historico/experiencias/create',{method:'POST',body:JSON.stringify(item)})))
                await Promise.all(existingExperiences.current.slice(experiences.length).map(item=>api(`/historico/experiencias/deletar/${item.id}`,{method:'DELETE'})))
                const education = courseCompleted.map((completed,i)=>({ curso:data[`curso-${i}`], instituicao:data[`instituicao-${i}`], semestre_atual:data[`semestre-${i}`]?Number(data[`semestre-${i}`]):null, turno:data[`turno-${i}`]||null, status:completed==='yes'?'concluido':data[`course-status-${i}`]||'cursando', data_inicio:data[`formacao-inicio-${i}`]||null, data_fim:data[`formacao-fim-${i}`]||null, url_certificado:data[`certificado-${i}`]||null })).filter(item=>item.curso&&item.instituicao)
                await Promise.all(education.map((item,i)=> existingEducation.current[i] ? api(`/historico/formacoes/editar/${existingEducation.current[i].id}`,{method:'PUT',body:JSON.stringify(item)}) : api('/historico/formacoes/create',{method:'POST',body:JSON.stringify(item)})))
                await Promise.all(existingEducation.current.slice(education.length).map(item=>api(`/historico/formacoes/deletar/${item.id}`,{method:'DELETE'})))
                await saveCatalogData(data)
                await api('/usuarios/consentimento-talentos',{method:'PUT',body:JSON.stringify({consentimento_talentos:data.consentimento_talentos})});updateUser({consentimento_talentos:data.consentimento_talentos as 'sempre'|'somente_candidatura'})
                setCompleted(true); return
            }
            if (!savedStages.current.registered) {
                await api('/usuarios/registrar', {
                    method: 'POST',
                    body: JSON.stringify({ nome_completo: data.nome_completo, email: data.email, senha: data.senha }),
                })
                savedStages.current.registered = true
                setAwaitingVerification(true)
                setResendSeconds(60)
                return
            }
            setAwaitingVerification(true)
        } catch (reason) {
            setSubmitError(reason instanceof Error ? reason.message : 'Não foi possível concluir o cadastro.')
        } finally {
            setSubmitting(false)
        }
    }

    if(awaitingVerification&&!completed){
        return <main className="registration-page page-transition"><section className="registration-verification">
            <span>CONFIRMAÇÃO DE E-MAIL</span><h1>Digite o código recebido</h1>
            <p>Enviamos um código de 6 dígitos para <strong>{values.email}</strong>. Ele expira em 10 minutos.</p>
            <form onSubmit={confirmEmail}>
                <label><span>Código de confirmação</span><input value={verificationCode} onChange={event=>setVerificationCode(event.target.value.replace(/\D/g,'').slice(0,6))} inputMode="numeric" autoComplete="one-time-code" placeholder="000000" autoFocus required/></label>
                {submitError&&<p className="registration-error" role="alert">{submitError}</p>}
                <button className="registration-button registration-button--primary" type="submit" disabled={submitting}>{submitting?(savingStage||'Confirmando...'):'Confirmar e concluir cadastro'}</button>
            </form>
            <button className="registration-verification__resend" type="button" disabled={resendSeconds>0||submitting} onClick={()=>void resendCode()}>{resendSeconds>0?`Reenviar código em ${resendSeconds}s`:'Reenviar código'}</button>
            <button className="registration-verification__back" type="button" disabled={submitting} onClick={()=>{savedStages.current.registered=false;setAwaitingVerification(false);setStep(1)}}>Corrigir endereço de e-mail</button>
        </section></main>
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
                    <h1>{editMode ? 'Perfil atualizado!' : 'Cadastro concluído!'}</h1>
                    <p>{editMode ? 'Suas informações foram salvas com sucesso.' : 'Seu perfil foi criado com sucesso. Agora você já pode se candidatar às vagas e encontrar novas oportunidades.'}</p>
                    <div className="registration-success__actions">
                        <Link className="registration-button registration-button--secondary" to="/perfil">Ver perfil</Link>
                        <Link className="registration-button registration-button--primary" to="/vagas-abertas">Ver vagas</Link>
                    </div>
                </section>
            </main>
        )
    }

    return (
        <main className="registration-page page-transition">
            <section className="registration-card">
                <header className="registration-header">
                    <div><span>{editMode ? 'EDIÇÃO DE PERFIL' : 'CADASTRO DE TALENTOS'}</span><h1 ref={headerRef} tabIndex={-1}>{editMode ? 'Atualizar perfil' : 'Criar perfil'}</h1><p aria-live="polite">Etapa {step} de {steps.length} <span aria-hidden="true">·</span> {steps[step - 1].label}</p></div>
                </header>

                <ol className="registration-progress" aria-label="Progresso do cadastro">
                    {steps.map((item, index) => {
                        const position = index + 1
                        const status = position < step ? 'is-complete' : position === step ? 'is-current' : ''
                        return (
                            <li className={status} aria-current={position === step ? 'step' : undefined} key={item.label}>
                                <span className="registration-progress__icon" aria-hidden="true">{position < step ?
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
                            <Field label="Nome completo" name="nome_completo" placeholder="Digite seu nome completo" required defaultValue={values.nome_completo} />
                            <Field label="CEP" name="cep" placeholder="00000-000" defaultValue={values.cep} onBlur={(event) => void lookupCep(event.currentTarget.value)} />
                            <Field label="Rua" name="logradouro" placeholder="Preenchida pelo CEP" defaultValue={values.logradouro} key={`street-${addressVersion}`} />
                            <Field label="Número" name="numero_rua" placeholder="Número" defaultValue={values.numero_rua} />
                            <Field label="Bairro" name="bairro" placeholder="Preenchido pelo CEP" defaultValue={values.bairro} key={`district-${addressVersion}`} />
                            <Field label="Cidade" name="cidade" placeholder="Preenchida pelo CEP" defaultValue={values.cidade} key={`city-${addressVersion}`} />
                            <Field label="Estado" name="estado" placeholder="UF" defaultValue={values.estado} key={`state-${addressVersion}`} />
                            <Field label="E-mail" name="email" type="email" placeholder="E-mail pessoal" required defaultValue={values.email} />
                            <Field label="Data de nascimento" name="data_nascimento" type="date" placeholder="DD/MM/AAAA" defaultValue={values.data_nascimento} />
                            {!editMode && <label className="registration-field"><span>Senha</span><div className="registration-password"><input name="senha" type={showPassword?'text':'password'} placeholder="Mínimo de 8 dígitos" required defaultValue={values.senha}/><button type="button" onClick={()=>setShowPassword(v=>!v)} aria-label={showPassword?'Ocultar senha':'Mostrar senha'}><PasswordVisibilityIcon visible={showPassword} /></button></div></label>}
                            <UploadField label="Foto de perfil" accept="image/jpeg,image/png,image/webp" file={selectedFiles.url_foto} currentValue={values.url_foto} maxMb={3} onSelect={file=>selectFile('url_foto',file,3)}/>
                            <Field label="Telefone" name="telefone" type="tel" placeholder="+55 (00) 00000-0000" defaultValue={values.telefone} />
                        </>}

                        {step === 2 && <>
                            <Field label="LinkedIn" name="linkedin_url" type="url" placeholder="https://linkedin.com/in/usuario" defaultValue={values.linkedin_url} />
                            <UploadField label="Currículo" accept="application/pdf,.docx" file={selectedFiles.curriculo_url} currentValue={values.curriculo_url} maxMb={5} onSelect={file=>selectFile('curriculo_url',file,5)}/>
                            <Field label="Portfólio" name="portfolio_url" type="url" placeholder="https://seuportfolio.com" defaultValue={values.portfolio_url} />
                            <Field label="Cargo desejado" name="cargo_desejado" placeholder="Ex.: Desenvolvedor Front-end" defaultValue={values.cargo_desejado} />
                        </>}

                        {step === 3 && <div className="registration-repeat-list">
                            {Array.from({ length: experienceCount }, (_, index) => (
                                <div className="registration-repeat-item" key={`experience-${index}`}>
                                    <Field label="Empresa" name={`empresa-${index}`} placeholder="Nome da empresa" defaultValue={values[`empresa-${index}`]} />
                                    <Field label="Data de entrada" name={`experiencia-inicio-${index}`} type="date" placeholder="DD/MM/AAAA" defaultValue={values[`experiencia-inicio-${index}`]} />
                                    <Field label="Cargo" name={`experiencia-cargo-${index}`} placeholder="Cargo exercido" defaultValue={values[`experiencia-cargo-${index}`]} />
                                    <Field label="Data de saída" name={`experiencia-fim-${index}`} type="date" placeholder="Deixe vazio se ainda trabalha lá" defaultValue={values[`experiencia-fim-${index}`]} />
                                    <label className="registration-field registration-field--wide"><span>Descrição</span><textarea name={`experiencia-descricao-${index}`} placeholder="Descreva suas principais atividades" defaultValue={values[`experiencia-descricao-${index}`]} /></label>

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
                                    <Field label="Curso" name={`curso-${index}`} placeholder="Nome do curso" defaultValue={values[`curso-${index}`]} />
                                    <div className="registration-date-pair"><Field label="Data de entrada" name={`formacao-inicio-${index}`} type="date" placeholder="DD/MM/AAAA" defaultValue={values[`formacao-inicio-${index}`]} /><Field label="Data de conclusão" name={`formacao-fim-${index}`} type="date" placeholder="DD/MM/AAAA" defaultValue={values[`formacao-fim-${index}`]} /></div>
                                    <Field label="Instituição" name={`instituicao-${index}`} placeholder="Nome da instituição" defaultValue={values[`instituicao-${index}`]} />
                                    <fieldset className="registration-options">
                                        <legend>Já concluiu o curso?</legend>
                                        <label><input type="radio" name={`completed-course-${index}`} checked={completedCourse === 'yes'} onChange={() => updateCourseCompleted(index, 'yes')} /> Sim</label>
                                        <label><input type="radio" name={`completed-course-${index}`} checked={completedCourse === 'no'} onChange={() => updateCourseCompleted(index, 'no')} /> Não</label>
                                    </fieldset>

                                    {completedCourse === 'yes' && (
                                        <UploadField label="Certificado" accept="application/pdf,image/jpeg,image/png,image/webp" file={selectedFiles[`certificado-${index}`]} currentValue={values[`certificado-${index}`]} maxMb={5} onSelect={file=>selectFile(`certificado-${index}`,file,5)}/>
                                    )}

                                    {completedCourse === 'no' && <>
                                        <Field label="Semestre atual" name={`semestre-${index}`} type="number" placeholder="Digite apenas números" defaultValue={values[`semestre-${index}`]} />
                                        <fieldset className="registration-options">
                                            <legend>Qual é a situação atual?</legend>
                                            <label><input type="radio" name={`course-status-${index}`} value="cursando" defaultChecked={values[`course-status-${index}`] === 'cursando'} /> Cursando</label>
                                            <label><input type="radio" name={`course-status-${index}`} value="trancado" defaultChecked={values[`course-status-${index}`] === 'trancado'} /> Trancado</label>
                                        </fieldset>
                                        <fieldset className="registration-options">
                                            <legend>Qual período você estuda?</legend>
                                            <label><input type="radio" name={`turno-${index}`} value="manhã" defaultChecked={values[`turno-${index}`] === 'manhã'} /> Manhã</label>
                                            <label><input type="radio" name={`turno-${index}`} value="tarde" defaultChecked={values[`turno-${index}`] === 'tarde'} /> Tarde</label>
                                            <label><input type="radio" name={`turno-${index}`} value="noite" defaultChecked={values[`turno-${index}`] === 'noite'} /> Noite</label>
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
                            <Field label="Motivação" name="motivacao" placeholder="O que te motiva a trabalhar conosco?" defaultValue={values.motivacao} />
                            <label className="registration-field registration-field--tall"><span>Apresentação</span><textarea name="apresentacao" placeholder="Fale um pouco sobre você" defaultValue={values.apresentacao} /></label>
                            <Field label="Valores" name="descricao_valores" placeholder="Quais são os seus valores?" defaultValue={values.descricao_valores} />
                            <UploadField label="Carta de indicação (opcional)" accept="application/pdf,.docx" file={selectedFiles.arquivo_recomendacao} currentValue={values.arquivo_recomendacao} maxMb={5} onSelect={file=>selectFile('arquivo_recomendacao',file,5)}/>
                        </>}

                        {step === 6 && <div className="registration-skills">
                            <fieldset className="registration-interest-options"><legend>Áreas de interesse</legend><p>Selecione uma ou mais áreas para receber oportunidades compatíveis.</p><div>{PREDEFINED_AREAS.map(area=><label key={area}><input type="checkbox" checked={selectedAreas.includes(area)} onChange={event=>setSelectedAreas(current=>event.target.checked?[...current,area]:current.filter(item=>item!==area))}/><span>{area}</span></label>)}</div></fieldset>
                            {Array.from({ length: skillCount }, (_, index) => <div className="registration-skill" key={`skill-${index}`}>
                                <label className="registration-field"><span>Competência</span><select name={`competencia-${index}`} defaultValue={values[`competencia-${index}`]||''} required><option value="" disabled>Selecione uma competência</option>{PREDEFINED_SKILLS.map(skill=><option value={skill} key={skill}>{skill}</option>)}</select></label>
                                <label className="registration-field"><span>Nível</span><select name={`nivel-${index}`} defaultValue={values[`nivel-${index}`]||''} required><option value="" disabled>Selecione</option><option value="1">1 - Básico</option><option value="2">2 - Iniciante</option><option value="3">3 - Intermediário</option><option value="4">4 - Avançado</option><option value="5">5 - Especialista</option></select></label>
                                <label className="registration-field"><span>Experiência</span><select name={`experiencia-${index}`} defaultValue={values[`experiencia-${index}`]||''} required><option value="" disabled>Selecione</option><option value="junior">Júnior</option><option value="pleno">Pleno</option><option value="senior">Sênior</option><option value="especialista">Especialista</option></select></label>
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
                        {step === 7 && <section className="registration-consent"><span>BANCO DE TALENTOS</span><h2>Como seus dados serão utilizados?</h2><p>Somos um banco de talentos: mantemos perfis profissionais autorizados para aproximar candidatos de futuras oportunidades, mesmo quando não existe uma vaga aberta no momento. Seus dados ficam disponíveis somente para a equipe responsável pelos processos seletivos.</p><p>Escolha abaixo quando seu perfil poderá fazer parte desse banco. Você poderá mudar essa preferência depois em sua conta.</p><label><input type="radio" name="consentimento_talentos" value="sempre" required defaultChecked={values.consentimento_talentos==='sempre'}/><span><strong>Autorizo o armazenamento no banco de talentos</strong><small>Meu perfil poderá ser consultado mesmo sem inscrição em uma vaga.</small></span></label><label><input type="radio" name="consentimento_talentos" value="somente_candidatura" required defaultChecked={!values.consentimento_talentos||values.consentimento_talentos==='somente_candidatura'}/><span><strong>Somente quando eu me candidatar</strong><small>Meu perfil só aparecerá no banco enquanto houver uma candidatura vinculada.</small></span></label></section>}
                    </div>

                    <footer className="registration-actions">
                        <button className="registration-button registration-button--secondary" type="button" disabled={step === 1} onClick={() => setStep((current) => current - 1)}>Voltar</button>
                        <div>
                            {(step === 3 || step === 4 || step === 6) && <button className="registration-button registration-button--secondary" type="button" onClick={addAnother}>Adicionar outro</button>}
                            <button className="registration-button registration-button--primary" type="submit" disabled={submitting}>{submitting ? (savingStage||'Salvando...') : step === steps.length ? (editMode ? 'Salvar alterações' : 'Finalizar') : 'Próximo'}</button>
                        </div>
                    </footer>
                    {submitError && <p className="registration-error" role="alert">{submitError}</p>}
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
