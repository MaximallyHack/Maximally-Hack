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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { 
  Calendar, Clock, Globe, Users, Trophy, MapPin, ExternalLink, 
  ArrowRight, Star, CheckCircle, AlertCircle, Plus, Upload,
  Code, Award, BookOpen, HelpCircle, Briefcase, Gift,
  Building, MessageSquare, Target, Zap, Play, User, Search,
  Filter, UserPlus, Settings, Mail, Phone, Video, ChevronRight,
  Shield, Flag, Send, X, Edit, ChevronDown, Sparkles
} from "lucide-react";

// Types for enhanced functionality
interface EventStats {
  totalRegistrations: number;
  totalSubmissions: number;
  teamsFormed: number;
  mentorsAvailable: number;
}

interface Team {
  id: string;
  name: string;
  description: string;
  leaderId: string;
  leaderName: string;
  members: TeamMember[];
  lookingFor: string[];
  skills: string[];
  maxSize: number;
  status: 'recruiting' | 'full' | 'closed';
  track?: string;
  eventId: string;
  created: string;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  skills: string[];
  avatar?: string;
}

interface Mentor {
  id: string;
  name: string;
  role: string;
  company: string;
  skills: string[];
  bio: string;
  availability: string[];
  nextAvailable?: string;
  rating: number;
  sessionsCompleted: number;
}

interface Judge {
  id: string;
  name: string;
  title: string;
  company: string;
  expertise: string[];
  lookingFor: string[];
  judgingDates: string[];
  bio: string;
}

interface Speaker {
  id: string;
  name: string;
  title: string;
  company: string;
  topic: string;
  sessionDate: string;
  sessionTime: string;
  description: string;
}

interface HelpTicket {
  id: string;
  title: string;
  description: string;
  category: 'tech' | 'design' | 'product' | 'team' | 'rules';
  status: 'new' | 'claimed' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  submittedBy: string;
  submittedAt: string;
  claimedBy?: string;
  claimedAt?: string;
  resolvedAt?: string;
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

  // Teams mock data
  const mockTeams: Team[] = [
    {
      id: 'team-1',
      name: 'AI Climate Solutions',
      description: 'Building ML models to predict and prevent climate disasters. Looking for passionate developers!',
      leaderId: 'user-1',
      leaderName: 'Sarah Chen',
      members: [
        { id: 'user-1', name: 'Sarah Chen', role: 'Team Lead & AI Engineer', skills: ['Python', 'TensorFlow', 'Climate Data'] },
        { id: 'user-2', name: 'Marcus Rodriguez', role: 'Backend Developer', skills: ['Node.js', 'PostgreSQL', 'APIs'] }
      ],
      lookingFor: ['Frontend Developer', 'UI/UX Designer', 'Data Scientist'],
      skills: ['Python', 'TensorFlow', 'Node.js', 'PostgreSQL'],
      maxSize: 5,
      status: 'recruiting',
      track: 'Climate & Sustainability',
      eventId: event?.id || '',
      created: '2024-01-15T10:00:00Z'
    },
    {
      id: 'team-2',
      name: 'EduTech Revolution',
      description: 'Creating accessible learning tools for students with disabilities.',
      leaderId: 'user-3',
      leaderName: 'Alex Kim',
      members: [
        { id: 'user-3', name: 'Alex Kim', role: 'Product Manager', skills: ['Product Strategy', 'User Research', 'Accessibility'] },
        { id: 'user-4', name: 'Jordan Lee', role: 'Full Stack Developer', skills: ['React', 'Express', 'MongoDB'] },
        { id: 'user-5', name: 'Taylor Swift', role: 'UX Designer', skills: ['Figma', 'User Testing', 'Accessibility Design'] }
      ],
      lookingFor: ['Mobile Developer', 'Accessibility Expert'],
      skills: ['React', 'Express', 'MongoDB', 'Figma', 'Accessibility'],
      maxSize: 4,
      status: 'recruiting',
      track: 'Education & Learning',
      eventId: event?.id || '',
      created: '2024-01-15T14:30:00Z'
    },
    {
      id: 'team-3',
      name: 'HealthConnect',
      description: 'Platform connecting rural patients with urban healthcare providers.',
      leaderId: 'user-6',
      leaderName: 'Dr. Priya Patel',
      members: [
        { id: 'user-6', name: 'Dr. Priya Patel', role: 'Healthcare Expert & PM', skills: ['Healthcare', 'Telemedicine', 'Compliance'] },
        { id: 'user-7', name: 'Kevin Zhang', role: 'Frontend Developer', skills: ['Vue.js', 'TypeScript', 'WebRTC'] },
        { id: 'user-8', name: 'Maya Johnson', role: 'Backend Developer', skills: ['Python', 'FastAPI', 'Healthcare APIs'] },
        { id: 'user-9', name: 'Lisa Wong', role: 'Security Engineer', skills: ['HIPAA', 'Encryption', 'Security Audits'] }
      ],
      lookingFor: [],
      skills: ['Vue.js', 'TypeScript', 'Python', 'FastAPI', 'Healthcare', 'HIPAA'],
      maxSize: 4,
      status: 'full',
      track: 'Healthcare & Wellness',
      eventId: event?.id || '',
      created: '2024-01-14T09:15:00Z'
    }
  ];

