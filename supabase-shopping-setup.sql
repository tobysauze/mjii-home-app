-- Create shopping_items table for MJII Shopping List
-- Run this in your Supabase SQL editor

CREATE TABLE IF NOT EXISTS shopping_items (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  quantity TEXT NOT NULL DEFAULT '1',
  category TEXT NOT NULL DEFAULT 'other',
  priority TEXT NOT NULL DEFAULT 'low',
  purchased BOOLEAN NOT NULL DEFAULT false,
  added_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE shopping_items ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read/write access
-- (This is safe for a shopping list app)
CREATE POLICY "Allow public access to shopping_items" ON shopping_items
  FOR ALL USING (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_shopping_items_updated_at 
  BEFORE UPDATE ON shopping_items 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();
