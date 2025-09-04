import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
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

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
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

// Event types for frontend-only implementation
export interface Prize {
  place?: number;
  track?: string;
  amount: number;
  title: string;
  description?: string;
}

export interface TimelineItem {
  time: string;
  title: string;
  description: string;
  isActive?: boolean;
  isCompleted?: boolean;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface GalleryItem {
  id: string;
  type: 'image' | 'video';
  src: string;
  thumbnail?: string;
  alt: string;
  caption?: string;
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
  status: "upcoming" | "active" | "completed" | "registration_open";
  format: "online" | "in-person" | "hybrid";
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
  gallery?: GalleryItem[];
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
  prizes: Prize[];
  timeline?: TimelineItem[];
  rules?: string[];
  faqs?: FAQ[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Team {
  id: string;
  name: string;
  description: string;
  lookingFor: string[];
  members: {
    id: string;
    name: string;
    role: string;
    avatar?: string;
  }[];
  skills: string[];
  eventId: string;
  isOpen: boolean;
  maxSize: number;
}

export interface Submission {
  id: string;
  title: string;
  description: string;
  teamId: string;
  eventId: string;
  demoUrl?: string;
  repoUrl?: string;
  videoUrl?: string;
  images: string[];
  technologies: string[];
  track?: string;
  submittedAt: string;
  score?: number;
}

export interface Judge {
  id: string;
  name: string;
  title: string;
  company: string;
  bio: string;
  avatar?: string;
  expertise: string[];
  linkedinUrl?: string;
  twitterUrl?: string;
}
