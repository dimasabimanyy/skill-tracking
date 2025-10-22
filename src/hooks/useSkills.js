'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';

export function useSkills() {
  const { user, isAuthenticated, isConfigured } = useAuth();
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock data only for demo mode (when not authenticated)
  const mockSkills = !isAuthenticated ? [
    {
      id: 'demo-1',
      goal_id: 'demo-1',
      title: 'React Hooks',
      description: 'Learning advanced React hooks patterns and custom hooks',
      status: 'in_progress',
      target_date: '2024-12-31',
      notes: 'Focusing on useContext and useReducer patterns',
      created_at: '2024-10-01T00:00:00Z',
      updated_at: '2024-10-15T00:00:00Z',
      last_reviewed_at: '2024-10-15T00:00:00Z'
    }
  ] : [];

  useEffect(() => {
    fetchSkills();
  }, [user, isAuthenticated, isConfigured]);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      
      // If not configured, use mock data
      if (!isConfigured) {
        console.log('Using mock skills data - Supabase not configured');
        setSkills(mockSkills);
        setLoading(false);
        return;
      }

      // If not authenticated, return empty array for real mode
      if (!isAuthenticated) {
        console.log('Not authenticated - showing empty skills');
        setSkills([]);
        setLoading(false);
        return;
      }
      
      // Fetch from Supabase for authenticated users
      if (supabase && user) {
        const { data, error } = await supabase
          .from('skills')
          .select('*')
          .eq('user_id', user.id)
          .order('order_in_roadmap', { ascending: true });
        
        if (error) {
          console.error('Supabase error:', error);
          setError(error.message);
          setSkills([]);
          return;
        }
        
        setSkills(data || []);
      }
    } catch (error) {
      console.error('Error fetching skills:', error);
      setError(error.message);
      setSkills([]);
    } finally {
      setLoading(false);
    }
  };

  const createSkill = async (skillData = {}) => {
    try {
      if (!isConfigured || !isAuthenticated || !user) {
        throw new Error('Must be authenticated to create skills');
      }

      const { data, error } = await supabase
        .from('skills')
        .insert([{
          user_id: user.id,
          goal_id: skillData.goal_id || null,
          title: skillData.title || 'New Skill',
          description: skillData.description || '',
          status: 'not_started',
          target_date: skillData.target_date || null,
          estimated_duration_days: skillData.estimated_duration_days || null,
          order_in_roadmap: skillData.order_in_roadmap || 0,
          notes: '',
        }])
        .select();

      if (error) throw error;
      
      setSkills(prev => [...prev, data[0]]);
      return data[0];
    } catch (error) {
      console.error('Error creating skill:', error);
      setError(error.message);
      throw error;
    }
  };

  const updateSkill = async (id, updates) => {
    try {
      if (!isConfigured || !isAuthenticated || !user) {
        throw new Error('Must be authenticated to update skills');
      }

      const updatedData = {
        ...updates,
        updated_at: new Date().toISOString(),
        last_reviewed_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('skills')
        .update(updatedData)
        .eq('id', id)
        .eq('user_id', user.id)
        .select();

      if (error) throw error;
      
      setSkills(prev => prev.map(skill => 
        skill.id === id ? data[0] : skill
      ));
      return data[0];
    } catch (error) {
      console.error('Error updating skill:', error);
      setError(error.message);
      throw error;
    }
  };

  const deleteSkill = async (id) => {
    try {
      if (!isConfigured || !isAuthenticated || !user) {
        throw new Error('Must be authenticated to delete skills');
      }

      const { error } = await supabase
        .from('skills')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      
      setSkills(prev => prev.filter(skill => skill.id !== id));
    } catch (error) {
      console.error('Error deleting skill:', error);
      setError(error.message);
      throw error;
    }
  };

  return {
    skills,
    loading,
    error,
    createSkill,
    updateSkill,
    deleteSkill,
    refetch: fetchSkills,
  };
}