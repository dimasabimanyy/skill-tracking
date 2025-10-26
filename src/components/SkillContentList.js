'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, MessageSquare, Edit3, Trash2, Plus } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import Button from './ui/Button';
import Textarea from './ui/Textarea';

export default function SkillContentList({ 
  content, 
  loading, 
  onCreateContent, 
  onUpdateContent, 
  onDeleteContent 
}) {
  const { theme } = useTheme();
  const router = useRouter();
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState('');

  const getContentIcon = (type) => {
    switch (type) {
      case 'topic':
        return MessageSquare;
      case 'text':
      default:
        return FileText;
    }
  };

  const handleEditStart = (item) => {
    setEditingId(item.id);
    setEditContent(item.content);
  };

  const handleEditSave = async (item) => {
    try {
      await onUpdateContent(item.id, { content: editContent });
      setEditingId(null);
      setEditContent('');
    } catch (error) {
      console.error('Error updating content:', error);
    }
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditContent('');
  };

  const handleTopicClick = (item) => {
    if (item.type === 'topic') {
      // For now, we'll just show the topic content
      // Later this could navigate to a dedicated topic page
      return;
    }
  };

  const handleDelete = async (item) => {
    if (confirm('Are you sure you want to delete this content?')) {
      try {
        await onDeleteContent(item.id);
      } catch (error) {
        console.error('Error deleting content:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className={`animate-pulse p-4 rounded-lg ${
            theme === 'light' ? 'bg-neutral-100' : 'bg-neutral-800'
          }`}>
            <div className={`h-4 rounded w-1/3 mb-2 ${
              theme === 'light' ? 'bg-neutral-300' : 'bg-neutral-600'
            }`}></div>
            <div className={`h-16 rounded w-full ${
              theme === 'light' ? 'bg-neutral-300' : 'bg-neutral-600'
            }`}></div>
          </div>
        ))}
      </div>
    );
  }

  if (content.length === 0) {
    return (
      <div className={`text-center py-12 ${
        theme === 'light' ? 'text-neutral-500' : 'text-neutral-500'
      }`}>
        <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${
          theme === 'light' ? 'bg-neutral-100' : 'bg-neutral-800'
        }`}>
          <FileText className={`${
            theme === 'light' ? 'text-neutral-400' : 'text-neutral-500'
          }`} size={24} />
        </div>
        <p className="italic">
          No content blocks yet. Add your first content block to start documenting your learning.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {content.map((item, index) => {
        const Icon = getContentIcon(item.type);
        const isEditing = editingId === item.id;

        return (
          <div key={item.id} className="group">
            {/* Content Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  item.type === 'topic'
                    ? theme === 'light' 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'bg-blue-900/30 text-blue-400'
                    : theme === 'light'
                    ? 'bg-neutral-50 text-neutral-600'
                    : 'bg-neutral-800 text-neutral-400'
                }`}>
                  <Icon size={16} />
                </div>
                <div>
                  <h3 className={`font-medium ${
                    theme === 'light' ? 'text-neutral-900' : 'text-white'
                  }`}>
                    {item.title}
                  </h3>
                  <span className={`text-xs uppercase tracking-wider ${
                    theme === 'light' ? 'text-neutral-500' : 'text-neutral-500'
                  }`}>
                    {item.type}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {!isEditing && (
                  <>
                    <button
                      onClick={() => handleEditStart(item)}
                      className={`p-2 rounded-lg transition-colors ${
                        theme === 'light'
                          ? 'hover:bg-neutral-100 text-neutral-500 hover:text-neutral-700'
                          : 'hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200'
                      }`}
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(item)}
                      className={`p-2 rounded-lg transition-colors ${
                        theme === 'light'
                          ? 'hover:bg-red-50 text-neutral-500 hover:text-red-600'
                          : 'hover:bg-red-900/20 text-neutral-400 hover:text-red-400'
                      }`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Content Body */}
            <div className={`${
              item.type === 'topic' ? 'cursor-pointer' : ''
            }`} onClick={() => handleTopicClick(item)}>
              {isEditing ? (
                <div className="space-y-3">
                  <Textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={item.type === 'text' ? 6 : 3}
                    className="font-mono text-sm"
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleEditSave(item)}
                    >
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleEditCancel}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className={`prose prose-neutral max-w-none ${
                  theme === 'dark' ? 'prose-invert' : ''
                }`}>
                  {item.content ? (
                    <div className={`whitespace-pre-wrap leading-relaxed ${
                      theme === 'light' ? 'text-neutral-700' : 'text-neutral-300'
                    }`}>
                      {item.content}
                    </div>
                  ) : (
                    <div className={`italic ${
                      theme === 'light' ? 'text-neutral-500' : 'text-neutral-500'
                    }`}>
                      {item.type === 'topic' ? 'Click to add topic description...' : 'Click edit to add content...'}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Separator */}
            {index < content.length - 1 && (
              <div className={`mt-8 border-b ${
                theme === 'light' ? 'border-neutral-100' : 'border-neutral-800'
              }`} />
            )}
          </div>
        );
      })}
    </div>
  );
}