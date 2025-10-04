import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { login as loginRequest } from '../../api/auth.js'
import styles from './LoginPage.module.scss'

export default function LoginPage({ onLogin }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [formState, setFormState] = useState({ login: '', password: '' })
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormState((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const loginValue = formState.login.trim()
    const passwordValue = formState.password

    if (!loginValue || !passwordValue) {
      setErrorMessage('Podaj login i hasło.')
      return
    }

    setErrorMessage('')
    setIsSubmitting(true)

    try {
      const session = await loginRequest({ login: loginValue, password: passwordValue })
      if (typeof onLogin === 'function') {
        onLogin(session)
      }
      const params = new URLSearchParams(location.search)
      const redirectTo = params.get('redirectTo') ?? params.get('redirect')
      const roles = Array.isArray(session.user?.roles) ? session.user.roles : []

      if (redirectTo) {
        navigate(redirectTo, { replace: true })
      } else if (roles.includes('Administrator') || roles.includes('Koordynator')) {
        navigate('/dashboard', { replace: true })
      } else if (roles.includes('Organizator')) {
        navigate('/organizer', { replace: true })
      } else if (roles.includes('Wolontariusz')) {
        navigate('/volunteer', { replace: true })
      } else {
        navigate('/', { replace: true })
      }

      setFormState({ login: '', password: '' })
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Nie udało się zalogować.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className={styles.page}>
      <div className={styles.formWrapper}>
        <h1 className={styles.title}>Logowanie</h1>
        <p className={styles.subtitle}>
          Uzyskaj dostęp do panelu wolontariusza lub organizatora. Po zalogowaniu przypiszemy Ci właściwy typ konta na podstawie tokenu.
        </p>
        {errorMessage ? <div className={styles.errorMessage}>{errorMessage}</div> : null}
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <label htmlFor="login">
            Login
            <input
              id="login"
              name="login"
              type="text"
              autoComplete="username"
              className="form-controller"
              placeholder="Wpisz login"
              value={formState.login}
              onChange={handleChange}
              disabled={isSubmitting}
              required
            />
          </label>
          <label htmlFor="password">
            Hasło
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              className="form-controller"
              placeholder="Wpisz hasło"
              value={formState.password}
              onChange={handleChange}
              disabled={isSubmitting}
              required
            />
          </label>
          <div className={styles.actions}>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Logowanie...' : 'Zaloguj się'}
            </button>
          </div>
        </form>
        <p className={styles.helperText}>
          Nie masz konta?{' '}
          <Link className={styles.helperLink} to="/register">
            Zarejestruj się
          </Link>
        </p>
      </div>
    </section>
  )
}
