'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, MessageSquare } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import Button from './ui/Button';
import Input from './ui/Input';
import Textarea from './ui/Textarea';

const CONTENT_TYPES = [
  {
    id: 'text',
    label: 'Text Block',
    description: 'Add rich text content with formatting',
    icon: FileText
  },
  {
    id: 'topic',
    label: 'Topic',
    description: 'Create a topic to explore in detail',
    icon: MessageSquare
  }
];

export default function CreateContentModal({ isOpen, onClose, onContentCreated, skillId }) {
  const { theme } = useTheme();
  const [selectedType, setSelectedType] = useState('text');
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    setIsLoading(true);
    try {
      await onContentCreated({
        type: selectedType,
        title: formData.title,
        content: formData.content
      });
      
      // Reset form and close modal
      setFormData({ title: '', content: '' });
      setSelectedType('text');
      onClose();
    } catch (error) {
      console.error('Error creating content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (isLoading) return;
    setFormData({ title: '', content: '' });
    setSelectedType('text');
    onClose();
  };

  const selectedTypeInfo = CONTENT_TYPES.find(type => type.id === selectedType);

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
              className={`relative w-full max-w-lg rounded-xl border shadow-xl ${
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
                    {selectedTypeInfo && <selectedTypeInfo.icon className="text-indigo-500" size={20} />}
                  </div>
                  <div>
                    <h2 className={`text-lg font-semibold ${
                      theme === 'light' ? 'text-neutral-900' : 'text-white'
                    }`}>
                      Add Content Block
                    </h2>
                    <p className={`text-sm ${
                      theme === 'light' ? 'text-neutral-600' : 'text-neutral-400'
                    }`}>
                      Choose a content type and add to your documentation
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
              <form onSubmit={handleSubmit} className="p-6 pt-0 space-y-6">
                {/* Content Type Selection */}
                <div>
                  <label className={`block text-sm font-medium mb-3 ${
                    theme === 'light' ? 'text-neutral-700' : 'text-neutral-300'
                  }`}>
                    Content Type
                  </label>
                  <div className="grid grid-cols-1 gap-3">
                    {CONTENT_TYPES.map((type) => {
                      const Icon = type.icon;
                      return (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() => setSelectedType(type.id)}
                          disabled={isLoading}
                          className={`p-4 text-left rounded-lg border transition-colors ${
                            selectedType === type.id
                              ? theme === 'light'
                                ? 'border-indigo-200 bg-indigo-50'
                                : 'border-indigo-700 bg-indigo-900/20'
                              : theme === 'light'
                              ? 'border-neutral-200 hover:border-neutral-300'
                              : 'border-neutral-700 hover:border-neutral-600'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                              selectedType === type.id
                                ? 'text-indigo-600'
                                : theme === 'light'
                                ? 'text-neutral-500'
                                : 'text-neutral-400'
                            }`}>
                              <Icon size={16} />
                            </div>
                            <div className="flex-1">
                              <h3 className={`font-medium ${
                                theme === 'light' ? 'text-neutral-900' : 'text-white'
                              }`}>
                                {type.label}
                              </h3>
                              <p className={`text-sm mt-1 ${
                                theme === 'light' ? 'text-neutral-600' : 'text-neutral-400'
                              }`}>
                                {type.description}
                              </p>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    theme === 'light' ? 'text-neutral-700' : 'text-neutral-300'
                  }`}>
                    {selectedType === 'topic' ? 'Topic Name' : 'Content Title'} *
                  </label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder={selectedType === 'topic' ? 'e.g., Introduction to Hooks' : 'e.g., Key Concepts'}
                    disabled={isLoading}
                    autoFocus
                  />
                </div>

                {/* Content */}
                {selectedType === 'text' && (
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      theme === 'light' ? 'text-neutral-700' : 'text-neutral-300'
                    }`}>
                      Content
                    </label>
                    <Textarea
                      value={formData.content}
                      onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                      placeholder="Write your content here. You can add explanations, code examples, resources, or any other information..."
                      rows={6}
                      disabled={isLoading}
                    />
                  </div>
                )}

                {selectedType === 'topic' && (
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      theme === 'light' ? 'text-neutral-700' : 'text-neutral-300'
                    }`}>
                      Description
                    </label>
                    <Textarea
                      value={formData.content}
                      onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                      placeholder="Brief description of what this topic covers..."
                      rows={3}
                      disabled={isLoading}
                    />
                  </div>
                )}

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
                    Add {selectedTypeInfo?.label}
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