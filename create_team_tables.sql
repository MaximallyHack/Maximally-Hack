-- SQL statements to create missing team functionality tables
-- Run these in the Supabase SQL Editor

-- Create team_applications table
CREATE TABLE IF NOT EXISTS team_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    applicant_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    message TEXT,
    skills TEXT[] DEFAULT '{}',
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewed_by UUID REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(team_id, applicant_id)
);

-- Create team_invitations table
CREATE TABLE IF NOT EXISTS team_invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    inviter_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    invitee_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    message TEXT,
    role TEXT DEFAULT 'member',
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'expired')),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + interval '7 days'),
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    responded_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(team_id, invitee_id)
);

-- Enable Row Level Security (RLS)
ALTER TABLE team_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_invitations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for team_applications
-- Users can view applications for teams they lead or their own applications
CREATE POLICY "Users can view team applications" ON team_applications
    FOR SELECT USING (
        applicant_id = auth.uid() OR 
        team_id IN (SELECT id FROM teams WHERE leader_id = auth.uid())
    );

-- Users can create applications for themselves
CREATE POLICY "Users can create applications" ON team_applications
    FOR INSERT WITH CHECK (applicant_id = auth.uid());

-- Team leaders can update application status
CREATE POLICY "Team leaders can update applications" ON team_applications
    FOR UPDATE USING (
        team_id IN (SELECT id FROM teams WHERE leader_id = auth.uid())
    ) WITH CHECK (
        team_id IN (SELECT id FROM teams WHERE leader_id = auth.uid())
    );

-- Create RLS policies for team_invitations
-- Users can view invitations they sent or received
CREATE POLICY "Users can view team invitations" ON team_invitations
    FOR SELECT USING (
        inviter_id = auth.uid() OR 
        invitee_id = auth.uid()
    );

-- Team leaders and members can create invitations
CREATE POLICY "Team members can create invitations" ON team_invitations
    FOR INSERT WITH CHECK (
        inviter_id = auth.uid() AND
        team_id IN (
            SELECT team_id FROM team_members WHERE user_id = auth.uid()
        )
    );

-- Invitees can update invitation status (accept/reject)
CREATE POLICY "Invitees can respond to invitations" ON team_invitations
    FOR UPDATE USING (invitee_id = auth.uid()) 
    WITH CHECK (invitee_id = auth.uid());

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_team_applications_team_id ON team_applications(team_id);
CREATE INDEX IF NOT EXISTS idx_team_applications_applicant_id ON team_applications(applicant_id);
CREATE INDEX IF NOT EXISTS idx_team_applications_status ON team_applications(status);

CREATE INDEX IF NOT EXISTS idx_team_invitations_team_id ON team_invitations(team_id);
CREATE INDEX IF NOT EXISTS idx_team_invitations_invitee_id ON team_invitations(invitee_id);
CREATE INDEX IF NOT EXISTS idx_team_invitations_inviter_id ON team_invitations(inviter_id);
CREATE INDEX IF NOT EXISTS idx_team_invitations_status ON team_invitations(status);

-- Create functions to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for auto-updating timestamps
CREATE TRIGGER update_team_applications_updated_at
    BEFORE UPDATE ON team_applications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_team_invitations_updated_at
    BEFORE UPDATE ON team_invitations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
