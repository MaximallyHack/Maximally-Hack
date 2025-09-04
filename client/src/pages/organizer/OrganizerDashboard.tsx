import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CrayonSquiggle } from "@/components/ui/floating-elements";
import { 
  Plus, 
  Calendar, 
  Users, 
  Trophy, 
  BarChart3, 
  Settings, 
  Download,
  Eye,
  Edit,
  MoreHorizontal,
  TrendingUp,
  Clock,
  Star,
  Shield
} from "lucide-react";
import { api } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

interface EventStats {
  id: string;
  title: string;
  status: string;
  participants: number;
  submissions: number;
  startDate: string;
  prizePool: number;
}

// Mock organizer data
const mockOrganizerEvents: EventStats[] = [
  {
    id: "ai-for-good-2024",
    title: "AI for Good Challenge",
    status: "active",
    participants: 1250,
    submissions: 45,
    startDate: "2024-12-15T10:00:00Z",
    prizePool: 50000
  },
  {
    id: "web3-builder-fest-2024", 
    title: "Web3 Builder Fest",
    status: "upcoming",
    participants: 856,
    submissions: 0,
    startDate: "2024-12-20T09:00:00Z",
    prizePool: 25000
  },
  {
    id: "climate-tech-sprint-2024",
    title: "Climate Tech Sprint", 
    status: "completed",
    participants: 432,
    submissions: 38,
    startDate: "2024-11-25T09:00:00Z",
    prizePool: 15000
  }
];

const mockStats = {
  totalEvents: 12,
  totalRegistrations: 5200,
  totalSubmissions: 280,
  totalJudges: 48
};

