import { useEffect, useState } from 'react'
import { useQuizStore, QuizQuestion, QuizAttempt } from '../../stores/quizStore'
import { Target, Clock, CheckCircle, XCircle, ArrowRight, RotateCcw, Trophy } from 'lucide-react'
import clsx from 'clsx'

type QuizState = 'select' | 'playing' | 'result'

export default function BCQuizCenter() {
  const { questions, currentQuiz, currentIndex, loadQuestions, startQuiz, submitAnswer, nextQuestion, resetQuiz } = useQuizStore()
  const [quizState, setQuizState] = useState<QuizState>('select')
  const [selectedAnswer, setSelectedAnswer] = useState<string>('')
  const [openAnswer, setOpenAnswer] = useState<string>('')
  const [submitted, setSubmitted] = useState(false)
  const [lastAttempt, setLastAttempt] = useState<QuizAttempt | null>(null)
  const [results, setResults] = useState<QuizAttempt[]>([])
  
  useEffect(() => {
    loadQuestions()
  }, [loadQuestions])
  
  const categories = [
    { id: 'all', name: 'All Topics', icon: '📚', count: questions.length },
    { id: 'product_knowledge', name: 'Product Knowledge', icon: '🚢', count: questions.filter(q => q.category === 'product_knowledge').length },
    { id: 'sales_skills', name: 'Sales Skills', icon: '💰', count: questions.filter(q => q.category === 'sales_skills').length },
    { id: 'complaint_handling', name: 'Complaint Handling', icon: '🎯', count: questions.filter(q => q.category === 'complaint_handling').length },
  ]
  
  const handleStartQuiz = (category: string) => {
    startQuiz(category === 'all' ? undefined : category, 5)
    setQuizState('playing')
    setResults([])
  }
  
  const handleSubmit = () => {
    const answer = currentQuestion?.type === 'open_ended' ? openAnswer : selectedAnswer
    const attempt = submitAnswer(answer)
    setLastAttempt(attempt)
    setResults(prev => [...prev, attempt])
    setSubmitted(true)
  }
  
  const handleNext = () => {
    if (currentIndex === currentQuiz.length - 1) {
      setQuizState('result')
    } else {
      nextQuestion()
      setSelectedAnswer('')
      setOpenAnswer('')
      setSubmitted(false)
      setLastAttempt(null)
    }
  }
  
  const handleRestart = () => {
    resetQuiz()
    setQuizState('select')
    setSelectedAnswer('')
    setOpenAnswer('')
    setSubmitted(false)
    setLastAttempt(null)
    setResults([])
  }
  
  const currentQuestion = currentQuiz[currentIndex]
  const totalScore = results.reduce((sum, r) => sum + (r.score || 0), 0)
  const avgScore = results.length > 0 ? Math.round(totalScore / results.length) : 0
  
  // Select Category View
  if (quizState === 'select') {
    return (
      <div className="space-y-6 animate-fadeIn">
        <div>
          <h1 className="text-2xl font-bold text-viking-navy">Quiz Center</h1>
          <p className="text-gray-600">Select a topic to start practicing</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleStartQuiz(cat.id)}
              className="bg-white rounded-xl p-6 shadow-sm text-left card-hover group"
            >
              <span className="text-4xl mb-4 block">{cat.icon}</span>
              <h3 className="text-lg font-semibold text-viking-navy mb-1">{cat.name}</h3>
              <p className="text-sm text-gray-500">{cat.count} questions available</p>
              <div className="mt-4 flex items-center text-viking-blue font-medium">
                Start Quiz
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          ))}
        </div>
        
        {/* Recent Stats */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-viking-navy mb-4">Your Progress</h3>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-viking-navy">45</p>
              <p className="text-sm text-gray-500">Quizzes Taken</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">78%</p>
              <p className="text-sm text-gray-500">Avg Score</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-viking-gold">12</p>
              <p className="text-sm text-gray-500">Wrong Answers</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-viking-blue">L2</p>
              <p className="text-sm text-gray-500">Current Level</p>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  // Result View
  if (quizState === 'result') {
    const correctCount = results.filter(r => r.isCorrect).length
    
    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn">
        <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
          <div className="w-20 h-20 rounded-full bg-viking-gold/20 flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-10 h-10 text-viking-gold" />
          </div>
          <h2 className="text-2xl font-bold text-viking-navy mb-2">Quiz Complete!</h2>
          <p className="text-gray-600 mb-6">Great job completing the quiz</p>
          
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-3xl font-bold text-viking-navy">{avgScore}%</p>
              <p className="text-sm text-gray-500">Average Score</p>
            </div>
            <div className="bg-green-50 rounded-xl p-4">
              <p className="text-3xl font-bold text-green-600">{correctCount}</p>
              <p className="text-sm text-gray-500">Correct</p>
            </div>
            <div className="bg-red-50 rounded-xl p-4">
              <p className="text-3xl font-bold text-red-500">{results.length - correctCount}</p>
              <p className="text-sm text-gray-500">Incorrect</p>
            </div>
          </div>
          
          {/* Question Summary */}
          <div className="text-left mb-6">
            <h3 className="font-semibold text-viking-navy mb-3">Question Summary</h3>
            <div className="space-y-2">
              {results.map((result, index) => (
                <div key={result.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  {result.isCorrect ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                  <span className="flex-1 text-sm text-gray-700">Question {index + 1}</span>
                  <span className={clsx('font-medium', {
                    'text-green-600': result.score! >= 80,
                    'text-viking-gold': result.score! >= 60 && result.score! < 80,
                    'text-red-500': result.score! < 60,
                  })}>
                    {result.score}%
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex gap-4">
            <button onClick={handleRestart} className="flex-1 btn btn-outline">
              <RotateCcw className="w-4 h-4 mr-2" />
              Try Again
            </button>
            <button onClick={handleRestart} className="flex-1 btn btn-primary">
              New Quiz
            </button>
          </div>
        </div>
      </div>
    )
  }
  
  // Playing View
  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
      {/* Progress Bar */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">
            Question {currentIndex + 1} of {currentQuiz.length}
          </span>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            <span>~2 min</span>
          </div>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-viking-blue rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / currentQuiz.length) * 100}%` }}
          />
        </div>
      </div>
      
      {/* Question Card */}
      {currentQuestion && (
        <div className="bg-white rounded-xl p-8 shadow-sm">
          {/* Question Type Badge */}
          <div className="flex items-center gap-2 mb-4">
            <span className={clsx('badge', {
              'badge-easy': currentQuestion.difficulty === 'L1',
              'bg-blue-100 text-blue-800': currentQuestion.difficulty === 'L2',
              'badge-medium': currentQuestion.difficulty === 'L3',
              'badge-hard': currentQuestion.difficulty === 'L4',
            })}>
              {currentQuestion.difficulty}
            </span>
            <span className="text-sm text-gray-500 capitalize">
              {currentQuestion.type.replace('_', ' ')}
            </span>
          </div>
          
          {/* Question Text */}
          <h2 className="text-xl font-semibold text-viking-navy mb-6">
            {currentQuestion.question}
          </h2>
          
          {/* Answer Options */}
          {(currentQuestion.type === 'single_choice' || currentQuestion.type === 'scenario') && (
            <div className="space-y-3">
              {currentQuestion.options?.map((option) => (
                <button
                  key={option.key}
                  onClick={() => !submitted && setSelectedAnswer(option.key)}
                  disabled={submitted}
                  className={clsx(
                    'w-full text-left p-4 rounded-xl border-2 transition-all',
                    {
                      'border-gray-200 hover:border-viking-blue': !submitted && selectedAnswer !== option.key,
                      'border-viking-blue bg-viking-blue/5': !submitted && selectedAnswer === option.key,
                      'border-green-500 bg-green-50': submitted && option.is_correct,
                      'border-red-500 bg-red-50': submitted && selectedAnswer === option.key && !option.is_correct,
                      'border-gray-200 opacity-50': submitted && selectedAnswer !== option.key && !option.is_correct,
                    }
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className={clsx(
                      'w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm',
                      {
                        'bg-gray-100 text-gray-600': !submitted,
                        'bg-green-500 text-white': submitted && option.is_correct,
                        'bg-red-500 text-white': submitted && selectedAnswer === option.key && !option.is_correct,
                      }
                    )}>
                      {option.key}
                    </span>
                    <span className="flex-1">{option.text}</span>
                    {submitted && option.is_correct && <CheckCircle className="w-5 h-5 text-green-500" />}
                    {submitted && selectedAnswer === option.key && !option.is_correct && <XCircle className="w-5 h-5 text-red-500" />}
                  </div>
                </button>
              ))}
            </div>
          )}
          
          {/* True/False */}
          {currentQuestion.type === 'true_false' && (
            <div className="grid grid-cols-2 gap-4">
              {['true', 'false'].map((val) => (
                <button
                  key={val}
                  onClick={() => !submitted && setSelectedAnswer(val)}
                  disabled={submitted}
                  className={clsx(
                    'p-6 rounded-xl border-2 font-semibold text-lg transition-all',
                    {
                      'border-gray-200 hover:border-viking-blue': !submitted && selectedAnswer !== val,
                      'border-viking-blue bg-viking-blue/5': !submitted && selectedAnswer === val,
                      'border-green-500 bg-green-50': submitted && ((val === 'true') === currentQuestion.correct_answer),
                      'border-red-500 bg-red-50': submitted && selectedAnswer === val && ((val === 'true') !== currentQuestion.correct_answer),
                    }
                  )}
                >
                  {val === 'true' ? 'True ✓' : 'False ✗'}
                </button>
              ))}
            </div>
          )}
          
          {/* Open Ended */}
          {currentQuestion.type === 'open_ended' && (
            <div>
              <textarea
                value={openAnswer}
                onChange={(e) => setOpenAnswer(e.target.value)}
                disabled={submitted}
                placeholder="Type your answer here..."
                className="w-full h-40 p-4 border-2 border-gray-200 rounded-xl focus:border-viking-blue focus:ring-0 resize-none"
              />
              {currentQuestion.expected_elements && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-600 mb-2">Expected elements:</p>
                  <ul className="text-sm text-gray-500 space-y-1">
                    {currentQuestion.expected_elements.map((el, i) => (
                      <li key={i}>• {el}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
          
          {/* Feedback */}
          {submitted && (
            <div className={clsx('mt-6 p-4 rounded-xl', {
              'bg-green-50 border border-green-200': lastAttempt?.isCorrect,
              'bg-red-50 border border-red-200': !lastAttempt?.isCorrect,
            })}>
              <div className="flex items-center gap-2 mb-2">
                {lastAttempt?.isCorrect ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-green-700">Correct!</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-red-600" />
                    <span className="font-semibold text-red-700">Incorrect</span>
                  </>
                )}
                <span className="ml-auto font-bold">{lastAttempt?.score}%</span>
              </div>
              <p className="text-sm text-gray-700">{currentQuestion.explanation}</p>
              {lastAttempt?.aiFeedback && (
                <p className="text-sm text-gray-600 mt-2 italic">{lastAttempt.aiFeedback}</p>
              )}
            </div>
          )}
          
          {/* Actions */}
          <div className="mt-8 flex justify-end gap-4">
            {!submitted ? (
              <button
                onClick={handleSubmit}
                disabled={!selectedAnswer && !openAnswer}
                className="btn btn-primary px-8 disabled:opacity-50"
              >
                Submit Answer
              </button>
            ) : (
              <button onClick={handleNext} className="btn btn-primary px-8">
                {currentIndex === currentQuiz.length - 1 ? 'See Results' : 'Next Question'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

