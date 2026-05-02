-- Plan 6 features: response deadline tracking + evidence file storage.
--
-- Note on cease & desist: the existing schema stores document type as `category TEXT`
-- (no doc_type enum), so cease & desist is just a new TEMPLATES entry — no DDL needed.

-- Response deadline tracking (P2.5)
ALTER TABLE documents
  ADD COLUMN IF NOT EXISTS response_deadline DATE,
  ADD COLUMN IF NOT EXISTS deadline_reminder_sent_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_documents_response_deadline
  ON documents (response_deadline)
  WHERE response_deadline IS NOT NULL
    AND deadline_reminder_sent_at IS NULL;

-- Evidence file uploads (P2.6)
INSERT INTO storage.buckets (id, name, public)
VALUES ('evidence', 'evidence', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Users can upload their own evidence"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'evidence'
    AND (auth.uid()::text = (storage.foldername(name))[1])
  );

CREATE POLICY "Users can read their own evidence"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'evidence'
    AND (auth.uid()::text = (storage.foldername(name))[1])
  );

CREATE POLICY "Users can delete their own evidence"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'evidence'
    AND (auth.uid()::text = (storage.foldername(name))[1])
  );
