# Maximally Hack 🚀

A comprehensive hackathon platform built with modern web technologies, providing end-to-end solutions for organizing, participating in, and managing hackathons.

## 📖 Overview

**Maximally Hack** is a full-stack web application that brings together hackathon organizers, participants, teams, and judges in one unified platform. Originally started as a UI-only demonstration with mock data, it has evolved into a complete production-ready application with real database integration, authentication, and live data management.

### 🎯 Key Features

#### For Participants
- **User Registration & Authentication** with email/password and Google OAuth
- **Event Discovery** with advanced search and filtering
- **Team Formation** with intelligent matching algorithms
- **Looking for Group (LFG)** posts for finding teammates
- **Project Submission** with multimedia support
- **Real-time Team Management** and communication
- **Personal Dashboard** tracking participation history

#### For Organizers
- **Event Creation & Management** with comprehensive event settings
- **Judge Assignment** and scorecard management
- **Real-time Analytics** and participant tracking
- **Submission Review** and judging workflows
- **Team Management** oversight
- **Customizable Event Pages** with rich content support

#### For Judges
- **Dedicated Judging Interface** with structured scorecards
- **Multi-criteria Evaluation** system
- **Real-time Score Tracking** and analytics
- **Submission Reviews** with detailed feedback
- **Judge Profile Management** with expertise tracking

## 🏗️ Architecture

### Frontend Stack
- **React 18** with TypeScript for type safety
- **Wouter** for lightweight client-side routing
- **TanStack Query (React Query)** for efficient data fetching and caching
- **Tailwind CSS** with custom component library built on Radix UI
- **Framer Motion** for smooth animations and transitions
- **Vite** for lightning-fast development and optimized builds

### Backend & Database
- **Supabase** as the primary backend service
- **PostgreSQL** with comprehensive schema design
- **Row Level Security (RLS)** for secure data access
- **Real-time subscriptions** for live updates
- **Automatic triggers** for data consistency
- **Express.js** server for additional API endpoints and SSR

### Key Integrations
- **Supabase Authentication** with multiple providers
- **Google OAuth** for seamless sign-in
- **Real-time Data Sync** across all clients
- **File Upload** handling for project assets
- **Email Notifications** for important events

## 📁 Project Structure