  // Mentors mock data
  const mockMentors: Mentor[] = [
    {
      id: 'mentor-1',
      name: 'Jennifer Adams',
      role: 'Senior Engineering Manager',
      company: 'Google',
      skills: ['Machine Learning', 'System Design', 'Team Leadership', 'Python', 'Kubernetes'],
      bio: 'Former startup founder turned tech lead at Google. Passionate about AI ethics and scalable systems.',
      availability: ['2024-01-16 14:00', '2024-01-16 16:00', '2024-01-17 10:00'],
      nextAvailable: '2024-01-16 14:00',
      rating: 4.9,
      sessionsCompleted: 47
    },
    {
      id: 'mentor-2',
      name: 'Carlos Rodriguez',
      role: 'Principal Designer',
      company: 'Figma',
      skills: ['UX Research', 'Product Design', 'Design Systems', 'Accessibility', 'Prototyping'],
      bio: 'Design leader with 10+ years creating inclusive digital experiences. Expert in design systems and accessibility.',
      availability: ['2024-01-16 13:00', '2024-01-17 15:00'],
      nextAvailable: '2024-01-16 13:00',
      rating: 4.8,
      sessionsCompleted: 32
    },
    {
      id: 'mentor-3',
      name: 'Dr. Aisha Johnson',
      role: 'Chief Technology Officer',
      company: 'Climate.AI',
      skills: ['Climate Tech', 'Data Science', 'Startup Strategy', 'Fundraising', 'R&D'],
      bio: 'Climate tech veteran and former researcher. Helping teams build impactful solutions for environmental challenges.',
      availability: ['2024-01-17 09:00', '2024-01-17 11:00'],
      nextAvailable: '2024-01-17 09:00',
      rating: 5.0,
      sessionsCompleted: 28
    }
  ];

  // Judges mock data
  const mockJudges: Judge[] = [
    {
      id: 'judge-1',
      name: 'Michael Chen',
      title: 'VP of Engineering',
      company: 'Stripe',
      expertise: ['Fintech', 'Distributed Systems', 'API Design', 'Scalability'],
      lookingFor: ['Technical Innovation', 'Real-world Impact', 'Scalable Architecture'],
      judgingDates: ['2024-01-18', '2024-01-19'],
      bio: 'Engineering leader focused on building robust financial infrastructure.'
    },
    {
      id: 'judge-2',
      name: 'Dr. Rebecca Liu',
      title: 'Director of AI Research',
      company: 'OpenAI',
      expertise: ['Artificial Intelligence', 'Machine Learning', 'Ethics', 'Research'],
      lookingFor: ['AI Innovation', 'Ethical Considerations', 'Practical Applications'],
      judgingDates: ['2024-01-18', '2024-01-19'],
      bio: 'AI researcher passionate about responsible AI development and deployment.'
    }
  ];

  // Speakers mock data
  const mockSpeakers: Speaker[] = [
    {
      id: 'speaker-1',
      name: 'David Kim',
      title: 'Founder & CEO',
      company: 'TechStars',
      topic: 'Building Startups That Scale',
      sessionDate: '2024-01-16',
      sessionTime: '18:00',
      description: 'Learn key strategies for taking your hackathon project to the next level.'
    },
    {
      id: 'speaker-2',
      name: 'Sarah Williams',
      title: 'Head of Developer Relations',
      company: 'Vercel',
      topic: 'Modern Web Development with Next.js',
      sessionDate: '2024-01-17',
      sessionTime: '16:00',
      description: 'Technical deep-dive into building fast, scalable web applications.'
    }
  ];

