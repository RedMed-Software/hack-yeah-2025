import { useEffect, useState } from 'react';
import { fetchUserByAccountId } from '../../api/auth';
import styles from './VolunteerPanelPage.module.scss'

const upcomingShifts = [
    // {
    //     id: 1,
    //     title: 'Punkt informacyjny',
    //     location: 'Centrum Kultury Podgórza',
    //     date: '12 stycznia 2025',
    //     time: '10:00 – 14:00',
    //     status: 'Potwierdzony',
    // },
    // {
    //     id: 2,
    //     title: 'Warsztaty integracyjne',
    //     location: 'Szkoła Podstawowa nr 48',
    //     date: '18 stycznia 2025',
    //     time: '09:00 – 13:30',
    //     status: 'Oczekuje na potwierdzenie',
    // },
    // {
    //     id: 3,
    //     title: 'Wizyta w domu seniora',
    //     location: 'Dom Pomocy Społecznej Krowodrza',
    //     date: '25 stycznia 2025',
    //     time: '15:00 – 18:00',
    //     status: 'Potwierdzony',
    // },
]

const timeline = [
    // {
    //     id: 1,
    //     date: 'Listopad 2024',
    //     title: 'Koordynacja zbiórki żywności',
    //     description: 'Zorganizowanie zespołu 12 wolontariuszy, łącznie 800 zebranych paczek.',
    // },
    // {
    //     id: 2,
    //     date: 'Wrzesień 2024',
    //     title: 'Mentoring nowych wolontariuszy',
    //     description: 'Cykl spotkań wdrożeniowych dla 25 osób z 5 szkół.',
    // },
    // {
    //     id: 3,
    //     date: 'Czerwiec 2024',
    //     title: 'Festyn sąsiedzki „Poznajmy się”',
    //     description: 'Odpowiedzialność za program sceniczny i komunikację z partnerami.',
    // },
]