```
Maximally-Hack/
├── client/                    # Frontend React application
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── teams/         # Team-related components
│   │   │   ├── layout/        # Layout components (Navbar, Footer)
│   │   │   └── ui/            # Base UI components (shadcn/ui)
│   │   ├── contexts/          # React contexts for global state
│   │   │   ├── AuthContext.tsx        # Legacy auth context
│   │   │   ├── SupabaseAuthContext.tsx # Primary auth context
│   │   │   ├── ThemeProvider.tsx      # Theme management
│   │   │   └── EventContext.tsx       # Event-specific state
│   │   ├── lib/               # Utility libraries
│   │   │   ├── supabaseApi.ts # Supabase API wrapper
│   │   │   ├── queryClient.ts # React Query configuration
│   │   │   └── utils.ts       # Common utilities
│   │   ├── pages/             # Page components
│   │   │   ├── auth/          # Authentication pages
│   │   │   ├── event/         # Event-specific pages
│   │   │   ├── organizer/     # Organizer dashboard pages
│   │   │   └── teams/         # Team management pages
│   │   └── supabaseClient.ts  # Supabase client configuration
│   ├── public/                # Static assets
│   └── package.json           # Frontend dependencies
├── server/                    # Express.js backend server
│   ├── index.ts              # Main server entry point
│   └── routes/               # API route handlers
├── supabase/                  # Database schema and migrations
│   ├── schema.sql            # Complete database schema
│   ├── lfg_posts_schema.sql  # LFG posts table schema
│   ├── schema_incremental.sql # Schema updates
│   └── seed.sql              # Sample data for development
├── shared/                    # Shared types and utilities
└── package.json              # Root project configuration
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+ and npm
- **Supabase** account and project
- **Google OAuth** credentials (optional, for Google sign-in)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/maximally-hack.git
   cd maximally-hack
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new Supabase project at [supabase.com](https://supabase.com)
   - Copy your project URL and anon key
   - Run the database schema:
     ```sql
     -- Copy and execute the contents of supabase/schema.sql in your Supabase SQL editor
     -- Then run supabase/lfg_posts_schema.sql for LFG functionality
     ```

4. **Environment Configuration**
   Create a `.env.local` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

5. **Configure Authentication Providers** (Optional)
   - In your Supabase dashboard, go to Authentication → Providers
   - Enable Email/Password (enabled by default)
   - Enable Google OAuth with your credentials
   - Set redirect URL to `http://localhost:5000/dashboard`

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Access the application**
   - Open [http://localhost:5000](http://localhost:5000)
   - Create an account or sign in with Google
   - Start exploring hackathons and creating teams!

## 🛠️ Development

### Key Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build production-ready application
- `npm run start` - Start production server
- `npm run check` - TypeScript type checking

### Database Management
The application uses Supabase PostgreSQL with a comprehensive schema supporting:
- **User profiles** with role-based access (participant, organizer, judge)
- **Events** with full lifecycle management
- **Teams** with member management and join codes
- **Submissions** with multimedia support and judging
- **Scorecards** for structured evaluation
- **LFG posts** for team formation

### Authentication Flow
1. **Registration**: Users can sign up with email/password or Google OAuth
2. **Profile Creation**: Automatic profile creation with customizable fields
3. **Role Assignment**: Users can be participants, organizers, or judges
4. **Session Management**: Secure session handling with Supabase Auth

### Real-time Features
- **Live team updates** when members join/leave
- **Real-time submission status** changes
- **Live scorecard updates** during judging
- **Instant notifications** for important events

## 🎨 UI/UX Design

### Design System
- **Tailwind CSS** for utility-first styling
- **Radix UI** components for accessibility and functionality
- **Custom component library** with consistent design patterns
- **Responsive design** supporting mobile, tablet, and desktop
- **Dark/light mode** support with system preference detection

### Color Palette
- **Primary**: Coral (#FF6B6B) for primary actions
- **Secondary**: Mint (#4ECDC4) for success states
- **Accent**: Sky (#45B7D1) for informational elements
- **Neutral**: Gray scale for text and backgrounds

## 🔐 Security

### Data Protection
- **Row Level Security (RLS)** policies on all database tables
- **JWT authentication** with secure token management
- **API route protection** with middleware validation
- **Input sanitization** and validation on all forms
- **HTTPS enforcement** in production environments

### Privacy
- **GDPR compliant** data handling
- **User data encryption** at rest and in transit
- **Minimal data collection** policy
- **Clear privacy controls** for user profiles

## 📊 Performance

### Optimizations
- **React Query caching** for efficient data management
- **Code splitting** with dynamic imports
- **Image optimization** with responsive loading
- **Bundle optimization** with Vite's advanced bundling
- **Database indexing** for fast query performance

### Monitoring
- **Real-time error tracking** with comprehensive logging
- **Performance metrics** monitoring
- **User analytics** for feature usage insights
- **Database performance** monitoring via Supabase dashboard

## 🚢 Deployment

### Production Checklist
1. **Environment Variables**: Set production Supabase credentials
2. **Database Migration**: Run all schema files in production Supabase
3. **OAuth Configuration**: Update redirect URLs for production domain
4. **Build Optimization**: Run `npm run build` for production assets
5. **Security Headers**: Configure proper security headers
6. **SSL Certificate**: Ensure HTTPS is enabled
7. **Database Backup**: Set up automated backups

### Supported Platforms
- **Vercel** (recommended for frontend)
- **Railway** or **Heroku** for full-stack deployment
- **Netlify** for static deployment
- **Docker** containerization support

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### Development Workflow
1. **Fork the repository** and create a feature branch
2. **Follow TypeScript** best practices and maintain type safety
3. **Write tests** for new features and bug fixes
4. **Follow commit conventions** with clear, descriptive messages
5. **Update documentation** for any new features or API changes
6. **Submit a pull request** with detailed description of changes

### Code Standards
- **ESLint** configuration for consistent code style
- **Prettier** for automatic code formatting
- **TypeScript strict mode** for maximum type safety
- **Component documentation** with JSDoc comments
- **Accessibility** compliance with WCAG guidelines

## 📚 API Documentation

### Core Endpoints
- **Authentication**: User registration, login, and profile management
- **Events**: CRUD operations for hackathon events
- **Teams**: Team creation, member management, and joining
- **Submissions**: Project submission and file management
- **Judging**: Scorecard creation and evaluation workflows
- **LFG Posts**: Looking for group functionality

### Data Models
Comprehensive TypeScript interfaces are available in `client/src/lib/supabaseApi.ts` covering:
- User profiles and authentication
- Event management and lifecycle
- Team formation and collaboration
- Submission and judging workflows

## 🆘 Support & Troubleshooting

### Common Issues
1. **Authentication Problems**: Check Supabase configuration and OAuth settings
2. **Database Errors**: Verify schema migration and RLS policies
3. **Build Failures**: Ensure all dependencies are installed correctly
4. **Performance Issues**: Check React Query cache configuration

### Getting Help
- **GitHub Issues**: Report bugs and request features
- **Documentation**: Check inline code documentation
- **Community**: Join our Discord server for real-time support
- **Email**: Contact the development team directly

## 📈 Roadmap

### Upcoming Features
- **Advanced Analytics** dashboard for organizers
- **Mobile Application** with React Native
- **AI-powered Team Matching** algorithm
- **Blockchain Integration** for certificate verification
- **Multi-language Support** for global accessibility
- **Advanced Judging Tools** with rubric customization

### Performance Improvements
- **Server-side Rendering** for better SEO
- **Advanced Caching** strategies
- **WebSocket Integration** for real-time features
- **Progressive Web App** capabilities

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Supabase Team** for the excellent backend-as-a-service platform
- **Vercel Team** for the incredible frontend development experience
- **Open Source Community** for the amazing tools and libraries
- **Beta Testers** and early adopters for valuable feedback
- **Design Contributors** for UI/UX improvements and accessibility enhancements

## 📞 Contact

**Project Maintainers:**
- Lead Developer: [Your Name] - your.email@example.com
- UI/UX Designer: [Designer Name] - designer@example.com

**Project Links:**
- **Live Demo**: [https://maximally-hack.vercel.app](https://maximally-hack.vercel.app)
- **GitHub Repository**: [https://github.com/your-username/maximally-hack](https://github.com/your-username/maximally-hack)
- **Project Documentation**: [https://docs.maximally-hack.com](https://docs.maximally-hack.com)

---

**Built with ❤️ for the hackathon community**


# Maximally Hack 🎉

A complete frontend-only hackathon platform designed with a playful minimal aesthetic using pastel crayon colors. Maximally Hack provides a comprehensive hackathon ecosystem including event discovery, team formation, project submission, judging interfaces, and community features - all without requiring a backend database.

## ✨ What We're Building

### Vision
Maximally Hack aims to be the friendliest, most approachable hackathon platform that removes barriers to participation while celebrating creativity and technical excellence. Think Devpost meets friendly design - a place where great ideas come to life.

### Core Philosophy
- **Frontend-First**: Complete platform functionality using JSON fixtures and local storage
- **Playful Design**: Pastel crayon colors with soft, rounded interfaces
- **Inclusive Community**: Welcoming to beginners while powerful for experts
- **Zero Friction**: No complex setup - just visit and start hacking

## 🎯 Platform Features

### For Participants
- **Event Discovery** (`/explore`) - Browse hackathons with smart filtering by interests, skills, and categories
- **Enhanced Event Pages** (`/event/:id`) - Comprehensive event command centers with:
  - 11-tab navigation system (Overview, Timeline, Submissions, Teams, People, Help, etc.)
  - Real-time countdowns and submission tracking
  - Team formation and mentor booking
  - Resource libraries and sponsor showcases
- **Project Management** - Full project lifecycle from creation to submission
  - Rich text editing with markdown support
  - Media upload for demos and screenshots
  - Version control and submission tracking
- **Team Formation** - Connect with teammates and build diverse teams
- **Profile System** (`/profile`) - Showcase skills, experience, and project portfolios

### For Judges
- **Judge Dashboard** (`/judge`) - Comprehensive review interface with:
  - Multi-criteria scoring system (Innovation, Execution, Design, Impact)
  - Detailed feedback forms
  - Progress tracking across assigned submissions
- **Judge Directory** (`/judges`) - Public showcase of expert judges
- **Judge Registration** (`/judge/register`) - Streamlined onboarding process

### For Organizers
- **Event Creation** (`/organizer/create`) - Comprehensive event setup wizard
- **Event Management** (`/organizer/edit/:id`) - Full-featured editing interface with:
  - Basic info, timeline, and location management
  - Prize track configuration
  - Judge and mentor assignment
  - Social media and community links
  - Sponsor showcase management
- **Organizer Dashboard** (`/organizer`) - Event analytics and management hub

### Community Features
- **Leaderboards** (`/leaderboards`) - Competition rankings and achievements
- **Sponsor Showcase** (`/sponsors`) - Partner highlights and opportunities
- **Help Center** (`/help`) - Comprehensive guidance and FAQ system
- **Project Gallery** (`/projects`) - Browse innovative submitted projects

## 🎨 Design System

### Color Palette
```css
--cream: #FFFDF7        /* Warm, welcoming background */
--sky: #A3D5FF          /* Trust and innovation */
--coral: #FF8C8C        /* Energy and creativity */
--yellow: #FFE680       /* Optimism and achievement */
--mint: #A8E6CF         /* Growth and collaboration */
--soft-gray: #F8F9FA    /* Subtle accents */
--text-dark: #2D3748    /* Primary text */
--text-muted: #718096   /* Secondary text */
```

### Typography
- **Headings**: Fredoka/Baloo 2 for friendly, approachable headers
- **Body Text**: Inter/Nunito for excellent readability
- **Code**: Monospace fonts for technical content

### Component Standards
- **16px border radius** - Consistent rounded corners
- **4px grid system** - Consistent spacing and alignment
- **Soft shadows** - Subtle depth with `shadow-soft` class
- **Pill-shaped buttons** - Friendly, approachable interactions
- **Hover animations** - Powered by Framer Motion with `hover-scale` class

## 🚀 Technical Architecture

### Frontend Stack
- **React 18** with TypeScript for type safety and modern development
- **Wouter** for lightweight, declarative client-side routing
- **TanStack Query** for server state management and caching
- **Shadcn/ui** components built on accessible Radix UI primitives
- **Tailwind CSS** with custom design system and utility classes
- **Framer Motion** for smooth animations and micro-interactions
- **Vite** for lightning-fast development and optimized builds

### Backend Simulation
- **Express.js** with TypeScript for API endpoints (development only)
- **JSON Fixtures** - Comprehensive mock data in `client/src/lib/fixtures/`
- **Local Storage** - Client-side persistence for user data
- **Mock APIs** - Realistic API responses without database dependency

### Data Architecture
```
client/src/lib/fixtures/
├── events.json       # Hackathon events with full configuration
├── judges.json       # Expert judges with expertise areas
├── submissions.json  # Project submissions with rich metadata
├── teams.json        # Team formations and member management
├── users.json        # User profiles and authentication data
└── scorecards.json   # Judging scores and feedback
```

## 📁 Project Structure



```
Maximally-Hack/
│
├── attached_assets/
│   ├── generated_images/
│   ├── image_*.png
│   ├── Pasted-*.txt
│   └── Screenshot *.png
│
├── client/
│   ├── index.html
│   └── src/
│       ├── App.tsx
│       ├── index.css
│       ├── main.tsx
│       ├── supabaseClient.ts
│       ├── components/
│       │   ├── event/
│       │   │   ├── Countdown.tsx
│       │   │   ├── CriteriaBar.tsx
│       │   │   ├── EnhancedPrizeCard.tsx
│       │   │   ├── EventCard.tsx
│       │   │   ├── EventHeader.tsx
│       │   │   ├── FactBadge.tsx
│       │   │   ├── GalleryGrid.tsx
│       │   │   ├── LinkChip.tsx
│       │   │   ├── ProjectCard.tsx
│       │   │   ├── SocialIcon.tsx
│       │   │   ├── StickyCTA.tsx
│       │   │   ├── TeamCard.tsx
│       │   │   ├── TimelineItem.tsx
│       │   │   └── ...
│       │   ├── layout/
│       │   │   ├── Footer.tsx
│       │   │   └── Navbar.tsx
│       │   ├── teams/
│       │   │   ├── CreateTeam.tsx
│       │   │   ├── FindTeam.tsx
│       │   │   ├── MyTeams.tsx
│       │   │   ├── TeamApply.tsx
│       │   │   ├── TeamCard.tsx
│       │   │   ├── TeamChat.tsx
│       │   │   ├── TeamDetail.tsx
│       │   │   ├── TeamInvites.tsx
│       │   │   ├── TeamManage.tsx
│       │   │   ├── TeamManagement.tsx
│       │   │   ├── TeamMatch.tsx
│       │   │   ├── TeamRequests.tsx
│       │   │   ├── TeamRoles.tsx
│       │   │   ├── TeamSettings.tsx
│       │   │   ├── TeamsHome.tsx
│       │   │   ├── TeamsLFG.tsx
│       │   │   └── ...
│       │   ├── ui/
│       │   │   ├── accordion.tsx
│       │   │   ├── alert-dialog.tsx
│       │   │   ├── alert.tsx
│       │   │   ├── aspect-ratio.tsx
│       │   │   ├── avatar.tsx
│       │   │   ├── badge.tsx
│       │   │   ├── breadcrumb.tsx
│       │   │   ├── button.tsx
│       │   │   ├── calendar.tsx
│       │   │   ├── card.tsx
│       │   │   ├── carousel.tsx
│       │   │   ├── chart.tsx
│       │   │   ├── checkbox.tsx
│       │   │   ├── collapsible.tsx
│       │   │   ├── command.tsx
│       │   │   ├── confetti.tsx
│       │   │   ├── context-menu.tsx
│       │   │   ├── dialog.tsx
│       │   │   ├── drawer.tsx
│       │   │   ├── dropdown-menu.tsx
│       │   │   ├── floating-elements.tsx
│       │   │   ├── form.tsx
│       │   │   ├── hover-card.tsx
│       │   │   ├── input-otp.tsx
│       │   │   ├── input.tsx
│       │   │   ├── label.tsx
│       │   │   ├── menubar.tsx
│       │   │   ├── navigation-menu.tsx
│       │   │   ├── pagination.tsx
│       │   │   ├── popover.tsx
│       │   │   ├── progress.tsx
│       │   │   ├── radio-group.tsx
│       │   │   ├── resizable.tsx
│       │   │   ├── scroll-area.tsx
│       │   │   ├── select.tsx
│       │   │   ├── separator.tsx
│       │   │   ├── sheet.tsx
│       │   │   ├── sidebar.tsx
│       │   │   ├── skeleton.tsx
│       │   │   ├── slider.tsx
│       │   │   ├── switch.tsx
│       │   │   ├── table.tsx
│       │   │   ├── tabs.tsx
│       │   │   ├── textarea.tsx
│       │   │   ├── theme-toggle.tsx
│       │   │   ├── toast.tsx
│       │   │   ├── toaster.tsx
│       │   │   ├── toggle-group.tsx
│       │   │   ├── toggle.tsx
│       │   │   └── tooltip.tsx
│       │   └── utils/
│       │       └── HashRedirect.tsx
│       ├── contexts/
│       │   ├── AuthContext.tsx
│       │   ├── EventContext.tsx
│       │   ├── SupabaseAuthContext.tsx
│       │   └── ThemeProvider.tsx
│       ├── hooks/
│       │   ├── use-mobile.tsx
│       │   └── use-toast.ts
│       ├── lib/
│       │   ├── api.ts
│       │   ├── auth.ts
│       │   ├── fixtures/
│       │   │   ├── events.json
│       │   │   ├── judges.json
│       │   │   ├── scorecards.json
│       │   │   ├── submissions.json
│       │   │   ├── teams.json
│       │   │   ├── teamsData.json
│       │   │   ├── teamsData.ts
│       │   │   └── users.json
│       │   ├── queryClient.ts
│       │   ├── theme.ts
│       │   └── utils.ts
│       └── pages/
│           ├── auth/
│           │   ├── Login.tsx
│           │   ├── Onboarding.tsx
│           │   ├── OrganizerSignin.tsx
│           │   └── Signup.tsx
│           ├── Dashboard.tsx
│           ├── EnhancedEventDetail.tsx
│           ├── event/
│           │   ├── About.tsx
│           │   ├── Help.tsx
│           │   ├── Judging.tsx
│           │   ├── Overview.tsx
│           │   ├── people/
│           │   │   └── PeopleHome.tsx
│           │   ├── Prizes.tsx
│           │   ├── Resources.tsx
│           │   ├── Rules.tsx
│           │   ├── Sponsors.tsx
│           │   ├── submissions/
│           │   │   └── List.tsx
│           │   ├── teams/
│           │   │   └── List.tsx
│           │   ├── Timeline.tsx
│           │   └── _layout/
│           │       └── EventLayout.tsx
│           ├── EventDetail.tsx
│           ├── Explore.tsx
│           ├── Help.tsx
│           ├── Landing.tsx
│           ├── Leaderboards.tsx
│           ├── NewEnhancedEventDetail.tsx
│           ├── not-found.tsx
│           ├── Organize.tsx
│           ├── organizer/
│           │   ├── CreateEvent.tsx
│           │   ├── EditEvent.tsx
│           │   ├── EditHackathon.tsx
│           │   ├── EnhancedOrganizerDashboard.tsx
│           │   ├── EventContentEditor.tsx
│           │   ├── JudgeManagement.tsx
│           │   ├── ManageEvent.tsx
│           │   ├── OrganizerDashboard.tsx
│           ├── Profile.tsx
│           ├── ProjectDetail.tsx
│           ├── ProjectsGallery.tsx
│           ├── SimpleEventDetail.tsx
│           ├── SimpleExplore.tsx
│           ├── Sponsors.tsx
│           ├── Submit.tsx
│           └── ...
│
├── server/
│   ├── index.ts
│   ├── routes.ts
│   ├── storage.ts
│   └── vite.ts
│
├── shared/
│   └── schema.ts
│
├── components.json
├── drizzle.config.ts
├── events.md
├── package.json
├── postcss.config.js
├── README.md
├── replit.md
├── tailwind.config.ts
├── TECH_STACK.md
├── tsconfig.json
├── vite.config.ts
└── ...other config files
```

## 🌟 Key Features Showcase

### Event Management System
Our event pages serve as comprehensive hackathon command centers:

#### Featured Event: AI Shipathon 2025
- **48-hour global hackathon** focused on AI innovation
- **Multi-criteria judging**: Innovation, execution, clarity, AI use, beginner spirit
- **$50,000+ in prizes** across multiple tracks
- **Expert judge panel** from leading tech companies
- **Real-time submission tracking** and countdown timers

#### Enhanced Event Detail Pages
- **11-tab navigation system**:
  - Overview: Quick start checklist and live announcements
  - Timeline: Interactive timeline with current status
  - Submissions: Real-time project gallery with voting
  - Teams: Team formation and skill matching
  - People: Mentors, judges, and speakers directory
  - Help: Integrated support system
  - Resources: API kits, templates, and guides
  - Judging: Scoring interface and criteria
  - Sponsors: Partner showcases and challenges
  - Hiring: Job board and recruitment
  - Perks: Swag claims and partner credits

### Project Submission System
- **Rich documentation** with markdown support
- **Media upload** for screenshots, demo videos, and project galleries
- **Event association** - link projects to specific hackathons
- **Team collaboration** with role-based permissions
- **Version tracking** and submission history
- **Public/private** visibility controls

### Judge Interface
- **Comprehensive scoring** across multiple criteria
- **Detailed feedback** system with structured comments
- **Progress tracking** with assignment management
- **Collaboration tools** for judge discussion
- **Conflict of interest** management

### Community Features
- **Team finder** with skill-based matching
- **Mentor booking** system with availability calendars
- **Sponsor showcases** with tier-based visibility
- **Achievement system** with leaderboards and badges
- **Help desk** with ticket routing and resolution

## 🛠️ Getting Started

### Prerequisites
- Node.js 20+
- npm package manager

### Quick Start

1. **Fork this Repl** or clone the repository
2. **Dependencies auto-install** on Replit
3. **Start development**:
   ```bash
   npm run dev
   ```
4. **Visit** `http://localhost:5000` to see the application

### Available Scripts
- `npm run dev` - Start development server with hot reloading
- `npm run build` - Create optimized production build
- `npm run start` - Start production server
- `npm run check` - Run TypeScript type checking

## 📱 Complete Page Map

### Public Pages
- **Landing** (`/`) - Hero section with featured events and testimonials
- **Explore** (`/explore`) - Event discovery with advanced filtering
- **Event Detail** (`/event/:id`) - Comprehensive event information hub
- **Projects** (`/projects`) - Public project gallery with search
- **Project Detail** (`/project/:id`) - Individual project showcase
- **Judges** (`/judges`) - Expert judge directory and profiles
- **Sponsors** (`/sponsors`) - Sponsor showcase and partnerships
- **Help** (`/help`) - FAQ and platform guidance

### User Dashboard
- **Dashboard** (`/dashboard`) - Personalized user hub
- **Profile** (`/profile`) - User profile and portfolio management
- **Create Project** (`/submit`) - Project submission interface
- **Edit Project** (`/project/:id/edit`) - Project editing and updates

### Judge Interface
- **Judge Dashboard** (`/judge`) - Project review and scoring
- **Judge Registration** (`/judge/register`) - Expert onboarding

### Organizer Tools
- **Organizer Dashboard** (`/organizer`) - Event management hub
- **Create Event** (`/organizer/create`) - Event setup wizard
- **Edit Event** (`/organizer/edit/:id`) - Comprehensive event editor
- **Manage Event** (`/organizer/manage/:id`) - Live event management

### Authentication
- **Login** (`/login`) - User authentication
- **Signup** (`/signup`) - User registration
- **Onboarding** (`/onboarding`) - New user setup

### Special Features
- **Leaderboards** (`/leaderboards`) - Competition rankings
- **Enhanced Event Detail** (`/event/:id/enhanced`) - Advanced event hub prototype

## 🎯 Demo Data & Fixtures

### Sample Events
- **AI Shipathon 2025** - Global AI innovation challenge
- **Student Code Quest** - Beginner-friendly programming contest
- **Green Tech Challenge** - Sustainability-focused hackathon
- **Local Innovation Day** - Community-based maker event

### Mock Users
- **Participants** with diverse skill sets and experience levels
- **Expert Judges** from leading tech companies
- **Event Organizers** with comprehensive event management needs
- **Mentors** with specialized expertise areas

### Sample Projects
- **EcoTracker** - Carbon footprint monitoring app
- **StudyBuddy** - AI-powered learning companion
- **HealthSync** - Telemedicine platform
- **CommunityMap** - Local business discovery tool

## 🚢 Deployment

### Replit Deployment (Recommended)
1. **Click Deploy** in the Replit interface
2. **Configure domain** (optional)
3. **Auto-scaling** based on traffic
4. **SSL** and custom domain support

### Production Features
- **Optimized builds** with code splitting
- **Static asset** optimization
- **Progressive enhancement** for performance
- **Mobile-responsive** design

## 🎨 Design Guidelines

### Component Patterns
- **Card-based layouts** with consistent 16px radius
- **Pill-shaped buttons** with hover animations
- **Floating elements** for visual interest
- **Gradient backgrounds** with pastel accents
- **Soft shadows** for subtle depth

### Accessibility Standards
- **WCAG 2.1 AA** compliance target
- **Keyboard navigation** for all interactive elements
- **Screen reader** compatibility
- **High contrast** mode support
- **Semantic HTML** structure

### Performance Optimizations
- **Lazy loading** for route components
- **Image optimization** with proper sizing
- **Bundle splitting** for faster load times
- **Caching strategies** with TanStack Query

## 🌈 Future Enhancements

### Advanced Features (Planned)
- **AI-powered team matching** based on skills and interests
- **Real-time collaboration** tools for team projects
- **Video conferencing** integration for mentorship
- **Automated project** categorization and tagging
- **Smart resource** recommendations based on project needs

### Integration Opportunities
- **GitHub integration** for automatic repository setup
- **Discord/Slack** workspace creation and management
- **Calendar integration** for event timeline synchronization
- **Payment processing** for prize distribution
- **Corporate partnerships** with API integrations

### Analytics & Insights
- **Event performance** dashboards for organizers
- **Participant journey** mapping and optimization
- **Predictive analytics** for event success factors
- **ROI tracking** for sponsors and partners

## 🤝 Contributing

### Development Workflow
1. **Fork** the repository and create feature branches
2. **Follow** TypeScript strict mode and ESLint rules
3. **Test** across all user roles and scenarios
4. **Document** changes with clear commit messages
5. **Submit** pull requests with detailed descriptions

### Code Quality Standards
- **100% TypeScript** coverage with strict typing
- **Component reusability** following Shadcn patterns
- **Responsive design** with mobile-first approach
- **Accessibility** compliance with ARIA standards
- **Performance optimization** with bundle analysis

## 📊 Platform Statistics

### Current Implementation
- **50+ React components** - Comprehensive UI library
- **25+ pages** - Complete user journey coverage
- **4 user roles** - Participants, Judges, Organizers, Sponsors
- **6 JSON fixtures** - Rich mock data for development
- **11-tab event system** - Advanced event management

### Technical Metrics
- **Type safety**: 100% TypeScript coverage
- **Performance**: Optimized Vite builds with lazy loading
- **Accessibility**: Keyboard navigation and screen reader support
- **Mobile support**: Responsive design across all devices

## 📄 License

MIT License - See [LICENSE](LICENSE) file for details.

## 🙋‍♀️ Support & Community

### Getting Help
- **Comprehensive documentation** in this README
- **Replit community** support and discussions
- **GitHub issues** for bug reports and feature requests
- **Built-in help system** within the platform

### Resources
- [Replit Documentation](https://docs.replit.com/)
- [React 18 Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Shadcn/ui Components](https://ui.shadcn.com/)

---

**Built with ❤️ on Replit**

*Ready to revolutionize hackathons? Join the friendliest hackathon community and start building the future of collaborative innovation!* 🚀

### 🎯 Vision Statement

Maximally Hack democratizes hackathon participation by providing an intuitive, accessible platform that connects creators, judges, and sponsors in a vibrant ecosystem of innovation. We believe great ideas can come from anywhere, and our platform removes barriers while celebrating creativity and technical excellence.

**Join the community. Build the future. Hack maximally.** ✨
