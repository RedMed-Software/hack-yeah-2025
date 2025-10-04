import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ResponseError } from '@ory/client-fetch'
import OryFlowForm from '../components/OryFlowForm.jsx'
import { ory } from '../services/ory.js'
import { useAuth } from '../providers/useAuth.js'
import { useOryFlowNavigation } from '../hooks/useOryFlowNavigation.js'
import styles from './LoginPage.module.scss'

const FLOW_RESET_STATUSES = new Set([403, 404, 410])

export default function LoginPage() {
  const { flowId, sanitizedReturnTo, absoluteReturnTo, syncSearchParams } = useOryFlowNavigation()
  const [flow, setFlow] = useState(null)
  const [isInitializing, setIsInitializing] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState('')
  const navigate = useNavigate()
  const { refresh } = useAuth()

  const restartFlow = useCallback(() => {
    setFlow(null)
    syncSearchParams(null)
  }, [syncSearchParams])

  useEffect(() => {
    let cancelled = false

    async function loadFlow() {
      setIsInitializing(true)
      try {
        if (flowId) {
          const existingFlow = await ory.getLoginFlow({ id: flowId })
          if (cancelled) {
            return
          }
          setFlow(existingFlow)
          setFormError('')
          return
        }

        const newFlow = await ory.createBrowserLoginFlow({ returnTo: absoluteReturnTo })
        if (cancelled) {
          return
        }
        setFlow(newFlow)
        syncSearchParams(newFlow)
        setFormError('')
      } catch (error) {
        if (cancelled) {
          return
        }
        if (error instanceof ResponseError && error.response && FLOW_RESET_STATUSES.has(error.response.status)) {
          restartFlow()
          return
        }
        console.error('Unable to initialize login flow', error)
        setFormError('We could not reach the authentication service. Please try again.')
      } finally {
        if (!cancelled) {
          setIsInitializing(false)
        }
      }
    }

    loadFlow()

    return () => {
      cancelled = true
    }
  }, [flowId, absoluteReturnTo, syncSearchParams, restartFlow])

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!flow) {
      restartFlow()
      return
    }

    setIsSubmitting(true)
    setFormError('')

    const formData = new FormData(event.currentTarget)
    const payload = Object.fromEntries(formData.entries())

    try {
      await ory.updateLoginFlow({
        flow: flow.id,
        updateLoginFlowBody: payload,
      })
      await refresh()
      navigate(sanitizedReturnTo || '/dashboard', { replace: true })
    } catch (error) {
      if (error instanceof ResponseError && error.response) {
        if (error.response.status === 400) {
          const data = await error.response.json()
          setFlow(data)
          return
        }
        if (FLOW_RESET_STATUSES.has(error.response.status)) {
          restartFlow()
          return
        }
      }
      console.error('Login failed', error)
      setFormError('Login failed. Please review the form and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className={styles.page}>
      <h1 className={styles.title}>Sign in</h1>
      {formError ? <p className="flow-message flow-message--error">{formError}</p> : null}
      {isInitializing ? (
        <p>Loading login form...</p>
      ) : flow ? (
        <div className={styles.formWrapper}>
          <OryFlowForm flow={flow} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </div>
      ) : (
        <div className="flow-retry">
          <p>We could not load the login form.</p>
          <button type="button" className="btn btn-primary" onClick={restartFlow}>
            Try again
          </button>
        </div>
      )}
    </section>
  )
}