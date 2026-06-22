/**
 * AuthForm.jsx
 * Handles both Sign In and Sign Up in a single, togglable form.
 * Calls useAuth() hooks — no direct Supabase imports here.
 */
import { useState } from 'react'
import { Input } from './Input'
import { Button } from './Button'
import { useAuth } from './useAuth'

export function AuthForm() {
  const { signIn, signUp, error } = useAuth()

  const [mode, setMode] = useState('signin')  // 'signin' | 'signup'
  const [loading, setLoading] = useState(false)
  const [notice, setNotice] = useState(null)
  const [fields, setFields] = useState({ email: '', password: '', fullName: '' })
  const [fieldErrors, setFieldErrors] = useState({})

  const isSignUp = mode === 'signup'

  function handleChange(e) {
    setFields(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setFieldErrors(prev => ({ ...prev, [e.target.name]: null }))
  }

  function validate() {
    const errs = {}
    if (!fields.email) errs.email = 'Email is required.'
    if (!fields.password) errs.password = 'Password is required.'
    if (isSignUp && fields.password.length < 8) errs.password = 'Minimum 8 characters.'
    if (isSignUp && !fields.fullName.trim()) errs.fullName = 'Enter your name.'
    setFieldErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    setNotice(null)

    if (isSignUp) {
      const { error } = await signUp(fields)
      if (!error) {
        setNotice('Check your email to confirm your account, then sign in.')
        setMode('signin')
      }
    } else {
      await signIn(fields)
    }
    setLoading(false)
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-mono text-slate-ui tracking-widest uppercase mb-3">
          JAM 2026 · Physics
        </p>
        <h1 className="text-2xl font-semibold text-ink tracking-tight">
          {isSignUp ? 'Create your account' : 'Welcome back'}
        </h1>
        <p className="text-sm text-slate-ui mt-1">
          {isSignUp
            ? 'Start tracking your mastery across all 7 sections.'
            : 'Sign in to continue your preparation.'}
        </p>
      </div>

      {/* Notice / Success */}
      {notice && (
        <div className="mb-4 px-4 py-3 rounded-lg bg-accent-subtle border border-accent/20 text-sm text-accent">
          {notice}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-status-red/20 text-sm text-status-red">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        {isSignUp && (
          <Input
            id="fullName"
            name="fullName"
            label="Full name"
            type="text"
            placeholder="Pratyush Swain"
            autoComplete="name"
            value={fields.fullName}
            onChange={handleChange}
            error={fieldErrors.fullName}
          />
        )}

        <Input
          id="email"
          name="email"
          label="Email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          value={fields.email}
          onChange={handleChange}
          error={fieldErrors.email}
        />

        <Input
          id="password"
          name="password"
          label="Password"
          type="password"
          placeholder={isSignUp ? 'Min. 8 characters' : '••••••••'}
          autoComplete={isSignUp ? 'new-password' : 'current-password'}
          value={fields.password}
          onChange={handleChange}
          error={fieldErrors.password}
        />

        <Button type="submit" loading={loading} className="mt-2 w-full">
          {isSignUp ? 'Create account' : 'Sign in'}
        </Button>
      </form>

      {/* Toggle */}
      <p className="mt-6 text-center text-sm text-slate-ui">
        {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
        <button
          type="button"
          onClick={() => { setMode(isSignUp ? 'signin' : 'signup'); setNotice(null) }}
          className="text-ink font-medium hover:underline underline-offset-2"
        >
          {isSignUp ? 'Sign in' : 'Sign up'}
        </button>
      </p>
    </div>
  )
}
