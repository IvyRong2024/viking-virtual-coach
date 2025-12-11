import { create } from 'zustand'

export interface QuizQuestion {
  id: string
  type: 'single_choice' | 'true_false' | 'scenario' | 'open_ended'
  difficulty: 'L1' | 'L2' | 'L3' | 'L4'
  category: string
  tags: string[]
  question: string
  options?: { key: string; text: string; is_correct: boolean }[]
  correct_answer?: boolean
  explanation: string
  expected_elements?: string[]
}

export interface QuizAttempt {
  id: string
  quizId: string
  userId: string
  answer: string
  isCorrect: boolean
  timeSpent: number
  aiFeedback?: string
  score?: number
  createdAt: Date
}

interface QuizState {
  questions: QuizQuestion[]
  currentQuiz: QuizQuestion[]
  currentIndex: number
  attempts: QuizAttempt[]
  isLoading: boolean
  
  loadQuestions: () => void
  startQuiz: (category?: string, count?: number) => void
  submitAnswer: (answer: string) => QuizAttempt
  nextQuestion: () => void
  resetQuiz: () => void
}

// Sample quiz data
const sampleQuestions: QuizQuestion[] = [
  {
    id: 'Q001',
    type: 'single_choice',
    difficulty: 'L1',
    category: 'product_knowledge',
    tags: ['stateroom', 'cabin', 'veranda'],
    question: 'What is the common feature of ALL Viking staterooms?',
    options: [
      { key: 'A', text: 'Interior cabin', is_correct: false },
      { key: 'B', text: 'Ocean view window', is_correct: false },
      { key: 'C', text: 'Private balcony (veranda)', is_correct: true },
      { key: 'D', text: 'Suite-level amenities', is_correct: false },
    ],
    explanation: 'Every stateroom on Viking ocean ships features a private veranda (balcony), from the entry-level Veranda category to the Owner\'s Suite.',
  },
  {
    id: 'Q002',
    type: 'single_choice',
    difficulty: 'L1',
    category: 'product_knowledge',
    tags: ['pricing', 'value', 'all-inclusive'],
    question: 'What is ONE core reason Viking\'s pricing is higher than some competitors?',
    options: [
      { key: 'A', text: 'More entertainment facilities', is_correct: false },
      { key: 'B', text: 'Kids\' activity areas', is_correct: false },
      { key: 'C', text: 'Comprehensive all-inclusive value', is_correct: true },
      { key: 'D', text: 'Larger ship size', is_correct: false },
    ],
    explanation: 'Viking\'s pricing includes Wi-Fi, shore excursions, specialty dining, and more—items that often cost extra on other cruise lines.',
  },
  {
    id: 'Q003',
    type: 'single_choice',
    difficulty: 'L1',
    category: 'product_knowledge',
    tags: ['wifi', 'amenities'],
    question: 'What is the Wi-Fi policy on Viking ships?',
    options: [
      { key: 'A', text: 'Must purchase separately', is_correct: false },
      { key: 'B', text: 'Included for all guests', is_correct: true },
      { key: 'C', text: 'Only available in premium packages', is_correct: false },
      { key: 'D', text: 'Only for suite guests', is_correct: false },
    ],
    explanation: 'Complimentary Wi-Fi is included for all guests on Viking ocean ships.',
  },
  {
    id: 'Q004',
    type: 'true_false',
    difficulty: 'L1',
    category: 'product_knowledge',
    tags: ['policy', 'children'],
    question: 'Viking allows children of all ages on ocean voyages.',
    correct_answer: false,
    explanation: 'Viking Ocean Cruises maintains an adults-only (18+) policy to ensure a peaceful, sophisticated atmosphere.',
  },
  {
    id: 'Q005',
    type: 'true_false',
    difficulty: 'L1',
    category: 'product_knowledge',
    tags: ['stateroom', 'veranda'],
    question: 'All Viking staterooms have private balconies.',
    correct_answer: true,
    explanation: 'Every stateroom category on Viking ocean ships features a private veranda (balcony).',
  },
  {
    id: 'Q006',
    type: 'scenario',
    difficulty: 'L2',
    category: 'complaint_handling',
    tags: ['cabin', 'noise'],
    question: 'A guest complains about cabin noise. What is the BEST response?',
    options: [
      { key: 'A', text: 'Say "That\'s normal on ships"', is_correct: false },
      { key: 'B', text: 'Ignore and move on', is_correct: false },
      { key: 'C', text: 'Show empathy + investigate cause + offer solutions', is_correct: true },
      { key: 'D', text: 'Transfer immediately to supervisor', is_correct: false },
    ],
    explanation: 'Following the LEAP model: Listen to understand the issue, Empathize with the disruption, investigate the cause, and provide solutions.',
  },
  {
    id: 'Q007',
    type: 'open_ended',
    difficulty: 'L2',
    category: 'sales_skills',
    tags: ['first_time', 'value'],
    question: 'How would you introduce Viking\'s value to a first-time cruiser?',
    expected_elements: [
      'Explain all-inclusive concept',
      'Highlight cultural focus',
      'Mention adult-only atmosphere',
      'Compare to land-based travel value',
    ],
    explanation: 'A complete answer should address the unique value proposition of Viking including inclusions, cultural experiences, and the serene atmosphere.',
  },
  {
    id: 'Q008',
    type: 'scenario',
    difficulty: 'L3',
    category: 'complaint_handling',
    tags: ['shore_excursion', 'weather'],
    question: 'When a shore excursion is cancelled due to weather, the BEST approach is:',
    options: [
      { key: 'A', text: 'Say nothing can be done', is_correct: false },
      { key: 'B', text: 'Show empathy + explain safety priority + offer alternatives', is_correct: true },
      { key: 'C', text: 'Argue with the guest', is_correct: false },
      { key: 'D', text: 'Promise cash refund (against policy)', is_correct: false },
    ],
    explanation: 'Acknowledge disappointment, explain that safety is the priority, and highlight the alternative arrangements and automatic refund.',
  },
]

