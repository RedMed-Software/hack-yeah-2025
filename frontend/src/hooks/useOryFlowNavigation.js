import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'

function sanitizeReturnTo(returnToParam) {
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
}

export function useOryFlowNavigation() {
  const [searchParams, setSearchParams] = useSearchParams()
  const flowId = searchParams.get('flow')
  const returnToParam = searchParams.get('return_to')

  const sanitizedReturnTo = useMemo(() => sanitizeReturnTo(returnToParam), [returnToParam])

  const absoluteReturnTo = useMemo(() => {
    if (!sanitizedReturnTo) {
      return undefined
    }
    return new URL(sanitizedReturnTo, window.location.origin).toString()
  }, [sanitizedReturnTo])

  const syncSearchParams = useCallback(
    (nextFlow) => {
      const params = new URLSearchParams()
      if (sanitizedReturnTo) {
        params.set('return_to', sanitizedReturnTo)
      }
      if (nextFlow?.id) {
        params.set('flow', nextFlow.id)
      }
      setSearchParams(params, { replace: true })
    },
    [sanitizedReturnTo, setSearchParams],
  )

  return { flowId, sanitizedReturnTo, absoluteReturnTo, syncSearchParams }
}
