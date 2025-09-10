import { supabase } from '../supabaseClient';
import { queryClient } from './queryClient';

// Type definitions (matching your existing interfaces but with proper field mapping)
export interface Event {
  id: string;
  slug: string;
  title: string;
  tagline?: string;
  description: string;
  longDescription?: string;
  startDate: string;
  endDate: string;
  registrationOpen?: string;
  registrationClose?: string;
  submissionOpen?: string;
  submissionClose?: string;
  status: 'upcoming' | 'active' | 'completed' | 'registration_open';
  format: 'online' | 'in-person' | 'hybrid';
  location: string;
  prizePool: number;
  maxTeamSize: number;
  participantCount: number;
  organizerId: string;
  tracks: string[];
  tags: string[];
  judges: string[];
  sponsors: string[];
  socials?: Record<string, string>;
  links?: Record<string, string>;
  hero?: {
    coverImage?: string;
    promoVideo?: string;
    countdown?: boolean;
  };
  criteria?: {
    name: string;
    percentage: number;
    description: string;
  }[];
  whyJoin?: string[];
  gallery?: {
    id: string;
    type: 'image' | 'video';
    src: string;
    thumbnail?: string;
    alt: string;
    caption?: string;
  }[];
  eligibility?: {
    age?: string;
    teamSize?: string;
    ipPolicy?: string;
    codeOfConduct?: string;
  };
  community?: {
    discord?: string;
    telegram?: string;
    forum?: string;
    responseTime?: string;
  };
  contact?: {
    name?: string;
    email?: string;
    phone?: string;
    organizer?: string;
  };
  prizes: any[];
  timeline?: any[];
  rules?: string[];
  faqs?: any[];
}

// Database event type (matches database schema)
interface DBEvent {
  id: string;
  slug: string;
  title: string;
  tagline?: string;
  description: string;
  long_description?: string;
  start_date: string;
  end_date: string;
  registration_open?: string;
  registration_close?: string;
  submission_open?: string;
  submission_close?: string;
  status: 'upcoming' | 'active' | 'completed' | 'registration_open';
  format: 'online' | 'in-person' | 'hybrid';
  location: string;
  prize_pool: number;
  max_team_size: number;
  participant_count: number;
  organizer_id: string;
  tracks: string[];
  tags: string[];
  judges: string[];
  sponsors: string[];
  socials?: Record<string, string>;
  links?: Record<string, string>;
  hero?: any;
  criteria?: any;
  why_join?: string[];
  gallery?: any;
  eligibility?: any;
  community?: any;
  contact?: any;
  prizes: any[];
  timeline?: any[];
  rules?: string[];
  faqs?: any[];
  created_at: string;
  updated_at: string;
}

// Field mapping functions
const mapDBEventToEvent = (dbEvent: DBEvent): Event => ({
  id: dbEvent.id,
  slug: dbEvent.slug,
  title: dbEvent.title,
  tagline: dbEvent.tagline,
  description: dbEvent.description,
  longDescription: dbEvent.long_description,
  startDate: dbEvent.start_date,
  endDate: dbEvent.end_date,
  registrationOpen: dbEvent.registration_open,
  registrationClose: dbEvent.registration_close,
  submissionOpen: dbEvent.submission_open,
  submissionClose: dbEvent.submission_close,
  status: dbEvent.status,
  format: dbEvent.format,
  location: dbEvent.location,
  prizePool: dbEvent.prize_pool,
  maxTeamSize: dbEvent.max_team_size,
  participantCount: dbEvent.participant_count,
  organizerId: dbEvent.organizer_id,
  tracks: dbEvent.tracks || [],
  tags: dbEvent.tags || [],
  judges: dbEvent.judges || [],
  sponsors: dbEvent.sponsors || [],
  socials: dbEvent.socials,
  links: dbEvent.links,
  hero: dbEvent.hero,
  criteria: dbEvent.criteria,
  whyJoin: dbEvent.why_join,
  gallery: dbEvent.gallery,
  eligibility: dbEvent.eligibility,
  community: dbEvent.community,
  contact: dbEvent.contact,
  prizes: dbEvent.prizes || [],
  timeline: dbEvent.timeline,
  rules: dbEvent.rules,
  faqs: dbEvent.faqs
});

const mapEventToDBEvent = (event: Partial<Event>): Partial<DBEvent> => ({
  slug: event.slug,
  title: event.title,
  tagline: event.tagline,
  description: event.description,
  long_description: event.longDescription,
  start_date: event.startDate,
  end_date: event.endDate,
  registration_open: event.registrationOpen,
  registration_close: event.registrationClose,
  submission_open: event.submissionOpen,
  submission_close: event.submissionClose,
  status: event.status,
  format: event.format,
  location: event.location,
  prize_pool: event.prizePool,
  max_team_size: event.maxTeamSize,
  participant_count: event.participantCount,
  tracks: event.tracks,
  tags: event.tags,
  judges: event.judges,
  sponsors: event.sponsors,
  socials: event.socials,
  links: event.links,
  hero: event.hero,
  criteria: event.criteria,
  why_join: event.whyJoin,
  gallery: event.gallery,
  eligibility: event.eligibility,
  community: event.community,
  contact: event.contact,
  prizes: event.prizes,
  timeline: event.timeline,
  rules: event.rules,
  faqs: event.faqs
});

export interface User {
  id: string;
  username: string;
  name: string;
  avatar?: string;
  role: 'participant' | 'organizer' | 'judge';
  bio?: string;
  skills: string[];
  location?: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
  website?: string;
  joinDate: string;
  stats: {
    hackathonsParticipated: number;
    wins: number;
    finals: number;
    organized: number;
    judged: number;
  };
  badges: string[];
  expertise?: string[];
  projects?: string[];
}

// Database profile type
interface DBProfile {
  id: string;
  username: string;
  full_name?: string;
  avatar_url?: string;
  role: 'participant' | 'organizer' | 'judge';
  bio?: string;
  skills: string[];
  location?: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
  website?: string;
  join_date: string;
  hackathons_participated: number;
  wins: number;
  finals: number;
  organized: number;
  judged: number;
  badges: string[];
  expertise?: string[];
  email?: string;
  phone?: string;
  interests?: string[];
  created_at: string;
  updated_at: string;
}

