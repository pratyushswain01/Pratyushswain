/**
 * App.jsx
 * Now includes the ProtectedAdminRoute layer.
 */
import { useAuth } from './useAuth'
import { Auth } from './Auth'          // <--- Add { } here
import { Dashboard } from './Dashboard' // <--- Add { } here
import { ProtectedAdminRoute } from './ProtectedAdminRoute' // <--- Add { } here

export default function App() {
  const { session, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <span className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // 1. If no session, go to Auth
  // 2. If session exists, pass through ProtectedAdminRoute to reach Dashboard
  return session ? (
    <ProtectedAdminRoute>
      <Dashboard />
    </ProtectedAdminRoute>
  ) : (
    <Auth />
  )
}