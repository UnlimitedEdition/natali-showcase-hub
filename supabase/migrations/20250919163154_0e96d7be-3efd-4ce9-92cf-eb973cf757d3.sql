-- Fix for the type mismatches - ensure tables exist as expected
-- This will regenerate the types to match the current database schema

-- Check if tables have the correct columns
DO $$
BEGIN
    -- Add missing columns if they don't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'gdpr_consents' AND column_name = 'user_identifier') THEN
        ALTER TABLE gdpr_consents ADD COLUMN user_identifier TEXT NOT NULL DEFAULT '';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'guest_requests' AND column_name = 'language_code') THEN
        ALTER TABLE guest_requests ADD COLUMN language_code TEXT NOT NULL DEFAULT 'sr';
    END IF;
END
$$;