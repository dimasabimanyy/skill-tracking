-- Add skill_content table for flexible content management
-- Structure: Skills > Content Blocks (text, code, resources, etc.)

-- Skill Content table - flexible content blocks under each skill
CREATE TABLE IF NOT EXISTS skill_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
  type VARCHAR(50) DEFAULT 'text' CHECK (type IN ('text', 'code', 'resource', 'image', 'video')),
  title VARCHAR(255) NOT NULL,
  content TEXT,
  metadata JSONB, -- For additional type-specific data
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for skill_content
ALTER TABLE skill_content ENABLE ROW LEVEL SECURITY;

-- Skill Content policies
DROP POLICY IF EXISTS "Users can view their own skill content" ON skill_content;
CREATE POLICY "Users can view their own skill content" ON skill_content
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own skill content" ON skill_content;
CREATE POLICY "Users can insert their own skill content" ON skill_content
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own skill content" ON skill_content;
CREATE POLICY "Users can update their own skill content" ON skill_content
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own skill content" ON skill_content;
CREATE POLICY "Users can delete their own skill content" ON skill_content
  FOR DELETE USING (auth.uid() = user_id);

-- Trigger for updated_at
DROP TRIGGER IF EXISTS update_skill_content_updated_at ON skill_content;
CREATE TRIGGER update_skill_content_updated_at 
  BEFORE UPDATE ON skill_content 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS skill_content_user_id_idx ON skill_content(user_id);
CREATE INDEX IF NOT EXISTS skill_content_skill_id_idx ON skill_content(skill_id);
CREATE INDEX IF NOT EXISTS skill_content_type_idx ON skill_content(type);
CREATE INDEX IF NOT EXISTS skill_content_order_idx ON skill_content(order_index);
CREATE INDEX IF NOT EXISTS skill_content_created_at_idx ON skill_content(created_at DESC);