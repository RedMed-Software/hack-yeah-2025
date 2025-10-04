import styles from './LoginPage.module.scss'
import { useState } from 'react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
  }

  return (
    <section className={styles.page}>
      <h1>Sign in</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label>
          Email
          <input className="form-controller" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        </label>
        <label>
          Password
          <input className="form-controller" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
        </label>
        <button className="btn btn-primary" type="submit">Continue</button>
      </form>
    </section>
  )
}