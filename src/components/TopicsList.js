'use client';
import { useState } from 'react';
import { BookOpen, Plus, Edit3, Trash2, StickyNote, CheckCircle2, Circle, Clock, PlayCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Button from './ui/Button';
import Card from './ui/Card';
import Badge from './ui/Badge';
import ProgressBar from './ui/ProgressBar';
import CreateTopicModal from './CreateTopicModal';
import NotesSection from './NotesSection';
import { getStatusColor, getStatusLabel, getProgressValue } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

export default function TopicsList({ topics, loading, onCreateTopic, onUpdateTopic, onDeleteTopic }) {
  const router = useRouter();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', description: '' });

  const handleCreateTopic = async (topicData) => {
    await onCreateTopic(topicData);
  };

  const handleEditStart = (topic) => {
    setEditingTopic(topic.id);
    setEditForm({
      title: topic.title,
      description: topic.description || ''
    });
  };

  const handleEditSave = async (topicId) => {
    try {
      await onUpdateTopic(topicId, editForm);
      setEditingTopic(null);
    } catch (error) {
      console.error('Error updating topic:', error);
    }
  };

  const handleEditCancel = () => {
    setEditingTopic(null);
    setEditForm({ title: '', description: '' });
  };

  const handleStatusChange = async (topicId, newStatus) => {
    try {
      await onUpdateTopic(topicId, { status: newStatus });
    } catch (error) {
      console.error('Error updating topic status:', error);
    }
  };

  const handleDelete = async (topicId) => {
    if (window.confirm('Are you sure you want to delete this topic? This will also delete all associated notes.')) {
      await onDeleteTopic(topicId);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex gap-4">
            <div className="w-8 h-8 bg-gray-700 rounded-full animate-pulse"></div>
            <div className="flex-1 bg-gray-800 rounded-lg p-4 h-32 animate-pulse"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <BookOpen size={18} className="text-blue-400" />
          <h3 className="text-lg font-semibold text-white">Learning Topics</h3>
          <span className="text-sm text-gray-400">({topics.length})</span>
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          size="sm"
          className="flex items-center gap-2"
        >
          <Plus size={14} />
          Add Topic
        </Button>
      </div>

      {topics.length === 0 ? (
        <Card className="text-center py-12">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h4 className="text-lg font-medium text-white mb-2">No topics yet</h4>
          <p className="text-gray-400 text-sm mb-6">
            Break down this skill into specific topics and create a learning roadmap
          </p>
          <Button onClick={() => setIsCreateModalOpen(true)} size="sm">
            <Plus size={14} className="mr-2" />
            Create Your First Topic
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {topics.map((topic, index) => (
            <div key={topic.id} className="relative group">
              {/* Connection Line */}
              {index < topics.length - 1 && (
                <div className="absolute left-8 top-20 w-0.5 h-8 bg-gray-700 group-hover:bg-blue-500/30 transition-colors"></div>
              )}
              
              <div className="flex gap-4">
                {/* Step Number Circle */}
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-800 border-2 border-gray-600 flex items-center justify-center text-sm font-medium group-hover:border-blue-500 transition-colors relative z-10">
                  {topic.status === 'completed' ? (
                    <CheckCircle2 className="text-green-400" size={16} />
                  ) : topic.status === 'in_progress' ? (
                    <PlayCircle className="text-yellow-400" size={16} />
                  ) : (
                    <span className="text-gray-300">{index + 1}</span>
                  )}
                </div>

                {/* Topic Card */}
                <Card className="flex-1 hover:border-gray-600 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      {/* Topic Header */}
                      <div className="flex items-center gap-3 mb-2">
                        {editingTopic === topic.id ? (
                          <input
                            type="text"
                            value={editForm.title}
                            onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                            className="flex-1 bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        ) : (
                          <>
                            <h4 className="font-semibold text-white flex-1 text-lg group-hover:text-blue-400 transition-colors cursor-pointer"
                                onClick={() => router.push(`/topics/${topic.id}`)}>
                              {topic.title}
                            </h4>
                            {/* Status Indicator */}
                            <button
                              onClick={() => {
                                const nextStatus = topic.status === 'not_started' 
                                  ? 'in_progress' 
                                  : topic.status === 'in_progress' 
                                  ? 'completed' 
                                  : 'not_started';
                                handleStatusChange(topic.id, nextStatus);
                              }}
                              className="transition-colors"
                              title="Click to change status"
                            >
                              {topic.status === 'completed' ? (
                                <CheckCircle2 size={18} className="text-green-400 hover:text-green-300" />
                              ) : topic.status === 'in_progress' ? (
                                <PlayCircle size={18} className="text-yellow-400 hover:text-yellow-300" />
                              ) : (
                                <Circle size={18} className="text-gray-400 hover:text-blue-400" />
                              )}
                            </button>
                          </>
                        )}
                      </div>

                      {/* Status Badge */}
                      <div className="flex items-center gap-3 mb-3">
                        <Badge variant={getStatusColor(topic.status)} size="sm">
                          {getStatusLabel(topic.status)}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <StickyNote size={12} />
                          <span>{topic.notes_count || 0} notes</span>
                        </div>
                      </div>

                      {/* Description */}
                      {editingTopic === topic.id ? (
                        <textarea
                          value={editForm.description}
                          onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                          className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                          rows={2}
                          placeholder="Add a description..."
                        />
                      ) : topic.description ? (
                        <p className="text-gray-400 text-sm mb-3">{topic.description}</p>
                      ) : (
                        <p className="text-gray-500 text-sm italic mb-3">Click edit to add a description</p>
                      )}

                      {/* Progress Bar */}
                      <ProgressBar value={getProgressValue(topic.status)} className="mb-3" />

                      {/* Metadata */}
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock size={12} />
                          <span>Updated {formatDistanceToNow(new Date(topic.updated_at), { addSuffix: true })}</span>
                        </div>
                        <span className="text-gray-500">Topic {index + 1}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-1 ml-4">
                      {editingTopic === topic.id ? (
                        <>
                          <Button
                            onClick={() => handleEditSave(topic.id)}
                            size="sm"
                            variant="ghost"
                            className="text-green-400 hover:text-green-300"
                          >
                            Save
                          </Button>
                          <Button
                            onClick={handleEditCancel}
                            size="sm"
                            variant="ghost"
                            className="text-gray-400 hover:text-gray-300"
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            onClick={() => handleEditStart(topic)}
                            size="sm"
                            variant="ghost"
                            className="text-gray-400 hover:text-white"
                          >
                            <Edit3 size={14} />
                          </Button>
                          <Button
                            onClick={() => handleDelete(topic.id)}
                            size="sm"
                            variant="ghost"
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 size={14} />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Notes Section */}
                  <NotesSection topicId={topic.id} />
                </Card>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Topic Modal */}
      <CreateTopicModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onTopicCreated={handleCreateTopic}
      />
    </div>
  );
}