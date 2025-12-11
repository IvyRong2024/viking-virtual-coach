import { create } from 'zustand'
import { useTokenStore } from './tokenStore'

export interface Persona {
  id: string
  name: string
  nameCn: string
  icon: string
  difficulty: 'easy' | 'medium' | 'hard'
  description: string
  sampleLines: string[]
}

export interface Scenario {
  id: string
  category: 'sales' | 'complaint' | 'service' | 'pre_departure' | 'onboard'
  title: string
  titleCn: string
  difficulty: 'easy' | 'medium' | 'hard'
  openingLine: string
  triggerEvents: string[]
  trainingObjectives: string[]
}

export interface Message {
  id: string
  role: 'guest' | 'agent'
  content: string
  timestamp: Date
  tokenUsage?: {
    tokens: number
    cost: number
  }
  feedback?: {
    score: number
    strengths: string[]
    improvements: string[]
  }
}

export interface RolePlaySession {
  id: string
  scenarioId: string
  personaId: string
  messages: Message[]
  startedAt: Date
  endedAt?: Date
  score?: number
  feedback?: {
    totalScore: number
    dimensions: Record<string, number>
    strengths: string[]
    improvements: string[]
    recommendations: string[]
  }
}

interface RolePlayState {
  personas: Persona[]
  scenarios: Scenario[]
  currentSession: RolePlaySession | null
  sessions: RolePlaySession[]
  isTyping: boolean
  useRealAI: boolean
  lastTokenUsage: { tokens: number; cost: number } | null
  
  loadData: () => void
  startSession: (scenarioId: string, personaId: string) => void
  sendMessage: (content: string) => Promise<void>
  endSession: () => void
  getAIResponse: (userMessage: string) => Promise<string>
  toggleRealAI: () => void
}

const samplePersonas: Persona[] = [
  {
    id: 'curious_explorer',
    name: 'Curious Explorer',
    nameCn: '好奇型',
    icon: '🔵',
    difficulty: 'easy',
    description: 'Friendly, inquisitive guest who enjoys learning about options',
    sampleLines: [
      "Oh, that's interesting! Tell me more about...",
      "I hadn't thought of that. What about...?",
      "That sounds lovely! And what's the food like?",
    ],
  },
  {
    id: 'value_seeker',
    name: 'Value-Seeker',
    nameCn: '性价比型',
    icon: '🟡',
    difficulty: 'medium',
    description: 'Price-conscious guest who compares options and challenges value claims',
    sampleLines: [
      "But competitor X offers this for half the price...",
      "What's the actual dollar value of those inclusions?",
      "That sounds like marketing talk to me.",
    ],
  },
  {
    id: 'anxious_planner',
    name: 'Anxious Planner',
    nameCn: '焦虑型',
    icon: '🟠',
    difficulty: 'medium',
    description: 'Worried guest who needs reassurance about details',
    sampleLines: [
      "But what if...?",
      "I'm just worried that...",
      "That makes me feel better, but what about...?",
    ],
  },
  {
    id: 'strict_impatient',
    name: 'Strict & Impatient',
    nameCn: '严肃急躁型',
    icon: '🔴',
    difficulty: 'hard',
    description: 'Direct, time-sensitive guest with low tolerance for delays',
    sampleLines: [
      "I don't need the history, just fix it.",
      "How long is this going to take?",
      "Get to the point.",
    ],
  },
  {
    id: 'dissatisfied_customer',
    name: 'Dissatisfied Customer',
    nameCn: '不满型',
    icon: '⚫',
    difficulty: 'hard',
    description: 'Emotionally charged guest expressing strong dissatisfaction',
    sampleLines: [
      "This is absolutely unacceptable!",
      "I can't believe this is happening!",
      "I want to speak to a manager!",
    ],
  },
]

