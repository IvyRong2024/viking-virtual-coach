import { useEffect } from 'react'
import { useRolePlayStore } from '../../stores/rolePlayStore'
import { MessageSquare, Users, TrendingUp, Clock, Play, Edit, Eye } from 'lucide-react'
import clsx from 'clsx'

const recentSessions = [
  {
    agent: 'Michael Wang',
    scenario: 'Price Objection',
    persona: 'Value-Seeker',
    score: 88,
    duration: '6:32',
    date: '2 hours ago',
  },
  {
    agent: 'Emily Liu',
    scenario: 'Shore Excursion Cancelled',
    persona: 'Dissatisfied Customer',
    score: 72,
    duration: '8:15',
    date: '5 hours ago',
  },
  {
    agent: 'David Chen',
    scenario: 'Wi-Fi Complaint',
    persona: 'Strict & Impatient',
    score: 65,
    duration: '5:48',
    date: '1 day ago',
  },
]

export default function MentorRolePlay() {
  const { scenarios, personas, loadData } = useRolePlayStore()
  
  useEffect(() => {
    loadData()
  }, [loadData])
  
  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'easy': return 'badge-easy'
      case 'medium': return 'badge-medium'
      case 'hard': return 'badge-hard'
      default: return 'bg-gray-100 text-gray-800'
    }
  }
  
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-viking-navy">Role Play Management</h1>
          <p className="text-gray-600">Manage scenarios and review agent performance</p>
        </div>
        <button className="btn btn-primary">
          <MessageSquare className="w-4 h-4 mr-2" />
          Create Scenario
        </button>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-viking-blue/10 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-viking-blue" />
            </div>
            <span className="text-sm font-medium text-gray-500">Total Sessions</span>
          </div>
          <p className="text-2xl font-bold text-viking-navy">156</p>
          <p className="text-xs text-green-600">+23% this week</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-sm font-medium text-gray-500">Avg Score</span>
          </div>
          <p className="text-2xl font-bold text-viking-navy">76</p>
          <p className="text-xs text-green-600">+5 from last week</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-viking-gold/20 flex items-center justify-center">
              <Clock className="w-5 h-5 text-viking-gold" />
            </div>
            <span className="text-sm font-medium text-gray-500">Avg Duration</span>
          </div>
          <p className="text-2xl font-bold text-viking-navy">5:42</p>
          <p className="text-xs text-gray-500">minutes</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-sm font-medium text-gray-500">Active Agents</span>
          </div>
          <p className="text-2xl font-bold text-viking-navy">24</p>
          <p className="text-xs text-gray-500">of 30 total</p>
        </div>
      </div>
      
      {/* Scenarios Grid */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-viking-navy mb-4">Scenario Library</h3>
        <div className="grid grid-cols-3 gap-4">
          {scenarios.map((scenario) => (
            <div key={scenario.id} className="border border-gray-200 rounded-xl p-4 hover:border-viking-blue hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-3">
                <span className={clsx('badge', getDifficultyColor(scenario.difficulty))}>
                  {scenario.difficulty}
                </span>
                <span className="text-xs text-gray-500 capitalize">{scenario.category}</span>
              </div>
              <h4 className="font-semibold text-viking-navy mb-1">{scenario.title}</h4>
              <p className="text-sm text-gray-500 mb-3">{scenario.titleCn}</p>
              <p className="text-xs text-gray-600 line-clamp-2 mb-4">
                {scenario.openingLine}
              </p>
              <div className="flex items-center gap-2">
                <button className="flex-1 btn btn-ghost text-sm py-1.5">
                  <Eye className="w-4 h-4 mr-1" />
                  Preview
                </button>
                <button className="flex-1 btn btn-outline text-sm py-1.5">
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Recent Sessions */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-viking-navy">Recent Sessions</h3>
          <button className="text-sm text-viking-blue hover:underline">View All</button>
        </div>
        <div className="space-y-3">
          {recentSessions.map((session, index) => (
            <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div className="w-10 h-10 rounded-full bg-viking-gold flex items-center justify-center text-white font-bold">
                {session.agent.charAt(0)}
              </div>
              <div className="flex-1">
                <p className="font-medium text-viking-navy">{session.agent}</p>
                <p className="text-sm text-gray-500">
                  {session.scenario} • {session.persona}
                </p>
              </div>
              <div className="text-right">
                <p className={clsx('text-lg font-bold', {
                  'text-green-600': session.score >= 80,
                  'text-viking-gold': session.score >= 60 && session.score < 80,
                  'text-red-500': session.score < 60,
                })}>
                  {session.score}
                </p>
                <p className="text-xs text-gray-500">{session.duration}</p>
              </div>
              <div className="text-sm text-gray-500">{session.date}</div>
              <button className="btn btn-ghost p-2">
                <Play className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

