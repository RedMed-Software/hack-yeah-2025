import styles from './VolunteerPanelPage.module.scss'

const upcomingShifts = [
  {
    id: 1,
    title: 'Punkt informacyjny',
    location: 'Centrum Kultury Podgórza',
    date: '12 stycznia 2025',
    time: '10:00 – 14:00',
    status: 'Potwierdzony',
  },
  {
    id: 2,
    title: 'Warsztaty integracyjne',
    location: 'Szkoła Podstawowa nr 48',
    date: '18 stycznia 2025',
    time: '09:00 – 13:30',
    status: 'Oczekuje na potwierdzenie',
  },
  {
    id: 3,
    title: 'Wizyta w domu seniora',
    location: 'Dom Pomocy Społecznej Krowodrza',
    date: '25 stycznia 2025',
    time: '15:00 – 18:00',
    status: 'Potwierdzony',
  },
]

const skills = [
  { name: 'Komunikacja i moderacja', level: 'Zaawansowany' },
  { name: 'Animacja czasu wolnego', level: 'Średniozaawansowany' },
  { name: 'Pierwsza pomoc', level: 'Podstawowy' },
  { name: 'Planowanie wydarzeń', level: 'Zaawansowany' },
]

const achievements = [
  {
    id: 1,
    title: 'Nagroda „Wolontariusz roku”',
    description: 'Wyróżnienie za 120 godzin pracy z młodzieżą i seniorami w 2024 roku.',
  },
  {
    id: 2,
    title: 'Certyfikat z pierwszej pomocy',
    description: 'Ukończony kurs Polskiego Czerwonego Krzyża, obejmujący scenariusze miejskie.',
  },
]

const timeline = [
  {
    id: 1,
    date: 'Listopad 2024',
    title: 'Koordynacja zbiórki żywności',
    description: 'Zorganizowanie zespołu 12 wolontariuszy, łącznie 800 zebranych paczek.',
  },
  {
    id: 2,
    date: 'Wrzesień 2024',
    title: 'Mentoring nowych wolontariuszy',
    description: 'Cykl spotkań wdrożeniowych dla 25 osób z 5 szkół.',
  },
  {
    id: 3,
    date: 'Czerwiec 2024',
    title: 'Festyn sąsiedzki „Poznajmy się”',
    description: 'Odpowiedzialność za program sceniczny i komunikację z partnerami.',
  },
]

export default function VolunteerPanelPage() {
  return (
    <section className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.identity}>
          <div className={styles.avatar} aria-hidden="true">
            JN
          </div>
          <div className={styles.identityDetails}>
            <span className={styles.role}>Wolontariuszka</span>
            <h1>Julia Nowak</h1>
            <p>Kraków i okolice • specjalizacja: animacja wydarzeń międzykulturowych</p>
          </div>
        </div>
        <div className={styles.actions}>
          <button type="button" className={styles.primaryAction}>
            Zaplanuj rozmowę rozwojową
          </button>
          <button type="button" className={styles.secondaryAction}>
            Udostępnij profil
          </button>
        </div>
      </header>

      <section className={styles.metrics} aria-label="Podsumowanie aktywności">
        <article className={styles.metric}>
          <span className={styles.metricValue}>312 h</span>
          <span className={styles.metricLabel}>Łączny czas wolontariatu</span>
        </article>
        <article className={styles.metric}>
          <span className={styles.metricValue}>18</span>
          <span className={styles.metricLabel}>Zrealizowanych inicjatyw</span>
        </article>
        <article className={styles.metric}>
          <span className={styles.metricValue}>4.9/5</span>
          <span className={styles.metricLabel}>Średnia ocena koordynatorów</span>
        </article>
      </section>

      <div className={styles.sections}>
        <div className={styles.mainColumn}>
          <section className={styles.card}>
            <h2>Obszary zaangażowania</h2>
            <ul className={styles.tags}>
              <li>Integracja młodzieży</li>
              <li>Wsparcie seniorów</li>
              <li>Wydarzenia kulturalne</li>
              <li>Edukacja obywatelska</li>
            </ul>
            <div className={styles.detailGrid}>
              <div>
                <h3>Dostępność</h3>
                <p>Wtorki i czwartki 16:00 – 20:00 • Weekendy według ustaleń</p>
              </div>
              <div>
                <h3>Preferowane role</h3>
                <p>Koordynacja wolontariuszy, prowadzenie warsztatów, moderacja spotkań</p>
              </div>
              <div>
                <h3>Języki</h3>
                <p>Polski (C2), Angielski (C1), Ukraiński (B1)</p>
              </div>
              <div>
                <h3>Transport</h3>
                <p>Rower, komunikacja miejska, możliwość dojazdu do 20 km</p>
              </div>
            </div>
          </section>

          <section className={styles.card}>
            <h2>Nadchodzące dyżury</h2>
            <ul className={styles.shiftList}>
              {upcomingShifts.map((shift) => (
                <li key={shift.id} className={styles.shiftItem}>
                  <div className={styles.shiftHeader}>
                    <h3>{shift.title}</h3>
                    <span className={styles.shiftStatus}>{shift.status}</span>
                  </div>
                  <p>{shift.location}</p>
                  <p className={styles.shiftMeta}>
                    <span>{shift.date}</span>
                    <span>{shift.time}</span>
                  </p>
                </li>
              ))}
            </ul>
          </section>

          <section className={styles.card}>
            <h2>Historia działań</h2>
            <ol className={styles.timeline}>
              {timeline.map((entry) => (
                <li key={entry.id} className={styles.timelineItem}>
                  <span className={styles.timelineDate}>{entry.date}</span>
                  <div>
                    <h3>{entry.title}</h3>
                    <p>{entry.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <div className={styles.sideColumn}>
          <section className={styles.card}>
            <h2>Umiejętności</h2>
            <ul className={styles.skillsList}>
              {skills.map((skill) => (
                <li key={skill.name} className={styles.skillItem}>
                  <span>{skill.name}</span>
                  <span className={styles.skillLevel}>{skill.level}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className={styles.card}>
            <h2>Wyróżnienia</h2>
            <ul className={styles.achievementsList}>
              {achievements.map((achievement) => (
                <li key={achievement.id} className={styles.achievementItem}>
                  <h3>{achievement.title}</h3>
                  <p>{achievement.description}</p>
                </li>
              ))}
            </ul>
          </section>

          <section className={styles.card}>
            <h2>Kontakt i dokumenty</h2>
            <dl className={styles.definitionList}>
              <div>
                <dt>Email</dt>
                <dd>
                  <a href="mailto:julia.nowak@mlodzidzialaja.pl">julia.nowak@mlodzidzialaja.pl</a>
                </dd>
              </div>
              <div>
                <dt>Telefon</dt>
                <dd>
                  <a href="tel:+48511222333">+48 511 222 333</a>
                </dd>
              </div>
              <div>
                <dt>Opiekun</dt>
                <dd>Anna Kowalska, Centrum Wolontariatu Kraków</dd>
              </div>
              <div>
                <dt>Dokumenty</dt>
                <dd>
                  <button type="button" className={styles.linkButton}>Pobierz zgodę opiekuna</button>
                </dd>
              </div>
            </dl>
          </section>
        </div>
      </div>
    </section>
  )
}
