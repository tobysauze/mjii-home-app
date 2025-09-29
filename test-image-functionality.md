# Daily Work List - Image & Archive Functionality Test Guide

## Setup Instructions

1. **Run the database setup scripts**:
   - Open your Supabase dashboard
   - Go to SQL Editor
   - Run the contents of `supabase-daily-jobs-setup.sql` (updated with archive fields)
   - Run the contents of `supabase-daily-jobs-images-setup.sql`

2. **Verify the setup**:
   - Check that the `daily_jobs` table has `completed_at` and `archived` columns
   - Check that the `daily_job_images` table was created
   - Verify the `daily-job-images` storage bucket exists
   - Confirm the storage policies are in place

## Testing Steps

### 1. Basic Image Upload
1. Open the daily work list page
2. Fill out a new job form
3. Click "Choose Files" and select one or more images
4. Verify image previews appear below the file input
5. Submit the job
6. Check that images appear in the job card

### 2. Image Display and Interaction
1. Click on any image in a job card
2. Verify the image opens in a modal overlay
3. Click outside the image or the X button to close
4. Verify images are properly sized and displayed

### 3. Image Editing
1. Click "Edit" on a job with images
2. Verify existing images show in the preview area
3. Add new images or remove existing ones
4. Submit the changes
5. Verify the updated images display correctly

### 4. Cross-Device Sync
1. Add a job with images on one device
2. Open the daily work list on another device
3. Click "Sync Now" or wait for auto-sync
4. Verify the job and images appear on the second device
5. Test editing images on the second device
6. Verify changes sync back to the first device

### 5. Image Deletion
1. Edit a job and remove an image using the X button
2. Verify the image is removed from the preview
3. Submit the changes
4. Verify the image no longer appears in the job card
5. Delete an entire job with images
6. Verify all associated images are cleaned up

### 6. Archive Functionality
1. Complete a job by clicking the "Complete" button
2. Verify the job disappears from the main list
3. Click "Show Archive" to reveal the archive section
4. Verify the completed job appears in the archive with completion date
5. Verify images are still visible in archived jobs
6. Click "Undo" on an archived job to move it back to active list

### 7. Archive Management
1. Complete multiple jobs to build up the archive
2. Verify all completed jobs appear in the archive with proper dates
3. Test the "Clear Archive" button (be careful - this deletes all archived jobs)
4. Verify the archive can be toggled open/closed
5. Test archive functionality on mobile devices

### 8. Cross-Device Archive Sync
1. Complete jobs on one device
2. Open the daily work list on another device
3. Click "Sync Now" or wait for auto-sync
4. Verify completed jobs appear in the archive on the second device
5. Test completing jobs on the second device
6. Verify archive changes sync back to the first device

## Expected Behavior

### Images:
- Images should upload and display immediately
- All images should sync across devices automatically
- Image previews should show before submission
- Clicking images should open them in a modal
- Removing images should work both during editing and job deletion
- Upload progress should be indicated during image uploads

### Archive:
- Completed jobs should automatically move to archive
- Archive should show completion date and time
- Archived jobs should retain all images and details
- Archive can be toggled open/closed
- "Undo" should move jobs back to active list
- Archive should sync across all devices
- Clear Archive should permanently delete all archived jobs

## Troubleshooting

If images don't appear:
1. Check browser console for errors
2. Verify Supabase storage bucket exists and is public
3. Check that the database tables were created correctly
4. Ensure the Supabase client is properly configured

If sync doesn't work:
1. Check internet connection
2. Verify Supabase credentials are correct
3. Check browser console for sync errors
4. Try manual sync using the "Sync Now" button
