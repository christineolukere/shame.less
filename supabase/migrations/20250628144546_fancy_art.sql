/*
  # Create AI Letters table

  1. New Tables
    - `ai_letters`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to profiles)
      - `guest_session_id` (text, for guest users)
      - `letter_content` (text, the AI-generated letter)
      - `source_content` (text, the original content that prompted the letter)
      - `source_type` (text, type of source: journal, checkin, win)
      - `emotion` (text, optional emotion context)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `ai_letters` table
    - Add policies for authenticated users to manage their own letters
    - Add constraint to ensure either user_id or guest_session_id is provided

  3. Indexes
    - Add indexes for user_id, guest_session_id, and created_at for performance
*/

-- Create ai_letters table
CREATE TABLE IF NOT EXISTS ai_letters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  guest_session_id text,
  letter_content text NOT NULL,
  source_content text NOT NULL,
  source_type text NOT NULL CHECK (source_type IN ('journal', 'checkin', 'win')),
  emotion text,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT check_user_or_guest CHECK (
    (user_id IS NOT NULL AND guest_session_id IS NULL) OR 
    (user_id IS NULL AND guest_session_id IS NOT NULL)
  )
);

-- Enable RLS on ai_letters
ALTER TABLE ai_letters ENABLE ROW LEVEL SECURITY;

-- Create policies for ai_letters
CREATE POLICY "Users can read own AI letters"
  ON ai_letters
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own AI letters"
  ON ai_letters
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own AI letters"
  ON ai_letters
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own AI letters"
  ON ai_letters
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_ai_letters_user_id ON ai_letters(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_letters_guest_session ON ai_letters(guest_session_id);
CREATE INDEX IF NOT EXISTS idx_ai_letters_created_at ON ai_letters(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_letters_source_type ON ai_letters(source_type);