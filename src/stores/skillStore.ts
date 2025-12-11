import { create } from 'zustand'

export interface SkillDimension {
  id: string
  name: string
  nameCn: string
  level: 1 | 2 | 3 | 4
  score: number
  description: string
  progress: number // 0-100 progress to next level
}

export interface SkillHistory {
  date: Date
  dimensions: Record<string, number>
}

interface SkillState {
  dimensions: SkillDimension[]
  history: SkillHistory[]
  loadSkills: () => void
  updateSkill: (id: string, score: number) => void
}

const initialSkills: SkillDimension[] = [
  {
    id: 'product_knowledge',
    name: 'Product Knowledge',
    nameCn: '产品知识',
    level: 2,
    score: 72,
    description: 'Understanding of Viking cruise products, itineraries, and policies',
    progress: 45,
  },
  {
    id: 'sales_skills',
    name: 'Sales Skills',
    nameCn: '销售能力',
    level: 2,
    score: 68,
    description: 'Ability to qualify needs, present value, and close bookings',
    progress: 30,
  },
  {
    id: 'communication',
    name: 'Communication',
    nameCn: '沟通能力',
    level: 3,
    score: 85,
    description: 'Clarity, structure, and effectiveness of communication',
    progress: 60,
  },
  {
    id: 'empathy',
    name: 'Empathy',
    nameCn: '同理心',
    level: 2,
    score: 75,
    description: 'Ability to understand and respond to guest emotions',
    progress: 50,
  },
  {
    id: 'complaint_handling',
    name: 'Complaint Handling',
    nameCn: '投诉处理',
    level: 2,
    score: 65,
    description: 'Skill in resolving guest complaints effectively',
    progress: 25,
  },
  {
    id: 'system_operations',
    name: 'System Operations',
    nameCn: '系统操作',
    level: 3,
    score: 82,
    description: 'Proficiency in CRM and operational tools',
    progress: 70,
  },
]

const generateHistory = (): SkillHistory[] => {
  const history: SkillHistory[] = []
  const now = new Date()
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i * 7)
    
    history.push({
      date,
      dimensions: {
        product_knowledge: 60 + Math.floor(Math.random() * 20) + i * 2,
        sales_skills: 55 + Math.floor(Math.random() * 20) + i * 2,
        communication: 70 + Math.floor(Math.random() * 15) + i * 2,
        empathy: 65 + Math.floor(Math.random() * 15) + i * 2,
        complaint_handling: 55 + Math.floor(Math.random() * 15) + i * 2,
        system_operations: 70 + Math.floor(Math.random() * 15) + i * 2,
      },
    })
  }
  
  return history
}

export const useSkillStore = create<SkillState>((set) => ({
  dimensions: [],
  history: [],
  
  loadSkills: () => {
    set({ 
      dimensions: initialSkills,
      history: generateHistory(),
    })
  },
  
  updateSkill: (id: string, score: number) => {
    set(state => ({
      dimensions: state.dimensions.map(d => 
        d.id === id ? { ...d, score, progress: Math.min(100, d.progress + 10) } : d
      ),
    }))
  },
}))

