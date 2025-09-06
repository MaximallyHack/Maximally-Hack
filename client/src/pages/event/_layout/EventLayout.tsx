import { ReactNode } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useEvent } from '@/contexts/EventContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  Calendar, Globe, Trophy, Users, MapPin, 
  MessageSquare, BookOpen, HelpCircle, Star,
  Settings, Edit, Eye, BarChart3
} from 'lucide-react';

interface EventLayoutProps {
  children: ReactNode;
}

const eventNavItems = [
  { key: 'overview', label: 'Overview', path: '' },
  { key: 'timeline', label: 'Timeline', path: '/timeline' },
  { key: 'prizes', label: 'Prizes', path: '/prizes' },
  { key: 'rules', label: 'Rules', path: '/rules' },
  { key: 'judging', label: 'Judging', path: '/judging' },
  { key: 'submissions', label: 'Submissions', path: '/submissions' },
  { key: 'teams', label: 'Teams', path: '/teams' },
  { key: 'people', label: 'People', path: '/people' },
  { key: 'help', label: 'Help', path: '/help' },
  { key: 'resources', label: 'Resources', path: '/resources' },
  { key: 'sponsors', label: 'Sponsors', path: '/sponsors' },
  { key: 'about', label: 'About', path: '/about' },
];

export default function EventLayout({ children }: EventLayoutProps) {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const { event, isLoading, error } = useEvent();
  const { user, isLoggedIn, registerForEvent, unregisterFromEvent } = useAuth();
  const { toast } = useToast();

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-medium text-foreground mb-4">Event not found</h1>
          <Link to="/explore">
            <Button variant="outline">Back to explore</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading || !event) {
    return (
      <div className="min-h-screen bg-background">
        <EventLayoutSkeleton />
      </div>
    );
  }

  const isRegistered = user?.registeredEvents?.includes(event.id) || false;
  const isOrganizer = user?.role === 'organizer' || user?.id === event.organizerId;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-success/20 text-success dark:bg-success/30 dark:text-success';
      case 'upcoming': return 'bg-sky/20 text-sky dark:bg-sky/30 dark:text-sky';
      case 'registration_open': return 'bg-yellow/20 text-yellow dark:bg-yellow/30 dark:text-yellow';
      case 'completed': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getActionButton = () => {
    if (!isLoggedIn) {
      return (
        <Button size="lg" className="min-w-[140px]" asChild>
          <Link to="/login">Login to Register</Link>
        </Button>
      );
    }

    switch (event.status) {
      case 'registration_open':
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
      case 'active':
        return isRegistered ? (
          <Button size="lg" asChild className="min-w-[140px]">
            <Link to={`/e/${event.slug}/submissions`}>
              Submit Project
            </Link>
          </Button>
        ) : (
          <Button size="lg" onClick={handleRegister} className="min-w-[140px]">
            Register & Submit
          </Button>
        );
      case 'completed':
        return (
          <Button size="lg" variant="outline" asChild className="min-w-[140px]">
            <Link to="/projects">View Winners</Link>
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCurrentSection = () => {
    const path = location.pathname.replace(`/e/${slug}`, '') || '/';
    if (path === '/') return 'overview';
    const section = path.split('/')[1];
    return section || 'overview';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Event Header */}
      <div className="bg-gradient-to-br from-sky/20 via-background to-mint/20 py-8 border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Event Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <Badge className={getStatusColor(event.status)}>
                  {event.status === 'registration_open' ? 'Registration Open' : 
                   event.status === 'active' ? 'Live Now' : 
                   event.status === 'completed' ? 'Completed' : 'Upcoming'}
                </Badge>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>234 registered</span>
                </div>
              </div>
              
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">{event.title}</h1>
              <p className="text-lg text-muted-foreground mb-6">{event.tagline}</p>
              
              <div className="flex flex-wrap items-center gap-6 text-muted-foreground mb-6">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(event.startDate)} - {formatDate(event.endDate)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4" />
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

            {/* Sidebar */}
            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Event Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Registered</span>
                    <span className="font-medium">234</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Teams Formed</span>
                    <span className="font-medium">0</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Submissions</span>
                    <span className="font-medium">0</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Mentors Available</span>
                    <span className="font-medium">12</span>
                  </div>
                </CardContent>
              </Card>

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

              {/* Organizer Panel - Only show for organizers */}
              {isOrganizer && (
                <Card className="border-coral/30 bg-coral/5">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-coral flex items-center gap-2">
                      <Settings className="w-4 h-4" />
                      Organizer Panel
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Link to={`/organizer/events/${event.id}/overview`}>
                      <Button variant="ghost" size="sm" className="w-full justify-start text-coral hover:bg-coral/10">
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Manage Event
                      </Button>
                    </Link>
                    <Link to={`/organizer/events/${event.id}/edit`}>
                      <Button variant="ghost" size="sm" className="w-full justify-start text-coral hover:bg-coral/10">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Details
                      </Button>
                    </Link>
                    <Link to={`/organizer/events/${event.id}/content`}>
                      <Button variant="ghost" size="sm" className="w-full justify-start text-coral hover:bg-coral/10">
                        <Eye className="w-4 h-4 mr-2" />
                        Edit Content
                      </Button>
                    </Link>
                    <Link to={`/organizer/events/${event.id}/judges`}>
                      <Button variant="ghost" size="sm" className="w-full justify-start text-coral hover:bg-coral/10">
                        <Users className="w-4 h-4 mr-2" />
                        Manage Judges
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sub Navigation */}
      <div className="border-b bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex overflow-x-auto">
            {eventNavItems.map((item) => {
              const isActive = getCurrentSection() === item.key;
              return (
                <Link
                  key={item.key}
                  to={`/e/${slug}${item.path}`}
                  className={`flex-shrink-0 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    isActive
                      ? 'border-coral text-coral'
                      : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Page Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}

function EventLayoutSkeleton() {
  return (
    <>
      {/* Header Skeleton */}
      <div className="bg-gradient-to-br from-sky/20 via-background to-mint/20 py-8 border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-10 w-3/4 mb-4" />
              <Skeleton className="h-6 w-1/2 mb-6" />
              <div className="flex gap-6 mb-6">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-28" />
              </div>
              <div className="flex gap-3">
                <Skeleton className="h-12 w-32" />
                <Skeleton className="h-12 w-28" />
              </div>
            </div>
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-24" />
                </CardHeader>
                <CardContent className="space-y-4">
                  {Array(4).fill(0).map((_, i) => (
                    <div key={i} className="flex justify-between">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-8" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      {/* Nav Skeleton */}
      <div className="border-b bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-4 py-3">
            {Array(8).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-6 w-16" />
            ))}
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Skeleton className="h-8 w-1/3 mb-6" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    </>
  );
}