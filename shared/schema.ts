import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean, json, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  avatar: text("avatar"),
  bio: text("bio"),
  role: text("role").notNull().default("user"), // user, organizer, admin
  organizationName: text("organization_name"),
  website: text("website"),
  linkedin: text("linkedin"),
  twitter: text("twitter"),
  isVerified: boolean("is_verified").default(false),
  registeredEvents: text("registered_events").array().default(sql`'{}'::text[]`),
  createdAt: timestamp("created_at").default(sql`now()`),
  updatedAt: timestamp("updated_at").default(sql`now()`),
});

// Events table for comprehensive event management
export const events = pgTable("events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  tagline: text("tagline"),
  description: text("description").notNull(),
  longDescription: text("long_description"),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  registrationOpen: timestamp("registration_open"),
  registrationClose: timestamp("registration_close"),
  submissionOpen: timestamp("submission_open"),
  submissionClose: timestamp("submission_close"),
  status: text("status").notNull().default("draft"), // draft, published, active, completed, cancelled
  format: text("format").notNull().default("online"), // online, in-person, hybrid
  location: text("location"),
  timezone: text("timezone").notNull().default("UTC"),
  prizePool: integer("prize_pool").default(0),
  maxTeamSize: integer("max_team_size").default(4),
  participantCount: integer("participant_count").default(0),
  submissionCount: integer("submission_count").default(0),
  organizerId: varchar("organizer_id").notNull().references(() => users.id),
  organizerName: text("organizer_name").notNull(),
  organizationName: text("organization_name"),
  tracks: text("tracks").array().default(sql`'{}'::text[]`),
  tags: text("tags").array().default(sql`'{}'::text[]`),
  socials: json("socials").default({}),
  links: json("links").default({}),
  hero: json("hero").default({}),
  isPublic: boolean("is_public").default(false),
  isFeatured: boolean("is_featured").default(false),
  allowTeamFormation: boolean("allow_team_formation").default(true),
  requireApproval: boolean("require_approval").default(false),
  emailNotifications: boolean("email_notifications").default(true),
  createdAt: timestamp("created_at").default(sql`now()`),
  updatedAt: timestamp("updated_at").default(sql`now()`),
});

// Event content sections (timeline, prizes, rules, etc.)
export const eventContent = pgTable("event_content", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  eventId: varchar("event_id").notNull().references(() => events.id),
  section: text("section").notNull(), // overview, timeline, prizes, rules, judging, sponsors, about, resources, help
  content: json("content").notNull().default({}),
  isPublished: boolean("is_published").default(true),
  order: integer("order").default(0),
  updatedAt: timestamp("updated_at").default(sql`now()`),
});

// Event judges
export const eventJudges = pgTable("event_judges", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  eventId: varchar("event_id").notNull().references(() => events.id),
  name: text("name").notNull(),
  title: text("title"),
  company: text("company"),
  bio: text("bio"),
  avatar: text("avatar"),
  linkedin: text("linkedin"),
  twitter: text("twitter"),
  email: text("email"),
  expertise: text("expertise").array().default(sql`'{}'::text[]`),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").default(sql`now()`),
});

// Event sponsors
export const eventSponsors = pgTable("event_sponsors", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  eventId: varchar("event_id").notNull().references(() => events.id),
  name: text("name").notNull(),
  logo: text("logo"),
  website: text("website"),
  description: text("description"),
  tier: text("tier").notNull().default("bronze"), // platinum, gold, silver, bronze, partner
  order: integer("order").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").default(sql`now()`),
});

// Event participants
export const eventParticipants = pgTable("event_participants", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  eventId: varchar("event_id").notNull().references(() => events.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  userName: text("user_name").notNull(),
  userEmail: text("user_email").notNull(),
  registeredAt: timestamp("registered_at").default(sql`now()`),
  status: text("status").notNull().default("registered"), // registered, checked_in, submitted, disqualified
  teamId: varchar("team_id"),
});

