CREATE TABLE IF NOT EXISTS public.carbon_assessments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  account_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reporting_year INTEGER NOT NULL,
  reporting_period TEXT NOT NULL DEFAULT 'full_year',
  company_profile JSONB DEFAULT '{}',
  scope1_data JSONB DEFAULT '{}',
  scope2_data JSONB DEFAULT '{}',
  scope3_data JSONB DEFAULT '{}',
  scope1_total NUMERIC DEFAULT 0,
  scope2_total NUMERIC DEFAULT 0,
  scope3_total NUMERIC DEFAULT 0,
  total NUMERIC DEFAULT 0,
  intensity_per_employee NUMERIC DEFAULT 0,
  intensity_per_revenue NUMERIC DEFAULT 0,
  methodology TEXT DEFAULT 'GHG Protocol Corporate Standard',
  factors_source TEXT DEFAULT 'Base Carbone ADEME v23',
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_carbon_assessments_account ON public.carbon_assessments(account_id);

ALTER TABLE public.carbon_assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own carbon assessments"
  ON public.carbon_assessments
  FOR ALL
  USING (auth.uid() = account_id)
  WITH CHECK (auth.uid() = account_id);
