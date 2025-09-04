import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { 
  Calendar, Trophy, Users, Clock, MapPin, ExternalLink,
  Settings, Bell, Award, TrendingUp, Plus, Code, 
  GitBranch, Star, Target, Activity, UserPlus, Zap,
  ChevronRight, Medal, Upload, Eye, Github, Globe
} from "lucide-react";

export default function Dashboard() {
  const { user, unregisterFromEvent } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");

  const { data: events } = useQuery({
    queryKey: ['events'],
    queryFn: api.getEvents,
  });

  const { data: allUsers } = useQuery({
    queryKey: ['users'],
    queryFn: api.getUsers,
  });

  const { data: teams } = useQuery({
    queryKey: ['teams'],
    queryFn: () => api.getTeams(),
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
          <Link href="/login">
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

  const completedEvents = registeredEvents.filter(event => 
    event.status === 'completed'
  );

  // Get user's projects
  const userProjects = submissions?.filter(submission => 
    submission.submittedBy === user.id
  ) || [];

  // Get user's teams
  const userTeams = teams?.filter(team => 
    team.members.includes(user.id)
  ) || [];

  // Get user's achievements and stats
  const userStats = allUsers?.find(u => u.id === user.id)?.stats || {
    hackathonsParticipated: 0,
    wins: 0,
    finals: 0,
    organized: 0,
    judged: 0
  };

  const userBadges = allUsers?.find(u => u.id === user.id)?.badges || [];

  // Recent activity
  const recentActivities = [
    ...userProjects.slice(0, 3).map(project => ({
      id: `project-${project.id}`,
      type: 'project' as const,
      title: `Submitted "${project.title}"`,
      time: project.submittedAt,
      status: project.status,
      link: `/projects/${project.id}`,
      awards: project.awards
    })),
    ...userTeams.slice(0, 2).map(team => ({
      id: `team-${team.id}`,
      type: 'team' as const,
      title: `Joined team "${team.name}"`,
      time: team.created,
      status: team.status,
      link: `/teams/${team.id}`,
      members: team.members.length
    }))
  ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 5);

  const handleUnregister = async (eventId: string, eventTitle: string) => {
    const result = await unregisterFromEvent(eventId);
    if (result.success) {
      toast({
        title: "Unregistered successfully",
        description: `You've been removed from ${eventTitle}`,
      });
    }
  };

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
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'registration_open': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-medium text-gray-900">
                Welcome back, {user.fullName || user.username}
              </h1>
              <p className="text-gray-600 mt-1">Track your hackathon journey and explore new opportunities</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </Button>
              <Link href="/profile">
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-semibold text-gray-900 mb-1">
                  {registeredEvents.length}
                </div>
                <div className="text-sm text-gray-600">Total Events</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-semibold text-blue-600 mb-1">
                  {activeEvents.length}
                </div>
                <div className="text-sm text-gray-600">Active Now</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-semibold text-green-600 mb-1">
                  {completedEvents.length}
                </div>
                <div className="text-sm text-gray-600">Completed</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-semibold text-purple-600 mb-1">
                  0
                </div>
                <div className="text-sm text-gray-600">Awards Won</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 bg-gray-50 p-1 rounded-lg mb-8">
            <TabsTrigger value="overview" className="rounded-md">Overview</TabsTrigger>
            <TabsTrigger value="projects" className="rounded-md">My Projects</TabsTrigger>
            <TabsTrigger value="teams" className="rounded-md">My Teams</TabsTrigger>
            <TabsTrigger value="active" className="rounded-md">Active Events</TabsTrigger>
            <TabsTrigger value="upcoming" className="rounded-md">Upcoming</TabsTrigger>
            <TabsTrigger value="completed" className="rounded-md">History</TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-medium text-gray-900">My Projects</h2>
              <Link href="/submit">
                <Button data-testid="button-submit-project">
                  <Plus className="w-4 h-4 mr-2" />
                  Submit New Project
                </Button>
              </Link>
            </div>
            
            {userProjects.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🚀</div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">No projects yet</h3>
                <p className="text-gray-600 mb-6">Start building something amazing for your next hackathon</p>
                <Link href="/submit">
                  <Button className="bg-blue-600 hover:bg-blue-700" data-testid="button-create-first-project">
                    <Code className="w-4 h-4 mr-2" />
                    Create Your First Project
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userProjects.map(project => {
                  const eventName = events?.find(e => e.id === project.eventId)?.title || 'Unknown Event';
                  const teamName = teams?.find(t => t.id === project.teamId)?.name || 'Solo Project';
                  
                  return (
                    <Card key={project.id} className="hover:shadow-lg transition-shadow" data-testid={`card-project-${project.id}`}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg mb-2">{project.title}</CardTitle>
                            <p className="text-sm text-gray-600 mb-2">{project.tagline}</p>
                            <Badge className={`mb-2 ${
                              project.status === 'submitted' ? 'bg-green-100 text-green-800' :
                              project.status === 'judging' ? 'bg-yellow-100 text-yellow-800' :
                              project.status === 'judged' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {project.status === 'submitted' ? 'Submitted' :
                               project.status === 'judging' ? 'Under Review' :
                               project.status === 'judged' ? 'Judged' : 'Draft'}
                            </Badge>
                          </div>
                          {project.awards && project.awards.length > 0 && (
                            <div className="flex items-center gap-1">
                              <Trophy className="w-4 h-4 text-yellow-500" />
                              <span className="text-xs text-yellow-600 font-medium">{project.awards.length}</span>
                            </div>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>{eventName}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Users className="w-4 h-4" />
                            <span>{teamName}</span>
                          </div>
                          {project.averageScore && (
                            <div className="flex items-center gap-2">
                              <Star className="w-4 h-4 text-yellow-500" />
                              <span className="text-sm font-medium">{project.averageScore.toFixed(1)}/10</span>
                            </div>
                          )}
                          <div className="flex flex-wrap gap-1">
                            {project.tags.slice(0, 3).map(tag => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex gap-2 pt-2">
                            <Link href={`/projects/${project.id}`}>
                              <Button size="sm" variant="outline" data-testid={`button-view-project-${project.id}`}>
                                <Eye className="w-4 h-4 mr-1" />
                                View
                              </Button>
                            </Link>
                            {project.githubUrl && (
                              <Button size="sm" variant="outline" asChild>
                                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" data-testid={`link-github-${project.id}`}>
                                  <Github className="w-4 h-4 mr-1" />
                                  Code
                                </a>
                              </Button>
                            )}
                            {project.demoUrl && (
                              <Button size="sm" variant="outline" asChild>
                                <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" data-testid={`link-demo-${project.id}`}>
                                  <Globe className="w-4 h-4 mr-1" />
                                  Demo
                                </a>
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="teams" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-medium text-gray-900">My Teams</h2>
              <Link href="/teams">
                <Button data-testid="button-browse-teams">
                  <Users className="w-4 h-4 mr-2" />
                  Browse Teams
                </Button>
              </Link>
            </div>
            
            {userTeams.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">👥</div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">No teams yet</h3>
                <p className="text-gray-600 mb-6">Join or create a team to collaborate on hackathons</p>
                <div className="flex gap-3 justify-center">
                  <Link href="/teams">
                    <Button variant="outline" data-testid="button-find-teams">
                      <Users className="w-4 h-4 mr-2" />
                      Find Teams
                    </Button>
                  </Link>
                  <Link href="/teams/create">
                    <Button className="bg-green-600 hover:bg-green-700" data-testid="button-create-team">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Team
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {userTeams.map(team => {
                  const eventName = events?.find(e => e.id === team.eventId)?.title || 'Unknown Event';
                  const isLeader = team.leaderId === user.id;
                  const teamMembers = allUsers?.filter(u => team.members.includes(u.id)) || [];
                  
                  return (
                    <Card key={team.id} className="hover:shadow-lg transition-shadow" data-testid={`card-team-${team.id}`}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg mb-2 flex items-center gap-2">
                              {team.name}
                              {isLeader && (
                                <Badge className="bg-purple-100 text-purple-800">
                                  Leader
                                </Badge>
                              )}
                            </CardTitle>
                            <p className="text-sm text-gray-600 mb-2">{team.description}</p>
                            <Badge className={`mb-2 ${
                              team.status === 'recruiting' ? 'bg-blue-100 text-blue-800' :
                              team.status === 'full' ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {team.status === 'recruiting' ? 'Recruiting' :
                               team.status === 'full' ? 'Team Full' : 'Disbanded'}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>{eventName}</span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Target className="w-4 h-4" />
                            <span>{team.track}</span>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Team Members ({team.members.length}/{team.maxSize})</h4>
                            <div className="flex items-center gap-2">
                              {teamMembers.slice(0, 3).map(member => (
                                <Avatar key={member.id} className="w-8 h-8">
                                  <AvatarImage src={member.avatar} alt={member.name} />
                                  <AvatarFallback>{member.name[0]}</AvatarFallback>
                                </Avatar>
                              ))}
                              {team.members.length > 3 && (
                                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-xs text-gray-600">
                                  +{team.members.length - 3}
                                </div>
                              )}
                              {team.status === 'recruiting' && (
                                <div className="w-8 h-8 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center">
                                  <Plus className="w-4 h-4 text-gray-400" />
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {team.lookingFor.length > 0 && (
                            <div>
                              <h4 className="text-sm font-medium text-gray-900 mb-2">Looking For:</h4>
                              <div className="flex flex-wrap gap-1">
                                {team.lookingFor.map(skill => (
                                  <Badge key={skill} variant="outline" className="text-xs">
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          <div className="flex gap-2 pt-2">
                            <Link href={`/teams/${team.id}`}>
                              <Button size="sm" variant="outline" data-testid={`button-view-team-${team.id}`}>
                                <Eye className="w-4 h-4 mr-1" />
                                View
                              </Button>
                            </Link>
                            {team.status === 'recruiting' && (
                              <Button size="sm" variant="outline" data-testid={`button-share-team-${team.id}`}>
                                Share: {team.joinCode}
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="overview" className="space-y-6">
            {registeredEvents.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🚀</div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">No hackathons yet</h3>
                <p className="text-gray-600 mb-6">Start your journey by exploring and registering for hackathons</p>
                <Link href="/explore">
                  <Button className="bg-gray-900 hover:bg-gray-800">
                    Explore Hackathons
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Quick Actions */}
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-medium text-gray-900">Quick Actions</h2>
                </div>

                {/* Quick Action Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <Card className="hover:shadow-md transition-shadow cursor-pointer" data-testid="card-quick-action-submit">
                    <Link href="/submit">
                      <CardContent className="p-6 text-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                          <Upload className="w-6 h-6 text-blue-600" />
                        </div>
                        <h3 className="font-medium text-gray-900 mb-1">Submit Project</h3>
                        <p className="text-sm text-gray-600">Upload your latest creation</p>
                      </CardContent>
                    </Link>
                  </Card>
                  
                  <Card className="hover:shadow-md transition-shadow cursor-pointer" data-testid="card-quick-action-teams">
                    <Link href="/teams">
                      <CardContent className="p-6 text-center">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                          <UserPlus className="w-6 h-6 text-green-600" />
                        </div>
                        <h3 className="font-medium text-gray-900 mb-1">Find Teams</h3>
                        <p className="text-sm text-gray-600">Join or create a team</p>
                      </CardContent>
                    </Link>
                  </Card>
                  
                  <Card className="hover:shadow-md transition-shadow cursor-pointer" data-testid="card-quick-action-explore">
                    <Link href="/explore">
                      <CardContent className="p-6 text-center">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                          <Zap className="w-6 h-6 text-purple-600" />
                        </div>
                        <h3 className="font-medium text-gray-900 mb-1">Explore Events</h3>
                        <p className="text-sm text-gray-600">Discover new hackathons</p>
                      </CardContent>
                    </Link>
                  </Card>
                </div>

                {/* Personal Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Activity className="w-5 h-5" />
                        Your Journey
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Events Participated</span>
                          <span className="font-semibold">{userStats.hackathonsParticipated}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Projects Submitted</span>
                          <span className="font-semibold">{userProjects.length}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Teams Joined</span>
                          <span className="font-semibold">{userTeams.length}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Awards Won</span>
                          <span className="font-semibold text-yellow-600">{userStats.wins}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Medal className="w-5 h-5" />
                        Achievements
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {userBadges.length > 0 ? (
                          userBadges.slice(0, 3).map((badge, index) => (
                            <div key={index} className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                                <Award className="w-4 h-4 text-yellow-600" />
                              </div>
                              <span className="text-sm font-medium">{badge}</span>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-gray-500">Complete hackathons to earn badges!</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Activity */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {recentActivities.length > 0 ? (
                      recentActivities.map(activity => (
                        <div key={activity.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                          <div className={`w-2 h-2 rounded-full ${
                            activity.type === 'project' ? 'bg-blue-500' : 'bg-green-500'
                          }`} />
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{activity.title}</p>
                            <p className="text-sm text-gray-600">{
                              new Date(activity.time).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric',
                                year: 'numeric'
                              })
                            }</p>
                          </div>
                          {activity.type === 'project' && activity.awards && activity.awards.length > 0 && (
                            <Badge className="bg-yellow-100 text-yellow-800">
                              <Award className="w-3 h-3 mr-1" />
                              Winner
                            </Badge>
                          )}
                          <Link href={activity.link}>
                            <Button variant="ghost" size="sm">
                              <ChevronRight className="w-4 h-4" />
                            </Button>
                          </Link>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <Activity className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500">No recent activity</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="active" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-medium text-gray-900">Active Events</h2>
            </div>
            
            {activeEvents.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-600">No active events</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activeEvents.map(event => (
                  <Card key={event.id} className="border border-green-200 bg-green-50">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{event.title}</CardTitle>
                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">{event.description}</p>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span>Ends {formatDate(event.endDate)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Trophy className="w-4 h-4 text-gray-500" />
                          <span>${(event.prizePool / 1000).toFixed(0)}k prize pool</span>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Link href={`/e/${event.slug}`}>
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            View Event
                          </Button>
                        </Link>
                        <Link href={`/e/${event.slug}/submit`}>
                          <Button size="sm" variant="outline">
                            Submit Project
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="upcoming" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-medium text-gray-900">Upcoming Events</h2>
            </div>
            
            {upcomingEvents.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-600 mb-4">No upcoming events</p>
                <Link href="/explore">
                  <Button variant="outline">Find Events to Join</Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {upcomingEvents.map(event => (
                  <Card key={event.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{event.title}</CardTitle>
                        <Badge className={getStatusColor(event.status)}>
                          {event.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">{event.description}</p>
                      <div className="space-y-2 text-sm mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span>Starts {formatDate(event.startDate)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Trophy className="w-4 h-4 text-gray-500" />
                          <span>${(event.prizePool / 1000).toFixed(0)}k prize pool</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/e/${event.slug}`}>
                          <Button size="sm">View Details</Button>
                        </Link>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleUnregister(event.id, event.title)}
                        >
                          Unregister
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-medium text-gray-900">Completed Events</h2>
            </div>
            
            {completedEvents.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-600">No completed events yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {completedEvents.map(event => (
                  <Card key={event.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 mb-1">{event.title}</h3>
                          <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>Completed {formatDate(event.endDate)}</span>
                            <span>${(event.prizePool / 1000).toFixed(0)}k prize pool</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-gray-100 text-gray-800">Completed</Badge>
                          <Link href={`/e/${event.slug}`}>
                            <Button size="sm" variant="outline">
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

const ActivityIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'project':
      return <Code className="w-4 h-4 text-blue-500" />;
    case 'team':
      return <Users className="w-4 h-4 text-green-500" />;
    case 'event':
      return <Calendar className="w-4 h-4 text-purple-500" />;
    default:
      return <Activity className="w-4 h-4 text-gray-500" />;
  }
};