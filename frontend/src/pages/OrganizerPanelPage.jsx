import { useEffect, useMemo, useState } from 'react'
import styles from './OrganizerPanelPage.module.scss'

const organizerProfile = {
  name: 'Marta Zawadzka',
  role: 'Koordynatorka programu',
  phone: '+48 501 222 198',
  email: 'marta.zawadzka@mlodzi-dzialaja.pl',
  languages: ['polski', 'angielski'],
  focusAreas: ['partycypacja młodzieży', 'partnerstwa lokalne'],
}

const organizationProfile = {
  name: 'Fundacja Młodzi Działają',
  founded: 2012,
  location: {
    city: 'Warszawa',
    venue: 'Centrum Aktywności Społecznej',
    address: 'ul. Solidarności 27',
  },
  mission:
    'Wspieramy młodych liderów w rozwijaniu projektów społecznych, łącząc edukację obywatelską z działaniem w terenie.',
  programs: ['inkubator projektów', 'mikrogranty sąsiedzkie', 'akademia wolontariatu'],
  website: 'https://mlodzi-dzialaja.pl',
}

const events = [
  {
    id: 'civic-lab-2025',
    name: 'Civic Lab 2025',
    status: 'upcoming',
    summary:
      'Trzydniowe laboratorium projektowe, w trakcie którego młodzież tworzy rozwiązania dla wyzwań lokalnych.',
    dates: { start: '2025-04-10', end: '2025-04-12' },
    time: '09:30–17:30',
    mainLocation: {
      venue: 'Centrum Innowacji Młodych',
      city: 'Warszawa',
      address: 'ul. Przemian 4',
    },
    focusAreas: ['innowacje społeczne', 'edukacja obywatelska'],
    capacity: { participants: 80, volunteers: 28 },
    registrations: 63,
    tasks: [
      {
        id: 'civic-registration',
        title: 'Rejestracja uczestników',
        description: 'Przyjmowanie młodzieży i wydawanie pakietów startowych.',
        location: 'Hol główny',
        date: '2025-04-10',
        timeFrom: '08:00',
        timeTo: '10:30',
        volunteerNeeds: {
          minAge: 18,
          skills: ['komunikacja interpersonalna', 'obsługa systemów rejestracyjnych'],
          experience: 'Doświadczenie w pracy z młodzieżą mile widziane.',
          additional: 'Potrzebne 4 osoby na poranną zmianę.',
        },
      },
      {
        id: 'civic-labsupport',
        title: 'Wsparcie zespołów projektowych',
        description: 'Moderowanie pracy warsztatowej i raportowanie postępów.',
        location: 'Sala warsztatowa B',
        date: '2025-04-10',
        timeFrom: '10:00',
        timeTo: '17:30',
        volunteerNeeds: {
          minAge: 19,
          skills: ['facylitacja spotkań', 'notowanie wizualne'],
          experience: 'Minimum jeden zrealizowany projekt społeczny.',
          additional: '6 osób rotacyjnie w dwugodzinnych blokach.',
        },
      },
      {
        id: 'civic-media',
        title: 'Zespół medialny',
        description: 'Dokumentowanie wydarzenia, krótkie wywiady i relacje live.',
        location: 'Strefa networkingowa',
        date: '2025-04-11',
        timeFrom: '09:00',
        timeTo: '17:00',
        volunteerNeeds: {
          minAge: 17,
          skills: ['fotografia', 'montaż krótkich materiałów wideo'],
          experience: 'Portfolio lub link do wcześniejszych realizacji.',
          additional: '5 osób, możliwość pracy w parach.',
        },
      },
    ],
  },
  {
    id: 'youth-forum-2024',
    name: 'Youth Forum 2024',
    status: 'completed',
    summary:
      'Ogólnopolskie forum młodych liderów z debatami, konsultacjami eksperckimi i targami organizacji.',
    dates: { start: '2024-09-19', end: '2024-09-21' },
    time: '10:00–18:00',
    mainLocation: {
      venue: 'Hala Expo Łódź',
      city: 'Łódź',
      address: 'al. Politechniki 4',
    },
    focusAreas: ['polityka młodzieżowa', 'demokracja lokalna'],
    capacity: { participants: 450, volunteers: 75 },
    registrations: 418,
    tasks: [
      {
        id: 'youth-stage',
        title: 'Zarządzanie sceną główną',
        description: 'Koordynowanie wejść prelegentów i obsługa zaplecza technicznego.',
        location: 'Scena główna',
        date: '2024-09-19',
        timeFrom: '09:00',
        timeTo: '19:00',
        volunteerNeeds: {
          minAge: 20,
          skills: ['koordynacja zespołu', 'obsługa techniczna eventów'],
          experience: 'Minimum jeden duży event w portfolio.',
          additional: '8 osób pracujących w parach.',
        },
      },
      {
        id: 'youth-care',
        title: 'Strefa dobrostanu',
        description: 'Opieka nad strefą odpoczynku, prowadzenie krótkich aktywizacji.',
        location: 'Strefa relaksu',
        date: '2024-09-20',
        timeFrom: '10:00',
        timeTo: '18:00',
        volunteerNeeds: {
          minAge: 18,
          skills: ['animacja czasu wolnego', 'pierwsza pomoc'],
          experience: 'Certyfikat pierwszej pomocy lub szkolenie HSR.',
          additional: '6 osób na dwie zmiany.',
        },
      },
    ],
  },
  {
    id: 'green-weekend-2025',
    name: 'Green Weekend',
    status: 'upcoming',
    summary:
      'Weekendowy cykl warsztatów ekologicznych i akcji sprzątania terenów zielonych.',
    dates: { start: '2025-06-06', end: '2025-06-08' },
    time: '08:30–16:30',
    mainLocation: {
      venue: 'Park Nadmorski',
      city: 'Gdańsk',
      address: 'ul. Brzegowa 5',
    },
    focusAreas: ['ekologia', 'wolontariat rodzinny'],
    capacity: { participants: 220, volunteers: 52 },
    registrations: 188,
    tasks: [
      {
        id: 'green-logistics',
        title: 'Logistyka sprzętu',
        description: 'Rozstawienie punktów warsztatowych i zabezpieczenie materiałów.',
        location: 'Magazyn przy parku',
        date: '2025-06-06',
        timeFrom: '07:00',
        timeTo: '10:00',
        volunteerNeeds: {
          minAge: 18,
          skills: ['organizacja pracy', 'podstawy BHP'],
          experience: 'Doświadczenie w pracy fizycznej w plenerze.',
          additional: 'Potrzeba 10 osób, wymagane rękawice robocze.',
        },
      },
      {
        id: 'green-education',
        title: 'Edukatorzy terenowi',
        description: 'Prowadzenie stanowisk edukacyjnych i krótkich gier ekologicznych.',
        location: 'Strefa warsztatowa',
        date: '2025-06-07',
        timeFrom: '09:00',
        timeTo: '16:30',
        volunteerNeeds: {
          minAge: 17,
          skills: ['praca z dziećmi', 'wiedza ekologiczna'],
          experience: 'Minimum jeden wolontariat w podobnej tematyce.',
          additional: '12 osób, krótkie szkolenie dzień wcześniej.',
        },
      },
      {
        id: 'green-cleanup',
        title: 'Koordynacja sprzątania',
        description: 'Przydzielanie ekipom sektorów i raportowanie postępów.',
        location: 'Punkt zbiórki przy wejściu głównym',
        date: '2025-06-08',
        timeFrom: '08:30',
        timeTo: '15:30',
        volunteerNeeds: {
          minAge: 18,
          skills: ['zarządzanie zespołem', 'logistyka wydarzeń'],
          experience: 'Preferowane doświadczenie w akcjach społecznych.',
          additional: '8 osób, wymagane prawo jazdy kat. B dla dwóch osób.',
        },
      },
    ],
  },
]

