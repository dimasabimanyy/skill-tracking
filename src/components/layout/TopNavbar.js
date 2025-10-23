'use client';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronRight, Search, Bell, Command, Sun, Moon } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import AuthStatus from '@/components/AuthStatus';

function BreadcrumbItem({ children, isLast = false, theme }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`text-sm ${
        isLast 
          ? (theme === 'light' ? 'text-gray-900 font-medium' : 'text-white font-medium')
          : (theme === 'light' ? 'text-gray-500' : 'text-gray-400')
      }`}>
        {children}
      </span>
      {!isLast && <ChevronRight size={14} className={theme === 'light' ? 'text-gray-400' : 'text-gray-600'} />}
    </div>
  );
}

function getBreadcrumbs(pathname) {
  const segments = pathname.split('/').filter(Boolean);
  
  if (pathname === '/') {
    return [{ label: 'Dashboard', isLast: true }];
  }
  
  const breadcrumbs = [{ label: 'Dashboard', isLast: false }];
  
  if (segments[0] === 'goals') {
    breadcrumbs.push({ label: 'Goals', isLast: segments.length === 1 });
    if (segments[1] && segments[1] !== 'new') {
      breadcrumbs.push({ label: 'Goal Details', isLast: true });
    }
    if (segments[1] === 'new') {
      breadcrumbs.push({ label: 'New Goal', isLast: true });
    }
  }
  
  if (segments[0] === 'skills') {
    breadcrumbs.push({ label: 'Skills', isLast: segments.length === 1 });
    if (segments[1]) {
      breadcrumbs.push({ label: 'Skill Details', isLast: true });
    }
  }
  
  if (segments[0] === 'topics') {
    breadcrumbs.push({ label: 'Topics', isLast: segments.length === 1 });
    if (segments[1]) {
      breadcrumbs.push({ label: 'Topic Details', isLast: true });
    }
  }
  
  return breadcrumbs;
}

export default function TopNavbar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const breadcrumbs = getBreadcrumbs(pathname);

  return (
    <motion.header 
      className={`backdrop-blur-xl border-b px-6 py-4 transition-colors duration-300 ${
        theme === 'light' 
          ? 'bg-white/80 border-gray-200' 
          : 'bg-[#111111]/80 border-white/[0.08]'
      }`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center justify-between">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2">
          {breadcrumbs.map((crumb, index) => (
            <BreadcrumbItem key={index} isLast={crumb.isLast} theme={theme}>
              {crumb.label}
            </BreadcrumbItem>
          ))}
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <button className={`flex items-center gap-2 px-3 py-1.5 border rounded-lg text-sm transition-colors ${
            theme === 'light'
              ? 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-500'
              : 'bg-white/[0.05] hover:bg-white/[0.08] border-white/[0.08] text-gray-400'
          }`}>
            <Search size={14} />
            <span className="hidden sm:inline">Search...</span>
            <div className="hidden sm:flex items-center gap-1 ml-2">
              <kbd className={`px-1.5 py-0.5 rounded text-xs ${
                theme === 'light' ? 'bg-gray-200' : 'bg-white/[0.08]'
              }`}>⌘</kbd>
              <kbd className={`px-1.5 py-0.5 rounded text-xs ${
                theme === 'light' ? 'bg-gray-200' : 'bg-white/[0.08]'
              }`}>K</kbd>
            </div>
          </button>

          {/* Theme Toggle */}
          <motion.button
            onClick={toggleTheme}
            className={`p-2 rounded-lg transition-colors ${
              theme === 'light'
                ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                : 'text-gray-400 hover:text-white hover:bg-white/[0.05]'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </motion.button>

          {/* Notifications */}
          <button className={`relative p-2 rounded-lg transition-colors ${
            theme === 'light'
              ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              : 'text-gray-400 hover:text-white hover:bg-white/[0.05]'
          }`}>
            <Bell size={18} />
            {/* Notification dot */}
            <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full"></div>
          </button>

          {/* Auth Status */}
          <AuthStatus />
        </div>
      </div>
    </motion.header>
  );
}