const sampleScenarios: Scenario[] = [
  {
    id: 'S1_price_objection',
    category: 'sales',
    title: 'Why is Viking so expensive?',
    titleCn: '为什么这么贵？',
    difficulty: 'medium',
    openingLine: "I'm looking at your Mediterranean cruise. I found the same route on another cruise line for half the price. Why should I pay more for Viking?",
    triggerEvents: [
      "Your all-inclusive thing sounds like marketing speak.",
      "I just want to relax, I don't need cultural lectures.",
    ],
    trainingObjectives: ['Value presentation', 'Needs discovery', 'Objection handling'],
  },
  {
    id: 'S2_cabin_upgrade',
    category: 'sales',
    title: 'Convince me to upgrade',
    titleCn: '说服我升级',
    difficulty: 'medium',
    openingLine: "I'm looking at the basic Veranda cabin. What's the real difference if I upgrade? Is it worth the extra money?",
    triggerEvents: [
      "That sounds nice but I'm not sure I need it.",
      "What about for our anniversary trip specifically?",
    ],
    trainingObjectives: ['Upsell techniques', 'Feature-benefit translation'],
  },
  {
    id: 'C1_excursion_cancelled',
    category: 'complaint',
    title: 'Shore excursion cancelled!',
    titleCn: '岸上游取消了！',
    difficulty: 'hard',
    openingLine: "I specifically booked this cruise for the Santorini excursion. You're telling me it's cancelled because of weather? This is completely unacceptable!",
    triggerEvents: [
      "I don't want to hear about safety! I paid for this!",
      "I want a full refund for the entire cruise!",
    ],
    trainingObjectives: ['LEAP model application', 'De-escalation techniques', 'Solution presentation'],
  },
  {
    id: 'C2_wifi_complaint',
    category: 'complaint',
    title: 'Wi-Fi is terrible!',
    titleCn: 'Wi-Fi太慢了！',
    difficulty: 'medium',
    openingLine: "The Wi-Fi is absolutely useless! I can't even check my email. I paid thousands for this cruise and can't stay connected. Fix this NOW!",
    triggerEvents: [
      "Don't give me technical excuses!",
      "Other cruise lines have better Wi-Fi!",
    ],
    trainingObjectives: ['Managing expectations', 'Technical explanation', 'Offering alternatives'],
  },
  {
    id: 'V1_dietary_requirements',
    category: 'service',
    title: 'Dietary requirements',
    titleCn: '饮食需求',
    difficulty: 'easy',
    openingLine: "I have severe allergies - nuts and shellfish. I've had terrible experiences on other trips. Can Viking really accommodate me?",
    triggerEvents: [
      "How can I be sure the kitchen knows?",
      "What if there's cross-contamination?",
    ],
    trainingObjectives: ['Reassurance techniques', 'Process explanation'],
  },
]

// AI response simulation based on user input quality
const aiResponses: Record<string, { good: string[]; weak: string[]; confused: string[] }> = {
  curious_explorer: {
    good: [
      "That's really helpful! Can you tell me more about the shore excursions?",
      "Interesting! What about the dining options on board?",
      "I see! And how does the cultural program work?",
    ],
    weak: [
      "Hmm, I was hoping for more details. Can you explain that better?",
      "I'm not sure I understand. Could you be more specific?",
      "That doesn't really answer my question...",
    ],
    confused: [
      "I'm sorry, I don't quite follow. What do you mean?",
      "Could you clarify that for me?",
      "I'm a bit confused by your response.",
    ],
  },
  value_seeker: {
    good: [
      "Okay, that makes more sense now. What else is included?",
      "Hmm, that's a fair point. What else should I consider?",
      "I see the value now. Tell me more about the cabins.",
    ],
    weak: [
      "That's not very convincing. I need real numbers!",
      "Other cruise lines give me concrete comparisons. Can you?",
      "I'm still not seeing why I should pay more.",
    ],
    confused: [
      "What? That doesn't make sense. Are you new here?",
      "I asked about pricing and you're not answering my question.",
      "Can I speak to someone who knows the products better?",
    ],
  },
  anxious_planner: {
    good: [
      "Oh, that makes me feel better! What about...?",
      "Thank you for explaining that. I have another concern though...",
      "Okay, that's reassuring. And the safety measures?",
    ],
    weak: [
      "That doesn't really help my concerns...",
      "I'm still worried. Can you give me more details?",
      "I need more reassurance than that.",
    ],
    confused: [
      "I don't understand. Now I'm even more worried!",
      "That's confusing. Can you explain it more clearly?",
      "I'm not sure what you mean...",
    ],
  },
  strict_impatient: {
    good: [
      "Finally, a straight answer. What else?",
      "Okay, that works. Now what about the timeline?",
      "Good. Let's move on.",
    ],
    weak: [
      "That's not what I asked. Can you stay focused?",
      "I don't have time for vague answers!",
      "Get to the point! What's the actual solution?",
    ],
    confused: [
      "What are you even talking about?",
      "Is this your first day? I need someone competent!",
      "This is a waste of my time!",
    ],
  },
  dissatisfied_customer: {
    good: [
      "Well... I suppose that's something. But I'm still not happy.",
      "Okay, that helps a little. What else can you do?",
      "Fine. At least you're trying to help.",
    ],
    weak: [
      "That's not good enough! I expected better from Viking!",
      "Are you even listening to me? I want a REAL solution!",
      "This is ridiculous! I'm posting about this online!",
    ],
    confused: [
      "What?! That makes no sense! Let me speak to your manager!",
      "I can't believe this is your response!",
      "You clearly don't understand my problem at all!",
    ],
  },
}

