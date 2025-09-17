-- Add new columns to episodes table
ALTER TABLE episodes 
ADD COLUMN IF NOT EXISTS author TEXT,
ADD COLUMN IF NOT EXISTS category TEXT,
ADD COLUMN IF NOT EXISTS read_time TEXT,
ADD COLUMN IF NOT EXISTS likes INTEGER;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_episodes_language ON episodes(language_code);
CREATE INDEX IF NOT EXISTS idx_episodes_published ON episodes(is_published);
CREATE INDEX IF NOT EXISTS idx_episodes_category ON episodes(category);