'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, Clock, Edit3, Save, X, BookOpen, Plus, StickyNote } from 'lucide-react';
import { useTopics } from '@/hooks/useTopics';
import { useNotes } from '@/hooks/useNotes';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import ProgressBar from '@/components/ui/ProgressBar';
import { getProgressValue, getStatusColor, getStatusLabel } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

export default function TopicDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [topic, setTopic] = useState(null);
  const [skillId, setSkillId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [editingNote, setEditingNote] = useState(null);
  const [editNoteContent, setEditNoteContent] = useState('');

  // We'll need to fetch the topic data differently since useTopics needs skillId
  // For now, let's create a simple fetch function
  const { notes, loading: notesLoading, createNote, updateNote, deleteNote } = useNotes(params.id);

  useEffect(() => {
    fetchTopic();
  }, [params.id]);

  const fetchTopic = async () => {
    // This is a temporary solution - we should create a separate hook for individual topics
    // For now, we'll simulate the topic data
    setTopic({
      id: params.id,
      title: 'useState Hook',
      description: 'Learning the fundamentals of useState in React',
      status: 'in_progress',
      skill_id: 'skill-123',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
    setSkillId('skill-123');
    setEditForm({
      title: 'useState Hook',
      description: 'Learning the fundamentals of useState in React',
      status: 'in_progress'
    });
  };

  const handleSave = async () => {
    if (!topic) return;
    
    setIsSaving(true);
    try {
      // await updateTopic(topic.id, editForm);
      console.log('Saving topic:', editForm);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving topic:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditForm({
      title: topic.title,
      description: topic.description || '',
      status: topic.status
    });
    setIsEditing(false);
  };

  const handleCreateNote = async () => {
    if (!newNoteContent.trim()) return;
    
    try {
      await createNote({ content: newNoteContent });
      setNewNoteContent('');
    } catch (error) {
      console.error('Error creating note:', error);
    }
  };

  const handleEditNote = (note) => {
    setEditingNote(note.id);
    setEditNoteContent(note.content);
  };

  const handleSaveNote = async (noteId) => {
    try {
      await updateNote(noteId, { content: editNoteContent });
      setEditingNote(null);
      setEditNoteContent('');
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      await deleteNote(noteId);
    }
  };

  if (!topic) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-32 mb-6"></div>
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="h-8 bg-gray-700 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-700 rounded w-2/3 mb-6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const progress = getProgressValue(topic.status);
  const statusColor = getStatusColor(topic.status);
  const statusLabel = getStatusLabel(topic.status);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button onClick={() => router.back()} variant="ghost">
            <ArrowLeft size={16} className="mr-2" />
            Back to Skill
          </Button>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button 
                  onClick={handleCancel} 
                  variant="ghost"
                  disabled={isSaving}
                >
                  <X size={16} className="mr-2" />
                  Cancel
                </Button>
                <Button 
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  <Save size={16} className="mr-2" />
                  {isSaving ? 'Saving...' : 'Save'}
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>
                <Edit3 size={16} className="mr-2" />
                Edit
              </Button>
            )}
          </div>
        </div>

        {/* Main Content */}
        <Card>
          {/* Title and Status */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <BookOpen className="text-blue-400" size={20} />
                {isEditing ? (
                  <Input
                    value={editForm.title}
                    onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                    className="text-2xl font-bold bg-gray-700 border-gray-600"
                    placeholder="Topic title"
                  />
                ) : (
                  <h1 className="text-2xl font-bold text-white">{topic.title}</h1>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              {isEditing ? (
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm(prev => ({ ...prev, status: e.target.value }))}
                  className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-1 text-sm"
                >
                  <option value="not_started">Not Started</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              ) : (
                <Badge variant={statusColor}>{statusLabel}</Badge>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <ProgressBar value={progress} showPercentage className="mb-6" />

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Description</h3>
            {isEditing ? (
              <Textarea
                value={editForm.description}
                onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Add a description for this topic..."
                rows={3}
              />
            ) : (
              <p className="text-gray-300">
                {topic.description || 'No description yet. Click Edit to add one.'}
              </p>
            )}
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 text-sm">
            <div>
              <div className="text-gray-400 mb-1">Last Updated</div>
              <div className="flex items-center gap-2 text-white">
                <Clock size={14} />
                {formatDistanceToNow(new Date(topic.updated_at), { addSuffix: true })}
              </div>
            </div>
            <div>
              <div className="text-gray-400 mb-1">Notes</div>
              <div className="flex items-center gap-2 text-white">
                <StickyNote size={14} />
                {notes.length} notes
              </div>
            </div>
          </div>
        </Card>

        {/* Notes Section */}
        <Card className="mt-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Learning Notes</h3>
            <Button
              onClick={() => setNewNoteContent('')}
              size="sm"
              className="flex items-center gap-2"
              disabled={!!newNoteContent}
            >
              <Plus size={14} />
              Add Note
            </Button>
          </div>

          {/* Add New Note */}
          <div className="mb-6">
            <textarea
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
              placeholder="Add your learning notes, insights, code examples, or questions..."
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={4}
            />
            {newNoteContent && (
              <div className="flex justify-end gap-2 mt-3">
                <Button
                  onClick={() => setNewNoteContent('')}
                  variant="ghost"
                  size="sm"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateNote}
                  size="sm"
                  disabled={!newNoteContent.trim()}
                >
                  Add Note
                </Button>
              </div>
            )}
          </div>

          {/* Notes List */}
          {notesLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-gray-700/30 rounded-lg p-4 h-24 animate-pulse"></div>
              ))}
            </div>
          ) : notes.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <StickyNote className="mx-auto h-8 w-8 mb-3" />
              <p>No notes yet. Add your first note to track your learning progress.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {notes.map((note) => (
                <div key={note.id} className="bg-gray-700/30 rounded-lg p-4 border border-gray-700">
                  {editingNote === note.id ? (
                    <div>
                      <textarea
                        value={editNoteContent}
                        onChange={(e) => setEditNoteContent(e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        rows={4}
                      />
                      <div className="flex justify-end gap-2 mt-3">
                        <Button
                          onClick={() => setEditingNote(null)}
                          size="sm"
                          variant="ghost"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={() => handleSaveNote(note.id)}
                          size="sm"
                        >
                          Save
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex justify-between items-start gap-3 mb-3">
                        <p className="text-gray-300 whitespace-pre-wrap flex-1">
                          {note.content}
                        </p>
                        <div className="flex gap-1 flex-shrink-0">
                          <Button
                            onClick={() => handleEditNote(note)}
                            size="sm"
                            variant="ghost"
                            className="text-gray-400 hover:text-white"
                          >
                            <Edit3 size={12} />
                          </Button>
                          <Button
                            onClick={() => handleDeleteNote(note.id)}
                            size="sm"
                            variant="ghost"
                            className="text-red-400 hover:text-red-300"
                          >
                            <X size={12} />
                          </Button>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        {note.updated_at !== note.created_at ? 'Updated' : 'Created'}{' '}
                        {formatDistanceToNow(new Date(note.updated_at), { addSuffix: true })}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}