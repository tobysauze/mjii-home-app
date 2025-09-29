-- Add image support to daily_jobs table for MJII Daily Work List
-- Run this in your Supabase SQL editor after the main daily_jobs setup

-- Create images table to store image metadata
CREATE TABLE IF NOT EXISTS daily_job_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id TEXT NOT NULL REFERENCES daily_jobs(id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  original_name TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  uploaded_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE daily_job_images ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read/write access
CREATE POLICY "Allow public access to daily_job_images" ON daily_job_images
  FOR ALL USING (true);

-- Create updated_at trigger for images table
CREATE TRIGGER update_daily_job_images_updated_at 
  BEFORE UPDATE ON daily_job_images 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Create storage bucket for daily job images
INSERT INTO storage.buckets (id, name, public)
VALUES ('daily-job-images', 'daily-job-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policy to allow public access to images
CREATE POLICY "Allow public access to daily job images" ON storage.objects
  FOR ALL USING (bucket_id = 'daily-job-images');

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_daily_job_images_job_id ON daily_job_images(job_id);
CREATE INDEX IF NOT EXISTS idx_daily_job_images_created_at ON daily_job_images(created_at);
