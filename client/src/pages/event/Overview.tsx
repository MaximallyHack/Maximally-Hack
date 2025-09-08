import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEvent } from '@/contexts/EventContext';
import { useAuth } from '@/contexts/AuthContext';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabaseApi } from '@/lib/supabaseApi';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useConfetti } from '@/components/ui/confetti';
import { Link } from 'react-router-dom';
import Countdown from '@/components/event/Countdown';
import { 
  CheckCircle, Clock, Users, Trophy, Target, Rocket, Zap,
  Calendar, MapPin, Globe, ExternalLink, MessageSquare,
  BookOpen, Play, Share2, Heart, Star, AlertCircle
} from 'lucide-react';
import { SiDiscord, SiGithub } from 'react-icons/si';

const liveAnnouncements = [
  {
    id: '1',
    title: '🎉 Registration Extended!',
    message: 'Good news! We\'ve extended registration by 24 hours due to popular demand.',
    timestamp: '2 hours ago',
    priority: 'high'
  },
  {
    id: '2', 
    title: '💡 Mentor Office Hours',
    message: 'AI experts will be available for 1-on-1 sessions starting tomorrow.',
    timestamp: '5 hours ago',
    priority: 'medium'
  },
  {
    id: '3',
    title: '🔗 API Keys Available',
    message: 'Free OpenAI and Anthropic API credits are now available in the Discord.',
    timestamp: '1 day ago',
    priority: 'low'
  }
];

const getQuickStartItems = (user: any, event: any) => [
  {
    id: '1',
    title: 'Join the Discord Community',
    description: 'Connect with 1,500+ builders and get real-time updates',
    completed: false,
    action: 'Join Discord',
    link: event.links?.discord,
    icon: <SiDiscord className="w-4 h-4" />
  },
  {
    id: '2',
    title: 'Form or Join a Team',
    description: 'Find teammates with complementary skills (1-4 members)',
    completed: user?.teams?.length > 0,
    action: 'Browse Teams',
    link: `/e/${event.slug}/teams`,
    icon: <Users className="w-4 h-4" />
  },
  {
    id: '3',
    title: 'Read Rules & Judging Criteria',
    description: 'Understand scoring: Innovation 25%, Execution 25%, Design 25%, Impact 25%',
    completed: false,
    action: 'View Rules',
    link: `/e/${event.slug}/rules`,
    icon: <BookOpen className="w-4 h-4" />
  },
  {
    id: '4',
    title: 'Submit Your Project',
    description: 'Upload your project and demo video (max 2 mins)',
    completed: false,
    action: event.status === 'active' ? 'Submit Now' : 'Coming Soon',
    link: event.status === 'active' ? `/e/${event.slug}/submit` : null,
    icon: <Rocket className="w-4 h-4" />,
    disabled: event.status !== 'active'
  }
];

