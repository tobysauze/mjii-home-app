-- Create daily_jobs table for MJII Daily Work List
-- Run this in your Supabase SQL editor

CREATE TABLE IF NOT EXISTS daily_jobs (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'medium',
  assigned_to TEXT,
  estimated_time TEXT,
  description TEXT,
  completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE daily_jobs ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read/write access
-- (This is safe for a work list app)
CREATE POLICY "Allow public access to daily_jobs" ON daily_jobs
  FOR ALL USING (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_daily_jobs_updated_at 
  BEFORE UPDATE ON daily_jobs 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();
