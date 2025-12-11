import { useState } from 'react'
import { Search, Filter, ChevronDown, TrendingUp, Target, MessageSquare, Award } from 'lucide-react'
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'

const agents = [
  {
    id: '1',
    name: 'Michael Wang',
    team: 'Sales Team A',
    avatar: 'M',
    level: 'L3',
    overallScore: 85,
    skills: {
      product: 88,
      sales: 82,
      communication: 90,
      empathy: 78,
      complaint: 85,
      system: 88,
    },
    quizzesCompleted: 45,
    roleplayCompleted: 12,
    streak: 7,
    lastActive: '2 hours ago',
  },
  {
    id: '2',
    name: 'Emily Liu',
    team: 'Sales Team A',
    avatar: 'E',
    level: 'L2',
    overallScore: 78,
    skills: {
      product: 75,
      sales: 72,
      communication: 85,
      empathy: 82,
      complaint: 70,
      system: 80,
    },
    quizzesCompleted: 38,
    roleplayCompleted: 8,
    streak: 3,
    lastActive: '1 day ago',
  },
  {
    id: '3',
    name: 'David Chen',
    team: 'Sales Team B',
    avatar: 'D',
    level: 'L2',
    overallScore: 72,
    skills: {
      product: 70,
      sales: 68,
      communication: 78,
      empathy: 72,
      complaint: 65,
      system: 82,
    },
    quizzesCompleted: 32,
    roleplayCompleted: 5,
    streak: 0,
    lastActive: '3 days ago',
  },
]

const progressData = [
  { week: 'W1', score: 68 },
  { week: 'W2', score: 72 },
  { week: 'W3', score: 75 },
  { week: 'W4', score: 78 },
  { week: 'W5', score: 82 },
  { week: 'W6', score: 85 },
]

export default function MentorPerformance() {
  const [selectedAgent, setSelectedAgent] = useState(agents[0])
  const [searchTerm, setSearchTerm] = useState('')
  
  const radarData = [
    { skill: 'Product', value: selectedAgent.skills.product },
    { skill: 'Sales', value: selectedAgent.skills.sales },
    { skill: 'Comm.', value: selectedAgent.skills.communication },
    { skill: 'Empathy', value: selectedAgent.skills.empathy },
    { skill: 'Complaint', value: selectedAgent.skills.complaint },
    { skill: 'System', value: selectedAgent.skills.system },
  ]
  
  const filteredAgents = agents.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase())
  )
  
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-viking-navy">Team Performance</h1>
        <p className="text-gray-600">Track agent progress and identify coaching opportunities</p>
      </div>
      
      <div className="grid grid-cols-3 gap-6">
        {/* Agent List */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-4 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search agents..."
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-viking-blue focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="divide-y divide-gray-100 max-h-[600px] overflow-auto">
            {filteredAgents.map((agent) => (
              <button
                key={agent.id}
                onClick={() => setSelectedAgent(agent)}
                className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                  selectedAgent.id === agent.id ? 'bg-viking-blue/5 border-l-4 border-viking-blue' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-viking-gold flex items-center justify-center text-white font-bold">
                    {agent.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-viking-navy">{agent.name}</p>
                    <p className="text-sm text-gray-500">{agent.team}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-viking-navy">{agent.overallScore}</p>
                    <p className="text-xs text-gray-500">{agent.level}</p>
                  </div>
                </div>
                
                <div className="mt-3 flex gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Target className="w-3 h-3" />
                    {agent.quizzesCompleted} quizzes
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" />
                    {agent.roleplayCompleted} roleplay
                  </span>
                  {agent.streak > 0 && (
                    <span className="flex items-center gap-1 text-orange-500">
                      🔥 {agent.streak} day streak
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
        
        {/* Agent Detail */}
        <div className="col-span-2 space-y-6">
          {/* Profile Card */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-viking-gold flex items-center justify-center text-white text-2xl font-bold">
                  {selectedAgent.avatar}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-viking-navy">{selectedAgent.name}</h2>
                  <p className="text-gray-500">{selectedAgent.team}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="badge bg-viking-blue text-white">{selectedAgent.level}</span>
                    <span className="text-sm text-gray-500">Last active: {selectedAgent.lastActive}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-4xl font-bold text-viking-navy">{selectedAgent.overallScore}</p>
                <p className="text-sm text-gray-500">Overall Score</p>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <Target className="w-5 h-5 mx-auto mb-1 text-viking-blue" />
                <p className="text-lg font-bold text-viking-navy">{selectedAgent.quizzesCompleted}</p>
                <p className="text-xs text-gray-500">Quizzes</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <MessageSquare className="w-5 h-5 mx-auto mb-1 text-viking-gold" />
                <p className="text-lg font-bold text-viking-navy">{selectedAgent.roleplayCompleted}</p>
                <p className="text-xs text-gray-500">Role Plays</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <TrendingUp className="w-5 h-5 mx-auto mb-1 text-green-500" />
                <p className="text-lg font-bold text-viking-navy">+12%</p>
                <p className="text-xs text-gray-500">Improvement</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <Award className="w-5 h-5 mx-auto mb-1 text-orange-500" />
                <p className="text-lg font-bold text-viking-navy">{selectedAgent.streak}</p>
                <p className="text-xs text-gray-500">Day Streak</p>
              </div>
            </div>
          </div>
          
          {/* Charts Row */}
          <div className="grid grid-cols-2 gap-6">
            {/* Skill Radar */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-viking-navy mb-4">Skill Matrix</h3>
              <ResponsiveContainer width="100%" height={250}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="skill" tick={{ fontSize: 12 }} />
                  <Radar
                    name="Skills"
                    dataKey="value"
                    stroke="#00518F"
                    fill="#00518F"
                    fillOpacity={0.3}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            
            {/* Progress Chart */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-viking-navy mb-4">Score Progress</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="week" stroke="#888" />
                  <YAxis stroke="#888" domain={[50, 100]} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#D4145A" 
                    strokeWidth={3}
                    dot={{ fill: '#D4145A' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Skill Details */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-viking-navy mb-4">Skill Breakdown</h3>
            <div className="space-y-4">
              {Object.entries(selectedAgent.skills).map(([key, value]) => (
                <div key={key}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700 capitalize">
                      {key.replace('_', ' ')}
                    </span>
                    <span className="text-sm font-bold text-viking-navy">{value}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        value >= 80 ? 'bg-green-500' : value >= 60 ? 'bg-viking-gold' : 'bg-red-400'
                      }`}
                      style={{ width: `${value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

