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
    <div className={`flex h-screen overflow-hidden transition-colors duration-200 ${
      theme === 'light' ? 'bg-white' : 'bg-[#0a0a0a]'
    }`}>
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <TopNavbar />
        
        {/* Page Content */}
        <main className={`flex-1 overflow-y-auto transition-colors duration-200 ${
          theme === 'light' ? 'bg-neutral-50' : 'bg-[#0a0a0a]'
        }`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}