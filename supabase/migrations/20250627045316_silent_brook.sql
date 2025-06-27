/*
  # Enhanced Journal System with Media Support

  1. New Tables
    - journal_media table for storing references to uploaded audio/photo files
      - id (uuid, primary key)
      - journal_entry_id (uuid, foreign key to journal_entries)
      - user_id (uuid, foreign key to profiles)
      - media_type (text: 'audio', 'photo')
      - file_path (text: path in Supabase Storage)
      - file_name (text: original filename)
      - file_size (integer: file size in bytes)
      - mime_type (text: MIME type)
      - duration (integer: for audio files, duration in seconds)
      - created_at (timestamp)

  2. Updates to Existing Tables
    - Add title column to journal_entries
    - Add mood_rating column for optional mood tracking
    - Add is_flagged column for content moderation

  3. Security
    - Enable RLS on new table
    - Add policies for user data access
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

-- Enable RLS on journal_media
ALTER TABLE journal_media ENABLE ROW LEVEL SECURITY;

-- Create policies for journal_media
CREATE POLICY "Users can read own media"
  ON journal_media
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own media"
  ON journal_media
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own media"
  ON journal_media
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own media"
  ON journal_media
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_journal_media_entry_id ON journal_media(journal_entry_id);
CREATE INDEX IF NOT EXISTS idx_journal_media_user_id ON journal_media(user_id);
CREATE INDEX IF NOT EXISTS idx_journal_media_type ON journal_media(media_type);
CREATE INDEX IF NOT EXISTS idx_journal_entries_title ON journal_entries(title);
CREATE INDEX IF NOT EXISTS idx_journal_entries_mood_rating ON journal_entries(mood_rating);