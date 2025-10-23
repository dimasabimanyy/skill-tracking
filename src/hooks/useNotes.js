'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';

export function useNotes(topicId = null) {
  const { user, isAuthenticated, isConfigured } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (topicId) {
      fetchNotes();
    } else {
      setNotes([]);
      setLoading(false);
    }
  }, [user, isAuthenticated, isConfigured, topicId]);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      
      // If not configured or authenticated, return empty array
      if (!isConfigured || !isAuthenticated || !user) {
        setNotes([]);
        setLoading(false);
        return;
      }
      
      // Fetch from Supabase for authenticated users
      if (supabase && user && topicId) {
        const { data, error } = await supabase
          .from('notes')
          .select('*')
          .eq('user_id', user.id)
          .eq('topic_id', topicId)
          .order('created_at', { ascending: true });
        
        if (error) {
          console.error('Supabase error:', error);
          setError(error.message);
          setNotes([]);
          return;
        }
        
        setNotes(data || []);
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
      setError(error.message);
      setNotes([]);
    } finally {
      setLoading(false);
    }
  };

  const createNote = async (noteData = {}) => {
    try {
      if (!isConfigured || !isAuthenticated || !user || !topicId) {
        throw new Error('Must be authenticated to create notes');
      }

      const { data, error } = await supabase
        .from('notes')
        .insert([{
          user_id: user.id,
          topic_id: topicId,
          content: noteData.content || 'New note',
        }])
        .select();

      if (error) throw error;
      
      setNotes(prev => [...prev, data[0]]);
      return data[0];
    } catch (error) {
      console.error('Error creating note:', error);
      setError(error.message);
      throw error;
    }
  };

  const updateNote = async (id, updates) => {
    try {
      if (!isConfigured || !isAuthenticated || !user) {
        throw new Error('Must be authenticated to update notes');
      }

      const updatedData = {
        ...updates,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('notes')
        .update(updatedData)
        .eq('id', id)
        .eq('user_id', user.id)
        .select();

      if (error) throw error;
      
      setNotes(prev => prev.map(note => 
        note.id === id ? data[0] : note
      ));
      return data[0];
    } catch (error) {
      console.error('Error updating note:', error);
      setError(error.message);
      throw error;
    }
  };

  const deleteNote = async (id) => {
    try {
      if (!isConfigured || !isAuthenticated || !user) {
        throw new Error('Must be authenticated to delete notes');
      }

      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      
      setNotes(prev => prev.filter(note => note.id !== id));
    } catch (error) {
      console.error('Error deleting note:', error);
      setError(error.message);
      throw error;
    }
  };

  return {
    notes,
    loading,
    error,
    createNote,
    updateNote,
    deleteNote,
    refetch: fetchNotes,
  };
}