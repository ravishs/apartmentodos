CREATE TABLE IF NOT EXISTS announcements (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL, -- HTML or rich text content
  scheduled_at TIMESTAMP WITH TIME ZONE, -- Optional: when to publish
  start_date TIMESTAMP WITH TIME ZONE, -- When announcement becomes visible
  end_date TIMESTAMP WITH TIME ZONE, -- When announcement expires
  is_published BOOLEAN DEFAULT FALSE,
  user_id UUID REFERENCES auth.users NOT NULL, -- Who created the announcement
  created_by UUID REFERENCES auth.users, -- Track who created
  last_edited_by UUID REFERENCES auth.users, -- Track who last edited
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS announcements_user_id_idx ON announcements(user_id);
CREATE INDEX IF NOT EXISTS announcements_scheduled_at_idx ON announcements(scheduled_at);

-- Enable RLS
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- RLS for Announcements (Allow all authenticated users to read/create/update/delete, but track them)
CREATE POLICY "Authenticated users can select announcements"
  ON announcements FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert announcements"
  ON announcements FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update announcements"
  ON announcements FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete announcements"
  ON announcements FOR DELETE
  USING (auth.role() = 'authenticated');
