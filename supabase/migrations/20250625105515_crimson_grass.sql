/*
  # Create application data tables

  1. New Tables
    - `check_ins`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles, nullable for guest users)
      - `guest_session_id` (text, for guest users)
      - `mood` (text)
      - `color` (text)
      - `notes` (text, optional)
      - `created_at` (timestamp)
    
    - `wins`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles, nullable for guest users)
      - `guest_session_id` (text, for guest users)
      - `text` (text)
      - `category` (text)
      - `created_at` (timestamp)
    
    - `journal_entries`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles, nullable for guest users)
      - `guest_session_id` (text, for guest users)
      - `content` (text)
      - `prompt` (text, optional)
      - `entry_type` (text, default 'text')
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Add policies for guest users using session IDs
*/

-- Create check_ins table
CREATE TABLE IF NOT EXISTS check_ins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  guest_session_id text,
  mood text NOT NULL,
  color text NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT check_user_or_guest CHECK (
    (user_id IS NOT NULL AND guest_session_id IS NULL) OR
    (user_id IS NULL AND guest_session_id IS NOT NULL)
  )
);

-- Create wins table
CREATE TABLE IF NOT EXISTS wins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  guest_session_id text,
  text text NOT NULL,
  category text NOT NULL DEFAULT 'self-care',
  created_at timestamptz DEFAULT now(),
  CONSTRAINT check_user_or_guest CHECK (
    (user_id IS NOT NULL AND guest_session_id IS NULL) OR
    (user_id IS NULL AND guest_session_id IS NOT NULL)
  )
);

-- Create journal_entries table
CREATE TABLE IF NOT EXISTS journal_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  guest_session_id text,
  content text NOT NULL,
  prompt text,
  entry_type text DEFAULT 'text',
  created_at timestamptz DEFAULT now(),
  CONSTRAINT check_user_or_guest CHECK (
    (user_id IS NOT NULL AND guest_session_id IS NULL) OR
    (user_id IS NULL AND guest_session_id IS NOT NULL)
  )
);

-- Enable RLS
ALTER TABLE check_ins ENABLE ROW LEVEL SECURITY;
ALTER TABLE wins ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;

-- Check-ins policies
CREATE POLICY "Users can read own check-ins"
  ON check_ins
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own check-ins"
  ON check_ins
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own check-ins"
  ON check_ins
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own check-ins"
  ON check_ins
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Wins policies
CREATE POLICY "Users can read own wins"
  ON wins
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own wins"
  ON wins
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own wins"
  ON wins
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own wins"
  ON wins
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Journal entries policies
CREATE POLICY "Users can read own journal entries"
  ON journal_entries
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own journal entries"
  ON journal_entries
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own journal entries"
  ON journal_entries
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own journal entries"
  ON journal_entries
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_check_ins_user_id ON check_ins(user_id);
CREATE INDEX IF NOT EXISTS idx_check_ins_guest_session ON check_ins(guest_session_id);
CREATE INDEX IF NOT EXISTS idx_check_ins_created_at ON check_ins(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_wins_user_id ON wins(user_id);
CREATE INDEX IF NOT EXISTS idx_wins_guest_session ON wins(guest_session_id);
CREATE INDEX IF NOT EXISTS idx_wins_created_at ON wins(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_journal_entries_user_id ON journal_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_journal_entries_guest_session ON journal_entries(guest_session_id);
CREATE INDEX IF NOT EXISTS idx_journal_entries_created_at ON journal_entries(created_at DESC);