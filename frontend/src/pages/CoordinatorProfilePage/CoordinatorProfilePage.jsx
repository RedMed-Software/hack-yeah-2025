import { useEffect, useState } from 'react'
import styles from './CoordinatorProfilePage.module.scss'
import { fetchUserByAccountId } from '../../api/auth';

const metrics = [
    { label: 'Aktywne inicjatywy', value: '8', description: 'Wolontariusze przypisani w tym tygodniu' },
    { label: 'Zespoły w koordynacji', value: '5', description: 'W tym dwa interdyscyplinarne' },
    { label: 'Średni czas reakcji', value: '2 h', description: 'Na zgłoszenia wolontariuszy' },
]

const upcomingMeetings = [
    { id: 1, title: 'Spotkanie zespołu mobilnego', date: '13 stycznia 2025', time: '09:30', location: 'Centrum Obywatelskie' },
    { id: 2, title: 'Warsztat onboardingowy', date: '15 stycznia 2025', time: '17:00', location: 'Online' },
    { id: 3, title: 'Debriefing po wydarzeniu', date: '19 stycznia 2025', time: '11:00', location: 'Fundacja Razem' },
]

const focusAreas = [
    'Budowanie partnerstw lokalnych',
    'Wsparcie wolontariuszy pierwszej linii',
    'Standaryzacja procedur bezpieczeństwa',
    'Monitorowanie wskaźników jakości',
]

const teamMembers = [
    { id: 1, name: 'Katarzyna Mazur', role: 'Specjalistka ds. wolontariatu', availability: 'Poniedziałek – czwartek' },
    { id: 2, name: 'Michał Wójcik', role: 'Koordynator logistyki', availability: 'Wtorek – sobota' },
    { id: 3, name: 'Ola Zielińska', role: 'Mentorka', availability: 'Elastycznie' },
]

export default function CoordinatorProfilePage() {
    const [currentUser, setCurrentUser] = useState(null);
    const [userRole, setUserRole] = useState(null);
    useEffect(() => {
        const roles = localStorage.getItem('authRoles')
        setUserRole(JSON.parse(roles)[0]);
        const userId = localStorage.getItem('authAccountId');
        fetchUserByAccountId(userId)
            .then((user) => {
                setCurrentUser(user)
            })
    }, [])

    console.log(currentUser);
    return (
        <section className={styles.page}>
            <header className={styles.hero}>
                <div>
                    <span className={styles.role}>{userRole}</span>
                    <h1 className={styles.name}>{currentUser?.coordinator?.firstName} {currentUser?.coordinator?.lastName}</h1>
                    <p className={styles.description}>
                        {currentUser?.coordinator?.description}
                    </p>
                </div>
                <div className={styles.actions}>
                    <button type="button" className={styles.secondaryAction}>Zobacz raport miesięczny</button>
                </div>
            </header>

            <section className={styles.metrics}>
                {metrics.map((item) => (
                    <article key={item.label} className={styles.metric}>
                        <span className={styles.metricValue}>{item.value}</span>
                        <span className={styles.metricLabel}>{item.label}</span>
                        <p className={styles.metricDescription}>{item.description}</p>
                    </article>
                ))}
            </section>

            <div className={styles.columns}>
                <div className={styles.mainColumn}>
                    <section className={styles.card}>
                        <h2>Najbliższe spotkania</h2>
                        <ul className={styles.meetingList}>
                            {upcomingMeetings.map((meeting) => (
                                <li key={meeting.id} className={styles.meetingItem}>
                                    <div>
                                        <h3>{meeting.title}</h3>
                                        <p className={styles.meetingMeta}>
                                            <span>{meeting.date}</span>
                                            <span>{meeting.time}</span>
                                            <span>{meeting.location}</span>
                                        </p>
                                    </div>
                                    <button type="button" className={styles.meetingAction}>Przypisz wolontariuszy</button>
                                </li>
                            ))}
                        </ul>
                    </section>

                    <section className={styles.card}>
                        <h2>Priorytetowe obszary</h2>
                        <ul className={styles.tagList}>
                            {focusAreas.map((area) => (
                                <li key={area} className={styles.tag}>{area}</li>
                            ))}
                        </ul>
                    </section>
                </div>

                <aside className={styles.sideColumn}>
                    <section className={styles.card}>
                        <h2>Zespół wsparcia</h2>
                        <ul className={styles.teamList}>
                            {teamMembers.map((member) => (
                                <li key={member.id} className={styles.teamMember}>
                                    <div>
                                        <h3>{member.name}</h3>
                                        <p className={styles.teamRole}>{member.role}</p>
                                    </div>
                                    <span className={styles.teamAvailability}>{member.availability}</span>
                                </li>
                            ))}
                        </ul>
                    </section>
                </aside>
            </div>
        </section>
    )
}
