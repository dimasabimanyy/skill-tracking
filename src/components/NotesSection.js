'use client';
import { useState } from 'react';
import { StickyNote, Plus, Edit3, Trash2, Save, X, ChevronDown, ChevronRight } from 'lucide-react';
import Button from './ui/Button';
import { useNotes } from '@/hooks/useNotes';
import { formatDistanceToNow } from 'date-fns';

export default function NotesSection({ topicId }) {
  const { notes, loading, createNote, updateNote, deleteNote } = useNotes(topicId);
  const [isExpanded, setIsExpanded] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);

  const handleCreateNote = async () => {
    if (!newNoteContent.trim()) return;
    
    try {
      await createNote({ content: newNoteContent });
      setNewNoteContent('');
      setIsAddingNote(false);
    } catch (error) {
      console.error('Error creating note:', error);
    }
  };

  const handleEditStart = (note) => {
    setEditingNote(note.id);
    setEditContent(note.content);
  };

  const handleEditSave = async (noteId) => {
    try {
      await updateNote(noteId, { content: editContent });
      setEditingNote(null);
      setEditContent('');
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  const handleEditCancel = () => {
    setEditingNote(null);
    setEditContent('');
  };

  const handleDelete = async (noteId) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      await deleteNote(noteId);
    }
  };

  return (
    <div className="border-t border-gray-700 mt-3 pt-3">
      {/* Notes Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
        >
          {isExpanded ? (
            <ChevronDown size={14} />
          ) : (
            <ChevronRight size={14} />
          )}
          <StickyNote size={14} />
          <span>Notes ({notes.length})</span>
        </button>

        {isExpanded && (
          <Button
            onClick={() => setIsAddingNote(true)}
            size="sm"
            variant="ghost"
            className="text-blue-400 hover:text-blue-300"
          >
            <Plus size={12} />
          </Button>
        )}
      </div>

      {/* Notes Content */}
      {isExpanded && (
        <div className="mt-3 space-y-3">
          {/* Add New Note */}
          {isAddingNote && (
            <div className="bg-gray-700/50 rounded-lg p-3 border border-gray-600">
              <textarea
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
                placeholder="Add your note..."
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={3}
                autoFocus
              />
              <div className="flex justify-end gap-2 mt-2">
                <Button
                  onClick={() => {
                    setIsAddingNote(false);
                    setNewNoteContent('');
                  }}
                  size="sm"
                  variant="ghost"
                  className="text-gray-400"
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
            </div>
          )}

          {/* Notes List */}
          {loading ? (
            <div className="space-y-2">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="bg-gray-700/30 rounded p-3 h-16 animate-pulse"></div>
              ))}
            </div>
          ) : notes.length === 0 ? (
            <div className="text-center py-4 text-gray-500 text-sm">
              No notes yet. Add your first note to track your learning progress.
            </div>
          ) : (
            <div className="space-y-2">
              {notes.map((note) => (
                <div key={note.id} className="bg-gray-700/30 rounded-lg p-3 border border-gray-700">
                  {editingNote === note.id ? (
                    <div>
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        rows={3}
                      />
                      <div className="flex justify-end gap-2 mt-2">
                        <Button
                          onClick={handleEditCancel}
                          size="sm"
                          variant="ghost"
                          className="text-gray-400"
                        >
                          <X size={12} />
                        </Button>
                        <Button
                          onClick={() => handleEditSave(note.id)}
                          size="sm"
                          className="text-green-400"
                        >
                          <Save size={12} />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex justify-between items-start gap-3">
                        <p className="text-gray-300 text-sm whitespace-pre-wrap flex-1">
                          {note.content}
                        </p>
                        <div className="flex gap-1 flex-shrink-0">
                          <Button
                            onClick={() => handleEditStart(note)}
                            size="sm"
                            variant="ghost"
                            className="text-gray-400 hover:text-white"
                          >
                            <Edit3 size={12} />
                          </Button>
                          <Button
                            onClick={() => handleDelete(note.id)}
                            size="sm"
                            variant="ghost"
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 size={12} />
                          </Button>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 mt-2">
                        {note.updated_at !== note.created_at ? 'Updated' : 'Created'}{' '}
                        {formatDistanceToNow(new Date(note.updated_at), { addSuffix: true })}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}