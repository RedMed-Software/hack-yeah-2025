import { useState } from 'react'

export default function RegisterPage() {
  const [form, setForm] = useState({ email: '', password: '', confirmPassword: '' })

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
  }

  return (
    <section className="page">
      <h1>Create account</h1>
      <form className="form" onSubmit={handleSubmit}>
        <label>
          Email
          <input className="form-controller" name="email" type="email" value={form.email} onChange={handleChange} required />
        </label>
        <label>
          Password
          <input className="form-controller" name="password" type="password" value={form.password} onChange={handleChange} required />
        </label>
        <label>
          Confirm password
          <input className="form-controller" name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} required />
        </label>
        <button className="btn btn-primary" type="submit">Register</button>
      </form>
    </section>
  )
}
