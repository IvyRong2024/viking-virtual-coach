import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface TokenUsage {
  timestamp: Date
  promptTokens: number
  completionTokens: number
  totalTokens: number
  cost: number
  scenario?: string
}

interface TokenState {
  totalTokensUsed: number
  totalCost: number
  sessionTokens: number
  sessionCost: number
  usageHistory: TokenUsage[]
  
  addUsage: (usage: Omit<TokenUsage, 'timestamp'>) => void
  resetSession: () => void
  getFormattedCost: (cost: number) => string
}

export const useTokenStore = create<TokenState>()(
  persist(
    (set, get) => ({
      totalTokensUsed: 0,
      totalCost: 0,
      sessionTokens: 0,
      sessionCost: 0,
      usageHistory: [],
      
      addUsage: (usage) => {
        const newUsage: TokenUsage = {
          ...usage,
          timestamp: new Date(),
        }
        
        set(state => ({
          totalTokensUsed: state.totalTokensUsed + usage.totalTokens,
          totalCost: state.totalCost + usage.cost,
          sessionTokens: state.sessionTokens + usage.totalTokens,
          sessionCost: state.sessionCost + usage.cost,
          usageHistory: [...state.usageHistory.slice(-99), newUsage], // Keep last 100
        }))
      },
      
      resetSession: () => {
        set({ sessionTokens: 0, sessionCost: 0 })
      },
      
      getFormattedCost: (cost: number) => {
        if (cost < 0.01) {
          return `$${(cost * 100).toFixed(4)}¢`
        }
        return `$${cost.toFixed(4)}`
      },
    }),
    {
      name: 'viking-tokens',
    }
  )
)

