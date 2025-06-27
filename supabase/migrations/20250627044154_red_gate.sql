/*
  # Enhanced Journal System with Media Support

  1. New Tables
    - `journal_media` - Store references to uploaded audio/photo files
      - `id` (uuid, primary key)
      - `journal_entry_id` (uuid, foreign key to journal_entries)
      - `user_id` (uuid, foreign key to profiles)
      - `media_type` (text: 'audio', 'photo')
      - `file_path` (text: path in Supabase Storage)
      - `file_name` (text: original filename)
      - `file_size` (integer: file size in bytes)
      - `mime_type` (text: MIME type)
      - `duration` (integer: for audio files, duration in seconds)
      - `created_at` (timestamp)

  2. Updates to Existing Tables
    - Add `title` column to `journal_entries`
    - Add `mood_rating` column for optional mood tracking
    - Add `is_flagged` column for content moderation

  3. Storage Buckets
    - Create buckets for journal audio and photos

  4. Security
    - Enable RLS on new table
    - Add policies for user data access
    - Set up storage policies