// Profile mapping functions
const mapDBProfileToUser = (dbProfile: DBProfile): User => ({
  id: dbProfile.id,
  username: dbProfile.username,
  name: dbProfile.full_name || dbProfile.username,
  avatar: dbProfile.avatar_url,
  role: dbProfile.role,
  bio: dbProfile.bio,
  skills: dbProfile.skills || [],
  location: dbProfile.location,
  github: dbProfile.github,
  linkedin: dbProfile.linkedin,
  twitter: dbProfile.twitter,
  website: dbProfile.website,
  joinDate: dbProfile.join_date,
  stats: {
    hackathonsParticipated: dbProfile.hackathons_participated || 0,
    wins: dbProfile.wins || 0,
    finals: dbProfile.finals || 0,
    organized: dbProfile.organized || 0,
    judged: dbProfile.judged || 0
  },
  badges: dbProfile.badges || [],
  expertise: dbProfile.expertise || [],
  projects: [] // Will be populated separately if needed
});

export interface Team {
  id: string;
  name: string;
  description?: string;
  event_id: string;
  leader_id: string;
  max_size: number;
  join_code: string;
  skills: string[];
  looking_for: string[];
  track?: string;
  status: 'recruiting' | 'full' | 'disbanded';
  created_at: string;
  members?: User[];
}

export interface Submission {
  id: string;
  title: string;
  tagline?: string;
  description: string;
  long_description?: string;
  event_id: string;
  team_id?: string;
  submitted_by: string;
  track?: string;
  tags: string[];
  tech_stack: string[];
  demo_url?: string;
  github_url?: string;
  slides_url?: string;
  video_url?: string;
  images: string[];
  status: 'draft' | 'submitted' | 'judging' | 'judged';
  features: string[];
  average_score?: number;
  awards?: string[];
  submitted_at?: string;
}

export interface Judge {
  id: string;
  name: string;
  title: string;
  company: string;
  avatar?: string;
  bio?: string;
  expertise: string[];
  location?: string;
  social: {
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
  badges: string[];
  events_judged: number;
  rating: number;
  quote?: string;
  availability: 'Available' | 'Limited' | 'Unavailable';
  timezone?: string;
}

export interface Scorecard {
  id: string;
  submission_id: string;
  judge_id: string;
  event_id: string;
  scores: Record<string, number>;
  total_score?: number;
  feedback?: string;
  status: 'draft' | 'submitted';
  time_spent?: number;
  submitted_at?: string;
}


// Removed duplicate interfaces - using the ones defined above

// Supabase API functions
export const supabaseApi = {
  // Events
  getEvents: async (): Promise<Event[]> => {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('start_date', { ascending: false });

    if (error) throw error;
    return (data || []).map(mapDBEventToEvent);
  },

  getEvent: async (slug: string): Promise<Event | null> => {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // No rows returned
      throw error;
    }
    return mapDBEventToEvent(data);
  },

  getFeaturedEvents: async (): Promise<Event[]> => {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('participant_count', { ascending: false })
      .limit(6);

    if (error) throw error;
    return (data || []).map(mapDBEventToEvent);
  },

  createEvent: async (eventData: Partial<Event>): Promise<Event> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const dbEventData = mapEventToDBEvent({
      ...eventData,
      organizerId: user.id
    });

    const { data, error } = await supabase
      .from('events')
      .insert(dbEventData)
      .select()
      .single();

