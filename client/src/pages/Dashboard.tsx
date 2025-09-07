import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { 
  Calendar, Clock, MapPin, ExternalLink, Plus, Code, 
  Trophy, Eye, Settings, Edit3, ArrowRight, Globe,
  Github, Sparkles, CheckCircle, AlertCircle
} from "lucide-react";

export default function Dashboard() {
  const { user, unregisterFromEvent } = useAuth();
  const { toast } = useToast();

  const { data: events } = useQuery({
    queryKey: ['events'],
    queryFn: api.getEvents,
  });

  const { data: submissions } = useQuery({
    queryKey: ['submissions'],
    queryFn: () => api.getSubmissions(),
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-medium text-gray-900 mb-4">Please log in</h1>
          <Link to="/login">
            <Button>Go to Login</Button>
          </Link>
        </div>
      </div>
    );
  }

  const registeredEvents = events?.filter(event => 
    user.registeredEvents.includes(event.id)
  ) || [];

  const upcomingEvents = registeredEvents.filter(event => 
    event.status === 'upcoming' || event.status === 'registration_open'
  );

  const activeEvents = registeredEvents.filter(event => 
    event.status === 'active'
  );

  // Get user's projects
  const userProjects = submissions?.filter(submission => 
    submission.submittedBy === user.id
  ) || [];

  const handleUnregister = async (eventId: string, eventTitle: string) => {
    const result = await unregisterFromEvent(eventId);
    if (result.success) {
      toast({
        title: "Unregistered successfully",
        description: `You've been removed from ${eventTitle}`,
      });
    }
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

  const getProjectStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'judging': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'judged': return <Trophy className="w-4 h-4 text-blue-500" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 ">
          <div className="flex items-center justify-between mb-4">
            <div className="">
              <h1 className="text-3xl font-medium text-gray-900 dark:text-white">
                Welcome back, {user.fullName || user.username}
              </h1>
              <p className="text-gray-700 dark:text-gray-300 mt-1">Track your hackathons and projects</p>
            </div>
            <Link to="/profile">
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </Link>
          </div>
        </div>

        <div className="space-y-8">
          {/* My Hackathons Section */}
          <section>
            <div className="flex items-center justify-between mb-6 text-gray-900 dark:text-white">
              <h2 className="text-xl font-medium ">My Hackathons</h2>
              <Link to="/explore">
                <Button variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Browse Hackathons
                </Button>
              </Link>
            </div>

            {registeredEvents.length === 0 ? (
              <Card className="text-center py-12 ">
                <CardContent>
                  <div className="text-6xl mb-4">🚀</div>
                  <h3 className="text-xl font-medium mb-2 text-gray-900 dark:text-white">No hackathons yet</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-6">Start your journey by registering for hackathons</p>
                  <Link to="/explore">
                    <Button>
                      Explore Hackathons
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {/* Active Events */}
                {activeEvents.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Active Now
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {activeEvents.map(event => (
                        <Card key={event.id} className="hover:shadow-lg transition-shadow border-green-200">
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <CardTitle className="text-lg text-gray-900">{event.title}</CardTitle>
                                <p className="text-sm text-gray-600 mt-1">{event.tagline}</p>
                              </div>
                              <Badge className="bg-green-100 text-green-800 border-green-200">
                                Active
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  <span>{formatDate(event.startDate)} - {formatDate(event.endDate)}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  <span>{event.location}</span>
                                </div>
                              </div>
                              <div className="flex items-center justify-between pt-2">
                                <Link to={`/e/${event.slug}`}>
                                  <Button size="sm" variant="outline">
                                    <Eye className="w-4 h-4 mr-1" />
                                    View Event
                                  </Button>
                                </Link>
                                <Link to={`/e/${event.slug}/submit`}>
                                  <Button size="sm">
                                    <Code className="w-4 h-4 mr-1" />
                                    Submit Project
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

                {/* Upcoming Events */}
                {upcomingEvents.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      Upcoming
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {upcomingEvents.map(event => (
                        <Card key={event.id} className="hover:shadow-lg transition-shadow">
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <CardTitle className="text-lg text-gray-900">{event.title}</CardTitle>
                                <p className="text-sm text-gray-600 mt-1">{event.tagline}</p>
                              </div>
                              <Badge className={getStatusColor(event.status)}>
                                {event.status === 'registration_open' ? 'Registration Open' : 'Upcoming'}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  <span>{formatDate(event.startDate)} - {formatDate(event.endDate)}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  <span>{event.location}</span>
                                </div>
                              </div>
                              <div className="flex items-center justify-between pt-2">
                                <Link to={`/e/${event.slug}`}>
                                  <Button size="sm" variant="outline">
                                    <Eye className="w-4 h-4 mr-1" />
                                    View Event
                                  </Button>
                                </Link>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  onClick={() => handleUnregister(event.id, event.title)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  Unregister
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>

          <Separator />

          {/* My Projects Section */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-medium text-gray-900 dark:text-white">My Projects</h2>
              <Link to="/projects/create">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Project
                </Button>
              </Link>
            </div>

            {userProjects.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <div className="text-6xl mb-4">💡</div>
                  <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No projects yet</h3>
                  <p className="text-gray-700 dark:text-gray-300  mb-6">Start building something amazing</p>
                  <Link to="/projects/create">
                    <Button>
                      <Code className="w-4 h-4 mr-2" />
                      Create Your First Project
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userProjects.map(project => {
                  const eventName = events?.find(e => e.id === project.eventId)?.title || 'Independent Project';
                  
                  return (
                    <Card key={project.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg text-gray-900">{project.title}</CardTitle>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{project.tagline}</p>
                          </div>
                          {getProjectStatusIcon(project.status)}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="text-sm text-gray-600">
                            <div className="flex items-center gap-2 mb-2">
                              <Calendar className="w-4 h-4" />
                              <span>{eventName}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              <span>Submitted {formatDate(project.submittedAt)}</span>
                            </div>
                          </div>

                          {project.tags && project.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {project.tags.slice(0, 3).map(tag => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                              {project.tags.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{project.tags.length - 3}
                                </Badge>
                              )}
                            </div>
                          )}

                          <div className="flex items-center justify-between pt-2">
                            <div className="flex gap-2">
                              <Link href={`/projects/${project.id}`}>
                                <Button size="sm" variant="outline">
                                  <Eye className="w-4 h-4 mr-1" />
                                  View
                                </Button>
                              </Link>
                              <Link href={`/projects/${project.id}/edit`}>
                                <Button size="sm" variant="outline">
                                  <Edit3 className="w-4 h-4 mr-1" />
                                  Edit
                                </Button>
                              </Link>
                            </div>
                            
                            <div className="flex gap-1">
                              {project.githubUrl && (
                                <Link href={project.githubUrl}>
                                  <Button size="sm" variant="ghost" className="w-8 h-8 p-0">
                                    <Github className="w-4 h-4" />
                                  </Button>
                                </Link>
                              )}
                              {project.demoUrl && (
                                <Link href={project.demoUrl}>
                                  <Button size="sm" variant="ghost" className="w-8 h-8 p-0">
                                    <Globe className="w-4 h-4" />
                                  </Button>
                                </Link>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}