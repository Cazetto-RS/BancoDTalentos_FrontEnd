import '../../styles/Sobre.css'
import '../../styles/externalInterface.css'
import fatecTatuiImg from '../../assets/fatec-tatui.jpg'

function Sobre() {
    return (
        <main className="sobre">

            <section className="sobre__hero">
                <div className="sobre__container">
                    <h1 className="sobre__title">
                        Sobre o <span>Projeto</span>
                    </h1>

                    <p className="subtitle__page_left">
                        Este projeto nasce dentro das salas de aula da Fatec Tatuí,
                        como parte do compromisso acadêmico com a excelência técnica
                        e a inovação em Tecnologia da Informação. Desenvolvido como
                        um projeto integrador de 2026, o sistema reflete o aprendizado
                        prático e a dedicação em resolver problemas reais do mercado
                        de trabalho.
                    </p>

                </div>
            </section>

            <section className="sobre__image-section" aria-label="Fatec Tatuí">
                <div className="sobre__container">
                    <figure className="sobre__image-wrapper">
                        <img
                            className="sobre__image"
                            src={fatecTatuiImg}
                            alt="Fatec Tatuí"
                        />
                        <figcaption className="sobre__image-caption">
                            Prof. Wilson Roberto Ribeiro de Camargo - Fatec Tatuí
                        </figcaption>
                    </figure>
                </div>
            </section>

            <section className="sobre__info">
                <div className="sobre__container">
                    <span className="sobre__label sobre__label--blue">
                        1. CONTEXTO DO PROJETO
                    </span>

                    <h2 className="sobre__pillars-title">
                        Do desafio à solução
                    </h2>

                    <div className="sobre__info-grid">

                    <article className="sobre__info-item">
                        <span className="sobre__label sobre__label--blue">
                            O PROBLEMA
                        </span>

                        <h2>
                            Necessidade de otimização de processos
                        </h2>

                        <p>
                            A PointMedia precisava otimizar seu processo seletivo diante do alto volume de currículos e da exigência por perfis técnicos. Para isso, solicitou um sistema completo que automatiza o recrutamento ponta a ponta, tornando a triagem de candidatos mais ágil, eficiente e escalável.
                        </p>
                    </article>


                    <article className="sobre__info-item">
                        <span className="sobre__label sobre__label--pink">
                            A SOLUÇÃO
                        </span>

                        <h2>
                            Banco de Talentos Inteligente
                        </h2>

                        <p>
                            O sistema atua como um ecossistema de gestão de talentos focado em melhorar a experiência de contratação. Ele oferece inteligência e rapidez na decisão para as empresas, e proporciona aos candidatos um cadastro claro e transparente que valoriza seu potencial técnico e cultural.
                        </p>
                    </article>

                    </div>

                </div>
            </section>

            <section className="sobre__pillars">
                <div className="sobre__container">

                    <span className="sobre__label sobre__label--blue">
                        2. COMO FUNCIONA
                    </span>

                    <h2 className="sobre__pillars-title">
                        Os pilares do projeto
                    </h2>

                    <div className="sobre__pillars-grid">

                        <article className="sobre__card">
                            <div className="sobre__card-icon">
                                <svg viewBox="0 0 451 410" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M410 82H328V41C328 18.45 309.55 0 287 0H164C141.45 0 123 18.45 123 41V110.29L22.755 160.515C15.9241 163.909 10.1756 169.142 6.15573 175.624C2.13585 182.107 0.00404757 189.582 0 197.21V389.5C0 400.775 9.225 410 20.5 410H100.04V225.705L140.835 205V410H430.5C441.775 410 451 400.775 451 389.5V123C451 100.45 432.55 82 410 82ZM246 287H205V246H246V287ZM246 205H205V164H246V205ZM246 123H205V82H246V123ZM369 287H328V246H369V287ZM369 205H328V164H369V205Z" />
                                </svg>

                            </div>

                            <h3>Para a Empresa</h3>

                            <p>
                                Oferecemos dashboards ágeis, filtros inteligentes de
                                candidatos e gestão centralizada de vagas, permitindo
                                que o RH otimize o tempo e foque nas pessoas.
                            </p>
                        </article>


                        <article className="sobre__card">
                            <div className="sobre__card-icon">
                                <svg viewBox="0 0 435 435" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M217.5 217C277.423 217 326 168.423 326 108.5C326 48.5771 277.423 0 217.5 0C157.577 0 109 48.5771 109 108.5C109 168.423 157.577 217 217.5 217Z" />
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M217.5 245C144.909 245 0 281.371 0 353.571V435H435V353.571C435 281.371 290.091 245 217.5 245Z" />
                                </svg>

                            </div>

                            <h3>Para o Candidato</h3>

                            <p>
                                Disponibilizamos um cadastro simples por etapas, focado
                                em destacar competências, experiências e portfólios de
                                forma clara e intuitiva.
                            </p>
                        </article>


                        <article className="sobre__card">
                            <div className="sobre__card-icon">
                                <svg viewBox="0 0 500 384" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M18.125 191.625L76 133.792L191.75 249.458L423.25 18.125L481.125 75.9583L191.75 365.125L18.125 191.625Z" stroke-width="36.25" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>

                            </div>

                            <h3>O Resultado</h3>

                            <p>
                                Processos seletivos mais rápidos, triagem assertiva para
                                os recrutadores e uma experiência de inscrição fluida e
                                sem burocracia para os talentos.
                            </p>
                        </article>

                    </div>
                </div>
            </section>


            <section className="sobre__cta">
                <div className="sobre__container">

                    <span className="sobre__label sobre__label--pink">
                        FICOU INTERESSADO?
                    </span>

                    <h2>
                        Conheça mais a Empresa Point Media
                    </h2>

                    <p>
                        Saiba sobre o trabalho da Point Media, seus valores e a cultura
                        que impulsiona a inovação. Descubra como a empresa está
                        transformando o mercado de trabalho e conectando talentos a
                        oportunidades de forma inteligente e eficiente.
                    </p>

                    <a href="https://www.pointmedia.com.br/" target='_blank' className="sobre__cta-button">
                        Saiba Mais
                    </a>

                </div>
            </section>

        </main>
    )
}

export default Sobre