// Event teams
export const eventTeams = pgTable("event_teams", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  eventId: varchar("event_id").notNull().references(() => events.id),
  name: text("name").notNull(),
  description: text("description"),
  lookingFor: text("looking_for").array().default(sql`'{}'::text[]`),
  skills: text("skills").array().default(sql`'{}'::text[]`),
  leaderId: varchar("leader_id").notNull().references(() => users.id),
  memberIds: text("member_ids").array().default(sql`'{}'::text[]`),
  maxMembers: integer("max_members").default(4),
  isRecruiting: boolean("is_recruiting").default(true),
  track: text("track"),
  submissionId: varchar("submission_id"),
  createdAt: timestamp("created_at").default(sql`now()`),
});

// Event submissions
export const eventSubmissions = pgTable("event_submissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  eventId: varchar("event_id").notNull().references(() => events.id),
  teamId: varchar("team_id").references(() => eventTeams.id),
  title: text("title").notNull(),
  tagline: text("tagline"),
  description: text("description").notNull(),
  longDescription: text("long_description"),
  demoUrl: text("demo_url"),
  repoUrl: text("repo_url"),
  videoUrl: text("video_url"),
  slidesUrl: text("slides_url"),
  imageUrls: text("image_urls").array().default(sql`'{}'::text[]`),
  techStack: text("tech_stack").array().default(sql`'{}'::text[]`),
  track: text("track"),
  submittedBy: varchar("submitted_by").notNull().references(() => users.id),
  submittedAt: timestamp("submitted_at").default(sql`now()`),
  status: text("status").notNull().default("submitted"), // draft, submitted, judging, winner, finalist
  scores: json("scores").default({}),
  totalScore: integer("total_score").default(0),
  rank: integer("rank"),
  prizes: text("prizes").array().default(sql`'{}'::text[]`),
});

// Judging scores
export const judgingScores = pgTable("judging_scores", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  submissionId: varchar("submission_id").notNull().references(() => eventSubmissions.id),
  judgeId: varchar("judge_id").notNull().references(() => eventJudges.id),
  criteria: json("criteria").notNull().default({}), // { innovation: 8, execution: 7, impact: 9 }
  totalScore: integer("total_score").notNull(),
  feedback: text("feedback"),
  isComplete: boolean("is_complete").default(false),
  submittedAt: timestamp("submitted_at").default(sql`now()`),
});

export const projects = pgTable("projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  oneLiner: text("one_liner").notNull(),
  description: text("description").notNull(),
  fullDescription: text("full_description").default(""),
  coverImage: text("cover_image"),
  tags: text("tags").array().default(sql`'{}'::text[]`),
  techStack: text("tech_stack").array().default(sql`'{}'::text[]`),
  repoLink: text("repo_link").default(""),
  demoLink: text("demo_link").default(""),
  slidesLink: text("slides_link").default(""),
  ownerId: varchar("owner_id").notNull().references(() => users.id),
  ownerName: text("owner_name").notNull(),
  ownerAvatar: text("owner_avatar"),
  joinPolicy: text("join_policy").notNull().default("open"), // open, request, invite
  contactMethod: text("contact_method").notNull().default("form"), // form, email
  contactEmail: text("contact_email").default(""),
  lookingForContributors: boolean("looking_for_contributors").default(false),
  eventId: varchar("event_id"),
  badges: text("badges").array().default(sql`'{}'::text[]`), // Winner, Finalist, etc
  featured: boolean("featured").default(false),
  published: boolean("published").default(false),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").default(sql`now()`),
  updatedAt: timestamp("updated_at").default(sql`now()`),
});

export const projectMembers = pgTable("project_members", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").notNull().references(() => projects.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  userName: text("user_name").notNull(),
  userAvatar: text("user_avatar"),
  role: text("role").notNull(),
  joinedAt: timestamp("joined_at").default(sql`now()`),
});

export const openRoles = pgTable("open_roles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").notNull().references(() => projects.id),
  title: text("title").notNull(),
  description: text("description"),
  skills: text("skills").array().default(sql`'{}'::text[]`),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").default(sql`now()`),
});

export const projectTasks = pgTable("project_tasks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").notNull().references(() => projects.id),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status").notNull().default("open"), // open, in_progress, done
  assignedTo: varchar("assigned_to").references(() => users.id),
  priority: text("priority").default("medium"), // low, medium, high
  createdAt: timestamp("created_at").default(sql`now()`),
  updatedAt: timestamp("updated_at").default(sql`now()`),
});

