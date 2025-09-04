import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Landing from "@/pages/Landing";
import Explore from "@/pages/Explore";
import EventDetail from "@/pages/EventDetail";
import Projects from "@/pages/Projects";
import Judges from "@/pages/Judges";
import Leaderboards from "@/pages/Leaderboards";
import Sponsors from "@/pages/Sponsors";
import Login from "@/pages/auth/Login";
import Onboarding from "@/pages/auth/Onboarding";
import OrganizerDashboard from "@/pages/organizer/OrganizerDashboard";
import CreateEvent from "@/pages/organizer/CreateEvent";
import JudgeDashboard from "@/pages/judge/JudgeDashboard";
import Submit from "@/pages/Submit";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <Switch>
        <Route path="/" component={Landing} />
        <Route path="/explore" component={Explore} />
        <Route path="/e/:slug" component={EventDetail} />
        <Route path="/e/:slug/submit" component={Submit} />
        <Route path="/projects" component={Projects} />
        <Route path="/projects/:id" component={Projects} />
        <Route path="/profiles/:handle" component={Profile} />
        <Route path="/judges" component={Judges} />
        <Route path="/judges/:id" component={Judges} />
        <Route path="/leaders" component={Leaderboards} />
        <Route path="/sponsors" component={Sponsors} />
        <Route path="/login" component={Login} />
        <Route path="/onboarding" component={Onboarding} />
        <Route path="/organizer" component={OrganizerDashboard} />
        <Route path="/organizer/events/new" component={CreateEvent} />
        <Route path="/judge" component={JudgeDashboard} />
        <Route component={NotFound} />
      </Switch>
      <Footer />
    </div>
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
