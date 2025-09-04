import { queryClient } from "./queryClient";

// Simulate API delay for realistic loading states
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Import fixtures
import eventsData from "./fixtures/events.json";
import usersData from "./fixtures/users.json";
import teamsData from "./fixtures/teams.json";
import submissionsData from "./fixtures/submissions.json";
import judgesData from "./fixtures/judges.json";

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

// Mock API functions
export const api = {
  // Events
  getEvents: async (): Promise<Event[]> => {
    await delay(500);
    return eventsData as Event[];
  },

  getEvent: async (slug: string): Promise<Event | null> => {
    await delay(300);
    const event = eventsData.find(e => e.slug === slug);
    return event ? (event as Event) : null;
  },

  getFeaturedEvents: async (): Promise<Event[]> => {
    await delay(400);
    return eventsData.slice(0, 6) as Event[];
  },

  // Users
  getUsers: async (): Promise<User[]> => {
    await delay(300);
    return usersData as User[];
  },

  getUser: async (id: string): Promise<User | null> => {
    await delay(200);
    const user = usersData.find(u => u.id === id);
    return user ? (user as User) : null;
  },

  getUserByUsername: async (username: string): Promise<User | null> => {
    await delay(200);
    const user = usersData.find(u => u.username === username);
    return user ? (user as User) : null;
  },

  // Teams
  getTeams: async (eventId?: string): Promise<Team[]> => {
    await delay(300);
    let teams = teamsData as Team[];
    if (eventId) {
      teams = teams.filter(t => t.eventId === eventId);
    }
    return teams;
  },

  getTeam: async (id: string): Promise<Team | null> => {
    await delay(200);
    const team = teamsData.find(t => t.id === id);
    return team ? (team as Team) : null;
  },

  createTeam: async (teamData: Partial<Team>): Promise<Team> => {
    await delay(500);
    const newTeam: Team = {
      id: `team-${Date.now()}`,
      name: teamData.name || '',
      description: teamData.description || '',
      eventId: teamData.eventId || '',
      leaderId: teamData.leaderId || '',
      members: teamData.members || [],
      maxSize: teamData.maxSize || 4,
      joinCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
      skills: teamData.skills || [],
      lookingFor: teamData.lookingFor || [],
      track: teamData.track || '',
      created: new Date().toISOString(),
      status: 'recruiting'
    };
    return newTeam;
  },

  // Submissions
  getSubmissions: async (eventId?: string): Promise<Submission[]> => {
    await delay(400);
    let submissions = submissionsData as Submission[];
    if (eventId) {
      submissions = submissions.filter(s => s.eventId === eventId);
    }
    return submissions;
  },

  getSubmission: async (id: string): Promise<Submission | null> => {
    await delay(200);
    const submission = submissionsData.find(s => s.id === id);
    return submission ? (submission as Submission) : null;
  },

  getFeaturedProjects: async (): Promise<Submission[]> => {
    await delay(400);
    return submissionsData.slice(0, 12) as Submission[];
  },

  // Judges
  getJudges: async (): Promise<Judge[]> => {
    await delay(300);
    return judgesData as Judge[];
  },

  getJudge: async (id: string): Promise<Judge | null> => {
    await delay(200);
    const judge = judgesData.find(j => j.id === id);
    return judge ? (judge as Judge) : null;
  },

  // Leaderboards
  getLeaderboards: async (type: 'hackers' | 'organizers' | 'judges' = 'hackers') => {
    await delay(500);
    const users = usersData as User[];
    
    switch (type) {
      case 'hackers':
        return users
          .filter(u => u.role === 'participant')
          .sort((a, b) => (b.stats.wins * 100 + b.stats.finals * 50) - (a.stats.wins * 100 + a.stats.finals * 50))
          .slice(0, 20);
      case 'organizers':
        return users
          .filter(u => u.role === 'organizer')
          .sort((a, b) => b.stats.organized - a.stats.organized)
          .slice(0, 20);
      case 'judges':
        return judgesData
          .sort((a, b) => b.eventsJudged - a.eventsJudged)
          .slice(0, 20);
      default:
        return [];
    }
  },

  // Search and filter
  searchEvents: async (query: string, filters: any = {}) => {
    await delay(300);
    let events = eventsData as Event[];
    
    if (query) {
      events = events.filter(e => 
        e.title.toLowerCase().includes(query.toLowerCase()) ||
        e.description.toLowerCase().includes(query.toLowerCase()) ||
        e.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      );
    }

    if (filters.status) {
      events = events.filter(e => e.status === filters.status);
    }

    if (filters.format) {
      events = events.filter(e => e.format === filters.format);
    }

    if (filters.tags && filters.tags.length > 0) {
      events = events.filter(e => 
        filters.tags.some((tag: string) => e.tags.includes(tag))
      );
    }

    if (filters.prizeMin) {
      events = events.filter(e => e.prizePool >= filters.prizeMin);
    }

    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'date':
          events.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
          break;
        case 'popular':
          events.sort((a, b) => b.participantCount - a.participantCount);
          break;
        case 'prize':
          events.sort((a, b) => b.prizePool - a.prizePool);
          break;
      }
    }

    return events;
  }
};

// React Query helper functions
export const useEvents = () => {
  return queryClient.getQueryData(['events']) || [];
};

export const useEvent = (slug: string) => {
  return queryClient.getQueryData(['events', slug]);
};
