import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { AdminTheme } from '../../layouts/Admin/AdminLayout'
import type { AdminUser } from '../../types/AdminUser'
import AdminIcon from './AdminIcon'
import '../../styles/AdminSettingsModal.css'

interface AdminSettingsModalProps {
    user: AdminUser
    theme: AdminTheme
    onThemeChange: (theme: AdminTheme) => void
    onClose: () => void
}

interface AdminPreferences {
    newCandidateAlerts: boolean
    vacancyAlerts: boolean
    statusUpdates: boolean
    weeklySummary: boolean
}

type SettingsTab = 'preferences' | 'profile'

const defaultPreferences: AdminPreferences = {
    newCandidateAlerts: true,
    vacancyAlerts: true,
    statusUpdates: true,
    weeklySummary: false,
}

const roleLabels: Record<AdminUser['role'], string> = {
    admin: 'Administrador',
    rh: 'Recursos Humanos',
}

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
})

function getInitials(name: string) {
    const parts = name.trim().split(/\s+/)
    return `${parts[0]?.[0] ?? ''}${parts.at(-1)?.[0] ?? ''}`.toUpperCase()
}

function formatMemberSince(value: string) {
    if (!value) return 'Não informado'
    const date = new Date(value)
    return Number.isNaN(date.getTime()) ? 'Não informado' : dateFormatter.format(date)
}

function getSavedPreferences(): AdminPreferences {
    try {
        const savedPreferences = localStorage.getItem('admin-preferences')
        return savedPreferences ? { ...defaultPreferences, ...JSON.parse(savedPreferences) } : defaultPreferences
    } catch {
        return defaultPreferences
    }
}

