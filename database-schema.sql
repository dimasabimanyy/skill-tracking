-- Goals table for tracking learning objectives
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

-- Updated Skills table with goal relationship
CREATE TABLE IF NOT EXISTS skills (
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

-- Enable RLS (Row Level Security)
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

-- Create policies for Goals
CREATE POLICY "Users can view their own goals" ON goals
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own goals" ON goals
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own goals" ON goals
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own goals" ON goals
  FOR DELETE USING (auth.uid() = user_id);

-- Create policies for Skills
CREATE POLICY "Users can view their own skills" ON skills
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own skills" ON skills
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own skills" ON skills
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own skills" ON skills
  FOR DELETE USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_goals_updated_at 
  BEFORE UPDATE ON goals 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

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