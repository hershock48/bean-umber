-- ============================================================================
-- SUPABASE SCHEMA FOR BEANUMBER
-- Migrated from Airtable
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- SPONSORSHIPS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS sponsorships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sponsor_code TEXT UNIQUE NOT NULL,
  sponsor_email TEXT NOT NULL,
  sponsor_name TEXT,
  child_id TEXT NOT NULL,
  child_display_name TEXT NOT NULL,
  child_photo JSONB, -- Array of photo objects [{id, url, filename, size, type, width, height}]
  child_age TEXT,
  child_location TEXT,
  sponsorship_start_date DATE,
  auth_status TEXT NOT NULL DEFAULT 'Active' CHECK (auth_status IN ('Active', 'Inactive', 'Suspended')),
  status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Paused', 'Ended', 'Awaiting Sponsor')),
  visible_to_sponsor BOOLEAN NOT NULL DEFAULT true,
  last_request_at TIMESTAMPTZ,
  next_request_eligible_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for common queries
CREATE INDEX IF NOT EXISTS idx_sponsorships_sponsor_code ON sponsorships(sponsor_code);
CREATE INDEX IF NOT EXISTS idx_sponsorships_sponsor_email ON sponsorships(sponsor_email);
CREATE INDEX IF NOT EXISTS idx_sponsorships_child_id ON sponsorships(child_id);
CREATE INDEX IF NOT EXISTS idx_sponsorships_auth_status ON sponsorships(auth_status);
CREATE INDEX IF NOT EXISTS idx_sponsorships_status ON sponsorships(status);

-- ============================================================================
-- UPDATES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS updates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  child_id TEXT NOT NULL,
  sponsor_code TEXT,
  update_type TEXT NOT NULL CHECK (update_type IN ('Progress Report', 'Photo Update', 'Special Note', 'Holiday Greeting', 'Milestone')),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  photos JSONB, -- Array of photo objects [{id, url, filename, size, type, width, height}]
  status TEXT NOT NULL DEFAULT 'Pending Review' CHECK (status IN ('Pending Review', 'Published', 'Rejected')),
  visible_to_sponsor BOOLEAN NOT NULL DEFAULT false,
  requested_by_sponsor BOOLEAN DEFAULT false,
  requested_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  submitted_by TEXT,
  submitted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for common queries
CREATE INDEX IF NOT EXISTS idx_updates_child_id ON updates(child_id);
CREATE INDEX IF NOT EXISTS idx_updates_sponsor_code ON updates(sponsor_code);
CREATE INDEX IF NOT EXISTS idx_updates_status ON updates(status);
CREATE INDEX IF NOT EXISTS idx_updates_published_at ON updates(published_at DESC);

-- ============================================================================
-- CHILDREN TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS children (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  child_id TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_initial TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'paused', 'archived')),
  school_location TEXT,
  grade_class TEXT,
  expected_field_period TEXT,
  expected_academic_term TEXT,
  last_field_update_date DATE,
  last_academic_update_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_children_child_id ON children(child_id);
CREATE INDEX IF NOT EXISTS idx_children_status ON children(status);

