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


export interface Submission {
  id: string;
  title: string;
  tagline?: string;
  description: string;
  longDescription?: string;
  eventId: string;
  teamId?: string;
  submittedBy: string;
  track?: string;
  tags: string[];
  techStack: string[];
  demoUrl?: string;
  githubUrl?: string;
  slidesUrl?: string;
  videoUrl?: string;
  images: string[];
  status: 'draft' | 'submitted' | 'judging' | 'judged';
  features: string[];
  averageScore?: number;
  awards?: string[];
  submittedAt?: string;
  scores?: any;
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
  eventsJudged: number;
  rating: number;
  quote?: string;
  availability: 'Available' | 'Limited' | 'Unavailable';
  timezone?: string;
}

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
      members: team.members?.map((m: any) => m.user) || []
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
      members: data.members?.map((m: any) => m.user) || []
    };
  },

  createTeam: async (teamData: Partial<Team>): Promise<Team> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('teams')
      .insert({
        ...teamData,
        leader_id: user.id,
        join_code: Math.random().toString(36).substring(2, 8).toUpperCase()
      })
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

    return data;
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
    return data || [];
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