export default function VolunteerPanelPage() {
    const [currentUser, setCurrentUser] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [availability, setAvailability] = useState([]);
    const [languages, setLanguages] = useState([]);
    const [skills, setSkills] = useState([]);
    const [distinctions, setDistinctions] = useState([]);
    const [tags, setTags] = useState([]);
    useEffect(() => {
        const roles = localStorage.getItem('authRoles')
        setUserRole(JSON.parse(roles)[0]);
        const userId = localStorage.getItem('authAccountId');
        fetchUserByAccountId(userId)
            .then((user) => {
                setCurrentUser(user);
                if (user?.volunteer?.availability && typeof user.volunteer.availability === 'object') {
                    setAvailability(Object.values(user.volunteer.availability));
                } else {
                    setAvailability([]);
                }
                if (user?.volunteer?.languages && typeof user.volunteer.languages === 'object') {
                    setLanguages(Object.values(user.volunteer.languages));
                } else {
                    setLanguages([]);
                }
                if (user?.volunteer?.skills && typeof user.volunteer.skills === 'object') {
                    setSkills(Object.values(user.volunteer.skills));
                } else {
                    setSkills([]);
                }
                if (user?.volunteer?.distinctions && Array.isArray(user.volunteer.distinctions)) {
                    setDistinctions(user.volunteer.distinctions);
                } else {
                    setDistinctions([]);
                }
                if (user?.volunteer?.tags && Array.isArray(user.volunteer.tags)) {
                    setTags(user.volunteer.tags);
                } else {
                    setTags([]);
                }
            })
    }, []);

    return (
        <section className={styles.page}>
            <header className={styles.hero}>
                <div className={styles.identity}>
                    <div className={styles.avatar} aria-hidden="true">
                        {currentUser?.volunteer?.firstName && currentUser?.volunteer?.lastName
                            ? `${currentUser.volunteer.firstName[0]}${currentUser.volunteer.lastName[0]}`
                            : '??'}
                    </div>
                    <div className={styles.identityDetails}>
                        <span className={styles.role}>Wolontariusz</span>
                        <h1>{currentUser?.volunteer?.firstName ?? ''} {currentUser?.volunteer?.lastName ?? ''}</h1>
                        <p>{currentUser?.volunteer?.description}</p>
                    </div>
                </div>
            </header>

            <section className={styles.metrics} aria-label="Podsumowanie aktywności">
                <article className={styles.metric}>
                    <span className={styles.metricValue}>312 h</span>
                    <span className={styles.metricLabel}>Łączny czas wolontariatu</span>
                </article>
                <article className={styles.metric}>
                    <span className={styles.metricValue}>{timeline.length}</span>
                    <span className={styles.metricLabel}>Zrealizowanych inicjatyw</span>
                </article>
            </section>

            <div className={styles.sections}>
                <div className={styles.mainColumn}>
                    <section className={styles.card}>
                        <h2>Obszary zaangażowania</h2>
                        <ul className={styles.tags}>
                            {tags.length > 0 ? (
                                tags.map((tag, idx) => (
                                    <li key={idx}>{tag}</li>
                                ))
                            ) : (
                                <li>Brak danych o obszarach zaangażowania</li>
                            )}
                        </ul>
                        <div className={styles.detailGrid}>
                            <div>
                                <h3>Dostępność</h3>
                                <ul>
                                    {availability && availability.length > 0 ? (
                                        availability.map((slot, idx) => (
                                            <li key={idx}>{slot}</li>
                                        ))
                                    ) : (
                                        <li>Brak danych o dostępności</li>
                                    )}
                                </ul>
                            </div>
                            <div>
                                <h3>Preferowane role</h3>
                                <p>{currentUser?.volunteer?.preferredRoles || 'Brak danych o preferowanych rolach'}</p>
                            </div>
                            <div>
                                <h3>Języki</h3>
                                <p>{languages.length > 0 ? languages.join(', ') : 'Brak danych o językach'}</p>
                            </div>
                            <div>
                                <h3>Transport</h3>
                                <p>{currentUser?.volunteer?.transport || 'Brak danych o transporcie'}</p>
                            </div>
                        </div>
                    </section>

                    <section className={styles.card}>
                        <h2>Nadchodzące dyżury</h2>
                        <ul className={styles.shiftList}>
                            {upcomingShifts.length > 0 ? upcomingShifts.map((shift) => (
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
                            )) : <li>Brak nadchodzących dyżurów</li>}
                        </ul>
                    </section>

                    <section className={styles.card}>
                        <h2>Historia działań</h2>
                        <ol className={styles.timeline}>
                            {timeline.length > 0 ? timeline.map((entry) => (
                                <li key={entry.id} className={styles.timelineItem}>
                                    <span className={styles.timelineDate}>{entry.date}</span>
                                    <div>
                                        <h3>{entry.title}</h3>
                                        <p>{entry.description}</p>
                                    </div>
                                </li>
                            )) : <li>Brak historii działań</li>}
                        </ol>
                    </section>
                </div>

                <div className={styles.sideColumn}>
                    <section className={styles.card}>
                        <h2>Umiejętności</h2>
                        <ul className={styles.skillsList}>
                            {skills.length > 0 ? (
                                skills.map((skill, idx) => (
                                    <li key={idx} className={styles.skillItem}>{skill}</li>
                                ))
                            ) : (
                                <li>Brak danych o umiejętnościach</li>
                            )}
                        </ul>
                    </section>

                    <section className={styles.card}>
                        <h2>Wyróżnienia</h2>
                        <ul className={styles.achievementsList}>
                            {distinctions.length > 0 ? (
                                distinctions.map((distinction) => (
                                    <li key={distinction.id} className={styles.achievementItem}>
                                        <h3>{distinction.title}</h3>
                                        <p>{distinction.description}</p>
                                    </li>
                                ))
                            ) : (
                                <li>Brak wyróżnień</li>
                            )}
                        </ul>
                    </section>

                    <section className={styles.card}>
                        <h2>Kontakt i dokumenty</h2>
                        <dl className={styles.definitionList}>
                            <div>
                                <dt>Email</dt>
                                <dd>
                                    <a href={`mailto:${currentUser?.volunteer?.email || currentUser?.email || ''}`}>{currentUser?.volunteer?.email || currentUser?.email || 'Brak danych o adresie email'}</a>
                                </dd>
                            </div>
                            <div>
                                <dt>Telefon</dt>
                                <dd>
                                    <a href={`tel:${currentUser?.volunteer?.phone || ''}`}>{currentUser?.volunteer?.phone || 'Brak danych o numerze telefonu'}</a>
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
