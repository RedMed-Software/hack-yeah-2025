// src/pages/RegisterPage/RegisterPage.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { registerUser } from '../../api/auth'
import styles from './RegisterPage.module.scss'

const userTypes = [
    { value: 'volunteer', label: 'Wolontariusz', description: 'Chcę pomagać podczas wydarzeń i akcji.' },
    { value: 'organizer', label: 'Organizator', description: 'Reprezentuję instytucję i tworzę wydarzenia.' },
    { value: 'coordinator', label: 'Koordynator', description: 'Łączę zespoły i pilnuję przebiegu działań.' },
]

const defaultVolunteerData = { firstName: '', lastName: '', phone: '', age: 0, description: '', availability: '', preferredRoles: '', languages: '', transport: '', skills: '' }
const defaultOrganizerData = { fullName: '', role: '', phone: '', email: '', languages: '', specializations: '', organizationName: '', organizationFoundedYear: '', organizationLocation: '', organizationPrograms: '', organizationMission: '', organizationWebsite: '' }
const defaultCoordinatorData = { firstName: '', lastName: '', description: '' }

function buildRegisterPayload(type, commonData, volunteerData, organizerData, coordinatorData) {
    const payload = {
        login: commonData.login.trim(),
        email: commonData.email.trim(),
        password: commonData.password,
        accountType: type,
        roles: [],
    }

    if (type === 'volunteer') {
        payload.volunteerProfile = {
            firstName: volunteerData.firstName.trim(),
            lastName: volunteerData.lastName.trim(),
            description: volunteerData.description.trim(),
            phone: volunteerData.phone.trim(),
            age: volunteerData.age,
            availability: volunteerData.availability,
            preferredRoles: volunteerData.preferredRoles,
            languages: volunteerData.languages,
            transport: volunteerData.transport,
            skills: volunteerData.skills,
            email: commonData.email.trim(),
        }
    }

    if (type === 'organizer') {
        payload.organizerProfile = {
            fullName: organizerData.fullName.trim(),
            role: organizerData.role.trim(),
            phone: organizerData.phone.trim(),
            email: (organizerData.email || commonData.email).trim(),
            languages: organizerData.languages,
            specializations: organizerData.specializations,
            organization: {
                name: organizerData.organizationName.trim(),
                foundedYear: organizerData.organizationFoundedYear.trim(),
                location: organizerData.organizationLocation.trim(),
                programs: organizerData.organizationPrograms.trim(),
                mission: organizerData.organizationMission.trim(),
                website: organizerData.organizationWebsite.trim(),
            },
        }
    }

    if (type === 'coordinator') {
        payload.coordinatorProfile = {
            firstName: coordinatorData.firstName.trim(),
            lastName: coordinatorData.lastName.trim(),
            description: coordinatorData.description.trim(),
        }
    }

    return payload
}