function AdminSettingsModal({ user, theme, onThemeChange, onClose }: AdminSettingsModalProps) {
    const dialogRef = useRef<HTMLDivElement>(null)
    const [activeTab, setActiveTab] = useState<SettingsTab>('preferences')
    const [preferences, setPreferences] = useState<AdminPreferences>(getSavedPreferences)

    useEffect(() => {
        const scrollContainer = document.querySelector<HTMLElement>('.admin-layout__content')
        const previousOverflow = scrollContainer?.style.overflow
        if (scrollContainer) scrollContainer.style.overflow = 'hidden'
        dialogRef.current?.focus()

        const closeOnEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose()
        }

        window.addEventListener('keydown', closeOnEscape)
        return () => {
            if (scrollContainer) scrollContainer.style.overflow = previousOverflow ?? ''
            window.removeEventListener('keydown', closeOnEscape)
        }
    }, [onClose])

    const togglePreference = (preference: keyof AdminPreferences) => {
        setPreferences((current) => {
            const updatedPreferences = { ...current, [preference]: !current[preference] }
            localStorage.setItem('admin-preferences', JSON.stringify(updatedPreferences))
            return updatedPreferences
        })
    }

    return createPortal(
        <div className="admin-settings-modal__overlay" role="presentation" onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose()
        }}>
            <div className="admin-settings-modal" role="dialog" aria-modal="true" aria-labelledby="admin-settings-title" tabIndex={-1} ref={dialogRef}>
                <header className="admin-settings-modal__header">
                    <div className="admin-settings-modal__heading">
                        <span className="admin-settings-modal__heading-icon" aria-hidden="true">
                            <AdminIcon name="settings" />
                        </span>
                        <div>
                            <span>PAINEL ADMINISTRATIVO</span>
                            <h2 id="admin-settings-title">Configurações</h2>
                            <p>Personalize sua experiência e consulte os dados da sua conta.</p>
                        </div>
                    </div>
                    <button className="admin-settings-modal__close" type="button" onClick={onClose} aria-label="Fechar configurações">×</button>
                </header>

                <nav className="admin-settings-modal__tabs" aria-label="Seções das configurações">
                    <button className={activeTab === 'preferences' ? 'is-active' : ''} type="button" onClick={() => setActiveTab('preferences')}>
                        <AdminIcon name="sliders" aria-hidden="true" />
                        Preferências
                    </button>
                    <button className={activeTab === 'profile' ? 'is-active' : ''} type="button" onClick={() => setActiveTab('profile')}>
                        <AdminIcon name="profile" aria-hidden="true" />
                        Meu perfil
                    </button>
                </nav>

                <div className="admin-settings-modal__content">
                    {activeTab === 'preferences' && (
                        <div className="admin-settings-modal__panel">
                            <section className="admin-settings-modal__section">
                                <div className="admin-settings-modal__section-title">
                                    <div><span>APARÊNCIA</span><h3>Tema da interface</h3></div>
                                    <small>Aplicado em todo o painel</small>
                                </div>

                                <div className="admin-settings-modal__themes" role="radiogroup" aria-label="Tema da interface">
                                    <button className={theme === 'light' ? 'is-selected' : ''} type="button" role="radio" aria-checked={theme === 'light'} onClick={() => onThemeChange('light')}>
                                        <span className="admin-settings-modal__theme-preview admin-settings-modal__theme-preview--light" aria-hidden="true">
                                            <i /><i /><i />
                                        </span>
                                        <span><strong>Modo claro</strong><small>Interface clara e suave</small></span>
                                        <i className="admin-settings-modal__radio" aria-hidden="true" />
                                    </button>

                                    <button className={theme === 'dark' ? 'is-selected' : ''} type="button" role="radio" aria-checked={theme === 'dark'} onClick={() => onThemeChange('dark')}>
                                        <span className="admin-settings-modal__theme-preview admin-settings-modal__theme-preview--dark" aria-hidden="true">
                                            <i /><i /><i />
                                        </span>
                                        <span><strong>Modo escuro</strong><small>Mais confortável à noite</small></span>
                                        <i className="admin-settings-modal__radio" aria-hidden="true" />
                                    </button>
                                </div>
                            </section>

                            <section className="admin-settings-modal__section">
                                <div className="admin-settings-modal__section-title">
                                    <div><span>NOTIFICAÇÕES</span><h3>Avisos do processo seletivo</h3></div>
                                    <small>Salvos neste dispositivo</small>
                                </div>

                                <div className="admin-settings-modal__preferences">
                                    <div className="admin-settings-modal__preference">
                                        <span className="admin-settings-modal__preference-icon" aria-hidden="true"><AdminIcon name="bell" /></span>
                                        <div><strong>Novos candidatos</strong><span>Avisar quando uma nova candidatura chegar</span></div>
                                        <button className="admin-settings-switch" type="button" role="switch" aria-checked={preferences.newCandidateAlerts} onClick={() => togglePreference('newCandidateAlerts')}><span /></button>
                                    </div>

                                    <div className="admin-settings-modal__preference">
                                        <span className="admin-settings-modal__preference-icon" aria-hidden="true"><AdminIcon name="briefcase" /></span>
                                        <div><strong>Alertas de vagas</strong><span>Receber avisos sobre vagas pausadas ou próximas do fechamento</span></div>
                                        <button className="admin-settings-switch" type="button" role="switch" aria-checked={preferences.vacancyAlerts} onClick={() => togglePreference('vacancyAlerts')}><span /></button>
                                    </div>

                                    <div className="admin-settings-modal__preference">
                                        <span className="admin-settings-modal__preference-icon" aria-hidden="true"><AdminIcon name="check" /></span>
                                        <div><strong>Atualizações de status</strong><span>Avisar quando candidatos avançarem no processo</span></div>
                                        <button className="admin-settings-switch" type="button" role="switch" aria-checked={preferences.statusUpdates} onClick={() => togglePreference('statusUpdates')}><span /></button>
                                    </div>

                                    <div className="admin-settings-modal__preference">
                                        <span className="admin-settings-modal__preference-icon" aria-hidden="true"><AdminIcon name="clipboard" /></span>
                                        <div><strong>Resumo semanal</strong><span>Receber um resumo das vagas e candidaturas da semana</span></div>
                                        <button className="admin-settings-switch" type="button" role="switch" aria-checked={preferences.weeklySummary} onClick={() => togglePreference('weeklySummary')}><span /></button>
                                    </div>
                                </div>
                            </section>
                        </div>
                    )}

                    {activeTab === 'profile' && (
                        <div className="admin-settings-modal__panel">
                            <section className="admin-settings-profile__hero">
                                <span className="admin-settings-profile__avatar" aria-hidden="true">{getInitials(user.fullName)}</span>
                                <div>
                                    <span>CONTA ADMINISTRATIVA</span>
                                    <h3>{user.fullName}</h3>
                                    <p>{roleLabels[user.role]}</p>
                                </div>
                                <span className="admin-settings-profile__status"><i aria-hidden="true" /> Conta ativa</span>
                            </section>

                            <section className="admin-settings-modal__section">
                                <div className="admin-settings-modal__section-title">
                                    <div><span>PERFIL</span><h3>Informações da conta</h3></div>
                                </div>
                                <dl className="admin-settings-profile__data">
                                    <div><dt>Nome completo</dt><dd>{user.fullName}</dd></div>
                                    <div><dt>E-mail</dt><dd>{user.email}</dd></div>
                                    <div><dt>Tipo de acesso</dt><dd>{roleLabels[user.role]}</dd></div>
                                    <div><dt>Membro desde</dt><dd>{formatMemberSince(user.createdAt)}</dd></div>
                                </dl>
                            </section>

                            <section className="admin-settings-modal__section admin-settings-profile__access">
                                <span className="admin-settings-modal__preference-icon" aria-hidden="true"><AdminIcon name="shield" /></span>
                                <div>
                                    <span>NÍVEL DE ACESSO</span>
                                    <h3>{user.role === 'admin' ? 'Acesso administrativo completo' : 'Acesso de Recursos Humanos'}</h3>
                                    <p>{user.role === 'admin' ? 'Permissão para gerenciar vagas, candidatos e configurações do painel.' : 'Permissão para acompanhar vagas, candidatos e processos seletivos.'}</p>
                                </div>
                            </section>
                        </div>
                    )}
                </div>

                <footer className="admin-settings-modal__footer">
                    <span><i aria-hidden="true" /> Alterações salvas automaticamente</span>
                    <button type="button" onClick={onClose}>Concluir</button>
                </footer>
            </div>
        </div>,
        document.body,
    )
}

export default AdminSettingsModal
