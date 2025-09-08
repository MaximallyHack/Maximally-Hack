import { useState } from "react";
import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { supabaseApi } from "@/lib/supabaseApi";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { 
  Calendar,
  Users,
  FileText,
  Shield,
  ExternalLink,
  Copy,
  Settings,
  Plus,
  Edit,
  MessageSquare,
  Upload,
  Clock,
  AlertTriangle,
  CheckCircle,
  Eye,
  Target,
  TrendingUp
} from "lucide-react";
import { api } from "@/lib/api";

export default function ManageEvent() {
  const { id } = useParams();
  const { toast } = useToast();

  const { data: event, isLoading } = useQuery({
    queryKey: ['event', id],
    queryFn: async () => {
      if (!id) return null;
      return await supabaseApi.getEvent(id);
    },
    enabled: !!id
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream py-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-cream py-8 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-text-dark mb-2">Event not found</h1>
          <p className="text-text-muted">The event you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const copyLink = () => {
    navigator.clipboard.writeText(`https://maximallyhack.com/e/${event.slug}`);
    toast({
      title: "Link copied! 📋",
      description: "Event link has been copied to your clipboard.",
    });
  };

  const getPhaseProgress = () => {
    const now = new Date();
    const start = new Date(event.startDate);
    const end = new Date(event.endDate);
    const total = end.getTime() - start.getTime();
    const current = now.getTime() - start.getTime();
    return Math.max(0, Math.min(100, (current / total) * 100));
  };

  const getTimeLeft = () => {
    const now = new Date();
    const deadline = new Date(event.endDate); // Use event end date as deadline
    const diff = deadline.getTime() - now.getTime();
    if (diff <= 0) return "Event ended";
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'registration_open': return 'success';
      case 'upcoming': return 'yellow';
      case 'completed': return 'sky';
      default: return 'mint';
    }
  };

  const healthChecks = [
    { title: "Event description", status: "complete", icon: CheckCircle },
    { title: "Judges assigned", status: "warning", icon: AlertTriangle, issue: "Need 2 more judges" },
    { title: "Prizes configured", status: "complete", icon: CheckCircle },
    { title: "Timeline published", status: "complete", icon: CheckCircle },
    { title: "Submission guidelines", status: "warning", icon: AlertTriangle, issue: "Missing tech requirements" }
  ];

  return (
    <div className="min-h-screen bg-cream py-8" data-testid="manage-event-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Bar */}
        <div className="bg-white rounded-2xl p-6 shadow-soft border border-soft-gray mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="font-heading font-bold text-3xl text-text-dark">{event.title}</h1>
                <p className="text-text-muted">Event control center</p>
              </div>
              <Badge className={`bg-${getStatusColor(event.status)}/20 text-${getStatusColor(event.status)} px-3 py-2 rounded-full text-sm border-0`}>
                {event.status}
              </Badge>
            </div>
            
            <div className="flex items-center gap-3">
              <Link href={`/e/${event.slug}`}>
                <Button variant="outline" className="border-sky text-sky hover:bg-sky/10" data-testid="button-view-public">
                  <Eye className="w-4 h-4 mr-2" />
                  View Public
                </Button>
              </Link>
              
              <Button
                variant="outline"
                onClick={copyLink}
                className="border-mint text-mint hover:bg-mint/10"
                data-testid="button-copy-link"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Link
              </Button>
              
              <Link href={`/organizer/events/${event.id}/edit`}>
                <Button className="bg-coral text-white hover:bg-coral/80" data-testid="button-edit">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Event
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Four Panels Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Status Timeline Panel */}
          <Card className="bg-white rounded-2xl p-6 shadow-soft border border-soft-gray">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-sky/10 rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5 text-sky" />
              </div>
              <div>
                <h3 className="font-heading font-semibold text-lg text-text-dark">Status Timeline</h3>
                <p className="text-text-muted text-sm">Current phase and progress</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-text-dark font-medium">Current: {event.status}</span>
                <span className="text-text-muted text-sm">{getPhaseProgress().toFixed(0)}% complete</span>
              </div>
              
              <Progress value={getPhaseProgress()} className="h-2" />
              
              <div className="bg-soft-gray/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-coral" />
                  <span className="font-medium text-text-dark">Event ends</span>
                </div>
                <p className="text-text-muted text-sm">
                  {new Date(event.endDate).toLocaleString()}
                </p>
                <p className="text-coral font-medium text-sm mt-1">
                  Time left: {getTimeLeft()}
                </p>
              </div>
            </div>
          </Card>

          {/* Numbers Panel */}
          <Card className="bg-white rounded-2xl p-6 shadow-soft border border-soft-gray">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-mint/10 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-mint" />
              </div>
              <div>
                <h3 className="font-heading font-semibold text-lg text-text-dark">Event Metrics</h3>
                <p className="text-text-muted text-sm">Current participation numbers</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-sky/10 rounded-lg">
                <div className="text-2xl font-bold text-sky">{event.participantCount || 0}</div>
                <div className="text-text-muted text-sm">Participants</div>
              </div>
              <div className="text-center p-4 bg-coral/10 rounded-lg">
                <div className="text-2xl font-bold text-coral">0</div>
                <div className="text-text-muted text-sm">Teams</div>
              </div>
              <div className="text-center p-4 bg-mint/10 rounded-lg">
                <div className="text-2xl font-bold text-mint">0</div>
                <div className="text-text-muted text-sm">Submissions</div>
              </div>
              <div className="text-center p-4 bg-yellow/10 rounded-lg">
                <div className="text-2xl font-bold text-yellow">{event.judges?.length || 0}</div>
                <div className="text-text-muted text-sm">Judges</div>
              </div>
            </div>
          </Card>

          {/* Quick Tasks Panel */}
          <Card className="bg-white rounded-2xl p-6 shadow-soft border border-soft-gray">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-coral/10 rounded-xl flex items-center justify-center">
                <Target className="w-5 h-5 text-coral" />
              </div>
              <div>
                <h3 className="font-heading font-semibold text-lg text-text-dark">Quick Tasks</h3>
                <p className="text-text-muted text-sm">Common management actions</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <Link href={`/organizer/events/${event.id}/judges`}>
                <Button 
                  variant="outline" 
                  className="w-full h-16 border-sky text-sky hover:bg-sky/10 rounded-xl flex-col gap-1"
                  data-testid="quick-add-judge"
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-xs">Add Judge</span>
                </Button>
              </Link>
              
              <Link href={`/e/${event.slug}/timeline`}>
                <Button 
                  variant="outline" 
                  className="w-full h-16 border-mint text-mint hover:bg-mint/10 rounded-xl flex-col gap-1"
                  data-testid="quick-view-timeline"
                >
                  <Eye className="w-4 h-4" />
                  <span className="text-xs">View Timeline</span>
                </Button>
              </Link>
              
              <Link href={`/e/${event.slug}/submissions`}>
                <Button 
                  variant="outline" 
                  className="w-full h-16 border-coral text-coral hover:bg-coral/10 rounded-xl flex-col gap-1"
                  data-testid="quick-view-submissions"
                >
                  <FileText className="w-4 h-4" />
                  <span className="text-xs">View Submissions</span>
                </Button>
              </Link>
              
              <Link href={`/e/${event.slug}/teams`}>
                <Button 
                  variant="outline" 
                  className="w-full h-16 border-yellow text-text-dark hover:bg-yellow/10 rounded-xl flex-col gap-1"
                  data-testid="quick-view-teams"
                >
                  <Users className="w-4 h-4" />
                  <span className="text-xs">View Teams</span>
                </Button>
              </Link>
            </div>
          </Card>

          {/* Health Panel */}
          <Card className="bg-white rounded-2xl p-6 shadow-soft border border-soft-gray">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-yellow/10 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-yellow" />
              </div>
              <div>
                <h3 className="font-heading font-semibold text-lg text-text-dark">Event Health</h3>
                <p className="text-text-muted text-sm">Status checks and issues</p>
              </div>
            </div>
            
            <div className="space-y-3">
              {healthChecks.map((check, index) => {
                const IconComponent = check.icon;
                const isComplete = check.status === 'complete';
                
                return (
                  <div key={index} className={`flex items-center gap-3 p-3 rounded-lg ${
                    isComplete ? 'bg-success/10' : 'bg-yellow/10'
                  }`}>
                    <IconComponent className={`w-4 h-4 ${
                      isComplete ? 'text-success' : 'text-yellow'
                    }`} />
                    <div className="flex-1">
                      <div className="font-medium text-text-dark text-sm">{check.title}</div>
                      {check.issue && (
                        <div className="text-yellow text-xs">{check.issue}</div>
                      )}
                    </div>
                    {!isComplete && (
                      <Button size="sm" variant="ghost" className="text-yellow hover:bg-yellow/20">
                        Fix
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}