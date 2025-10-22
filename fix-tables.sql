-- Step-by-step table creation and migration
-- This handles existing tables safely

-- Step 1: Create goals table if it doesn't exist
CREATE TABLE IF NOT EXISTS goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  target_date DATE,
  estimated_duration_weeks INTEGER,
  is_achieved BOOLEAN DEFAULT FALSE,
  achievement_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 2: Check if skills table exists and modify it
DO $$ 
BEGIN
    -- If skills table doesn't exist, create it with all columns
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'skills') THEN
        CREATE TABLE skills (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
          goal_id UUID REFERENCES goals(id) ON DELETE CASCADE,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          status VARCHAR(20) DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'done')),
          target_date DATE,
          estimated_duration_days INTEGER,
          order_in_roadmap INTEGER DEFAULT 0,
          notes TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          last_reviewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
    ELSE
        -- Skills table exists, add missing columns one by one
        BEGIN
            ALTER TABLE skills ADD COLUMN goal_id UUID;
        EXCEPTION WHEN duplicate_column THEN
            -- Column already exists, skip
        END;
        
        BEGIN
            ALTER TABLE skills ADD COLUMN estimated_duration_days INTEGER;
        EXCEPTION WHEN duplicate_column THEN
            -- Column already exists, skip
        END;
        
        BEGIN
            ALTER TABLE skills ADD COLUMN order_in_roadmap INTEGER DEFAULT 0;
        EXCEPTION WHEN duplicate_column THEN
            -- Column already exists, skip
        END;
        
        BEGIN
            ALTER TABLE skills ADD COLUMN last_reviewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        EXCEPTION WHEN duplicate_column THEN
            -- Column already exists, skip
        END;
        
        BEGIN
            ALTER TABLE skills ADD COLUMN notes TEXT;
        EXCEPTION WHEN duplicate_column THEN
            -- Column already exists, skip
        END;
        
        -- Add foreign key constraint if it doesn't exist
        BEGIN
            ALTER TABLE skills ADD CONSTRAINT skills_goal_id_fkey FOREIGN KEY (goal_id) REFERENCES goals(id) ON DELETE CASCADE;
        EXCEPTION WHEN duplicate_object THEN
            -- Constraint already exists, skip
        END;
    END IF;
END $$;

-- Step 3: Enable RLS
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

-- Step 4: Create policies (drop existing first)
DROP POLICY IF EXISTS "Users can view their own goals" ON goals;
DROP POLICY IF EXISTS "Users can insert their own goals" ON goals;
DROP POLICY IF EXISTS "Users can update their own goals" ON goals;
DROP POLICY IF EXISTS "Users can delete their own goals" ON goals;

CREATE POLICY "Users can view their own goals" ON goals
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own goals" ON goals
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own goals" ON goals
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own goals" ON goals
  FOR DELETE USING (auth.uid() = user_id);

-- Skills policies
DROP POLICY IF EXISTS "Users can view their own skills" ON skills;
DROP POLICY IF EXISTS "Users can insert their own skills" ON skills;
DROP POLICY IF EXISTS "Users can update their own skills" ON skills;
DROP POLICY IF EXISTS "Users can delete their own skills" ON skills;

CREATE POLICY "Users can view their own skills" ON skills
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own skills" ON skills
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own skills" ON skills
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own skills" ON skills
  FOR DELETE USING (auth.uid() = user_id);

-- Step 5: Create trigger function and triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_goals_updated_at ON goals;
DROP TRIGGER IF EXISTS update_skills_updated_at ON skills;

CREATE TRIGGER update_goals_updated_at 
  BEFORE UPDATE ON goals 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_skills_updated_at 
  BEFORE UPDATE ON skills 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Step 6: Create indexes
CREATE INDEX IF NOT EXISTS goals_user_id_idx ON goals(user_id);
CREATE INDEX IF NOT EXISTS goals_created_at_idx ON goals(created_at DESC);
CREATE INDEX IF NOT EXISTS skills_user_id_idx ON skills(user_id);
CREATE INDEX IF NOT EXISTS skills_goal_id_idx ON skills(goal_id);
CREATE INDEX IF NOT EXISTS skills_status_idx ON skills(status);
CREATE INDEX IF NOT EXISTS skills_order_idx ON skills(order_in_roadmap);
CREATE INDEX IF NOT EXISTS skills_created_at_idx ON skills(created_at DESC);