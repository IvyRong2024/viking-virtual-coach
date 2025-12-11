import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { Ship, User, Lock, AlertCircle } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const navigate = useNavigate()
  const login = useAuthStore(state => state.login)
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    
    try {
      const success = await login(email, password)
      if (success) {
        navigate(email.includes('mentor') ? '/mentor' : '/bc')
      } else {
        setError('Invalid email or password')
      }
    } catch {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleDemoLogin = async (role: 'mentor' | 'bc') => {
    const demoEmail = role === 'mentor' ? 'mentor@viking.com' : 'agent@viking.com'
    setEmail(demoEmail)
    setPassword('demo123')
    setIsLoading(true)
    
    const success = await login(demoEmail, 'demo123')
    if (success) {
      navigate(role === 'mentor' ? '/mentor' : '/bc')
    }
    setIsLoading(false)
  }
  
  return (
    <div className="min-h-screen bg-gradient-viking flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-12 text-white">
        <div className="max-w-md text-center">
          <Ship className="w-20 h-20 mx-auto mb-8 opacity-90" />
          <h1 className="text-4xl font-display font-bold mb-4">
            Viking Virtual Coach
          </h1>
          <p className="text-xl text-white/80 mb-8">
            AI-Powered Training Platform for Excellence in Guest Service
          </p>
          <div className="grid grid-cols-2 gap-4 text-sm text-white/70">
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-2xl font-bold text-white mb-1">500+</div>
              <div>Training Scenarios</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-2xl font-bold text-white mb-1">AI</div>
              <div>Powered Coaching</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-2xl font-bold text-white mb-1">6</div>
              <div>Skill Dimensions</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-2xl font-bold text-white mb-1">24/7</div>
              <div>Learning Access</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white lg:rounded-l-3xl">
        <div className="w-full max-w-md">
          <div className="lg:hidden text-center mb-8">
            <Ship className="w-12 h-12 mx-auto mb-4 text-viking-red" />
            <h1 className="text-2xl font-display font-bold text-viking-navy">
              Viking Virtual Coach
            </h1>
          </div>
          
          <h2 className="text-2xl font-bold text-viking-navy mb-2">
            Welcome back
          </h2>
          <p className="text-gray-600 mb-8">
            Sign in to continue your training journey
          </p>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-viking-red focus:border-transparent transition-all"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-viking-red focus:border-transparent transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn btn-primary py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
          
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">Demo Access</span>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-2 gap-4">
              <button
                onClick={() => handleDemoLogin('mentor')}
                disabled={isLoading}
                className="btn btn-outline py-3 text-sm"
              >
                Login as Mentor
              </button>
              <button
                onClick={() => handleDemoLogin('bc')}
                disabled={isLoading}
                className="btn btn-outline py-3 text-sm"
              >
                Login as Agent
              </button>
            </div>
          </div>
          
          <p className="mt-8 text-center text-sm text-gray-500">
            Demo credentials: mentor@viking.com / demo123
          </p>
        </div>
      </div>
    </div>
  )
}