// Analyze user message quality
const analyzeResponse = (message: string): 'good' | 'weak' | 'confused' => {
  const lowMsg = message.toLowerCase().trim()
  
  // Confused/bad responses
  if (lowMsg.length < 10 || 
      lowMsg.includes("don't know") || 
      lowMsg.includes("dont know") ||
      lowMsg.includes("不知道") ||
      lowMsg === "so?" ||
      lowMsg === "ok" ||
      lowMsg === "okay" ||
      lowMsg === "um" ||
      lowMsg === "uh" ||
      lowMsg === "..." ||
      lowMsg === "?" ||
      /^(what|huh|eh|idk|no idea)/i.test(lowMsg)) {
    return 'confused'
  }
  
  // Weak responses (short, no substance)
  if (lowMsg.length < 30 && 
      !lowMsg.includes("sorry") && 
      !lowMsg.includes("understand") &&
      !lowMsg.includes("help")) {
    return 'weak'
  }
  
  // Good responses (has empathy, substance, or solutions)
  if (lowMsg.includes("understand") ||
      lowMsg.includes("sorry") ||
      lowMsg.includes("help") ||
      lowMsg.includes("offer") ||
      lowMsg.includes("include") ||
      lowMsg.includes("value") ||
      lowMsg.includes("option") ||
      lowMsg.includes("let me") ||
      lowMsg.length > 50) {
    return 'good'
  }
  
  return 'weak'
}

