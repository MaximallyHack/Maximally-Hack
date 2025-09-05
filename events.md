# Event Page Transformation Plan

## Overview
Transform the event page into a comprehensive hackathon command center - the single source of truth for all participant needs, reducing Discord dependency and providing clear guidance throughout the event lifecycle.

## Vision Statement
**Goal**: Make the event page the central hub where participants can register, collaborate, build, submit, and get support without leaving the platform.

---

## Technical Architecture

### Core Infrastructure Required
- **Real-time Updates**: WebSocket integration for live announcements, submission counts, mentor availability
- **State Management**: Complex event lifecycle management (upcoming → live → judging → closed)
- **File Storage**: Submission uploads, resources, team avatars
- **Calendar Integration**: Add-to-calendar for timeline events, mentor bookings
- **Notification System**: Discord/email integration for announcements
- **Booking System**: Mentor and judge scheduling with time slots
- **Authentication**: Role-based access (participant, mentor, judge, organizer)

### Data Models Required

#### Event Extensions
```typescript
interface EventState {
  phase: 'upcoming' | 'live' | 'judging' | 'closed'
  allowSubmissions: boolean
  allowTeamFormation: boolean
  votingActive: boolean
  announcementsEnabled: boolean
}

interface EventConfiguration {
  mentorBookingEnabled: boolean
  teamFinderEnabled: boolean
  peopleChoiceVoting: boolean
  ticketSystemEnabled: boolean
  hiringBoardEnabled: boolean
  perksEnabled: boolean
}
```

#### New Core Models
```typescript
interface Mentor {
  id: string
  name: string
  role: string
  skills: string[]
  availability: TimeSlot[]
  discordHandle: string
  maxConcurrentTickets: number
}

interface Judge {
  id: string
  name: string
  title: string
  expertise: string[]
  lookingFor: string[]
  judgingDates: string[]
}

interface Ticket {
  id: string
  eventId: string
  submittedBy: string
  category: 'tech' | 'design' | 'product' | 'team' | 'rules'
  title: string
  description: string
  status: 'new' | 'claimed' | 'resolved'
  claimedBy?: string
  createdAt: string
  resolvedAt?: string
}

interface Team {
  id: string
  eventId: string
  name: string
  leaderId: string
  members: string[]
  lookingFor: string[]
  description: string
  skills: string[]
  visible: boolean
  recruitmentOpen: boolean
}

interface Submission {
  id: string
  eventId: string
  teamId: string
  title: string
  description: string
  videoUrl?: string
  repoUrl?: string
  demoUrl?: string
  category: string
  status: 'draft' | 'submitted' | 'judged'
  buildLogs: BuildLogEntry[]
  preflightChecks: PreflightStatus
  votes: number
}

interface Announcement {
  id: string
  eventId: string
  title: string
  content: string
  priority: 'low' | 'medium' | 'high'
  createdAt: string
  authorId: string
}
```

---

## Implementation Phases

### Phase 1: Foundation (Week 1-2)
**Priority**: Core infrastructure and basic functionality

#### Components to Build:
1. **Enhanced Event Layout**
   - Sticky action bar with state-aware buttons
   - Tab navigation system (11 tabs)
   - Responsive layout with right rail
   - Loading states and error handling

2. **Overview Tab**
   - Quick start checklist
   - Live announcements feed
   - Key stats dashboard
   - Create project button

3. **Timeline Tab**
   - Interactive timeline with current status
   - Add-to-calendar integration
   - Live "happening now" indicators

4. **Basic Submissions Tab**
   - Grid view of all submissions
   - Basic filtering and search
   - Submission status indicators

#### Technical Requirements:
- WebSocket setup for real-time updates
- Event state management
- Calendar integration library
- Basic file upload system

### Phase 2: Community & Teams (Week 3-4)
**Priority**: Team formation and mentorship

#### Components to Build:
1. **Teams Tab**
   - Team finder with skill matching
   - Create team flow
   - Join team requests
   - Looking for teammates toggle

2. **People Tab**
   - Mentors directory with availability
   - Judges profiles
   - Speakers with session details
   - Monogram avatar system (no photos)

3. **Help Tab**
   - Ticket submission form
   - Help desk board with status tracking
   - Mentor request queue
   - Quick links to Discord/email

#### Technical Requirements:
- Team management system
- Mentor booking calendar
- Ticket routing and notifications
- Avatar generation system

### Phase 3: Advanced Features (Week 5-6)
**Priority**: Submission workflow and judging

#### Components to Build:
1. **Enhanced Submissions Tab**
   - Preflight check system
   - Draft autosave functionality
   - Build logs timeline
   - People's choice voting

2. **Judging Tab**
   - Scoring matrix interface
   - Judge tips and guidance
   - Conflict policy display
   - Disqualifier checklist

3. **Resources Tab**
   - Hackathon guide cards
   - API kits and templates
   - Design pack downloads
   - Asset library

#### Technical Requirements:
- Advanced file management
- Voting system with fraud prevention
- Judge scoring interface
- Resource content management

### Phase 4: Business Features (Week 7-8)
**Priority**: Monetization and partnerships

#### Components to Build:
1. **Hiring Tab**
   - Job board with filtering
   - Team recruitment visibility toggle
   - Application tracking
   - Winner fast-track tags

2. **Perks & Swag Tab**
   - Verification and claim flow
   - Size selection for merchandise
   - Pickup/shipping coordination
   - Partner credits distribution

3. **Sponsors Tab**
   - Tiered sponsor display
   - Office hours booking
   - Sponsor challenges
   - Resource links and contacts

#### Technical Requirements:
- Partnership API integrations
- E-commerce/fulfillment system
- Advanced calendar booking
- Sponsor content management

