import { queryClient } from "./queryClient";

// API base URL - use environment variable or fallback
const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

// Helper function for making API requests
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, config);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Network error' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

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

export interface Team {
  id: string;
  name: string;
  description: string;
  eventId: string;
  leaderId: string;
  members: string[];
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

// Real API functions connecting to backend
export const api = {
  // Authentication
  auth: {
    login: async (email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> => {
      return apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
    },

    register: async (userData: Partial<User>): Promise<{ success: boolean; user?: User; error?: string }> => {
      return apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
    },
  },

  // Events
  getEvents: async (): Promise<Event[]> => {
    return apiRequest('/events');
  },

  getEvent: async (id: string): Promise<Event> => {
    return apiRequest(`/events/${id}`);
  },

  getEventBySlug: async (slug: string): Promise<Event> => {
    return apiRequest(`/events/slug/${slug}`);
  },

  getOrganizerEvents: async (organizerId: string): Promise<Event[]> => {
    return apiRequest(`/events/organizer/${organizerId}`);
  },

  createEvent: async (eventData: Partial<Event>): Promise<Event> => {
    return apiRequest('/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  },

  updateEvent: async (id: string, updates: Partial<Event>): Promise<Event> => {
    return apiRequest(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  deleteEvent: async (id: string): Promise<{ success: boolean }> => {
    return apiRequest(`/events/${id}`, {
      method: 'DELETE',
    });
  },

  // Event Analytics and Management
  getEventAnalytics: async (eventId: string): Promise<any> => {
    return apiRequest(`/events/${eventId}/analytics`);
  },

  getEventHealthChecks: async (eventId: string): Promise<any[]> => {
    return apiRequest(`/events/${eventId}/health`);
  },

  getOrganizerStats: async (organizerId: string): Promise<any> => {
    return apiRequest(`/organizers/${organizerId}/stats`);
  },

  // Judges
  getEventJudges: async (eventId: string): Promise<Judge[]> => {
    return apiRequest(`/events/${eventId}/judges`);
  },

  getJudge: async (id: string): Promise<Judge> => {
    return apiRequest(`/judges/${id}`);
  },

  createJudge: async (eventId: string, judgeData: Partial<Judge>): Promise<Judge> => {
    return apiRequest(`/events/${eventId}/judges`, {
      method: 'POST',
      body: JSON.stringify(judgeData),
    });
  },

  updateJudge: async (id: string, updates: Partial<Judge>): Promise<Judge> => {
    return apiRequest(`/judges/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  deleteJudge: async (id: string): Promise<{ success: boolean }> => {
    return apiRequest(`/judges/${id}`, {
      method: 'DELETE',
    });
  },

  // Participants
  getEventParticipants: async (eventId: string): Promise<any[]> => {
    return apiRequest(`/events/${eventId}/participants`);
  },

  registerParticipant: async (eventId: string, participantData: any): Promise<any> => {
    return apiRequest(`/events/${eventId}/participants`, {
      method: 'POST',
      body: JSON.stringify(participantData),
    });
  },

  updateParticipant: async (id: string, updates: any): Promise<any> => {
    return apiRequest(`/participants/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  // Teams
  getEventTeams: async (eventId: string): Promise<Team[]> => {
    return apiRequest(`/events/${eventId}/teams`);
  },

  getTeam: async (id: string): Promise<Team> => {
    return apiRequest(`/teams/${id}`);
  },

  createTeam: async (eventId: string, teamData: Partial<Team>): Promise<Team> => {
    return apiRequest(`/events/${eventId}/teams`, {
      method: 'POST',
      body: JSON.stringify(teamData),
    });
  },

  updateTeam: async (id: string, updates: Partial<Team>): Promise<Team> => {
    return apiRequest(`/teams/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  // Submissions
  getEventSubmissions: async (eventId: string): Promise<Submission[]> => {
    return apiRequest(`/events/${eventId}/submissions`);
  },

  getSubmission: async (id: string): Promise<Submission> => {
    return apiRequest(`/submissions/${id}`);
  },

  createSubmission: async (eventId: string, submissionData: Partial<Submission>): Promise<Submission> => {
    return apiRequest(`/events/${eventId}/submissions`, {
      method: 'POST',
      body: JSON.stringify(submissionData),
    });
  },

  updateSubmission: async (id: string, updates: Partial<Submission>): Promise<Submission> => {
    return apiRequest(`/submissions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  // Scoring
  getSubmissionScores: async (submissionId: string): Promise<any[]> => {
    return apiRequest(`/submissions/${submissionId}/scores`);
  },

  getJudgeScores: async (judgeId: string): Promise<any[]> => {
    return apiRequest(`/judges/${judgeId}/scores`);
  },

  createScore: async (scoreData: any): Promise<any> => {
    return apiRequest('/scores', {
      method: 'POST',
      body: JSON.stringify(scoreData),
    });
  },

  updateScore: async (id: string, updates: any): Promise<any> => {
    return apiRequest(`/scores/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  // Sponsors
  getEventSponsors: async (eventId: string): Promise<any[]> => {
    return apiRequest(`/events/${eventId}/sponsors`);
  },

  createSponsor: async (eventId: string, sponsorData: any): Promise<any> => {
    return apiRequest(`/events/${eventId}/sponsors`, {
      method: 'POST',
      body: JSON.stringify(sponsorData),
    });
  },

  updateSponsor: async (id: string, updates: any): Promise<any> => {
    return apiRequest(`/sponsors/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  // Event Content
  getEventContent: async (eventId: string): Promise<any[]> => {
    return apiRequest(`/events/${eventId}/content`);
  },

  getEventContentBySection: async (eventId: string, section: string): Promise<any> => {
    return apiRequest(`/events/${eventId}/content/${section}`);
  },

  createEventContent: async (eventId: string, contentData: any): Promise<any> => {
    return apiRequest(`/events/${eventId}/content`, {
      method: 'POST',
      body: JSON.stringify(contentData),
    });
  },

  updateEventContent: async (id: string, updates: any): Promise<any> => {
    return apiRequest(`/events/content/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  // Users
  getUser: async (id: string): Promise<User> => {
    return apiRequest(`/users/${id}`);
  },

  updateUser: async (id: string, updates: Partial<User>): Promise<User> => {
    return apiRequest(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  // Legacy compatibility functions (keep for existing components that haven't been updated yet)
  getFeaturedEvents: async (): Promise<Event[]> => {
    const events = await api.getEvents();
    return events.slice(0, 6);
  },

  getUsers: async (): Promise<User[]> => {
    // This would need to be implemented on the backend if needed
    throw new Error('getUsers not implemented - use specific user endpoints instead');
  },

  getUserByUsername: async (username: string): Promise<User | null> => {
    // This would need to be implemented on the backend if needed
    throw new Error('getUserByUsername not implemented - use user ID endpoints instead');
  },

  getTeams: async (eventId?: string): Promise<Team[]> => {
    if (eventId) {
      return api.getEventTeams(eventId);
    }
    throw new Error('getTeams requires eventId parameter');
  },

  getSubmissions: async (eventId?: string): Promise<Submission[]> => {
    if (eventId) {
      return api.getEventSubmissions(eventId);
    }
    throw new Error('getSubmissions requires eventId parameter');
  },

  getFeaturedProjects: async (): Promise<Submission[]> => {
    // This would need to be implemented on the backend if needed
    throw new Error('getFeaturedProjects not implemented yet');
  },

  getJudges: async (): Promise<Judge[]> => {
    // This would need to be implemented on the backend if needed
    throw new Error('getJudges not implemented - use getEventJudges instead');
  },

  getLeaderboards: async (type: 'hackers' | 'organizers' | 'judges' = 'hackers') => {
    // This would need to be implemented on the backend if needed
    throw new Error('getLeaderboards not implemented yet');
  },

  searchEvents: async (query: string, filters: any = {}) => {
    // This would need to be implemented on the backend if needed
    const events = await api.getEvents();
    
    let filteredEvents = events;
    
    if (query) {
      filteredEvents = filteredEvents.filter(e => 
        e.title.toLowerCase().includes(query.toLowerCase()) ||
        e.description.toLowerCase().includes(query.toLowerCase()) ||
        (e.tags || []).some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      );
    }

    if (filters.status) {
      filteredEvents = filteredEvents.filter(e => e.status === filters.status);
    }

    if (filters.format) {
      filteredEvents = filteredEvents.filter(e => e.format === filters.format);
    }

    return filteredEvents;
  }
};

// React Query helper functions
export const useEvents = () => {
  return queryClient.getQueryData(['events']) || [];
};

export const useEvent = (slug: string) => {
  return queryClient.getQueryData(['events', slug]);
};
