
# HackSpace

A frontend-only hackathon platform designed with a playful minimal aesthetic using pastel crayon colors. HackSpace provides a complete hackathon ecosystem including event discovery, team formation, project submission, judging interfaces, and community features.

## ✨ Features

- **Event Discovery**: Browse and filter hackathons by interests and skills
- **Team Formation**: Connect with other participants and form teams
- **Project Submission**: Submit projects with demos, code, and documentation
- **Judging System**: Comprehensive scoring system with feedback
- **Real-time Updates**: Live project tracking and status updates
- **Sponsor Integration**: Showcase sponsors and prize tracks
- **Community Features**: User profiles, leaderboards, and testimonials

## 🎨 Design Philosophy

HackSpace features a friendly, approachable design with:
- **Colors**: Cream base (#FFFDF7), sky blue (#A3D5FF), coral (#FF8C8C), yellow (#FFE680), mint (#A8E6CF)
- **Typography**: Fredoka/Baloo 2 for headings, Inter/Nunito for body text
- **Components**: 16px radius cards, pill-shaped buttons, soft shadows
- **Animations**: Floating elements and smooth hover effects

## 🚀 Tech Stack

### Frontend
- **React 18** with TypeScript for type safety
- **Wouter** for lightweight client-side routing
- **TanStack Query** for server state management and caching
- **Shadcn/ui** components built on Radix UI primitives
- **Tailwind CSS** with custom design system
- **Framer Motion** for animations
- **Vite** for fast development and optimized builds

### Backend (Express Server)
- **Express.js** for API endpoints
- **TypeScript** for type safety
- **Drizzle ORM** with PostgreSQL integration
- **Session management** with authentication

## 📁 Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── lib/            # Utilities and fixtures
│   │   └── hooks/          # Custom React hooks
├── server/                 # Backend Express server
├── shared/                 # Shared types and schemas
└── ...
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 20 or higher
- npm or yarn

### Installation

1. **Fork this Repl** or create a new Repl using this template

2. **Install dependencies** (automatically handled by Replit):
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser** to see the application running at the provided URL

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run check` - Run TypeScript type checking
- `npm run db:push` - Push database schema changes

## 📱 Key Pages

- **Landing** - Welcome page with platform overview
- **Explore** - Browse available hackathons
- **Event Detail** - Individual hackathon information
- **Submit** - Project submission interface
- **Projects** - Browse submitted projects
- **Judge Dashboard** - Scoring and evaluation interface
- **Profile** - User profiles and achievements
- **Leaderboards** - Competition rankings

## 🎯 User Roles

### Participants
- Discover hackathons
- Form teams
- Submit projects
- Track progress

### Judges
- Review submissions
- Score projects across multiple criteria
- Provide feedback
- Access judging dashboard

### Organizers
- Create and manage events
- Configure prize tracks
- Monitor submissions
- Manage event timeline

### Sponsors
- Showcase brand presence
- Create sponsored prize tracks
- View engagement metrics

## 🏗️ Development

### Adding New Features

1. **Components**: Add reusable components in `client/src/components/`
2. **Pages**: Create new pages in `client/src/pages/`
3. **API Routes**: Add backend routes in `server/routes.ts`
4. **Database**: Update schema in `shared/schema.ts`

### Styling Guidelines

- Use Tailwind utility classes
- Follow the established color palette
- Maintain consistent spacing (4px grid)
- Use provided UI components from `components/ui/`

### State Management

- Use TanStack Query for server state
- Local state with React useState/useReducer
- Form state with React Hook Form

## 🚢 Deployment

This project is configured for Replit deployment:

1. **Click Deploy** in your Repl
2. **Configure domain** (optional)
3. **Set environment variables** if needed

The build process will automatically:
- Build the React frontend
- Prepare the Express server
- Optimize assets for production

## 🤝 Contributing

1. Fork the project
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙋‍♀️ Support

Need help? Check out:
- [Replit Docs](https://docs.replit.com/)
- Create an issue in this repository
- Join the Replit community Discord

---

**Built with ❤️ on Replit**

*Ready to hack? Start exploring and building amazing projects!* 🎉
