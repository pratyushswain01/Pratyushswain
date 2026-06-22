/**
 * useAuth.js
 * Custom hook that wraps Supabase Auth.
 * Provides: session, user, loading state, signIn, signUp, signOut helpers.
 * Listens to onAuthStateChange so the app reacts to token refresh / logout.
 */
import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'

export function useAuth() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Hydrate session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    // Keep session in sync across tabs / token refresh
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => setSession(session)
    )

    return () => subscription.unsubscribe()
  }, [])

  // ── Auth actions ────────────────────────────────────────────

  async function signUp({ email, password, fullName }) {
    setError(null)
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    })
    if (error) setError(error.message)
    return { data, error }
  }

  async function signIn({ email, password }) {
    setError(null)
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
    return { data, error }
  }

  async function signOut() {
    setError(null)
    await supabase.auth.signOut()
  }

  return {
    session,
    user: session?.user ?? null,
    loading,
    error,
    signUp,
    signIn,
    signOut,
  }
}
