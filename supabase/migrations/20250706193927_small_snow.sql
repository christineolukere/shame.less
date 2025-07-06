/*
  # Journal Media and Enhanced Journal Entries - Fixed Migration

  1. New Columns for journal_entries
    - `title` (text, optional) - User-defined title for journal entries
    - `mood_rating` (integer, 1-5) - Optional mood rating scale
    - `is_flagged` (boolean) - Safety flag for content moderation

  2. New Tables
    - `journal_media`
      - `id` (uuid, primary key)
      - `journal_entry_id` (uuid, foreign key to journal_entries)
      - `user_id` (uuid, foreign key to profiles)
      - `media_type` (text) - 'audio' or 'photo'
      - `file_path` (text) - Storage path for the media file
      - `file_name` (text) - Original filename
      - `file_size` (integer) - File size in bytes
      - `mime_type` (text) - MIME type of the file
      - `duration` (integer, optional) - Duration in seconds for audio files
      - `created_at` (timestamptz) - Creation timestamp

  3. Security
    - Enable RLS on `journal_media` table
    - Add policies for authenticated users to manage their own media
    - Create indexes for optimal performance
*/

-- Add new columns to journal_entries table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'journal_entries' AND column_name = 'title'
  ) THEN
    ALTER TABLE journal_entries ADD COLUMN title text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'journal_entries' AND column_name = 'mood_rating'
  ) THEN
    ALTER TABLE journal_entries ADD COLUMN mood_rating integer CHECK (mood_rating >= 1 AND mood_rating <= 5);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'journal_entries' AND column_name = 'is_flagged'
  ) THEN
    ALTER TABLE journal_entries ADD COLUMN is_flagged boolean DEFAULT false;
  END IF;
END $$;

-- Create journal_media table
CREATE TABLE IF NOT EXISTS journal_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  journal_entry_id uuid REFERENCES journal_entries(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  media_type text NOT NULL CHECK (media_type IN ('audio', 'photo')),
  file_path text NOT NULL,
  file_name text NOT NULL,
  file_size integer NOT NULL,
  mime_type text NOT NULL,
  duration integer, -- For audio files, duration in seconds
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on journal_media (only if not already enabled)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE tablename = 'journal_media' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE journal_media ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Create policies for journal_media (with existence checks)
DO $$
BEGIN
  -- Policy for SELECT
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'journal_media' 
    AND policyname = 'Users can read own media'
  ) THEN
    CREATE POLICY "Users can read own media"
      ON journal_media
      FOR SELECT
      TO authenticated
      USING (user_id = auth.uid());
  END IF;

  -- Policy for INSERT
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'journal_media' 
    AND policyname = 'Users can insert own media'
  ) THEN
    CREATE POLICY "Users can insert own media"
      ON journal_media
      FOR INSERT
      TO authenticated
      WITH CHECK (user_id = auth.uid());
  END IF;

  -- Policy for UPDATE
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'journal_media' 
    AND policyname = 'Users can update own media'
  ) THEN
    CREATE POLICY "Users can update own media"
      ON journal_media
      FOR UPDATE
      TO authenticated
      USING (user_id = auth.uid());
  END IF;

  -- Policy for DELETE
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'journal_media' 
    AND policyname = 'Users can delete own media'
  ) THEN
    CREATE POLICY "Users can delete own media"
      ON journal_media
      FOR DELETE
      TO authenticated
      USING (user_id = auth.uid());
  END IF;
END $$;

-- Create indexes for better performance (with existence checks)
DO $$
BEGIN
  -- Index on journal_entry_id
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_journal_media_entry_id'
  ) THEN
    CREATE INDEX idx_journal_media_entry_id ON journal_media(journal_entry_id);
  END IF;

  -- Index on user_id
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_journal_media_user_id'
  ) THEN
    CREATE INDEX idx_journal_media_user_id ON journal_media(user_id);
  END IF;

  -- Index on media_type
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_journal_media_type'
  ) THEN
    CREATE INDEX idx_journal_media_type ON journal_media(media_type);
  END IF;

  -- Index on journal_entries title
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_journal_entries_title'
  ) THEN
    CREATE INDEX idx_journal_entries_title ON journal_entries(title);
  END IF;

  -- Index on journal_entries mood_rating
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_journal_entries_mood_rating'
  ) THEN
    CREATE INDEX idx_journal_entries_mood_rating ON journal_entries(mood_rating);
  END IF;
END $$;