import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ResponseError } from '@ory/client-fetch'
import OryFlowForm from '../components/OryFlowForm.jsx'
import { ory } from '../services/ory.js'
import { useAuth } from '../providers/useAuth.js'

const FLOW_RESET_STATUSES = [403, 404, 410]

export default function RegisterPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [flow, setFlow] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const navigate = useNavigate()
  const { refresh } = useAuth()

  const flowId = searchParams.get('flow')
  const returnToParam = searchParams.get('return_to')

  const sanitizedReturnTo = useMemo(() => {
    if (!returnToParam) {
      return null
    }
    try {
      const target = new URL(returnToParam, window.location.origin)
      if (target.origin !== window.location.origin) {
        return null
      }
      return `${target.pathname}${target.search}${target.hash}`
    } catch (error) {
      console.error('Invalid return_to parameter ignored', error)
      return null
    }
  }, [returnToParam])

  const absoluteReturnTo = useMemo(() => {
    if (!sanitizedReturnTo) {
      return undefined
    }
    return new URL(sanitizedReturnTo, window.location.origin).toString()
  }, [sanitizedReturnTo])

  const buildSearchParams = useCallback(
    (nextFlow) => {
      const params = new URLSearchParams()
      if (sanitizedReturnTo) {
        params.set('return_to', sanitizedReturnTo)
      }
      if (nextFlow) {
        params.set('flow', nextFlow.id)
      }
      setSearchParams(params, { replace: true })
    },
    [sanitizedReturnTo, setSearchParams],
  )

  const restartFlow = useCallback(() => {
    setFlow(null)
    buildSearchParams(null)
  }, [buildSearchParams])

  useEffect(() => {
    let cancelled = false

    const initializeFlow = async () => {
      setIsLoading(true)
      try {
        if (flowId) {
          const existingFlow = await ory.getRegistrationFlow({ id: flowId })
          if (cancelled) {
            return
          }
          setFlow(existingFlow)
          setFormError('')
          return
        }

        const newFlow = await ory.createBrowserRegistrationFlow({ returnTo: absoluteReturnTo })
        if (cancelled) {
          return
        }
        setFlow(newFlow)
        buildSearchParams(newFlow)
        setFormError('')
      } catch (error) {
        if (cancelled) {
          return
        }
        if (error instanceof ResponseError && FLOW_RESET_STATUSES.includes(error.response.status)) {
          restartFlow()
          return
        }
        console.error('Unable to initialize registration flow', error)
        setFormError('Unable to initialize the registration form. Please try again.')
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    initializeFlow()

    return () => {
      cancelled = true
    }
  }, [flowId, absoluteReturnTo, buildSearchParams, restartFlow])

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!flow) {
      restartFlow()
      return
    }

    setIsSubmitting(true)
    setFormError('')
    setSuccessMessage('')

    const formData = new FormData(event.currentTarget)
    const payload = Object.fromEntries(formData.entries())

    try {
      const result = await ory.updateRegistrationFlow({
        flow: flow.id,
        updateRegistrationFlowBody: payload,
      })

      if (result.session) {
        await refresh()
        navigate(sanitizedReturnTo || '/dashboard', { replace: true })
        return
      }

      const redirectInstruction = result.continue_with?.find((item) => item.action === 'redirect_browser_to')
      if (redirectInstruction?.redirect_browser_to) {
        window.location.href = redirectInstruction.redirect_browser_to
        return
      }

      const requiresVerification = result.continue_with?.some((item) => item.action === 'show_verification_ui')
      if (requiresVerification) {
        setSuccessMessage('Registration completed. Please verify your email address before signing in.')
      } else {
        setSuccessMessage('Registration completed. You can now sign in.')
      }
      restartFlow()
    } catch (error) {
      if (error instanceof ResponseError) {
        if (error.response.status === 400) {
          const data = await error.response.json()
          setFlow(data)
          return
        }
        if (FLOW_RESET_STATUSES.includes(error.response.status)) {
          restartFlow()
          return
        }
      }
      console.error('Registration failed', error)
      setFormError('Registration failed. Please review the form and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className={styles.page}>
      <h1>Create account</h1>
      {successMessage ? <p className="flow-message flow-message--success">{successMessage}</p> : null}
      {formError ? <p className="flow-message flow-message--error">{formError}</p> : null}
      {isLoading ? (
        <p>Loading registration form...</p>
      ) : flow ? (
        <OryFlowForm flow={flow} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      ) : (
        <div className="flow-retry">
          <p>We could not load the registration form.</p>
          <button type="button" className="btn btn-primary" onClick={restartFlow}>
            Try again
          </button>
        </div>
      )}
    </section>
  )
}