import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Users, 
  BookOpen, 
  TrendingUp, 
  Award,
  ArrowUpRight,
  ArrowDownRight,
  MessageSquare,
  Target
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'

const kpiData = [
  { name: 'AHT', value: 245, target: 240, unit: 'sec', trend: -3.2, good: true },
  { name: 'CSAT', value: 4.3, target: 4.5, unit: '/5', trend: 2.1, good: true },
  { name: 'FCR', value: 78, target: 80, unit: '%', trend: 1.5, good: true },
  { name: 'Conversion', value: 32, target: 35, unit: '%', trend: -1.2, good: false },
]

const weeklyProgress = [
  { week: 'W1', quizzes: 45, roleplay: 12, avgScore: 72 },
  { week: 'W2', quizzes: 52, roleplay: 18, avgScore: 75 },
  { week: 'W3', quizzes: 48, roleplay: 15, avgScore: 74 },
  { week: 'W4', quizzes: 61, roleplay: 22, avgScore: 78 },
]

const topPerformers = [
  { name: 'Michael Wang', score: 92, improvement: 8 },
  { name: 'Emily Liu', score: 89, improvement: 12 },
  { name: 'David Chen', score: 87, improvement: 5 },
  { name: 'Sarah Kim', score: 85, improvement: 15 },
]

const recentActivity = [
  { user: 'Michael Wang', action: 'Completed Role Play', scenario: 'Price Objection', score: 88, time: '10 min ago' },
  { user: 'Emily Liu', action: 'Passed Quiz', topic: 'Product Knowledge', score: 95, time: '25 min ago' },
  { user: 'David Chen', action: 'Started Role Play', scenario: 'Complaint Handling', time: '1 hour ago' },
]

export default function MentorDashboard() {
  useEffect(() => {
    document.title = 'Mentor Dashboard - Viking Virtual Coach'
  }, [])
  
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-viking-navy">Dashboard Overview</h1>
          <p className="text-gray-600">Monitor team performance and training progress</p>
        </div>
        <div className="flex gap-3">
          <Link to="/mentor/quiz-bank" className="btn btn-outline">
            <BookOpen className="w-4 h-4 mr-2" />
            Manage Quizzes
          </Link>
          <Link to="/mentor/performance" className="btn btn-primary">
            <Users className="w-4 h-4 mr-2" />
            View Team
          </Link>
        </div>
      </div>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        {kpiData.map((kpi) => (
          <div key={kpi.name} className="bg-white rounded-xl p-5 shadow-sm card-hover">
            <div className="flex items-start justify-between mb-3">
              <span className="text-sm font-medium text-gray-500">{kpi.name}</span>
              <span className={`flex items-center text-sm font-medium ${kpi.trend > 0 && kpi.good ? 'text-green-600' : kpi.trend < 0 && !kpi.good ? 'text-red-600' : kpi.trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {kpi.trend > 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                {Math.abs(kpi.trend)}%
              </span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-viking-navy">{kpi.value}</span>
              <span className="text-gray-500">{kpi.unit}</span>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              Target: {kpi.target}{kpi.unit}
            </div>
            <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full ${kpi.value >= kpi.target ? 'bg-green-500' : 'bg-viking-gold'}`}
                style={{ width: `${Math.min(100, (kpi.value / kpi.target) * 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      
      {/* Charts Row */}
      <div className="grid grid-cols-2 gap-6">
        {/* Weekly Training Activity */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-viking-navy mb-4">Weekly Training Activity</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={weeklyProgress}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="week" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip />
              <Bar dataKey="quizzes" name="Quizzes" fill="#00518F" radius={[4, 4, 0, 0]} />
              <Bar dataKey="roleplay" name="Role Plays" fill="#C5A572" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Average Score Trend */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-viking-navy mb-4">Average Score Trend</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={weeklyProgress}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="week" stroke="#888" />
              <YAxis stroke="#888" domain={[60, 100]} />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="avgScore" 
                name="Avg Score"
                stroke="#D4145A" 
                strokeWidth={3}
                dot={{ fill: '#D4145A', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Bottom Row */}
      <div className="grid grid-cols-3 gap-6">
        {/* Top Performers */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-viking-navy">Top Performers</h3>
            <Award className="w-5 h-5 text-viking-gold" />
          </div>
          <div className="space-y-4">
            {topPerformers.map((performer, index) => (
              <div key={performer.name} className="flex items-center gap-3">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  index === 0 ? 'bg-viking-gold text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                  {index + 1}
                </span>
                <div className="flex-1">
                  <p className="font-medium text-viking-navy">{performer.name}</p>
                  <p className="text-xs text-green-600">+{performer.improvement}% improvement</p>
                </div>
                <span className="text-lg font-bold text-viking-navy">{performer.score}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Recent Activity */}
        <div className="col-span-2 bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-viking-navy">Recent Activity</h3>
            <Link to="/mentor/performance" className="text-sm text-viking-blue hover:underline">
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  activity.action.includes('Role Play') ? 'bg-viking-blue/10 text-viking-blue' :
                  activity.action.includes('Quiz') ? 'bg-green-100 text-green-600' :
                  'bg-gray-200 text-gray-600'
                }`}>
                  {activity.action.includes('Role Play') ? <MessageSquare className="w-5 h-5" /> :
                   activity.action.includes('Quiz') ? <Target className="w-5 h-5" /> :
                   <TrendingUp className="w-5 h-5" />}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-viking-navy">{activity.user}</p>
                  <p className="text-sm text-gray-600">
                    {activity.action} - {activity.scenario || activity.topic}
                  </p>
                </div>
                {activity.score && (
                  <span className="text-lg font-bold text-viking-navy">{activity.score}</span>
                )}
                <span className="text-xs text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

