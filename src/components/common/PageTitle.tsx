import { useEffect } from 'react'
export default function PageTitle({ title, children }: { title: string; children: React.ReactNode }) {
    useEffect(() => { document.title = `${title} | Banco de Talentos` }, [title])
    return children
}
