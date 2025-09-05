import { Switch, Route, useLocation } from "wouter";
import { useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Landing from "@/pages/Landing";
import SimpleExplore from "@/pages/SimpleExplore";
import SimpleEventDetail from "@/pages/SimpleEventDetail";
import NewEnhancedEventDetail from "@/pages/NewEnhancedEventDetail";
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

function ScrollToTop() {
  const [location] = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  
  return null;
}

function Router() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-cream">
        <ScrollToTop />
        <Navbar />
        <Switch>
        <Route path="/" component={Landing} />
        <Route path="/explore" component={SimpleExplore} />
        <Route path="/e/:slug" component={NewEnhancedEventDetail} />
        <Route path="/e/:slug/submit" component={Submit} />
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
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