export default function OrganizerDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [timeFilter, setTimeFilter] = useState("all");

  const { data: events, isLoading } = useQuery({
    queryKey: ['organizer-events'],
    queryFn: async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockOrganizerEvents;
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'upcoming': return 'yellow';
      case 'completed': return 'sky';
      default: return 'mint';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatPrize = (amount: number) => {
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}k`;
    }
    return `$${amount}`;
  };

  return (
    <div className="min-h-screen bg-cream py-8" data-testid="organizer-dashboard">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="font-heading font-bold text-4xl text-text-dark mb-2">Organizer Dashboard</h1>
            <p className="text-text-muted">Manage your hackathons and track performance</p>
          </div>
          <div className="flex gap-3">
            <Link href="/organizer/events/new">
              <Button className="bg-coral text-white hover:bg-coral/80 rounded-full px-6" data-testid="button-create-event">
                <Plus className="w-4 h-4 mr-2" />
                Create Event
              </Button>
            </Link>
            <Button variant="outline" className="border-sky text-sky hover:bg-sky/10 rounded-full px-6" data-testid="button-analytics">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white rounded-2xl p-6 shadow-soft border border-soft-gray">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm">Total Events</p>
                <p className="text-3xl font-bold text-coral">{mockStats.totalEvents}</p>
              </div>
              <Calendar className="w-8 h-8 text-coral" />
            </div>
            <div className="flex items-center gap-1 mt-2 text-sm">
              <TrendingUp className="w-4 h-4 text-success" />
              <span className="text-success">+3</span>
              <span className="text-text-muted">this month</span>
            </div>
          </Card>

          <Card className="bg-white rounded-2xl p-6 shadow-soft border border-soft-gray">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm">Registrations</p>
                <p className="text-3xl font-bold text-sky">{mockStats.totalRegistrations.toLocaleString()}</p>
              </div>
              <Users className="w-8 h-8 text-sky" />
            </div>
            <div className="flex items-center gap-1 mt-2 text-sm">
              <TrendingUp className="w-4 h-4 text-success" />
              <span className="text-success">+12%</span>
              <span className="text-text-muted">vs last month</span>
            </div>
          </Card>

          <Card className="bg-white rounded-2xl p-6 shadow-soft border border-soft-gray">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm">Total Submissions</p>
                <p className="text-3xl font-bold text-mint">{mockStats.totalSubmissions}</p>
              </div>
              <Trophy className="w-8 h-8 text-mint" />
            </div>
            <div className="flex items-center gap-1 mt-2 text-sm">
              <TrendingUp className="w-4 h-4 text-success" />
              <span className="text-success">+8%</span>
              <span className="text-text-muted">completion rate</span>
            </div>
          </Card>

          <Card className="bg-white rounded-2xl p-6 shadow-soft border border-soft-gray">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm">Judges</p>
                <p className="text-3xl font-bold text-yellow">{mockStats.totalJudges}</p>
              </div>
              <Shield className="w-8 h-8 text-yellow" />
            </div>
            <div className="flex items-center gap-1 mt-2 text-sm">
              <TrendingUp className="w-4 h-4 text-success" />
              <span className="text-success">+5</span>
              <span className="text-text-muted">this month</span>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white rounded-xl border border-soft-gray p-1 mb-8">
            <TabsTrigger value="overview" className="rounded-lg" data-testid="tab-overview">Overview</TabsTrigger>
            <TabsTrigger value="events" className="rounded-lg" data-testid="tab-events">Events</TabsTrigger>
            <TabsTrigger value="analytics" className="rounded-lg" data-testid="tab-analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings" className="rounded-lg" data-testid="tab-settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Events */}
              <Card className="bg-white rounded-2xl p-6 shadow-soft border border-soft-gray">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-heading font-semibold text-xl text-text-dark">Recent Events</h3>
                  <Link href="#" className="text-coral hover:text-coral/80 text-sm font-medium">View All</Link>
                </div>
                
                <div className="space-y-4">
                  {events?.slice(0, 3).map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-4 rounded-xl bg-soft-gray/30 hover:bg-soft-gray/50 transition-colors">
                      <div className="flex-1">
                        <h4 className="font-medium text-text-dark">{event.title}</h4>
                        <div className="flex items-center gap-4 mt-1 text-sm text-text-muted">
                          <span>{formatDate(event.startDate)}</span>
                          <span>{event.participants} participants</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={`bg-${getStatusColor(event.status)}/20 text-${getStatusColor(event.status)} px-2 py-1 rounded-full text-xs border-0`}>
                          {event.status}
                        </Badge>
                        <Link href={`/organizer/events/${event.id}/overview`}>
                          <Button 
                            size="sm" 
                            className="bg-sky text-white hover:bg-sky/80 text-xs px-3"
                            data-testid={`button-manage-${event.id}`}
                          >
                            Manage
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-white rounded-2xl p-6 shadow-soft border border-soft-gray">
                <h3 className="font-heading font-semibold text-xl text-text-dark mb-6">Quick Actions</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <Link href="/organizer/events/new">
                    <Button variant="outline" className="w-full h-20 border-coral text-coral hover:bg-coral/10 rounded-xl flex-col gap-2" data-testid="quick-create-event">
                      <Plus className="w-6 h-6" />
                      <span>Create Event</span>
                    </Button>
                  </Link>
                  
                  <Button variant="outline" className="w-full h-20 border-sky text-sky hover:bg-sky/10 rounded-xl flex-col gap-2" data-testid="quick-certificates">
                    <Trophy className="w-6 h-6" />
                    <span>Certificates</span>
                  </Button>
                  
                  <Button variant="outline" className="w-full h-20 border-mint text-mint hover:bg-mint/10 rounded-xl flex-col gap-2" data-testid="quick-exports">
                    <Download className="w-6 h-6" />
                    <span>Exports</span>
                  </Button>
                  
                  <Button variant="outline" className="w-full h-20 border-yellow text-text-dark hover:bg-yellow/10 rounded-xl flex-col gap-2" data-testid="quick-settings">
                    <Settings className="w-6 h-6" />
                    <span>Settings</span>
                  </Button>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events">
            <Card className="bg-white rounded-2xl p-6 shadow-soft border border-soft-gray">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <h3 className="font-heading font-semibold text-xl text-text-dark">Your Events</h3>
                <div className="flex gap-3">
                  <Select value={timeFilter} onValueChange={setTimeFilter}>
                    <SelectTrigger className="w-48 border-soft-gray rounded-xl" data-testid="select-time-filter">
                      <SelectValue placeholder="Filter by time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Events</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="upcoming">Upcoming</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Link href="/organizer/events/new">
                    <Button className="bg-coral text-white hover:bg-coral/80 rounded-xl" data-testid="button-new-event">
                      <Plus className="w-4 h-4 mr-2" />
                      New Event
                    </Button>
                  </Link>
                </div>
              </div>

              {isLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="p-4 rounded-xl border border-soft-gray">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <Skeleton className="h-5 w-48 mb-2" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                        <Skeleton className="h-8 w-20" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : events && events.length > 0 ? (
                <div className="space-y-4">
                  {events.map((event) => (
                    <div key={event.id} className="p-6 rounded-xl border border-soft-gray hover:bg-soft-gray/30 transition-colors" data-testid={`event-row-${event.id}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-heading font-semibold text-lg text-text-dark">{event.title}</h4>
                            <Badge className={`bg-${getStatusColor(event.status)}/20 text-${getStatusColor(event.status)} px-2 py-1 rounded-full text-xs border-0`}>
                              {event.status}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-text-muted">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(event.startDate)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              <span>{event.participants} participants</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Trophy className="w-4 h-4" />
                              <span>{event.submissions} submissions</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4" />
                              <span>{formatPrize(event.prizePool)} prizes</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" className="text-text-muted hover:text-sky" data-testid={`button-view-${event.id}`}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-text-muted hover:text-coral" data-testid={`button-edit-${event.id}`}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-text-muted hover:text-text-dark" data-testid={`button-more-${event.id}`}>
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">📅</div>
                  <h3 className="font-heading font-semibold text-xl text-text-dark mb-2">No events yet</h3>
                  <p className="text-text-muted mb-6">Create your first hackathon to get started!</p>
                  <Link href="/organizer/events/new">
                    <Button className="bg-coral text-white hover:bg-coral/80">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Your First Event
                    </Button>
                  </Link>
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="bg-white rounded-2xl p-6 shadow-soft border border-soft-gray">
                <h3 className="font-heading font-semibold text-xl text-text-dark mb-6">Participation Trends</h3>
                <div className="h-64 flex items-center justify-center bg-soft-gray/30 rounded-xl">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 text-text-muted mx-auto mb-4" />
                    <p className="text-text-muted">Analytics chart will be displayed here</p>
                  </div>
                </div>
              </Card>

              <Card className="bg-white rounded-2xl p-6 shadow-soft border border-soft-gray">
                <h3 className="font-heading font-semibold text-xl text-text-dark mb-6">Event Performance</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-soft-gray/30 rounded-lg">
                    <span className="text-text-dark">Average Participants</span>
                    <span className="font-semibold text-coral">512</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-soft-gray/30 rounded-lg">
                    <span className="text-text-dark">Submission Rate</span>
                    <span className="font-semibold text-sky">73%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-soft-gray/30 rounded-lg">
                    <span className="text-text-dark">Completion Rate</span>
                    <span className="font-semibold text-mint">89%</span>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card className="bg-white rounded-2xl p-6 shadow-soft border border-soft-gray">
              <h3 className="font-heading font-semibold text-xl text-text-dark mb-6">Organizer Settings</h3>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-text-dark mb-3">Profile Settings</h4>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start border-soft-gray hover:bg-soft-gray/50" data-testid="button-edit-profile">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Profile
                      </Button>
                      <Button variant="outline" className="w-full justify-start border-soft-gray hover:bg-soft-gray/50" data-testid="button-notification-settings">
                        <Settings className="w-4 h-4 mr-2" />
                        Notification Settings
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-text-dark mb-3">Event Management</h4>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start border-soft-gray hover:bg-soft-gray/50" data-testid="button-default-settings">
                        <Calendar className="w-4 h-4 mr-2" />
                        Default Event Settings
                      </Button>
                      <Button variant="outline" className="w-full justify-start border-soft-gray hover:bg-soft-gray/50" data-testid="button-template-management">
                        <Trophy className="w-4 h-4 mr-2" />
                        Template Management
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="pt-6 border-t border-soft-gray">
                  <h4 className="font-medium text-text-dark mb-3">Data & Privacy</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <Button variant="outline" className="border-sky text-sky hover:bg-sky/10" data-testid="button-export-all">
                      <Download className="w-4 h-4 mr-2" />
                      Export All Data
                    </Button>
                    <Button variant="outline" className="border-mint text-mint hover:bg-mint/10" data-testid="button-privacy-settings">
                      <Shield className="w-4 h-4 mr-2" />
                      Privacy Settings
                    </Button>
                    <Button variant="outline" className="border-coral text-coral hover:bg-coral/10" data-testid="button-account-settings">
                      <Users className="w-4 h-4 mr-2" />
                      Account Settings
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
