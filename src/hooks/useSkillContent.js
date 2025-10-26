'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';

export function useSkillContent(skillId = null) {
  const { user, isAuthenticated, isConfigured } = useAuth();
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (skillId) {
      fetchContent();
    } else {
      setContent([]);
      setLoading(false);
    }
  }, [user, isAuthenticated, isConfigured, skillId]);

  const fetchContent = async () => {
    try {
      setLoading(true);
      
      if (!isConfigured || !isAuthenticated || !user) {
        setContent([]);
        setLoading(false);
        return;
      }
      
      if (supabase && user && skillId) {
        const { data, error } = await supabase
          .from('skill_content')
          .select('*')
          .eq('user_id', user.id)
          .eq('skill_id', skillId)
          .order('order_index', { ascending: true });
        
        if (error) {
          console.error('Supabase error:', error);
          setError(error.message);
          setContent([]);
          return;
        }
        
        setContent(data || []);
      }
    } catch (error) {
      console.error('Error fetching skill content:', error);
      setError(error.message);
      setContent([]);
    } finally {
      setLoading(false);
    }
  };

  const createContent = async (contentData = {}) => {
    try {
      if (!isConfigured || !isAuthenticated || !user || !skillId) {
        throw new Error('Must be authenticated to create content');
      }

      // Get the highest order_index for this skill
      const { data: existingContent } = await supabase
        .from('skill_content')
        .select('order_index')
        .eq('user_id', user.id)
        .eq('skill_id', skillId)
        .order('order_index', { ascending: false })
        .limit(1);

      const nextOrderIndex = existingContent?.length > 0 
        ? (existingContent[0].order_index || 0) + 1 
        : 0;

      const { data, error } = await supabase
        .from('skill_content')
        .insert([{
          user_id: user.id,
          skill_id: skillId,
          type: contentData.type || 'text',
          title: contentData.title || 'New Content',
          content: contentData.content || '',
          order_index: nextOrderIndex,
        }])
        .select();

      if (error) throw error;
      
      const newContent = data[0];
      setContent(prev => [...prev, newContent]);
      return newContent;
    } catch (error) {
      console.error('Error creating content:', error);
      setError(error.message);
      throw error;
    }
  };

  const updateContent = async (id, updates) => {
    try {
      if (!isConfigured || !isAuthenticated || !user) {
        throw new Error('Must be authenticated to update content');
      }

      const updatedData = {
        ...updates,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('skill_content')
        .update(updatedData)
        .eq('id', id)
        .eq('user_id', user.id)
        .select();

      if (error) throw error;
      
      setContent(prev => prev.map(item => 
        item.id === id ? { ...item, ...data[0] } : item
      ));
      return data[0];
    } catch (error) {
      console.error('Error updating content:', error);
      setError(error.message);
      throw error;
    }
  };

  const deleteContent = async (id) => {
    try {
      if (!isConfigured || !isAuthenticated || !user) {
        throw new Error('Must be authenticated to delete content');
      }

      const { error } = await supabase
        .from('skill_content')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      
      setContent(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting content:', error);
      setError(error.message);
      throw error;
    }
  };

  const reorderContent = async (reorderedContent) => {
    try {
      if (!isConfigured || !isAuthenticated || !user) {
        throw new Error('Must be authenticated to reorder content');
      }

      const updates = reorderedContent.map((item, index) => ({
        id: item.id,
        order_index: index
      }));

      for (const update of updates) {
        await supabase
          .from('skill_content')
          .update({ order_index: update.order_index })
          .eq('id', update.id)
          .eq('user_id', user.id);
      }

      setContent(reorderedContent);
    } catch (error) {
      console.error('Error reordering content:', error);
      setError(error.message);
      throw error;
    }
  };

  return {
    content,
    loading,
    error,
    createContent,
    updateContent,
    deleteContent,
    reorderContent,
    refetch: fetchContent,
  };
}