  // Help tickets mock data
  const mockTickets: HelpTicket[] = [
    {
      id: 'ticket-1',
      title: 'Need help with API integration',
      description: 'Struggling to connect our frontend to the payment API. Getting CORS errors.',
      category: 'tech',
      status: 'new',
      priority: 'medium',
      submittedBy: 'user-10',
      submittedAt: '2024-01-16T10:30:00Z'
    },
    {
      id: 'ticket-2',
      title: 'Team formation guidance',
      description: 'Looking for advice on finding the right co-founder for our healthcare project.',
      category: 'team',
      status: 'claimed',
      priority: 'low',
      submittedBy: 'user-11',
      submittedAt: '2024-01-16T09:15:00Z',
      claimedBy: 'mentor-1',
      claimedAt: '2024-01-16T09:30:00Z'
    },
    {
      id: 'ticket-3',
      title: 'Clarification on submission requirements',
      description: 'Do we need to deploy our app or is a local demo sufficient?',
      category: 'rules',
      status: 'resolved',
      priority: 'high',
      submittedBy: 'user-12',
      submittedAt: '2024-01-15T16:00:00Z',
      claimedBy: 'organizer-1',
      claimedAt: '2024-01-15T16:05:00Z',
      resolvedAt: '2024-01-15T16:15:00Z'
    }
  ];

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

