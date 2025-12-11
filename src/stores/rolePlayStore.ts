import { create } from 'zustand'

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
  
  loadData: () => void
  startSession: (scenarioId: string, personaId: string) => void
  sendMessage: (content: string) => Promise<void>
  endSession: () => void
  getAIResponse: (userMessage: string) => Promise<string>
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

// AI response simulation
const aiResponses: Record<string, string[]> = {
  curious_explorer: [
    "That's really helpful! Can you tell me more about the shore excursions?",
    "Interesting! What about the dining options on board?",
    "I see! And how does the cultural program work?",
  ],
  value_seeker: [
    "Okay, but break it down for me. What's the actual dollar value?",
    "I'm still not convinced. Other cruise lines include similar things.",
    "Hmm, that's a fair point. What else should I consider?",
  ],
  dissatisfied_customer: [
    "That's not good enough! I expected better from Viking!",
    "Well... I suppose that's something. But I'm still not happy.",
    "Fine. But this better not happen again.",
  ],
}

export const useRolePlayStore = create<RolePlayState>((set, get) => ({
  personas: [],
  scenarios: [],
  currentSession: null,
  sessions: [],
  isTyping: false,
  
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
    const { currentSession, personas, scenarios } = get()
    if (!currentSession) return "..."
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000))
    
    const persona = personas.find(p => p.id === currentSession.personaId)
    const scenario = scenarios.find(s => s.id === currentSession.scenarioId)
    
    // Check for trigger events
    if (scenario && currentSession.messages.length < 6) {
      const triggerChance = Math.random()
      if (triggerChance > 0.5 && scenario.triggerEvents.length > 0) {
        const triggerIndex = Math.floor(Math.random() * scenario.triggerEvents.length)
        return scenario.triggerEvents[triggerIndex]
      }
    }
    
    // Use persona-specific responses
    const personaResponses = aiResponses[currentSession.personaId] || aiResponses.curious_explorer
    const responseIndex = Math.floor(Math.random() * personaResponses.length)
    
    // Add some intelligence based on user message
    if (userMessage.toLowerCase().includes('sorry') || userMessage.toLowerCase().includes('understand')) {
      if (persona?.difficulty === 'hard') {
        return "Well... I appreciate that. But what are you going to do about it?"
      }
      return "Thank you for understanding. That helps."
    }
    
    return personaResponses[responseIndex]
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

