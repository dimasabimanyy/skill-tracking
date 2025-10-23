'use client';
import { useState } from 'react';
import Modal from './ui/Modal';
import Button from './ui/Button';
import { BookOpen } from 'lucide-react';

export default function CreateTopicModal({ isOpen, onClose, onTopicCreated }) {
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onTopicCreated(formData);
      
      // Reset form
      setFormData({
        title: '',
        description: ''
      });
      
      onClose();
    } catch (error) {
      console.error('Error creating topic:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Topic" size="md">
      <div className="mb-4">
        <div className="flex items-center gap-2 text-blue-400 mb-2">
          <BookOpen size={16} />
          <span className="text-sm font-medium">Add a learning topic</span>
        </div>
        <p className="text-sm text-gray-400">
          Break down your skill into specific topics or modules to track your learning progress.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
            Topic Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="e.g., useState Hook, useEffect Basics, Custom Hooks"
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
            Description (Optional)
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            placeholder="What will you learn in this topic? What are the key concepts?"
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        {/* Preview Section */}
        {formData.title && (
          <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
            <h4 className="text-sm font-medium text-gray-300 mb-2">What happens next:</h4>
            <ul className="text-xs text-gray-400 space-y-1">
              <li>• Topic will be added to your skill</li>
              <li>• You can add detailed notes to track your learning</li>
              <li>• Mark topic as complete when you finish it</li>
              <li>• Reorder topics to organize your learning path</li>
            </ul>
          </div>
        )}

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
            {isSubmitting ? 'Creating...' : 'Create Topic'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}