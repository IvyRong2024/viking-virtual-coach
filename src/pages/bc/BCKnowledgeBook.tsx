import { useState } from 'react'
import { Search, BookOpen, Star, Clock, ChevronRight, Filter, XCircle, BookmarkPlus } from 'lucide-react'
import clsx from 'clsx'

interface KnowledgeArticle {
  id: string
  title: string
  category: string
  summary: string
  readTime: number
  isBookmarked: boolean
  lastViewed?: string
}

interface WrongAnswer {
  id: string
  question: string
  yourAnswer: string
  correctAnswer: string
  explanation: string
  category: string
  date: string
}

const knowledgeArticles: KnowledgeArticle[] = [
  {
    id: '1',
    title: 'Viking Brand Positioning & USPs',
    category: 'Product Knowledge',
    summary: 'Learn about Viking\'s unique positioning as an adult-only, destination-focused cruise line with Scandinavian elegance.',
    readTime: 5,
    isBookmarked: true,
  },
  {
    id: '2',
    title: 'All-Inclusive Pricing Model',
    category: 'Product Knowledge',
    summary: 'Understand what\'s included in Viking\'s fare and how to communicate value to price-conscious guests.',
    readTime: 4,
    isBookmarked: false,
  },
  {
    id: '3',
    title: 'The LEAP Model for Empathy',
    category: 'Communication',
    summary: 'Master the Listen-Empathize-Acknowledge-Provide framework for handling guest emotions.',
    readTime: 6,
    isBookmarked: true,
  },
  {
    id: '4',
    title: 'Handling Price Objections',
    category: 'Sales Skills',
    summary: 'Strategies for presenting value when guests compare Viking to lower-priced competitors.',
    readTime: 7,
    isBookmarked: false,
  },
  {
    id: '5',
    title: 'Shore Excursion Policies',
    category: 'Policy',
    summary: 'Complete guide to included excursions, upgrades, cancellations, and weather-related changes.',
    readTime: 5,
    isBookmarked: false,
  },
  {
    id: '6',
    title: 'De-escalation Techniques',
    category: 'Complaint Handling',
    summary: 'How to calm angry guests and transform complaints into opportunities for loyalty.',
    readTime: 8,
    isBookmarked: true,
  },
]

const wrongAnswers: WrongAnswer[] = [
  {
    id: '1',
    question: 'What is included with shore excursions on Viking?',
    yourAnswer: 'All excursions are free',
    correctAnswer: 'One complimentary cultural excursion per port',
    explanation: 'Each port includes one complimentary cultural excursion. Premium and private options are available for additional cost.',
    category: 'Policy',
    date: '2 days ago',
  },
  {
    id: '2',
    question: 'When a guest demands immediate Wi-Fi fix, you should:',
    yourAnswer: 'Promise to fix it immediately',
    correctAnswer: 'Show empathy + explain satellite network characteristics',
    explanation: 'Empathize with frustration, honestly explain satellite internet limitations, and offer practical tips.',
    category: 'Complaint Handling',
    date: '3 days ago',
  },
  {
    id: '3',
    question: 'How would you explain Viking\'s "destination-focused" philosophy?',
    yourAnswer: 'We have more ports than other cruise lines',
    correctAnswer: 'Full explanation covering cultural immersion, included excursions, and smaller ship advantages',
    explanation: 'Viking believes the destinations are the entertainment, with cultural excursions, onboard lectures, and smaller ships that can dock in the heart of cities.',
    category: 'Product Knowledge',
    date: '5 days ago',
  },
]

type TabType = 'articles' | 'bookmarks' | 'wrong'

