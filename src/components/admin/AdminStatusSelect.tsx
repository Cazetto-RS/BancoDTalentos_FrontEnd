import AdminIcon from './AdminIcon'
import '../../styles/AdminShared.css'

interface AdminStatusOption {
    value: string
    label: string
}

interface AdminStatusSelectProps {
    value: string
    options: AdminStatusOption[]
    onChange: (value: string) => void
    ariaLabel: string
    className?: string
}

function AdminStatusSelect({ value, options, onChange, ariaLabel, className = '' }: AdminStatusSelectProps) {
    const selectedLabel = options.find((option) => option.value === value)?.label ?? value

    return (
        <label className={`admin-status-select ${className}`.trim()}>
            <span aria-hidden="true">{selectedLabel}</span>
            <select value={value} onChange={(event) => onChange(event.target.value)} aria-label={ariaLabel}>
                {options.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}
            </select>
            <AdminIcon name="chevron-down" aria-hidden="true" />
        </label>
    )
}

export default AdminStatusSelect