export const useRolePlayStore = create<RolePlayState>((set, get) => ({
  personas: [],
  scenarios: [],
  currentSession: null,
  sessions: [],
  isTyping: false,
  useRealAI: true, // Default to real AI
  lastTokenUsage: null,
  
  toggleRealAI: () => {
    set(state => ({ useRealAI: !state.useRealAI }))
  },
  
  loadData: () => {
    set({ personas: samplePersonas, scenarios: sampleScenarios })
  },
  
  startSession: (scenarioId: string, personaId: string) => {
    const { scenarios } = get()
    const scenario = scenarios.find(s => s.id === scenarioId)
    
    if (!scenario) return
    
    const session: RolePlaySession = {
      id: `session_${Date.now()}`,
      scenarioId,
      personaId,
      messages: [
        {
          id: `msg_${Date.now()}`,
          role: 'guest',
          content: scenario.openingLine,
          timestamp: new Date(),
        },
      ],
      startedAt: new Date(),
    }
    
    set({ currentSession: session })
  },
  
  sendMessage: async (content: string) => {
    const { currentSession, getAIResponse } = get()
    if (!currentSession) return
    
    // Add user message
    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      role: 'agent',
      content,
      timestamp: new Date(),
    }
    
    set({
      currentSession: {
        ...currentSession,
        messages: [...currentSession.messages, userMessage],
      },
      isTyping: true,
    })
    
    // Get AI response
    const aiResponse = await getAIResponse(content)
    
    const guestMessage: Message = {
      id: `msg_${Date.now() + 1}`,
      role: 'guest',
      content: aiResponse,
      timestamp: new Date(),
    }
    
    set(state => ({
      currentSession: state.currentSession ? {
        ...state.currentSession,
        messages: [...state.currentSession.messages, guestMessage],
      } : null,
      isTyping: false,
    }))
  },
  
  getAIResponse: async (userMessage: string): Promise<string> => {
    const { currentSession, scenarios, useRealAI } = get()
    if (!currentSession) return "..."
    
    const scenario = scenarios.find(s => s.id === currentSession.scenarioId)
    
    // Try real AI first if enabled
    if (useRealAI) {
      try {
        // Build conversation history for context
        const conversationHistory = currentSession.messages.map(msg => ({
          role: msg.role === 'guest' ? 'assistant' : 'user' as const,
          content: msg.content,
        }))
        
        // Add the new user message
        conversationHistory.push({ role: 'user' as const, content: userMessage })
        
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: conversationHistory,
            persona: currentSession.personaId,
            scenario: scenario?.title || 'General customer service',
          }),
        })
        
        if (response.ok) {
          const data = await response.json()
          
          // Track token usage
          if (data.usage) {
            const tokenUsage = {
              tokens: data.usage.total_tokens,
              cost: data.usage.estimated_cost,
            }
            set({ lastTokenUsage: tokenUsage })
            
            // Add to global token tracking
            useTokenStore.getState().addUsage({
              promptTokens: data.usage.prompt_tokens,
              completionTokens: data.usage.completion_tokens,
              totalTokens: data.usage.total_tokens,
              cost: data.usage.estimated_cost,
              scenario: scenario?.title,
            })
          }
          
          return data.content
        }
        
        // If API fails, fall back to simulation
        console.warn('API failed, falling back to simulation')
      } catch (error) {
        console.warn('API error, falling back to simulation:', error)
      }
    }
    
    // Fallback: Simulated response
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000))
    
    // Analyze user response quality
    const quality = analyzeResponse(userMessage)
    
    // Get persona-specific responses based on quality
    const personaId = currentSession.personaId as keyof typeof aiResponses
    const personaResponses = aiResponses[personaId] || aiResponses.curious_explorer
    const responses = personaResponses[quality]
    
    // Check for trigger events on weak/confused responses
    if (scenario && quality !== 'good' && currentSession.messages.length < 8) {
      const triggerChance = Math.random()
      if (triggerChance > 0.4 && scenario.triggerEvents.length > 0) {
        const triggerIndex = Math.floor(Math.random() * scenario.triggerEvents.length)
        return scenario.triggerEvents[triggerIndex]
      }
    }
    
    // Return appropriate response based on quality
    const responseIndex = Math.floor(Math.random() * responses.length)
    return responses[responseIndex]
  },
  
  endSession: () => {
    const { currentSession, sessions } = get()
    if (!currentSession) return
    
    // Generate feedback
    const feedback = {
      totalScore: Math.floor(Math.random() * 30) + 70,
      dimensions: {
        empathy: Math.floor(Math.random() * 20) + 75,
        clarity: Math.floor(Math.random() * 20) + 70,
        accuracy: Math.floor(Math.random() * 15) + 80,
        solution: Math.floor(Math.random() * 25) + 65,
        deescalation: Math.floor(Math.random() * 20) + 70,
        brand: Math.floor(Math.random() * 15) + 80,
      },
      strengths: [
        'Good use of empathy phrases',
        'Clear communication structure',
        'Appropriate solution offered',
      ],
      improvements: [
        'Could explore customer needs more deeply',
        'Consider offering multiple alternatives',
      ],
      recommendations: [
        'Value Framing Module',
        'LEAP Model Practice',
      ],
    }
    
    const completedSession: RolePlaySession = {
      ...currentSession,
      endedAt: new Date(),
      score: feedback.totalScore,
      feedback,
    }
    
    set({
      currentSession: null,
      sessions: [...sessions, completedSession],
    })
  },
}))

