import { useRouteError, Link } from 'react-router-dom'
import { Home, RefreshCcw } from 'lucide-react'

export default function ErrorPage() {
  const error: any = useRouteError()
  console.error(error)

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="text-center text-white">
        <h1 className="text-4xl font-bold text-yellow-400 mb-4">Oops!</h1>
        <p className="text-gray-300 mb-4">Sorry, an unexpected error has occurred.</p>
        <p className="text-gray-400">
          <i>{error.statusText || error.message}</i>
        </p>
      </div>
    </div>
  )
}