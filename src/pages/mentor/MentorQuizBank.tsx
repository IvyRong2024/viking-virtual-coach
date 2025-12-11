import { useEffect, useState } from 'react'
import { useQuizStore } from '../../stores/quizStore'
import { Search, Plus, Filter, Edit, Trash2, Eye, Tag } from 'lucide-react'
import clsx from 'clsx'

export default function MentorQuizBank() {
  const { questions, loadQuestions } = useQuizStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all')
  
  useEffect(() => {
    loadQuestions()
  }, [loadQuestions])
  
  const categories = ['all', 'product_knowledge', 'sales_skills', 'complaint_handling', 'communication']
  const difficulties = ['all', 'L1', 'L2', 'L3', 'L4']
  
  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.question.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || q.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === 'all' || q.difficulty === selectedDifficulty
    return matchesSearch && matchesCategory && matchesDifficulty
  })
  
  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'L1': return 'badge-easy'
      case 'L2': return 'bg-blue-100 text-blue-800'
      case 'L3': return 'badge-medium'
      case 'L4': return 'badge-hard'
      default: return 'bg-gray-100 text-gray-800'
    }
  }
  
  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'single_choice': return 'Single Choice'
      case 'true_false': return 'True/False'
      case 'scenario': return 'Scenario'
      case 'open_ended': return 'Open Ended'
      default: return type
    }
  }
  
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-viking-navy">Quiz Bank</h1>
          <p className="text-gray-600">Manage training questions and assessments</p>
        </div>
        <button className="btn btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          Add Question
        </button>
      </div>
      
      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search questions..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-viking-blue focus:border-transparent"
            />
          </div>
          
          {/* Category Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="pl-9 pr-8 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-viking-blue focus:border-transparent appearance-none bg-white"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </option>
              ))}
            </select>
          </div>
          
          {/* Difficulty Filter */}
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-viking-blue focus:border-transparent appearance-none bg-white"
          >
            {difficulties.map(diff => (
              <option key={diff} value={diff}>
                {diff === 'all' ? 'All Levels' : diff}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500">Total Questions</p>
          <p className="text-2xl font-bold text-viking-navy">{questions.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500">Categories</p>
          <p className="text-2xl font-bold text-viking-navy">{categories.length - 1}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500">Avg Pass Rate</p>
          <p className="text-2xl font-bold text-green-600">76%</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500">Active Quizzes</p>
          <p className="text-2xl font-bold text-viking-blue">12</p>
        </div>
      </div>
      
      {/* Questions Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Question</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Type</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Category</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Level</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Tags</th>
              <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredQuestions.map((question) => (
              <tr key={question.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <p className="text-sm text-viking-navy font-medium line-clamp-2">
                    {question.question}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-600">{getTypeLabel(question.type)}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-600 capitalize">
                    {question.category.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={clsx('badge', getDifficultyColor(question.difficulty))}>
                    {question.difficulty}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-1 flex-wrap">
                    {question.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                        <Tag className="w-3 h-3" />
                        {tag}
                      </span>
                    ))}
                    {question.tags.length > 2 && (
                      <span className="text-xs text-gray-500">+{question.tags.length - 2}</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-2 text-gray-400 hover:text-viking-blue hover:bg-gray-100 rounded-lg transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-viking-blue hover:bg-gray-100 rounded-lg transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-gray-100 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredQuestions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No questions found matching your filters.</p>
          </div>
        )}
      </div>
    </div>
  )
}

