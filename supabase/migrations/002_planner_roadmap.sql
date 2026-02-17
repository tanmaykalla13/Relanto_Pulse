-- Phase 3: Planner & Roadmap Schema

-- Journals table (one entry per user per date)
CREATE TABLE IF NOT EXISTS journals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  entry_date DATE NOT NULL,
  content TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE (user_id, entry_date)
);

-- Attachments table
CREATE TABLE IF NOT EXISTS attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  entry_date DATE NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Weeks table (roadmap structure)
CREATE TABLE IF NOT EXISTS weeks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  week_number INTEGER NOT NULL UNIQUE,
  title TEXT NOT NULL,
  phase TEXT NOT NULL CHECK (phase IN ('Virtual', 'In-Office')),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_journals_user_date ON journals(user_id, entry_date);
CREATE INDEX IF NOT EXISTS idx_attachments_user_date ON attachments(user_id, entry_date);
CREATE INDEX IF NOT EXISTS idx_weeks_week_number ON weeks(week_number);

-- Enable RLS
ALTER TABLE journals ENABLE ROW LEVEL SECURITY;
ALTER TABLE attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE weeks ENABLE ROW LEVEL SECURITY;

-- RLS Policies: journals
CREATE POLICY "Users can CRUD own journals"
  ON journals FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies: attachments
CREATE POLICY "Users can CRUD own attachments"
  ON attachments FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies: weeks (read-only for all authenticated; update only own... actually weeks are shared)
-- For roadmap, weeks are shared read + users can update title (we'll allow update for now)
CREATE POLICY "Authenticated users can read weeks"
  ON weeks FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update weeks"
  ON weeks FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Triggers for updated_at
CREATE TRIGGER update_journals_updated_at
  BEFORE UPDATE ON journals
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_weeks_updated_at
  BEFORE UPDATE ON weeks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Seed 20 weeks (Feb 2, 2026 start)
INSERT INTO weeks (week_number, title, phase, start_date, end_date) VALUES
  (1,  'Sprint 1',  'Virtual', '2026-02-02', '2026-02-08'),
  (2,  'Sprint 2',  'Virtual', '2026-02-09', '2026-02-15'),
  (3,  'Sprint 3',  'Virtual', '2026-02-16', '2026-02-22'),
  (4,  'Sprint 4',  'Virtual', '2026-02-23', '2026-03-01'),
  (5,  'Sprint 5',  'In-Office', '2026-03-02', '2026-03-08'),
  (6,  'Sprint 6',  'In-Office', '2026-03-09', '2026-03-15'),
  (7,  'Sprint 7',  'In-Office', '2026-03-16', '2026-03-22'),
  (8,  'Sprint 8',  'In-Office', '2026-03-23', '2026-03-29'),
  (9,  'Sprint 9',  'In-Office', '2026-03-30', '2026-04-05'),
  (10, 'Sprint 10', 'In-Office', '2026-04-06', '2026-04-12'),
  (11, 'Sprint 11', 'In-Office', '2026-04-13', '2026-04-19'),
  (12, 'Sprint 12', 'In-Office', '2026-04-20', '2026-04-26'),
  (13, 'Sprint 13', 'In-Office', '2026-04-27', '2026-05-03'),
  (14, 'Sprint 14', 'In-Office', '2026-05-04', '2026-05-10'),
  (15, 'Sprint 15', 'In-Office', '2026-05-11', '2026-05-17'),
  (16, 'Sprint 16', 'In-Office', '2026-05-18', '2026-05-24'),
  (17, 'Sprint 17', 'In-Office', '2026-05-25', '2026-05-31'),
  (18, 'Sprint 18', 'In-Office', '2026-06-01', '2026-06-07'),
  (19, 'Sprint 19', 'In-Office', '2026-06-08', '2026-06-14'),
  (20, 'Sprint 20', 'In-Office', '2026-06-15', '2026-06-21')
ON CONFLICT (week_number) DO NOTHING;

-- Storage bucket 'attachments' (create manually in Dashboard if this fails: Storage > New bucket)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('attachments', 'attachments', false)
ON CONFLICT (id) DO NOTHING;

-- Path format: {user_id}/{entry_date}_{uuid}_{filename}

-- Storage policies
CREATE POLICY "Authenticated users can upload attachments"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'attachments' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Authenticated users can read own attachments"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'attachments' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Authenticated users can delete own attachments"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'attachments' AND (storage.foldername(name))[1] = auth.uid()::text);