          <TabsContent value="teams" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-medium">Teams</h2>
              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Team
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Create New Team</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Team Name</label>
                        <Input placeholder="Enter team name" />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Description</label>
                        <Textarea placeholder="What are you building?" rows={3} />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Track</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select track" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ai">AI & Machine Learning</SelectItem>
                            <SelectItem value="climate">Climate & Sustainability</SelectItem>
                            <SelectItem value="education">Education & Learning</SelectItem>
                            <SelectItem value="healthcare">Healthcare & Wellness</SelectItem>
                            <SelectItem value="fintech">Fintech</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Looking For</label>
                        <Input placeholder="Frontend Developer, UX Designer..." />
                      </div>
                      <Button className="w-full">Create Team</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Team Filter */}
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input placeholder="Search teams by name or skills..." className="pl-10" />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Teams</SelectItem>
                  <SelectItem value="recruiting">Recruiting</SelectItem>
                  <SelectItem value="full">Full Teams</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all-tracks">
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-tracks">All Tracks</SelectItem>
                  <SelectItem value="ai">AI & Machine Learning</SelectItem>
                  <SelectItem value="climate">Climate & Sustainability</SelectItem>
                  <SelectItem value="education">Education & Learning</SelectItem>
                  <SelectItem value="healthcare">Healthcare & Wellness</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Teams Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockTeams.map(team => (
                <Card key={team.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-lg">{team.name}</CardTitle>
                          <Badge className={
                            team.status === 'recruiting' ? 'bg-green-100 text-green-800' :
                            team.status === 'full' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }>
                            {team.status === 'recruiting' ? 'Recruiting' : 
                             team.status === 'full' ? 'Full' : 'Closed'}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{team.description}</p>
                        {team.track && (
                          <Badge variant="outline" className="text-xs mb-3">{team.track}</Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Team Members */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center justify-between">
                        Team Members
                        <span className="text-xs text-gray-500 font-normal">
                          {team.members.length}/{team.maxSize}
                        </span>
                      </h4>
                      <div className="flex items-center gap-2 mb-3">
                        {team.members.map(member => (
                          <div key={member.id} className="relative group">
                            <Avatar className="w-8 h-8 border-2 border-white">
                              <AvatarFallback className="text-xs">
                                {member.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                        ))}
                        {team.status === 'recruiting' && team.members.length < team.maxSize && (
                          <div className="w-8 h-8 border-2 border-dashed border-blue-300 rounded-full flex items-center justify-center text-blue-500">
                            <Plus className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-gray-600">
                        Led by <span className="font-medium">{team.leaderName}</span>
                      </p>
                    </div>

                    {/* Skills */}
                    {team.skills.length > 0 && (
                      <div>
                        <h5 className="text-xs font-medium text-gray-700 mb-2">Team Skills:</h5>
                        <div className="flex flex-wrap gap-1">
                          {team.skills.slice(0, 3).map(skill => (
                            <Badge key={skill} className="bg-green-50 text-green-700 border-green-200 text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {team.skills.length > 3 && (
                            <Badge variant="outline" className="text-xs">+{team.skills.length - 3}</Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Looking For */}
                    {team.lookingFor.length > 0 && (
                      <div>
                        <h5 className="text-xs font-medium text-gray-700 mb-2 flex items-center gap-1">
                          <UserPlus className="w-3 h-3" />
                          Looking For:
                        </h5>
                        <div className="flex flex-wrap gap-1">
                          {team.lookingFor.map(role => (
                            <Badge key={role} className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                              {role}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <Separator />

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <MessageSquare className="w-4 h-4 mr-1" />
                          Contact
                        </Button>
                        {team.status === 'recruiting' && (
                          <Button size="sm">
                            <UserPlus className="w-4 h-4 mr-1" />
                            Join Team
                          </Button>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">
                        Created {new Date(team.created).toLocaleDateString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="people" className="space-y-6">
            <div className="space-y-8">
              {/* Mentors Section */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-medium">Mentors</h2>
                  <p className="text-sm text-gray-600">{mockMentors.length} mentors available</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mockMentors.map(mentor => (
                    <Card key={mentor.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start gap-3">
                          <Avatar className="w-12 h-12">
                            <AvatarFallback className="bg-blue-100 text-blue-600 font-medium">
                              {mentor.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <CardTitle className="text-lg">{mentor.name}</CardTitle>
                            <p className="text-sm text-gray-600">{mentor.role}</p>
                            <p className="text-sm font-medium text-blue-600">{mentor.company}</p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm text-gray-600">{mentor.bio}</p>
                        
                        {/* Skills */}
                        <div>
                          <h5 className="text-xs font-medium text-gray-700 mb-2">Expertise:</h5>
                          <div className="flex flex-wrap gap-1">
                            {mentor.skills.slice(0, 3).map(skill => (
                              <Badge key={skill} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {mentor.skills.length > 3 && (
                              <Badge variant="outline" className="text-xs">+{mentor.skills.length - 3}</Badge>
                            )}
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-4 text-xs text-gray-600">
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-500" />
                            <span>{mentor.rating}</span>
                          </div>
                          <div>
                            {mentor.sessionsCompleted} sessions
                          </div>
                        </div>

                        {/* Availability */}
                        {mentor.nextAvailable && (
                          <div className="text-xs text-green-600">
                            Next available: {new Date(mentor.nextAvailable).toLocaleDateString('en-US', { 
                              month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                            })}
                          </div>
                        )}

                        <div className="flex gap-2 pt-2">
                          <Button size="sm" className="flex-1">
                            <Calendar className="w-4 h-4 mr-1" />
                            Book Session
                          </Button>
                          <Button size="sm" variant="outline">
                            <MessageSquare className="w-4 h-4 mr-1" />
                            Message
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Judges Section */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-medium">Judges</h2>
                  <p className="text-sm text-gray-600">{mockJudges.length} judges</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {mockJudges.map(judge => (
                    <Card key={judge.id}>
                      <CardHeader className="pb-3">
                        <div className="flex items-start gap-3">
                          <Avatar className="w-12 h-12">
                            <AvatarFallback className="bg-purple-100 text-purple-600 font-medium">
                              {judge.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <CardTitle className="text-lg">{judge.name}</CardTitle>
                            <p className="text-sm text-gray-600">{judge.title}</p>
                            <p className="text-sm font-medium text-purple-600">{judge.company}</p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm text-gray-600">{judge.bio}</p>
                        
                        {/* Expertise */}
                        <div>
                          <h5 className="text-xs font-medium text-gray-700 mb-2">Expertise:</h5>
                          <div className="flex flex-wrap gap-1">
                            {judge.expertise.map(skill => (
                              <Badge key={skill} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Looking For */}
                        <div>
                          <h5 className="text-xs font-medium text-gray-700 mb-2">Looking For:</h5>
                          <div className="flex flex-wrap gap-1">
                            {judge.lookingFor.map(criteria => (
                              <Badge key={criteria} className="bg-green-50 text-green-700 border-green-200 text-xs">
                                {criteria}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Judging Dates */}
                        <div className="text-xs text-gray-600">
                          Judging: {judge.judgingDates.map(date => 
                            new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                          ).join(', ')}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Speakers Section */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-medium">Speakers</h2>
                  <p className="text-sm text-gray-600">{mockSpeakers.length} sessions</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {mockSpeakers.map(speaker => (
                    <Card key={speaker.id}>
                      <CardHeader className="pb-3">
                        <div className="flex items-start gap-3">
                          <Avatar className="w-12 h-12">
                            <AvatarFallback className="bg-green-100 text-green-600 font-medium">
                              {speaker.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <CardTitle className="text-lg">{speaker.name}</CardTitle>
                            <p className="text-sm text-gray-600">{speaker.title}</p>
                            <p className="text-sm font-medium text-green-600">{speaker.company}</p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-1">{speaker.topic}</h4>
                          <p className="text-sm text-gray-600">{speaker.description}</p>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(speaker.sessionDate).toLocaleDateString('en-US', { 
                              month: 'short', day: 'numeric' 
                            })}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{speaker.sessionTime}</span>
                          </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Button size="sm" className="flex-1">
                            <Calendar className="w-4 h-4 mr-1" />
                            Add to Calendar
                          </Button>
                          <Button size="sm" variant="outline">
                            <Play className="w-4 h-4 mr-1" />
                            Watch Live
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="help" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Submit Ticket Form */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <HelpCircle className="w-5 h-5 text-blue-500" />
                      Get Help
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Category</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tech">Technical</SelectItem>
                          <SelectItem value="design">Design</SelectItem>
                          <SelectItem value="product">Product</SelectItem>
                          <SelectItem value="team">Team</SelectItem>
                          <SelectItem value="rules">Rules</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">Title</label>
                      <Input placeholder="Brief description of your issue" />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">Description</label>
                      <Textarea placeholder="Provide more details about your question or issue..." rows={4} />
                    </div>
                    
                    <Button className="w-full">
                      <Send className="w-4 h-4 mr-2" />
                      Submit Ticket
                    </Button>

                    <Separator />

                    {/* Quick Links */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-900">Quick Links</h4>
                      <Button variant="ghost" size="sm" className="w-full justify-start">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Discord Help Channel
                      </Button>
                      <Button variant="ghost" size="sm" className="w-full justify-start">
                        <Mail className="w-4 h-4 mr-2" />
                        Email Support
                      </Button>
                      <Button variant="ghost" size="sm" className="w-full justify-start">
                        <BookOpen className="w-4 h-4 mr-2" />
                        Documentation
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Ticket Board */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Help Desk Board</CardTitle>
                      <div className="flex gap-2">
                        <Select defaultValue="all">
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Tickets</SelectItem>
                            <SelectItem value="new">New</SelectItem>
                            <SelectItem value="claimed">In Progress</SelectItem>
                            <SelectItem value="resolved">Resolved</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockTickets.map(ticket => (
                        <Card key={ticket.id} className="border-l-4 border-l-blue-500">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900 mb-1">{ticket.title}</h4>
                                <p className="text-sm text-gray-600 mb-2">{ticket.description}</p>
                                <div className="flex items-center gap-3 text-xs text-gray-500">
                                  <Badge variant="outline" className="text-xs">
                                    {ticket.category}
                                  </Badge>
                                  <span>
                                    {new Date(ticket.submittedAt).toLocaleDateString('en-US', { 
                                      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                                    })}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge className={
                                  ticket.priority === 'high' ? 'bg-red-100 text-red-800' :
                                  ticket.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-green-100 text-green-800'
                                }>
                                  {ticket.priority}
                                </Badge>
                                <Badge className={
                                  ticket.status === 'new' ? 'bg-blue-100 text-blue-800' :
                                  ticket.status === 'claimed' ? 'bg-orange-100 text-orange-800' :
                                  'bg-green-100 text-green-800'
                                }>
                                  {ticket.status === 'new' ? 'New' :
                                   ticket.status === 'claimed' ? 'In Progress' : 'Resolved'}
                                </Badge>
                              </div>
                            </div>
                            
                            {ticket.status === 'claimed' && ticket.claimedBy && (
                              <div className="text-xs text-gray-600 mb-2">
                                Claimed by mentor • {new Date(ticket.claimedAt!).toLocaleDateString()}
                              </div>
                            )}
                            
                            {ticket.status === 'resolved' && ticket.resolvedAt && (
                              <div className="text-xs text-green-600 mb-2">
                                Resolved • {new Date(ticket.resolvedAt).toLocaleDateString()}
                              </div>
                            )}

                            <div className="flex gap-2">
                              {ticket.status === 'new' && (
                                <Button size="sm" variant="outline">
                                  <Shield className="w-4 h-4 mr-1" />
                                  Claim Ticket
                                </Button>
                              )}
                              <Button size="sm" variant="ghost">
                                <MessageSquare className="w-4 h-4 mr-1" />
                                Comment
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
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