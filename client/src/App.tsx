import { Switch, Route, useLocation, useParams } from "wouter";
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
import OrganizerDashboard from "@/pages/organizer/OrganizerDashboard";
import CreateEvent from "@/pages/organizer/CreateEvent";
import ManageEvent from "@/pages/organizer/ManageEvent";
import EditEvent from "@/pages/organizer/EditEvent";
import EditHackathon from "@/pages/organizer/EditHackathon";
import Help from "@/pages/Help";
import Submit from "@/pages/Submit";
import Profile from "@/pages/Profile";
import Dashboard from "@/pages/Dashboard";
import Organize from "@/pages/Organize";
import NotFound from "@/pages/not-found";

// Event Layout and Components
import EventLayout from "@/pages/event/_layout/EventLayout";
import EventOverview from "@/pages/event/Overview";
import EventTimeline from "@/pages/event/Timeline";
import EventPrizes from "@/pages/event/Prizes";
import EventRules from "@/pages/event/Rules";
import EventJudging from "@/pages/event/Judging";
import EventSubmissionsList from "@/pages/event/submissions/List";
import EventTeamsList from "@/pages/event/teams/List";
import EventPeopleHome from "@/pages/event/people/PeopleHome";
import EventHelp from "@/pages/event/Help";
import EventResources from "@/pages/event/Resources";
import EventSponsors from "@/pages/event/Sponsors";
import EventAbout from "@/pages/event/About";
import { HashRedirect } from "@/components/utils/HashRedirect";

function ScrollToTop() {
  const [location] = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  
  return null;
}


// Main Event Layout Wrapper
function EventLayoutWrapper() {
  const { slug } = useParams();
  const [location] = useLocation();
  
  if (!slug) return <NotFound />;
  
  // Determine which component to render based on the current path
  const getEventComponent = () => {
    const path = location.replace(`/e/${slug}`, '') || '/';
    
    switch (path) {
      case '/':
        return <EventOverview />;
      case '/timeline':
        return <EventTimeline />;
      case '/prizes':
        return <EventPrizes />;
      case '/rules':
        return <EventRules />;
      case '/judging':
        return <EventJudging />;
      case '/submissions':
        return <EventSubmissionsList />;
      case '/teams':
        return <EventTeamsList />;
      case '/people':
        return <EventPeopleHome />;
      case '/help':
        return <EventHelp />;
      case '/resources':
        return <EventResources />;
      case '/sponsors':
        return <EventSponsors />;
      case '/about':
        return <EventAbout />;
      default:
        return <NotFound />;
    }
  };
  
  return (
    <EventProvider slug={slug}>
      <EventLayout>
        {getEventComponent()}
      </EventLayout>
    </EventProvider>
  );
}

function Router() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-cream">
        <ScrollToTop />
        <HashRedirect />
        <Navbar />
        <Switch>
          {/* Event Routes */}
          <Route path="/e/:slug" component={EventLayoutWrapper} />
          <Route path="/e/:slug/timeline" component={EventLayoutWrapper} />
          <Route path="/e/:slug/prizes" component={EventLayoutWrapper} />
          <Route path="/e/:slug/rules" component={EventLayoutWrapper} />
          <Route path="/e/:slug/judging" component={EventLayoutWrapper} />
          <Route path="/e/:slug/submissions" component={EventLayoutWrapper} />
          <Route path="/e/:slug/teams" component={EventLayoutWrapper} />
          <Route path="/e/:slug/people" component={EventLayoutWrapper} />
          <Route path="/e/:slug/help" component={EventLayoutWrapper} />
          <Route path="/e/:slug/resources" component={EventLayoutWrapper} />
          <Route path="/e/:slug/sponsors" component={EventLayoutWrapper} />
          <Route path="/e/:slug/about" component={EventLayoutWrapper} />
          <Route path="/e/:slug/submit" component={Submit} />
          
          {/* Regular Routes */}
          <Route path="/" component={Landing} />
          <Route path="/explore" component={SimpleExplore} />
          <Route path="/organize" component={Organize} />
          <Route path="/profiles/:handle" component={Profile} />
          <Route path="/leaders" component={Leaderboards} />
          <Route path="/sponsors" component={Sponsors} />
          <Route path="/help" component={Help} />
          <Route path="/login" component={Login} />
          <Route path="/signup" component={Signup} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/onboarding" component={Onboarding} />
          <Route path="/organizer" component={OrganizerDashboard} />
          <Route path="/organizer/events/new" component={CreateEvent} />
          <Route path="/organizer/events/:id/overview" component={ManageEvent} />
          <Route path="/organizer/events/:id/edit" component={EditEvent} />
          <Route path="/organizer/events/:id/edit-hackathon" component={EditHackathon} />
          <Route component={NotFound} />
        </Switch>
        <Footer />
      </div>
    </AuthProvider>
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
