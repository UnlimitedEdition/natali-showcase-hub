-- Add new columns to content table for kitchen and stories sections
ALTER TABLE content 
ADD COLUMN IF NOT EXISTS read_time TEXT,
ADD COLUMN IF NOT EXISTS author TEXT,
ADD COLUMN IF NOT EXISTS category TEXT,
ADD COLUMN IF NOT EXISTS difficulty TEXT,
ADD COLUMN IF NOT EXISTS servings TEXT,
ADD COLUMN IF NOT EXISTS rating NUMERIC(3,2),
ADD COLUMN IF NOT EXISTS likes INTEGER;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_content_page_section ON content(page_key, section_key);
CREATE INDEX IF NOT EXISTS idx_content_language ON content(language_code);
CREATE INDEX IF NOT EXISTS idx_content_published ON content(is_published);