---

## Smart Features & Integrations

### Real-time Features
1. **Live Ticker**: Countdown timer + submission count
2. **Announcement System**: Organizer posts → site + Discord + email
3. **Mentor Queue**: Auto-ping skill-matched mentors
4. **Submission Spotlight**: Featured builds during event

### Automation
1. **Office Hours Booking**: Calendly/Google Calendar embed
2. **Judge Orientation**: Automated onboarding flow
3. **Certificate Generation**: Auto badges for mentors/judges
4. **Safety Center**: IP and conduct checklists

### Local/Hybrid Features
1. **Venue Information**: WiFi, power, help desk QR codes
2. **Local Schedule**: Location-specific timeline
3. **Pickup Coordination**: Swag and prize distribution

---

## API Endpoints Required

### Event Management
```
GET /api/events/:id/full-details
POST /api/events/:id/announcements
GET /api/events/:id/stats
```

### Teams
```
GET /api/events/:id/teams
POST /api/events/:id/teams
POST /api/teams/:id/join-request
PUT /api/teams/:id/visibility
```

### Mentorship
```
GET /api/events/:id/mentors
POST /api/events/:id/tickets
PUT /api/tickets/:id/claim
GET /api/mentors/:id/availability
POST /api/mentors/:id/book-session
```

### Submissions
```
GET /api/events/:id/submissions
POST /api/submissions/:id/preflight-check
POST /api/submissions/:id/build-log
POST /api/submissions/:id/vote
```

### Resources & Content
```
GET /api/events/:id/resources
GET /api/events/:id/sponsors
GET /api/events/:id/jobs
POST /api/events/:id/perks/claim
```

---

## UI/UX Guidelines

### Design Principles
- **Clean & Minimal**: No photos, monogram avatars only
- **State-Aware**: UI adapts to event phase
- **Action-Oriented**: Clear CTAs for each event state
- **Information Hierarchy**: Most important info prominently displayed

### Accessibility
- Keyboard navigation for all interactive elements
- Screen reader compatibility
- High contrast mode support
- Mobile-responsive design

### Performance
- Lazy loading for tab content
- Optimistic updates for real-time features
- Caching for static content
- Progressive enhancement

---

## Database Schema Changes

### New Tables Required
```sql
-- Mentors
CREATE TABLE mentors (
  id UUID PRIMARY KEY,
  event_id UUID REFERENCES events(id),
  user_id UUID REFERENCES users(id),
  skills TEXT[],
  availability JSONB,
  max_concurrent_tickets INTEGER DEFAULT 3
);

-- Teams
CREATE TABLE teams (
  id UUID PRIMARY KEY,
  event_id UUID REFERENCES events(id),
  name VARCHAR(255),
  leader_id UUID REFERENCES users(id),
  description TEXT,
  skills TEXT[],
  looking_for TEXT[],
  visible BOOLEAN DEFAULT true,
  recruitment_open BOOLEAN DEFAULT true
);

-- Tickets
CREATE TABLE help_tickets (
  id UUID PRIMARY KEY,
  event_id UUID REFERENCES events(id),
  submitted_by UUID REFERENCES users(id),
  category VARCHAR(50),
  title VARCHAR(255),
  description TEXT,
  status VARCHAR(20) DEFAULT 'new',
  claimed_by UUID REFERENCES mentors(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Announcements
CREATE TABLE announcements (
  id UUID PRIMARY KEY,
  event_id UUID REFERENCES events(id),
  title VARCHAR(255),
  content TEXT,
  priority VARCHAR(20) DEFAULT 'medium',
  author_id UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## Testing Strategy

### Unit Tests
- Component rendering and interaction
- State management logic
- API integration functions
- Utility functions

### Integration Tests
- Full user workflows
- Real-time feature functionality
- File upload/download flows
- Calendar integration

### Performance Tests
- Load testing for high-traffic events
- Real-time update performance
- File upload handling
- Database query optimization

---

## Deployment Considerations

### Infrastructure
- WebSocket server scaling
- File storage (AWS S3 or similar)
- CDN for static assets
- Database optimization for real-time queries

### Monitoring
- Real-time user metrics
- Performance monitoring
- Error tracking
- Usage analytics

### Security
- Rate limiting for submissions/votes
- File upload validation
- User role verification
- Data privacy compliance

---

## Success Metrics

### User Engagement
- Time spent on event page
- Feature adoption rates
- Discord usage reduction
- Support ticket volume

### Business Impact
- Event completion rates
- Sponsor engagement
- Mentor participation
- Submission quality scores

### Technical Performance
- Page load times
- Real-time update latency
- System uptime
- Error rates

---

## Migration Strategy

### From Current State
1. **Phase 1**: Enhance existing SimpleEventDetail.tsx with new layout
2. **Phase 2**: Add new tabs incrementally
3. **Phase 3**: Migrate existing submission flow
4. **Phase 4**: Full feature rollout

### Data Migration
- Export existing event data
- Transform to new schema
- Validate data integrity
- Gradual feature enabling

### User Training
- Organizer onboarding guide
- Participant feature tour
- Mentor/judge orientation
- Progressive disclosure of features

---

## Future Enhancements

### Advanced Features
- AI-powered team matching
- Automated project categorization
- Predictive mentorship routing
- Smart resource recommendations

### Integrations
- GitHub integration for automatic repo setup
- Slack workspace creation
- Video conferencing platform
- Payment processing for prizes

### Analytics
- Event performance dashboards
- Participant journey mapping
- Predictive analytics for event success
- ROI tracking for sponsors

---

This plan represents a complete transformation of the event page into a comprehensive hackathon platform. Implementation should be done incrementally, with each phase building upon the previous one to ensure stability and user adoption.