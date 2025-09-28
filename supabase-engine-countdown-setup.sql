-- Create engine_countdown table for MJII Engine Start Countdown
-- Run this in your Supabase SQL editor

CREATE TABLE IF NOT EXISTS engine_countdown (
  id TEXT PRIMARY KEY DEFAULT 'main_engine',
  last_started TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE engine_countdown ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read/write access
-- (This is safe for an engine countdown app)
CREATE POLICY "Allow public access to engine_countdown" ON engine_countdown
  FOR ALL USING (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_engine_countdown_updated_at 
  BEFORE UPDATE ON engine_countdown 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Insert initial record if it doesn't exist
INSERT INTO engine_countdown (id, last_started) 
VALUES ('main_engine', NULL) 
ON CONFLICT (id) DO NOTHING;
