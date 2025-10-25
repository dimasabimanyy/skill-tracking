'use client';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Sun, Moon, Zap, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';

export default function TopNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const showBackButton = pathname !== '/';

  return (
    <motion.header 
      className={`backdrop-blur-sm border-b transition-colors duration-200 ${
        theme === 'light' 
          ? 'bg-white/80 border-neutral-200/60' 
          : 'bg-neutral-950/80 border-neutral-800/60'
      }`}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <div className="max-w-4xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left side */}
          <div className="flex items-center gap-4">
            {showBackButton && (
              <motion.button
                onClick={() => router.back()}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  theme === 'light'
                    ? 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <ArrowLeft size={14} />
                Back
              </motion.button>
            )}
            
            {/* Brand */}
            <div className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center ${
                theme === 'light' ? 'bg-indigo-100' : 'bg-indigo-900/50'
              }`}>
                <Zap size={14} className="text-indigo-600" />
              </div>
              <span className={`font-semibold text-lg ${
                theme === 'light' ? 'text-neutral-900' : 'text-white'
              }`}>
                SkillPath
              </span>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <motion.button
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-colors ${
                theme === 'light'
                  ? 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            </motion.button>

            {/* User Avatar */}
            {user && (
              <motion.div 
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  theme === 'light' 
                    ? 'bg-neutral-100 text-neutral-700' 
                    : 'bg-neutral-800 text-neutral-300'
                }`}
                whileHover={{ scale: 1.05 }}
              >
                {user.email?.[0]?.toUpperCase() || 'U'}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
}