import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './stores/authStore'
import LoginPage from './pages/LoginPage'
import MentorDashboard from './pages/mentor/MentorDashboard'
import MentorQuizBank from './pages/mentor/MentorQuizBank'
import MentorPerformance from './pages/mentor/MentorPerformance'
import MentorRolePlay from './pages/mentor/MentorRolePlay'
import BCDashboard from './pages/bc/BCDashboard'
import BCQuizCenter from './pages/bc/BCQuizCenter'
import BCSkillMatrix from './pages/bc/BCSkillMatrix'
import BCRolePlay from './pages/bc/BCRolePlay'
import BCKnowledgeBook from './pages/bc/BCKnowledgeBook'
import Layout from './components/Layout'

function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles: string[] }) {
  const { user, isAuthenticated } = useAuthStore()
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  if (user && !allowedRoles.includes(user.role)) {
    return <Navigate to={user.role === 'mentor' ? '/mentor' : '/bc'} replace />
  }
  
  return <>{children}</>
}

function App() {
  const { isAuthenticated, user } = useAuthStore()

  return (
    <Routes>
      <Route path="/login" element={
        isAuthenticated ? (
          <Navigate to={user?.role === 'mentor' ? '/mentor' : '/bc'} replace />
        ) : (
          <LoginPage />
        )
      } />
      
      {/* Mentor Routes */}
      <Route path="/mentor" element={
        <ProtectedRoute allowedRoles={['mentor']}>
          <Layout role="mentor" />
        </ProtectedRoute>
      }>
        <Route index element={<MentorDashboard />} />
        <Route path="quiz-bank" element={<MentorQuizBank />} />
        <Route path="performance" element={<MentorPerformance />} />
        <Route path="roleplay" element={<MentorRolePlay />} />
      </Route>
      
      {/* BC Routes */}
      <Route path="/bc" element={
        <ProtectedRoute allowedRoles={['bc']}>
          <Layout role="bc" />
        </ProtectedRoute>
      }>
        <Route index element={<BCDashboard />} />
        <Route path="quiz" element={<BCQuizCenter />} />
        <Route path="skills" element={<BCSkillMatrix />} />
        <Route path="roleplay" element={<BCRolePlay />} />
        <Route path="knowledge" element={<BCKnowledgeBook />} />
      </Route>
      
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App

