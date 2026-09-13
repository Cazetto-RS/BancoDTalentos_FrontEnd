import AdminIcon, { type AdminIconName } from './AdminIcon'
import '../../styles/AdminShared.css'

export interface AdminSummaryItem {
    label: string
    value: number | string
    icon: AdminIconName
}

interface AdminSummaryCardsProps {
    items: AdminSummaryItem[]
    ariaLabel: string
}

function AdminSummaryCards({ items, ariaLabel }: AdminSummaryCardsProps) {
    return (
        <div className="admin-summary-grid" aria-label={ariaLabel}>
            {items.map((item) => (
                <article className="admin-summary-card" key={item.label}>
                    <span className="admin-summary-card__icon" aria-hidden="true">
                        <AdminIcon name={item.icon} />
                    </span>
                    <div>
                        <span>{item.label}</span>
                        <strong>{item.value}</strong>
                    </div>
                </article>
            ))}
        </div>
    )
}

export default AdminSummaryCards
