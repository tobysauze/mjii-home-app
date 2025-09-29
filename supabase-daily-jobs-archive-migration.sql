-- Migration script to add archive functionality to existing daily_jobs table
-- Run this in your Supabase SQL editor if you already have the daily_jobs table

-- Add archive columns if they don't exist
ALTER TABLE daily_jobs 
ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS archived BOOLEAN NOT NULL DEFAULT false;

-- Create indexes for better performance on archive queries
CREATE INDEX IF NOT EXISTS idx_daily_jobs_archived ON daily_jobs(archived);
CREATE INDEX IF NOT EXISTS idx_daily_jobs_completed_at ON daily_jobs(completed_at);

-- Update existing completed jobs to be archived
UPDATE daily_jobs 
SET archived = true, completed_at = updated_at 
WHERE completed = true AND archived = false;

-- Verify the changes
SELECT 
  id, 
  title, 
  completed, 
  completed_at, 
  archived, 
  created_at, 
  updated_at 
FROM daily_jobs 
ORDER BY created_at DESC 
LIMIT 10;
