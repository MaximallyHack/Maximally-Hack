import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { CrayonSquiggle } from "@/components/ui/floating-elements";
import ProjectCard from "@/components/event/ProjectCard";
import EventCard from "@/components/event/EventCard";
import { 
  MapPin,
  Calendar,
  ExternalLink,
  Github,
  Linkedin,
  Twitter,
  Globe,
  Trophy,
  Star,
  Users,
  Target,
  Award,
  Code,
  Briefcase,
  Mail
} from "lucide-react";
import { api } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import type { User } from "@/lib/api";

export default function Profile() {
  const { handle } = useParams();
  const [activeTab, setActiveTab] = useState("projects");

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['user', handle],
    queryFn: () => api.getUserByUsername(handle!),
    enabled: !!handle,
  });

  const { data: userProjects, isLoading: projectsLoading } = useQuery({
    queryKey: ['user-projects', user?.id],
    queryFn: async () => {
      if (!user?.projects) return [];
      const projects = await api.getFeaturedProjects();
      return projects.filter(p => user.projects.includes(p.id));
    },
    enabled: !!user,
  });

  const { data: userEvents, isLoading: eventsLoading } = useQuery({
    queryKey: ['user-events', user?.id],
    queryFn: async () => {
      // Mock user's participated events
      const events = await api.getEvents();
      return events.slice(0, 6); // Mock participation
    },
    enabled: !!user,
  });

  if (userLoading) {
    return (
      <div className="min-h-screen bg-cream py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="bg-gradient-to-br from-sky/20 via-coral/10 to-mint/20 rounded-2xl p-8 mb-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-32 h-32 bg-soft-gray rounded-full"></div>
                <div className="flex-1 text-center md:text-left">
                  <div className="h-8 bg-soft-gray rounded mb-2 w-48"></div>
                  <div className="h-4 bg-soft-gray rounded mb-4 w-32"></div>
                  <div className="h-4 bg-soft-gray rounded w-64"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <Card className="bg-white rounded-2xl p-8 shadow-soft border border-soft-gray text-center">
          <div className="text-6xl mb-4">👤</div>
          <h1 className="font-heading font-bold text-2xl text-text-dark mb-2">User Not Found</h1>
          <p className="text-text-muted mb-6">The profile you're looking for doesn't exist.</p>
          <Button onClick={() => window.history.back()} className="bg-coral text-white hover:bg-coral/80">
            Go Back
          </Button>
        </Card>
      </div>
    );
  }

  const formatJoinDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'participant': return 'coral';
      case 'organizer': return 'mint';
      case 'jury-member': return 'sky';
      default: return 'soft-gray';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'participant': return <Code className="w-4 h-4" />;
      case 'organizer': return <Calendar className="w-4 h-4" />;
      case 'jury-member': return <Star className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-cream py-8" data-testid="profile-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-gradient-to-br from-sky/20 via-coral/10 to-mint/20 rounded-2xl p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <Avatar className="w-32 h-32">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-sky text-white text-4xl">
                {user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                <h1 className="font-heading font-bold text-3xl text-text-dark">{user.name}</h1>
                <Badge className={`bg-${getRoleColor(user.role)}/20 text-${getRoleColor(user.role)} px-3 py-1 rounded-full text-sm border-0 flex items-center gap-2`}>
                  {getRoleIcon(user.role)}
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </Badge>
              </div>
              
              <p className="text-text-muted text-lg mb-4">@{user.username}</p>
              
              {user.bio && (
                <p className="text-text-muted mb-4 max-w-2xl">{user.bio}</p>
              )}
              
              <div className="flex items-center justify-center md:justify-start gap-4 text-text-muted text-sm">
                {user.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{user.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {formatJoinDate(user.joinDate)}</span>
                </div>
              </div>
            </div>
            
            {/* Social Links */}
            <div className="flex gap-3">
              {user.github && (
                <Button variant="outline" size="icon" className="border-sky text-sky hover:bg-sky/10" asChild>
                  <a href={`https://github.com/${user.github}`} target="_blank" rel="noopener noreferrer" data-testid="button-github">
                    <Github className="w-4 h-4" />
                  </a>
                </Button>
              )}
              {user.linkedin && (
                <Button variant="outline" size="icon" className="border-sky text-sky hover:bg-sky/10" asChild>
                  <a href={`https://linkedin.com/in/${user.linkedin}`} target="_blank" rel="noopener noreferrer" data-testid="button-linkedin">
                    <Linkedin className="w-4 h-4" />
                  </a>
                </Button>
              )}
              {user.twitter && (
                <Button variant="outline" size="icon" className="border-sky text-sky hover:bg-sky/10" asChild>
                  <a href={`https://twitter.com/${user.twitter}`} target="_blank" rel="noopener noreferrer" data-testid="button-twitter">
                    <Twitter className="w-4 h-4" />
                  </a>
                </Button>
              )}
              {user.website && (
                <Button variant="outline" size="icon" className="border-coral text-coral hover:bg-coral/10" asChild>
                  <a href={user.website} target="_blank" rel="noopener noreferrer" data-testid="button-website">
                    <Globe className="w-4 h-4" />
                  </a>
                </Button>
              )}
              <Button className="bg-coral text-white hover:bg-coral/80 rounded-full px-6" data-testid="button-contact">
                <Mail className="w-4 h-4 mr-2" />
                Contact
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white rounded-2xl p-6 shadow-soft border border-soft-gray text-center">
            <Trophy className="w-8 h-8 text-coral mx-auto mb-2" />
            <div className="text-2xl font-bold text-coral">{user.stats.wins}</div>
            <div className="text-sm text-text-muted">Wins</div>
          </Card>
          
          <Card className="bg-white rounded-2xl p-6 shadow-soft border border-soft-gray text-center">
            <Star className="w-8 h-8 text-yellow mx-auto mb-2" />
            <div className="text-2xl font-bold text-yellow">{user.stats.finals}</div>
            <div className="text-sm text-text-muted">Finals</div>
          </Card>
          
          {user.role === 'participant' && (
            <Card className="bg-white rounded-2xl p-6 shadow-soft border border-soft-gray text-center">
              <Target className="w-8 h-8 text-sky mx-auto mb-2" />
              <div className="text-2xl font-bold text-sky">{user.stats.hackathonsParticipated}</div>
              <div className="text-sm text-text-muted">Hackathons</div>
            </Card>
          )}
          
          {user.role === 'organizer' && (
            <Card className="bg-white rounded-2xl p-6 shadow-soft border border-soft-gray text-center">
              <Calendar className="w-8 h-8 text-mint mx-auto mb-2" />
              <div className="text-2xl font-bold text-mint">{user.stats.organized}</div>
              <div className="text-sm text-text-muted">Organized</div>
            </Card>
          )}
          
          {(user.role === 'judge' || user.stats.judged > 0) && (
            <Card className="bg-white rounded-2xl p-6 shadow-soft border border-soft-gray text-center">
              <Award className="w-8 h-8 text-mint mx-auto mb-2" />
              <div className="text-2xl font-bold text-mint">{user.stats.judged}</div>
              <div className="text-sm text-text-muted">Judged</div>
            </Card>
          )}
        </div>

        {/* Profile Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white rounded-xl border border-soft-gray p-1 mb-8">
            <TabsTrigger value="projects" className="rounded-lg" data-testid="tab-projects">
              <Code className="w-4 h-4 mr-2" />
              Projects
            </TabsTrigger>
            <TabsTrigger value="hackathons" className="rounded-lg" data-testid="tab-hackathons">
              <Calendar className="w-4 h-4 mr-2" />
              Events
            </TabsTrigger>
            <TabsTrigger value="badges" className="rounded-lg" data-testid="tab-badges">
              <Award className="w-4 h-4 mr-2" />
              Badges
            </TabsTrigger>
            <TabsTrigger value="about" className="rounded-lg" data-testid="tab-about">
              <Users className="w-4 h-4 mr-2" />
              About
            </TabsTrigger>
          </TabsList>

          {/* Projects Tab */}
          <TabsContent value="projects">
            {projectsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl p-6 shadow-soft border border-soft-gray">
                    <Skeleton className="h-4 w-20 mb-4" />
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-4" />
                    <div className="flex gap-2 mb-4">
                      <Skeleton className="h-6 w-12" />
                      <Skeleton className="h-6 w-16" />
                    </div>
                  </div>
                ))}
              </div>
            ) : userProjects && userProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} showScore />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">💻</div>
                <h3 className="font-heading font-semibold text-xl text-text-dark mb-2">No projects yet</h3>
                <p className="text-text-muted">
                  {user.role === 'participant' 
                    ? "Projects will appear here when this user submits to hackathons"
                    : "No projects have been shared publicly"
                  }
                </p>
              </div>
            )}
          </TabsContent>

          {/* Hackathons Tab */}
          <TabsContent value="hackathons">
            {eventsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl p-6 shadow-soft border border-soft-gray">
                    <Skeleton className="h-4 w-20 mb-4" />
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-4" />
                  </div>
                ))}
              </div>
            ) : userEvents && userEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userEvents.map((event) => (
                  <EventCard key={event.id} event={event} showActions={false} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">📅</div>
                <h3 className="font-heading font-semibold text-xl text-text-dark mb-2">No events yet</h3>
                <p className="text-text-muted">
                  {user.role === 'participant'
                    ? "Hackathons this user has participated in will appear here"
                    : user.role === 'organizer'
                    ? "Events organized by this user will appear here"
                    : "Events this judge has evaluated will appear here"
                  }
                </p>
              </div>
            )}
          </TabsContent>

          {/* Badges Tab */}
          <TabsContent value="badges">
            <Card className="bg-white rounded-2xl p-8 shadow-soft border border-soft-gray">
              <div className="text-center mb-8">
                <h2 className="font-heading font-bold text-2xl text-text-dark mb-4">Achievement Badges</h2>
                <CrayonSquiggle className="mx-auto mb-6" />
                <p className="text-text-muted">Celebrating milestones and accomplishments</p>
              </div>

              {user.badges && user.badges.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {user.badges.map((badge, index) => (
                    <div key={index} className="text-center p-6 bg-soft-gray/30 rounded-2xl hover-scale">
                      <div className="text-4xl mb-3">
                        {badge.includes('Winner') || badge.includes('First') ? '🏆' :
                         badge.includes('Finalist') || badge.includes('Place') ? '🥇' :
                         badge.includes('Community') || badge.includes('Contributor') ? '❤️' :
                         badge.includes('AI') || badge.includes('Innovation') ? '🤖' :
                         badge.includes('Design') || badge.includes('Master') ? '🎨' :
                         badge.includes('Expert') || badge.includes('Excellence') ? '⭐' :
                         '🏅'}
                      </div>
                      <h3 className="font-heading font-semibold text-lg text-text-dark mb-1">{badge}</h3>
                      <p className="text-text-muted text-sm">
                        Earned {formatJoinDate(user.joinDate)}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">🏅</div>
                  <h3 className="font-heading font-semibold text-xl text-text-dark mb-2">No badges yet</h3>
                  <p className="text-text-muted">Badges are earned by participating in hackathons and achieving milestones</p>
                </div>
              )}
            </Card>
          </TabsContent>

          {/* About Tab */}
          <TabsContent value="about">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card className="bg-white rounded-2xl p-8 shadow-soft border border-soft-gray">
                  <h2 className="font-heading font-bold text-2xl text-text-dark mb-6">About {user.name}</h2>
                  
                  {user.bio ? (
                    <div className="prose max-w-none">
                      <p className="text-text-muted mb-6">{user.bio}</p>
                    </div>
                  ) : (
                    <p className="text-text-muted italic">This user hasn't added a bio yet.</p>
                  )}

                  {/* Skills */}
                  {user.skills && user.skills.length > 0 && (
                    <div className="mt-8">
                      <h3 className="font-heading font-semibold text-xl text-text-dark mb-4">Skills</h3>
                      <div className="flex flex-wrap gap-3">
                        {user.skills.map(skill => (
                          <Badge key={skill} className="bg-sky/20 text-sky px-3 py-2 rounded-lg text-sm border-0">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Expertise (for judges) */}
                  {user.role === 'judge' && 'expertise' in user && user.expertise && (
                    <div className="mt-8">
                      <h3 className="font-heading font-semibold text-xl text-text-dark mb-4">Expertise</h3>
                      <div className="flex flex-wrap gap-3">
                        {(user as any).expertise.map((expertise: string) => (
                          <Badge key={expertise} className="bg-mint/20 text-mint px-3 py-2 rounded-lg text-sm border-0">
                            {expertise}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              </div>

              <div className="space-y-6">
                {/* Quick Stats */}
                <Card className="bg-white rounded-2xl p-6 shadow-soft border border-soft-gray">
                  <h3 className="font-heading font-semibold text-lg text-text-dark mb-4">Profile Stats</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-text-muted">Profile Views</span>
                      <span className="font-semibold text-coral">1,247</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-text-muted">Projects Liked</span>
                      <span className="font-semibold text-sky">156</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-text-muted">Followers</span>
                      <span className="font-semibold text-mint">89</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-text-muted">Following</span>
                      <span className="font-semibold text-yellow">42</span>
                    </div>
                  </div>
                </Card>

                {/* Recent Activity */}
                <Card className="bg-white rounded-2xl p-6 shadow-soft border border-soft-gray">
                  <h3 className="font-heading font-semibold text-lg text-text-dark mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-coral rounded-full"></div>
                      <span className="text-text-muted text-sm">Joined AI for Good Challenge</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-sky rounded-full"></div>
                      <span className="text-text-muted text-sm">Created team "AI Innovators"</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-mint rounded-full"></div>
                      <span className="text-text-muted text-sm">Updated profile</span>
                    </div>
                  </div>
                </Card>

                {/* Contact Info */}
                <Card className="bg-white rounded-2xl p-6 shadow-soft border border-soft-gray">
                  <h3 className="font-heading font-semibold text-lg text-text-dark mb-4">Contact</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-text-muted" />
                      <span className="text-text-muted text-sm">{user.email}</span>
                    </div>
                    {user.location && (
                      <div className="flex items-center gap-3">
                        <MapPin className="w-4 h-4 text-text-muted" />
                        <span className="text-text-muted text-sm">{user.location}</span>
                      </div>
                    )}
                  </div>
                  
                  <Button className="w-full mt-4 bg-coral text-white hover:bg-coral/80 rounded-full" data-testid="button-send-message">
                    <Mail className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
