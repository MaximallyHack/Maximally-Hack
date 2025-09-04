
# Tech Stack - Maximally Hack Platform

## Frontend Architecture

### Core Framework
- **React 18** - Modern React with concurrent features and improved performance
- **TypeScript** - Type safety and enhanced developer experience
- **Vite** - Lightning-fast build tool and development server

### Routing & State Management
- **Wouter** - Lightweight declarative client-side routing (3kb)
- **TanStack Query** - Server state management, caching, and synchronization
- **React Context** - Client-side state management for authentication

### UI Framework & Styling
- **Shadcn/ui** - High-quality components built on Radix UI primitives
- **Radix UI** - Unstyled, accessible UI primitives for all interactive components
- **Tailwind CSS** - Utility-first CSS framework with custom design system
- **Framer Motion** - Smooth animations and micro-interactions

### Form Handling & Validation
- **React Hook Form** - Performant forms with easy validation
- **@hookform/resolvers** - Validation resolvers for various schema libraries
- **Zod** - TypeScript-first schema validation

### Icons & Visual Elements
- **Lucide React** - Beautiful & consistent SVG icon library
- **Embla Carousel** - Flexible carousel component for content sliders

### Utility Libraries
- **Class Variance Authority** - Component variant management
- **Clsx** - Conditional class name utility
- **Tailwind Merge** - Intelligent Tailwind class merging
- **Date-fns** - Modern JavaScript date utility library

## Backend Architecture

### Server Framework
- **Express.js** - Fast, unopinionated web framework for Node.js
- **TypeScript** - Type safety across the entire backend

### Database & ORM
- **Drizzle ORM** - TypeScript ORM with excellent type safety
- **Drizzle Kit** - Database migration and schema management tools
- **Drizzle-Zod** - Schema validation integration
- **PostgreSQL** - Robust relational database (via Neon/Supabase)

### Authentication & Session Management
- **Express Session** - Session middleware for Express
- **Passport.js** - Authentication middleware with multiple strategies
- **Connect PG Simple** - PostgreSQL session store

### Data Storage
- **JSON Fixtures** - Development and demo data
- **File Storage** - Project images, videos, and documents

## Development Tools

### Code Quality
- **ESLint** - Code linting and style enforcement
- **TypeScript Compiler** - Type checking and compilation

### Development Experience
- **@replit/vite-plugin-runtime-error-modal** - Enhanced error overlay for Replit
- **@replit/vite-plugin-cartographer** - Replit-specific development features
- **Hot Module Replacement** - Instant updates during development

## Deployment & Infrastructure

### Hosting Platform
- **Replit** - Integrated development and deployment platform
- **Static Deployments** - Cost-effective hosting for frontend applications
- **Reserved VM** - Available for backend services if needed

### Build Process
- **Vite Build** - Optimized production builds with code splitting
- **TypeScript Compilation** - Server-side TypeScript compilation with esbuild
- **Asset Optimization** - Automatic optimization of images and other assets

### Environment Configuration
- **Replit Secrets** - Secure environment variable management
- **Environment Detection** - Automatic development/production environment switching

## Design System

### Color Palette
- **Cream Base** (`#FFFDF7`) - Warm, welcoming background
- **Sky Blue** (`#A3D5FF`) - Trust and innovation
- **Coral** (`#FF8C8C`) - Energy and creativity
- **Yellow** (`#FFE680`) - Optimism and achievement
- **Mint** (`#A8E6CF`) - Growth and collaboration

### Typography
- **Headings** - Fredoka/Baloo 2 for friendly, approachable headers
- **Body Text** - Inter/Nunito for excellent readability
- **Code** - Monospace fonts for technical content

### Component Standards
- **16px border radius** - Consistent rounded corners
- **4px grid system** - Consistent spacing and alignment
- **Soft shadows** - Subtle depth and elevation
- **Pill-shaped buttons** - Friendly, approachable interactions

## Package Management

### Core Dependencies
```json
{
  "react": "^18.3.1",
  "typescript": "5.6.3",
  "vite": "^5.4.19",
  "express": "^4.21.2",
  "drizzle-orm": "^0.39.1",
  "@tanstack/react-query": "^5.60.5",
  "wouter": "^3.3.5",
  "framer-motion": "^11.13.1",
  "tailwindcss": "^3.4.17"
}
```

### Development Dependencies
- Build tools, type definitions, and development utilities
- Replit-specific plugins for enhanced development experience

## Performance Optimizations

### Frontend
- **Code Splitting** - Automatic route-based code splitting
- **Tree Shaking** - Unused code elimination
- **Asset Optimization** - Image and resource optimization
- **Lazy Loading** - Component and route lazy loading

### Backend
- **Query Optimization** - Efficient database queries with Drizzle
- **Caching** - TanStack Query for client-side caching
- **Session Management** - Efficient session storage and retrieval

## Security Considerations

### Authentication
- Secure session management with PostgreSQL storage
- Passport.js for flexible authentication strategies
- Role-based access control (Participants, Judges, Organizers, Sponsors)

### Data Protection
- TypeScript for compile-time safety
- Zod for runtime validation
- Secure environment variable management via Replit Secrets

## Browser Compatibility

### Target Browsers
- **Modern Browsers** - Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile Support** - iOS Safari, Chrome Mobile, Samsung Internet
- **Responsive Design** - Mobile-first approach with Tailwind breakpoints

### Progressive Enhancement
- Graceful degradation for older browsers
- Accessible components with proper ARIA attributes
- Keyboard navigation support

## Monitoring & Analytics

### Development
- Real-time error reporting via Vite error overlay
- TypeScript compile-time error detection
- Hot module replacement for instant feedback

### Production (Planned)
- Error boundary implementation
- Performance monitoring
- User analytics and engagement tracking

---

This tech stack provides a modern, scalable, and maintainable foundation for the Maximally Hack platform, optimized for development and deployment on Replit.
