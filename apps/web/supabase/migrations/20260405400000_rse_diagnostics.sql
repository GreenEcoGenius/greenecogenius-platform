CREATE TABLE IF NOT EXISTS public.rse_diagnostics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  account_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  answers JSONB NOT NULL DEFAULT '{}',
  pillar_scores JSONB NOT NULL DEFAULT '{}',
  global_score INTEGER DEFAULT 0,
  label_eligibility JSONB DEFAULT '[]',
  action_plan JSONB DEFAULT '[]',
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_rse_diagnostics_account ON public.rse_diagnostics(account_id);
CREATE INDEX idx_rse_diagnostics_completed ON public.rse_diagnostics(account_id, completed);

ALTER TABLE public.rse_diagnostics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own diagnostics"
  ON public.rse_diagnostics
  FOR ALL
  USING (auth.uid() = account_id)
  WITH CHECK (auth.uid() = account_id);
