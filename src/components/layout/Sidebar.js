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
      className={`border-r flex flex-col transition-colors duration-200 ${
        theme === 'light' 
          ? 'bg-white border-neutral-200' 
          : 'bg-neutral-950 border-neutral-800'
      }`}
      initial={{ width: 240 }}
      animate={{ width: isCollapsed ? 64 : 240 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      {/* Logo & Brand */}
      <div className={`p-4 border-b transition-colors ${
        theme === 'light' ? 'border-neutral-200' : 'border-neutral-800'
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-md bg-neutral-900 flex items-center justify-center">
            <Zap size={14} className="text-white" />
          </div>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h1 className={`font-semibold text-sm transition-colors ${
                theme === 'light' ? 'text-neutral-900' : 'text-white'
              }`}>SkillPath</h1>
              <p className={`text-xs transition-colors ${
                theme === 'light' ? 'text-neutral-500' : 'text-neutral-400'
              }`}>Learning Tracker</p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      {!isCollapsed && (
        <div className={`px-4 py-3 border-b transition-colors ${
          theme === 'light' ? 'border-neutral-200' : 'border-neutral-800'
        }`}>
          <button 
            onClick={() => router.push('/goals/new')}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              theme === 'light'
                ? 'bg-neutral-900 text-white hover:bg-neutral-800'
                : 'bg-white text-neutral-900 hover:bg-neutral-100'
            }`}
          >
            <Plus size={14} />
            New Goal
          </button>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-4 py-3 space-y-0.5">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== '/' && pathname.startsWith(item.href));
          
          return (
            <motion.button
              key={item.name}
              onClick={() => router.push(item.href)}
              className={`
                w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200
                ${isActive 
                  ? (theme === 'light'
                    ? 'bg-neutral-100 text-neutral-900'
                    : 'bg-neutral-800 text-white')
                  : (theme === 'light' 
                    ? 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50' 
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50')
                }
              `}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <item.icon size={16} />
              {!isCollapsed && (
                <span>{item.name}</span>
              )}
              {isActive && !isCollapsed && (
                <motion.div
                  className={`ml-auto w-1 h-1 rounded-full ${
                    theme === 'light' ? 'bg-neutral-900' : 'bg-white'
                  }`}
                  layoutId="activeIndicator"
                />
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* User Section */}
      <div className={`p-4 border-t transition-colors ${
        theme === 'light' ? 'border-neutral-200' : 'border-neutral-800'
      }`}>
        {user && (
          <div className="flex items-center gap-3">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center ${
              theme === 'light' ? 'bg-neutral-200' : 'bg-neutral-700'
            }`}>
              <span className={`text-xs font-semibold ${
                theme === 'light' ? 'text-neutral-700' : 'text-neutral-300'
              }`}>
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
                  theme === 'light' ? 'text-neutral-900' : 'text-white'
                }`}>
                  {user.user_metadata?.name || 'User'}
                </p>
                <p className={`text-xs truncate transition-colors ${
                  theme === 'light' ? 'text-neutral-500' : 'text-neutral-400'
                }`}>
                  {user.email}
                </p>
              </motion.div>
            )}
            <button
              onClick={() => router.push('/settings')}
              className={`transition-colors ${
                theme === 'light' 
                  ? 'text-neutral-500 hover:text-neutral-700' 
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Settings size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Collapse Toggle */}
      <div className={`px-4 py-3 border-t transition-colors ${
        theme === 'light' ? 'border-neutral-200' : 'border-neutral-800'
      }`}>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`w-full flex items-center justify-center p-1.5 rounded-md transition-colors ${
            theme === 'light'
              ? 'text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
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