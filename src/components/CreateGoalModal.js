'use client';
import { useState } from 'react';
import { useTheme } from '@/hooks/useTheme';
import Modal from './ui/Modal';
import Button from './ui/Button';
import { Target } from 'lucide-react';

export default function CreateGoalModal({ isOpen, onClose, onGoalCreated }) {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    target_date: '',
    estimated_duration_weeks: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const goalData = {
        ...formData,
        target_date: formData.target_date || null,
        estimated_duration_weeks: formData.estimated_duration_weeks ? parseInt(formData.estimated_duration_weeks) : null
      };

      await onGoalCreated(goalData);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        target_date: '',
        estimated_duration_weeks: ''
      });
      
      onClose();
    } catch (error) {
      console.error('Error creating goal:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Goal" size="md">
      <div className="mb-4">
        <div className={`flex items-center gap-2 mb-2 ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}>
          <Target size={16} />
          <span className="text-sm font-medium">Define your learning objective</span>
        </div>
        <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
          Template skills will be automatically generated based on your goal title to help you get started.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label htmlFor="title" className={`block text-sm font-medium mb-1 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
            Goal Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="e.g., Senior Software Engineer Role, Full Stack Developer, Frontend Developer"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
              theme === 'light'
                ? 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                : 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
            }`}
          />
          <p className={`text-xs mt-1 ${theme === 'light' ? 'text-gray-500' : 'text-gray-500'}`}>
            💡 Try keywords like "Senior Software Engineer", "Full Stack Developer", or "Frontend Developer" for curated skill templates
          </p>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className={`block text-sm font-medium mb-1 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            placeholder="Describe what you want to achieve and why it matters to you..."
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-colors ${
              theme === 'light'
                ? 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                : 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
            }`}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Target Date */}
          <div>
            <label htmlFor="target_date" className={`block text-sm font-medium mb-1 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
              Target Date
            </label>
            <input
              type="date"
              id="target_date"
              name="target_date"
              value={formData.target_date}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                theme === 'light'
                  ? 'bg-white border-gray-300 text-gray-900'
                  : 'bg-gray-700 border-gray-600 text-white'
              }`}
            />
          </div>

          {/* Duration */}
          <div>
            <label htmlFor="estimated_duration_weeks" className={`block text-sm font-medium mb-1 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
              Duration (weeks)
            </label>
            <input
              type="number"
              id="estimated_duration_weeks"
              name="estimated_duration_weeks"
              value={formData.estimated_duration_weeks}
              onChange={handleChange}
              min="1"
              placeholder="12"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                theme === 'light'
                  ? 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  : 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
              }`}
            />
          </div>
        </div>

        {/* Preview Section */}
        {formData.title && (
          <div className={`rounded-lg p-4 border transition-colors ${
            theme === 'light'
              ? 'bg-gray-50 border-gray-200'
              : 'bg-gray-700/50 border-gray-600'
          }`}>
            <h4 className={`text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>What happens next:</h4>
            <ul className={`text-xs space-y-1 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
              <li>• Your goal will be created</li>
              <li>• Template skills will be generated automatically</li>
              <li>• You can customize or add more skills later</li>
              <li>• Track progress through your learning roadmap</li>
            </ul>
          </div>
        )}

        {/* Actions */}
        <div className={`flex justify-end gap-3 pt-4 border-t transition-colors ${
          theme === 'light' ? 'border-gray-200' : 'border-gray-700'
        }`}>
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || !formData.title.trim()}
          >
            {isSubmitting ? 'Creating Goal...' : 'Create Goal & Generate Skills'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}