interface AdminPlaceholderPageProps {
    title: string
    description: string
}

function AdminPlaceholderPage({ title, description }: AdminPlaceholderPageProps) {
    return (
        <section className="admin-page-placeholder">
            <span>PAINEL ADMINISTRATIVO</span>
            <h1>{title}</h1>
            <p>{description}</p>
        </section>
    )
}

export default AdminPlaceholderPage
