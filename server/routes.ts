import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertEventSchema, 
  insertEventContentSchema,
  insertEventJudgeSchema,
  insertEventSponsorSchema,
  insertEventParticipantSchema,
  insertEventTeamSchema,
  insertEventSubmissionSchema,
  insertJudgingScoreSchema
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication & User Management
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.json({ success: true, user });
    } catch (error) {
      res.status(400).json({ success: false, error: error instanceof z.ZodError ? error.errors : "Registration failed" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await storage.getUserByEmail(email);
      
      if (!user) {
        return res.status(401).json({ success: false, error: "Invalid credentials" });
      }
      
      // In a real app, you'd verify the password hash here
      // For demo purposes, we'll accept any password for existing users
      res.json({ success: true, user });
    } catch (error) {
      res.status(500).json({ success: false, error: "Login failed" });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  app.put("/api/users/:id", async (req, res) => {
    try {
      const updates = req.body;
      const user = await storage.updateUser(req.params.id, updates);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to update user" });
    }
  });

  // Event Management
  app.get("/api/events", async (req, res) => {
    try {
      const events = await storage.getEvents();
      res.json(events);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch events" });
    }
  });

  app.get("/api/events/organizer/:organizerId", async (req, res) => {
    try {
      const events = await storage.getEventsByOrganizer(req.params.organizerId);
      res.json(events);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch organizer events" });
    }
  });

  app.get("/api/events/:id", async (req, res) => {
    try {
      const event = await storage.getEvent(req.params.id);
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }
      res.json(event);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch event" });
    }
  });

  app.get("/api/events/slug/:slug", async (req, res) => {
    try {
      const event = await storage.getEventBySlug(req.params.slug);
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }
      res.json(event);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch event" });
    }
  });

  app.post("/api/events", async (req, res) => {
    try {
      const eventData = insertEventSchema.parse(req.body);
      const event = await storage.createEvent(eventData);
      res.status(201).json(event);
    } catch (error) {
      res.status(400).json({ error: error instanceof z.ZodError ? error.errors : "Failed to create event" });
    }
  });

  app.put("/api/events/:id", async (req, res) => {
    try {
      const updates = req.body;
      const event = await storage.updateEvent(req.params.id, updates);
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }
      res.json(event);
    } catch (error) {
      res.status(500).json({ error: "Failed to update event" });
    }
  });

  app.delete("/api/events/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteEvent(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Event not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete event" });
    }
  });

  // Event Content Management
  app.get("/api/events/:eventId/content", async (req, res) => {
    try {
      const content = await storage.getEventContent(req.params.eventId);
      res.json(content);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch event content" });
    }
  });

  app.get("/api/events/:eventId/content/:section", async (req, res) => {
    try {
      const content = await storage.getEventContentBySection(req.params.eventId, req.params.section);
      if (!content) {
        return res.status(404).json({ error: "Content section not found" });
      }
      res.json(content);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch content section" });
    }
  });

  app.post("/api/events/:eventId/content", async (req, res) => {
    try {
      const contentData = insertEventContentSchema.parse({ ...req.body, eventId: req.params.eventId });
      const content = await storage.createEventContent(contentData);
      res.status(201).json(content);
    } catch (error) {
      res.status(400).json({ error: error instanceof z.ZodError ? error.errors : "Failed to create content" });
    }
  });

  app.put("/api/events/content/:id", async (req, res) => {
    try {
      const updates = req.body;
      const content = await storage.updateEventContent(req.params.id, updates);
      if (!content) {
        return res.status(404).json({ error: "Content not found" });
      }
      res.json(content);
    } catch (error) {
      res.status(500).json({ error: "Failed to update content" });
    }
  });

  // Judge Management
  app.get("/api/events/:eventId/judges", async (req, res) => {
    try {
      const judges = await storage.getEventJudges(req.params.eventId);
      res.json(judges);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch judges" });
    }
  });

  app.get("/api/judges/:id", async (req, res) => {
    try {
      const judge = await storage.getEventJudge(req.params.id);
      if (!judge) {
        return res.status(404).json({ error: "Judge not found" });
      }
      res.json(judge);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch judge" });
    }
  });

  app.post("/api/events/:eventId/judges", async (req, res) => {
    try {
      const judgeData = insertEventJudgeSchema.parse({ ...req.body, eventId: req.params.eventId });
      const judge = await storage.createEventJudge(judgeData);
      res.status(201).json(judge);
    } catch (error) {
      res.status(400).json({ error: error instanceof z.ZodError ? error.errors : "Failed to create judge" });
    }
  });

  app.put("/api/judges/:id", async (req, res) => {
    try {
      const updates = req.body;
      const judge = await storage.updateEventJudge(req.params.id, updates);
      if (!judge) {
        return res.status(404).json({ error: "Judge not found" });
      }
      res.json(judge);
    } catch (error) {
      res.status(500).json({ error: "Failed to update judge" });
    }
  });

  app.delete("/api/judges/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteEventJudge(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Judge not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete judge" });
    }
  });

  // Sponsor Management
  app.get("/api/events/:eventId/sponsors", async (req, res) => {
    try {
      const sponsors = await storage.getEventSponsors(req.params.eventId);
      res.json(sponsors);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch sponsors" });
    }
  });

  app.post("/api/events/:eventId/sponsors", async (req, res) => {
    try {
      const sponsorData = insertEventSponsorSchema.parse({ ...req.body, eventId: req.params.eventId });
      const sponsor = await storage.createEventSponsor(sponsorData);
      res.status(201).json(sponsor);
    } catch (error) {
      res.status(400).json({ error: error instanceof z.ZodError ? error.errors : "Failed to create sponsor" });
    }
  });

  app.put("/api/sponsors/:id", async (req, res) => {
    try {
      const updates = req.body;
      const sponsor = await storage.updateEventSponsor(req.params.id, updates);
      if (!sponsor) {
        return res.status(404).json({ error: "Sponsor not found" });
      }
      res.json(sponsor);
    } catch (error) {
      res.status(500).json({ error: "Failed to update sponsor" });
    }
  });

  // Participant Management
  app.get("/api/events/:eventId/participants", async (req, res) => {
    try {
      const participants = await storage.getEventParticipants(req.params.eventId);
      res.json(participants);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch participants" });
    }
  });

  app.post("/api/events/:eventId/participants", async (req, res) => {
    try {
      const participantData = insertEventParticipantSchema.parse({ ...req.body, eventId: req.params.eventId });
      const participant = await storage.createEventParticipant(participantData);
      res.status(201).json(participant);
    } catch (error) {
      res.status(400).json({ error: error instanceof z.ZodError ? error.errors : "Failed to register participant" });
    }
  });

  app.put("/api/participants/:id", async (req, res) => {
    try {
      const updates = req.body;
      const participant = await storage.updateEventParticipant(req.params.id, updates);
      if (!participant) {
        return res.status(404).json({ error: "Participant not found" });
      }
      res.json(participant);
    } catch (error) {
      res.status(500).json({ error: "Failed to update participant" });
    }
  });

  // Team Management
  app.get("/api/events/:eventId/teams", async (req, res) => {
    try {
      const teams = await storage.getEventTeams(req.params.eventId);
      res.json(teams);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch teams" });
    }
  });

  app.get("/api/teams/:id", async (req, res) => {
    try {
      const team = await storage.getEventTeam(req.params.id);
      if (!team) {
        return res.status(404).json({ error: "Team not found" });
      }
      res.json(team);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch team" });
    }
  });

  app.post("/api/events/:eventId/teams", async (req, res) => {
    try {
      const teamData = insertEventTeamSchema.parse({ ...req.body, eventId: req.params.eventId });
      const team = await storage.createEventTeam(teamData);
      res.status(201).json(team);
    } catch (error) {
      res.status(400).json({ error: error instanceof z.ZodError ? error.errors : "Failed to create team" });
    }
  });

  app.put("/api/teams/:id", async (req, res) => {
    try {
      const updates = req.body;
      const team = await storage.updateEventTeam(req.params.id, updates);
      if (!team) {
        return res.status(404).json({ error: "Team not found" });
      }
      res.json(team);
    } catch (error) {
      res.status(500).json({ error: "Failed to update team" });
    }
  });

  // Submission Management
  app.get("/api/events/:eventId/submissions", async (req, res) => {
    try {
      const submissions = await storage.getEventSubmissions(req.params.eventId);
      res.json(submissions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch submissions" });
    }
  });

  app.get("/api/submissions/:id", async (req, res) => {
    try {
      const submission = await storage.getEventSubmission(req.params.id);
      if (!submission) {
        return res.status(404).json({ error: "Submission not found" });
      }
      res.json(submission);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch submission" });
    }
  });

  app.post("/api/events/:eventId/submissions", async (req, res) => {
    try {
      const submissionData = insertEventSubmissionSchema.parse({ ...req.body, eventId: req.params.eventId });
      const submission = await storage.createEventSubmission(submissionData);
      res.status(201).json(submission);
    } catch (error) {
      res.status(400).json({ error: error instanceof z.ZodError ? error.errors : "Failed to create submission" });
    }
  });

  app.put("/api/submissions/:id", async (req, res) => {
    try {
      const updates = req.body;
      const submission = await storage.updateEventSubmission(req.params.id, updates);
      if (!submission) {
        return res.status(404).json({ error: "Submission not found" });
      }
      res.json(submission);
    } catch (error) {
      res.status(500).json({ error: "Failed to update submission" });
    }
  });

  // Scoring Management
  app.get("/api/submissions/:submissionId/scores", async (req, res) => {
    try {
      const scores = await storage.getSubmissionScores(req.params.submissionId);
      res.json(scores);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch scores" });
    }
  });

  app.get("/api/judges/:judgeId/scores", async (req, res) => {
    try {
      const scores = await storage.getJudgeScores(req.params.judgeId);
      res.json(scores);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch judge scores" });
    }
  });

  app.post("/api/scores", async (req, res) => {
    try {
      const scoreData = insertJudgingScoreSchema.parse(req.body);
      const score = await storage.createJudgingScore(scoreData);
      res.status(201).json(score);
    } catch (error) {
      res.status(400).json({ error: error instanceof z.ZodError ? error.errors : "Failed to create score" });
    }
  });

  app.put("/api/scores/:id", async (req, res) => {
    try {
      const updates = req.body;
      const score = await storage.updateJudgingScore(req.params.id, updates);
      if (!score) {
        return res.status(404).json({ error: "Score not found" });
      }
      res.json(score);
    } catch (error) {
      res.status(500).json({ error: "Failed to update score" });
    }
  });

  // Analytics & Dashboard Data
  app.get("/api/events/:eventId/analytics", async (req, res) => {
    try {
      const analytics = await storage.getEventAnalytics(req.params.eventId);
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch analytics" });
    }
  });

  app.get("/api/organizers/:organizerId/stats", async (req, res) => {
    try {
      const stats = await storage.getOrganizerStats(req.params.organizerId);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch organizer stats" });
    }
  });

  app.get("/api/events/:eventId/health", async (req, res) => {
    try {
      const healthChecks = await storage.getEventHealthChecks(req.params.eventId);
      res.json(healthChecks);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch health checks" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
