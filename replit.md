# Overview

Maximally Hack is a frontend-only hackathon platform designed with a playful minimal aesthetic using pastel crayon colors. The application provides a complete hackathon ecosystem including event discovery, team formation, project submission, judging interfaces, and community features. Built as a React TypeScript application, it simulates a full-featured platform like Devpost but with a friendlier, more approachable design.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state and caching
- **UI Framework**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design system and CSS variables
- **Build Tool**: Vite for fast development and optimized builds

## Design System
- **Theme**: Playful minimal with pastel crayon palette
- **Colors**: Cream base (#FFFDF7), sky blue (#A3D5FF), coral (#FF8C8C), yellow (#FFE680), mint (#A8E6CF)
- **Typography**: Fredoka/Baloo 2 for headings, Inter/Nunito for body text
- **Components**: 16px radius cards, pill-shaped buttons, soft shadows
- **Animation**: Framer Motion for floating elements and hover effects

## Component Architecture
- **Layout Components**: Navbar with sticky positioning, Footer with brand links
- **Event Components**: EventCard, EventHeader, Countdown timer
- **Team Components**: TeamCard for team discovery and joining
- **Project Components**: ProjectCard with scoring and awards display
- **Judge Components**: JudgeCard and ScorePanel for evaluation interface
- **UI Components**: Complete Shadcn/ui component library with custom theming

## Data Layer
- **Mock API**: Simulated backend using JSON fixtures for events, users, teams, submissions
- **Type Safety**: TypeScript interfaces for all data models (Event, User, Team, Submission, Judge)
- **Caching Strategy**: TanStack Query with infinite stale time for demo purposes
- **State Structure**: Normalized data with relationships between entities

## Page Structure
- **Public Pages**: Landing, Explore events, Event details, Projects gallery
- **User Pages**: Profile pages, Authentication flows, Onboarding
- **Role-specific Dashboards**: Organizer dashboard, Judge dashboard
- **Submission Flow**: Multi-step project submission with live preview
- **Community Features**: Leaderboards, Judge directory, Sponsor partnerships

## Responsive Design
- **Mobile-first**: Responsive design with mobile breakpoint hooks
- **Adaptive Layout**: Grid layouts that collapse to stacks on mobile
- **Touch-friendly**: Larger tap targets and gesture support
- **Sheet Navigation**: Mobile drawer navigation using Shadcn Sheet component

# External Dependencies

## Core React Ecosystem
- **@tanstack/react-query**: Server state management and caching
- **wouter**: Lightweight routing library
- **framer-motion**: Animation library for floating elements and transitions
- **react-hook-form**: Form handling with validation
- **@hookform/resolvers**: Form validation resolvers

## UI Component Libraries
- **@radix-ui/***: Unstyled, accessible UI primitives for all interactive components
- **shadcn/ui**: Pre-built component library built on Radix primitives
- **lucide-react**: Icon library for consistent iconography
- **embla-carousel-react**: Carousel component for content sliders

## Styling and Design
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **clsx**: Conditional class name utility
- **tailwind-merge**: Tailwind class merging utility

## Database Schema (Drizzle Setup)
- **drizzle-orm**: TypeScript ORM for database operations
- **drizzle-zod**: Schema validation integration
- **@neondatabase/serverless**: Neon database driver for PostgreSQL
- **drizzle-kit**: Database migration and schema management tools

## Development Tools
- **vite**: Build tool and development server
- **typescript**: Type checking and IntelliSense
- **@replit/vite-plugin-runtime-error-modal**: Development error overlay
- **@replit/vite-plugin-cartographer**: Replit-specific development features

## Utility Libraries
- **date-fns**: Date manipulation and formatting
- **nanoid**: Unique ID generation
- **cmdk**: Command palette component
- **react-day-picker**: Calendar component for date selection