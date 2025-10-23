'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';

export function useTopics(skillId = null) {
  const { user, isAuthenticated, isConfigured } = useAuth();
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (skillId) {
      fetchTopics();
    } else {
      setTopics([]);
      setLoading(false);
    }
  }, [user, isAuthenticated, isConfigured, skillId]);

  const fetchTopics = async () => {
    try {
      setLoading(true);
      
      // If not configured or authenticated, return empty array
      if (!isConfigured || !isAuthenticated || !user) {
        setTopics([]);
        setLoading(false);
        return;
      }
      
      // Fetch from Supabase for authenticated users
      if (supabase && user && skillId) {
        const { data, error } = await supabase
          .from('topics')
          .select(`
            *,
            notes:notes(
              id,
              content,
              created_at,
              updated_at
            )
          `)
          .eq('user_id', user.id)
          .eq('skill_id', skillId)
          .order('order_index', { ascending: true });
        
        if (error) {
          console.error('Supabase error:', error);
          setError(error.message);
          setTopics([]);
          return;
        }
        
        // Add notes count to each topic
        const topicsWithStats = (data || []).map(topic => ({
          ...topic,
          notes_count: topic.notes?.length || 0
        }));
        
        setTopics(topicsWithStats);
      }
    } catch (error) {
      console.error('Error fetching topics:', error);
      setError(error.message);
      setTopics([]);
    } finally {
      setLoading(false);
    }
  };

  const createTopic = async (topicData = {}) => {
    try {
      if (!isConfigured || !isAuthenticated || !user || !skillId) {
        throw new Error('Must be authenticated to create topics');
      }

      // Get the highest order_index for this skill
      const { data: existingTopics } = await supabase
        .from('topics')
        .select('order_index')
        .eq('user_id', user.id)
        .eq('skill_id', skillId)
        .order('order_index', { ascending: false })
        .limit(1);

      const nextOrderIndex = existingTopics?.length > 0 
        ? (existingTopics[0].order_index || 0) + 1 
        : 0;

      const { data, error } = await supabase
        .from('topics')
        .insert([{
          user_id: user.id,
          skill_id: skillId,
          title: topicData.title || 'New Topic',
          description: topicData.description || '',
          status: 'not_started',
          order_index: nextOrderIndex,
        }])
        .select();

      if (error) throw error;
      
      const newTopic = { ...data[0], notes_count: 0, notes: [] };
      setTopics(prev => [...prev, newTopic]);
      return newTopic;
    } catch (error) {
      console.error('Error creating topic:', error);
      setError(error.message);
      throw error;
    }
  };

  const updateTopic = async (id, updates) => {
    try {
      if (!isConfigured || !isAuthenticated || !user) {
        throw new Error('Must be authenticated to update topics');
      }

      const updatedData = {
        ...updates,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('topics')
        .update(updatedData)
        .eq('id', id)
        .eq('user_id', user.id)
        .select();

      if (error) throw error;
      
      setTopics(prev => prev.map(topic => 
        topic.id === id ? { ...topic, ...data[0] } : topic
      ));
      return data[0];
    } catch (error) {
      console.error('Error updating topic:', error);
      setError(error.message);
      throw error;
    }
  };

  const deleteTopic = async (id) => {
    try {
      if (!isConfigured || !isAuthenticated || !user) {
        throw new Error('Must be authenticated to delete topics');
      }

      const { error } = await supabase
        .from('topics')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      
      setTopics(prev => prev.filter(topic => topic.id !== id));
    } catch (error) {
      console.error('Error deleting topic:', error);
      setError(error.message);
      throw error;
    }
  };

  const reorderTopics = async (reorderedTopics) => {
    try {
      if (!isConfigured || !isAuthenticated || !user) {
        throw new Error('Must be authenticated to reorder topics');
      }

      // Update order_index for each topic
      const updates = reorderedTopics.map((topic, index) => ({
        id: topic.id,
        order_index: index
      }));

      for (const update of updates) {
        await supabase
          .from('topics')
          .update({ order_index: update.order_index })
          .eq('id', update.id)
          .eq('user_id', user.id);
      }

      setTopics(reorderedTopics);
    } catch (error) {
      console.error('Error reordering topics:', error);
      setError(error.message);
      throw error;
    }
  };

  return {
    topics,
    loading,
    error,
    createTopic,
    updateTopic,
    deleteTopic,
    reorderTopics,
    refetch: fetchTopics,
  };
}