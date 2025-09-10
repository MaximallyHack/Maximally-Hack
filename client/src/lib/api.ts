import { supabase } from '../supabaseClient';
import { queryClient } from './queryClient';

// Optimized delay for better performance
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Type definitions (keeping the same interfaces your components expect)
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

export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  avatar: string;
  role: 'participant' | 'organizer' | 'judge';
  bio: string;
  skills: string[];
  location: string;
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
  projects: string[];
  expertise?: string[];
}

export interface TeamMember {
  id: string;
  name: string;
  username: string;
  role: string;
  avatar?: string;
}

export interface Team {
  id: string;
  name: string;
  description: string;
  eventId: string | null;
  leaderId: string;
  members: TeamMember[];
  maxSize: number;
  joinCode: string;
  skills: string[];
  lookingFor: string[];
  track: string;
  created: string;
  status: 'recruiting' | 'full' | 'disbanded';
}

export interface Submission {
  id: string;
  title: string;
  tagline: string;
  description: string;
  longDescription: string;
  eventId: string;
  teamId: string;
  submittedBy: string;
  submittedAt: string;
  track: string;
  tags: string[];
  techStack: string[];
  demoUrl?: string;
  githubUrl?: string;
  slidesUrl?: string;
  videoUrl?: string;
  images: string[];
  status: 'draft' | 'submitted' | 'judging' | 'judged';
  scores?: any;
  averageScore?: number;
  awards?: string[];
  features: string[];
}

export interface Judge {
  id: string;
  name: string;
  title: string;
  company: string;
  avatar: string;
  bio: string;
  expertise: string[];
  location: string;
  social: {
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
  badges: string[];
  eventsJudged: number;
  rating: number;
  quote: string;
  availability: 'Available' | 'Limited' | 'Unavailable';
  timezone: string;
}

export interface LFGPost {
  id: string;
  title: string;
  description: string;
  type: 'individual' | 'team';
  userId?: string;
  teamId?: string;
  eventId?: string;
  skills: string[];
  preferredRoles: string[];  // For individuals
  lookingFor: string[];      // For teams
  availability?: string;
  experienceLevel?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  status: 'active' | 'inactive' | 'fulfilled';
  postedAt: string;
  expiresAt?: string;
}

// Field mapping functions for database <-> component interface
const mapDBEventToEvent = (dbEvent: any): Event => ({
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

const mapEventToDBEvent = (event: Partial<Event>) => ({
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

const mapDBProfileToUser = (dbProfile: any): User => ({
  id: dbProfile.id,
  username: dbProfile.username,
  name: dbProfile.full_name || dbProfile.username,
  email: dbProfile.email || '',
  avatar: dbProfile.avatar_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
  role: dbProfile.role || 'participant',
  bio: dbProfile.bio || '',
  skills: dbProfile.skills || [],
  location: dbProfile.location || '',
  github: dbProfile.github,
  linkedin: dbProfile.linkedin,
  twitter: dbProfile.twitter,
  website: dbProfile.website,
  joinDate: dbProfile.join_date || dbProfile.created_at,
  stats: {
    hackathonsParticipated: dbProfile.hackathons_participated || 0,
    wins: dbProfile.wins || 0,
    finals: dbProfile.finals || 0,
    organized: dbProfile.organized || 0,
    judged: dbProfile.judged || 0
  },
  badges: dbProfile.badges || [],
  projects: [], // Will be populated separately if needed
  expertise: dbProfile.expertise || []
});

const mapDBTeamToTeam = (dbTeam: any): Team => ({
  id: dbTeam.id,
  name: dbTeam.name,
  description: dbTeam.description || '',
  eventId: dbTeam.event_id,
  leaderId: dbTeam.leader_id,
  members: dbTeam.members?.map((m: any) => ({
    id: m.user_id || m.user?.id || m.id,
    name: m.user?.full_name || m.user?.username || 'Unknown',
    username: m.user?.username || '',
    role: m.role || 'member',
    avatar: m.user?.avatar_url
  })) || [],
  maxSize: dbTeam.max_size,
  joinCode: dbTeam.join_code,
  skills: dbTeam.skills || [],
  lookingFor: dbTeam.looking_for || [],
  track: dbTeam.track || '',
  created: dbTeam.created_at,
  status: dbTeam.status
});

const mapDBSubmissionToSubmission = (dbSubmission: any): Submission => ({
  id: dbSubmission.id,
  title: dbSubmission.title,
  tagline: dbSubmission.tagline || '',
  description: dbSubmission.description,
  longDescription: dbSubmission.long_description || '',
  eventId: dbSubmission.event_id,
  teamId: dbSubmission.team_id,
  submittedBy: dbSubmission.submitted_by,
  submittedAt: dbSubmission.submitted_at || dbSubmission.created_at,
  track: dbSubmission.track || '',
  tags: dbSubmission.tags || [],
  techStack: dbSubmission.tech_stack || [],
  demoUrl: dbSubmission.demo_url,
  githubUrl: dbSubmission.github_url,
  slidesUrl: dbSubmission.slides_url,
  videoUrl: dbSubmission.video_url,
  images: dbSubmission.images || [],
  status: dbSubmission.status,
  scores: {},
  averageScore: dbSubmission.average_score,
  awards: dbSubmission.awards || [],
  features: dbSubmission.features || []
});

const mapDBLFGPostToLFGPost = (dbPost: any): LFGPost => ({
  id: dbPost.id,
  title: dbPost.title,
  description: dbPost.description,
  type: dbPost.type,
  userId: dbPost.user_id,
  teamId: dbPost.team_id,
  eventId: dbPost.event_id,
  skills: dbPost.skills || [],
  preferredRoles: dbPost.preferred_roles || [],
  lookingFor: dbPost.looking_for || [],
  availability: dbPost.availability,
  experienceLevel: dbPost.experience_level,
  status: dbPost.status,
  postedAt: dbPost.posted_at,
  expiresAt: dbPost.expires_at
});

// Supabase API functions
export const api = {
  // Events
  getEvents: async (): Promise<Event[]> => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('start_date', { ascending: false });

      if (error) throw error;
      return (data || []).map(mapDBEventToEvent);
    } catch (error) {
      console.error('Error fetching events:', error);
      return [];
    }
  },

  getEvent: async (slug: string): Promise<Event | null> => {
    try {
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
    } catch (error) {
      console.error('Error fetching event:', error);
      return null;
    }
  },

  getFeaturedEvents: async (): Promise<Event[]> => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('participant_count', { ascending: false })
        .limit(6);

      if (error) throw error;
      return (data || []).map(mapDBEventToEvent);
    } catch (error) {
      console.error('Error fetching featured events:', error);
      return [];
    }
  },

  createEvent: async (eventData: Partial<Event>): Promise<Event> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const dbEventData = mapEventToDBEvent({
      ...eventData,
      organizerId: user.id,
      participantCount: 0
    });

    const { data, error } = await supabase
      .from('events')
      .insert(dbEventData)
      .select()
      .single();

    if (error) throw error;
    return mapDBEventToEvent(data);
  },

