import '../../../styles/Navbar.css'
import logoImg from '../../../assets/logo.png'
import { Link } from 'react-router-dom'

function Navbar() {
    return (
        <header className="navbar">
            <nav className="navbar__content" aria-label="Navegação principal">
                <Link className="navbar__brand" to="/">
                    <img src={logoImg} alt="" />
                </Link>

                <ul className="navbar__links">
                    <Link to="/">Home</Link>
                    <Link to="/sobre">Sobre</Link>
                    <Link to="/vagas-abertas">Vagas</Link>
                </ul>

                <div className="navbar__actions">
                    <Link className="navbar__profile__vazado" to="/cadastro">
                        <span className="navbar__profile-text">Registrar-se</span>


                        <svg viewBox="0 0 445 442" className="navbar__profile-arrow" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1.09721e-05 305.566L1.09721e-05 136.434L224.747 136.434L224.747 1.33701e-05L445 221L224.747 442L224.747 305.566L1.09721e-05 305.566Z" fill='#ffffff' />
                        </svg>

                    </Link>

                    <Link className="navbar__profile" to="/perfil">
                        <span className="navbar__profile-text">Perfil</span>


                        <svg viewBox="0 0 445 442" className="navbar__profile-arrow" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1.09721e-05 305.566L1.09721e-05 136.434L224.747 136.434L224.747 1.33701e-05L445 221L224.747 442L224.747 305.566L1.09721e-05 305.566Z" fill='#ffffff' />
                        </svg>

                    </Link>

                    {/* <svg viewBox="0 0 435 435" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M217.5 217C277.423 217 326 168.423 326 108.5C326 48.5771 277.423 0 217.5 0C157.577 0 109 48.5771 109 108.5C109 168.423 157.577 217 217.5 217Z" />
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M217.5 245C144.909 245 0 281.371 0 353.571V435H435V353.571C435 281.371 290.091 245 217.5 245Z" />
                    </svg> */}


                    <button
                        className="navbar__menu-button"
                        type="button"
                        aria-label="Abrir menu"
                    >
                        ☰
                    </button>
                </div>
            </nav>
        </header>
    )
}

export default Navbar
