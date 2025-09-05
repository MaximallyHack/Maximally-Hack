import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { 
  Calendar, Clock, Globe, Users, Trophy, MapPin, ExternalLink, 
  ArrowRight, Star, CheckCircle, AlertCircle, Plus, Upload,
  Code, Award, BookOpen, HelpCircle, Briefcase, Gift,
  Building, MessageSquare, Target, Zap, Play, User
} from "lucide-react";

// Types for enhanced functionality
interface EventStats {
  totalRegistrations: number;
  totalSubmissions: number;
  teamsFormed: number;
  mentorsAvailable: number;
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  author: string;
}

interface QuickStartItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  action?: string;
}

export default function NewEnhancedEventDetail() {
  const { slug } = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [showSticky, setShowSticky] = useState(false);
  const { toast } = useToast();
  const { user, isLoggedIn, registerForEvent, unregisterFromEvent } = useAuth();

  const { data: event, isLoading } = useQuery({
    queryKey: ['events', slug],
    queryFn: () => api.getEvent(slug!),
    enabled: !!slug,
  });

  const { data: submissions } = useQuery({
    queryKey: ['submissions', event?.id],
    queryFn: () => api.getSubmissions(event?.id),
    enabled: !!event?.id,
  });

  const { data: teams } = useQuery({
    queryKey: ['teams', event?.id],
    queryFn: () => api.getTeams(event?.id),
    enabled: !!event?.id,
  });

  // Handle sticky action bar visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowSticky(window.scrollY > 200);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="animate-pulse">
          <div className="h-64 bg-gray-200 mb-8"></div>
          <div className="max-w-6xl mx-auto px-4">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-medium text-gray-900 mb-4">Event not found</h1>
          <Link href="/explore">
            <Button variant="outline">Back to explore</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Determine event state and action
  const isRegistered = user?.registeredEvents?.includes(event.id) || false;
  
  const getEventState = () => {
    switch (event.status) {
      case 'registration_open':
      case 'upcoming':
        return 'upcoming';
      case 'active':
        return 'live';
      case 'completed':
        return 'closed';
      default:
        return 'upcoming';
    }
  };

  const getActionButton = () => {
    const state = getEventState();
    
    if (!isLoggedIn) {
      return (
        <Button size="lg" className="min-w-[140px]" asChild>
          <Link href="/login">Login to Register</Link>
        </Button>
      );
    }

    switch (state) {
      case 'upcoming':
        return isRegistered ? (
          <Button size="lg" variant="outline" onClick={handleUnregister} className="min-w-[140px]">
            Unregister
          </Button>
        ) : (
          <Button size="lg" onClick={handleRegister} className="min-w-[140px]">
            Register Now
          </Button>
        );
      case 'live':
        return isRegistered ? (
          <Button size="lg" asChild className="min-w-[140px]">
            <Link href={`/e/${event.slug}/submit`}>
              <Upload className="w-4 h-4 mr-2" />
              Submit Project
            </Link>
          </Button>
        ) : (
          <Button size="lg" onClick={handleRegister} className="min-w-[140px]">
            Register & Submit
          </Button>
        );
      case 'closed':
        return (
          <Button size="lg" variant="outline" asChild className="min-w-[140px]">
            <Link href="/projects">View Winners</Link>
          </Button>
        );
      default:
        return null;
    }
  };

  const handleRegister = async () => {
    const result = await registerForEvent(event.id);
    if (result.success) {
      toast({
        title: "Registration successful! 🎉",
        description: "You've been registered for this hackathon.",
      });
    } else {
      toast({
        title: "Registration failed",
        description: result.error || "Something went wrong.",
        variant: "destructive",
      });
    }
  };

  const handleUnregister = async () => {
    const result = await unregisterFromEvent(event.id);
    if (result.success) {
      toast({
        title: "Unregistered successfully",
        description: "You've been removed from this hackathon.",
      });
    }
  };

  // Mock data for enhanced features
  const eventStats: EventStats = {
    totalRegistrations: 234,
    totalSubmissions: submissions?.length || 0,
    teamsFormed: teams?.length || 0,
    mentorsAvailable: 12
  };

  const announcements: Announcement[] = [
    {
      id: '1',
      title: 'Welcome to the hackathon!',
      content: 'Event has officially started. Good luck to all participants!',
      priority: 'high',
      createdAt: new Date().toISOString(),
      author: 'Event Organizer'
    },
    {
      id: '2', 
      title: 'Mentor office hours now open',
      content: 'Book 1-on-1 sessions with our expert mentors in the People tab.',
      priority: 'medium',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      author: 'Mentor Team'
    }
  ];

  const quickStartItems: QuickStartItem[] = [
    {
      id: '1',
      title: 'Join the Discord',
      description: 'Connect with other participants and get real-time updates',
      completed: false,
      action: 'Join Discord'
    },
    {
      id: '2',
      title: 'Form or join a team',
      description: 'Find teammates with complementary skills',
      completed: false,
      action: 'Browse Teams'
    },
    {
      id: '3',
      title: 'Read the rules & judging criteria',
      description: 'Understand what judges are looking for',
      completed: false,
      action: 'View Rules'
    },
    {
      id: '4',
      title: 'Start building your project',
      description: 'Begin development and track your progress',
      completed: false,
      action: 'Create Project'
    }
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'registration_open': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Sticky Action Bar */}
      <div className={`fixed top-0 left-0 right-0 z-50 bg-white border-b shadow-sm transition-transform duration-200 ${
        showSticky ? 'translate-y-0' : '-translate-y-full'
      }`}>
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="font-medium text-gray-900 truncate">{event.title}</h2>
              <Badge className={getStatusColor(event.status)}>
                {event.status === 'registration_open' ? 'Registration Open' : 
                 event.status === 'active' ? 'Live Now' : 
                 event.status === 'completed' ? 'Completed' : 'Upcoming'}
              </Badge>
            </div>
            <div className="flex items-center gap-3">
              {getActionButton()}
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <Badge className={getStatusColor(event.status)}>
                  {event.status === 'registration_open' ? 'Registration Open' : 
                   event.status === 'active' ? 'Live Now' : 
                   event.status === 'completed' ? 'Completed' : 'Upcoming'}
                </Badge>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Users className="w-4 h-4" />
                  <span>{eventStats.totalRegistrations} registered</span>
                </div>
              </div>
              
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{event.title}</h1>
              <p className="text-xl text-gray-600 mb-6">{event.tagline}</p>
              
              <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-8">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>{formatDate(event.startDate)} - {formatDate(event.endDate)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  <span>${event.prizePool.toLocaleString()} in prizes</span>
                </div>
              </div>

              <div className="flex gap-3">
                {getActionButton()}
                <Button variant="outline" size="lg">
                  <Star className="w-4 h-4 mr-2" />
                  Save Event
                </Button>
              </div>
            </div>

            {/* Right Rail - Stats */}
            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Event Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Registered</span>
                    <span className="font-medium">{eventStats.totalRegistrations}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Teams Formed</span>
                    <span className="font-medium">{eventStats.teamsFormed}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Submissions</span>
                    <span className="font-medium">{eventStats.totalSubmissions}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Mentors Available</span>
                    <span className="font-medium">{eventStats.mentorsAvailable}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Links */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Quick Links</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Join Discord
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Hackathon Guide
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    <HelpCircle className="w-4 h-4 mr-2" />
                    Get Help
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content with Tabs */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 lg:grid-cols-11 bg-gray-50 p-1 rounded-lg mb-8">
            <TabsTrigger value="overview" className="text-xs lg:text-sm">Overview</TabsTrigger>
            <TabsTrigger value="timeline" className="text-xs lg:text-sm">Timeline</TabsTrigger>
            <TabsTrigger value="prizes" className="text-xs lg:text-sm">Prizes</TabsTrigger>
            <TabsTrigger value="rules" className="text-xs lg:text-sm">Rules</TabsTrigger>
            <TabsTrigger value="judging" className="text-xs lg:text-sm">Judging</TabsTrigger>
            <TabsTrigger value="submissions" className="text-xs lg:text-sm">Submissions</TabsTrigger>
            <TabsTrigger value="teams" className="hidden lg:block text-xs lg:text-sm">Teams</TabsTrigger>
            <TabsTrigger value="people" className="hidden lg:block text-xs lg:text-sm">People</TabsTrigger>
            <TabsTrigger value="help" className="hidden lg:block text-xs lg:text-sm">Help</TabsTrigger>
            <TabsTrigger value="resources" className="hidden lg:block text-xs lg:text-sm">Resources</TabsTrigger>
            <TabsTrigger value="sponsors" className="hidden lg:block text-xs lg:text-sm">Sponsors</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Quick Start Checklist */}
                {isRegistered && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="w-5 h-5 text-blue-500" />
                        Quick Start Checklist
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {quickStartItems.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-3 rounded-lg border">
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              item.completed ? 'bg-green-500 border-green-500' : 'border-gray-300'
                            }`}>
                              {item.completed && <CheckCircle className="w-3 h-3 text-white" />}
                            </div>
                            <div>
                              <h4 className="font-medium">{item.title}</h4>
                              <p className="text-sm text-gray-600">{item.description}</p>
                            </div>
                          </div>
                          {item.action && !item.completed && (
                            <Button size="sm" variant="outline">
                              {item.action}
                            </Button>
                          )}
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {/* Event Description */}
                <Card>
                  <CardHeader>
                    <CardTitle>About This Hackathon</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 leading-relaxed">{event.description}</p>
                  </CardContent>
                </Card>

                {/* Live Announcements */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-yellow-500" />
                      Live Announcements
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {announcements.map((announcement) => (
                      <div key={announcement.id} className="p-4 rounded-lg border-l-4 border-l-blue-500 bg-blue-50">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{announcement.title}</h4>
                          <Badge variant={announcement.priority === 'high' ? 'destructive' : 'secondary'}>
                            {announcement.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{announcement.content}</p>
                        <p className="text-xs text-gray-500">
                          {announcement.author} • {formatDate(announcement.createdAt)}
                        </p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Create Project CTA */}
                {isRegistered && getEventState() === 'live' && (
                  <Card className="border-green-200 bg-green-50">
                    <CardContent className="p-6 text-center">
                      <Code className="w-12 h-12 text-green-600 mx-auto mb-4" />
                      <h3 className="font-medium text-green-900 mb-2">Ready to build?</h3>
                      <p className="text-sm text-green-700 mb-4">Start your project and track your progress</p>
                      <Button asChild className="w-full">
                        <Link href="/projects/create">
                          <Plus className="w-4 h-4 mr-2" />
                          Create Project
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {/* Email Support */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Need Help?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                      Our support team is here to help with any questions.
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Contact Support
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Timeline Tab */}
          <TabsContent value="timeline" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Event Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {event.timeline?.map((item, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        {index < event.timeline!.length - 1 && (
                          <div className="w-px h-16 bg-gray-200"></div>
                        )}
                      </div>
                      <div className="flex-1 pb-8">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium">{item.title}</h3>
                          <Button size="sm" variant="outline">
                            <Calendar className="w-4 h-4 mr-2" />
                            Add to Calendar
                          </Button>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                        <p className="text-xs text-gray-500">{formatDate(item.date)}</p>
                      </div>
                    </div>
                  )) || (
                    <p className="text-gray-500 text-center py-8">Timeline coming soon...</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Basic Submissions Tab */}
          <TabsContent value="submissions" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-medium">Submissions</h2>
              {isRegistered && (
                <Button asChild>
                  <Link href="/projects/create">
                    <Plus className="w-4 h-4 mr-2" />
                    Submit Project
                  </Link>
                </Button>
              )}
            </div>

            {submissions && submissions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {submissions.map((submission) => (
                  <Card key={submission.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">{submission.title}</CardTitle>
                      <p className="text-sm text-gray-600">{submission.tagline}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{submission.status}</Badge>
                          {submission.awards && submission.awards.length > 0 && (
                            <Badge className="bg-yellow-100 text-yellow-800">
                              <Trophy className="w-3 h-3 mr-1" />
                              Winner
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between pt-2">
                          <Link href={`/projects/${submission.id}`}>
                            <Button size="sm" variant="outline">
                              View Project
                            </Button>
                          </Link>
                          <div className="flex gap-1">
                            {submission.githubUrl && (
                              <Button size="sm" variant="ghost" className="w-8 h-8 p-0" asChild>
                                <a href={submission.githubUrl} target="_blank" rel="noopener noreferrer">
                                  <Code className="w-4 h-4" />
                                </a>
                              </Button>
                            )}
                            {submission.demoUrl && (
                              <Button size="sm" variant="ghost" className="w-8 h-8 p-0" asChild>
                                <a href={submission.demoUrl} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="w-4 h-4" />
                                </a>
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="text-center py-16">
                <CardContent>
                  <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">No submissions yet</h3>
                  <p className="text-gray-600 mb-6">Be the first to submit your project!</p>
                  {isRegistered && (
                    <Button asChild>
                      <Link href="/projects/create">
                        <Plus className="w-4 h-4 mr-2" />
                        Submit Your Project
                      </Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Placeholder tabs for other sections */}
          <TabsContent value="prizes">
            <Card>
              <CardHeader>
                <CardTitle>Prizes & Awards</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Prize information coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rules">
            <Card>
              <CardHeader>
                <CardTitle>Rules & Guidelines</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Rules and guidelines coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="judging">
            <Card>
              <CardHeader>
                <CardTitle>Judging Criteria</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Judging information coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="teams">
            <Card>
              <CardHeader>
                <CardTitle>Teams</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Team finder coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="people">
            <Card>
              <CardHeader>
                <CardTitle>People</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Mentors, judges, and speakers coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="help">
            <Card>
              <CardHeader>
                <CardTitle>Help & Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Help desk coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resources">
            <Card>
              <CardHeader>
                <CardTitle>Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Resources and guides coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sponsors">
            <Card>
              <CardHeader>
                <CardTitle>Sponsors</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Sponsor information coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}