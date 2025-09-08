import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { supabaseApi } from '@/lib/supabaseApi';
import { 
  Calendar, Clock, Users, Trophy, FileText, 
  Star, Award, BarChart3, Eye, CheckCircle,
  AlertCircle
} from 'lucide-react';

export default function JudgeDashboard() {
  const { user } = useSupabaseAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const { data: assignedEvents = [], isLoading: eventsLoading } = useQuery({
    queryKey: ['judge-events', user?.id],
    queryFn: () => supabaseApi.getJudgeEvents(),
    enabled: !!user?.id,
  });

  const { data: scorecards = [], isLoading: scorecardsLoading } = useQuery({
    queryKey: ['judge-scorecards', user?.id],
    queryFn: async () => {
      // TODO: Implement getJudgeScorecards API
      return [];
    },
    enabled: !!user?.id,
  });

  if (!user || user.role !== 'judge') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-medium text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">You need to be a judge to access this page.</p>
          <Link to="/">
            <Button>Go Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const activeEvents = assignedEvents.filter(event => 
    event.status === 'active' || event.status === 'judging'
  );

  const upcomingEvents = assignedEvents.filter(event => 
    event.status === 'upcoming' || event.status === 'registration_open'
  );

  const completedEvents = assignedEvents.filter(event => 
    event.status === 'completed'
  );

  const pendingScorecards = scorecards.filter(card => card.status === 'draft').length;
  const completedScorecards = scorecards.filter(card => card.status === 'submitted').length;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'judging': return 'bg-blue-100 text-blue-800';
      case 'upcoming': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (eventsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-medium text-foreground">
                Welcome, Judge {user.name || user.username}
              </h1>
              <p className="text-muted-foreground mt-1">Manage your judging assignments and evaluations</p>
            </div>
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>
                  {user.name?.[0]?.toUpperCase() || user.username?.[0]?.toUpperCase() || 'J'}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Assigned Events</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{assignedEvents.length}</div>
              <div className="flex items-center gap-1 mt-1">
                <div className="text-xs text-muted-foreground">
                  {activeEvents.length} active
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingScorecards}</div>
              <div className="text-xs text-muted-foreground">
                Need evaluation
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Reviews</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedScorecards}</div>
              <div className="text-xs text-muted-foreground">
                This month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8.2</div>
              <div className="text-xs text-muted-foreground">
                Out of 10
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="events">My Events</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {activeEvents.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-4">Active Judging</h3>
                <div className="grid gap-4">
                  {activeEvents.map(event => (
                    <Card key={event.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{event.title}</CardTitle>
                            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>{formatDate(event.startDate)} - {formatDate(event.endDate)}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                <span>{event.participantCount || 0} participants</span>
                              </div>
                            </div>
                          </div>
                          <Badge className={getStatusColor(event.status)}>
                            {event.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-muted-foreground">
                            Submissions to review: 0 {/* TODO: Get actual submission count */}
                          </div>
                          <div className="flex gap-2">
                            <Link to={`/e/${event.slug}/submissions`}>
                              <Button size="sm" variant="outline">
                                <Eye className="w-4 h-4 mr-1" />
                                View Submissions
                              </Button>
                            </Link>
                            <Link to={`/judge/events/${event.id}/review`}>
                              <Button size="sm">
                                <FileText className="w-4 h-4 mr-1" />
                                Start Judging
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {upcomingEvents.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-4">Upcoming Events</h3>
                <div className="grid gap-4">
                  {upcomingEvents.map(event => (
                    <Card key={event.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{event.title}</CardTitle>
                            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>Starts {formatDate(event.startDate)}</span>
                              </div>
                            </div>
                          </div>
                          <Badge className={getStatusColor(event.status)}>
                            {event.status === 'registration_open' ? 'Registration Open' : 'Upcoming'}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-muted-foreground">
                            Judging starts after submissions close
                          </div>
                          <Link to={`/e/${event.slug}`}>
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4 mr-1" />
                              View Event
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {assignedEvents.length === 0 && (
              <Card className="text-center py-12">
                <CardContent>
                  <div className="text-6xl mb-4">⚖️</div>
                  <h3 className="text-xl font-medium mb-2">No Events Assigned</h3>
                  <p className="text-muted-foreground mb-6">
                    You haven't been assigned to judge any events yet. 
                    Event organizers will assign you to events when needed.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events" className="space-y-6">
            <div className="grid gap-6">
              {assignedEvents.map(event => (
                <Card key={event.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{event.title}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                        <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(event.startDate)} - {formatDate(event.endDate)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Trophy className="w-4 h-4" />
                            <span>${event.prizePool?.toLocaleString() || 0} prizes</span>
                          </div>
                        </div>
                      </div>
                      <Badge className={getStatusColor(event.status)}>
                        {event.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{event.participantCount || 0} participants</span>
                        <span>0 submissions to review</span>
                      </div>
                      <div className="flex gap-2">
                        <Link to={`/e/${event.slug}`}>
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4 mr-1" />
                            View Event
                          </Button>
                        </Link>
                        {(event.status === 'active' || event.status === 'judging') && (
                          <Link to={`/judge/events/${event.id}/review`}>
                            <Button size="sm">
                              <FileText className="w-4 h-4 mr-1" />
                              Judge Submissions
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews" className="space-y-6">
            <Card className="text-center py-12">
              <CardContent>
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl font-medium mb-2">Review History</h3>
                <p className="text-muted-foreground">
                  Your submitted reviews and scorecards will appear here.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
