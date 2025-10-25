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
          ? (theme === 'light' ? 'text-neutral-900 font-medium' : 'text-white font-medium')
          : (theme === 'light' ? 'text-neutral-500' : 'text-neutral-400')
      }`}>
        {children}
      </span>
      {!isLast && <ChevronRight size={12} className={theme === 'light' ? 'text-neutral-400' : 'text-neutral-600'} />}
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
      className={`border-b px-6 py-3 transition-colors duration-200 ${
        theme === 'light' 
          ? 'bg-white border-neutral-200' 
          : 'bg-neutral-950 border-neutral-800'
      }`}
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
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
        <div className="flex items-center gap-3">
          {/* Search */}
          <button className={`flex items-center gap-2 px-3 py-1.5 border rounded-md text-sm transition-colors ${
            theme === 'light'
              ? 'bg-neutral-50 hover:bg-neutral-100 border-neutral-200 text-neutral-500'
              : 'bg-neutral-800/50 hover:bg-neutral-800 border-neutral-700 text-neutral-400'
          }`}>
            <Search size={13} />
            <span className="hidden sm:inline">Search...</span>
            <div className="hidden sm:flex items-center gap-1 ml-2">
              <kbd className={`px-1 py-0.5 rounded text-xs ${
                theme === 'light' ? 'bg-neutral-200' : 'bg-neutral-700'
              }`}>⌘</kbd>
              <kbd className={`px-1 py-0.5 rounded text-xs ${
                theme === 'light' ? 'bg-neutral-200' : 'bg-neutral-700'
              }`}>K</kbd>
            </div>
          </button>

          {/* Theme Toggle */}
          <motion.button
            onClick={toggleTheme}
            className={`p-1.5 rounded-md transition-colors ${
              theme === 'light'
                ? 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          </motion.button>

          {/* Notifications */}
          <button className={`relative p-1.5 rounded-md transition-colors ${
            theme === 'light'
              ? 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
          }`}>
            <Bell size={16} />
            {/* Notification dot */}
            <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
          </button>

          {/* Auth Status */}
          <AuthStatus />
        </div>
      </div>
    </motion.header>
  );
}