export const joinRequests = pgTable("join_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").notNull().references(() => projects.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  userName: text("user_name").notNull(),
  userAvatar: text("user_avatar"),
  roleRequested: text("role_requested").notNull(),
  pitch: text("pitch"),
  portfolioLink: text("portfolio_link"),
  status: text("status").notNull().default("pending"), // pending, accepted, declined
  createdAt: timestamp("created_at").default(sql`now()`),
  respondedAt: timestamp("responded_at"),
});

export const projectMessages = pgTable("project_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").notNull().references(() => projects.id),
  fromUserId: varchar("from_user_id").references(() => users.id),
  fromName: text("from_name").notNull(),
  fromEmail: text("from_email"),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").default(sql`now()`),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertEventSchema = createInsertSchema(events).omit({
  id: true,
  participantCount: true,
  submissionCount: true,
  createdAt: true,
  updatedAt: true,
});

export const insertEventContentSchema = createInsertSchema(eventContent).omit({
  id: true,
  updatedAt: true,
});

export const insertEventJudgeSchema = createInsertSchema(eventJudges).omit({
  id: true,
  createdAt: true,
});

export const insertEventSponsorSchema = createInsertSchema(eventSponsors).omit({
  id: true,
  createdAt: true,
});

export const insertEventParticipantSchema = createInsertSchema(eventParticipants).omit({
  id: true,
  registeredAt: true,
});

export const insertEventTeamSchema = createInsertSchema(eventTeams).omit({
  id: true,
  createdAt: true,
});

export const insertEventSubmissionSchema = createInsertSchema(eventSubmissions).omit({
  id: true,
  submittedAt: true,
});

export const insertJudgingScoreSchema = createInsertSchema(judgingScores).omit({
  id: true,
  submittedAt: true,
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  publishedAt: true,
  createdAt: true,
  updatedAt: true,
});

export const insertProjectMemberSchema = createInsertSchema(projectMembers).omit({
  id: true,
  joinedAt: true,
});

export const insertOpenRoleSchema = createInsertSchema(openRoles).omit({
  id: true,
  createdAt: true,
});

export const insertProjectTaskSchema = createInsertSchema(projectTasks).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertJoinRequestSchema = createInsertSchema(joinRequests).omit({
  id: true,
  createdAt: true,
  respondedAt: true,
});

export const insertProjectMessageSchema = createInsertSchema(projectMessages).omit({
  id: true,
  createdAt: true,
});

// Type exports
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type ProjectMember = typeof projectMembers.$inferSelect;
export type InsertProjectMember = z.infer<typeof insertProjectMemberSchema>;
export type OpenRole = typeof openRoles.$inferSelect;
export type InsertOpenRole = z.infer<typeof insertOpenRoleSchema>;
export type ProjectTask = typeof projectTasks.$inferSelect;
export type InsertProjectTask = z.infer<typeof insertProjectTaskSchema>;
export type JoinRequest = typeof joinRequests.$inferSelect;
export type InsertJoinRequest = z.infer<typeof insertJoinRequestSchema>;
export type ProjectMessage = typeof projectMessages.$inferSelect;
export type InsertProjectMessage = z.infer<typeof insertProjectMessageSchema>;

// Event-related types
export type Event = typeof events.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type EventContent = typeof eventContent.$inferSelect;
export type InsertEventContent = z.infer<typeof insertEventContentSchema>;
export type EventJudge = typeof eventJudges.$inferSelect;
export type InsertEventJudge = z.infer<typeof insertEventJudgeSchema>;
export type EventSponsor = typeof eventSponsors.$inferSelect;
export type InsertEventSponsor = z.infer<typeof insertEventSponsorSchema>;
export type EventParticipant = typeof eventParticipants.$inferSelect;
export type InsertEventParticipant = z.infer<typeof insertEventParticipantSchema>;
export type EventTeam = typeof eventTeams.$inferSelect;
export type InsertEventTeam = z.infer<typeof insertEventTeamSchema>;
export type EventSubmission = typeof eventSubmissions.$inferSelect;
export type InsertEventSubmission = z.infer<typeof insertEventSubmissionSchema>;
export type JudgingScore = typeof judgingScores.$inferSelect;
export type InsertJudgingScore = z.infer<typeof insertJudgingScoreSchema>;