export default function Overview() {
  const { event } = useEvent();
  const { user } = useAuth();
  const { user: supabaseUser } = useSupabaseAuth();
  const { toast } = useToast();
  const { trigger: triggerConfetti, Confetti } = useConfetti();
  const queryClient = useQueryClient();
  const [showTeamDialog, setShowTeamDialog] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [teamDescription, setTeamDescription] = useState('');

  const { data: userRegistrations = [] } = useQuery({
    queryKey: ['user-registrations', supabaseUser?.id],
    queryFn: () => supabaseApi.getUserEventRegistrations(),
    enabled: !!supabaseUser?.id,
  });

  const isRegistered = event ? userRegistrations.includes(event.id) : false;

  const registerMutation = useMutation({
    mutationFn: (eventId: string) => supabaseApi.registerForEvent(eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-registrations'] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
      triggerConfetti();
      toast({
        title: 'Registration Successful! 🎉',
        description: `You're now registered for ${event?.title}. Get ready to hack!`,
      });
    },
    onError: (error) => {
      console.error('Registration error:', error);
      toast({
        title: 'Registration Failed',
        description: 'Please try again or contact support if the problem persists.',
        variant: 'destructive'
      });
    }
  });

  const unregisterMutation = useMutation({
    mutationFn: (eventId: string) => supabaseApi.unregisterFromEvent(eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-registrations'] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast({
        title: 'Unregistered Successfully',
        description: `You've been removed from ${event?.title}.`,
      });
    },
    onError: (error) => {
      console.error('Unregistration error:', error);
      toast({
        title: 'Unregistration Failed',
        description: 'Please try again or contact support.',
        variant: 'destructive'
      });
    }
  });

  const handleRegistration = () => {
    if (!event || !supabaseUser) {
      toast({
        title: 'Please log in',
        description: 'You need to be logged in to register for events.',
        variant: 'destructive'
      });
      return;
    }

    if (isRegistered) {
      unregisterMutation.mutate(event.id);
    } else {
      registerMutation.mutate(event.id);
    }
  };

  if (!event) return null;

  const quickStartItems = getQuickStartItems(user, event);
  const completedItems = quickStartItems.filter(item => item.completed).length;
  const progressPercentage = (completedItems / quickStartItems.length) * 100;

  const handleQuickAction = (item: any) => {
    if (item.link) {
      if (item.link.startsWith('http')) {
        window.open(item.link, '_blank');
      }
    }
    
    // Simulate completing actions
    if (item.id === '1') {
      toast({
        title: '🎉 Joined Discord!',
        description: 'Welcome to the community! Check #general for updates.'
      });
    }
  };

  const handleCreateTeam = () => {
    if (!teamName.trim()) {
      toast({
        title: 'Team name required',
        description: 'Please enter a name for your team.',
        variant: 'destructive'
      });
      return;
    }

    toast({
      title: '🚀 Team Created!',
      description: `"${teamName}" is ready to hack! Invite your teammates.`
    });
    triggerConfetti();
    setShowTeamDialog(false);
    setTeamName('');
    setTeamDescription('');
  };

  const shareEvent = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: event.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: '📋 Link Copied!',
        description: 'Share this amazing event with your friends!'
      });
    }
  };

  return (
    <div className="space-y-8">
      <Confetti />
      
      {/* Live Status & Countdown */}
      {(event.status === 'upcoming' || event.status === 'registration_open') && (
        <section className="grid md:grid-cols-2 gap-6">
          <Countdown 
            targetDate={event.startDate} 
            label={event.status === 'registration_open' ? 'Event starts in:' : 'Registration opens in:'}
          />
          
          <Card className="bg-gradient-to-br from-coral/10 to-sky/10 border-coral/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-coral">
                <Zap className="w-5 h-5" />
                Live Updates
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {liveAnnouncements.map(announcement => (
                <div key={announcement.id} className="flex gap-3">
                  <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                    announcement.priority === 'high' ? 'bg-coral' :
                    announcement.priority === 'medium' ? 'bg-yellow' : 'bg-sky'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{announcement.title}</p>
                    <p className="text-xs text-muted-foreground">{announcement.timestamp}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>
      )}

      {/* Hero Description with CTA */}
      <section className="relative">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold text-foreground">About the Event</h2>
          <div className="flex gap-2">
            {event.status === 'registration_open' && (
              <Button 
                onClick={handleRegistration}
                disabled={registerMutation.isPending || unregisterMutation.isPending}
                className={isRegistered ? 'bg-red-500 hover:bg-red-600' : 'bg-coral hover:bg-coral/80'}
              >
                {registerMutation.isPending || unregisterMutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {isRegistered ? 'Unregistering...' : 'Registering...'}
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    {isRegistered ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Unregister
                      </>
                    ) : (
                      <>
                        <Rocket className="w-4 h-4" />
                        Register Now
                      </>
                    )}
                  </span>
                )}
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={shareEvent}>
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <Heart className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="prose prose-lg max-w-none">
              <p className="text-muted-foreground leading-relaxed mb-6">
                {event.longDescription || event.description}
              </p>
              
              {/* Why Join Section */}
              {event.whyJoin && (
                <div className="bg-gradient-to-r from-mint/20 to-sky/20 rounded-xl p-6 my-6">
                  <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Star className="w-5 h-5 text-mint" />
                    Why Join This Event?
                  </h3>
                  <ul className="space-y-2">
                    {event.whyJoin.map((reason: string, index: number) => (
                      <li key={index} className="flex items-start gap-3 text-sm text-muted-foreground">
                        <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
          
          {/* Tracks & Quick Info */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Event Tracks</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {event.tracks.map((track: string, index: number) => (
                  <Badge key={index} variant="secondary" className="mr-2 mb-2">
                    {track}
                  </Badge>
                ))}
              </CardContent>
            </Card>
            
            <Card className="bg-yellow/10 border-yellow/30">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-yellow" />
                  <span className="font-medium text-sm">Registration Status</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {isRegistered ? 
                    '✅ You\'re registered! Time to find your team.' :
                    '⏰ Limited spots remaining. Register now!'
                  }
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Quick Start Guide */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">Quick Start Guide</h2>
          <div className="flex items-center gap-2">
            <Progress value={progressPercentage} className="w-24" />
            <span className="text-sm text-muted-foreground">{completedItems}/{quickStartItems.length}</span>
          </div>
        </div>
        
        <div className="grid gap-4">
          {quickStartItems.map((item, index) => (
            <Card key={item.id} className={`p-4 transition-all duration-200 ${
              item.completed ? 'bg-success/5 border-success/30' : 'hover:shadow-md'
            }`}>
              <div className="flex items-start gap-4">
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  item.completed ? 'bg-success text-white' : 'bg-muted text-muted-foreground'
                }`}>
                  {item.completed ? <CheckCircle className="w-4 h-4" /> : item.icon || (index + 1)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-foreground">{item.title}</h3>
                    {item.completed && (
                      <Badge variant="secondary" className="bg-success/20 text-success text-xs">
                        Complete
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                  
                  {item.id === '2' && !item.completed ? (
                    <div className="flex gap-2">
                      <Dialog open={showTeamDialog} onOpenChange={setShowTeamDialog}>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline">
                            Create Team
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Create Your Team</DialogTitle>
                            <DialogDescription>
                              Start your hackathon journey by creating a team. You can invite up to 3 more members later.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div>
                              <label className="text-sm font-medium">Team Name</label>
                              <Input
                                placeholder="e.g., AI Innovators"
                                value={teamName}
                                onChange={(e) => setTeamName(e.target.value)}
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium">Description (Optional)</label>
                              <Textarea
                                placeholder="Tell others about your project idea..."
                                value={teamDescription}
                                onChange={(e) => setTeamDescription(e.target.value)}
                              />
                            </div>
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setShowTeamDialog(false)}>
                              Cancel
                            </Button>
                            <Button onClick={handleCreateTeam}>
                              Create Team
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                      
                      {item.link && (
                        <Link to={item.link}>
                          <Button size="sm">
                            {item.action}
                          </Button>
                        </Link>
                      )}
                    </div>
                  ) : (
                    <Button 
                      size="sm" 
                      variant={item.completed ? "secondary" : "outline"}
                      onClick={() => handleQuickAction(item)}
                      disabled={item.disabled}
                      asChild={!!item.link && !item.link.startsWith('http')}
                    >
                      {item.link && !item.link.startsWith('http') ? (
                        <Link to={item.link}>
                          {item.action}
                        </Link>
                      ) : (
                        <span>{item.action}</span>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Event Highlights */}
      <section>
        <h2 className="text-2xl font-bold text-foreground mb-6">Event Highlights</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <Trophy className="h-4 w-4 text-coral" />
              <CardTitle className="text-sm font-medium ml-2">Prize Pool</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${event.prizePool.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Distributed across multiple tracks</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <Users className="h-4 w-4 text-sky" />
              <CardTitle className="text-sm font-medium ml-2">Participants</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{event.participantCount || 0}</div>
              <p className="text-xs text-muted-foreground">Registered and ready to hack</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <Clock className="h-4 w-4 text-mint" />
              <CardTitle className="text-sm font-medium ml-2">Duration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">48 hours</div>
              <p className="text-xs text-muted-foreground">Non-stop innovation</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Key Information */}
      <section>
        <h2 className="text-2xl font-bold text-foreground mb-6">Key Information</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Event Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Date & Time</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Location</p>
                  <p className="text-sm text-muted-foreground">{event.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Globe className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Format</p>
                  <p className="text-sm text-muted-foreground">
                    {event.location === 'Virtual' ? 'Online Event' : 'In-Person Event'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Resources</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {event.links?.discord && (
                <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                  <a href={event.links.discord} target="_blank" rel="noopener noreferrer">
                    <SiDiscord className="w-4 h-4 mr-2" />
                    Discord Community
                  </a>
                </Button>
              )}
              {event.links?.devpost && (
                <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                  <a href={event.links.devpost} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Devpost Page
                  </a>
                </Button>
              )}
              {event.links?.website && (
                <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                  <a href={event.links.website} target="_blank" rel="noopener noreferrer">
                    <Globe className="w-4 h-4 mr-2" />
                    Event Website
                  </a>
                </Button>
              )}
              <Link to={`/e/${event.slug}/resources`}>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Resources & Tools
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}