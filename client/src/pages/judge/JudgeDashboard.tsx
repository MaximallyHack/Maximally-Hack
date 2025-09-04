import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CrayonSquiggle } from "@/components/ui/floating-elements";
import ScorePanel from "@/components/judge/ScorePanel";
import { 
  Star,
  Clock, 
  CheckCircle,
  AlertCircle,
  Eye,
  Edit,
  ExternalLink,
  Github,
  Trophy,
  Users,
  Calendar,
  Filter
} from "lucide-react";
import { api } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

// Mock judge assignment data
const mockAssignedEvents = [
  {
    id: "ai-for-good-2024",
    title: "AI for Good Challenge",
    status: "active",
    assignedSubmissions: 8,
    scoredSubmissions: 3,
    deadline: "2024-12-18T23:59:59Z"
  },
  {
    id: "web3-builder-fest-2024",
    title: "Web3 Builder Fest", 
    status: "upcoming",
    assignedSubmissions: 6,
    scoredSubmissions: 0,
    deadline: "2024-12-24T23:59:59Z"
  },
  {
    id: "climate-tech-sprint-2024",
    title: "Climate Tech Sprint",
    status: "completed", 
    assignedSubmissions: 5,
    scoredSubmissions: 5,
    deadline: "2024-11-28T23:59:59Z"
  }
];

