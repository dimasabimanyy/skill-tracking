'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import Button from './ui/Button';
import Input from './ui/Input';
import Textarea from './ui/Textarea';

export default function CreateSkillModal({ isOpen, onClose, onSkillCreated, goalId }) {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    estimated_duration_days: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    setIsLoading(true);
    try {
      await onSkillCreated({
        ...formData,
        goal_id: goalId,
        order_in_roadmap: 999, // Will be set properly by parent
        estimated_duration_days: formData.estimated_duration_days ? parseInt(formData.estimated_duration_days) : null
      });
      
      // Reset form and close modal
      setFormData({
        title: '',
        description: '',
        estimated_duration_days: ''
      });
      onClose();
    } catch (error) {
      console.error('Error creating skill:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (isLoading) return;
    setFormData({
      title: '',
      description: '',
      estimated_duration_days: ''
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            className={`fixed inset-0 transition-colors ${
              theme === 'light' ? 'bg-black/20' : 'bg-black/40'
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />
          
          {/* Modal */}
          <div className="flex min-h-full items-center justify-center p-4">
            <motion.div
              className={`relative w-full max-w-md rounded-xl border shadow-xl ${
                theme === 'light'
                  ? 'bg-white border-neutral-200'
                  : 'bg-neutral-900 border-neutral-700'
              }`}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 pb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    theme === 'light' ? 'bg-indigo-50' : 'bg-indigo-900/30'
                  }`}>
                    <BookOpen className="text-indigo-500" size={20} />
                  </div>
                  <div>
                    <h2 className={`text-lg font-semibold ${
                      theme === 'light' ? 'text-neutral-900' : 'text-white'
                    }`}>
                      Add New Skill
                    </h2>
                    <p className={`text-sm ${
                      theme === 'light' ? 'text-neutral-600' : 'text-neutral-400'
                    }`}>
                      Add a skill to your learning path
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  disabled={isLoading}
                  className={`p-2 rounded-full transition-colors ${
                    theme === 'light'
                      ? 'hover:bg-neutral-100 text-neutral-500 hover:text-neutral-700'
                      : 'hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  <X size={16} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 pt-0 space-y-4">
                {/* Title */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    theme === 'light' ? 'text-neutral-700' : 'text-neutral-300'
                  }`}>
                    Skill Name *
                  </label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., React Hooks, Database Design, Machine Learning"
                    disabled={isLoading}
                    autoFocus
                  />
                </div>

                {/* Description */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    theme === 'light' ? 'text-neutral-700' : 'text-neutral-300'
                  }`}>
                    Description
                  </label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="What will you learn and how will it help you achieve your goal?"
                    rows={3}
                    disabled={isLoading}
                  />
                </div>

                {/* Duration */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    theme === 'light' ? 'text-neutral-700' : 'text-neutral-300'
                  }`}>
                    Estimated Duration (days)
                  </label>
                  <Input
                    type="number"
                    value={formData.estimated_duration_days}
                    onChange={(e) => setFormData(prev => ({ ...prev, estimated_duration_days: e.target.value }))}
                    placeholder="30"
                    min="1"
                    disabled={isLoading}
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleClose}
                    disabled={isLoading}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={!formData.title.trim() || isLoading}
                    loading={isLoading}
                    className="flex-1"
                  >
                    Add Skill
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}