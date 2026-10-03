import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { login } from '@/services/Authservice'
import { getUser, saveToken } from '@/utils/auth'
import { getErrorMessage } from '@/utils/errors'
import './login.css'

// Demo helpers so you can switch users quickly. Remove for a real app.
const DEMO_USERS = [
  { label: 'Admin (write)', email: 'admin@gemtrack.dev', password: 'Admin@123' },
  { label: 'Viewer (read)', email: 'viewer@gemtrack.dev', password: 'Viewer@123' },
  { label: 'Guest (none)', email: 'guest@gemtrack.dev', password: 'Guest@123' },
]

export function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // Already signed in: skip the login screen
  if (getUser()) return <Navigate to="/inventory/gems" replace />

  const handleSubmit = async () => {
    setError(null)
    setSubmitting(true)
    try {
      const token = await login({ email, password })
      saveToken(token)
      navigate('/inventory/gems', { replace: true })
    } catch (err) {
      setError(getErrorMessage(err, 'Login failed'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="login-page">
      <form
        className="login-card"
        onSubmit={(event) => {
          event.preventDefault()
          void handleSubmit()
        }}
      >
        <h1>GemTrack</h1>
        <p>Sign in to continue</p>

        <label className="login-field">
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="username"
            required
          />
        </label>

        <label className="login-field">
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            required
          />
        </label>

        {error && (
          <p className="login-error" role="alert">
            {error}
          </p>
        )}

        <button type="submit" disabled={submitting}>
          {submitting ? 'Signing in...' : 'Sign in'}
        </button>

        <div className="login-demo">
          <span>Demo users:</span>
          {DEMO_USERS.map((user) => (
            <button
              key={user.email}
              type="button"
              className="secondary"
              onClick={() => {
                setEmail(user.email)
                setPassword(user.password)
              }}
            >
              {user.label}
            </button>
          ))}
        </div>
      </form>
    </div>
  )
}