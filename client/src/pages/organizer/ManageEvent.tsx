import { useState } from "react";
import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
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

  // Mock event data
  const mockEvent = {
    id: "ai-for-good-2024",
    title: "AI for Good Challenge",
    status: "active",
    phase: "submissions",
    nextPhase: "judging",
    nextPhaseDate: "2024-12-17T16:00:00Z",
    registrations: 1250,
    teams: 312,
    submissions: 45,
    judges: 8,
    startDate: "2024-12-15T10:00:00Z",
    endDate: "2024-12-17T18:00:00Z",
    submissionDeadline: "2024-12-17T16:00:00Z"
  };

  const copyLink = () => {
    navigator.clipboard.writeText(`https://maximallyhack.com/e/${mockEvent.id}`);
    toast({
      title: "Link copied! 📋",
      description: "Event link has been copied to your clipboard.",
    });
  };

  const getPhaseProgress = () => {
    const now = new Date();
    const start = new Date(mockEvent.startDate);
    const end = new Date(mockEvent.endDate);
    const total = end.getTime() - start.getTime();
    const current = now.getTime() - start.getTime();
    return Math.max(0, Math.min(100, (current / total) * 100));
  };

  const getTimeLeft = () => {
    const now = new Date();
    const deadline = new Date(mockEvent.submissionDeadline);
    const diff = deadline.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
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
                <h1 className="font-heading font-bold text-3xl text-text-dark">{mockEvent.title}</h1>
                <p className="text-text-muted">Event control center</p>
              </div>
              <Badge className={`bg-${getStatusColor(mockEvent.status)}/20 text-${getStatusColor(mockEvent.status)} px-3 py-2 rounded-full text-sm border-0`}>
                {mockEvent.status}
              </Badge>
            </div>
            
            <div className="flex items-center gap-3">
              <Link href={`/e/${mockEvent.id}`}>
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
              
              <Button className="bg-coral text-white hover:bg-coral/80" data-testid="button-settings">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
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
                <span className="text-text-dark font-medium">Current: {mockEvent.phase}</span>
                <span className="text-text-muted text-sm">{getPhaseProgress().toFixed(0)}% complete</span>
              </div>
              
              <Progress value={getPhaseProgress()} className="h-2" />
              
              <div className="bg-soft-gray/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-coral" />
                  <span className="font-medium text-text-dark">Next: {mockEvent.nextPhase}</span>
                </div>
                <p className="text-text-muted text-sm">
                  Starting {new Date(mockEvent.nextPhaseDate).toLocaleString()}
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
                <div className="text-2xl font-bold text-sky">{mockEvent.registrations}</div>
                <div className="text-text-muted text-sm">Registrations</div>
              </div>
              <div className="text-center p-4 bg-coral/10 rounded-lg">
                <div className="text-2xl font-bold text-coral">{mockEvent.teams}</div>
                <div className="text-text-muted text-sm">Teams</div>
              </div>
              <div className="text-center p-4 bg-mint/10 rounded-lg">
                <div className="text-2xl font-bold text-mint">{mockEvent.submissions}</div>
                <div className="text-text-muted text-sm">Submissions</div>
              </div>
              <div className="text-center p-4 bg-yellow/10 rounded-lg">
                <div className="text-2xl font-bold text-yellow">{mockEvent.judges}</div>
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
              <Button 
                variant="outline" 
                className="h-16 border-sky text-sky hover:bg-sky/10 rounded-xl flex-col gap-1"
                data-testid="quick-add-judge"
              >
                <Plus className="w-4 h-4" />
                <span className="text-xs">Add Judge</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-16 border-mint text-mint hover:bg-mint/10 rounded-xl flex-col gap-1"
                data-testid="quick-edit-timeline"
              >
                <Edit className="w-4 h-4" />
                <span className="text-xs">Edit Timeline</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-16 border-coral text-coral hover:bg-coral/10 rounded-xl flex-col gap-1"
                data-testid="quick-post-update"
              >
                <MessageSquare className="w-4 h-4" />
                <span className="text-xs">Post Update</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-16 border-yellow text-text-dark hover:bg-yellow/10 rounded-xl flex-col gap-1"
                data-testid="quick-open-submissions"
              >
                <Upload className="w-4 h-4" />
                <span className="text-xs">Open Submissions</span>
              </Button>
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