export const useQuizStore = create<QuizState>((set, get) => ({
  questions: [],
  currentQuiz: [],
  currentIndex: 0,
  attempts: [],
  isLoading: false,
  
  loadQuestions: () => {
    set({ questions: sampleQuestions, isLoading: false })
  },
  
  startQuiz: (category?: string, count: number = 5) => {
    const { questions } = get()
    let filtered = category 
      ? questions.filter(q => q.category === category)
      : questions
    
    // Shuffle and take count
    const shuffled = [...filtered].sort(() => Math.random() - 0.5)
    const quiz = shuffled.slice(0, count)
    
    set({ currentQuiz: quiz, currentIndex: 0 })
  },
  
  submitAnswer: (answer: string) => {
    const { currentQuiz, currentIndex, attempts } = get()
    const question = currentQuiz[currentIndex]
    
    let isCorrect = false
    let score = 0
    
    if (question.type === 'single_choice' || question.type === 'scenario') {
      const correctOption = question.options?.find(o => o.is_correct)
      isCorrect = correctOption?.key === answer
      score = isCorrect ? 100 : 0
    } else if (question.type === 'true_false') {
      isCorrect = (answer === 'true') === question.correct_answer
      score = isCorrect ? 100 : 0
    } else if (question.type === 'open_ended') {
      // Simulate AI grading
      const expectedCount = question.expected_elements?.length || 1
      const matchedElements = Math.floor(Math.random() * expectedCount) + 1
      score = Math.round((matchedElements / expectedCount) * 100)
      isCorrect = score >= 60
    }
    
    const attempt: QuizAttempt = {
      id: `attempt_${Date.now()}`,
      quizId: question.id,
      userId: 'current_user',
      answer,
      isCorrect,
      timeSpent: Math.floor(Math.random() * 60) + 10,
      score,
      createdAt: new Date(),
      aiFeedback: question.type === 'open_ended' 
        ? `Score: ${score}/100. ${isCorrect ? 'Good job addressing the key points!' : 'Consider covering more aspects of the value proposition.'}`
        : undefined,
    }
    
    set({ attempts: [...attempts, attempt] })
    return attempt
  },
  
  nextQuestion: () => {
    const { currentIndex, currentQuiz } = get()
    if (currentIndex < currentQuiz.length - 1) {
      set({ currentIndex: currentIndex + 1 })
    }
  },
  
  resetQuiz: () => {
    set({ currentQuiz: [], currentIndex: 0 })
  },
}))

