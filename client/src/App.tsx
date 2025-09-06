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
import ProjectsGallery from "@/pages/ProjectsGallery";
import ProjectDetail from "@/pages/ProjectDetail";
import PublishProject from "@/pages/PublishProject";
import JuryBoard from "@/pages/Judges";
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
import JudgeDashboard from "@/pages/judge/JudgeDashboard";
import JudgeRegister from "@/pages/judge/JudgeRegister";
import UploadProject from "@/pages/UploadProject";
import Help from "@/pages/Help";
import Submit from "@/pages/Submit";
import Profile from "@/pages/Profile";
import Dashboard from "@/pages/Dashboard";
import CreateProject from "@/pages/CreateProject";
import EditProject from "@/pages/EditProject";
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
  
  if (!slug) return <NotFound />;
  
  return (
    <EventProvider slug={slug}>
      <EventLayout>
        <Switch>
          <Route path="/e/:slug" component={EventOverview} />
          <Route path="/e/:slug/timeline" component={EventTimeline} />
          <Route path="/e/:slug/prizes" component={EventPrizes} />
          <Route path="/e/:slug/rules" component={EventRules} />
          <Route path="/e/:slug/judging" component={EventJudging} />
          <Route path="/e/:slug/submissions" component={EventSubmissionsList} />
          <Route path="/e/:slug/teams" component={EventTeamsList} />
          <Route path="/e/:slug/people" component={EventPeopleHome} />
          <Route path="/e/:slug/help" component={EventHelp} />
          <Route path="/e/:slug/resources" component={EventResources} />
          <Route path="/e/:slug/sponsors" component={EventSponsors} />
          <Route path="/e/:slug/about" component={EventAbout} />
          <Route component={NotFound} />
        </Switch>
      </EventLayout>
    </EventProvider>
  );
}

function Router() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-cream">
        <ScrollToTop />
        <Switch>
          {/* Event Routes - No Navbar/Footer */}
          <Route path="/e/:slug*" component={EventLayoutWrapper} />
          
          {/* Regular Routes - With Navbar/Footer */}
          <Route>
            <Navbar />
            <Switch>
              <Route path="/" component={Landing} />
              <Route path="/explore" component={SimpleExplore} />
              <Route path="/projects" component={ProjectsGallery} />
              <Route path="/projects/:id" component={ProjectDetail} />
              <Route path="/publish" component={PublishProject} />
              <Route path="/upload" component={UploadProject} />
              <Route path="/profiles/:handle" component={Profile} />
              <Route path="/judges" component={JuryBoard} />
              <Route path="/judges/:id" component={JuryBoard} />
              <Route path="/judge-register" component={JudgeRegister} />
              <Route path="/leaders" component={Leaderboards} />
              <Route path="/sponsors" component={Sponsors} />
              <Route path="/help" component={Help} />
              <Route path="/login" component={Login} />
              <Route path="/signup" component={Signup} />
              <Route path="/dashboard" component={Dashboard} />
              <Route path="/projects/create" component={CreateProject} />
              <Route path="/projects/:id/edit" component={EditProject} />
              <Route path="/onboarding" component={Onboarding} />
              <Route path="/organizer" component={OrganizerDashboard} />
              <Route path="/organizer/events/new" component={CreateEvent} />
              <Route path="/organizer/events/:id/overview" component={ManageEvent} />
              <Route path="/organizer/events/:id/edit" component={EditEvent} />
              <Route path="/organizer/events/:id/edit-hackathon" component={EditHackathon} />
              <Route path="/judge" component={JudgeDashboard} />
              <Route path="/e/:slug/submit" component={Submit} />
              <Route component={NotFound} />
            </Switch>
            <Footer />
          </Route>
        </Switch>
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
