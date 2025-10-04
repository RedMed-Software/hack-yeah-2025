import { Link } from 'react-router-dom'
import styles from './LandingPage.module.scss'

export default function LandingPage() {
    return (
        <main className={styles.container}>
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <div className={styles.logoSection}>
                        <img
                            src="/assets/mlodzi_dzialaja_logo.png"
                            alt="Krakowskie Cyfrowe Centrum Wolontariatu"
                            className={styles.logo}
                        />
                    </div>

                    <div className={styles.textContent}>

                        <h1 className={styles.title}>
                            Krakowskie Cyfrowe Centrum Wolontariatu
                        </h1>

                        <p className={styles.lead}>
                            Innowacyjna platforma łącząca młodych wolontariuszy, szkolnych koordynatorów
                            i organizacje z Krakowa. Znajdź pasujące inicjatywy, zgłoś się jednym kliknięciem
                            i razem budujmy silną lokalną społeczność.
                        </p>

                        <div className={styles.ctaSection}>
                            <Link
                                className={styles.ctaPrimary}
                                to="/register"
                            >
                                Dołącz teraz
                            </Link>

                            <Link
                                className={styles.ctaSecondary}
                                to="/login"
                            >
                                Mam już konto
                            </Link>
                        </div>
                    </div>
                </div>

                <div className={styles.heroGraphics}>
                    <div className={styles.graphicItem}></div>
                    <div className={styles.graphicItem}></div>
                    <div className={styles.graphicItem}></div>
                </div>
            </section>

            {/* Features Section */}
            <section className={styles.features}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Jak to działa?</h2>
                    <p className={styles.sectionSubtitle}>Proste kroki do zostania wolontariuszem</p>
                </div>

                <div className={styles.featuresGrid}>
                    <div className={styles.featureCard}>
                        <div className={styles.featureIcon}>1</div>
                        <h3 className={styles.featureTitle}>Założ konto</h3>
                        <p className={styles.featureDescription}>
                            Zarejestruj się jako wolontariusz, koordynator szkolny lub organizacja
                        </p>
                    </div>

                    <div className={styles.featureCard}>
                        <div className={styles.featureIcon}>2</div>
                        <h3 className={styles.featureTitle}>Znajdź inicjatywę</h3>
                        <p className={styles.featureDescription}>
                            Przeglądaj oferty dopasowane do Twoich zainteresowań i dostępności
                        </p>
                    </div>

                    <div className={styles.featureCard}>
                        <div className={styles.featureIcon}>3</div>
                        <h3 className={styles.featureTitle}>Dołącz do działania</h3>
                        <p className={styles.featureDescription}>
                            Zgłoś się jednym kliknięciem i zacznij zmieniać świat wokół siebie
                        </p>
                    </div>
                </div>
            </section>

            <section className={styles.benefits}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Korzyści dla Ciebie</h2>
                </div>

                <div className={styles.benefitsGrid}>
                    <div className={styles.benefitItem}>
                        <div className={styles.benefitIcon}>🔍</div>
                        <div className={styles.benefitContent}>
                            <h3 className={styles.benefitTitle}>Przeglądaj oferty</h3>
                            <p className={styles.benefitDescription}>
                                Filtry tematyczne, lokalizacja i terminarz. Szybkie zgłoszenie.
                            </p>
                        </div>
                    </div>

                    <div className={styles.benefitItem}>
                        <div className={styles.benefitIcon}>💬</div>
                        <div className={styles.benefitContent}>
                            <h3 className={styles.benefitTitle}>Komunikacja</h3>
                            <p className={styles.benefitDescription}>
                                Chat z organizatorami, powiadomienia i kalendarz z zadaniami.
                            </p>
                        </div>
                    </div>

                    <div className={styles.benefitItem}>
                        <div className={styles.benefitIcon}>📄</div>
                        <div className={styles.benefitContent}>
                            <h3 className={styles.benefitTitle}>Dokumenty</h3>
                            <p className={styles.benefitDescription}>
                                Generowanie zaświadczeń i raportów dla uczniów i organizacji.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className={styles.finalCta}>
                <div className={styles.finalCtaContent}>
                    <h2 className={styles.finalCtaTitle}>Gotowy na zmianę?</h2>
                    <p className={styles.finalCtaText}>
                        Dołącz do tysięcy młodych ludzi, którzy już zmieniają Kraków na lepsze
                    </p>
                    <div className={styles.finalCtaButtons}>
                        <Link to="/register" className={styles.ctaPrimary}>
                            Zaczynamy!
                        </Link>
                    </div>
                </div>
                <section className={styles.stats}>
                    <div className={styles.statCard}>
                        <span className={styles.statNumber}>500+</span>
                        <span className={styles.statLabel}>Aktywnych wolontariuszy</span>
                    </div>
                    <div className={styles.statCard}>
                        <span className={styles.statNumber}>50+</span>
                        <span className={styles.statLabel}>Partnerów organizacji</span>
                    </div>
                    <div className={styles.statCard}>
                        <span className={styles.statNumber}>100+</span>
                        <span className={styles.statLabel}>Zrealizowanych inicjatyw</span>
                    </div>
                </section>
            </section>
        </main>
    )
}