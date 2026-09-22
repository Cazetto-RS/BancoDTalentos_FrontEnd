import { Link } from 'react-router-dom'
import '../styles/NotFoundPage.css'
export default function NotFoundPage() {
    return <main className="not-found"><span>404</span><h1>Página não encontrada</h1><p>O endereço informado não existe ou foi movido.</p><Link to="/">Voltar para o início</Link></main>
}
