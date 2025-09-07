import { 
  type User, 
  type InsertUser,
  type Event,
  type InsertEvent,
  type EventContent,
  type InsertEventContent,
  type EventJudge,
  type InsertEventJudge,
  type EventSponsor,
  type InsertEventSponsor,
  type EventParticipant,
  type InsertEventParticipant,
  type EventTeam,
  type InsertEventTeam,
  type EventSubmission,
  type InsertEventSubmission,
  type JudgingScore,
  type InsertJudgingScore,
  type EventAnalytics,
  type EventHealthCheck
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User management
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;
  
  // Event management
  getEvents(): Promise<Event[]>;
  getEvent(id: string): Promise<Event | undefined>;
  getEventBySlug(slug: string): Promise<Event | undefined>;
  getEventsByOrganizer(organizerId: string): Promise<Event[]>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(id: string, updates: Partial<Event>): Promise<Event | undefined>;
  deleteEvent(id: string): Promise<boolean>;
  
  // Event content management
  getEventContent(eventId: string): Promise<EventContent[]>;
  getEventContentBySection(eventId: string, section: string): Promise<EventContent | undefined>;
  createEventContent(content: InsertEventContent): Promise<EventContent>;
  updateEventContent(id: string, updates: Partial<EventContent>): Promise<EventContent | undefined>;
  deleteEventContent(id: string): Promise<boolean>;
  
  // Judge management
  getEventJudges(eventId: string): Promise<EventJudge[]>;
  getEventJudge(id: string): Promise<EventJudge | undefined>;
  createEventJudge(judge: InsertEventJudge): Promise<EventJudge>;
  updateEventJudge(id: string, updates: Partial<EventJudge>): Promise<EventJudge | undefined>;
  deleteEventJudge(id: string): Promise<boolean>;
  
  // Sponsor management
  getEventSponsors(eventId: string): Promise<EventSponsor[]>;
  createEventSponsor(sponsor: InsertEventSponsor): Promise<EventSponsor>;
  updateEventSponsor(id: string, updates: Partial<EventSponsor>): Promise<EventSponsor | undefined>;
  deleteEventSponsor(id: string): Promise<boolean>;
  
  // Participant management
  getEventParticipants(eventId: string): Promise<EventParticipant[]>;
  getEventParticipant(eventId: string, userId: string): Promise<EventParticipant | undefined>;
  createEventParticipant(participant: InsertEventParticipant): Promise<EventParticipant>;
  updateEventParticipant(id: string, updates: Partial<EventParticipant>): Promise<EventParticipant | undefined>;
  deleteEventParticipant(id: string): Promise<boolean>;
  
  // Team management
  getEventTeams(eventId: string): Promise<EventTeam[]>;
  getEventTeam(id: string): Promise<EventTeam | undefined>;
  createEventTeam(team: InsertEventTeam): Promise<EventTeam>;
  updateEventTeam(id: string, updates: Partial<EventTeam>): Promise<EventTeam | undefined>;
  deleteEventTeam(id: string): Promise<boolean>;
  
  // Submission management
  getEventSubmissions(eventId: string): Promise<EventSubmission[]>;
  getEventSubmission(id: string): Promise<EventSubmission | undefined>;
  createEventSubmission(submission: InsertEventSubmission): Promise<EventSubmission>;
  updateEventSubmission(id: string, updates: Partial<EventSubmission>): Promise<EventSubmission | undefined>;
  deleteEventSubmission(id: string): Promise<boolean>;
  
  // Scoring management
  getSubmissionScores(submissionId: string): Promise<JudgingScore[]>;
  getJudgeScores(judgeId: string): Promise<JudgingScore[]>;
  createJudgingScore(score: InsertJudgingScore): Promise<JudgingScore>;
  updateJudgingScore(id: string, updates: Partial<JudgingScore>): Promise<JudgingScore | undefined>;
  
  // Analytics and insights
  getEventAnalytics(eventId: string): Promise<EventAnalytics>;
  getOrganizerStats(organizerId: string): Promise<{
    totalEvents: number;
    totalRegistrations: number;
    totalSubmissions: number;
    totalJudges: number;
  }>;
  getEventHealthChecks(eventId: string): Promise<EventHealthCheck[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private events: Map<string, Event>;
  private eventContent: Map<string, EventContent>;
  private eventJudges: Map<string, EventJudge>;
  private eventSponsors: Map<string, EventSponsor>;
  private eventParticipants: Map<string, EventParticipant>;
  private eventTeams: Map<string, EventTeam>;
  private eventSubmissions: Map<string, EventSubmission>;
  private judgingScores: Map<string, JudgingScore>;

  constructor() {
    this.users = new Map();
    this.events = new Map();
    this.eventContent = new Map();
    this.eventJudges = new Map();
    this.eventSponsors = new Map();
    this.eventParticipants = new Map();
    this.eventTeams = new Map();
    this.eventSubmissions = new Map();
    this.judgingScores = new Map();
  }

  // User management
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const now = new Date();
    const user: User = { 
      ...insertUser,
      id,
      avatar: insertUser.avatar || null,
      bio: insertUser.bio || null,
      role: insertUser.role ?? "user",
      organizationName: insertUser.organizationName || null,
      website: insertUser.website || null,
      linkedin: insertUser.linkedin || null,
      twitter: insertUser.twitter || null,
      isVerified: insertUser.isVerified || false,
      registeredEvents: insertUser.registeredEvents || [],
      createdAt: now,
      updatedAt: now
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates, updatedAt: new Date() };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Event management
  async getEvents(): Promise<Event[]> {
    return Array.from(this.events.values());
  }

  async getEvent(id: string): Promise<Event | undefined> {
    return this.events.get(id);
  }

  async getEventBySlug(slug: string): Promise<Event | undefined> {
    return Array.from(this.events.values()).find(event => event.slug === slug);
  }

  async getEventsByOrganizer(organizerId: string): Promise<Event[]> {
    return Array.from(this.events.values()).filter(event => event.organizerId === organizerId);
  }

  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const id = randomUUID();
    const now = new Date();
    const event: Event = {
      ...insertEvent,
      id,
      participantCount: 0,
      submissionCount: 0,
      createdAt: now,
      updatedAt: now
    };
    this.events.set(id, event);
    return event;
  }

  async updateEvent(id: string, updates: Partial<Event>): Promise<Event | undefined> {
    const event = this.events.get(id);
    if (!event) return undefined;
    
    const updatedEvent = { ...event, ...updates, updatedAt: new Date() };
    this.events.set(id, updatedEvent);
    return updatedEvent;
  }

  async deleteEvent(id: string): Promise<boolean> {
    return this.events.delete(id);
  }

  // Event content management
  async getEventContent(eventId: string): Promise<EventContent[]> {
    return Array.from(this.eventContent.values()).filter(content => content.eventId === eventId);
  }

  async getEventContentBySection(eventId: string, section: string): Promise<EventContent | undefined> {
    return Array.from(this.eventContent.values()).find(
      content => content.eventId === eventId && content.section === section
    );
  }

  async createEventContent(insertContent: InsertEventContent): Promise<EventContent> {
    const id = randomUUID();
    const content: EventContent = {
      ...insertContent,
      id,
      updatedAt: new Date()
    };
    this.eventContent.set(id, content);
    return content;
  }

  async updateEventContent(id: string, updates: Partial<EventContent>): Promise<EventContent | undefined> {
    const content = this.eventContent.get(id);
    if (!content) return undefined;
    
    const updatedContent = { ...content, ...updates, updatedAt: new Date() };
    this.eventContent.set(id, updatedContent);
    return updatedContent;
  }

  async deleteEventContent(id: string): Promise<boolean> {
    return this.eventContent.delete(id);
  }

  // Judge management
  async getEventJudges(eventId: string): Promise<EventJudge[]> {
    return Array.from(this.eventJudges.values()).filter(judge => judge.eventId === eventId && judge.isActive);
  }

  async getEventJudge(id: string): Promise<EventJudge | undefined> {
    return this.eventJudges.get(id);
  }

  async createEventJudge(insertJudge: InsertEventJudge): Promise<EventJudge> {
    const id = randomUUID();
    const judge: EventJudge = {
      ...insertJudge,
      id,
      createdAt: new Date()
    };
    this.eventJudges.set(id, judge);
    return judge;
  }

  async updateEventJudge(id: string, updates: Partial<EventJudge>): Promise<EventJudge | undefined> {
    const judge = this.eventJudges.get(id);
    if (!judge) return undefined;
    
    const updatedJudge = { ...judge, ...updates };
    this.eventJudges.set(id, updatedJudge);
    return updatedJudge;
  }

  async deleteEventJudge(id: string): Promise<boolean> {
    const judge = this.eventJudges.get(id);
    if (!judge) return false;
    
    // Soft delete by setting isActive to false
    const updatedJudge = { ...judge, isActive: false };
    this.eventJudges.set(id, updatedJudge);
    return true;
  }

  // Sponsor management
  async getEventSponsors(eventId: string): Promise<EventSponsor[]> {
    return Array.from(this.eventSponsors.values())
      .filter(sponsor => sponsor.eventId === eventId && sponsor.isActive)
      .sort((a, b) => a.order - b.order);
  }

  async createEventSponsor(insertSponsor: InsertEventSponsor): Promise<EventSponsor> {
    const id = randomUUID();
    const sponsor: EventSponsor = {
      ...insertSponsor,
      id,
      createdAt: new Date()
    };
    this.eventSponsors.set(id, sponsor);
    return sponsor;
  }

  async updateEventSponsor(id: string, updates: Partial<EventSponsor>): Promise<EventSponsor | undefined> {
    const sponsor = this.eventSponsors.get(id);
    if (!sponsor) return undefined;
    
    const updatedSponsor = { ...sponsor, ...updates };
    this.eventSponsors.set(id, updatedSponsor);
    return updatedSponsor;
  }

  async deleteEventSponsor(id: string): Promise<boolean> {
    const sponsor = this.eventSponsors.get(id);
    if (!sponsor) return false;
    
    // Soft delete by setting isActive to false
    const updatedSponsor = { ...sponsor, isActive: false };
    this.eventSponsors.set(id, updatedSponsor);
    return true;
  }

  // Participant management
  async getEventParticipants(eventId: string): Promise<EventParticipant[]> {
    return Array.from(this.eventParticipants.values()).filter(participant => participant.eventId === eventId);
  }

  async getEventParticipant(eventId: string, userId: string): Promise<EventParticipant | undefined> {
    return Array.from(this.eventParticipants.values()).find(
      participant => participant.eventId === eventId && participant.userId === userId
    );
  }

  async createEventParticipant(insertParticipant: InsertEventParticipant): Promise<EventParticipant> {
    const id = randomUUID();
    const participant: EventParticipant = {
      ...insertParticipant,
      id,
      registeredAt: new Date()
    };
    this.eventParticipants.set(id, participant);
    
    // Update event participant count
    const event = await this.getEvent(insertParticipant.eventId);
    if (event) {
      await this.updateEvent(event.id, { participantCount: event.participantCount + 1 });
    }
    
    return participant;
  }

  async updateEventParticipant(id: string, updates: Partial<EventParticipant>): Promise<EventParticipant | undefined> {
    const participant = this.eventParticipants.get(id);
    if (!participant) return undefined;
    
    const updatedParticipant = { ...participant, ...updates };
    this.eventParticipants.set(id, updatedParticipant);
    return updatedParticipant;
  }

  async deleteEventParticipant(id: string): Promise<boolean> {
    const participant = this.eventParticipants.get(id);
    if (!participant) return false;
    
    const deleted = this.eventParticipants.delete(id);
    
    // Update event participant count
    if (deleted) {
      const event = await this.getEvent(participant.eventId);
      if (event && event.participantCount > 0) {
        await this.updateEvent(event.id, { participantCount: event.participantCount - 1 });
      }
    }
    
    return deleted;
  }

  // Team management
  async getEventTeams(eventId: string): Promise<EventTeam[]> {
    return Array.from(this.eventTeams.values()).filter(team => team.eventId === eventId);
  }

  async getEventTeam(id: string): Promise<EventTeam | undefined> {
    return this.eventTeams.get(id);
  }

  async createEventTeam(insertTeam: InsertEventTeam): Promise<EventTeam> {
    const id = randomUUID();
    const team: EventTeam = {
      ...insertTeam,
      id,
      createdAt: new Date()
    };
    this.eventTeams.set(id, team);
    return team;
  }

  async updateEventTeam(id: string, updates: Partial<EventTeam>): Promise<EventTeam | undefined> {
    const team = this.eventTeams.get(id);
    if (!team) return undefined;
    
    const updatedTeam = { ...team, ...updates };
    this.eventTeams.set(id, updatedTeam);
    return updatedTeam;
  }

  async deleteEventTeam(id: string): Promise<boolean> {
    return this.eventTeams.delete(id);
  }

  // Submission management
  async getEventSubmissions(eventId: string): Promise<EventSubmission[]> {
    return Array.from(this.eventSubmissions.values()).filter(submission => submission.eventId === eventId);
  }

  async getEventSubmission(id: string): Promise<EventSubmission | undefined> {
    return this.eventSubmissions.get(id);
  }

  async createEventSubmission(insertSubmission: InsertEventSubmission): Promise<EventSubmission> {
    const id = randomUUID();
    const submission: EventSubmission = {
      ...insertSubmission,
      id,
      submittedAt: new Date()
    };
    this.eventSubmissions.set(id, submission);
    
    // Update event submission count
    const event = await this.getEvent(insertSubmission.eventId);
    if (event) {
      await this.updateEvent(event.id, { submissionCount: event.submissionCount + 1 });
    }
    
    return submission;
  }

  async updateEventSubmission(id: string, updates: Partial<EventSubmission>): Promise<EventSubmission | undefined> {
    const submission = this.eventSubmissions.get(id);
    if (!submission) return undefined;
    
    const updatedSubmission = { ...submission, ...updates };
    this.eventSubmissions.set(id, updatedSubmission);
    return updatedSubmission;
  }

  async deleteEventSubmission(id: string): Promise<boolean> {
    const submission = this.eventSubmissions.get(id);
    if (!submission) return false;
    
    const deleted = this.eventSubmissions.delete(id);
    
    // Update event submission count
    if (deleted) {
      const event = await this.getEvent(submission.eventId);
      if (event && event.submissionCount > 0) {
        await this.updateEvent(event.id, { submissionCount: event.submissionCount - 1 });
      }
    }
    
    return deleted;
  }

  // Scoring management
  async getSubmissionScores(submissionId: string): Promise<JudgingScore[]> {
    return Array.from(this.judgingScores.values()).filter(score => score.submissionId === submissionId);
  }

  async getJudgeScores(judgeId: string): Promise<JudgingScore[]> {
    return Array.from(this.judgingScores.values()).filter(score => score.judgeId === judgeId);
  }

  async createJudgingScore(insertScore: InsertJudgingScore): Promise<JudgingScore> {
    const id = randomUUID();
    const score: JudgingScore = {
      ...insertScore,
      id,
      submittedAt: new Date()
    };
    this.judgingScores.set(id, score);
    return score;
  }

  async updateJudgingScore(id: string, updates: Partial<JudgingScore>): Promise<JudgingScore | undefined> {
    const score = this.judgingScores.get(id);
    if (!score) return undefined;
    
    const updatedScore = { ...score, ...updates };
    this.judgingScores.set(id, updatedScore);
    return updatedScore;
  }

  // Analytics and insights
  async getEventAnalytics(eventId: string): Promise<EventAnalytics> {
    const participants = await this.getEventParticipants(eventId);
    const teams = await this.getEventTeams(eventId);
    const submissions = await this.getEventSubmissions(eventId);
    const event = await this.getEvent(eventId);

    // Generate daily registration data (simplified)
    const dailyData = this.generateDailyRegistrationData(participants);
    
    // Calculate track-based data
    const trackData = this.calculateTrackData(submissions, event?.tracks || []);

    return {
      registrations: {
        total: participants.length,
        daily: dailyData,
        byTrack: trackData.registrations
      },
      teams: {
        total: teams.length,
        recruiting: teams.filter(t => t.isRecruiting).length,
        full: teams.filter(t => t.memberIds.length >= t.maxMembers).length
      },
      submissions: {
        total: submissions.length,
        byTrack: trackData.submissions,
        judged: submissions.filter(s => s.status === 'judging' || s.status === 'winner' || s.status === 'finalist').length,
        pending: submissions.filter(s => s.status === 'submitted').length
      },
      engagement: {
        pageViews: Math.floor(Math.random() * 10000) + 5000, // Simulated data
        uniqueVisitors: Math.floor(Math.random() * 5000) + 2000,
        socialShares: Math.floor(Math.random() * 500) + 100
      }
    };
  }

  async getOrganizerStats(organizerId: string): Promise<{
    totalEvents: number;
    totalRegistrations: number;
    totalSubmissions: number;
    totalJudges: number;
  }> {
    const events = await this.getEventsByOrganizer(organizerId);
    let totalRegistrations = 0;
    let totalSubmissions = 0;
    let totalJudges = 0;

    for (const event of events) {
      const participants = await this.getEventParticipants(event.id);
      const submissions = await this.getEventSubmissions(event.id);
      const judges = await this.getEventJudges(event.id);
      
      totalRegistrations += participants.length;
      totalSubmissions += submissions.length;
      totalJudges += judges.length;
    }

    return {
      totalEvents: events.length,
      totalRegistrations,
      totalSubmissions,
      totalJudges
    };
  }

  async getEventHealthChecks(eventId: string): Promise<EventHealthCheck[]> {
    const event = await this.getEvent(eventId);
    if (!event) return [];

    const checks: EventHealthCheck[] = [];
    const judges = await this.getEventJudges(eventId);
    const content = await this.getEventContent(eventId);
    
    // Event description check
    checks.push({
      id: 'description',
      title: 'Event description',
      status: event.description && event.longDescription ? 'complete' : 'warning',
      message: event.description && event.longDescription ? undefined : 'Add detailed event description',
      priority: 'medium'
    });

    // Judges check
    const targetJudgeCount = 5; // Configurable
    checks.push({
      id: 'judges',
      title: 'Judges assigned',
      status: judges.length >= targetJudgeCount ? 'complete' : judges.length > 0 ? 'warning' : 'error',
      message: judges.length < targetJudgeCount ? `Need ${targetJudgeCount - judges.length} more judges` : undefined,
      priority: judges.length === 0 ? 'high' : 'medium'
    });

    // Prizes check
    checks.push({
      id: 'prizes',
      title: 'Prizes configured',
      status: event.prizePool > 0 ? 'complete' : 'warning',
      message: event.prizePool === 0 ? 'Configure prize information' : undefined,
      priority: 'medium'
    });

    return checks;
  }

  // Helper methods
  private generateDailyRegistrationData(participants: EventParticipant[]): Array<{ date: string; count: number }> {
    const dailyData: { [key: string]: number } = {};
    
    participants.forEach(participant => {
      const date = participant.registeredAt.toISOString().split('T')[0];
      dailyData[date] = (dailyData[date] || 0) + 1;
    });

    return Object.entries(dailyData).map(([date, count]) => ({ date, count }));
  }

  private calculateTrackData(submissions: EventSubmission[], tracks: string[]): {
    registrations: Array<{ track: string; count: number }>;
    submissions: Array<{ track: string; count: number }>;
  } {
    const submissionsByTrack: { [key: string]: number } = {};
    
    submissions.forEach(submission => {
      if (submission.track) {
        submissionsByTrack[submission.track] = (submissionsByTrack[submission.track] || 0) + 1;
      }
    });

    return {
      registrations: tracks.map(track => ({ track, count: Math.floor(Math.random() * 100) + 10 })), // Simulated
      submissions: Object.entries(submissionsByTrack).map(([track, count]) => ({ track, count }))
    };
  }
}

export const storage = new MemStorage();
