-- Add photo_url and purchase_url columns to existing shopping_items table
-- Run this in your Supabase SQL editor

-- Add new columns to the shopping_items table
ALTER TABLE shopping_items 
ADD COLUMN IF NOT EXISTS photo_url TEXT,
ADD COLUMN IF NOT EXISTS purchase_url TEXT;

-- Update existing records to have empty strings for the new fields (if needed)
UPDATE shopping_items 
SET photo_url = '' 
WHERE photo_url IS NULL;

UPDATE shopping_items 
SET purchase_url = '' 
WHERE purchase_url IS NULL;

