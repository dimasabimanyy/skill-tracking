'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';

export function useGoals() {
  const { user, isAuthenticated, isConfigured } = useAuth();
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock data for development
  const mockGoals = [
    {
      id: '1',
      user_id: 'demo-user',
      title: 'Senior Software Engineer Role',
      description: 'Land a senior software engineering position at a top tech company',
      target_date: '2024-12-31',
      estimated_duration_weeks: 16,
      is_achieved: false,
      achievement_notes: null,
      created_at: '2024-10-01T00:00:00Z',
      updated_at: '2024-10-01T00:00:00Z',
      skills_count: 3,
      completed_skills: 1
    },
    {
      id: '2',
      user_id: 'demo-user',
      title: 'Full-Stack Developer',
      description: 'Become proficient in both frontend and backend development',
      target_date: '2024-11-30',
      estimated_duration_weeks: 12,
      is_achieved: false,
      achievement_notes: null,
      created_at: '2024-09-15T00:00:00Z',
      updated_at: '2024-09-15T00:00:00Z',
      skills_count: 4,
      completed_skills: 0
    }
  ];

  useEffect(() => {
    fetchGoals();
  }, [user, isAuthenticated, isConfigured]);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      
      // If not configured or not authenticated, use mock data
      if (!isConfigured || (!isAuthenticated && isConfigured)) {
        console.log('Using mock goals data - not authenticated or configured');
        setGoals(mockGoals);
        setLoading(false);
        return;
      }
      
      // Try to fetch from Supabase for authenticated users
      if (supabase && user) {
        try {
          const { data, error } = await supabase
            .from('goals')
            .select(`
              *,
              skills:skills(
                id,
                status
              )
            `)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });
          
          if (error) throw error;
          
          // Add skills count and completed count
          const goalsWithStats = (data || []).map(goal => ({
            ...goal,
            skills_count: goal.skills?.length || 0,
            completed_skills: goal.skills?.filter(skill => skill.status === 'done').length || 0
          }));
          
          setGoals(goalsWithStats);
        } catch (supabaseError) {
          console.log('Supabase error, using mock goals data:', supabaseError);
          setGoals(mockGoals);
        }
      } else {
        console.log('Supabase not configured, using mock goals data');
        setGoals(mockGoals);
      }
    } catch (error) {
      console.error('Error fetching goals:', error);
      setError(error.message);
      setGoals(mockGoals);
    } finally {
      setLoading(false);
    }
  };

  const createGoal = async (goalData = {}) => {
    try {
      const newGoal = {
        id: Date.now().toString(),
        user_id: user?.id || 'demo-user',
        title: goalData.title || 'New Goal',
        description: goalData.description || '',
        target_date: goalData.target_date || null,
        estimated_duration_weeks: goalData.estimated_duration_weeks || null,
        is_achieved: false,
        achievement_notes: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        skills_count: 0,
        completed_skills: 0
      };

      // Only try Supabase if configured and user is authenticated
      if (supabase && user && isAuthenticated) {
        try {
          const { data, error } = await supabase
            .from('goals')
            .insert([{
              user_id: user.id,
              title: goalData.title || 'New Goal',
              description: goalData.description || '',
              target_date: goalData.target_date || null,
              estimated_duration_weeks: goalData.estimated_duration_weeks || null,
            }])
            .select();

          if (error) throw error;
          const goalWithStats = { ...data[0], skills_count: 0, completed_skills: 0 };
          setGoals(prev => [goalWithStats, ...prev]);
          return goalWithStats;
        } catch (supabaseError) {
          console.log('Supabase error on create goal, using local state:', supabaseError);
          setGoals(prev => [newGoal, ...prev]);
          return newGoal;
        }
      } else {
        // Fallback to local state update (demo mode)
        setGoals(prev => [newGoal, ...prev]);
        return newGoal;
      }
    } catch (error) {
      console.error('Error creating goal:', error);
      setError(error.message);
    }
  };

  const updateGoal = async (id, updates) => {
    try {
      const updatedData = {
        ...updates,
        updated_at: new Date().toISOString(),
      };

      // Only try Supabase if configured and user is authenticated
      if (supabase && user && isAuthenticated) {
        try {
          const { data, error } = await supabase
            .from('goals')
            .update(updatedData)
            .eq('id', id)
            .eq('user_id', user.id)
            .select();

          if (error) throw error;
          setGoals(prev => prev.map(goal => 
            goal.id === id ? { ...goal, ...data[0] } : goal
          ));
          return data[0];
        } catch (supabaseError) {
          console.log('Supabase error on update goal, using local state:', supabaseError);
          setGoals(prev => prev.map(goal => 
            goal.id === id ? { ...goal, ...updatedData } : goal
          ));
          return { id, ...updatedData };
        }
      } else {
        // Fallback to local state update (demo mode)
        setGoals(prev => prev.map(goal => 
          goal.id === id ? { ...goal, ...updatedData } : goal
        ));
        return { id, ...updatedData };
      }
    } catch (error) {
      console.error('Error updating goal:', error);
      setError(error.message);
    }
  };

  const deleteGoal = async (id) => {
    try {
      // Only try Supabase if configured and user is authenticated
      if (supabase && user && isAuthenticated) {
        try {
          const { error } = await supabase
            .from('goals')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id);

          if (error) throw error;
        } catch (supabaseError) {
          console.log('Supabase error on delete goal, continuing with local deletion:', supabaseError);
        }
      }
      
      setGoals(prev => prev.filter(goal => goal.id !== id));
    } catch (error) {
      console.error('Error deleting goal:', error);
      setError(error.message);
    }
  };

  return {
    goals,
    loading,
    error,
    createGoal,
    updateGoal,
    deleteGoal,
    refetch: fetchGoals,
  };
}