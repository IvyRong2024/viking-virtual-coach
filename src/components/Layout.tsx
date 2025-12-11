import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { 
  Ship, 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  MessageSquare,
  Target,
  Brain,
  LogOut,
  ChevronRight,
  Bell
} from 'lucide-react'
import clsx from 'clsx'

interface LayoutProps {
  role: 'mentor' | 'bc'
}

const mentorNavItems = [
  { path: '/mentor', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { path: '/mentor/quiz-bank', label: 'Quiz Bank', icon: BookOpen },
  { path: '/mentor/performance', label: 'Performance', icon: Users },
  { path: '/mentor/roleplay', label: 'Role Play', icon: MessageSquare },
]

const bcNavItems = [
  { path: '/bc', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { path: '/bc/quiz', label: 'Quiz Center', icon: Brain },
  { path: '/bc/skills', label: 'Skill Matrix', icon: Target },
  { path: '/bc/roleplay', label: 'Role Play', icon: MessageSquare },
  { path: '/bc/knowledge', label: 'Knowledge Book', icon: BookOpen },
]

export default function Layout({ role }: LayoutProps) {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const navItems = role === 'mentor' ? mentorNavItems : bcNavItems
  
  const handleLogout = () => {
    logout()
    navigate('/login')
  }
  
  return (
    <div className="min-h-screen bg-viking-light flex">
      {/* Sidebar */}
      <aside className="w-64 bg-viking-navy text-white flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <Ship className="w-8 h-8 text-viking-gold" />
            <div>
              <h1 className="font-display font-bold text-lg">Viking Coach</h1>
              <p className="text-xs text-white/60 capitalize">{role} Portal</p>
            </div>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.end}
                  className={({ isActive }) => clsx(
                    'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                    isActive 
                      ? 'bg-white/10 text-white' 
                      : 'text-white/70 hover:bg-white/5 hover:text-white'
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                  <ChevronRight className="w-4 h-4 ml-auto opacity-50" />
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        
        {/* User Section */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-viking-gold flex items-center justify-center text-viking-navy font-bold">
              {user?.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{user?.name}</p>
              <p className="text-xs text-white/60 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-viking-navy">
              {role === 'mentor' ? 'Training Management' : 'My Learning'}
            </h2>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-500 hover:text-viking-navy hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-viking-red rounded-full" />
            </button>
          </div>
        </header>
        
        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

