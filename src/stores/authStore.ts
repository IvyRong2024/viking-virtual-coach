import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  id: string
  name: string
  email: string
  role: 'mentor' | 'bc'
  avatar?: string
  team?: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
}

// Demo users for testing
const demoUsers: Record<string, User & { password: string }> = {
  'mentor@viking.com': {
    id: '1',
    name: 'Sarah Chen',
    email: 'mentor@viking.com',
    role: 'mentor',
    password: 'demo123',
    team: 'Training Team',
  },
  'agent@viking.com': {
    id: '2',
    name: 'Michael Wang',
    email: 'agent@viking.com',
    role: 'bc',
    password: 'demo123',
    team: 'Sales Team A',
  },
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      
      login: async (email: string, password: string) => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500))
        
        const demoUser = demoUsers[email]
        if (demoUser && demoUser.password === password) {
          const { password: _, ...user } = demoUser
          set({ user, isAuthenticated: true })
          return true
        }
        return false
      },
      
      logout: () => {
        set({ user: null, isAuthenticated: false })
      },
    }),
    {
      name: 'viking-auth',
    }
  )
)

