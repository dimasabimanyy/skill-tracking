'use client';
import { useEffect, Fragment } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useTheme } from '@/hooks/useTheme';

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 }
};

const modalVariants = {
  hidden: { 
    opacity: 0, 
    scale: 0.95, 
    y: 10 
  },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: {
      type: "spring",
      duration: 0.3,
      bounce: 0.1
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95, 
    y: 10,
    transition: {
      duration: 0.2,
      ease: "easeInOut"
    }
  }
};

const sizeClasses = {
  sm: 'max-w-md',
  md: 'max-w-lg', 
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-7xl'
};

export default function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md',
  showCloseButton = true,
  closeOnBackdrop = true,
  closeOnEscape = true 
}) {
  const { theme } = useTheme();
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && closeOnEscape && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, closeOnEscape]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence mode="wait">
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeOnBackdrop ? onClose : undefined}
          />
          
          {/* Modal Container */}
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`
              relative rounded-2xl border w-full ${sizeClasses[size]}
              max-h-[90vh] overflow-hidden flex flex-col
              ${theme === 'light' 
                ? 'bg-white border-gray-200 shadow-2xl shadow-gray-500/20' 
                : 'bg-[#111111] border-white/[0.08] shadow-2xl shadow-black/40'}
            `}
          >
            {/* Header */}
            {(title || showCloseButton) && (
              <div className={`flex items-center justify-between p-6 border-b ${
                theme === 'light' ? 'border-gray-200' : 'border-white/[0.08]'
              }`}>
                {title && (
                  <h2 className={`text-xl font-semibold ${
                    theme === 'light' ? 'text-gray-900' : 'text-white'
                  }`}>{title}</h2>
                )}
                {showCloseButton && (
                  <motion.button
                    onClick={onClose}
                    className={`transition-colors p-1.5 rounded-lg ${
                      theme === 'light' 
                        ? 'text-gray-500 hover:text-gray-700 hover:bg-gray-100' 
                        : 'text-gray-400 hover:text-white hover:bg-white/[0.05]'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <X size={20} />
                  </motion.button>
                )}
              </div>
            )}
            
            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}