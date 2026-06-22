import { useAuth } from './useAuth'
import { Auth } from './Auth'
import { Dashboard } from './Dashboard'
// Remove the 'src/' from the path if the file is in the same folder
import ProtectedAdminRoute from './ProtectedAdminRoute'

export default function App() {
  const { session, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <span className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return session ? (
    <ProtectedAdminRoute>
      <Dashboard />
    </ProtectedAdminRoute>
  ) : (
    <Auth />
  )
}