-- Create translations table
CREATE TABLE IF NOT EXISTS translations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL,
  language_code TEXT NOT NULL,
  value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create unique index for key-language_code combination
CREATE UNIQUE INDEX IF NOT EXISTS translations_key_language_code_idx 
  ON translations (key, language_code);

-- Add RLS policies
ALTER TABLE translations ENABLE ROW LEVEL SECURITY;

-- Allow public read access to translations
CREATE POLICY "Allow public read access to translations"
  ON translations FOR SELECT
  USING (true);

-- Allow admin/editor users to insert translations
CREATE POLICY "Allow admin/editor insert"
  ON translations FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.user_id = auth.uid() 
      AND profiles.role IN ('admin', 'editor')
    )
  );

-- Allow admin/editor users to update translations
CREATE POLICY "Allow admin/editor update"
  ON translations FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.user_id = auth.uid() 
      AND profiles.role IN ('admin', 'editor')
    )
  );

-- Allow admin users to delete translations
CREATE POLICY "Allow admin delete"
  ON translations FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.user_id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Grant permissions
GRANT SELECT ON translations TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON translations TO authenticated;