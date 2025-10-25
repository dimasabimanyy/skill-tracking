'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/hooks/useTheme';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';

export default function AppLayout({ children }) {
  const pathname = usePathname();
  const { theme } = useTheme();
  
  // Check if we're on auth pages (no sidebar/navbar)
  const isAuthPage = pathname?.startsWith('/auth');

  if (isAuthPage) {
    return (
      <main className={`min-h-screen transition-colors duration-200 ${
        theme === 'light' ? 'bg-white' : 'bg-[#0a0a0a]'
      }`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      theme === 'light' 
        ? 'bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/20' 
        : 'bg-gradient-to-br from-[#0a0a0a] via-slate-950/50 to-indigo-950/10'
    }`}>
      {/* Top Navigation */}
      <TopNavbar />
      
      {/* Main Content - Centered and Focused */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}