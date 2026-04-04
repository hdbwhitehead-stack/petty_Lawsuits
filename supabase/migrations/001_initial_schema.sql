-- Documents: core table for all generated documents
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  anonymous_key TEXT,              -- localStorage UUID for pre-auth docs
  state TEXT NOT NULL,             -- AU state/territory (NSW, VIC, etc.)
  category TEXT NOT NULL,          -- document category
  status TEXT NOT NULL DEFAULT 'generating',  -- generating | ready | failed | permanently_failed
  original_content JSONB,          -- Claude-generated field values (never overwritten)
  current_content JSONB,           -- User's current edits (overwritten on save)
  unlocked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subscriptions: tracks active Stripe subscriptions per user
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  stripe_customer_id TEXT,
  status TEXT NOT NULL DEFAULT 'inactive',  -- active | inactive | past_due
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Generation attempts: for rate limiting (10 per user per 24h)
CREATE TABLE generation_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security: users can only see their own data
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE generation_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own documents"
  ON documents FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own subscription"
  ON subscriptions FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own generation attempts"
  ON generation_attempts FOR ALL USING (auth.uid() = user_id);