  // Users
  getUsers: async (): Promise<User[]> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*');

      if (error) throw error;
      return (data || []).map(mapDBProfileToUser);
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  },

  getUser: async (id: string): Promise<User | null> => {
    try {
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
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  },

  getUserByUsername: async (username: string): Promise<User | null> => {
    try {
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
    } catch (error) {
      console.error('Error fetching user by username:', error);
      return null;
    }
  },

  // Teams
  getTeams: async (eventId?: string): Promise<Team[]> => {
    try {
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

      return (data || []).map(mapDBTeamToTeam);
    } catch (error) {
      console.error('Error fetching teams:', error);
      return [];
    }
  },

  getTeam: async (id: string): Promise<Team | null> => {
    try {
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

      return mapDBTeamToTeam(data);
    } catch (error) {
      console.error('Error fetching team:', error);
      return null;
    }
  },

  createTeam: async (teamData: Partial<Team>): Promise<Team> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('teams')
      .insert({
        name: teamData.name,
        description: teamData.description,
        event_id: teamData.eventId || null,
        leader_id: user.id,
        max_size: teamData.maxSize || 4,
        join_code: Math.random().toString(36).substring(2, 8).toUpperCase(),
        skills: teamData.skills || [],
        looking_for: teamData.lookingFor || [],
        track: teamData.track || 'General',
        status: 'recruiting'
      })
      .select()
      .single();

    if (error) throw error;

    // Add the creator as a team member
    const { error: memberError } = await supabase
      .from('team_members')
      .insert({
        team_id: data.id,
        user_id: user.id,
        role: 'leader'
      });

    if (memberError) {
      console.error('Error adding team leader as member:', memberError);
      // Don't throw error here, just log it as team is already created
    }

    return mapDBTeamToTeam(data);
  },

  // Submissions
  getSubmissions: async (eventId?: string): Promise<Submission[]> => {
    try {
      let query = supabase
        .from('submissions')
        .select('*')
        .eq('status', 'submitted'); // Only show submitted submissions publicly

      if (eventId) {
        query = query.eq('event_id', eventId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data || []).map(mapDBSubmissionToSubmission);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      return [];
    }
  },

  getSubmission: async (id: string): Promise<Submission | null> => {
    try {
      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null;
        throw error;
      }
      return mapDBSubmissionToSubmission(data);
    } catch (error) {
      console.error('Error fetching submission:', error);
      return null;
    }
  },

  getFeaturedProjects: async (): Promise<Submission[]> => {
    try {
      await delay(400);
      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .eq('status', 'submitted')
        .order('average_score', { ascending: false })
        .limit(12);

      if (error) throw error;
      return (data || []).map(mapDBSubmissionToSubmission);
    } catch (error) {
      console.error('Error fetching featured projects:', error);
      return [];
    }
  },

  // Judges
  getJudges: async (): Promise<Judge[]> => {
    try {
      await delay(300);
      const { data, error } = await supabase
        .from('judges')
        .select(`
          *,
          profile:profiles(*)
        `);

      if (error) throw error;

      return (data || []).map(judge => ({
        id: judge.id,
        name: judge.profile.full_name || judge.profile.username,
        title: judge.title,
        company: judge.company,
        avatar: judge.profile.avatar_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        bio: judge.profile.bio || '',
        expertise: judge.profile.expertise || [],
        location: judge.profile.location || '',
        social: judge.social || {},
        badges: judge.profile.badges || [],
        eventsJudged: judge.events_judged || 0,
        rating: judge.rating || 0,
        quote: judge.quote || '',
        availability: judge.availability || 'Available',
        timezone: judge.timezone || ''
      }));
    } catch (error) {
      console.error('Error fetching judges:', error);
      return [];
    }
  },

  getJudge: async (id: string): Promise<Judge | null> => {
    try {
      await delay(200);
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
        id: data.id,
        name: data.profile.full_name || data.profile.username,
        title: data.title,
        company: data.company,
        avatar: data.profile.avatar_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        bio: data.profile.bio || '',
        expertise: data.profile.expertise || [],
        location: data.profile.location || '',
        social: data.social || {},
        badges: data.profile.badges || [],
        eventsJudged: data.events_judged || 0,
        rating: data.rating || 0,
        quote: data.quote || '',
        availability: data.availability || 'Available',
        timezone: data.timezone || ''
      };
    } catch (error) {
      console.error('Error fetching judge:', error);
      return null;
    }
  },

  // Leaderboards
  getLeaderboards: async (type: 'hackers' | 'organizers' | 'judges' = 'hackers') => {
    try {
      await delay(500);
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
          name: judge.profile.full_name || judge.profile.username,
          avatar: judge.profile.avatar_url
        }));
      }

      return (data || []).map(mapDBProfileToUser);
    } catch (error) {
      console.error('Error fetching leaderboards:', error);
      return [];
    }
  },

  // Search and filter
  searchEvents: async (query: string, filters: any = {}) => {
    try {
      await delay(50);
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
      return (data || []).map(mapDBEventToEvent);
    } catch (error) {
      console.error('Error searching events:', error);
      return [];
    }
  },

  // LFG Posts
  getLFGPosts: async (eventId?: string): Promise<LFGPost[]> => {
    try {
      let query = supabase
        .from('lfg_posts')
        .select(`
          *,
          user:profiles(*),
          team:teams(*)
        `)
        .eq('status', 'active')
        .order('posted_at', { ascending: false });

      if (eventId) {
        query = query.eq('event_id', eventId);
      }

      const { data, error } = await query;
      if (error) throw error;

      return (data || []).map(mapDBLFGPostToLFGPost);
    } catch (error) {
      console.error('Error fetching LFG posts:', error);
      return [];
    }
  },

  getLFGPost: async (id: string): Promise<LFGPost | null> => {
    try {
      const { data, error } = await supabase
        .from('lfg_posts')
        .select(`
          *,
          user:profiles(*),
          team:teams(*)
        `)
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null;
        throw error;
      }

      return mapDBLFGPostToLFGPost(data);
    } catch (error) {
      console.error('Error fetching LFG post:', error);
      return null;
    }
  },

  createLFGPost: async (postData: Partial<LFGPost>): Promise<LFGPost> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Validate post data
    if (!postData.title || !postData.description || !postData.type) {
      throw new Error('Title, description, and type are required');
    }

    // Prepare data for insertion
    const insertData: any = {
      title: postData.title,
      description: postData.description,
      type: postData.type,
      event_id: postData.eventId,
      skills: postData.skills || [],
      preferred_roles: postData.preferredRoles || [],
      looking_for: postData.lookingFor || [],
      availability: postData.availability,
      experience_level: postData.experienceLevel,
      status: 'active'
    };

    // Set owner based on post type
    if (postData.type === 'individual') {
      insertData.user_id = user.id;
      insertData.team_id = null;
    } else if (postData.type === 'team') {
      insertData.user_id = null;
      insertData.team_id = postData.teamId;
      
      if (!postData.teamId) {
        throw new Error('Team ID is required for team posts');
      }
    }

    const { data, error } = await supabase
      .from('lfg_posts')
      .insert(insertData)
      .select()
      .single();

    if (error) throw error;
    return mapDBLFGPostToLFGPost(data);
  },

  updateLFGPost: async (id: string, postData: Partial<LFGPost>): Promise<LFGPost> => {
    const updateData: any = {};
    
    if (postData.title) updateData.title = postData.title;
    if (postData.description) updateData.description = postData.description;
    if (postData.skills) updateData.skills = postData.skills;
    if (postData.preferredRoles) updateData.preferred_roles = postData.preferredRoles;
    if (postData.lookingFor) updateData.looking_for = postData.lookingFor;
    if (postData.availability) updateData.availability = postData.availability;
    if (postData.experienceLevel) updateData.experience_level = postData.experienceLevel;
    if (postData.status) updateData.status = postData.status;

    const { data, error } = await supabase
      .from('lfg_posts')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return mapDBLFGPostToLFGPost(data);
  },

  deleteLFGPost: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('lfg_posts')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};

// React Query helper functions
export const useEvents = () => {
  return queryClient.getQueryData(['events']) || [];
};

export const useEvent = (slug: string) => {
  return queryClient.getQueryData(['events', slug]);
};