-- ============================================================================
-- CHILD UPDATES TABLE (new canonical update system)
-- ============================================================================
CREATE TABLE IF NOT EXISTS child_updates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  update_id TEXT UNIQUE, -- Generated or formula field equivalent
  child_uuid UUID REFERENCES children(id),
  child_id TEXT, -- Denormalized for convenience
  source_type TEXT NOT NULL CHECK (source_type IN ('field', 'academic')),
  period TEXT, -- For field updates (e.g., '2026-01')
  academic_term TEXT, -- For academic updates (e.g., 'Term 1 2026')
  submitted_at TIMESTAMPTZ NOT NULL,
  submitted_by TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pending Review' CHECK (status IN ('Draft', 'Pending Review', 'Published', 'Rejected', 'Needs Correction')),
  
  -- Field Update Payload
  physical_wellbeing TEXT CHECK (physical_wellbeing IN ('Excellent', 'Good', 'Okay', 'Needs attention')),
  physical_notes TEXT,
  emotional_wellbeing TEXT CHECK (emotional_wellbeing IN ('Excellent', 'Good', 'Okay', 'Needs attention')),
  emotional_notes TEXT,
  school_engagement TEXT CHECK (school_engagement IN ('Very engaged', 'Engaged', 'Inconsistent', 'Not engaged')),
  engagement_notes TEXT,
  sponsor_narrative TEXT,
  positive_highlight TEXT,
  challenge TEXT,
  
  -- Academic Update Payload
  attendance_percent NUMERIC,
  english_grade NUMERIC,
  math_grade NUMERIC,
  science_grade NUMERIC,
  social_studies_grade NUMERIC,
  teacher_comment TEXT,
  
  -- Drive File References
  drive_folder_id TEXT,
  photo_1_file_id TEXT,
  photo_2_file_id TEXT,
  photo_3_file_id TEXT,
  handwritten_note_file_id TEXT,
  report_card_file_id TEXT,
  
  -- Governance
  reviewed_by TEXT,
  reviewed_at TIMESTAMPTZ,
  rejection_reason TEXT,
  correction_notes TEXT,
  supersedes_update UUID REFERENCES child_updates(id),
  superseded_by UUID REFERENCES child_updates(id),
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_child_updates_child_id ON child_updates(child_id);
CREATE INDEX IF NOT EXISTS idx_child_updates_status ON child_updates(status);
CREATE INDEX IF NOT EXISTS idx_child_updates_source_type ON child_updates(source_type);

-- ============================================================================
-- DONORS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS donors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  donor_name TEXT NOT NULL,
  email_address TEXT,
  organization_name TEXT,
  phone_number TEXT,
  mailing_address TEXT,
  stripe_customer_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_donors_email ON donors(email_address);
CREATE INDEX IF NOT EXISTS idx_donors_stripe_customer_id ON donors(stripe_customer_id);

-- ============================================================================
-- DONATIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS donations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  stripe_payment_intent_id TEXT UNIQUE NOT NULL,
  stripe_checkout_session_id TEXT,
  stripe_customer_id TEXT,
  donation_amount NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'usd',
  donation_date DATE NOT NULL,
  payment_status TEXT NOT NULL CHECK (payment_status IN ('Succeeded', 'Pending', 'Failed', 'Refunded')),
  recurring_donation BOOLEAN DEFAULT false,
  donor_id UUID REFERENCES donors(id),
  donor_email_at_donation TEXT,
  donation_source TEXT,
  subscription_id TEXT,
  address_line_1 TEXT,
  city TEXT,
  state TEXT,
  postal_code TEXT,
  country TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_donations_stripe_payment_intent_id ON donations(stripe_payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_donations_donor_id ON donations(donor_id);
CREATE INDEX IF NOT EXISTS idx_donations_donation_date ON donations(donation_date DESC);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE sponsorships ENABLE ROW LEVEL SECURITY;
ALTER TABLE updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE children ENABLE ROW LEVEL SECURITY;
ALTER TABLE child_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE donors ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

-- Service role can do everything (used by server-side API)
CREATE POLICY "Service role full access on sponsorships" ON sponsorships
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access on updates" ON updates
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access on children" ON children
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access on child_updates" ON child_updates
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access on donors" ON donors
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access on donations" ON donations
  FOR ALL USING (auth.role() = 'service_role');

-- ============================================================================
-- UPDATED_AT TRIGGER FUNCTION
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all tables
CREATE TRIGGER update_sponsorships_updated_at
  BEFORE UPDATE ON sponsorships
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_updates_updated_at
  BEFORE UPDATE ON updates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_children_updated_at
  BEFORE UPDATE ON children
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_child_updates_updated_at
  BEFORE UPDATE ON child_updates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_donors_updated_at
  BEFORE UPDATE ON donors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_donations_updated_at
  BEFORE UPDATE ON donations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
