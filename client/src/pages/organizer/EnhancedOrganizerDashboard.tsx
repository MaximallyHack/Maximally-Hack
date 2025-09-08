import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { supabaseApi, Event as ApiEvent } from '@/lib/supabaseApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Plus, 
  Calendar, 
  Users, 
  Trophy, 
  BarChart3, 
  Settings, 
  Eye,
  Edit,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  Target,
  MessageSquare,
  FileText,
  Download,
  Send,
  UserCheck,
  Award,
  Zap
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EventAnalytics {
  registrations: {
    total: number;
    daily: Array<{ date: string; count: number }>;
    byTrack: Array<{ track: string; count: number }>;
    growth: number;
  };
  teams: {
    total: number;
    recruiting: number;
    full: number;
    averageSize: number;
  };
  submissions: {
    total: number;
    byTrack: Array<{ track: string; count: number }>;
    judged: number;
    pending: number;
  };
  engagement: {
    pageViews: number;
    uniqueVisitors: number;
    socialShares: number;
    discordMembers: number;
  };
}

interface EventHealthCheck {
  id: string;
  title: string;
  status: "complete" | "warning" | "error";
  message?: string;
  action?: string;
  priority: "high" | "medium" | "low";
}

interface Event {
  id: string;
  title: string;
  slug: string;
  status: "draft" | "published" | "active" | "completed";
  startDate: string;
  endDate: string;
  registrationCount: number;
  submissionCount: number;
  prizePool: number;
  analytics: EventAnalytics;
  healthChecks: EventHealthCheck[];
}

const mockEvents: Event[] = [
  {
    id: 'maximally-ai-shipathon-2025',
    title: 'Maximally AI Shipathon 2025',
    slug: 'maximally-ai-shipathon-2025',
    status: 'active',
    startDate: '2025-02-01T09:00:00Z',
    endDate: '2025-02-03T18:00:00Z',
    registrationCount: 234,
    submissionCount: 87,
    prizePool: 50000,
    analytics: {
      registrations: {
        total: 234,
        daily: [
          { date: '2025-01-01', count: 12 },
          { date: '2025-01-02', count: 18 },
          { date: '2025-01-03', count: 25 },
        ],
        byTrack: [
          { track: 'AI & ML', count: 89 },
          { track: 'Climate Tech', count: 76 },
          { track: 'Healthcare', count: 69 },
        ],
        growth: 23.5
      },
      teams: {
        total: 78,
        recruiting: 23,
        full: 55,
        averageSize: 3.2
      },
      submissions: {
        total: 87,
        byTrack: [
          { track: 'AI & ML', count: 34 },
          { track: 'Climate Tech', count: 28 },
          { track: 'Healthcare', count: 25 },
        ],
        judged: 45,
        pending: 42
      },
      engagement: {
        pageViews: 12500,
        uniqueVisitors: 8200,
        socialShares: 456,
        discordMembers: 189
      }
    },
    healthChecks: [
      {
        id: '1',
        title: 'Judging Criteria',
        status: 'complete',
        message: 'All judging criteria are properly configured',
        priority: 'medium'
      },
      {
        id: '2',
        title: 'Prize Distribution',
        status: 'warning',
        message: 'Prize amounts need final review',
        action: 'Review Prizes',
        priority: 'high'
      },
      {
        id: '3',
        title: 'Judge Assignments',
        status: 'error',
        message: '3 judges have not confirmed availability',
        action: 'Contact Judges',
        priority: 'high'
      }
    ]
  }
];

