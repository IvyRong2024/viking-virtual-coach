import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import { useSkillStore } from '../../stores/skillStore'
import { 
  Target, 
  MessageSquare, 
  BookOpen, 
  Flame,
  ChevronRight,
  CheckCircle
} from 'lucide-react'
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts'

const dailyTasks = [
  { id: 1, title: 'Complete 5 Quiz Questions', type: 'quiz', completed: 3, total: 5, xp: 50 },
  { id: 2, title: 'Practice Role Play Scenario', type: 'roleplay', completed: 0, total: 1, xp: 100 },
  { id: 3, title: 'Review Knowledge Article', type: 'knowledge', completed: 1, total: 1, xp: 25, done: true },
]

const achievements = [
  { icon: '🎯', title: 'Quiz Master', description: '50 quizzes completed', earned: true },
  { icon: '🔥', title: '7-Day Streak', description: 'Learning every day', earned: true },
  { icon: '💬', title: 'Role Play Pro', description: '10 sessions completed', earned: false },
  { icon: '⭐', title: 'Top Performer', description: 'Score 90+ in all skills', earned: false },
]

export default function BCDashboard() {
  const { user } = useAuthStore()
  const { dimensions, loadSkills } = useSkillStore()
  
  useEffect(() => {
    loadSkills()
  }, [loadSkills])
  
  const radarData = dimensions.map(d => ({
    skill: d.nameCn,
    value: d.score,
  }))
  
  const overallScore = dimensions.length > 0 
    ? Math.round(dimensions.reduce((sum, d) => sum + d.score, 0) / dimensions.length)
    : 0
  
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Welcome Header */}
      <div className="bg-gradient-viking rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1">Welcome back, {user?.name}! 👋</h1>
            <p className="text-white/80">Continue your learning journey today</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="flex items-center gap-1 text-viking-gold">
                <Flame className="w-5 h-5" />
                <span className="text-2xl font-bold">7</span>
              </div>
              <p className="text-xs text-white/60">Day Streak</p>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div className="text-center">
              <p className="text-2xl font-bold">{overallScore}</p>
              <p className="text-xs text-white/60">Overall Score</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="grid grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="col-span-2 space-y-6">
          {/* Daily Tasks */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-viking-navy">Today's Tasks</h3>
              <span className="text-sm text-gray-500">
                {dailyTasks.filter(t => t.done).length}/{dailyTasks.length} completed
              </span>
            </div>
            <div className="space-y-3">
              {dailyTasks.map((task) => (
                <div 
                  key={task.id} 
                  className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                    task.done 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-gray-50 border-gray-200 hover:border-viking-blue'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    task.done ? 'bg-green-100' : 'bg-white border-2 border-gray-200'
                  }`}>
                    {task.done ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : task.type === 'quiz' ? (
                      <Target className="w-5 h-5 text-viking-blue" />
                    ) : task.type === 'roleplay' ? (
                      <MessageSquare className="w-5 h-5 text-viking-gold" />
                    ) : (
                      <BookOpen className="w-5 h-5 text-purple-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${task.done ? 'text-green-700 line-through' : 'text-viking-navy'}`}>
                      {task.title}
                    </p>
                    {!task.done && task.total > 1 && (
                      <div className="mt-1">
                        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-viking-blue rounded-full transition-all"
                            style={{ width: `${(task.completed / task.total) * 100}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{task.completed}/{task.total}</p>
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium text-viking-gold">+{task.xp} XP</span>
                  </div>
                  {!task.done && (
                    <Link 
                      to={task.type === 'quiz' ? '/bc/quiz' : task.type === 'roleplay' ? '/bc/roleplay' : '/bc/knowledge'}
                      className="btn btn-primary py-2 px-4"
                    >
                      Start
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="grid grid-cols-3 gap-4">
            <Link to="/bc/quiz" className="bg-white rounded-xl p-5 shadow-sm card-hover group">
              <div className="w-12 h-12 rounded-xl bg-viking-blue/10 flex items-center justify-center mb-3 group-hover:bg-viking-blue/20 transition-colors">
                <Target className="w-6 h-6 text-viking-blue" />
              </div>
              <h4 className="font-semibold text-viking-navy mb-1">Quick Quiz</h4>
              <p className="text-sm text-gray-500">Test your knowledge</p>
              <ChevronRight className="w-5 h-5 text-gray-400 mt-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link to="/bc/roleplay" className="bg-white rounded-xl p-5 shadow-sm card-hover group">
              <div className="w-12 h-12 rounded-xl bg-viking-gold/20 flex items-center justify-center mb-3 group-hover:bg-viking-gold/30 transition-colors">
                <MessageSquare className="w-6 h-6 text-viking-gold" />
              </div>
              <h4 className="font-semibold text-viking-navy mb-1">Role Play</h4>
              <p className="text-sm text-gray-500">Practice conversations</p>
              <ChevronRight className="w-5 h-5 text-gray-400 mt-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link to="/bc/knowledge" className="bg-white rounded-xl p-5 shadow-sm card-hover group">
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mb-3 group-hover:bg-purple-200 transition-colors">
                <BookOpen className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-viking-navy mb-1">Knowledge Book</h4>
              <p className="text-sm text-gray-500">Review materials</p>
              <ChevronRight className="w-5 h-5 text-gray-400 mt-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
        
        {/* Right Column */}
        <div className="space-y-6">
          {/* Skill Matrix */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-viking-navy">My Skills</h3>
              <Link to="/bc/skills" className="text-sm text-viking-blue hover:underline">
                Details
              </Link>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="skill" tick={{ fontSize: 10 }} />
                <Radar
                  name="Skills"
                  dataKey="value"
                  stroke="#D4145A"
                  fill="#D4145A"
                  fillOpacity={0.3}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          
          {/* Achievements */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-viking-navy mb-4">Achievements</h3>
            <div className="grid grid-cols-2 gap-3">
              {achievements.map((achievement, index) => (
                <div 
                  key={index}
                  className={`p-3 rounded-xl border text-center ${
                    achievement.earned 
                      ? 'bg-viking-gold/10 border-viking-gold/30' 
                      : 'bg-gray-50 border-gray-200 opacity-50'
                  }`}
                >
                  <span className="text-2xl">{achievement.icon}</span>
                  <p className="text-xs font-medium text-viking-navy mt-1">{achievement.title}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Recent Progress */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-viking-navy mb-4">This Week</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Quizzes Completed</span>
                <span className="font-bold text-viking-navy">12</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Role Plays</span>
                <span className="font-bold text-viking-navy">3</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">XP Earned</span>
                <span className="font-bold text-viking-gold">+450</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Skill Improvement</span>
                <span className="font-bold text-green-600">+5%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

