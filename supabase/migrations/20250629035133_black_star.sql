/*
  # Create scheduled emails table for future self feature

  1. New Tables
    - `scheduled_emails`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to profiles)
      - `user_email` (text, email address)
      - `entry_id` (uuid, foreign key to journal_entries)
      - `entry_content` (text, journal entry content)
      - `entry_title` (text, optional journal entry title)
      - `send_at` (timestamptz, when to send the email)
      - `status` (text, scheduled/sent/failed/cancelled)
      - `sent_at` (timestamptz, when email was actually sent)
      - `error_message` (text, error details if failed)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `scheduled_emails` table
    - Add policies for users to manage their own scheduled emails

  3. Indexes
    - Index on user_id for fast user queries
    - Index on send_at for processing scheduled emails
    - Index on status for filtering
*/

CREATE TABLE IF NOT EXISTS scheduled_emails (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  user_email text NOT NULL,
  entry_id uuid REFERENCES journal_entries(id) ON DELETE CASCADE,
  entry_content text NOT NULL,
  entry_title text,
  send_at timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'sent', 'failed', 'cancelled')),
  sent_at timestamptz,
  error_message text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE scheduled_emails ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can read own scheduled emails"
  ON scheduled_emails
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own scheduled emails"
  ON scheduled_emails
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own scheduled emails"
  ON scheduled_emails
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own scheduled emails"
  ON scheduled_emails
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_scheduled_emails_user_id ON scheduled_emails(user_id);
CREATE INDEX IF NOT EXISTS idx_scheduled_emails_send_at ON scheduled_emails(send_at);
CREATE INDEX IF NOT EXISTS idx_scheduled_emails_status ON scheduled_emails(status);
CREATE INDEX IF NOT EXISTS idx_scheduled_emails_entry_id ON scheduled_emails(entry_id);