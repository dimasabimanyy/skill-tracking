'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export function useSkills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock data for development (remove when Supabase is connected)
  const mockSkills = [
    {
      id: '1',
      title: 'React Hooks',
      description: 'Learning advanced React hooks patterns and custom hooks',
      status: 'in_progress',
      target_date: '2024-12-31',
      notes: 'Focusing on useContext and useReducer patterns',
      created_at: '2024-10-01T00:00:00Z',
      updated_at: '2024-10-15T00:00:00Z',
      last_reviewed_at: '2024-10-15T00:00:00Z'
    },
    {
      id: '2',
      title: 'Node.js Performance',
      description: 'Understanding Node.js performance optimization techniques',
      status: 'not_started',
      target_date: '2024-11-30',
      notes: '',
      created_at: '2024-10-05T00:00:00Z',
      updated_at: '2024-10-05T00:00:00Z',
      last_reviewed_at: '2024-10-05T00:00:00Z'
    },
    {
      id: '3',
      title: 'TypeScript Advanced Types',
      description: 'Mastering conditional types, mapped types, and template literals',
      status: 'done',
      target_date: '2024-10-20',
      notes: 'Completed the official TypeScript handbook',
      created_at: '2024-09-15T00:00:00Z',
      updated_at: '2024-10-20T00:00:00Z',
      last_reviewed_at: '2024-10-20T00:00:00Z'
    }
  ];

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      
      // Try to fetch from Supabase first
      if (supabase) {
        try {
          const { data, error } = await supabase
            .from('skills')
            .select('*')
            .order('created_at', { ascending: false });
          
          if (error) throw error;
          setSkills(data || []);
        } catch (supabaseError) {
          console.log('Supabase error, using mock data:', supabaseError);
          setSkills(mockSkills);
        }
      } else {
        console.log('Supabase not configured, using mock data');
        setSkills(mockSkills);
      }
    } catch (error) {
      console.error('Error fetching skills:', error);
      setError(error.message);
      setSkills(mockSkills); // Use mock data as fallback
    } finally {
      setLoading(false);
    }
  };

  const createSkill = async (skillData = {}) => {
    try {
      const newSkill = {
        id: Date.now().toString(), // Temporary ID for mock
        title: skillData.title || 'New Skill',
        description: skillData.description || '',
        status: 'not_started',
        target_date: skillData.target_date || null,
        notes: '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_reviewed_at: new Date().toISOString(),
      };

      if (supabase) {
        try {
          const { data, error } = await supabase
            .from('skills')
            .insert([newSkill])
            .select();

          if (error) throw error;
          setSkills(prev => [data[0], ...prev]);
          return data[0];
        } catch (supabaseError) {
          console.log('Supabase error on create, using local state:', supabaseError);
          setSkills(prev => [newSkill, ...prev]);
          return newSkill;
        }
      } else {
        // Fallback to local state update
        setSkills(prev => [newSkill, ...prev]);
        return newSkill;
      }
    } catch (error) {
      console.error('Error creating skill:', error);
      setError(error.message);
    }
  };

  const updateSkill = async (id, updates) => {
    try {
      const updatedData = {
        ...updates,
        updated_at: new Date().toISOString(),
        last_reviewed_at: new Date().toISOString(),
      };

      if (supabase) {
        try {
          const { data, error } = await supabase
            .from('skills')
            .update(updatedData)
            .eq('id', id)
            .select();

          if (error) throw error;
          setSkills(prev => prev.map(skill => 
            skill.id === id ? data[0] : skill
          ));
          return data[0];
        } catch (supabaseError) {
          console.log('Supabase error on update, using local state:', supabaseError);
          setSkills(prev => prev.map(skill => 
            skill.id === id ? { ...skill, ...updatedData } : skill
          ));
          return { id, ...updatedData };
        }
      } else {
        // Fallback to local state update
        setSkills(prev => prev.map(skill => 
          skill.id === id ? { ...skill, ...updatedData } : skill
        ));
        return { id, ...updatedData };
      }
    } catch (error) {
      console.error('Error updating skill:', error);
      setError(error.message);
    }
  };

  const deleteSkill = async (id) => {
    try {
      if (supabase) {
        try {
          const { error } = await supabase
            .from('skills')
            .delete()
            .eq('id', id);

          if (error) throw error;
        } catch (supabaseError) {
          console.log('Supabase error on delete, continuing with local deletion:', supabaseError);
        }
      }
      
      setSkills(prev => prev.filter(skill => skill.id !== id));
    } catch (error) {
      console.error('Error deleting skill:', error);
      setError(error.message);
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