'use client';
import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Target, 
  BookOpen, 
  Settings, 
  Plus,
  ChevronDown,
  Zap
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    name: 'Goals',
    href: '/goals',
    icon: Target,
  },
  {
    name: 'Skills',
    href: '/skills',
    icon: BookOpen,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const { theme } = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <motion.div 
      className={`border-r flex flex-col transition-colors duration-300 ${
        theme === 'light' 
          ? 'bg-white border-gray-200' 
          : 'bg-[#111111] border-white/[0.08]'
      }`}
      initial={{ width: 256 }}
      animate={{ width: isCollapsed ? 80 : 256 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
    >
      {/* Logo & Brand */}
      <div className={`p-6 border-b transition-colors ${
        theme === 'light' ? 'border-gray-200' : 'border-white/[0.08]'
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
            <Zap size={16} className="text-white" />
          </div>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h1 className={`font-semibold transition-colors ${
                theme === 'light' ? 'text-gray-900' : 'text-white'
              }`}>SkillPath</h1>
              <p className={`text-xs transition-colors ${
                theme === 'light' ? 'text-gray-500' : 'text-gray-400'
              }`}>Learning Tracker</p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      {!isCollapsed && (
        <div className={`p-4 border-b transition-colors ${
          theme === 'light' ? 'border-gray-200' : 'border-white/[0.08]'
        }`}>
          <button 
            onClick={() => router.push('/goals/new')}
            className="w-full flex items-center gap-3 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium text-white transition-colors"
          >
            <Plus size={16} />
            New Goal
          </button>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== '/' && pathname.startsWith(item.href));
          
          return (
            <motion.button
              key={item.name}
              onClick={() => router.push(item.href)}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                ${isActive 
                  ? 'bg-blue-600/10 text-blue-500 border border-blue-600/20' 
                  : (theme === 'light' 
                    ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100' 
                    : 'text-gray-400 hover:text-white hover:bg-white/[0.05]')
                }
              `}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <item.icon size={18} />
              {!isCollapsed && (
                <span>{item.name}</span>
              )}
              {isActive && !isCollapsed && (
                <motion.div
                  className="ml-auto w-1.5 h-1.5 bg-blue-500 rounded-full"
                  layoutId="activeIndicator"
                />
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* User Section */}
      <div className={`p-4 border-t transition-colors ${
        theme === 'light' ? 'border-gray-200' : 'border-white/[0.08]'
      }`}>
        {user && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-xs font-semibold text-white">
                {user.email?.[0]?.toUpperCase() || 'U'}
              </span>
            </div>
            {!isCollapsed && (
              <motion.div
                className="flex-1 min-w-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <p className={`text-sm font-medium truncate transition-colors ${
                  theme === 'light' ? 'text-gray-900' : 'text-white'
                }`}>
                  {user.user_metadata?.name || 'User'}
                </p>
                <p className={`text-xs truncate transition-colors ${
                  theme === 'light' ? 'text-gray-500' : 'text-gray-400'
                }`}>
                  {user.email}
                </p>
              </motion.div>
            )}
            <button
              onClick={() => router.push('/settings')}
              className={`transition-colors ${
                theme === 'light' 
                  ? 'text-gray-500 hover:text-gray-700' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Settings size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Collapse Toggle */}
      <div className={`p-4 border-t transition-colors ${
        theme === 'light' ? 'border-gray-200' : 'border-white/[0.08]'
      }`}>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`w-full flex items-center justify-center p-2 rounded-lg transition-colors ${
            theme === 'light'
              ? 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              : 'text-gray-400 hover:text-white hover:bg-white/[0.05]'
          }`}
        >
          <motion.div
            animate={{ rotate: isCollapsed ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown size={16} />
          </motion.div>
        </button>
      </div>
    </motion.div>
  );
}