export default function EnhancedOrganizerDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");

  // Redirect if not an organizer
  if (!user?.isOrganizer) {
    return <Navigate to="/auth/organizer" replace />;
  }

  const { data: events, isLoading } = useQuery({
    queryKey: ['organizer-events', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const allEvents = await supabaseApi.getEvents();
      // Filter events where current user is the organizer
      return allEvents.filter(event => event.organizerId === user.id).map(event => ({
        id: event.id,
        title: event.title,
        slug: event.slug,
        status: event.status as "draft" | "published" | "active" | "completed",
        startDate: event.startDate,
        endDate: event.endDate,
        registrationCount: event.participantCount || 0,
        submissionCount: 0, // TODO: implement submissions API
        prizePool: event.prizePool || 0,
        analytics: {
          registrations: {
            total: event.participantCount || 0,
            daily: [],
            byTrack: [],
            growth: 0
          },
          teams: {
            total: 0,
            recruiting: 0,
            full: 0,
            averageSize: 0
          },
          submissions: {
            total: 0,
            byTrack: [],
            judged: 0,
            pending: 0
          },
          engagement: {
            pageViews: 0,
            uniqueVisitors: 0,
            socialShares: 0,
            discordMembers: 0
          }
        },
        healthChecks: []
      }));
    },
    enabled: !!user?.id
  });

  const activeEvent = events?.[0]; // For demo, use first event

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'published': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'draft': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
      case 'completed': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getHealthStatusIcon = (status: string) => {
    switch (status) {
      case 'complete': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'warning': return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      case 'error': return <AlertCircle className="w-4 h-4 text-red-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" data-testid="enhanced-organizer-dashboard">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Welcome back, {user.fullName}
            </h1>
            <p className="text-muted-foreground">
              Manage your events and track performance in real-time
            </p>
          </div>
          <div className="flex gap-3">
            <Button asChild data-testid="button-create-event">
              <Link to="/organizer/events/new">
                <Plus className="w-4 h-4 mr-2" />
                Create Event
              </Link>
            </Button>
            <Button variant="outline" data-testid="button-analytics">
              <BarChart3 className="w-4 h-4 mr-2" />
              Full Analytics
            </Button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Events</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{events?.length || 0}</div>
              <p className="text-xs text-muted-foreground">
                {events?.filter(e => e.status === 'active').length || 0} active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Participants</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {events?.reduce((acc, event) => acc + event.registrationCount, 0) || 0}
              </div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
                +23.5% from last month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Prize Pool</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${events?.reduce((acc, event) => acc + event.prizePool, 0).toLocaleString() || '0'}
              </div>
              <p className="text-xs text-muted-foreground">
                Across all events
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Submissions</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {events?.reduce((acc, event) => acc + event.submissionCount, 0) || 0}
              </div>
              <div className="flex items-center text-xs text-muted-foreground">
                <Target className="h-3 w-3 mr-1" />
                {activeEvent?.analytics.submissions.judged || 0} judged
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
            <TabsTrigger value="events" data-testid="tab-events">Events</TabsTrigger>
            <TabsTrigger value="analytics" data-testid="tab-analytics">Analytics</TabsTrigger>
            <TabsTrigger value="participants" data-testid="tab-participants">Participants</TabsTrigger>
            <TabsTrigger value="tools" data-testid="tab-tools">Tools</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Event Health Checks */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Event Health
                  </CardTitle>
                  <CardDescription>
                    System checks for your active events
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {activeEvent?.healthChecks.map((check) => (
                    <div key={check.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getHealthStatusIcon(check.status)}
                        <div>
                          <p className="font-medium">{check.title}</p>
                          {check.message && (
                            <p className="text-sm text-muted-foreground">{check.message}</p>
                          )}
                        </div>
                      </div>
                      {check.action && (
                        <Button size="sm" variant="outline" data-testid={`button-action-${check.id}`}>
                          {check.action}
                        </Button>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription>
                    Latest updates across your events
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-2">
                      <UserCheck className="w-4 h-4 text-green-600" />
                      <div className="flex-1">
                        <p className="text-sm">12 new registrations</p>
                        <p className="text-xs text-muted-foreground">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-2">
                      <FileText className="w-4 h-4 text-blue-600" />
                      <div className="flex-1">
                        <p className="text-sm">5 new submissions</p>
                        <p className="text-xs text-muted-foreground">4 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-2">
                      <Award className="w-4 h-4 text-purple-600" />
                      <div className="flex-1">
                        <p className="text-sm">Judging period started</p>
                        <p className="text-xs text-muted-foreground">6 hours ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks for event management</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button variant="outline" className="h-20 flex-col gap-2" asChild data-testid="button-edit-content">
                    <Link to={`/organizer/events/${activeEvent?.id}/content`}>
                      <Edit className="w-5 h-5" />
                      Edit Content
                    </Link>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2" data-testid="button-send-announcement">
                    <Send className="w-5 h-5" />
                    Send Announcement
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2" data-testid="button-export-data">
                    <Download className="w-5 h-5" />
                    Export Data
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2" asChild data-testid="button-view-event">
                    <Link to={`/e/${activeEvent?.slug}`} target="_blank">
                      <Eye className="w-5 h-5" />
                      View Event
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Your Events</h3>
              <Button asChild data-testid="button-create-new-event">
                <Link to="/organizer/events/new">
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Event
                </Link>
              </Button>
            </div>

            <div className="grid gap-6">
              {events?.map((event) => (
                <Card key={event.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="flex items-center gap-3">
                          {event.title}
                          <Badge className={getStatusColor(event.status)}>
                            {event.status}
                          </Badge>
                        </CardTitle>
                        <CardDescription>
                          {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" asChild data-testid={`button-edit-${event.id}`}>
                          <Link to={`/organizer/events/${event.id}/content`}>
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Link>
                        </Button>
                        <Button size="sm" variant="outline" asChild data-testid={`button-view-${event.id}`}>
                          <Link to={`/e/${event.slug}`} target="_blank">
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-foreground">{event.registrationCount}</div>
                        <div className="text-sm text-muted-foreground">Participants</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-foreground">{event.submissionCount}</div>
                        <div className="text-sm text-muted-foreground">Submissions</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-foreground">${event.prizePool.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">Prize Pool</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-foreground">{event.analytics.engagement.pageViews}</div>
                        <div className="text-sm text-muted-foreground">Page Views</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            {activeEvent && (
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Registration Analytics</CardTitle>
                    <CardDescription>Track participant growth and engagement</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Total Registrations</span>
                          <span className="text-2xl font-bold">{activeEvent.analytics.registrations.total}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <TrendingUp className="w-4 h-4 mr-1 text-green-600" />
                          <span className="text-green-600">+{activeEvent.analytics.registrations.growth}%</span>
                          <span className="text-muted-foreground ml-1">vs last period</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <span className="text-sm text-muted-foreground">Teams Formed</span>
                        <div className="text-2xl font-bold">{activeEvent.analytics.teams.total}</div>
                        <Progress 
                          value={(activeEvent.analytics.teams.full / activeEvent.analytics.teams.total) * 100} 
                          className="h-2"
                        />
                        <div className="text-xs text-muted-foreground">
                          {activeEvent.analytics.teams.full} complete, {activeEvent.analytics.teams.recruiting} recruiting
                        </div>
                      </div>

                      <div className="space-y-2">
                        <span className="text-sm text-muted-foreground">Avg Team Size</span>
                        <div className="text-2xl font-bold">{activeEvent.analytics.teams.averageSize}</div>
                        <div className="text-xs text-muted-foreground">
                          Out of max 4 members
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Track Performance</CardTitle>
                    <CardDescription>Registrations and submissions by track</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {activeEvent.analytics.registrations.byTrack.map((track, index) => (
                        <div key={track.track} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{track.track}</span>
                            <span className="text-sm text-muted-foreground">
                              {track.count} registrations
                            </span>
                          </div>
                          <Progress 
                            value={(track.count / activeEvent.analytics.registrations.total) * 100} 
                            className="h-2"
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Participants Tab */}
          <TabsContent value="participants" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Participant Management</CardTitle>
                <CardDescription>Manage registrations, teams, and communications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">Participant Management</h3>
                  <p className="text-muted-foreground mb-4">
                    View and manage all event participants, send communications, and export data.
                  </p>
                  <Button data-testid="button-manage-participants">Coming Soon</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tools Tab */}
          <TabsContent value="tools" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Send className="w-5 h-5" />
                    Announcements
                  </CardTitle>
                  <CardDescription>Send updates to all participants</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" data-testid="button-announcements">
                    Send Announcement
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Download className="w-5 h-5" />
                    Export Data
                  </CardTitle>
                  <CardDescription>Download participant and submission data</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full" data-testid="button-export">
                    Export CSV
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Certificates
                  </CardTitle>
                  <CardDescription>Generate participation certificates</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full" data-testid="button-certificates">
                    Generate Certificates
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}