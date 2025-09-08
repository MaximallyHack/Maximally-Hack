import { Router, Route, Switch, useLocation } from "wouter";
import { useEffect, lazy, Suspense } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import { EventProvider } from "@/contexts/EventContext";
import { SupabaseAuthProvider } from "@/contexts/SupabaseAuthContext";

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
import CreateEventPage from "@/pages/CreateEventPage";

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
import { HashRedirect } from "@/components/utils/HashRedirect";

const JudgeDashboard = lazy(() => import("@/pages/judge/JudgeDashboard"));
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

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  return null;
}

function Loader() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-coral"></div>
    </div>
  );
}

function EventLayoutWrapper({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const [location] = useLocation();
  if (!slug) return <NotFound />;

  const getEventContent = () => {
    const path = location.replace(`/e/${slug}`, "") || "/";
    switch (path) {
      case "/":
        return <Suspense fallback={<Loader />}><EventOverview /></Suspense>;
      case "/timeline":
        return <Suspense fallback={<Loader />}><EventTimeline /></Suspense>;
      case "/prizes":
        return <Suspense fallback={<Loader />}><EventPrizes /></Suspense>;
      case "/rules":
        return <Suspense fallback={<Loader />}><EventRules /></Suspense>;
      case "/judging":
        return <Suspense fallback={<Loader />}><EventJudging /></Suspense>;
      case "/submissions":
        return <Suspense fallback={<Loader />}><EventSubmissionsList /></Suspense>;
      case "/teams":
        return <Suspense fallback={<Loader />}><EventTeamsList /></Suspense>;
      case "/people":
        return <Suspense fallback={<Loader />}><EventPeopleHome /></Suspense>;
      case "/help":
        return <Suspense fallback={<Loader />}><EventHelp /></Suspense>;
      case "/resources":
        return <Suspense fallback={<Loader />}><EventResources /></Suspense>;
      case "/sponsors":
        return <Suspense fallback={<Loader />}><EventSponsors /></Suspense>;
      case "/about":
        return <Suspense fallback={<Loader />}><EventAbout /></Suspense>;
      default:
        return <NotFound />;
    }
  };

  return (
    <EventProvider slug={slug}>
      <EventLayout>{getEventContent()}</EventLayout>
    </EventProvider>
  );
}

function AppRouter() {
  return (
    <Router>
      <SupabaseAuthProvider>
        <div className="min-h-screen bg-background">
          <ScrollToTop />
          <HashRedirect />
          <Navbar />
          <Switch>
            {/* Team Routes */}
            <Route path="/teams" component={TeamsHome} />
            <Route path="/teams/create" component={CreateTeam} />
            <Route path="/teams/find" component={FindTeam} />
            <Route path="/teams/match" component={TeamMatch} />
            <Route path="/teams/lfg" component={TeamsLFG} />
            <Route path="/teams/my" component={MyTeams} />
            <Route path="/teams/invites" component={TeamInvites} />
            <Route path="/teams/requests" component={TeamRequests} />
            <Route path="/teams/:id" component={TeamDetail} />
            <Route path="/teams/:id/manage" component={TeamManage} />
            <Route path="/teams/:id/apply" component={TeamApply} />
            <Route path="/teams/:id/chat" component={TeamChat} />
            <Route path="/teams/:id/settings" component={TeamSettings} />
            <Route path="/teams/:id/roles" component={TeamRoles} />

            {/* Event Routes */}
            <Route path="/e/:slug" component={EventLayoutWrapper} />
            <Route path="/e/:slug/*" component={EventLayoutWrapper} />
            <Route path="/e/:slug/submit" component={Submit} />

            {/* Regular Routes */}
            <Route path="/" component={Landing} />
            <Route path="/explore" component={SimpleExplore} />
            <Route path="/organize" component={Organize} />
            <Route path="/create-event" component={CreateEventPage} />
            <Route path="/profile/:handle" component={Profile} />
            <Route path="/leaders" component={Leaderboards} />
            <Route path="/sponsors" component={Sponsors} />
            <Route path="/help" component={Help} />
            <Route path="/auth/login" component={Login} />
            <Route path="/auth/signup" component={Signup} />
            <Route path="/auth/organizer" component={OrganizerSignin} />
            <Route path="/login" component={Login} />
            <Route path="/signup" component={Signup} />
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/onboarding" component={Onboarding} />
            <Route path="/organizer" component={OrganizerDashboard} />
            <Route path="/organizer/dashboard" component={OrganizerDashboard} />
            <Route path="/organizer/events/new" component={CreateEvent} />
            <Route path="/organizer/events/:id/overview" component={ManageEvent} />
            <Route path="/organizer/events/:id/edit" component={EditEvent} />
            <Route path="/organizer/events/:id/content" component={EventContentEditor} />
            <Route path="/organizer/events/:id/judges" component={JudgeManagement} />
            <Route path="/organizer/events/:id/edit-hackathon" component={EditHackathon} />
            <Route path="/judge" component={JudgeDashboard} />
            <Route path="/judge/dashboard" component={JudgeDashboard} />
            <Route component={NotFound} />
          </Switch>
          <Footer />
        </div>
      </SupabaseAuthProvider>
    </Router>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <AppRouter />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
