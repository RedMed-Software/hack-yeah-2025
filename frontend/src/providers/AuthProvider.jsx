import { useCallback, useMemo } from 'react'
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import { ResponseError } from '@ory/client-fetch'
import { AuthContext } from './AuthContext.js'
import { ory } from '../services/ory.js'

function AuthContextProvider({ children }) {
  const {
    data: session,
    isPending,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      try {
        return await ory.toSession()
      } catch (requestError) {
        if (requestError instanceof ResponseError) {
          if (requestError.response.status === 401) {
            return null
          }
          throw requestError
        }
        console.warn('Unable to reach the authentication service', requestError)
        return null
      }
    },
    retry: false,
    staleTime: 30000,
  })

  const logout = useCallback(async () => {
    try {
      const flow = await ory.createBrowserLogoutFlow()
      if (flow.logout_url) {
        window.location.href = flow.logout_url
        return
      }
    } catch (requestError) {
      if (!(requestError instanceof ResponseError && requestError.response.status === 401)) {
        console.error('Unable to start logout flow', requestError)
      }
    }
    await refetch()
  }, [refetch])

  const value = useMemo(
    () => ({
      session: session ?? null,
      isLoading: isPending,
      isError,
      error: error ?? null,
      refresh: refetch,
      logout,
    }),
    [session, isPending, isError, error, refetch, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
})

export function AuthProvider({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>{children}</AuthContextProvider>
    </QueryClientProvider>
  )
}
