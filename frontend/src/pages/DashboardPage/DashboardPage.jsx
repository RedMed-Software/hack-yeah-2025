import styles from './DashboardPage.module.scss'

export default function DashboardPage() {

    return (
        <section className={styles.page}>
            <h1 className={styles.title}>Panel główny</h1>
            <p className={styles.description}>Monitoruj swoje zgłoszenia, aktualizacje zespołu i ogłoszenia wydarzeń.</p>

            <div className="card">
                Tu ma być dashboard
            </div>
        </section>
    )
}