// Content structure interfaces
export interface Prize {
  id?: string;
  place?: number;
  track?: string;
  amount: number;
  title: string;
  description?: string;
  icon?: string;
  color?: string;
}

export interface TimelineItem {
  id?: string;
  time: string;
  title: string;
  description: string;
  status?: "completed" | "active" | "upcoming";
  type?: "milestone" | "deadline" | "event";
}

export interface FAQ {
  id?: string;
  question: string;
  answer: string;
  category?: string;
}

export interface GalleryItem {
  id: string;
  type: 'image' | 'video';
  src: string;
  thumbnail?: string;
  alt: string;
  caption?: string;
}

export interface JudgingCriterion {
  id?: string;
  name: string;
  weight: number;
  description: string;
  maxScore?: number;
}

export interface EventRule {
  id?: string;
  title: string;
  description: string;
  category: string;
  icon?: string;
  color?: string;
}

export interface QuickStartItem {
  id: string;
  title: string;
  description: string;
  action: string;
  completed: boolean;
  required: boolean;
}

// Comprehensive event content structure
export interface EventContentStructure {
  overview?: {
    highlights?: Array<{
      title: string;
      value: string | number;
      description: string;
      icon: string;
      color: string;
    }>;
    quickStart?: QuickStartItem[];
    whyJoin?: string[];
    featured?: boolean;
  };
  timeline?: {
    items: TimelineItem[];
    showLive?: boolean;
  };
  prizes?: {
    total: number;
    currency: string;
    categories: Array<{
      id: string;
      title: string;
      description: string;
      prizes: Prize[];
    }>;
    rules?: string[];
  };
  rules?: {
    sections: EventRule[];
    importantNotes?: Array<{
      type: "warning" | "info";
      title: string;
      message: string;
      icon: string;
    }>;
    deadlines?: Array<{
      title: string;
      date: string;
      status: "open" | "closed" | "upcoming";
    }>;
  };
  judging?: {
    criteria: JudgingCriterion[];
    process?: string[];
    timeline?: TimelineItem[];
  };
  sponsors?: {
    tiers: Array<{
      name: string;
      level: number;
      benefits: string[];
    }>;
  };
  about?: {
    story?: string;
    mission?: string;
    team?: Array<{
      name: string;
      role: string;
      bio: string;
      avatar?: string;
      social?: Record<string, string>;
    }>;
    contact?: {
      email: string;
      social: Record<string, string>;
    };
  };
  resources?: {
    categories: Array<{
      title: string;
      description: string;
      items: Array<{
        title: string;
        description: string;
        url: string;
        type: "documentation" | "tool" | "template" | "api";
      }>;
    }>;
  };
  help?: {
    faqs: FAQ[];
    support: {
      email: string;
      discord?: string;
      slack?: string;
      hours?: string;
    };
    guides?: Array<{
      title: string;
      description: string;
      url: string;
    }>;
  };
}

// Auth and permission types
export interface AuthUser extends User {
  isOrganizer: boolean;
  canEditEvent: (eventId: string) => boolean;
  permissions: string[];
}

// Event analytics and management
export interface EventAnalytics {
  registrations: {
    total: number;
    daily: Array<{ date: string; count: number }>;
    byTrack: Array<{ track: string; count: number }>;
  };
  teams: {
    total: number;
    recruiting: number;
    full: number;
  };
  submissions: {
    total: number;
    byTrack: Array<{ track: string; count: number }>;
    judged: number;
    pending: number;
  };
  engagement: {
    pageViews: number;
    uniqueVisitors: number;
    socialShares: number;
  };
}

export interface EventHealthCheck {
  id: string;
  title: string;
  status: "complete" | "warning" | "error";
  message?: string;
  action?: string;
  priority: "high" | "medium" | "low";
}