import { Link } from 'react-router-dom'
import styles from './LandingPage.module.scss'

export default function LandingPage() {
    return (
        <main className={styles.container}>
            <section className={styles.hero}>
                <div className={styles.logoWrap} aria-hidden="true">
                    <svg className={styles.logo} viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" role="img">
                        <defs>
                            <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
                                <stop offset="0" stopColor="#2b64a9" />
                                <stop offset="1" stopColor="#df486d" />
                            </linearGradient>
                        </defs>
                        <rect x="6" y="6" width="108" height="108" rx="22" fill="url(#g)" />
                        <g transform="translate(20,24)" fill="#fff">
                            <path d="M8 46c6-12 18-22 34-22 13 0 22 6 26 14-6-8-15-12-26-12-16 0-28 10-34 20z" opacity="0.95" />
                            <circle cx="40" cy="30" r="6" />
                        </g>
                    </svg>
                </div>
                <div className={styles.titleWrap}>
                    <h1 className={styles.title}>Krakowskie Cyfrowe Centrum Wolontariatu</h1>
                    <p className={styles.lead}>
                        Platforma łącząca młodych wolontariuszy, szkolnych koordynatorów i organizacje z Krakowa.
                        Znajdź inicjatywy, zgłoś się jednym kliknięciem i buduj lokalną społeczność.
                    </p>
                    <div className={styles.ctaRow}>
                        <Link className={styles.ctaPrimary} to="/login" aria-label="Zaloguj się">Zaloguj</Link>
                        <Link className={styles.ctaGhost} to="/register" aria-label="Zarejestruj się">Zarejestruj się</Link>
                    </div>
                </div>
            </section>

            <section className={styles.features}>
                <div className={styles.feature}>
                    <h3>Przegląd ofert</h3>
                    <p>Filtry tematyczne, lokalizacja i terminarz. Szybkie zgłoszenie.</p>
                </div>
                <div className={styles.feature}>
                    <h3>Komunikacja</h3>
                    <p>Chat z organizatorami, powiadomienia i kalendarz z zadaniami.</p>
                </div>
                <div className={styles.feature}>
                    <h3>Dokumenty</h3>
                    <p>Generowanie zaświadczeń i raportów dla uczniów i organizacji.</p>
                </div>
            </section>
        </main>
    )
}
