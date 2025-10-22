-- Migration script to update existing tables
-- Run this if you already have tables but need to add missing columns

-- Add missing columns to skills table if they don't exist
DO $$ 
BEGIN
    -- Add goal_id column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'skills' AND column_name = 'goal_id') THEN
        ALTER TABLE skills ADD COLUMN goal_id UUID REFERENCES goals(id) ON DELETE CASCADE;
    END IF;
    
    -- Add estimated_duration_days column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'skills' AND column_name = 'estimated_duration_days') THEN
        ALTER TABLE skills ADD COLUMN estimated_duration_days INTEGER;
    END IF;
    
    -- Add order_in_roadmap column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'skills' AND column_name = 'order_in_roadmap') THEN
        ALTER TABLE skills ADD COLUMN order_in_roadmap INTEGER DEFAULT 0;
    END IF;
    
    -- Add last_reviewed_at column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'skills' AND column_name = 'last_reviewed_at') THEN
        ALTER TABLE skills ADD COLUMN last_reviewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;

-- Add missing columns to goals table if they don't exist
DO $$ 
BEGIN
    -- Add estimated_duration_weeks column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'goals' AND column_name = 'estimated_duration_weeks') THEN
        ALTER TABLE goals ADD COLUMN estimated_duration_weeks INTEGER;
    END IF;
    
    -- Add is_achieved column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'goals' AND column_name = 'is_achieved') THEN
        ALTER TABLE goals ADD COLUMN is_achieved BOOLEAN DEFAULT FALSE;
    END IF;
    
    -- Add achievement_notes column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'goals' AND column_name = 'achievement_notes') THEN
        ALTER TABLE goals ADD COLUMN achievement_notes TEXT;
    END IF;
END $$;

-- Enable RLS if not already enabled
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

-- Drop and recreate policies to ensure they're correct
DROP POLICY IF EXISTS "Users can view their own goals" ON goals;
CREATE POLICY "Users can view their own goals" ON goals
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own goals" ON goals;
CREATE POLICY "Users can insert their own goals" ON goals
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own goals" ON goals;
CREATE POLICY "Users can update their own goals" ON goals
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own goals" ON goals;
CREATE POLICY "Users can delete their own goals" ON goals
  FOR DELETE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view their own skills" ON skills;
CREATE POLICY "Users can view their own skills" ON skills
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own skills" ON skills;
CREATE POLICY "Users can insert their own skills" ON skills
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own skills" ON skills;
CREATE POLICY "Users can update their own skills" ON skills
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own skills" ON skills;
CREATE POLICY "Users can delete their own skills" ON skills
  FOR DELETE USING (auth.uid() = user_id);

-- Create or replace the trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop and recreate triggers
DROP TRIGGER IF EXISTS update_goals_updated_at ON goals;
CREATE TRIGGER update_goals_updated_at 
  BEFORE UPDATE ON goals 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_skills_updated_at ON skills;
CREATE TRIGGER update_skills_updated_at 
  BEFORE UPDATE ON skills 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS goals_user_id_idx ON goals(user_id);
CREATE INDEX IF NOT EXISTS goals_created_at_idx ON goals(created_at DESC);
CREATE INDEX IF NOT EXISTS skills_user_id_idx ON skills(user_id);
CREATE INDEX IF NOT EXISTS skills_goal_id_idx ON skills(goal_id);
CREATE INDEX IF NOT EXISTS skills_status_idx ON skills(status);
CREATE INDEX IF NOT EXISTS skills_order_idx ON skills(order_in_roadmap);
CREATE INDEX IF NOT EXISTS skills_created_at_idx ON skills(created_at DESC);