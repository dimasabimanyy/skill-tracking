'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { generateSkillsForGoal } from '@/lib/skillTemplates';

export function useGoals() {
  const { user, isAuthenticated, isConfigured } = useAuth();
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock data only for demo mode (when not authenticated)
  const mockGoals = !isAuthenticated ? [
    {
      id: 'demo-1',
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
    }
  ] : [];

  useEffect(() => {
    fetchGoals();
  }, [user, isAuthenticated, isConfigured]);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      
      // If not configured, use mock data
      if (!isConfigured) {
        console.log('Using mock goals data - Supabase not configured');
        setGoals(mockGoals);
        setLoading(false);
        return;
      }

      // If not authenticated, return empty array for real mode
      if (!isAuthenticated) {
        console.log('Not authenticated - showing empty state');
        setGoals([]);
        setLoading(false);
        return;
      }
      
      // Fetch from Supabase for authenticated users
      if (supabase && user) {
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
        
        if (error) {
          console.error('Supabase error:', error);
          setError(error.message);
          setGoals([]);
          return;
        }
        
        // Add skills count and completed count
        const goalsWithStats = (data || []).map(goal => ({
          ...goal,
          skills_count: goal.skills?.length || 0,
          completed_skills: goal.skills?.filter(skill => skill.status === 'done').length || 0
        }));
        
        setGoals(goalsWithStats);
      }
    } catch (error) {
      console.error('Error fetching goals:', error);
      setError(error.message);
      setGoals([]);
    } finally {
      setLoading(false);
    }
  };

  const createGoal = async (goalData = {}) => {
    try {
      // Must be authenticated and configured for real goal creation
      if (!isConfigured || !isAuthenticated || !user) {
        throw new Error('Must be authenticated to create goals');
      }

      // Create goal in Supabase
      const { data: goalData_created, error: goalError } = await supabase
        .from('goals')
        .insert([{
          user_id: user.id,
          title: goalData.title || 'New Goal',
          description: goalData.description || '',
          target_date: goalData.target_date || null,
          estimated_duration_weeks: goalData.estimated_duration_weeks || null,
        }])
        .select();

      if (goalError) throw goalError;

      const newGoal = goalData_created[0];

      // Generate template skills for this goal
      const templateSkills = generateSkillsForGoal(newGoal.title, newGoal.id, user.id);
      
      if (templateSkills.length > 0) {
        // Insert template skills into Supabase
        const skillsToInsert = templateSkills.map(skill => ({
          user_id: skill.user_id,
          goal_id: skill.goal_id,
          title: skill.title,
          description: skill.description,
          estimated_duration_days: skill.estimated_duration_days,
          order_in_roadmap: skill.order_in_roadmap,
          status: 'not_started'
        }));

        const { error: skillsError } = await supabase
          .from('skills')
          .insert(skillsToInsert);

        if (skillsError) {
          console.error('Error creating template skills:', skillsError);
          // Continue anyway - goal was created successfully
        }
      }

      // Add stats to goal object
      const goalWithStats = { 
        ...newGoal, 
        skills_count: templateSkills.length,
        completed_skills: 0 
      };
      
      setGoals(prev => [goalWithStats, ...prev]);
      return goalWithStats;
    } catch (error) {
      console.error('Error creating goal:', error);
      setError(error.message);
      throw error;
    }
  };

  const updateGoal = async (id, updates) => {
    try {
      if (!isConfigured || !isAuthenticated || !user) {
        throw new Error('Must be authenticated to update goals');
      }

      const updatedData = {
        ...updates,
        updated_at: new Date().toISOString(),
      };

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
    } catch (error) {
      console.error('Error updating goal:', error);
      setError(error.message);
      throw error;
    }
  };

  const deleteGoal = async (id) => {
    try {
      if (!isConfigured || !isAuthenticated || !user) {
        throw new Error('Must be authenticated to delete goals');
      }

      const { error } = await supabase
        .from('goals')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      
      setGoals(prev => prev.filter(goal => goal.id !== id));
    } catch (error) {
      console.error('Error deleting goal:', error);
      setError(error.message);
      throw error;
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