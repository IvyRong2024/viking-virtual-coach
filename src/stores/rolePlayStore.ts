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
  apiStatus: 'idle' | 'success' | 'error' | 'fallback'
  apiError: string | null
  
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

// Detailed message scoring system
interface MessageScore {
  empathy: number
  clarity: number
  accuracy: number
  solution: number
  professionalism: number
  penalties: string[]
}

const scoreMessage = (message: string): MessageScore => {
  const lowMsg = message.toLowerCase().trim()
  const score: MessageScore = {
    empathy: 0,
    clarity: 0,
    accuracy: 0,
    solution: 0,
    professionalism: 0,
    penalties: [],
  }
  
  // === CRITICAL PENALTIES (Immediate low scores) ===
  
  // Extremely short or nonsense responses
  if (lowMsg.length < 5) {
    score.penalties.push('Response too short (< 5 chars)')
    return { empathy: 5, clarity: 5, accuracy: 5, solution: 5, professionalism: 5, penalties: score.penalties }
  }
  
  // Rude or inappropriate
  const rudePatterns = /\b(shut up|stupid|dumb|idiot|whatever|don'?t care|不管|随便|关你|滚|傻|蠢)\b/i
  if (rudePatterns.test(lowMsg)) {
    score.penalties.push('Rude or inappropriate language')
    return { empathy: 0, clarity: 10, accuracy: 10, solution: 0, professionalism: 0, penalties: score.penalties }
  }
  
  // Dismissive responses
  const dismissivePatterns = /^(ok|okay|fine|sure|whatever|idk|no|yes|nope|yep|k|好|行|嗯|哦|呵呵|。|\.{1,3}|\?+|!+)$/i
  if (dismissivePatterns.test(lowMsg)) {
    score.penalties.push('Dismissive one-word response')
    return { empathy: 10, clarity: 15, accuracy: 10, solution: 5, professionalism: 15, penalties: score.penalties }
  }
  
  // "I don't know" type responses
  if (/\b(don'?t know|no idea|idk|不知道|没办法|不清楚)\b/i.test(lowMsg)) {
    score.penalties.push('Expressed inability to help')
    score.solution = 10
    score.accuracy = 15
  }
  
  // Irrelevant/off-topic (gibberish detection)
  const words = lowMsg.split(/\s+/)
  const avgWordLength = words.reduce((sum, w) => sum + w.length, 0) / words.length
  if (avgWordLength > 15 || /(.)\1{4,}/.test(lowMsg)) {
    score.penalties.push('Gibberish or spam detected')
    return { empathy: 5, clarity: 5, accuracy: 5, solution: 5, professionalism: 5, penalties: score.penalties }
  }
  
  // === POSITIVE SCORING ===
  
  // EMPATHY (0-100)
  const empathyPhrases = [
    'understand', 'sorry', 'apologize', 'appreciate', 'frustrating', 
    'hear you', 'feel', 'concern', 'important to you', 'I can see',
    '理解', '抱歉', '感谢', '体谅'
  ]
  const empathyCount = empathyPhrases.filter(p => lowMsg.includes(p)).length
  score.empathy = Math.min(100, empathyCount * 25 + (lowMsg.length > 50 ? 15 : 0))
  
  // CLARITY (0-100) - Based on structure and length
  if (lowMsg.length >= 100) score.clarity += 40
  else if (lowMsg.length >= 50) score.clarity += 25
  else if (lowMsg.length >= 20) score.clarity += 15
  else score.clarity += 5
  
  // Has structure (multiple sentences)
  const sentences = message.split(/[.!?。！？]/).filter(s => s.trim().length > 0)
  score.clarity += Math.min(30, sentences.length * 10)
  
  // Uses proper punctuation
  if (/[.!?。！？]/.test(message)) score.clarity += 15
  
  // Uses connecting words
  if (/\b(first|second|also|additionally|because|therefore|however|首先|其次|另外|因为|所以)\b/i.test(lowMsg)) {
    score.clarity += 15
  }
  
  // ACCURACY (0-100) - Viking-specific knowledge
  const vikingTerms = [
    'viking', 'cruise', 'ship', 'cabin', 'excursion', 'inclusive', 'included',
    'veranda', 'explorer', 'suite', 'dining', 'restaurant', 'destination',
    'itinerary', 'port', 'shore', 'onboard', 'stateroom', 'enrichment',
    '维京', '邮轮', '舱房', '岸上游', '包含', '目的地'
  ]
  const accuracyCount = vikingTerms.filter(t => lowMsg.includes(t)).length
  score.accuracy = Math.min(100, accuracyCount * 15 + 20)
  
  // SOLUTION (0-100) - Problem-solving orientation
  const solutionPhrases = [
    'let me', 'I can', 'we can', 'offer', 'option', 'alternative', 'help you',
    'arrange', 'provide', 'recommend', 'suggest', 'would you like', 'available',
    'upgrade', 'compensation', 'refund', 'credit', 'complimentary',
    '我可以', '我们可以', '帮您', '提供', '建议', '推荐', '选择', '方案'
  ]
  const solutionCount = solutionPhrases.filter(p => lowMsg.includes(p)).length
  score.solution = Math.min(100, solutionCount * 20 + (lowMsg.includes('?') ? 10 : 0))
  
  // PROFESSIONALISM (0-100)
  score.professionalism = 50 // Base score
  
  // Polite language bonus
  if (/\b(please|thank|welcome|pleasure|happy to|glad to|请|谢谢|欢迎|很高兴)\b/i.test(lowMsg)) {
    score.professionalism += 25
  }
  
  // Proper greeting/closing
  if (/\b(hello|hi|good morning|good afternoon|dear|best regards|您好|你好)\b/i.test(lowMsg)) {
    score.professionalism += 15
  }
  
  // Uses customer's perspective
  if (/\b(you|your|you're|您|你的)\b/i.test(lowMsg)) {
    score.professionalism += 10
  }
  
  // === LENGTH PENALTIES ===
  if (lowMsg.length < 20) {
    score.penalties.push('Response too brief')
    score.empathy = Math.min(score.empathy, 30)
    score.solution = Math.min(score.solution, 25)
    score.clarity = Math.min(score.clarity, 35)
  }
  
  return score
}

// Analyze user message quality for AI response selection
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

// Calculate final session score
const calculateSessionScore = (messages: Message[]): {
  totalScore: number
  dimensions: Record<string, number>
  strengths: string[]
  improvements: string[]
  recommendations: string[]
} => {
  // Get only agent messages
  const agentMessages = messages.filter(m => m.role === 'agent')
  
  if (agentMessages.length === 0) {
    return {
      totalScore: 0,
      dimensions: { empathy: 0, clarity: 0, accuracy: 0, solution: 0, deescalation: 0, brand: 0 },
      strengths: [],
      improvements: ['No responses were provided'],
      recommendations: ['Complete the role play exercise'],
    }
  }
  
  // Score each message
  const allScores = agentMessages.map(m => scoreMessage(m.content))
  const allPenalties = allScores.flatMap(s => s.penalties)
  
  // Calculate averages for each dimension
  const avgScore = (dimension: keyof Omit<MessageScore, 'penalties'>) => {
    const sum = allScores.reduce((acc, s) => acc + s[dimension], 0)
    return Math.round(sum / allScores.length)
  }
  
  const dimensions = {
    empathy: avgScore('empathy'),
    clarity: avgScore('clarity'),
    accuracy: avgScore('accuracy'),
    solution: avgScore('solution'),
    deescalation: Math.round((avgScore('empathy') + avgScore('professionalism')) / 2),
    brand: avgScore('professionalism'),
  }
  
  // Calculate total score (weighted average)
  const weights = { empathy: 0.2, clarity: 0.15, accuracy: 0.2, solution: 0.25, deescalation: 0.1, brand: 0.1 }
  let totalScore = Object.entries(dimensions).reduce((sum, [key, value]) => {
    return sum + value * (weights[key as keyof typeof weights] || 0.1)
  }, 0)
  
  // Apply global penalties
  if (allPenalties.length > 0) {
    const uniquePenalties = [...new Set(allPenalties)]
    totalScore = Math.max(0, totalScore - uniquePenalties.length * 10)
  }
  
  // Penalty for too few messages (didn't engage enough)
  if (agentMessages.length < 3) {
    totalScore = Math.min(totalScore, 50)
  }
  
  totalScore = Math.round(Math.max(0, Math.min(100, totalScore)))
  
  // Generate strengths
  const strengths: string[] = []
  if (dimensions.empathy >= 70) strengths.push('Good use of empathy and understanding')
  if (dimensions.clarity >= 70) strengths.push('Clear and well-structured responses')
  if (dimensions.accuracy >= 70) strengths.push('Accurate product knowledge demonstrated')
  if (dimensions.solution >= 70) strengths.push('Proactive problem-solving approach')
  if (dimensions.brand >= 70) strengths.push('Professional and brand-aligned communication')
  if (strengths.length === 0) strengths.push('Completed the role play exercise')
  
  // Generate improvements
  const improvements: string[] = []
  if (dimensions.empathy < 50) improvements.push('Use more empathy phrases (e.g., "I understand", "I apologize")')
  if (dimensions.clarity < 50) improvements.push('Provide longer, more detailed responses')
  if (dimensions.accuracy < 50) improvements.push('Include more Viking-specific information')
  if (dimensions.solution < 50) improvements.push('Offer concrete solutions and alternatives')
  if (dimensions.brand < 50) improvements.push('Use more professional and polite language')
  if (allPenalties.includes('Response too brief')) improvements.push('Avoid one-word or very short answers')
  if (allPenalties.includes('Dismissive one-word response')) improvements.push('Engage meaningfully with customer concerns')
  if (improvements.length === 0) improvements.push('Continue practicing to maintain consistency')
  
  // Generate recommendations
  const recommendations: string[] = []
  if (dimensions.empathy < 60) recommendations.push('LEAP Model Training')
  if (dimensions.accuracy < 60) recommendations.push('Viking Product Knowledge Course')
  if (dimensions.solution < 60) recommendations.push('Problem Resolution Workshop')
  if (dimensions.brand < 60) recommendations.push('Brand Voice Guidelines Review')
  if (recommendations.length === 0) recommendations.push('Advanced Customer Engagement')
  
  return { totalScore, dimensions, strengths, improvements, recommendations }
}

export const useRolePlayStore = create<RolePlayState>((set, get) => ({
  personas: [],
  scenarios: [],
  currentSession: null,
  sessions: [],
  isTyping: false,
  useRealAI: true, // Default to real AI
  lastTokenUsage: null,
  apiStatus: 'idle',
  apiError: null,
  
  toggleRealAI: () => {
    set(state => ({ useRealAI: !state.useRealAI, apiStatus: 'idle', apiError: null }))
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
        
        console.log('[AI] Calling API with', conversationHistory.length, 'messages')
        
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
          console.log('[AI] API response:', data)
          
          // Check if there's an error in the response
          if (data.error) {
            console.error('[AI] API returned error:', data.error)
            set({ apiStatus: 'error', apiError: data.error })
            // Fall through to simulation
          } else {
            // Track token usage
            if (data.usage) {
              const tokenUsage = {
                tokens: data.usage.total_tokens,
                cost: data.usage.estimated_cost,
              }
              set({ lastTokenUsage: tokenUsage, apiStatus: 'success', apiError: null })
              
              // Add to global token tracking
              useTokenStore.getState().addUsage({
                promptTokens: data.usage.prompt_tokens,
                completionTokens: data.usage.completion_tokens,
                totalTokens: data.usage.total_tokens,
                cost: data.usage.estimated_cost,
                scenario: scenario?.title,
              })
              
              console.log('[AI] Tokens used:', data.usage.total_tokens, 'Cost:', data.usage.estimated_cost)
            }
            
            return data.content
          }
        } else {
          const errorText = await response.text()
          console.error('[AI] API HTTP error:', response.status, errorText)
          set({ apiStatus: 'error', apiError: `HTTP ${response.status}: ${errorText}` })
        }
        
        // If API fails, fall back to simulation
        console.warn('[AI] Falling back to simulation mode')
        set({ apiStatus: 'fallback' })
      } catch (error) {
        console.error('[AI] API exception:', error)
        set({ apiStatus: 'error', apiError: String(error) })
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
    
    // Calculate real score based on message content analysis
    const feedback = calculateSessionScore(currentSession.messages)
    
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

