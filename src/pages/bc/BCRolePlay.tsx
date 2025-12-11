import { useEffect, useState, useRef } from 'react'
import { useRolePlayStore, Scenario, Persona } from '../../stores/rolePlayStore'
import { Send, Play, User, Clock, Award, ArrowLeft, Sparkles, Bot } from 'lucide-react'
import TokenUsageDisplay, { TokenNotification } from '../../components/TokenUsageDisplay'
import { useTokenStore } from '../../stores/tokenStore'
import clsx from 'clsx'

type ViewState = 'select' | 'chat' | 'result'

export default function BCRolePlay() {
  const { 
    scenarios, 
    personas, 
    currentSession, 
    sessions,
    isTyping,
    useRealAI,
    lastTokenUsage,
    apiStatus,
    apiError,
    loadData, 
    startSession, 
    sendMessage, 
    endSession,
    toggleRealAI
  } = useRolePlayStore()
  
  const { resetSession } = useTokenStore()
  
  const [viewState, setViewState] = useState<ViewState>('select')
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null)
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null)
  const [inputMessage, setInputMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    loadData()
  }, [loadData])
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [currentSession?.messages])
  
  const handleStartSession = () => {
    if (selectedScenario && selectedPersona) {
      resetSession() // Reset session token counter
      startSession(selectedScenario.id, selectedPersona.id)
      setViewState('chat')
    }
  }
  
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return
    
    await sendMessage(inputMessage)
    setInputMessage('')
  }
  
  const handleEndSession = () => {
    endSession()
    setViewState('result')
  }
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }
  
  const handleNewSession = () => {
    setSelectedScenario(null)
    setSelectedPersona(null)
    setViewState('select')
  }
  
  const lastSession = sessions[sessions.length - 1]
  
  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'easy': return 'badge-easy'
      case 'medium': return 'badge-medium'
      case 'hard': return 'badge-hard'
      default: return 'bg-gray-100 text-gray-800'
    }
  }
  
  // Selection View
  if (viewState === 'select') {
    return (
      <div className="space-y-6 animate-fadeIn">
        <div>
          <h1 className="text-2xl font-bold text-viking-navy">Virtual 1:1 Role Play</h1>
          <p className="text-gray-600">Practice conversations with AI-powered guest personas</p>
        </div>
        
        <div className="grid grid-cols-2 gap-6">
          {/* Scenario Selection */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-viking-navy mb-4">1. Choose a Scenario</h3>
            <div className="space-y-3 max-h-[400px] overflow-auto">
              {scenarios.map((scenario) => (
                <button
                  key={scenario.id}
                  onClick={() => setSelectedScenario(scenario)}
                  className={clsx(
                    'w-full text-left p-4 rounded-xl border-2 transition-all',
                    selectedScenario?.id === scenario.id
                      ? 'border-viking-blue bg-viking-blue/5'
                      : 'border-gray-200 hover:border-gray-300'
                  )}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className={clsx('badge', getDifficultyColor(scenario.difficulty))}>
                      {scenario.difficulty}
                    </span>
                    <span className="text-xs text-gray-500 capitalize">{scenario.category}</span>
                  </div>
                  <h4 className="font-semibold text-viking-navy">{scenario.title}</h4>
                  <p className="text-sm text-gray-500">{scenario.titleCn}</p>
                </button>
              ))}
            </div>
          </div>
          
          {/* Persona Selection */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-viking-navy mb-4">2. Choose a Guest Type</h3>
            <div className="space-y-3 max-h-[400px] overflow-auto">
              {personas.map((persona) => (
                <button
                  key={persona.id}
                  onClick={() => setSelectedPersona(persona)}
                  className={clsx(
                    'w-full text-left p-4 rounded-xl border-2 transition-all',
                    selectedPersona?.id === persona.id
                      ? 'border-viking-blue bg-viking-blue/5'
                      : 'border-gray-200 hover:border-gray-300'
                  )}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{persona.icon}</span>
                    <div>
                      <h4 className="font-semibold text-viking-navy">{persona.name}</h4>
                      <p className="text-sm text-gray-500">{persona.nameCn}</p>
                    </div>
                    <span className={clsx('badge ml-auto', getDifficultyColor(persona.difficulty))}>
                      {persona.difficulty}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{persona.description}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* AI Mode Toggle & Start Button */}
        <div className="flex flex-col items-center gap-4">
          {/* AI Mode Toggle */}
          <div className="flex items-center gap-4 bg-white rounded-xl px-6 py-3 shadow-sm">
            <div className="flex items-center gap-2">
              {useRealAI ? (
                <Sparkles className="w-5 h-5 text-viking-gold" />
              ) : (
                <Bot className="w-5 h-5 text-gray-400" />
              )}
              <span className="font-medium text-viking-navy">
                {useRealAI ? 'Real AI (GPT-4o-mini)' : 'Simulated AI'}
              </span>
            </div>
            <button
              onClick={toggleRealAI}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                useRealAI ? 'bg-viking-gold' : 'bg-gray-300'
              }`}
            >
              <span
                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  useRealAI ? 'left-7' : 'left-1'
                }`}
              />
            </button>
            {useRealAI && (
              <span className="text-xs text-gray-500">~$0.0001/message</span>
            )}
          </div>
          
          <button
            onClick={handleStartSession}
            disabled={!selectedScenario || !selectedPersona}
            className="btn btn-primary px-12 py-4 text-lg disabled:opacity-50"
          >
            <Play className="w-5 h-5 mr-2" />
            Start Role Play
          </button>
        </div>
        
        {/* Recent Sessions */}
        {sessions.length > 0 && (
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-viking-navy mb-4">Recent Sessions</h3>
            <div className="grid grid-cols-3 gap-4">
              {sessions.slice(-3).reverse().map((session) => {
                const scenario = scenarios.find(s => s.id === session.scenarioId)
                const persona = personas.find(p => p.id === session.personaId)
                
                return (
                  <div key={session.id} className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{persona?.icon}</span>
                      <span className="font-medium text-viking-navy">{scenario?.title}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {session.messages.length} messages
                      </span>
                      <span className={clsx('text-lg font-bold', {
                        'text-green-600': (session.score || 0) >= 80,
                        'text-viking-gold': (session.score || 0) >= 60 && (session.score || 0) < 80,
                        'text-red-500': (session.score || 0) < 60,
                      })}>
                        {session.score}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    )
  }
  
  // Chat View
  if (viewState === 'chat' && currentSession) {
    const persona = personas.find(p => p.id === currentSession.personaId)
    const scenario = scenarios.find(s => s.id === currentSession.scenarioId)
    
    return (
      <div className="h-[calc(100vh-8rem)] flex flex-col animate-fadeIn">
        {/* Header */}
        <div className="bg-white rounded-t-xl p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{persona?.icon}</span>
            <div>
              <h3 className="font-semibold text-viking-navy">{persona?.name}</h3>
              <p className="text-sm text-gray-500">{scenario?.title}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {useRealAI && (
              <div className={`flex items-center gap-2 text-xs px-3 py-1 rounded-full ${
                apiStatus === 'success' ? 'bg-green-100 text-green-700' :
                apiStatus === 'error' ? 'bg-red-100 text-red-700' :
                apiStatus === 'fallback' ? 'bg-yellow-100 text-yellow-700' :
                'bg-viking-gold/10 text-viking-gold'
              }`}>
                <Sparkles className="w-3 h-3" />
                <span>
                  {apiStatus === 'success' ? 'AI Connected ✓' :
                   apiStatus === 'error' ? 'AI Error ✗' :
                   apiStatus === 'fallback' ? 'Simulated' :
                   'Real AI'}
                </span>
              </div>
            )}
            {apiError && (
              <div className="text-xs text-red-500 max-w-[200px] truncate" title={apiError}>
                {apiError}
              </div>
            )}
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>{currentSession.messages.length} messages</span>
            </div>
            <button
              onClick={handleEndSession}
              className="btn btn-primary"
            >
              End Session
            </button>
          </div>
        </div>
        
        {/* Messages */}
        <div className="flex-1 bg-gray-50 p-6 overflow-auto">
          <div className="max-w-3xl mx-auto space-y-4">
            {/* Training Objectives */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
              <p className="text-sm font-medium text-blue-700 mb-2">Training Objectives:</p>
              <div className="flex flex-wrap gap-2">
                {scenario?.trainingObjectives.map((obj, i) => (
                  <span key={i} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                    {obj}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Messages */}
            {currentSession.messages.map((message, index) => (
              <div
                key={message.id}
                className={clsx('flex gap-3', {
                  'justify-end': message.role === 'agent',
                })}
              >
                {message.role === 'guest' && (
                  <div className="w-10 h-10 rounded-full bg-viking-gold flex items-center justify-center text-white flex-shrink-0">
                    {persona?.icon}
                  </div>
                )}
                <div className="flex flex-col">
                  <div
                    className={clsx('max-w-[70%] rounded-2xl p-4', {
                      'bg-white shadow-sm': message.role === 'guest',
                      'bg-viking-blue text-white': message.role === 'agent',
                    })}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                  {/* Show token usage for AI responses */}
                  {message.role === 'guest' && useRealAI && index === currentSession.messages.length - 1 && lastTokenUsage && (
                    <TokenNotification tokens={lastTokenUsage.tokens} cost={lastTokenUsage.cost} />
                  )}
                </div>
                {message.role === 'agent' && (
                  <div className="w-10 h-10 rounded-full bg-viking-navy flex items-center justify-center text-white flex-shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                )}
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-viking-gold flex items-center justify-center text-white">
                  {persona?.icon}
                </div>
                <div className="bg-white shadow-sm rounded-2xl p-4">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>
        
        {/* Input */}
        <div className="bg-white rounded-b-xl p-4 border-t">
          <div className="max-w-3xl mx-auto flex gap-3">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your response..."
              className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-viking-blue focus:border-transparent"
              disabled={isTyping}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className="btn btn-primary px-6 disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    )
  }
  
  // Result View
  if (viewState === 'result' && lastSession?.feedback) {
    const feedback = lastSession.feedback
    const scenario = scenarios.find(s => s.id === lastSession.scenarioId)
    const persona = personas.find(p => p.id === lastSession.personaId)
    
    return (
      <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
        {/* Header */}
        <div className="bg-gradient-viking rounded-2xl p-8 text-white text-center">
          <Award className="w-16 h-16 mx-auto mb-4 text-viking-gold" />
          <h2 className="text-2xl font-bold mb-2">Role Play Complete!</h2>
          <p className="text-white/80">
            {scenario?.title} with {persona?.name}
          </p>
          <p className="text-5xl font-bold mt-4">{feedback.totalScore}</p>
          <p className="text-white/60">out of 100</p>
        </div>
        
        {/* Score Breakdown */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-viking-navy mb-4">Score Breakdown</h3>
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(feedback.dimensions).map(([key, value]) => (
              <div key={key} className="text-center p-4 bg-gray-50 rounded-xl">
                <p className={clsx('text-2xl font-bold', {
                  'text-green-600': value >= 80,
                  'text-viking-gold': value >= 60 && value < 80,
                  'text-red-500': value < 60,
                })}>
                  {value}
                </p>
                <p className="text-sm text-gray-500 capitalize">{key}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Feedback */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-green-50 rounded-xl p-6">
            <h3 className="font-semibold text-green-700 mb-3">👍 Strengths</h3>
            <ul className="space-y-2">
              {feedback.strengths.map((s, i) => (
                <li key={i} className="text-sm text-green-700 flex items-start gap-2">
                  <span>•</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-orange-50 rounded-xl p-6">
            <h3 className="font-semibold text-orange-700 mb-3">🛠️ Areas to Improve</h3>
            <ul className="space-y-2">
              {feedback.improvements.map((s, i) => (
                <li key={i} className="text-sm text-orange-700 flex items-start gap-2">
                  <span>•</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Recommendations */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-viking-navy mb-4">📚 Recommended Training</h3>
          <div className="flex gap-3">
            {feedback.recommendations.map((rec, i) => (
              <span key={i} className="px-4 py-2 bg-viking-blue/10 text-viking-blue rounded-lg text-sm font-medium">
                {rec}
              </span>
            ))}
          </div>
        </div>
        
        {/* Token Usage Summary */}
        {useRealAI && (
          <TokenUsageDisplay showSession={true} />
        )}
        
        {/* Actions */}
        <div className="flex gap-4 justify-center">
          <button onClick={handleNewSession} className="btn btn-outline px-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            New Session
          </button>
          <button onClick={handleNewSession} className="btn btn-primary px-8">
            Try Again
          </button>
        </div>
      </div>
    )
  }
  
  return null
}

