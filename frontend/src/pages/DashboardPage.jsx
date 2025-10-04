import { useAuth } from '../providers/useAuth.js'

export default function DashboardPage() {
  const { session } = useAuth()
  const traits = session?.identity?.traits ?? null

  return (
    <section className={styles.page}>
      <h1>Dashboard</h1>
      <p>Track your registrations, team updates, and event announcements.</p>
      {traits ? (
        <div className="card">
          <h2>Your profile</h2>
          <pre className="card-pre">{JSON.stringify(traits, null, 2)}</pre>
        </div>
      ) : null}
    </section>
  )
}