    if (error) throw error;
    return mapDBEventToEvent(data);
  },

  updateEvent: async (id: string, eventData: Partial<Event>): Promise<Event> => {
    const dbEventData = mapEventToDBEvent(eventData);
    
    const { data, error } = await supabase
      .from('events')
      .update(dbEventData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return mapDBEventToEvent(data);
  },

  // Users/Profiles
  getUsers: async (): Promise<User[]> => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*');

    if (error) throw error;
    return (data || []).map(mapDBProfileToUser);
  },

  getUser: async (id: string): Promise<User | null> => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return mapDBProfileToUser(data);
  },

  getUserByUsername: async (username: string): Promise<User | null> => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', username)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return mapDBProfileToUser(data);
  },

  updateProfile: async (id: string, profileData: Partial<User>): Promise<User> => {
    const updateData: Partial<DBProfile> = {
      username: profileData.username,
      full_name: profileData.name,
      avatar_url: profileData.avatar,
      role: profileData.role,
      bio: profileData.bio,
      skills: profileData.skills,
      location: profileData.location,
      github: profileData.github,
      linkedin: profileData.linkedin,
      twitter: profileData.twitter,
      website: profileData.website,
      badges: profileData.badges,
      expertise: profileData.expertise
    };

    const { data, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return mapDBProfileToUser(data);
  },

  // Teams
  getTeams: async (eventId?: string): Promise<Team[]> => {
    let query = supabase
      .from('teams')
      .select(`
        *,
        members:team_members(
          user_id,
          role,
          user:profiles(*)
        )
      `);

    if (eventId) {
      query = query.eq('event_id', eventId);
    }

    const { data, error } = await query;
    if (error) throw error;

    // Transform the data to match expected format
    return (data || []).map(team => ({
      ...team,
      members: team.members?.map((m: any) => mapDBProfileToUser(m.user)) || [],
      // Map database fields to component expectations
      requiredSkills: team.skills || [],
      lookingForRoles: team.looking_for || [],
      maxSize: team.max_size,
      leaderId: team.leader_id,
      lastActivity: team.updated_at || team.created_at,
      tags: team.track ? [team.track] : []
    }));
  },

  getTeam: async (id: string): Promise<Team | null> => {
    const { data, error } = await supabase
      .from('teams')
      .select(`
        *,
        members:team_members(
          user_id,
          role,
          user:profiles(*)
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    return {
      ...data,
      members: data.members?.map((m: any) => mapDBProfileToUser(m.user)) || [],
      // Map database fields to component expectations
      requiredSkills: data.skills || [],
      lookingForRoles: data.looking_for || [],
      maxSize: data.max_size,
      leaderId: data.leader_id,
      lastActivity: data.updated_at || data.created_at,
      tags: data.track ? [data.track] : []
    };
  },

  createTeam: async (teamData: Partial<Team>): Promise<Team> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Map component fields to database fields
    const dbTeamData = {
      name: teamData.name,
      description: teamData.description,
      event_id: teamData.event_id,
      max_size: teamData.maxSize || teamData.max_size || 4,
      skills: teamData.requiredSkills || teamData.skills || [],
      looking_for: teamData.lookingForRoles || teamData.looking_for || [],
      track: teamData.track,
      status: teamData.status || 'recruiting',
      leader_id: user.id,
      join_code: Math.random().toString(36).substring(2, 8).toUpperCase()
    };

    const { data, error } = await supabase
      .from('teams')
      .insert(dbTeamData)
      .select()
      .single();

    if (error) throw error;

    // Add the creator as a team member
    await supabase
      .from('team_members')
      .insert({
        team_id: data.id,
        user_id: user.id,
        role: 'leader'
      });

    // Return mapped data
    return {
      ...data,
      requiredSkills: data.skills || [],
      lookingForRoles: data.looking_for || [],
      maxSize: data.max_size,
      leaderId: data.leader_id,
      lastActivity: data.updated_at || data.created_at,
      tags: data.track ? [data.track] : [],
      members: []
    };
  },

  joinTeam: async (teamId: string): Promise<void> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('team_members')
      .insert({
        team_id: teamId,
        user_id: user.id,
        role: 'member'
      });

    if (error) throw error;
  },

  leaveTeam: async (teamId: string): Promise<void> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('team_members')
      .delete()
      .eq('team_id', teamId)
      .eq('user_id', user.id);

    if (error) throw error;
  },

  // Team Applications
  applyToTeam: async (teamId: string, message?: string, skills?: string[]): Promise<void> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('team_applications')
      .insert({
        team_id: teamId,
        applicant_id: user.id,
        message: message || '',
        skills: skills || []
      });

    if (error) throw error;
  },

  getTeamApplications: async (teamId: string): Promise<any[]> => {
    const { data, error } = await supabase
      .from('team_applications')
      .select(`
        *,
        applicant:profiles!applicant_id(*),
        team:teams(*)
      `)
      .eq('team_id', teamId)
      .order('applied_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  getUserApplications: async (): Promise<any[]> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('team_applications')
      .select(`
        *,
        team:teams(*)
      `)
      .eq('applicant_id', user.id)
      .order('applied_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  updateApplicationStatus: async (applicationId: string, status: 'accepted' | 'rejected'): Promise<void> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('team_applications')
      .update({
        status,
        reviewed_at: new Date().toISOString(),
        reviewed_by: user.id
      })
      .eq('id', applicationId);

    if (error) throw error;

    // If accepted, add user to team
    if (status === 'accepted') {
      const { data: application } = await supabase
        .from('team_applications')
        .select('team_id, applicant_id')
        .eq('id', applicationId)
        .single();

      if (application) {
        await supabase
          .from('team_members')
          .insert({
            team_id: application.team_id,
            user_id: application.applicant_id,
            role: 'member'
          });
      }
    }
  },

  // Team Invitations
  inviteToTeam: async (teamId: string, inviteeId: string, message?: string): Promise<void> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('team_invitations')
      .insert({
        team_id: teamId,
        inviter_id: user.id,
        invitee_id: inviteeId,
        message: message || ''
      });

    if (error) throw error;
  },

  getTeamInvitations: async (teamId: string): Promise<any[]> => {
    const { data, error } = await supabase
      .from('team_invitations')
      .select(`
        *,
        inviter:profiles!inviter_id(*),
        invitee:profiles!invitee_id(*),
        team:teams(*)
      `)
      .eq('team_id', teamId)
      .order('sent_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  getUserInvitations: async (): Promise<any[]> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('team_invitations')
      .select(`
        *,
        inviter:profiles!inviter_id(*),
        team:teams(*)
      `)
      .eq('invitee_id', user.id)
      .eq('status', 'pending')
      .order('sent_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  respondToInvitation: async (invitationId: string, status: 'accepted' | 'rejected'): Promise<void> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('team_invitations')
      .update({
        status,
        responded_at: new Date().toISOString()
      })
      .eq('id', invitationId)
      .eq('invitee_id', user.id);

    if (error) throw error;

    // If accepted, add user to team
    if (status === 'accepted') {
      const { data: invitation } = await supabase
        .from('team_invitations')
        .select('team_id, invitee_id')
        .eq('id', invitationId)
        .single();

      if (invitation) {
        await supabase
          .from('team_members')
          .insert({
            team_id: invitation.team_id,
            user_id: invitation.invitee_id,
            role: 'member'
          });
      }
    }
  },

  // Team Activity
  getTeamActivity: async (teamId: string): Promise<any[]> => {
    // Fetch different types of team activity
    const activities = [];

    try {
      // 1. Team member joins
      const { data: memberJoins, error: memberError } = await supabase
        .from('team_members')
        .select(`
          joined_at,
          role,
          user:profiles!user_id(
            id,
            username,
            full_name,
            avatar_url
          )
        `)
        .eq('team_id', teamId)
        .order('joined_at', { ascending: false });

      if (!memberError && memberJoins) {
        memberJoins.forEach(join => {
          activities.push({
            type: 'member_joined',
            timestamp: join.joined_at,
            user: {
              id: join.user.id,
              name: join.user.full_name || join.user.username,
              username: join.user.username,
              avatar: join.user.avatar_url
            },
            data: {
              role: join.role
            }
          });
        });
      }

      // 2. Team applications
      const { data: applications, error: appError } = await supabase
        .from('team_applications')
        .select(`
          applied_at,
          reviewed_at,
          status,
          applicant:profiles!applicant_id(
            id,
            username,
            full_name,
            avatar_url
          ),
          reviewer:profiles!reviewed_by(
            id,
            username,
            full_name,
            avatar_url
          )
        `)
        .eq('team_id', teamId)
        .order('applied_at', { ascending: false });

      if (!appError && applications) {
        applications.forEach(app => {
          // Application submitted
          activities.push({
            type: 'application_submitted',
            timestamp: app.applied_at,
            user: {
              id: app.applicant.id,
              name: app.applicant.full_name || app.applicant.username,
              username: app.applicant.username,
              avatar: app.applicant.avatar_url
            },
            data: {
              status: app.status
            }
          });

          // Application reviewed (if reviewed)
          if (app.reviewed_at && app.reviewer) {
            activities.push({
              type: 'application_reviewed',
              timestamp: app.reviewed_at,
              user: {
                id: app.reviewer.id,
                name: app.reviewer.full_name || app.reviewer.username,
                username: app.reviewer.username,
                avatar: app.reviewer.avatar_url
              },
              data: {
                status: app.status,
                applicant: {
                  name: app.applicant.full_name || app.applicant.username
                }
              }
            });
          }
        });
      }

      // 3. Team invitations
      const { data: invitations, error: invError } = await supabase
        .from('team_invitations')
        .select(`
          sent_at,
          responded_at,
          status,
          inviter:profiles!inviter_id(
            id,
            username,
            full_name,
            avatar_url
          ),
          invitee:profiles!invitee_id(
            id,
            username,
            full_name,
            avatar_url
          )
        `)
        .eq('team_id', teamId)
        .order('sent_at', { ascending: false });

      if (!invError && invitations) {
        invitations.forEach(inv => {
          // Invitation sent
          activities.push({
            type: 'invitation_sent',
            timestamp: inv.sent_at,
            user: {
              id: inv.inviter.id,
              name: inv.inviter.full_name || inv.inviter.username,
              username: inv.inviter.username,
              avatar: inv.inviter.avatar_url
            },
            data: {
              invitee: {
                name: inv.invitee.full_name || inv.invitee.username
              },
              status: inv.status
            }
          });

          // Invitation responded (if responded)
          if (inv.responded_at) {
            activities.push({
              type: 'invitation_responded',
              timestamp: inv.responded_at,
              user: {
                id: inv.invitee.id,
                name: inv.invitee.full_name || inv.invitee.username,
                username: inv.invitee.username,
                avatar: inv.invitee.avatar_url
              },
              data: {
                status: inv.status
              }
            });
          }
        });
      }

      // 4. Team creation (from team record)
      const { data: team, error: teamError } = await supabase
        .from('teams')
        .select(`
          created_at,
          leader:profiles!leader_id(
            id,
            username,
            full_name,
            avatar_url
          )
        `)
        .eq('id', teamId)
        .single();

      if (!teamError && team) {
        activities.push({
          type: 'team_created',
          timestamp: team.created_at,
          user: {
            id: team.leader.id,
            name: team.leader.full_name || team.leader.username,
            username: team.leader.username,
            avatar: team.leader.avatar_url
          },
          data: {}
        });
      }

    } catch (error) {
      console.error('Error fetching team activity:', error);
    }

    // Sort all activities by timestamp (most recent first)
    return activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  },

  // Team Management APIs
  updateTeam: async (teamId: string, teamData: Partial<Team>): Promise<Team> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Map component fields to database fields
    const updateData: any = {};
    if (teamData.name) updateData.name = teamData.name;
    if (teamData.description !== undefined) updateData.description = teamData.description;
    if (teamData.max_size || teamData.maxSize) updateData.max_size = teamData.max_size || teamData.maxSize;
    if (teamData.skills || teamData.requiredSkills) updateData.skills = teamData.skills || teamData.requiredSkills || [];
    if (teamData.looking_for || teamData.lookingForRoles) updateData.looking_for = teamData.looking_for || teamData.lookingForRoles || [];
    if (teamData.track !== undefined) updateData.track = teamData.track;
    if (teamData.status) updateData.status = teamData.status;

    const { data, error } = await supabase
      .from('teams')
      .update(updateData)
      .eq('id', teamId)
      .eq('leader_id', user.id) // Only team leader can update
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  deleteTeam: async (teamId: string): Promise<void> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('teams')
      .delete()
      .eq('id', teamId)
      .eq('leader_id', user.id); // Only team leader can delete

    if (error) throw error;
  },

  removeMemberFromTeam: async (teamId: string, userId: string): Promise<void> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Check if the current user is the team leader
    const { data: team, error: teamError } = await supabase
      .from('teams')
      .select('leader_id')
      .eq('id', teamId)
      .single();

    if (teamError) throw teamError;
    if (team.leader_id !== user.id) throw new Error('Only team leader can remove members');

    const { error } = await supabase
      .from('team_members')
      .delete()
      .eq('team_id', teamId)
      .eq('user_id', userId);

    if (error) throw error;
  },

  transferLeadership: async (teamId: string, newLeaderId: string): Promise<void> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Update team leader
    const { error: teamError } = await supabase
      .from('teams')
      .update({ leader_id: newLeaderId })
      .eq('id', teamId)
      .eq('leader_id', user.id); // Only current leader can transfer

    if (teamError) throw teamError;

    // Update member roles
    const { error: oldLeaderError } = await supabase
      .from('team_members')
      .update({ role: 'member' })
      .eq('team_id', teamId)
      .eq('user_id', user.id);

    if (oldLeaderError) throw oldLeaderError;

    const { error: newLeaderError } = await supabase
      .from('team_members')
      .update({ role: 'leader' })
      .eq('team_id', teamId)
      .eq('user_id', newLeaderId);

    if (newLeaderError) throw newLeaderError;
  },

  // Submissions
  getSubmissions: async (eventId?: string): Promise<Submission[]> => {
    let query = supabase
      .from('submissions')
      .select('*')
      .eq('status', 'submitted'); // Only show submitted submissions publicly

    if (eventId) {
      query = query.eq('event_id', eventId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  getSubmission: async (id: string): Promise<Submission | null> => {
    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data;
  },

  getUserSubmissions: async (userId?: string): Promise<Submission[]> => {
    const { data: { user } } = await supabase.auth.getUser();
    const targetUserId = userId || user?.id;
    
    if (!targetUserId) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .eq('submitted_by', targetUserId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    // Map database fields to interface fields
    return (data || []).map(dbSubmission => ({
      id: dbSubmission.id,
      title: dbSubmission.title,
      tagline: dbSubmission.tagline,
      description: dbSubmission.description,
      longDescription: dbSubmission.long_description,
      eventId: dbSubmission.event_id,
      teamId: dbSubmission.team_id,
      submittedBy: dbSubmission.submitted_by,
      track: dbSubmission.track,
      tags: dbSubmission.tags || [],
      techStack: dbSubmission.tech_stack || [],
      demoUrl: dbSubmission.demo_url,
      githubUrl: dbSubmission.github_url,
      slidesUrl: dbSubmission.slides_url,
      videoUrl: dbSubmission.video_url,
      images: dbSubmission.images || [],
      status: dbSubmission.status,
      features: dbSubmission.features || [],
      averageScore: dbSubmission.average_score,
      awards: dbSubmission.awards,
      submittedAt: dbSubmission.submitted_at
    }));
  },

  createSubmission: async (submissionData: Partial<Submission>): Promise<Submission> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('submissions')
      .insert({
        ...submissionData,
        submitted_by: user.id,
        status: 'draft'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  updateSubmission: async (id: string, submissionData: Partial<Submission>): Promise<Submission> => {
    const { data, error } = await supabase
      .from('submissions')
      .update(submissionData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  submitSubmission: async (id: string): Promise<Submission> => {
    const { data, error } = await supabase
      .from('submissions')
      .update({
        status: 'submitted',
        submitted_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Judges
  getJudges: async (): Promise<Judge[]> => {
    const { data, error } = await supabase
      .from('judges')
      .select(`
        *,
        profile:profiles(*)
      `);

    if (error) throw error;

    // Transform the data to match expected format
    return (data || []).map(judge => ({
      ...judge,
      name: judge.profile.name,
      avatar: judge.profile.avatar,
      bio: judge.profile.bio,
      expertise: judge.profile.expertise || [],
      location: judge.profile.location,
      badges: judge.profile.badges || []
    }));
  },

  getJudge: async (id: string): Promise<Judge | null> => {
    const { data, error } = await supabase
      .from('judges')
      .select(`
        *,
        profile:profiles(*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    return {
      ...data,
      name: data.profile.name,
      avatar: data.profile.avatar,
      bio: data.profile.bio,
      expertise: data.profile.expertise || [],
      location: data.profile.location,
      badges: data.profile.badges || []
    };
  },

  // Judge Assignment
  assignJudgeToEvent: async (eventId: string, judgeId: string): Promise<void> => {
    const { error } = await supabase
      .from('event_judges')
      .insert({
        event_id: eventId,
        judge_id: judgeId,
        assigned_at: new Date().toISOString()
      });

    if (error) throw error;
  },

  removeJudgeFromEvent: async (eventId: string, judgeId: string): Promise<void> => {
    const { error } = await supabase
      .from('event_judges')
      .delete()
      .eq('event_id', eventId)
      .eq('judge_id', judgeId);

    if (error) throw error;
  },

  getEventJudges: async (eventId: string): Promise<Judge[]> => {
    const { data, error } = await supabase
      .from('event_judges')
      .select(`
        judge:judges(
          *,
          profile:profiles(*)
        )
      `)
      .eq('event_id', eventId);

    if (error) throw error;

    return (data || []).map(item => ({
      ...item.judge,
      name: item.judge.profile.name,
      avatar: item.judge.profile.avatar,
      bio: item.judge.profile.bio,
      expertise: item.judge.profile.expertise || [],
      location: item.judge.profile.location,
      badges: item.judge.profile.badges || []
    }));
  },

  getJudgeEvents: async (judgeId?: string): Promise<Event[]> => {
    const { data: { user } } = await supabase.auth.getUser();
    const targetJudgeId = judgeId || user?.id;
    
    if (!targetJudgeId) throw new Error('Judge not authenticated');

    const { data, error } = await supabase
      .from('event_judges')
      .select(`
        event:events(*)
      `)
      .eq('judge_id', targetJudgeId);

    if (error) throw error;
    
    return (data || []).map(item => mapDBEventToEvent(item.event));
  },

  // Scorecards
  getScorecard: async (submissionId: string, judgeId: string): Promise<Scorecard | null> => {
    const { data, error } = await supabase
      .from('scorecards')
      .select('*')
      .eq('submission_id', submissionId)
      .eq('judge_id', judgeId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data;
  },

  getSubmissionScorecards: async (submissionId: string): Promise<Scorecard[]> => {
    const { data, error } = await supabase
      .from('scorecards')
      .select('*')
      .eq('submission_id', submissionId)
      .eq('status', 'submitted');

    if (error) throw error;
    return data || [];
  },

  createScorecard: async (scorecardData: Partial<Scorecard>): Promise<Scorecard> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('scorecards')
      .insert({
        ...scorecardData,
        judge_id: user.id,
        status: 'draft'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  updateScorecard: async (id: string, scorecardData: Partial<Scorecard>): Promise<Scorecard> => {
    const { data, error } = await supabase
      .from('scorecards')
      .update(scorecardData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  submitScorecard: async (id: string): Promise<Scorecard> => {
    const { data, error } = await supabase
      .from('scorecards')
      .update({
        status: 'submitted',
        submitted_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Event Registration
  registerForEvent: async (eventId: string): Promise<void> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('event_registrations')
      .insert({
        event_id: eventId,
        user_id: user.id,
        registered_at: new Date().toISOString()
      });

    if (error) throw error;

    // Update participant count
    const { error: updateError } = await supabase.rpc('increment_participant_count', {
      event_id: eventId
    });
    
    if (updateError) console.warn('Failed to update participant count:', updateError);
  },

  unregisterFromEvent: async (eventId: string): Promise<void> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('event_registrations')
      .delete()
      .eq('event_id', eventId)
      .eq('user_id', user.id);

    if (error) throw error;

    // Decrement participant count
    const { error: updateError } = await supabase.rpc('decrement_participant_count', {
      event_id: eventId
    });
    
    if (updateError) console.warn('Failed to update participant count:', updateError);
  },

  getUserEventRegistrations: async (userId?: string): Promise<string[]> => {
    const { data: { user } } = await supabase.auth.getUser();
    const targetUserId = userId || user?.id;
    
    if (!targetUserId) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('event_registrations')
      .select('event_id')
      .eq('user_id', targetUserId);

    if (error) throw error;
    return (data || []).map(reg => reg.event_id);
  },

  getEventRegistrations: async (eventId: string): Promise<any[]> => {
    const { data, error } = await supabase
      .from('event_registrations')
      .select(`
        *,
        user:profiles(*)
      `)
      .eq('event_id', eventId)
      .order('registered_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Search and filter
  searchEvents: async (query: string, filters: any = {}) => {
    let supabaseQuery = supabase.from('events').select('*');

    // Text search
    if (query) {
      supabaseQuery = supabaseQuery.or(`title.ilike.%${query}%,description.ilike.%${query}%`);
    }

    // Status filter
    if (filters.status) {
      supabaseQuery = supabaseQuery.eq('status', filters.status);
    }

    // Format filter
    if (filters.format) {
      supabaseQuery = supabaseQuery.eq('format', filters.format);
    }

    // Prize minimum
    if (filters.prizeMin) {
      supabaseQuery = supabaseQuery.gte('prize_pool', filters.prizeMin);
    }

    // Sorting
    switch (filters.sortBy) {
      case 'date':
        supabaseQuery = supabaseQuery.order('start_date', { ascending: true });
        break;
      case 'popular':
        supabaseQuery = supabaseQuery.order('participant_count', { ascending: false });
        break;
      case 'prize':
        supabaseQuery = supabaseQuery.order('prize_pool', { ascending: false });
        break;
      default:
        supabaseQuery = supabaseQuery.order('start_date', { ascending: false });
    }

    const { data, error } = await supabaseQuery;
    if (error) throw error;
    return data || [];
  },

  // Leaderboards
  getLeaderboards: async (type: 'hackers' | 'organizers' | 'judges' = 'hackers') => {
    let query;
    
    switch (type) {
      case 'hackers':
        query = supabase
          .from('profiles')
          .select('*')
          .eq('role', 'participant')
          .order('wins', { ascending: false })
          .limit(20);
        break;
      case 'organizers':
        query = supabase
          .from('profiles')
          .select('*')
          .eq('role', 'organizer')
          .order('organized', { ascending: false })
          .limit(20);
        break;
      case 'judges':
        query = supabase
          .from('judges')
          .select(`
            *,
            profile:profiles(*)
          `)
          .order('events_judged', { ascending: false })
          .limit(20);
        break;
      default:
        throw new Error('Invalid leaderboard type');
    }

    const { data, error } = await query;
    if (error) throw error;

    if (type === 'judges') {
      return (data || []).map((judge: any) => ({
        ...judge,
        name: judge.profile.name,
        avatar: judge.profile.avatar
      }));
    }

    return data || [];
  },

  // Team Settings APIs
  getTeamSettings: async (teamId: string): Promise<any> => {
    console.log('Getting team settings for team:', teamId);
    
    const { data, error } = await supabase
      .from('team_settings')
      .select('*')
      .eq('team_id', teamId)
      .single();

    if (error) {
      console.log('Team settings query error:', error);
      // If no settings exist, return default settings
      if (error.code === 'PGRST116') {
        console.log('No settings found, returning defaults for team:', teamId);
        return {
          teamId,
          teamDescription: '',
          teamVisibility: 'public',
          allowJoinRequests: true,
          autoAcceptApplications: false,
          maxMembersOverride: null,
          enableTeamMails: true,
          mailNotifications: true,
          allowExternalContact: true,
          showMemberProfiles: true,
          showMemberSkills: true,
          showTeamActivity: true,
          showJoinCode: false,
          memberCanInvite: false,
          memberCanViewApplications: false,
          memberCanManageSettings: false,
          teamTags: [],
          customFields: {}
        };
      }
      throw error;
    }

    console.log('Team settings data retrieved from DB:', data);
    
    // Map database fields to frontend format
    const mappedData = {
      id: data.id,
      teamId: data.team_id,
      teamDescription: data.team_description,
      teamVisibility: data.team_visibility,
      allowJoinRequests: data.allow_join_requests,
      autoAcceptApplications: data.auto_accept_applications,
      maxMembersOverride: data.max_members_override,
      enableTeamMails: data.enable_team_mails,
      mailNotifications: data.mail_notifications,
      allowExternalContact: data.allow_external_contact,
      showMemberProfiles: data.show_member_profiles,
      showMemberSkills: data.show_member_skills,
      showTeamActivity: data.show_team_activity,
      showJoinCode: data.show_join_code,
      memberCanInvite: data.member_can_invite,
      memberCanViewApplications: data.member_can_view_applications,
      memberCanManageSettings: data.member_can_manage_settings,
      teamTags: data.team_tags || [],
      customFields: data.custom_fields || {}
    };
    console.log('Mapped team settings data:', mappedData);
    return mappedData;
  },

  updateTeamSettings: async (teamId: string, settingsData: any): Promise<any> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    console.log('Updating team settings for team:', teamId);
    console.log('Settings data:', settingsData);

    // Map frontend format to database fields
    const updateData = {
      team_description: settingsData.teamDescription,
      team_visibility: settingsData.teamVisibility,
      allow_join_requests: settingsData.allowJoinRequests,
      auto_accept_applications: settingsData.autoAcceptApplications,
      max_members_override: settingsData.maxMembersOverride,
      enable_team_mails: settingsData.enableTeamMails,
      mail_notifications: settingsData.mailNotifications,
      allow_external_contact: settingsData.allowExternalContact,
      show_member_profiles: settingsData.showMemberProfiles,
      show_member_skills: settingsData.showMemberSkills,
      show_team_activity: settingsData.showTeamActivity,
      show_join_code: settingsData.showJoinCode,
      member_can_invite: settingsData.memberCanInvite,
      member_can_view_applications: settingsData.memberCanViewApplications,
      member_can_manage_settings: settingsData.memberCanManageSettings,
      team_tags: settingsData.teamTags || [],
      custom_fields: settingsData.customFields || {}
    };

    console.log('Mapped update data:', updateData);

    // First check if settings exist
    const { data: existingSettings } = await supabase
      .from('team_settings')
      .select('id')
      .eq('team_id', teamId)
      .single();

    let data, error;
    
    if (existingSettings) {
      // Update existing settings
      const result = await supabase
        .from('team_settings')
        .update(updateData)
        .eq('team_id', teamId)
        .select()
        .single();
      data = result.data;
      error = result.error;
    } else {
      // Insert new settings
      const result = await supabase
        .from('team_settings')
        .insert({
          team_id: teamId,
          ...updateData
        })
        .select()
        .single();
      data = result.data;
      error = result.error;
    }

    if (error) {
      console.error('Team settings update error:', error);
      throw error;
    }
    
    console.log('Team settings updated successfully:', data);
    return data;
  },

  // Team Mails APIs
  getTeamMails: async (teamId: string): Promise<any[]> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // First, get the basic mail data
    const { data: mailsData, error: mailsError } = await supabase
      .from('team_mails')
      .select(`
        *,
        sender:profiles!sender_id(
          id,
          username,
          full_name,
          avatar_url
        )
      `)
      .eq('team_id', teamId)
      .order('sent_at', { ascending: false });

    if (mailsError) throw mailsError;

    if (!mailsData || mailsData.length === 0) {
      return [];
    }

    // Get user-specific mail recipient data
    const mailIds = mailsData.map(mail => mail.id);
    const { data: recipientData, error: recipientError } = await supabase
      .from('team_mail_recipients')
      .select('mail_id, is_read, read_at, is_starred, is_archived')
      .in('mail_id', mailIds)
      .eq('recipient_id', user.id);

    if (recipientError) throw recipientError;

    // Create a lookup map for recipient data
    const recipientMap = new Map();
    recipientData?.forEach(recipient => {
      recipientMap.set(recipient.mail_id, recipient);
    });

    // Transform data for frontend
    return mailsData.map(mail => {
      const userRecipient = recipientMap.get(mail.id);
      return {
        id: mail.id,
        teamId: mail.team_id,
        senderId: mail.sender_id,
        senderName: mail.sender?.full_name || mail.sender?.username || 'Unknown',
        senderAvatar: mail.sender?.avatar_url,
        recipientIds: mail.recipient_ids || [],
        subject: mail.subject,
        body: mail.body,
        priority: mail.priority,
        mailType: mail.mail_type,
        attachments: mail.attachments || [],
        isRead: userRecipient?.is_read || false,
        isStarred: userRecipient?.is_starred || false,
        isArchived: userRecipient?.is_archived || false,
        important: mail.important || false,
        sentAt: mail.sent_at,
        readAt: userRecipient?.read_at
      };
    });
  },

  sendTeamMail: async (teamId: string, mailData: any): Promise<any> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    console.log('Sending team mail:', { teamId, mailData });

    // Insert the mail
    const { data: mailRecord, error: mailError } = await supabase
      .from('team_mails')
      .insert({
        team_id: teamId,
        sender_id: user.id,
        recipient_ids: mailData.recipientIds,
        subject: mailData.subject,
        body: mailData.body,
        priority: mailData.priority,
        mail_type: mailData.mailType,
        attachments: mailData.attachments || [],
        is_sent: true,
        is_draft: false
      })
      .select()
      .single();

    if (mailError) {
      console.error('Error inserting team mail:', mailError);
      throw mailError;
    }

    console.log('Mail inserted successfully:', mailRecord);

    // Create recipient records
    if (mailData.recipientIds && mailData.recipientIds.length > 0) {
      const recipientRecords = mailData.recipientIds.map((recipientId: string) => ({
        mail_id: mailRecord.id,
        recipient_id: recipientId,
        is_read: false,
        is_starred: false,
        is_archived: false,
        is_deleted: false
      }));

      const { error: recipientError } = await supabase
        .from('team_mail_recipients')
        .insert(recipientRecords);

      if (recipientError) {
        console.error('Error inserting recipient records:', recipientError);
        // Don't throw here as the mail was successfully sent, just log the error
      } else {
        console.log('Recipient records created successfully');
      }
    }

    return mailRecord;
  },

  getTeamMailDrafts: async (teamId: string): Promise<any[]> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('team_mail_drafts')
      .select('*')
      .eq('team_id', teamId)
      .eq('author_id', user.id)
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  saveDraft: async (teamId: string, draftData: any): Promise<any> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('team_mail_drafts')
      .upsert({
        id: draftData.id, // Include ID if updating existing draft
        team_id: teamId,
        author_id: user.id,
        subject: draftData.subject,
        body: draftData.body,
        recipient_ids: draftData.recipientIds,
        mail_type: draftData.mailType,
        priority: draftData.priority,
        attachments: draftData.attachments || []
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  markTeamMailsAsRead: async (mailIds: string[]): Promise<void> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Update the team_mail_recipients table
    const { error } = await supabase
      .from('team_mail_recipients')
      .update({
        is_read: true,
        read_at: new Date().toISOString()
      })
      .in('mail_id', mailIds)
      .eq('recipient_id', user.id);

    if (error) throw error;
  },

  starTeamMail: async (mailId: string, starred: boolean): Promise<void> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('team_mail_recipients')
      .update({ is_starred: starred })
      .eq('mail_id', mailId)
      .eq('recipient_id', user.id);

    if (error) throw error;
  },

  archiveTeamMail: async (mailId: string, archived: boolean): Promise<void> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('team_mail_recipients')
      .update({ is_archived: archived })
      .eq('mail_id', mailId)
      .eq('recipient_id', user.id);

    if (error) throw error;
  },

  deleteTeamMail: async (mailId: string): Promise<void> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('team_mail_recipients')
      .update({ is_deleted: true })
      .eq('mail_id', mailId)
      .eq('recipient_id', user.id);

    if (error) throw error;
  },

  // Enhanced Profile APIs
  getUserProjects: async (userId: string): Promise<any[]> => {
    const { data, error } = await supabase
      .from('user_projects')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  createUserProject: async (projectData: any): Promise<any> => {
    const { data, error } = await supabase
      .from('user_projects')
      .insert(projectData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  updateUserProject: async (projectId: string, projectData: any): Promise<any> => {
    const { data, error } = await supabase
      .from('user_projects')
      .update(projectData)
      .eq('id', projectId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  deleteUserProject: async (projectId: string): Promise<void> => {
    const { error } = await supabase
      .from('user_projects')
      .delete()
      .eq('id', projectId);

    if (error) throw error;
  },

  getUserCertificates: async (userId: string): Promise<any[]> => {
    const { data, error } = await supabase
      .from('user_certificates')
      .select('*')
      .eq('user_id', userId)
      .order('issue_date', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  createUserCertificate: async (certData: any): Promise<any> => {
    const { data, error } = await supabase
      .from('user_certificates')
      .insert(certData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  updateUserCertificate: async (certId: string, certData: any): Promise<any> => {
    const { data, error } = await supabase
      .from('user_certificates')
      .update(certData)
      .eq('id', certId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  deleteUserCertificate: async (certId: string): Promise<void> => {
    const { error } = await supabase
      .from('user_certificates')
      .delete()
      .eq('id', certId);

    if (error) throw error;
  },

  getUserHackathonHistory: async (userId: string): Promise<any[]> => {
    const { data, error } = await supabase
      .from('user_hackathon_history')
      .select('*')
      .eq('user_id', userId)
      .order('started_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  createHackathonHistory: async (historyData: any): Promise<any> => {
    const { data, error } = await supabase
      .from('user_hackathon_history')
      .insert(historyData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // User Search APIs
  searchUsers: async (query: string, filters: any = {}): Promise<any[]> => {
    let queryBuilder = supabase
      .from('profiles')
      .select(`
        id,
        username,
        full_name,
        avatar_url,
        headline,
        location,
        skills,
        bio,
        github,
        linkedin,
        socials
      `);

    // Text search across multiple fields
    if (query) {
      queryBuilder = queryBuilder.or(
        `full_name.ilike.%${query}%,username.ilike.%${query}%,headline.ilike.%${query}%,bio.ilike.%${query}%`
      );
    }

    // Apply filters
    if (filters.location) {
      queryBuilder = queryBuilder.ilike('location', `%${filters.location}%`);
    }
    
    if (filters.skills) {
      queryBuilder = queryBuilder.contains('skills', [filters.skills]);
    }

    // Apply sorting
    switch (filters.sortBy) {
      case 'alphabetical':
        queryBuilder = queryBuilder.order('full_name', { ascending: true });
        break;
      case 'recent':
        queryBuilder = queryBuilder.order('created_at', { ascending: false });
        break;
      default:
        queryBuilder = queryBuilder.order('full_name', { ascending: true });
    }

    const { data, error } = await queryBuilder.limit(50);

    if (error) throw error;

    // Get connection status for each user if authenticated
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !data) return data || [];

    // Get connection statuses
    const userIds = data.map(profile => profile.id);
    const [connectionsData, requestsData] = await Promise.all([
      supabase
        .from('user_connections')
        .select('user_id_a, user_id_b')
        .or(`user_id_a.eq.${user.id},user_id_b.eq.${user.id}`)
        .in('user_id_a', [...userIds, user.id])
        .in('user_id_b', [...userIds, user.id]),
      
      supabase
        .from('user_connection_requests')
        .select('requester_id, recipient_id, status')
        .or(`requester_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .in('requester_id', [...userIds, user.id])
        .in('recipient_id', [...userIds, user.id])
        .eq('status', 'pending')
    ]);

    // Process connection statuses
    const connections = new Set();
    const pendingRequests = new Map();
    const sentRequests = new Set();

    connectionsData.data?.forEach(conn => {
      const otherId = conn.user_id_a === user.id ? conn.user_id_b : conn.user_id_a;
      connections.add(otherId);
    });

    requestsData.data?.forEach(req => {
      if (req.requester_id === user.id) {
        sentRequests.add(req.recipient_id);
      } else {
        pendingRequests.set(req.requester_id, true);
      }
    });

    // Enhance data with connection status
    return data.map(profile => ({
      ...profile,
      connection_status: {
        isConnected: connections.has(profile.id),
        hasPendingRequest: pendingRequests.has(profile.id),
        isRequestSent: sentRequests.has(profile.id)
      }
    }));
  },

  getSuggestedUsers: async (): Promise<any[]> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Get user's profile to find similar interests/skills
    const { data: currentUser } = await supabase
      .from('profiles')
      .select('skills, interests, location')
      .eq('id', user.id)
      .single();

    if (!currentUser) return [];

    // Get existing connections
    const { data: connections } = await supabase
      .from('user_connections')
      .select('user_id_a, user_id_b')
      .or(`user_id_a.eq.${user.id},user_id_b.eq.${user.id}`);

    const connectedUserIds = new Set(
      connections?.flatMap(conn => [conn.user_id_a, conn.user_id_b]) || []
    );
    connectedUserIds.add(user.id); // Exclude self

    // Find users with similar skills or location
    let queryBuilder = supabase
      .from('profiles')
      .select(`
        id,
        username,
        full_name,
        avatar_url,
        headline,
        location,
        skills,
        bio,
        github,
        linkedin,
        socials
      `)
      .not('id', 'in', `(${Array.from(connectedUserIds).join(',')})`)
      .limit(20);

    // Add location or skill-based suggestions
    if (currentUser.location || (currentUser.skills && currentUser.skills.length > 0)) {
      const conditions = [];
      if (currentUser.location) {
        conditions.push(`location.ilike.%${currentUser.location}%`);
      }
      if (currentUser.skills && currentUser.skills.length > 0) {
        conditions.push(`skills.cs.{${currentUser.skills.join(',')}}`);
      }
      if (conditions.length > 0) {
        queryBuilder = queryBuilder.or(conditions.join(','));
      }
    }

    const { data, error } = await queryBuilder;
    if (error) throw error;

    return data || [];
  },

  // Connection Management APIs
  sendConnectionRequest: async (recipientId: string, message?: string): Promise<void> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('user_connection_requests')
      .insert({
        requester_id: user.id,
        recipient_id: recipientId,
        message: message || ''
      });

    if (error) throw error;
  },

  acceptConnectionRequest: async (requestId: string): Promise<void> => {
    const { error } = await supabase.rpc('accept_connection_request', {
      p_request_id: requestId
    });

    if (error) throw error;
  },

  declineConnectionRequest: async (requestId: string): Promise<void> => {
    const { error } = await supabase
      .from('user_connection_requests')
      .update({ status: 'declined', responded_at: new Date().toISOString() })
      .eq('id', requestId);

    if (error) throw error;
  },

  cancelConnectionRequest: async (requestId: string): Promise<void> => {
    const { error } = await supabase
      .from('user_connection_requests')
      .update({ status: 'cancelled' })
      .eq('id', requestId);

    if (error) throw error;
  },

  removeConnection: async (userId: string): Promise<void> => {
    const { error } = await supabase.rpc('remove_connection_with', {
      p_other_user: userId
    });

    if (error) throw error;
  },

  getUserConnections: async (): Promise<any[]> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('user_connections')
      .select(`
        id,
        user_id_a,
        user_id_b,
        connected_at
      `)
      .or(`user_id_a.eq.${user.id},user_id_b.eq.${user.id}`);

    if (error) throw error;

    // Get user profiles for each connection
    const connections = data || [];
    const userIds = connections.flatMap(conn => [conn.user_id_a, conn.user_id_b]).filter(id => id !== user.id);
    
    if (userIds.length === 0) return [];

    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select(`
        id,
        username,
        full_name,
        avatar_url,
        headline,
        location,
        skills,
        bio
      `)
      .in('id', userIds);

    if (profilesError) throw profilesError;

    // Map connections with user profiles
    return connections.map(connection => {
      const otherUserId = connection.user_id_a === user.id ? connection.user_id_b : connection.user_id_a;
      const userProfile = profiles?.find(p => p.id === otherUserId);
      
      return {
        id: connection.id,
        user_id_a: connection.user_id_a,
        user_id_b: connection.user_id_b,
        connected_at: connection.connected_at,
        user: userProfile
      };
    });
  },

  getPendingConnectionRequests: async (): Promise<any[]> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('user_connection_requests')
      .select(`
        *,
        requester:profiles!requester_id(
          id,
          username,
          full_name,
          avatar_url,
          headline,
          location,
          skills,
          bio
        )
      `)
      .eq('recipient_id', user.id)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  getSentConnectionRequests: async (): Promise<any[]> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('user_connection_requests')
      .select(`
        *,
        recipient:profiles!recipient_id(
          id,
          username,
          full_name,
          avatar_url,
          headline,
          location,
          skills,
          bio
        )
      `)
      .eq('requester_id', user.id)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  getConnectionStatus: async (userId: string): Promise<any> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Check if already connected
    const { data: connection } = await supabase
      .from('user_connections')
      .select('id')
      .or(`and(user_id_a.eq.${user.id},user_id_b.eq.${userId}),and(user_id_a.eq.${userId},user_id_b.eq.${user.id})`)
      .single();

    if (connection) {
      // Get connection count
      const { count } = await supabase
        .from('user_connections')
        .select('*', { count: 'exact' })
        .or(`user_id_a.eq.${userId},user_id_b.eq.${userId}`);

      return {
        isConnected: true,
        hasPendingRequest: false,
        isRequestSent: false,
        connectionCount: count || 0,
        mutualConnections: 0 // TODO: Calculate mutual connections
      };
    }

    // Check for pending requests
    const { data: requests } = await supabase
      .from('user_connection_requests')
      .select('requester_id, recipient_id')
      .or(`and(requester_id.eq.${user.id},recipient_id.eq.${userId}),and(requester_id.eq.${userId},recipient_id.eq.${user.id})`)
      .eq('status', 'pending');

    const hasPendingRequest = requests?.some(r => r.requester_id === userId) || false;
    const isRequestSent = requests?.some(r => r.requester_id === user.id) || false;

    // Get connection count
    const { count } = await supabase
      .from('user_connections')
      .select('*', { count: 'exact' })
      .or(`user_id_a.eq.${userId},user_id_b.eq.${userId}`);

    return {
      isConnected: false,
      hasPendingRequest,
      isRequestSent,
      connectionCount: count || 0,
      mutualConnections: 0 // TODO: Calculate mutual connections
    };
  }
};

// React Query helper functions (keeping these for compatibility)
export const useEvents = () => {
  return queryClient.getQueryData(['events']) || [];
};

export const useEvent = (slug: string) => {
  return queryClient.getQueryData(['events', slug]);
};

// Export both APIs for transition period
export { supabaseApi as api };
