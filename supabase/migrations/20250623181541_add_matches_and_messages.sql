/*
  # Add matches and messages tables for SparkMatch

  1. New Tables
    - `matches`
      - `id` (uuid, primary key)
      - `user1_id` (uuid, references profiles)
      - `user2_id` (uuid, references profiles)
      - `status` (text, enum: 'pending', 'matched', 'unmatched')
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `last_message_time` (timestamp)
      - `last_message` (text)
      - `user1_unread_count` (integer)
      - `user2_unread_count` (integer)
      - `game_streak` (integer)

    - `messages`
      - `id` (uuid, primary key)
      - `match_id` (uuid, references matches)
      - `sender_id` (uuid, references profiles)
      - `type` (text, enum: 'text', 'game-invite')
      - `content` (text)
      - `game_type` (text, null for text messages)
      - `game_state` (jsonb, null for text messages)
      - `game_status` (text, enum: 'pending', 'active', 'paused', 'completed', null for text messages)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for users to read and write their own matches and messages
*/

-- Create matches table
CREATE TABLE IF NOT EXISTS matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  user2_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  status text NOT NULL CHECK (status IN ('pending', 'matched', 'unmatched')) DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  last_message_time timestamptz DEFAULT now(),
  last_message text DEFAULT '',
  user1_unread_count integer DEFAULT 0 CHECK (user1_unread_count >= 0),
  user2_unread_count integer DEFAULT 0 CHECK (user2_unread_count >= 0),
  game_streak integer DEFAULT 0 CHECK (game_streak >= 0),
  UNIQUE(user1_id, user2_id)
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id uuid REFERENCES matches(id) ON DELETE CASCADE NOT NULL,
  sender_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL CHECK (type IN ('text', 'game-invite')),
  content text NOT NULL,
  game_type text CHECK (
    (type = 'game-invite' AND game_type IN ('truth-or-dare', 'never-have-i-ever', 'would-you-rather', 'rapid-fire', 'emoji-story')) OR
    (type = 'text' AND game_type IS NULL)
  ),
  game_state jsonb,
  game_status text CHECK (
    (type = 'game-invite' AND game_status IN ('pending', 'active', 'paused', 'completed')) OR
    (type = 'text' AND game_status IS NULL)
  ),
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own matches
CREATE POLICY "Users can read own matches"
  ON matches
  FOR SELECT
  TO authenticated
  USING (auth.uid() IN (
    SELECT user_id FROM profiles WHERE id IN (user1_id, user2_id)
  ));

-- Policy: Users can update their own matches
CREATE POLICY "Users can update own matches"
  ON matches
  FOR UPDATE
  TO authenticated
  USING (auth.uid() IN (
    SELECT user_id FROM profiles WHERE id IN (user1_id, user2_id)
  ))
  WITH CHECK (auth.uid() IN (
    SELECT user_id FROM profiles WHERE id IN (user1_id, user2_id)
  ));

-- Policy: Users can insert matches they're part of
CREATE POLICY "Users can insert own matches"
  ON matches
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IN (
    SELECT user_id FROM profiles WHERE id IN (user1_id, user2_id)
  ));

-- Policy: Users can read messages from their matches
CREATE POLICY "Users can read match messages"
  ON messages
  FOR SELECT
  TO authenticated
  USING (auth.uid() IN (
    SELECT user_id FROM profiles WHERE id IN (
      SELECT user1_id FROM matches WHERE id = match_id
      UNION
      SELECT user2_id FROM matches WHERE id = match_id
    )
  ));

-- Policy: Users can insert messages to their matches
CREATE POLICY "Users can insert match messages"
  ON messages
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IN (
    SELECT user_id FROM profiles WHERE id IN (
      SELECT user1_id FROM matches WHERE id = match_id
      UNION
      SELECT user2_id FROM matches WHERE id = match_id
    )
  ));

-- Function to automatically update updated_at timestamp for matches
CREATE OR REPLACE FUNCTION update_matches_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at for matches
CREATE TRIGGER update_matches_updated_at
  BEFORE UPDATE ON matches
  FOR EACH ROW
  EXECUTE FUNCTION update_matches_updated_at();

-- Function to update match last_message and unread counts when a message is inserted
CREATE OR REPLACE FUNCTION update_match_on_message()
RETURNS TRIGGER AS $$
DECLARE
  match_record matches;
BEGIN
  -- Get the match record
  SELECT * INTO match_record FROM matches WHERE id = NEW.match_id;
  
  -- Update the match with the new message info
  UPDATE matches
  SET 
    last_message = NEW.content,
    last_message_time = NEW.created_at,
    user1_unread_count = CASE 
      WHEN NEW.sender_id = user1_id THEN user1_unread_count
      ELSE user1_unread_count + 1
    END,
    user2_unread_count = CASE
      WHEN NEW.sender_id = user2_id THEN user2_unread_count
      ELSE user2_unread_count + 1
    END
  WHERE id = NEW.match_id;
  
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to update match when a message is inserted
CREATE TRIGGER update_match_on_message
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_match_on_message(); 