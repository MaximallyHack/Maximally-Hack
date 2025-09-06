import { BrowserRouter, Routes, Route, useLocation, useParams } from "react-router-dom";
import { useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import { EventProvider } from "@/contexts/EventContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Landing from "@/pages/Landing";
import SimpleExplore from "@/pages/SimpleExplore";
import Leaderboards from "@/pages/Leaderboards";
import Sponsors from "@/pages/Sponsors";
import Login from "@/pages/auth/Login";
import Signup from "@/pages/auth/Signup";
import Onboarding from "@/pages/auth/Onboarding";
import OrganizerSignin from "@/pages/auth/OrganizerSignin";
import OrganizerDashboard from "@/pages/organizer/OrganizerDashboard";
import CreateEvent from "@/pages/organizer/CreateEvent";
import ManageEvent from "@/pages/organizer/ManageEvent";
import EditEvent from "@/pages/organizer/EditEvent";
import EditHackathon from "@/pages/organizer/EditHackathon";
import EventContentEditor from "@/pages/organizer/EventContentEditor";
import JudgeManagement from "@/pages/organizer/JudgeManagement";
import Help from "@/pages/Help";
import Submit from "@/pages/Submit";
import Profile from "@/pages/Profile";
import Dashboard from "@/pages/Dashboard";
import Organize from "@/pages/Organize";
import NotFound from "@/pages/not-found";

// Team Components
import TeamsHome from "@/components/teams/TeamsHome";
import CreateTeam from "@/components/teams/CreateTeam";
import FindTeam from "@/components/teams/FindTeam";
import TeamMatch from "@/components/teams/TeamMatch";
import TeamsLFG from "@/components/teams/TeamsLFG";
import MyTeams from "@/components/teams/MyTeams";
import TeamInvites from "@/components/teams/TeamInvites";
import TeamRequests from "@/components/teams/TeamRequests";
import TeamDetail from "@/components/teams/TeamDetail";
import TeamManage from "@/components/teams/TeamManage";
import TeamApply from "@/components/teams/TeamApply";
import TeamChat from "@/components/teams/TeamChat";
import TeamSettings from "@/components/teams/TeamSettings";
import TeamRoles from "@/components/teams/TeamRoles";

// Event Layout and Components
import EventLayout from "@/pages/event/_layout/EventLayout";
import { lazy, Suspense } from "react";

// Lazy load event components for better performance
const EventOverview = lazy(() => import("@/pages/event/Overview"));
const EventTimeline = lazy(() => import("@/pages/event/Timeline"));
const EventPrizes = lazy(() => import("@/pages/event/Prizes"));
const EventRules = lazy(() => import("@/pages/event/Rules"));
const EventJudging = lazy(() => import("@/pages/event/Judging"));
const EventSubmissionsList = lazy(() => import("@/pages/event/submissions/List"));
const EventTeamsList = lazy(() => import("@/pages/event/teams/List"));
const EventPeopleHome = lazy(() => import("@/pages/event/people/PeopleHome"));
const EventHelp = lazy(() => import("@/pages/event/Help"));
const EventResources = lazy(() => import("@/pages/event/Resources"));
const EventSponsors = lazy(() => import("@/pages/event/Sponsors"));
const EventAbout = lazy(() => import("@/pages/event/About"));
import { HashRedirect } from "@/components/utils/HashRedirect";

function ScrollToTop() {
  const location = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  
  return null;
}


// Main Event Layout Wrapper
function EventLayoutWrapper() {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  
  if (!slug) return <NotFound />;
  
  return (
    <EventProvider slug={slug}>
      <EventLayout>
        <Routes>
          <Route index element={
            <Suspense fallback={<div className="flex items-center justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-coral"></div></div>}>
              <EventOverview />
            </Suspense>
          } />
          <Route path="timeline" element={
            <Suspense fallback={<div className="flex items-center justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-coral"></div></div>}>
              <EventTimeline />
            </Suspense>
          } />
          <Route path="prizes" element={
            <Suspense fallback={<div className="flex items-center justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-coral"></div></div>}>
              <EventPrizes />
            </Suspense>
          } />
          <Route path="rules" element={
            <Suspense fallback={<div className="flex items-center justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-coral"></div></div>}>
              <EventRules />
            </Suspense>
          } />
          <Route path="judging" element={
            <Suspense fallback={<div className="flex items-center justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-coral"></div></div>}>
              <EventJudging />
            </Suspense>
          } />
          <Route path="submissions" element={
            <Suspense fallback={<div className="flex items-center justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-coral"></div></div>}>
              <EventSubmissionsList />
            </Suspense>
          } />
          <Route path="teams" element={
            <Suspense fallback={<div className="flex items-center justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-coral"></div></div>}>
              <EventTeamsList />
            </Suspense>
          } />
          <Route path="people" element={
            <Suspense fallback={<div className="flex items-center justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-coral"></div></div>}>
              <EventPeopleHome />
            </Suspense>
          } />
          <Route path="help" element={
            <Suspense fallback={<div className="flex items-center justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-coral"></div></div>}>
              <EventHelp />
            </Suspense>
          } />
          <Route path="resources" element={
            <Suspense fallback={<div className="flex items-center justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-coral"></div></div>}>
              <EventResources />
            </Suspense>
          } />
          <Route path="sponsors" element={
            <Suspense fallback={<div className="flex items-center justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-coral"></div></div>}>
              <EventSponsors />
            </Suspense>
          } />
          <Route path="about" element={
            <Suspense fallback={<div className="flex items-center justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-coral"></div></div>}>
              <EventAbout />
            </Suspense>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </EventLayout>
    </EventProvider>
  );
}

function Router() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-cream">
          <ScrollToTop />
          <HashRedirect />
          <Navbar />
          <Routes>
            {/* Team Routes */}
            <Route path="/teams" element={<TeamsHome />} />
            <Route path="/teams/create" element={<CreateTeam />} />
            <Route path="/teams/find" element={<FindTeam />} />
            <Route path="/teams/match" element={<TeamMatch />} />
            <Route path="/teams/lfg" element={<TeamsLFG />} />
            <Route path="/teams/my" element={<MyTeams />} />
            <Route path="/teams/invites" element={<TeamInvites />} />
            <Route path="/teams/requests" element={<TeamRequests />} />
            <Route path="/teams/:id" element={<TeamDetail />} />
            <Route path="/teams/:id/manage" element={<TeamManage />} />
            <Route path="/teams/:id/apply" element={<TeamApply />} />
            <Route path="/teams/:id/chat" element={<TeamChat />} />
            <Route path="/teams/:id/settings" element={<TeamSettings />} />
            <Route path="/teams/:id/roles" element={<TeamRoles />} />
            
            {/* Event Routes */}
            <Route path="/e/:slug/*" element={<EventLayoutWrapper />} />
            <Route path="/e/:slug/submit" element={<Submit />} />
            
            {/* Regular Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/explore" element={<SimpleExplore />} />
            <Route path="/organize" element={<Organize />} />
            <Route path="/profiles/:handle" element={<Profile />} />
            <Route path="/leaders" element={<Leaderboards />} />
            <Route path="/sponsors" element={<Sponsors />} />
            <Route path="/help" element={<Help />} />
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/signup" element={<Signup />} />
            <Route path="/auth/organizer" element={<OrganizerSignin />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/organizer" element={<OrganizerDashboard />} />
            <Route path="/organizer/dashboard" element={<OrganizerDashboard />} />
            <Route path="/organizer/events/new" element={<CreateEvent />} />
            <Route path="/organizer/events/:id/overview" element={<ManageEvent />} />
            <Route path="/organizer/events/:id/edit" element={<EditEvent />} />
            <Route path="/organizer/events/:id/content" element={<EventContentEditor />} />
            <Route path="/organizer/events/:id/judges" element={<JudgeManagement />} />
            <Route path="/organizer/events/:id/edit-hackathon" element={<EditHackathon />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
