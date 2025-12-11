import { useTokenStore } from '../stores/tokenStore'
import { Coins, AlertTriangle, TrendingUp } from 'lucide-react'

interface TokenUsageDisplayProps {
  showSession?: boolean
  compact?: boolean
}

export default function TokenUsageDisplay({ showSession = true, compact = false }: TokenUsageDisplayProps) {
  const { totalTokensUsed, totalCost, sessionTokens, sessionCost, getFormattedCost } = useTokenStore()
  
  if (compact) {
    return (
      <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
        <Coins className="w-3 h-3" />
        <span>{sessionTokens} tokens</span>
        <span className="text-viking-gold font-medium">{getFormattedCost(sessionCost)}</span>
      </div>
    )
  }
  
  return (
    <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
      <div className="flex items-center gap-2 mb-3">
        <Coins className="w-5 h-5 text-viking-gold" />
        <h4 className="font-semibold text-viking-navy">AI Token Usage</h4>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {showSession && (
          <div className="bg-white rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-1">This Session</p>
            <p className="text-lg font-bold text-viking-navy">{sessionTokens.toLocaleString()}</p>
            <p className="text-sm text-viking-gold font-medium">{getFormattedCost(sessionCost)}</p>
          </div>
        )}
        
        <div className="bg-white rounded-lg p-3">
          <p className="text-xs text-gray-500 mb-1">All Time</p>
          <p className="text-lg font-bold text-viking-navy">{totalTokensUsed.toLocaleString()}</p>
          <p className="text-sm text-viking-gold font-medium">{getFormattedCost(totalCost)}</p>
        </div>
      </div>
      
      {sessionCost > 0.01 && (
        <div className="mt-3 flex items-center gap-2 text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded-lg">
          <AlertTriangle className="w-4 h-4" />
          <span>This session has used {getFormattedCost(sessionCost)} in API costs</span>
        </div>
      )}
      
      <div className="mt-3 text-xs text-gray-400">
        <p>Using gpt-4o-mini: $0.15/1M input, $0.60/1M output</p>
      </div>
    </div>
  )
}

// Inline token notification component
export function TokenNotification({ tokens, cost }: { tokens: number; cost: number }) {
  const { getFormattedCost } = useTokenStore()
  
  return (
    <div className="inline-flex items-center gap-1.5 text-xs text-gray-400 mt-1">
      <TrendingUp className="w-3 h-3" />
      <span>{tokens} tokens</span>
      <span className="text-viking-gold">({getFormattedCost(cost)})</span>
    </div>
  )
}

