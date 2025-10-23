'use client';
import { useState } from 'react';
import Modal from './ui/Modal';
import Button from './ui/Button';
import { useGoals } from '@/hooks/useGoals';

export default function CreateSkillModal({ isOpen, onClose, onSkillCreated }) {
  const { goals } = useGoals();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    goal_id: '',
    target_date: '',
    estimated_duration_days: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const skillData = {
        ...formData,
        goal_id: formData.goal_id || null,
        target_date: formData.target_date || null,
        estimated_duration_days: formData.estimated_duration_days ? parseInt(formData.estimated_duration_days) : null
      };

      await onSkillCreated(skillData);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        goal_id: '',
        target_date: '',
        estimated_duration_days: ''
      });
      
      onClose();
    } catch (error) {
      console.error('Error creating skill:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Skill" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
            Skill Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="e.g., Advanced React Patterns"
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            placeholder="Describe what you'll learn and practice..."
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        {/* Goal Association */}
        <div>
          <label htmlFor="goal_id" className="block text-sm font-medium text-gray-300 mb-1">
            Associate with Goal (Optional)
          </label>
          <select
            id="goal_id"
            name="goal_id"
            value={formData.goal_id}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">No goal selected</option>
            {goals.map(goal => (
              <option key={goal.id} value={goal.id}>
                {goal.title}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Target Date */}
          <div>
            <label htmlFor="target_date" className="block text-sm font-medium text-gray-300 mb-1">
              Target Date
            </label>
            <input
              type="date"
              id="target_date"
              name="target_date"
              value={formData.target_date}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Duration */}
          <div>
            <label htmlFor="estimated_duration_days" className="block text-sm font-medium text-gray-300 mb-1">
              Duration (days)
            </label>
            <input
              type="number"
              id="estimated_duration_days"
              name="estimated_duration_days"
              value={formData.estimated_duration_days}
              onChange={handleChange}
              min="1"
              placeholder="14"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
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
            {isSubmitting ? 'Creating...' : 'Create Skill'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}