export default function BCKnowledgeBook() {
  const [activeTab, setActiveTab] = useState<TabType>('articles')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedArticle, setSelectedArticle] = useState<KnowledgeArticle | null>(null)
  
  const categories = ['all', 'Product Knowledge', 'Sales Skills', 'Communication', 'Complaint Handling', 'Policy']
  
  const filteredArticles = knowledgeArticles.filter(a => {
    const matchesSearch = a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         a.summary.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || a.category === selectedCategory
    const matchesTab = activeTab === 'articles' || (activeTab === 'bookmarks' && a.isBookmarked)
    return matchesSearch && matchesCategory && matchesTab
  })
  
  if (selectedArticle) {
    return (
      <div className="max-w-3xl mx-auto animate-fadeIn">
        <button
          onClick={() => setSelectedArticle(null)}
          className="flex items-center gap-2 text-gray-600 hover:text-viking-navy mb-6"
        >
          ← Back to Knowledge Book
        </button>
        
        <div className="bg-white rounded-xl p-8 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <span className="badge bg-viking-blue/10 text-viking-blue">{selectedArticle.category}</span>
            <span className="text-sm text-gray-500 flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {selectedArticle.readTime} min read
            </span>
          </div>
          
          <h1 className="text-2xl font-bold text-viking-navy mb-4">{selectedArticle.title}</h1>
          
          <div className="prose max-w-none">
            <p className="text-gray-600 mb-6">{selectedArticle.summary}</p>
            
            <h2 className="text-lg font-semibold text-viking-navy mt-8 mb-4">Key Points</h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <span className="text-viking-gold">•</span>
                <span>Viking is an adults-only (18+) cruise line focused on cultural enrichment</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-viking-gold">•</span>
                <span>All staterooms feature private verandas (balconies)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-viking-gold">•</span>
                <span>Pricing includes Wi-Fi, shore excursions, specialty dining, and spa access</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-viking-gold">•</span>
                <span>Ships are smaller (~930 passengers) for more intimate experiences</span>
              </li>
            </ul>
            
            <h2 className="text-lg font-semibold text-viking-navy mt-8 mb-4">How to Apply</h2>
            <p className="text-gray-600">
              When speaking with guests, emphasize the value of the all-inclusive experience. 
              Help them understand that while the sticker price may seem higher, the total 
              cost of their vacation often compares favorably when you add up extras on other lines.
            </p>
          </div>
          
          <div className="mt-8 pt-6 border-t flex justify-between">
            <button className="btn btn-outline">
              <BookmarkPlus className="w-4 h-4 mr-2" />
              {selectedArticle.isBookmarked ? 'Bookmarked' : 'Add Bookmark'}
            </button>
            <button className="btn btn-primary">
              Take Related Quiz →
            </button>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-viking-navy">Knowledge Book</h1>
        <p className="text-gray-600">Review learning materials and track areas for improvement</p>
      </div>
      
      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('articles')}
              className={clsx('px-6 py-4 font-medium text-sm border-b-2 transition-colors', {
                'border-viking-blue text-viking-blue': activeTab === 'articles',
                'border-transparent text-gray-500 hover:text-gray-700': activeTab !== 'articles',
              })}
            >
              <BookOpen className="w-4 h-4 inline mr-2" />
              All Articles
            </button>
            <button
              onClick={() => setActiveTab('bookmarks')}
              className={clsx('px-6 py-4 font-medium text-sm border-b-2 transition-colors', {
                'border-viking-blue text-viking-blue': activeTab === 'bookmarks',
                'border-transparent text-gray-500 hover:text-gray-700': activeTab !== 'bookmarks',
              })}
            >
              <Star className="w-4 h-4 inline mr-2" />
              Bookmarked
            </button>
            <button
              onClick={() => setActiveTab('wrong')}
              className={clsx('px-6 py-4 font-medium text-sm border-b-2 transition-colors', {
                'border-viking-blue text-viking-blue': activeTab === 'wrong',
                'border-transparent text-gray-500 hover:text-gray-700': activeTab !== 'wrong',
              })}
            >
              <XCircle className="w-4 h-4 inline mr-2" />
              Wrong Answers
              <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-600 rounded-full text-xs">
                {wrongAnswers.length}
              </span>
            </button>
          </div>
        </div>
        
        {/* Search & Filter */}
        {activeTab !== 'wrong' && (
          <div className="p-4 border-b border-gray-100 flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search articles..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-viking-blue focus:border-transparent"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="pl-9 pr-8 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-viking-blue focus:border-transparent appearance-none bg-white"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
        
        {/* Content */}
        <div className="p-4">
          {activeTab === 'wrong' ? (
            <div className="space-y-4">
              {wrongAnswers.map((item) => (
                <div key={item.id} className="p-4 border border-red-200 bg-red-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="badge bg-red-100 text-red-600">{item.category}</span>
                    <span className="text-sm text-gray-500">{item.date}</span>
                  </div>
                  <h4 className="font-semibold text-viking-navy mb-3">{item.question}</h4>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="p-3 bg-red-100 rounded-lg">
                      <p className="text-xs text-red-600 font-medium mb-1">Your Answer</p>
                      <p className="text-sm text-red-700">{item.yourAnswer}</p>
                    </div>
                    <div className="p-3 bg-green-100 rounded-lg">
                      <p className="text-xs text-green-600 font-medium mb-1">Correct Answer</p>
                      <p className="text-sm text-green-700">{item.correctAnswer}</p>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-white rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-500 font-medium mb-1">Explanation</p>
                    <p className="text-sm text-gray-600">{item.explanation}</p>
                  </div>
                  
                  <button className="mt-4 text-sm text-viking-blue hover:underline">
                    Practice Similar Questions →
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {filteredArticles.map((article) => (
                <button
                  key={article.id}
                  onClick={() => setSelectedArticle(article)}
                  className="text-left p-5 border border-gray-200 rounded-xl hover:border-viking-blue hover:shadow-md transition-all group"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="badge bg-viking-blue/10 text-viking-blue">{article.category}</span>
                    {article.isBookmarked && <Star className="w-4 h-4 text-viking-gold fill-current" />}
                  </div>
                  <h4 className="font-semibold text-viking-navy mb-2 group-hover:text-viking-blue transition-colors">
                    {article.title}
                  </h4>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">{article.summary}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {article.readTime} min read
                    </span>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-viking-blue group-hover:translate-x-1 transition-all" />
                  </div>
                </button>
              ))}
            </div>
          )}
          
          {filteredArticles.length === 0 && activeTab !== 'wrong' && (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500">No articles found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