export default function JudgeDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedSubmission, setSelectedSubmission] = useState<string | null>(null);

  const { data: assignedEvents, isLoading: eventsLoading } = useQuery({
    queryKey: ['judge-events'],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockAssignedEvents;
    },
  });

  const { data: submissions, isLoading: submissionsLoading } = useQuery({
    queryKey: ['judge-submissions', statusFilter],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 300));
      let allSubmissions = await api.getFeaturedProjects();
      
      // Mock scoring status for judge view
      const submissionsWithStatus = allSubmissions.slice(0, 8).map((submission, index) => ({
        ...submission,
        scoringStatus: index < 3 ? 'scored' : index < 6 ? 'in_progress' : 'not_started',
        assignedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        dueDate: "2024-12-18T23:59:59Z"
      }));

      if (statusFilter !== 'all') {
        return submissionsWithStatus.filter(s => s.scoringStatus === statusFilter);
      }
      
      return submissionsWithStatus;
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'upcoming': return 'yellow'; 
      case 'completed': return 'sky';
      case 'scored': return 'success';
      case 'in_progress': return 'yellow';
      case 'not_started': return 'coral';
      default: return 'mint';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'scored': return 'Scored';
      case 'in_progress': return 'In Progress';
      case 'not_started': return 'Not Started';
      default: return status;
    }
  };

  const getProgressPercent = (scored: number, total: number) => {
    return total > 0 ? Math.round((scored / total) * 100) : 0;
  };

  const formatTimeLeft = (deadline: string) => {
    const now = new Date();
    const end = new Date(deadline);
    const diff = end.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h left`;
    if (hours > 0) return `${hours}h left`;
    if (diff > 0) return 'Due soon';
    return 'Overdue';
  };

  const totalAssigned = assignedEvents?.reduce((sum, event) => sum + event.assignedSubmissions, 0) || 0;
  const totalScored = assignedEvents?.reduce((sum, event) => sum + event.scoredSubmissions, 0) || 0;

  if (selectedSubmission) {
    return <ScorePanel submissionId={selectedSubmission} onBack={() => setSelectedSubmission(null)} />;
  }

  return (
    <div className="min-h-screen bg-cream py-8" data-testid="judge-dashboard">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="font-heading font-bold text-4xl text-text-dark mb-2">Judge Dashboard</h1>
            <p className="text-text-muted">Review and score assigned hackathon submissions</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="border-sky text-sky hover:bg-sky/10 rounded-full px-6" data-testid="button-judge-guidelines">
              <Star className="w-4 h-4 mr-2" />
              Judging Guidelines
            </Button>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white rounded-2xl p-6 shadow-soft border border-soft-gray">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm">Total Assigned</p>
                <p className="text-3xl font-bold text-coral">{totalAssigned}</p>
              </div>
              <Users className="w-8 h-8 text-coral" />
            </div>
            <div className="mt-2">
              <p className="text-text-muted text-sm">Projects to review</p>
            </div>
          </Card>

          <Card className="bg-white rounded-2xl p-6 shadow-soft border border-soft-gray">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm">Scored</p>
                <p className="text-3xl font-bold text-success">{totalScored}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
            <div className="mt-2">
              <Progress value={getProgressPercent(totalScored, totalAssigned)} className="h-2" />
            </div>
          </Card>

          <Card className="bg-white rounded-2xl p-6 shadow-soft border border-soft-gray">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm">Remaining</p>
                <p className="text-3xl font-bold text-yellow">{totalAssigned - totalScored}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow" />
            </div>
            <div className="mt-2">
              <p className="text-text-muted text-sm">To complete</p>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white rounded-xl border border-soft-gray p-1 mb-8">
            <TabsTrigger value="overview" className="rounded-lg" data-testid="tab-overview">Overview</TabsTrigger>
            <TabsTrigger value="events" className="rounded-lg" data-testid="tab-events">My Events</TabsTrigger>
            <TabsTrigger value="submissions" className="rounded-lg" data-testid="tab-submissions">All Submissions</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Active Events */}
              <Card className="bg-white rounded-2xl p-6 shadow-soft border border-soft-gray">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-heading font-semibold text-xl text-text-dark">Active Events</h3>
                  <Badge className="bg-success/20 text-success px-2 py-1 rounded-full text-xs border-0">
                    {assignedEvents?.filter(e => e.status === 'active').length || 0} Active
                  </Badge>
                </div>
                
                <div className="space-y-4">
                  {assignedEvents?.filter(e => e.status === 'active').map((event) => (
                    <div key={event.id} className="p-4 rounded-xl bg-soft-gray/30 hover:bg-soft-gray/50 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-text-dark">{event.title}</h4>
                        <Badge className="bg-success/20 text-success px-2 py-1 rounded-full text-xs border-0">
                          Active
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm text-text-muted">
                        <span>{event.scoredSubmissions}/{event.assignedSubmissions} scored</span>
                        <span>{formatTimeLeft(event.deadline)}</span>
                      </div>
                      <Progress value={getProgressPercent(event.scoredSubmissions, event.assignedSubmissions)} className="h-2 mt-2" />
                    </div>
                  ))}
                </div>
              </Card>

              {/* Recent Activity */}
              <Card className="bg-white rounded-2xl p-6 shadow-soft border border-soft-gray">
                <h3 className="font-heading font-semibold text-xl text-text-dark mb-6">Recent Scoring</h3>
                
                <div className="space-y-4">
                  {submissions?.slice(0, 3).filter(s => (s as any).scoringStatus === 'scored').map((submission) => (
                    <div key={submission.id} className="flex items-center gap-3 p-3 rounded-xl bg-soft-gray/30">
                      <CheckCircle className="w-5 h-5 text-success" />
                      <div className="flex-1">
                        <h4 className="font-medium text-text-dark text-sm">{submission.title}</h4>
                        <p className="text-text-muted text-xs">Scored: {submission.averageScore?.toFixed(1) || 'N/A'}/10</p>
                      </div>
                      <Badge className="bg-mint/20 text-mint px-2 py-1 rounded-full text-xs border-0">
                        {submission.track}
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events">
            <Card className="bg-white rounded-2xl p-6 shadow-soft border border-soft-gray">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-heading font-semibold text-xl text-text-dark">My Judging Events</h3>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48 border-soft-gray rounded-xl" data-testid="select-event-status">
                    <SelectValue placeholder="Filter events" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Events</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {eventsLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="p-6 rounded-xl border border-soft-gray">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <Skeleton className="h-5 w-48 mb-2" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                        <Skeleton className="h-8 w-20" />
                      </div>
                      <Skeleton className="h-2 w-full mt-4" />
                    </div>
                  ))}
                </div>
              ) : assignedEvents && assignedEvents.length > 0 ? (
                <div className="space-y-4">
                  {assignedEvents
                    .filter(event => statusFilter === 'all' || event.status === statusFilter)
                    .map((event) => (
                      <div key={event.id} className="p-6 rounded-xl border border-soft-gray hover:bg-soft-gray/30 transition-colors" data-testid={`event-row-${event.id}`}>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-heading font-semibold text-lg text-text-dark">{event.title}</h4>
                              <Badge className={`bg-${getStatusColor(event.status)}/20 text-${getStatusColor(event.status)} px-2 py-1 rounded-full text-xs border-0`}>
                                {event.status}
                              </Badge>
                            </div>
                            
                            <div className="flex items-center gap-6 text-sm text-text-muted">
                              <span>Progress: {event.scoredSubmissions}/{event.assignedSubmissions}</span>
                              <span>Due: {formatTimeLeft(event.deadline)}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Link href={`/e/${event.id}`}>
                              <Button variant="ghost" size="icon" className="text-text-muted hover:text-sky" data-testid={`button-view-event-${event.id}`}>
                                <Eye className="w-4 h-4" />
                              </Button>
                            </Link>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Progress value={getProgressPercent(event.scoredSubmissions, event.assignedSubmissions)} className="flex-1 h-2 mr-4" />
                          <span className="text-sm text-text-muted font-medium">
                            {getProgressPercent(event.scoredSubmissions, event.assignedSubmissions)}%
                          </span>
                        </div>
                      </div>
                    ))
                  }
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">⭐</div>
                  <h3 className="font-heading font-semibold text-xl text-text-dark mb-2">No events assigned</h3>
                  <p className="text-text-muted mb-6">You'll see hackathons here once organizers invite you to judge</p>
                  <Link href="/judges">
                    <Button className="bg-coral text-white hover:bg-coral/80">
                      <Users className="w-4 h-4 mr-2" />
                      Browse Judge Opportunities
                    </Button>
                  </Link>
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Submissions Tab */}
          <TabsContent value="submissions">
            <Card className="bg-white rounded-2xl p-6 shadow-soft border border-soft-gray">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-heading font-semibold text-xl text-text-dark">Assigned Submissions</h3>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48 border-soft-gray rounded-xl" data-testid="select-submission-status">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Submissions</SelectItem>
                    <SelectItem value="not_started">Not Started</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="scored">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {submissionsLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="p-6 rounded-xl border border-soft-gray">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <Skeleton className="h-5 w-48 mb-2" />
                          <Skeleton className="h-4 w-32 mb-2" />
                          <div className="flex gap-2">
                            <Skeleton className="h-6 w-12" />
                            <Skeleton className="h-6 w-16" />
                          </div>
                        </div>
                        <Skeleton className="h-10 w-24" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : submissions && submissions.length > 0 ? (
                <div className="space-y-4">
                  {submissions.map((submission: any) => (
                    <div key={submission.id} className="p-6 rounded-xl border border-soft-gray hover:bg-soft-gray/30 transition-colors" data-testid={`submission-row-${submission.id}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-heading font-semibold text-lg text-text-dark">{submission.title}</h4>
                            <Badge className={`bg-${getStatusColor(submission.scoringStatus)}/20 text-${getStatusColor(submission.scoringStatus)} px-2 py-1 rounded-full text-xs border-0`}>
                              {getStatusText(submission.scoringStatus)}
                            </Badge>
                          </div>
                          
                          <p className="text-text-muted text-sm mb-3">{submission.tagline}</p>
                          
                          <div className="flex flex-wrap gap-2 mb-3">
                            <Badge className="bg-mint/20 text-mint px-2 py-1 rounded-full text-xs border-0">
                              {submission.track}
                            </Badge>
                            {submission.tags.slice(0, 3).map((tag: string) => (
                              <Badge key={tag} className="bg-sky/20 text-sky px-2 py-1 rounded-full text-xs border-0">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-text-muted">
                            <span>Assigned: {new Date(submission.assignedAt).toLocaleDateString()}</span>
                            <span>Due: {formatTimeLeft(submission.dueDate)}</span>
                            {submission.averageScore && (
                              <span className="flex items-center gap-1">
                                <Star className="w-3 h-3 text-yellow" fill="currentColor" />
                                Current: {submission.averageScore.toFixed(1)}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {submission.demoUrl && (
                            <Button variant="ghost" size="icon" className="text-text-muted hover:text-sky" asChild>
                              <a href={submission.demoUrl} target="_blank" rel="noopener noreferrer" data-testid={`button-demo-${submission.id}`}>
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            </Button>
                          )}
                          {submission.githubUrl && (
                            <Button variant="ghost" size="icon" className="text-text-muted hover:text-coral" asChild>
                              <a href={submission.githubUrl} target="_blank" rel="noopener noreferrer" data-testid={`button-github-${submission.id}`}>
                                <Github className="w-4 h-4" />
                              </a>
                            </Button>
                          )}
                          <Button 
                            onClick={() => setSelectedSubmission(submission.id)}
                            className={`px-6 py-2 rounded-full font-medium transition-colors ${
                              submission.scoringStatus === 'scored'
                                ? 'bg-success text-white hover:bg-success/80'
                                : submission.scoringStatus === 'in_progress'
                                ? 'bg-yellow text-text-dark hover:bg-yellow/80'
                                : 'bg-coral text-white hover:bg-coral/80'
                            }`}
                            data-testid={`button-score-${submission.id}`}
                          >
                            {submission.scoringStatus === 'scored' ? 'View Score' :
                             submission.scoringStatus === 'in_progress' ? 'Continue' :
                             'Start Scoring'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">📝</div>
                  <h3 className="font-heading font-semibold text-xl text-text-dark mb-2">No submissions assigned</h3>
                  <p className="text-text-muted mb-6">
                    {statusFilter !== 'all' 
                      ? "No submissions match the selected filter"
                      : "Submissions will appear here once events begin"
                    }
                  </p>
                  {statusFilter !== 'all' && (
                    <Button 
                      onClick={() => setStatusFilter('all')}
                      className="bg-coral text-white hover:bg-coral/80"
                      data-testid="button-show-all"
                    >
                      Show All Submissions
                    </Button>
                  )}
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
