import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginUser } from '../../api/auth'
import styles from './LoginPage.module.scss'

const defaultFormData = {
    login: '',
    password: '',
}

export default function LoginPage() {
    const [formData, setFormData] = useState(defaultFormData)
    const [status, setStatus] = useState({ type: '', message: '' })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const navigate = useNavigate()

    const resolveDestination = (accountType) => {
        if (!accountType) {
            return '/events-actions'
        }

        const normalizedType = accountType.toLowerCase()

        if (normalizedType === 'organizer') {
            return '/organizer'
        }

        if (normalizedType === 'coordinator') {
            return '/coordinator'
        }

        return '/events-actions'
    }

    const handleChange = (event) => {
        const { name, value } = event.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        setIsSubmitting(true)
        setStatus({ type: '', message: '' })

        try {
            const payload = {
                login: formData.login.trim(),
                password: formData.password,
            }

            const authResponse = await loginUser(payload)

            if (!authResponse?.token) {
                throw new Error('Nie otrzymano tokenu uwierzytelniającego.')
            }

            if (authResponse?.accountId) {
                localStorage.setItem('authAccountId', authResponse.accountId)
            }

            if (authResponse?.token) {
                localStorage.setItem('authToken', authResponse.token)
            }

            if (authResponse?.expiresAt) {
                localStorage.setItem('authTokenExpiresAt', authResponse.expiresAt)
            }

            if (authResponse?.login) {
                localStorage.setItem('authLogin', authResponse.login)
            }

            if (authResponse?.roles) {
                localStorage.setItem('authRoles', JSON.stringify(authResponse.roles))
            }

            setStatus({ type: 'success', message: 'Zalogowano pomyślnie' })
            setFormData(defaultFormData)

            if (authResponse?.accountType) {
                localStorage.setItem('authAccountType', authResponse.accountType)
            }

            const destination = resolveDestination(authResponse?.accountType)

            navigate(destination, { replace: true })
        } catch {
            setStatus({ type: 'error', message: 'Błędne dane logowania' })
        } finally {
            setIsSubmitting(false)
        }
    }

    const statusClassNames = [styles.status]

    if (status.type === 'success') {
        statusClassNames.push(styles.statusSuccess)
    }

    if (status.type === 'error') {
        statusClassNames.push(styles.statusError)
    }

    return (
        <section className={styles.page}>
            <div className={styles.formWrapper}>
                <h1 className={styles.title}>Zaloguj się</h1>

                {status.message && (
                    <div className={statusClassNames.join(' ')}>{status.message}</div>
                )}

                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.field}>
                        <label className={styles.label} htmlFor="login">Login</label>
                        <input
                            id="login"
                            name="login"
                            className={styles.input}
                            value={formData.login}
                            onChange={handleChange}
                            required
                            autoComplete="username"
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label} htmlFor="password">Hasło</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            className={styles.input}
                            value={formData.password}
                            onChange={handleChange}
                            required
                            autoComplete="current-password"
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className={styles.actions}>
                        <button className={styles.submit} type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Logowanie...' : 'Zaloguj się'}
                        </button>
                    </div>
                </form>
            </div>
        </section>
    )
}