export default function RegisterPage() {
    const [userType, setUserType] = useState(userTypes[0].value)
    const [commonData, setCommonData] = useState({ login: '', email: '', password: '', confirmPassword: '' })
    const [volunteerData, setVolunteerData] = useState(defaultVolunteerData)
    const [organizerData, setOrganizerData] = useState(defaultOrganizerData)
    const [coordinatorData, setCoordinatorData] = useState(defaultCoordinatorData)
    const [status, setStatus] = useState({ type: '', message: '' })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const navigate = useNavigate()

    const handleTypeChange = (event) => {
        setUserType(event.target.value)
        setStatus({ type: '', message: '' })
    }

    const handleCommonChange = (event) => {
        const { name, value } = event.target
        setCommonData((prev) => ({ ...prev, [name]: value }))
    }

    const handleVolunteerChange = (event) => {
        const { name, value } = event.target
        setVolunteerData((prev) => ({ ...prev, [name]: value }))
    }

    const handleOrganizerChange = (event) => {
        const { name, value } = event.target
        setOrganizerData((prev) => ({ ...prev, [name]: value }))
    }

    const handleCoordinatorChange = (event) => {
        const { name, value } = event.target
        setCoordinatorData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        if (commonData.password !== commonData.confirmPassword) {
            setStatus({ type: 'error', message: 'Hasła nie są zgodne.' })
            return
        }

        setIsSubmitting(true)
        setStatus({ type: '', message: '' })
        const payload = buildRegisterPayload(userType, commonData, volunteerData, organizerData, coordinatorData)

        try {
            const authResponse = await registerUser(payload)
            if (!authResponse?.token) throw new Error('Nie otrzymano tokenu uwierzytelniającego.')

            if (authResponse?.accountId) localStorage.setItem('authAccountId', authResponse.accountId)
            if (authResponse?.token) localStorage.setItem('authToken', authResponse.token)
            if (authResponse?.expiresAt) localStorage.setItem('authTokenExpiresAt', authResponse.expiresAt)
            if (authResponse?.login) localStorage.setItem('authLogin', authResponse.login)
            if (authResponse?.roles) localStorage.setItem('authRoles', JSON.stringify(authResponse.roles))
            if (authResponse?.accountType) localStorage.setItem('authAccountType', authResponse.accountType)

            setStatus({ type: 'success', message: 'Konto zostało utworzone i zalogowano automatycznie.' })
            setUserType(userTypes[0].value)
            setCommonData({ login: '', email: '', password: '', confirmPassword: '' })
            setVolunteerData({ ...defaultVolunteerData })
            // ({ ...defaultVolunteerData,
            //     [name]: name === "age" ? Number(value) : value })
            setOrganizerData({ ...defaultOrganizerData })
            setCoordinatorData({ ...defaultCoordinatorData })

            navigate("/login", { replace: true })
        } catch (error) {
            setStatus({ type: 'error', message: error.message || 'Wystąpił błąd podczas rejestracji.' })
        } finally {
            setIsSubmitting(false)
        }
    }

    const renderVolunteerFields = () => (
        <fieldset className={styles.fieldset}>
            <legend className={styles.legend}>Dane wolontariusza</legend>
            <div className={styles.fieldGrid}>
                <div className={styles.field}>
                    <label className={styles.label} htmlFor="volunteer-firstName">Imię</label>
                    <input id="volunteer-firstName" name="firstName" className={styles.input} value={volunteerData.firstName} onChange={handleVolunteerChange} required autoComplete="given-name" />
                </div>
                <div className={styles.field}>
                    <label className={styles.label} htmlFor="volunteer-lastName">Nazwisko</label>
                    <input id="volunteer-lastName" name="lastName" className={styles.input} value={volunteerData.lastName} onChange={handleVolunteerChange} required autoComplete="family-name" />
                </div>
                <div className={styles.field}>
                    <label className={styles.label} htmlFor="volunteer-phone">Telefon</label>
                    <input id="volunteer-phone" name="phone" className={styles.input} value={volunteerData.phone} onChange={handleVolunteerChange} required autoComplete="tel" />
                </div>
                <div className={styles.field}>
                    <label className={styles.label} htmlFor="volunteer-age">Wiek</label>
                    <input 
                        id="volunteer-age" 
                        name="age" 
                        type="number" 
                        min="7"
                        max= "122"
                        className={styles.input} 
                        value={volunteerData.age} 
                        onChange={handleVolunteerChange} 
                        required 
                        placeholder="Podaj swój wiek" 
                    />
                </div>
                <div className={styles.field}>
                    <label className={styles.label} htmlFor="volunteer-transport">Transport</label>
                    <input id="volunteer-transport" name="transport" className={styles.input} value={volunteerData.transport} onChange={handleVolunteerChange} placeholder="Np. komunikacja miejska, rower" />
                </div>
                <div className={styles.field}>
                    <label className={styles.label} htmlFor="volunteer-preferredRoles">Preferowane role</label>
                    <input id="volunteer-preferredRoles" name="preferredRoles" className={styles.input} value={volunteerData.preferredRoles} onChange={handleVolunteerChange} placeholder="Wpisz najważniejsze zadania, które Cię interesują" />
                </div>
            </div>
            <div className={styles.field}>
                <label className={styles.label} htmlFor="volunteer-description">Krótki opis</label>
                <textarea id="volunteer-description" name="description" className={styles.textarea} value={volunteerData.description} onChange={handleVolunteerChange} required placeholder="Opisz swoje doświadczenie i motywację" />
            </div>
            <div className={styles.field}>
                <label className={styles.label} htmlFor="volunteer-availability">Dostępność</label>
                <textarea id="volunteer-availability" name="availability" className={styles.textarea} value={volunteerData.availability} onChange={handleVolunteerChange} placeholder="Opisz dni i godziny, kiedy możesz działać" />
                <span className={styles.note}>Możesz wpisać kilka pozycji, rozdzielając je enterami.</span>
            </div>
            <div className={styles.field}>
                <label className={styles.label} htmlFor="volunteer-languages">Języki</label>
                <textarea id="volunteer-languages" name="languages" className={styles.textarea} value={volunteerData.languages} onChange={handleVolunteerChange} placeholder="Np. polski (C1), angielski (B2)" />
            </div>
            <div className={styles.field}>
                <label className={styles.label} htmlFor="volunteer-skills">Umiejętności</label>
                <textarea id="volunteer-skills" name="skills" className={styles.textarea} value={volunteerData.skills} onChange={handleVolunteerChange} placeholder="Wymień swoje najważniejsze umiejętności" />
            </div>
        </fieldset>
    )

    const renderOrganizerFields = () => (
        <fieldset className={styles.fieldset}>
            <legend className={styles.legend}>Dane organizatora</legend>
            <div className={styles.fieldGrid}>
                <div className={styles.field}>
                    <label className={styles.label} htmlFor="organizer-fullName">Imię i nazwisko</label>
                    <input id="organizer-fullName" name="fullName" className={styles.input} value={organizerData.fullName} onChange={handleOrganizerChange} required />
                </div>
                <div className={styles.field}>
                    <label className={styles.label} htmlFor="organizer-role">Rola w organizacji</label>
                    <input id="organizer-role" name="role" className={styles.input} value={organizerData.role} onChange={handleOrganizerChange} required />
                </div>
                <div className={styles.field}>
                    <label className={styles.label} htmlFor="organizer-phone">Telefon</label>
                    <input id="organizer-phone" name="phone" className={styles.input} value={organizerData.phone} onChange={handleOrganizerChange} required autoComplete="tel" />
                </div>
                <div className={styles.field}>
                    <label className={styles.label} htmlFor="organizer-email">Adres e-mail</label>
                    <input id="organizer-email" name="email" className={styles.input} value={organizerData.email} onChange={handleOrganizerChange} placeholder="Jeśli inny niż logowania" autoComplete="email" />
                </div>
                <div className={styles.field}>
                    <label className={styles.label} htmlFor="organizer-languages">Języki</label>
                    <input id="organizer-languages" name="languages" className={styles.input} value={organizerData.languages} onChange={handleOrganizerChange} />
                </div>
                <div className={styles.field}>
                    <label className={styles.label} htmlFor="organizer-specializations">Specjalizacje</label>
                    <input id="organizer-specializations" name="specializations" className={styles.input} value={organizerData.specializations} onChange={handleOrganizerChange} />
                </div>
            </div>
            <div className={styles.fieldGrid}>
                <div className={styles.field}>
                    <label className={styles.label} htmlFor="organization-name">Nazwa organizacji</label>
                    <input id="organization-name" name="organizationName" className={styles.input} value={organizerData.organizationName} onChange={handleOrganizerChange} required />
                </div>
                <div className={styles.field}>
                    <label className={styles.label} htmlFor="organization-foundedYear">Rok założenia</label>
                    <input id="organization-foundedYear" name="organizationFoundedYear" className={styles.input} value={organizerData.organizationFoundedYear} onChange={handleOrganizerChange} required inputMode="numeric" />
                </div>
                <div className={styles.field}>
                    <label className={styles.label} htmlFor="organization-website">Strona internetowa</label>
                    <input id="organization-website" name="organizationWebsite" className={styles.input} value={organizerData.organizationWebsite} onChange={handleOrganizerChange} required autoComplete="url" />
                </div>
            </div>
            <div className={styles.field}>
                <label className={styles.label} htmlFor="organization-location">Lokalizacja</label>
                <textarea id="organization-location" name="organizationLocation" className={styles.textarea} value={organizerData.organizationLocation} onChange={handleOrganizerChange} required placeholder="Adres siedziby lub obszar działania" />
            </div>
            <div className={styles.field}>
                <label className={styles.label} htmlFor="organization-programs">Programy</label>
                <textarea id="organization-programs" name="organizationPrograms" className={styles.textarea} value={organizerData.organizationPrograms} onChange={handleOrganizerChange} required placeholder="Opisz główne programy i działania" />
            </div>
            <div className={styles.field}>
                <label className={styles.label} htmlFor="organization-mission">Misja</label>
                <textarea id="organization-mission" name="organizationMission" className={styles.textarea} value={organizerData.organizationMission} onChange={handleOrganizerChange} required placeholder="W kilku zdaniach opisz misję organizacji" />
            </div>
        </fieldset>
    )

    const renderCoordinatorFields = () => (
        <fieldset className={styles.fieldset}>
            <legend className={styles.legend}>Dane koordynatora</legend>
            <div className={styles.fieldGrid}>
                <div className={styles.field}>
                    <label className={styles.label} htmlFor="coordinator-firstName">Imię</label>
                    <input id="coordinator-firstName" name="firstName" className={styles.input} value={coordinatorData.firstName} onChange={handleCoordinatorChange} required autoComplete="given-name" />
                </div>
                <div className={styles.field}>
                    <label className={styles.label} htmlFor="coordinator-lastName">Nazwisko</label>
                    <input id="coordinator-lastName" name="lastName" className={styles.input} value={coordinatorData.lastName} onChange={handleCoordinatorChange} required autoComplete="family-name" />
                </div>
            </div>
            <div className={styles.field}>
                <label className={styles.label} htmlFor="coordinator-description">Opis</label>
                <textarea id="coordinator-description" name="description" className={styles.textarea} value={coordinatorData.description} onChange={handleCoordinatorChange} required placeholder="Opisz swoje doświadczenie i zadania" />
            </div>
        </fieldset>
    )

    const renderTypeSpecificFields = () => {
        if (userType === 'organizer') return renderOrganizerFields()
        if (userType === 'coordinator') return renderCoordinatorFields()
        return renderVolunteerFields()
    }

    const statusClassName = status.type === 'success'
        ? `${styles.status} ${styles.statusSuccess}`
        : status.type === 'error'
            ? `${styles.status} ${styles.statusError}`
            : ''

    return (
        <main className={styles.page}>
            <section className={styles.formWrapper}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Dołącz do nas</h1>
                    <p className={styles.subtitle}>Utwórz konto i zacznij zmieniać świat razem z nami</p>
                </div>

                {statusClassName && <div className={statusClassName}>{status.message}</div>}

                <form className={styles.form} onSubmit={handleSubmit}>
                    <fieldset className={styles.fieldset}>
                        <legend className={styles.legend}>Dane logowania</legend>
                        <div className={styles.fieldGrid}>
                            <div className={styles.field}>
                                <label className={styles.label} htmlFor="login">Login</label>
                                <input id="login" name="login" className={styles.input} value={commonData.login} onChange={handleCommonChange} required autoComplete="username" />
                            </div>
                            <div className={styles.field}>
                                <label className={styles.label} htmlFor="email">Adres e-mail</label>
                                <input id="email" name="email" className={styles.input} type="email" value={commonData.email} onChange={handleCommonChange} required autoComplete="email" />
                            </div>
                        </div>
                        <div className={styles.fieldGrid}>
                            <div className={styles.field}>
                                <label className={styles.label} htmlFor="password">Hasło</label>
                                <input id="password" name="password" className={styles.input} type="password" value={commonData.password} onChange={handleCommonChange} required autoComplete="new-password" />
                            </div>
                            <div className={styles.field}>
                                <label className={styles.label} htmlFor="confirmPassword">Powtórz hasło</label>
                                <input id="confirmPassword" name="confirmPassword" className={styles.input} type="password" value={commonData.confirmPassword} onChange={handleCommonChange} required autoComplete="new-password" />
                            </div>
                        </div>
                    </fieldset>

                    <fieldset className={styles.fieldset}>
                        <legend className={styles.legend}>Kim chcesz być w naszej społeczności?</legend>
                        <div className={styles.typeSelection}>
                            {userTypes.map((option) => (
                                <label key={option.value} className={`${styles.radioOption} ${userType === option.value ? styles.radioOptionActive : ''}`.trim()}>
                                    <input type="radio" name="userType" value={option.value} checked={userType === option.value} onChange={handleTypeChange} className={styles.radioInput} />
                                    <span className={styles.radioContent}>
                                        <span className={styles.radioLabel}>{option.label}</span>
                                        <span className={styles.radioDescription}>{option.description}</span>
                                    </span>
                                </label>
                            ))}
                        </div>
                    </fieldset>

                    {renderTypeSpecificFields()}

                    <div className={styles.actions}>
                        <button type="submit" className={styles.submit} disabled={isSubmitting}>
                            {isSubmitting ? 'Tworzenie konta...' : 'Utwórz konto'}
                        </button>
                    </div>
                </form>
            </section>
        </main>
    )
}