import { useEffect } from 'react'
import { useSkillStore } from '../../stores/skillStore'
import { TrendingUp, Award, Target, ChevronUp } from 'lucide-react'
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import clsx from 'clsx'

export default function BCSkillMatrix() {
  const { dimensions, history, loadSkills } = useSkillStore()
  
  useEffect(() => {
    loadSkills()
  }, [loadSkills])
  
  const radarData = dimensions.map(d => ({
    skill: d.nameCn,
    value: d.score,
    fullMark: 100,
  }))
  
  const overallScore = dimensions.length > 0 
    ? Math.round(dimensions.reduce((sum, d) => sum + d.score, 0) / dimensions.length)
    : 0
  
  const getLevelColor = (level: number) => {
    switch (level) {
      case 1: return 'bg-gray-100 text-gray-600'
      case 2: return 'bg-blue-100 text-blue-600'
      case 3: return 'bg-viking-gold/20 text-viking-gold'
      case 4: return 'bg-green-100 text-green-600'
      default: return 'bg-gray-100 text-gray-600'
    }
  }
  
  const getLevelName = (level: number) => {
    switch (level) {
      case 1: return 'Beginner'
      case 2: return 'Developing'
      case 3: return 'Proficient'
      case 4: return 'Expert'
      default: return 'Unknown'
    }
  }
  
  // Transform history for chart
  const historyData = history.map((h, i) => ({
    week: `W${i + 1}`,
    ...h.dimensions,
  }))
  
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-viking-navy">Skill Matrix</h1>
          <p className="text-gray-600">Track your competency growth across all dimensions</p>
        </div>
        <div className="flex items-center gap-4 bg-white rounded-xl px-6 py-3 shadow-sm">
          <div className="text-right">
            <p className="text-sm text-gray-500">Overall Score</p>
            <p className="text-3xl font-bold text-viking-navy">{overallScore}</p>
          </div>
          <div className="w-px h-12 bg-gray-200" />
          <div className="text-right">
            <p className="text-sm text-gray-500">Current Level</p>
            <p className="text-3xl font-bold text-viking-blue">L2</p>
          </div>
        </div>
      </div>
      
      {/* Main Grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* Radar Chart */}
        <div className="col-span-2 bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-viking-navy mb-4">Competency Overview</h3>
          <ResponsiveContainer width="100%" height={350}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis 
                dataKey="skill" 
                tick={{ fontSize: 12, fill: '#4b5563' }}
              />
              <Radar
                name="Current"
                dataKey="value"
                stroke="#D4145A"
                fill="#D4145A"
                fillOpacity={0.3}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Level Summary */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-viking-navy mb-4">Level Progress</h3>
          <div className="space-y-4">
            {[4, 3, 2, 1].map((level) => {
              const skillsAtLevel = dimensions.filter(d => d.level === level).length
              const isCurrentLevel = level === 2
              
              return (
                <div 
                  key={level}
                  className={clsx('p-4 rounded-xl border-2 transition-all', {
                    'border-viking-blue bg-viking-blue/5': isCurrentLevel,
                    'border-gray-100': !isCurrentLevel,
                    'opacity-50': level > 2,
                  })}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={clsx('badge', getLevelColor(level))}>
                      L{level} - {getLevelName(level)}
                    </span>
                    {isCurrentLevel && (
                      <span className="text-xs text-viking-blue font-medium">Current</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={clsx('h-full rounded-full', {
                          'bg-viking-blue': isCurrentLevel,
                          'bg-gray-300': !isCurrentLevel,
                        })}
                        style={{ width: `${(skillsAtLevel / dimensions.length) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-500">{skillsAtLevel}/{dimensions.length}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
      
      {/* Progress Chart */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-viking-navy mb-4">Weekly Progress</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={historyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="week" stroke="#888" />
            <YAxis stroke="#888" domain={[50, 100]} />
            <Tooltip />
            <Line type="monotone" dataKey="product_knowledge" name="Product" stroke="#00518F" strokeWidth={2} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="sales_skills" name="Sales" stroke="#D4145A" strokeWidth={2} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="communication" name="Communication" stroke="#C5A572" strokeWidth={2} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {/* Skill Details */}
      <div className="grid grid-cols-2 gap-4">
        {dimensions.map((dim) => (
          <div key={dim.id} className="bg-white rounded-xl p-6 shadow-sm card-hover">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="font-semibold text-viking-navy">{dim.name}</h4>
                <p className="text-sm text-gray-500">{dim.nameCn}</p>
              </div>
              <span className={clsx('badge', getLevelColor(dim.level))}>
                L{dim.level}
              </span>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">{dim.description}</p>
            
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-500">Current Score</span>
                  <span className="font-bold text-viking-navy">{dim.score}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={clsx('h-full rounded-full', {
                      'bg-green-500': dim.score >= 80,
                      'bg-viking-gold': dim.score >= 60 && dim.score < 80,
                      'bg-red-400': dim.score < 60,
                    })}
                    style={{ width: `${dim.score}%` }}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-500">Progress to L{Math.min(dim.level + 1, 4)}</span>
                  <span className="text-sm text-viking-blue">{dim.progress}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-viking-blue rounded-full"
                    style={{ width: `${dim.progress}%` }}
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-1 text-green-600 text-sm">
                <ChevronUp className="w-4 h-4" />
                <span>+5% this week</span>
              </div>
              <button className="text-sm text-viking-blue hover:underline">
                Practice →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