const matchesSearch = (event, query) => {
  if (!query) {
    return true
  }
  const haystack = [
    event.name,
    event.mainLocation.city,
    event.mainLocation.venue,
    ...event.focusAreas,
  ]
    .join(' ')
    .toLowerCase()
  return haystack.includes(query)
}

const formatDateRange = ({ start, end }) => {
  if (start === end) {
    return start
  }
  return `${start} – ${end}`
}

export default function OrganizerPanelPage() {
  const [searchValue, setSearchValue] = useState('')
  const [selectedEventId, setSelectedEventId] = useState(events[0]?.id ?? null)

  const query = searchValue.trim().toLowerCase()

  const upcomingEvents = useMemo(
    () => events.filter((event) => event.status === 'upcoming' && matchesSearch(event, query)),
    [query],
  )

  const completedEvents = useMemo(
    () => events.filter((event) => event.status === 'completed' && matchesSearch(event, query)),
    [query],
  )

  const visibleEvents = useMemo(
    () => [...upcomingEvents, ...completedEvents],
    [upcomingEvents, completedEvents],
  )

  useEffect(() => {
    if (visibleEvents.length === 0) {
      if (selectedEventId !== null) {
        setSelectedEventId(null)
      }
      return
    }
    if (!selectedEventId || !visibleEvents.some((event) => event.id === selectedEventId)) {
      setSelectedEventId(visibleEvents[0].id)
    }
  }, [visibleEvents, selectedEventId])

  const selectedEvent = visibleEvents.find((event) => event.id === selectedEventId) ?? null

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1>Panel organizatora</h1>
          <p>Kompleksowy podgląd osoby kontaktowej, organizacji oraz wszystkich wydarzeń.</p>
        </div>
        <div className={styles.searchBox}>
          <label htmlFor="event-search">Wyszukaj wydarzenie</label>
          <input
            id="event-search"
            type="search"
            placeholder="np. Green Weekend, Łódź, ekologia"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
          />
        </div>
      </header>

      <div className={styles.infoGrid}>
        <section className={styles.card}>
          <h2>Informacje o organizatorce</h2>
          <dl className={styles.dataList}>
            <div>
              <dt>Imię i nazwisko</dt>
              <dd>{organizerProfile.name}</dd>
            </div>
            <div>
              <dt>Rola</dt>
              <dd>{organizerProfile.role}</dd>
            </div>
            <div>
              <dt>Telefon</dt>
              <dd>{organizerProfile.phone}</dd>
            </div>
            <div>
              <dt>E-mail</dt>
              <dd>{organizerProfile.email}</dd>
            </div>
            <div>
              <dt>Języki</dt>
              <dd>{organizerProfile.languages.join(', ')}</dd>
            </div>
            <div>
              <dt>Specjalizacje</dt>
              <dd>{organizerProfile.focusAreas.join(', ')}</dd>
            </div>
          </dl>
        </section>
        <section className={styles.card}>
          <h2>Organizacja</h2>
          <dl className={styles.dataList}>
            <div>
              <dt>Nazwa</dt>
              <dd>{organizationProfile.name}</dd>
            </div>
            <div>
              <dt>Rok założenia</dt>
              <dd>{organizationProfile.founded}</dd>
            </div>
            <div>
              <dt>Lokalizacja</dt>
              <dd>
                {organizationProfile.location.venue}
                <br />
                {organizationProfile.location.address}
                <br />
                {organizationProfile.location.city}
              </dd>
            </div>
            <div>
              <dt>Programy</dt>
              <dd>{organizationProfile.programs.join(', ')}</dd>
            </div>
            <div>
              <dt>Misja</dt>
              <dd>{organizationProfile.mission}</dd>
            </div>
            <div>
              <dt>Strona</dt>
              <dd>
                <a href={organizationProfile.website} target="_blank" rel="noreferrer">
                  {organizationProfile.website}
                </a>
              </dd>
            </div>
          </dl>
        </section>
      </div>

      <div className={styles.eventsLayout}>
        <section className={styles.card}>
          <h2>Zarejestrowane wydarzenia</h2>
          {upcomingEvents.length === 0 ? (
            <p className={styles.emptyState}>Brak wydarzeń spełniających kryteria wyszukiwania.</p>
          ) : (
            <ul className={styles.eventList}>
              {upcomingEvents.map((event) => (
                <li key={event.id}>
                  <button
                    type="button"
                    className={selectedEventId === event.id ? styles.eventButtonActive : styles.eventButton}
                    onClick={() => setSelectedEventId(event.id)}
                  >
                    <span className={styles.eventName}>{event.name}</span>
                    <span className={styles.eventMeta}>
                      <span>{formatDateRange(event.dates)}</span>
                      <span>
                        {event.mainLocation.city} • {event.mainLocation.venue}
                      </span>
                    </span>
                    <span className={styles.eventBadges}>
                      <span>{event.focusAreas.join(' • ')}</span>
                      <span>{event.registrations} zgłoszeń</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
        <section className={styles.card}>
          <h2>Zrealizowane wydarzenia</h2>
          {completedEvents.length === 0 ? (
            <p className={styles.emptyState}>Brak wydarzeń spełniających kryteria wyszukiwania.</p>
          ) : (
            <ul className={styles.eventList}>
              {completedEvents.map((event) => (
                <li key={event.id}>
                  <button
                    type="button"
                    className={selectedEventId === event.id ? styles.eventButtonActive : styles.eventButton}
                    onClick={() => setSelectedEventId(event.id)}
                  >
                    <span className={styles.eventName}>{event.name}</span>
                    <span className={styles.eventMeta}>
                      <span>{formatDateRange(event.dates)}</span>
                      <span>
                        {event.mainLocation.city} • {event.mainLocation.venue}
                      </span>
                    </span>
                    <span className={styles.eventBadges}>
                      <span>{event.focusAreas.join(' • ')}</span>
                      <span>{event.registrations} zgłoszeń</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className={styles.card}>
        <h2>Szczegóły wydarzenia</h2>
        {!selectedEvent ? (
          <p className={styles.emptyState}>Wybierz wydarzenie, aby zobaczyć szczegóły.</p>
        ) : (
          <div className={styles.eventDetails}>
            <div className={styles.eventSummary}>
              <div>
                <h3>{selectedEvent.name}</h3>
                <p>{selectedEvent.summary}</p>
              </div>
              <dl className={styles.dataList}>
                <div>
                  <dt>Termin</dt>
                  <dd>{formatDateRange(selectedEvent.dates)}</dd>
                </div>
                <div>
                  <dt>Godziny</dt>
                  <dd>{selectedEvent.time}</dd>
                </div>
                <div>
                  <dt>Lokalizacja główna</dt>
                  <dd>
                    {selectedEvent.mainLocation.venue}
                    <br />
                    {selectedEvent.mainLocation.address}
                    <br />
                    {selectedEvent.mainLocation.city}
                  </dd>
                </div>
                <div>
                  <dt>Zakres tematyczny</dt>
                  <dd>{selectedEvent.focusAreas.join(', ')}</dd>
                </div>
                <div>
                  <dt>Uczestnicy</dt>
                  <dd>
                    {selectedEvent.registrations} potwierdzonych zgłoszeń<br />
                    Limit {selectedEvent.capacity.participants} osób
                  </dd>
                </div>
                <div>
                  <dt>Wolontariusze</dt>
                  <dd>Potrzeba {selectedEvent.capacity.volunteers} osób</dd>
                </div>
              </dl>
            </div>
            <div className={styles.tasks}>
              <h3>Zadania do zrealizowania</h3>
              <div className={styles.tasksGrid}>
                {selectedEvent.tasks.map((task) => (
                  <article key={task.id} className={styles.taskCard}>
                    <header>
                      <h4>{task.title}</h4>
                      <p>{task.description}</p>
                    </header>
                    <dl className={styles.dataList}>
                      <div>
                        <dt>Lokalizacja</dt>
                        <dd>{task.location}</dd>
                      </div>
                      <div>
                        <dt>Data</dt>
                        <dd>{task.date}</dd>
                      </div>
                      <div>
                        <dt>Godziny</dt>
                        <dd>
                          {task.timeFrom}–{task.timeTo}
                        </dd>
                      </div>
                    </dl>
                    <div className={styles.volunteerNeeds}>
                      <h5>Zapotrzebowanie na wolontariuszy</h5>
                      <dl className={styles.dataList}>
                        <div>
                          <dt>Wiek od</dt>
                          <dd>{task.volunteerNeeds.minAge} lat</dd>
                        </div>
                        <div>
                          <dt>Umiejętności</dt>
                          <dd>{task.volunteerNeeds.skills.join(', ')}</dd>
                        </div>
                        <div>
                          <dt>Doświadczenie</dt>
                          <dd>{task.volunteerNeeds.experience}</dd>
                        </div>
                        <div>
                          <dt>Dodatkowe informacje</dt>
                          <dd>{task.volunteerNeeds.additional}</dd>
                        </div>
                      </dl>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>
    </section>
  )
}
