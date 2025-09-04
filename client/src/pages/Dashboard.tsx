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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { 
  Calendar, Trophy, Users, Clock, MapPin, ExternalLink,
  Settings, Bell, Award, TrendingUp, Plus, Code, 
  GitBranch, Star, Target, Activity, UserPlus, Zap,
  ChevronRight, Medal, Upload, Eye, Github, Globe,
  Search, Filter, SortDesc, BarChart3, MessageCircle,
  Share2, Bookmark, Heart, Lightbulb, Rocket,
  CheckCircle, AlertCircle, XCircle, Clock4, Sparkles,
  ArrowUp, ArrowDown, ChevronDown, MoreHorizontal,
  PieChart, LineChart, TrendingDown, Calendar as CalendarIcon,
  Send, MessageSquare, Phone, Video, Mail, Link2,
  FileText, Image, Play, Download, Copy, Edit3
} from "lucide-react";

export default function Dashboard() {
  const { user, unregisterFromEvent } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [projectFilter, setProjectFilter] = useState("all");
  const [projectSort, setProjectSort] = useState("recent");
  const [teamFilter, setTeamFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

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

  // Enhanced project analytics
  const projectAnalytics = {
    total: userProjects.length,
    submitted: userProjects.filter(p => p.status === 'submitted').length,
    judged: userProjects.filter(p => p.status === 'judged').length,
    winners: userProjects.filter(p => p.awards && p.awards.length > 0).length,
    averageScore: userProjects
      .filter(p => p.averageScore)
      .reduce((acc, p) => acc + (p.averageScore || 0), 0) / Math.max(userProjects.filter(p => p.averageScore).length, 1),
    topTechnologies: userProjects
      .flatMap(p => p.techStack)
      .reduce((acc, tech) => { acc[tech] = (acc[tech] || 0) + 1; return acc; }, {} as Record<string, number>),
    monthlyProgress: getMonthlyProgress(userProjects)
  };

  // Enhanced team analytics
  const teamAnalytics = {
    total: userTeams.length,
    leading: userTeams.filter(t => t.leaderId === user.id).length,
    recruiting: userTeams.filter(t => t.status === 'recruiting').length,
    full: userTeams.filter(t => t.status === 'full').length,
    averageTeamSize: userTeams.reduce((acc, t) => acc + t.members.length, 0) / Math.max(userTeams.length, 1),
    skillDemand: userTeams
      .flatMap(t => t.lookingFor)
      .reduce((acc, skill) => { acc[skill] = (acc[skill] || 0) + 1; return acc; }, {} as Record<string, number>)
  };

  // Filter and sort projects
  const filteredProjects = userProjects
    .filter(project => {
      if (projectFilter === 'all') return true;
      if (projectFilter === 'winners') return project.awards && project.awards.length > 0;
      if (projectFilter === 'judged') return project.status === 'judged';
      if (projectFilter === 'submitted') return project.status === 'submitted';
      return project.status === projectFilter;
    })
    .filter(project => 
      searchQuery === '' || 
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      if (projectSort === 'recent') return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
      if (projectSort === 'score') return (b.averageScore || 0) - (a.averageScore || 0);
      if (projectSort === 'awards') return (b.awards?.length || 0) - (a.awards?.length || 0);
      return a.title.localeCompare(b.title);
    });

  // Filter teams
  const filteredTeams = userTeams
    .filter(team => {
      if (teamFilter === 'all') return true;
      if (teamFilter === 'leading') return team.leaderId === user.id;
      return team.status === teamFilter;
    });

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

  // Helper function for monthly progress
  function getMonthlyProgress(projects: any[]) {
    const monthlyData: Record<string, number> = {};
    projects.forEach(project => {
      const month = new Date(project.submittedAt).toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      monthlyData[month] = (monthlyData[month] || 0) + 1;
    });
    return Object.entries(monthlyData).map(([month, count]) => ({ month, count })).slice(-6);
  }

  const getProjectStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'judging': return <Clock4 className="w-4 h-4 text-yellow-500" />;
      case 'judged': return <Star className="w-4 h-4 text-blue-500" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTeamStatusIcon = (status: string) => {
    switch (status) {
      case 'recruiting': return <UserPlus className="w-4 h-4 text-blue-500" />;
      case 'full': return <CheckCircle className="w-4 h-4 text-green-500" />;
      default: return <XCircle className="w-4 h-4 text-gray-500" />;
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
            {/* Projects Header with Analytics */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-medium text-gray-900">My Projects</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {projectAnalytics.total} total projects • {projectAnalytics.winners} winners • Average score: {projectAnalytics.averageScore.toFixed(1)}/10
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Analytics
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button data-testid="button-submit-project">
                        <Plus className="w-4 h-4 mr-2" />
                        Submit New Project
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Submit New Project</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-6">
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium mb-2 block">Project Title</label>
                            <Input placeholder="Enter your project title" data-testid="input-project-title-main" />
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-2 block">Tagline</label>
                            <Input placeholder="A brief description of your project" data-testid="input-project-tagline-main" />
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-2 block">Select Event</label>
                            <Select>
                              <SelectTrigger data-testid="select-project-event-main">
                                <SelectValue placeholder="Choose hackathon event" />
                              </SelectTrigger>
                              <SelectContent>
                                {events?.filter(e => e.status === 'active' || e.status === 'upcoming').map(event => (
                                  <SelectItem key={event.id} value={event.id}>{event.title}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-2 block">Team (Optional)</label>
                            <Select>
                              <SelectTrigger data-testid="select-project-team-main">
                                <SelectValue placeholder="Solo project or select team" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="solo">Solo Project</SelectItem>
                                {userTeams.map(team => (
                                  <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-2 block">Description</label>
                            <Textarea placeholder="Describe your project, what it does, and how you built it..." rows={4} data-testid="textarea-project-description-main" />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium mb-2 block">GitHub URL</label>
                              <Input placeholder="https://github.com/username/repo" data-testid="input-project-github-main" />
                            </div>
                            <div>
                              <label className="text-sm font-medium mb-2 block">Demo URL</label>
                              <Input placeholder="https://yourproject.com" data-testid="input-project-demo-main" />
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-2 block">Technologies Used</label>
                            <Input placeholder="React, Node.js, Python, etc. (comma separated)" data-testid="input-project-tech-main" />
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-2 block">Tags</label>
                            <Input placeholder="AI, Web Development, Mobile, etc. (comma separated)" data-testid="input-project-tags-main" />
                          </div>
                        </div>
                        
                        <div className="flex gap-3 pt-4 border-t">
                          <Button className="flex-1" onClick={() => {
                            toast({ title: "Project submitted successfully!", description: "Your project is now live on the platform." });
                          }} data-testid="button-submit-project-form-main">
                            <Upload className="w-4 h-4 mr-2" />
                            Submit Project
                          </Button>
                          <Button variant="outline" className="flex-1" data-testid="button-save-draft-main">
                            <FileText className="w-4 h-4 mr-2" />
                            Save as Draft
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              {/* Project Analytics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-semibold text-blue-600 mb-1">{projectAnalytics.submitted}</div>
                    <div className="text-sm text-gray-600">Submitted</div>
                    <div className="text-xs text-gray-500 mt-1">
                      <ArrowUp className="w-3 h-3 inline mr-1" />12% this month
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-semibold text-green-600 mb-1">{projectAnalytics.winners}</div>
                    <div className="text-sm text-gray-600">Winners</div>
                    <div className="text-xs text-gray-500 mt-1">
                      <Trophy className="w-3 h-3 inline mr-1" />Top 25%
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-semibold text-purple-600 mb-1">{projectAnalytics.averageScore.toFixed(1)}</div>
                    <div className="text-sm text-gray-600">Avg Score</div>
                    <div className="text-xs text-gray-500 mt-1">
                      <TrendingUp className="w-3 h-3 inline mr-1" />+0.3 vs last
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-semibold text-orange-600 mb-1">{Object.keys(projectAnalytics.topTechnologies).length}</div>
                    <div className="text-sm text-gray-600">Technologies</div>
                    <div className="text-xs text-gray-500 mt-1">
                      <Code className="w-3 h-3 inline mr-1" />React, Python
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Project Filters and Search */}
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="flex gap-2 items-center flex-wrap">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="Search projects..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-64"
                      data-testid="input-search-projects"
                    />
                  </div>
                  <Select value={projectFilter} onValueChange={setProjectFilter}>
                    <SelectTrigger className="w-32" data-testid="select-project-filter">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Projects</SelectItem>
                      <SelectItem value="winners">Winners Only</SelectItem>
                      <SelectItem value="submitted">Submitted</SelectItem>
                      <SelectItem value="judged">Judged</SelectItem>
                      <SelectItem value="draft">Drafts</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={projectSort} onValueChange={setProjectSort}>
                    <SelectTrigger className="w-32" data-testid="select-project-sort">
                      <SortDesc className="w-4 h-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recent">Most Recent</SelectItem>
                      <SelectItem value="score">Highest Score</SelectItem>
                      <SelectItem value="awards">Most Awards</SelectItem>
                      <SelectItem value="name">Name A-Z</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>{filteredProjects.length} of {projectAnalytics.total} projects</span>
                </div>
              </div>
            </div>
            
            {filteredProjects.length === 0 ? (
              <div className="text-center py-16">
                {userProjects.length === 0 ? (
                  <>
                    <div className="text-6xl mb-4">🚀</div>
                    <h3 className="text-xl font-medium text-gray-900 mb-2">No projects yet</h3>
                    <p className="text-gray-600 mb-6">Start building something amazing for your next hackathon</p>
                    <div className="flex gap-3 justify-center">
                      <Link href="/submit">
                        <Button className="bg-blue-600 hover:bg-blue-700" data-testid="button-create-first-project">
                          <Code className="w-4 h-4 mr-2" />
                          Create Your First Project
                        </Button>
                      </Link>
                      <Button variant="outline" onClick={() => {
                        setSearchQuery('');
                        setProjectFilter('all');
                      }}>
                        <Lightbulb className="w-4 h-4 mr-2" />
                        Browse Ideas
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-4xl mb-4">🔍</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No projects match your filters</h3>
                    <p className="text-gray-600 mb-4">Try adjusting your search or filters</p>
                    <Button variant="outline" onClick={() => {
                      setSearchQuery('');
                      setProjectFilter('all');
                    }}>
                      Clear Filters
                    </Button>
                  </>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map(project => {
                  const eventName = events?.find(e => e.id === project.eventId)?.title || 'Unknown Event';
                  const teamName = teams?.find(t => t.id === project.teamId)?.name || 'Solo Project';
                  
                  return (
                    <Card key={project.id} className="hover:shadow-lg transition-all duration-200 group relative overflow-hidden" data-testid={`card-project-${project.id}`}>
                      {project.awards && project.awards.length > 0 && (
                        <div className="absolute top-2 right-2 z-10">
                          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                            <Trophy className="w-3 h-3 mr-1" />
                            {project.awards.length} Award{project.awards.length > 1 ? 's' : ''}
                          </Badge>
                        </div>
                      )}
                      
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 pr-8">
                            <div className="flex items-center gap-2 mb-2">
                              {getProjectStatusIcon(project.status)}
                              <CardTitle className="text-lg">{project.title}</CardTitle>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">{project.tagline}</p>
                            
                            <div className="flex items-center gap-3 mb-2">
                              <Badge className={`${
                                project.status === 'submitted' ? 'bg-green-100 text-green-800' :
                                project.status === 'judging' ? 'bg-yellow-100 text-yellow-800' :
                                project.status === 'judged' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {project.status === 'submitted' ? 'Submitted' :
                                 project.status === 'judging' ? 'Under Review' :
                                 project.status === 'judged' ? 'Judged' : 'Draft'}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {new Date(project.submittedAt).toLocaleDateString()}
                              </span>
                            </div>
                            
                            {project.averageScore && (
                              <div className="flex items-center gap-2 mb-2">
                                <div className="flex items-center">
                                  {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`w-3 h-3 ${
                                      i < Math.round(project.averageScore! / 2) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                    }`} />
                                  ))}
                                </div>
                                <span className="text-sm font-medium text-gray-900">{project.averageScore.toFixed(1)}/10</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Calendar className="w-4 h-4" />
                              <span>{eventName}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Users className="w-4 h-4" />
                              <span>{teamName}</span>
                            </div>
                          </div>
                          
                          {project.awards && project.awards.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {project.awards.slice(0, 2).map((award, idx) => (
                                <Badge key={idx} className="bg-yellow-50 text-yellow-700 border-yellow-200 text-xs">
                                  {award}
                                </Badge>
                              ))}
                              {project.awards.length > 2 && (
                                <Badge variant="outline" className="text-xs">+{project.awards.length - 2} more</Badge>
                              )}
                            </div>
                          )}
                          
                          <div>
                            <h4 className="text-xs font-medium text-gray-700 mb-2">Technologies:</h4>
                            <div className="flex flex-wrap gap-1">
                              {project.techStack.slice(0, 4).map(tech => (
                                <Badge key={tech} variant="outline" className="text-xs">
                                  {tech}
                                </Badge>
                              ))}
                              {project.techStack.length > 4 && (
                                <Badge variant="outline" className="text-xs">+{project.techStack.length - 4}</Badge>
                              )}
                            </div>
                          </div>
                          
                          {project.features && project.features.length > 0 && (
                            <div>
                              <h4 className="text-xs font-medium text-gray-700 mb-2">Key Features:</h4>
                              <ul className="text-xs text-gray-600 space-y-1">
                                {project.features.slice(0, 2).map((feature, idx) => (
                                  <li key={idx} className="flex items-start gap-1">
                                    <CheckCircle className="w-3 h-3 mt-0.5 text-green-500 shrink-0" />
                                    {feature}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                        
                        <Separator />
                        
                        <div className="flex items-center justify-between pt-2">
                          <div className="flex gap-2">
                            <Link href={`/projects/${project.id}`}>
                              <Button size="sm" variant="outline" data-testid={`button-view-project-${project.id}`}>
                                <Eye className="w-4 h-4 mr-1" />
                                View
                              </Button>
                            </Link>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button size="sm" variant="outline">
                                  <Share2 className="w-4 h-4 mr-1" />
                                  Share
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Share Project: {project.title}</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="flex gap-2">
                                    {project.githubUrl && (
                                      <Button size="sm" variant="outline" asChild>
                                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                                          <Github className="w-4 h-4 mr-2" />
                                          Source Code
                                        </a>
                                      </Button>
                                    )}
                                    {project.demoUrl && (
                                      <Button size="sm" variant="outline" asChild>
                                        <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                                          <Globe className="w-4 h-4 mr-2" />
                                          Live Demo
                                        </a>
                                      </Button>
                                    )}
                                    {project.videoUrl && (
                                      <Button size="sm" variant="outline" asChild>
                                        <a href={project.videoUrl} target="_blank" rel="noopener noreferrer">
                                          <Play className="w-4 h-4 mr-2" />
                                          Video
                                        </a>
                                      </Button>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Input value={`${window.location.origin}/projects/${project.id}`} readOnly className="flex-1" />
                                    <Button size="sm" onClick={() => {
                                      navigator.clipboard.writeText(`${window.location.origin}/projects/${project.id}`);
                                      toast({ title: "Link copied to clipboard!" });
                                    }}>
                                      <Copy className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <Button size="sm" variant="ghost" className="text-gray-500 hover:text-red-500">
                              <Heart className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="text-gray-500 hover:text-blue-500">
                              <Bookmark className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="text-gray-500 hover:text-gray-700">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
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
            {/* Teams Header with Analytics */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-medium text-gray-900">My Teams</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {teamAnalytics.total} total teams • Leading {teamAnalytics.leading} teams • Average size: {teamAnalytics.averageTeamSize.toFixed(1)} members
                  </p>
                </div>
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Team Chat
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Team Communications</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {filteredTeams.map(team => (
                            <Card key={team.id} className="p-4">
                              <div className="flex items-center justify-between mb-3">
                                <h3 className="font-medium">{team.name}</h3>
                                {team.leaderId === user.id && (
                                  <Badge className="bg-purple-100 text-purple-800">Leader</Badge>
                                )}
                              </div>
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline">
                                  <MessageSquare className="w-4 h-4 mr-1" />
                                  Chat
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Video className="w-4 h-4 mr-1" />
                                  Meet
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Mail className="w-4 h-4 mr-1" />
                                  Email
                                </Button>
                              </div>
                            </Card>
                          ))}
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Link href="/teams">
                    <Button data-testid="button-browse-teams">
                      <Users className="w-4 h-4 mr-2" />
                      Browse Teams
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Team Analytics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-semibold text-green-600 mb-1">{teamAnalytics.leading}</div>
                    <div className="text-sm text-gray-600">Leading</div>
                    <div className="text-xs text-gray-500 mt-1">
                      <Trophy className="w-3 h-3 inline mr-1" />Leadership role
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-semibold text-blue-600 mb-1">{teamAnalytics.recruiting}</div>
                    <div className="text-sm text-gray-600">Recruiting</div>
                    <div className="text-xs text-gray-500 mt-1">
                      <UserPlus className="w-3 h-3 inline mr-1" />Open spots
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-semibold text-purple-600 mb-1">{teamAnalytics.averageTeamSize.toFixed(1)}</div>
                    <div className="text-sm text-gray-600">Avg Size</div>
                    <div className="text-xs text-gray-500 mt-1">
                      <Users className="w-3 h-3 inline mr-1" />Members
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-semibold text-orange-600 mb-1">{Object.keys(teamAnalytics.skillDemand).length}</div>
                    <div className="text-sm text-gray-600">Skills Needed</div>
                    <div className="text-xs text-gray-500 mt-1">
                      <Target className="w-3 h-3 inline mr-1" />In demand
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Team Filter */}
              <div className="flex items-center gap-4">
                <Select value={teamFilter} onValueChange={setTeamFilter}>
                  <SelectTrigger className="w-48" data-testid="select-team-filter">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Teams</SelectItem>
                    <SelectItem value="leading">Leading</SelectItem>
                    <SelectItem value="recruiting">Recruiting</SelectItem>
                    <SelectItem value="full">Team Full</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-sm text-gray-600">{filteredTeams.length} of {teamAnalytics.total} teams</span>
              </div>
            </div>
            
            {filteredTeams.length === 0 ? (
              <div className="text-center py-16">
                {userTeams.length === 0 ? (
                  <>
                    <div className="text-6xl mb-4">👥</div>
                    <h3 className="text-xl font-medium text-gray-900 mb-2">No teams yet</h3>
                    <p className="text-gray-600 mb-6">Join or create a team to collaborate on hackathons</p>
                    <div className="flex gap-3 justify-center">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" data-testid="button-find-teams">
                            <Users className="w-4 h-4 mr-2" />
                            Find Teams
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Find & Join Teams</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-6">
                            {/* Search and Filter */}
                            <div className="flex gap-4 items-center">
                              <div className="relative flex-1">
                                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <Input placeholder="Search teams by name, skills, or event..." className="pl-10" data-testid="input-search-teams-main" />
                              </div>
                              <Select>
                                <SelectTrigger className="w-40" data-testid="select-team-event-filter-main">
                                  <SelectValue placeholder="All Events" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="all">All Events</SelectItem>
                                  {events?.filter(e => e.status === 'active' || e.status === 'upcoming').map(event => (
                                    <SelectItem key={event.id} value={event.id}>{event.title}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            
                            {/* Available Teams */}
                            <div className="space-y-4">
                              <h3 className="font-medium text-gray-900">Available Teams Looking for Members</h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                                {teams?.filter(team => !team.members.includes(user.id) && team.status === 'recruiting').slice(0, 6).map(team => {
                                  const eventName = events?.find(e => e.id === team.eventId)?.title || 'Unknown Event';
                                  
                                  return (
                                    <Card key={team.id} className="hover:shadow-sm transition-shadow">
                                      <CardContent className="p-4">
                                        <div className="space-y-3">
                                          <div className="flex items-start justify-between">
                                            <div>
                                              <h4 className="font-medium text-gray-900">{team.name}</h4>
                                              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{team.description}</p>
                                            </div>
                                            <Badge className="bg-blue-100 text-blue-800 text-xs">Recruiting</Badge>
                                          </div>
                                          
                                          <div className="text-sm text-gray-600">
                                            <div className="flex items-center gap-2 mb-1">
                                              <Calendar className="w-4 h-4" />
                                              <span>{eventName}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                              <Users className="w-4 h-4" />
                                              <span>{team.members.length}/{team.maxSize} members</span>
                                            </div>
                                          </div>
                                          
                                          {team.lookingFor.length > 0 && (
                                            <div>
                                              <h5 className="text-xs font-medium text-gray-700 mb-1">Looking for:</h5>
                                              <div className="flex flex-wrap gap-1">
                                                {team.lookingFor.slice(0, 3).map(skill => (
                                                  <Badge key={skill} variant="outline" className="text-xs">{skill}</Badge>
                                                ))}
                                                {team.lookingFor.length > 3 && (
                                                  <Badge variant="outline" className="text-xs">+{team.lookingFor.length - 3}</Badge>
                                                )}
                                              </div>
                                            </div>
                                          )}
                                          
                                          <div className="flex gap-2 pt-2">
                                            <Button size="sm" className="flex-1" onClick={() => {
                                              toast({ title: "Join request sent!", description: `You've requested to join ${team.name}` });
                                            }} data-testid={`button-join-team-main-${team.id}`}>
                                              <UserPlus className="w-4 h-4 mr-1" />
                                              Join
                                            </Button>
                                            <Button size="sm" variant="outline" onClick={() => {
                                              navigator.clipboard.writeText(team.joinCode);
                                              toast({ title: "Join code copied!", description: `Code: ${team.joinCode}` });
                                            }}>
                                              <Copy className="w-4 h-4" />
                                            </Button>
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  );
                                })}
                              </div>
                            </div>
                            
                            <Separator />
                            
                            <div className="flex gap-3">
                              <Button variant="outline" className="flex-1" onClick={() => {
                                toast({ title: "Feature coming soon!", description: "Team creation will be available in the next update." });
                              }}>
                                <Plus className="w-4 h-4 mr-2" />
                                Create New Team
                              </Button>
                              <Link href="/teams">
                                <Button variant="outline" className="flex-1">
                                  <ExternalLink className="w-4 h-4 mr-2" />
                                  Browse All Teams
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button className="bg-green-600 hover:bg-green-700" data-testid="button-create-team">
                            <Plus className="w-4 h-4 mr-2" />
                            Create Team
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Create New Team</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <Input placeholder="Team name" />
                            <Textarea placeholder="Team description and what you're looking for..." />
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select hackathon" />
                              </SelectTrigger>
                              <SelectContent>
                                {events?.filter(e => e.status === 'upcoming' || e.status === 'registration_open').map(event => (
                                  <SelectItem key={event.id} value={event.id}>{event.title}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <div className="flex gap-2 pt-4">
                              <Button className="flex-1">Create Team</Button>
                              <Button variant="outline" className="flex-1">Save as Draft</Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-4xl mb-4">🔍</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No teams match your filter</h3>
                    <p className="text-gray-600 mb-4">Try adjusting your filter settings</p>
                    <Button variant="outline" onClick={() => setTeamFilter('all')}>Show All Teams</Button>
                  </>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredTeams.map(team => {
                  const eventName = events?.find(e => e.id === team.eventId)?.title || 'Unknown Event';
                  const isLeader = team.leaderId === user.id;
                  const teamMembers = allUsers?.filter(u => team.members.includes(u.id)) || [];
                  
                  return (
                    <Card key={team.id} className="hover:shadow-lg transition-all duration-200 group" data-testid={`card-team-${team.id}`}>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              {getTeamStatusIcon(team.status)}
                              <CardTitle className="text-lg">{team.name}</CardTitle>
                              {isLeader && (
                                <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                                  <Trophy className="w-3 h-3 mr-1" />
                                  Leader
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{team.description}</p>
                            
                            <div className="flex items-center gap-3">
                              <Badge className={`${
                                team.status === 'recruiting' ? 'bg-blue-100 text-blue-800' :
                                team.status === 'full' ? 'bg-green-100 text-green-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {team.status === 'recruiting' ? 'Recruiting' :
                                 team.status === 'full' ? 'Team Full' : 'Disbanded'}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                Created {new Date(team.created).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex flex-col items-end gap-2">
                            <Progress value={(team.members.length / team.maxSize) * 100} className="w-16 h-2" />
                            <span className="text-xs text-gray-500">
                              {team.members.length}/{team.maxSize}
                            </span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2 text-gray-600">
                              <Calendar className="w-4 h-4" />
                              <span>{eventName}</span>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              <Target className="w-3 h-3 mr-1" />
                              {team.track}
                            </Badge>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center justify-between">
                              Team Members
                              <span className="text-xs text-gray-500 font-normal">
                                {team.members.length}/{team.maxSize} members
                              </span>
                            </h4>
                            <div className="flex items-center gap-2 mb-3">
                              {teamMembers.slice(0, 4).map((member, idx) => (
                                <div key={member.id} className="relative group/member">
                                  <Avatar className={`w-8 h-8 border-2 ${
                                    member.id === team.leaderId ? 'border-purple-300' : 'border-white'
                                  }`}>
                                    <AvatarImage src={member.avatar} alt={member.name} />
                                    <AvatarFallback className={member.id === team.leaderId ? 'bg-purple-100' : ''}>
                                      {member.name[0]}
                                    </AvatarFallback>
                                  </Avatar>
                                  {member.id === team.leaderId && (
                                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center">
                                      <Trophy className="w-2 h-2 text-white" />
                                    </div>
                                  )}
                                </div>
                              ))}
                              {team.members.length > 4 && (
                                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-xs text-gray-600 border-2 border-white">
                                  +{team.members.length - 4}
                                </div>
                              )}
                              {team.status === 'recruiting' && (
                                <div className="w-8 h-8 border-2 border-dashed border-blue-300 rounded-full flex items-center justify-center text-blue-500 hover:border-blue-400 cursor-pointer">
                                  <Plus className="w-4 h-4" />
                                </div>
                              )}
                            </div>
                            
                            {/* Team Skills */}
                            {team.skills.length > 0 && (
                              <div className="mb-3">
                                <h5 className="text-xs font-medium text-gray-700 mb-2">Team Skills:</h5>
                                <div className="flex flex-wrap gap-1">
                                  {team.skills.slice(0, 3).map(skill => (
                                    <Badge key={skill} className="bg-green-50 text-green-700 border-green-200 text-xs">
                                      <CheckCircle className="w-3 h-3 mr-1" />
                                      {skill}
                                    </Badge>
                                  ))}
                                  {team.skills.length > 3 && (
                                    <Badge variant="outline" className="text-xs">+{team.skills.length - 3}</Badge>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                          
                          {team.lookingFor.length > 0 && (
                            <div>
                              <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
                                <UserPlus className="w-4 h-4 text-blue-500" />
                                Looking For:
                              </h4>
                              <div className="flex flex-wrap gap-1">
                                {team.lookingFor.map(skill => (
                                  <Badge key={skill} className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <Separator />
                        
                        <div className="flex items-center justify-between pt-2">
                          <div className="flex gap-2">
                            <Link href={`/teams/${team.id}`}>
                              <Button size="sm" variant="outline" data-testid={`button-view-team-${team.id}`}>
                                <Eye className="w-4 h-4 mr-1" />
                                View
                              </Button>
                            </Link>
                            {isLeader && (
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button size="sm" variant="outline">
                                    <Users className="w-4 h-4 mr-1" />
                                    Manage
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Manage Team: {team.name}</DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <Button variant="outline">
                                        <MessageCircle className="w-4 h-4 mr-2" />
                                        Send Message
                                      </Button>
                                      <Button variant="outline">
                                        <Video className="w-4 h-4 mr-2" />
                                        Start Meeting
                                      </Button>
                                      <Button variant="outline">
                                        <FileText className="w-4 h-4 mr-2" />
                                        Share Files
                                      </Button>
                                      <Button variant="outline">
                                        <Edit3 className="w-4 h-4 mr-2" />
                                        Edit Team
                                      </Button>
                                    </div>
                                    {team.status === 'recruiting' && (
                                      <div className="border rounded-lg p-4 bg-blue-50">
                                        <h4 className="font-medium mb-2">Recruitment</h4>
                                        <div className="flex items-center gap-2 text-sm">
                                          <span>Join Code:</span>
                                          <code className="bg-white px-2 py-1 rounded text-blue-600 font-mono">{team.joinCode}</code>
                                          <Button size="sm" variant="ghost" onClick={() => {
                                            navigator.clipboard.writeText(team.joinCode);
                                            toast({ title: "Join code copied!" });
                                          }}>
                                            <Copy className="w-4 h-4" />
                                          </Button>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </DialogContent>
                              </Dialog>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-1">
                            {team.status === 'recruiting' && (
                              <Button size="sm" variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                                <Share2 className="w-4 h-4 mr-1" />
                                Invite
                              </Button>
                            )}
                            <Button size="sm" variant="ghost" className="text-gray-500 hover:text-blue-500">
                              <MessageCircle className="w-4 h-4" />
                            </Button>
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
                  {/* Submit Project Action */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Card className="hover:shadow-md transition-shadow cursor-pointer" data-testid="card-quick-action-submit">
                        <CardContent className="p-6 text-center">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                            <Upload className="w-6 h-6 text-blue-600" />
                          </div>
                          <h3 className="font-medium text-gray-900 mb-1">Submit Project</h3>
                          <p className="text-sm text-gray-600">Upload your latest creation</p>
                        </CardContent>
                      </Card>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Submit New Project</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-6">
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium mb-2 block">Project Title</label>
                            <Input placeholder="Enter your project title" data-testid="input-project-title" />
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-2 block">Tagline</label>
                            <Input placeholder="A brief description of your project" data-testid="input-project-tagline" />
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-2 block">Select Event</label>
                            <Select>
                              <SelectTrigger data-testid="select-project-event">
                                <SelectValue placeholder="Choose hackathon event" />
                              </SelectTrigger>
                              <SelectContent>
                                {events?.filter(e => e.status === 'active' || e.status === 'upcoming').map(event => (
                                  <SelectItem key={event.id} value={event.id}>{event.title}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-2 block">Team (Optional)</label>
                            <Select>
                              <SelectTrigger data-testid="select-project-team">
                                <SelectValue placeholder="Solo project or select team" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="solo">Solo Project</SelectItem>
                                {userTeams.map(team => (
                                  <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-2 block">Description</label>
                            <Textarea placeholder="Describe your project, what it does, and how you built it..." rows={4} data-testid="textarea-project-description" />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium mb-2 block">GitHub URL</label>
                              <Input placeholder="https://github.com/username/repo" data-testid="input-project-github" />
                            </div>
                            <div>
                              <label className="text-sm font-medium mb-2 block">Demo URL</label>
                              <Input placeholder="https://yourproject.com" data-testid="input-project-demo" />
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-2 block">Technologies Used</label>
                            <Input placeholder="React, Node.js, Python, etc. (comma separated)" data-testid="input-project-tech" />
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-2 block">Tags</label>
                            <Input placeholder="AI, Web Development, Mobile, etc. (comma separated)" data-testid="input-project-tags" />
                          </div>
                        </div>
                        
                        <div className="flex gap-3 pt-4 border-t">
                          <Button className="flex-1" onClick={() => {
                            toast({ title: "Project submitted successfully!", description: "Your project is now live on the platform." });
                          }} data-testid="button-submit-project-form">
                            <Upload className="w-4 h-4 mr-2" />
                            Submit Project
                          </Button>
                          <Button variant="outline" className="flex-1" data-testid="button-save-draft">
                            <FileText className="w-4 h-4 mr-2" />
                            Save as Draft
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  {/* Find Teams Action */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Card className="hover:shadow-md transition-shadow cursor-pointer" data-testid="card-quick-action-teams">
                        <CardContent className="p-6 text-center">
                          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                            <UserPlus className="w-6 h-6 text-green-600" />
                          </div>
                          <h3 className="font-medium text-gray-900 mb-1">Find Teams</h3>
                          <p className="text-sm text-gray-600">Join or create a team</p>
                        </CardContent>
                      </Card>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Find & Join Teams</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-6">
                        {/* Search and Filter */}
                        <div className="flex gap-4 items-center">
                          <div className="relative flex-1">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <Input placeholder="Search teams by name, skills, or event..." className="pl-10" data-testid="input-search-teams" />
                          </div>
                          <Select>
                            <SelectTrigger className="w-40" data-testid="select-team-event-filter">
                              <SelectValue placeholder="All Events" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Events</SelectItem>
                              {events?.filter(e => e.status === 'active' || e.status === 'upcoming').map(event => (
                                <SelectItem key={event.id} value={event.id}>{event.title}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Select>
                            <SelectTrigger className="w-32" data-testid="select-team-status-filter">
                              <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Status</SelectItem>
                              <SelectItem value="recruiting">Recruiting</SelectItem>
                              <SelectItem value="full">Team Full</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        {/* Available Teams */}
                        <div className="space-y-4">
                          <h3 className="font-medium text-gray-900">Available Teams</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                            {teams?.filter(team => !team.members.includes(user.id) && team.status === 'recruiting').map(team => {
                              const eventName = events?.find(e => e.id === team.eventId)?.title || 'Unknown Event';
                              const teamMembers = allUsers?.filter(u => team.members.includes(u.id)) || [];
                              
                              return (
                                <Card key={team.id} className="hover:shadow-sm transition-shadow">
                                  <CardContent className="p-4">
                                    <div className="space-y-3">
                                      <div className="flex items-start justify-between">
                                        <div>
                                          <h4 className="font-medium text-gray-900">{team.name}</h4>
                                          <p className="text-sm text-gray-600 mt-1">{team.description}</p>
                                        </div>
                                        <Badge className="bg-blue-100 text-blue-800">Recruiting</Badge>
                                      </div>
                                      
                                      <div className="text-sm text-gray-600">
                                        <div className="flex items-center gap-2 mb-1">
                                          <Calendar className="w-4 h-4" />
                                          <span>{eventName}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <Users className="w-4 h-4" />
                                          <span>{team.members.length}/{team.maxSize} members</span>
                                        </div>
                                      </div>
                                      
                                      {team.lookingFor.length > 0 && (
                                        <div>
                                          <h5 className="text-xs font-medium text-gray-700 mb-1">Looking for:</h5>
                                          <div className="flex flex-wrap gap-1">
                                            {team.lookingFor.slice(0, 3).map(skill => (
                                              <Badge key={skill} variant="outline" className="text-xs">{skill}</Badge>
                                            ))}
                                            {team.lookingFor.length > 3 && (
                                              <Badge variant="outline" className="text-xs">+{team.lookingFor.length - 3}</Badge>
                                            )}
                                          </div>
                                        </div>
                                      )}
                                      
                                      <div className="flex gap-2 pt-2">
                                        <Button size="sm" className="flex-1" onClick={() => {
                                          toast({ title: "Join request sent!", description: `You've requested to join ${team.name}` });
                                        }} data-testid={`button-join-team-${team.id}`}>
                                          <UserPlus className="w-4 h-4 mr-1" />
                                          Join Team
                                        </Button>
                                        <Button size="sm" variant="outline" onClick={() => {
                                          toast({ title: "Team details copied", description: "Join code and details copied to clipboard" });
                                        }}>
                                          <Share2 className="w-4 h-4" />
                                        </Button>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              );
                            })}
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div className="flex gap-3">
                          <Button variant="outline" className="flex-1">
                            <Plus className="w-4 h-4 mr-2" />
                            Create New Team
                          </Button>
                          <Link href="/teams">
                            <Button variant="outline" className="flex-1">
                              <ExternalLink className="w-4 h-4 mr-2" />
                              Browse All Teams
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  
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
                      <div className="space-y-3">
                        {recentActivities.map(activity => {
                          const isRecent = new Date().getTime() - new Date(activity.time).getTime() < 24 * 60 * 60 * 1000;
                          return (
                            <div key={activity.id} className="group relative">
                              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200 hover:shadow-sm">
                                <div className="relative">
                                  <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
                                    activity.type === 'project' ? 'bg-blue-500' : 'bg-green-500'
                                  }`} />
                                  {isRecent && (
                                    <div className={`absolute -top-1 -right-1 w-2 h-2 rounded-full animate-pulse ${
                                      activity.type === 'project' ? 'bg-blue-300' : 'bg-green-300'
                                    }`} />
                                  )}
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    {activity.type === 'project' ? (
                                      <Code className="w-4 h-4 text-blue-500 flex-shrink-0" />
                                    ) : (
                                      <Users className="w-4 h-4 text-green-500 flex-shrink-0" />
                                    )}
                                    <p className="font-medium text-gray-900 truncate">{activity.title}</p>
                                    {isRecent && (
                                      <Badge className="bg-orange-100 text-orange-800 text-xs px-2 py-0.5">
                                        <Sparkles className="w-3 h-3 mr-1" />
                                        New
                                      </Badge>
                                    )}
                                  </div>
                                  
                                  <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <span>{
                                      new Date(activity.time).toLocaleDateString('en-US', { 
                                        month: 'short', 
                                        day: 'numeric',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                      })
                                    }</span>
                                    
                                    {activity.type === 'project' && activity.awards && activity.awards.length > 0 && (
                                      <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                                        <Trophy className="w-3 h-3 mr-1" />
                                        {activity.awards.length} Award{activity.awards.length > 1 ? 's' : ''}
                                      </Badge>
                                    )}
                                    
                                    {activity.type === 'team' && 'members' in activity && (
                                      <Badge variant="outline" className="text-xs">
                                        <Users className="w-3 h-3 mr-1" />
                                        {activity.members} members
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                  <Link href={activity.link}>
                                    <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                      <Eye className="w-4 h-4 mr-1" />
                                      View
                                    </Button>
                                  </Link>
                                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        
                        <div className="text-center pt-4">
                          <Button variant="outline" size="sm">
                            <Activity className="w-4 h-4 mr-2" />
                            View All Activity
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Activity className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No recent activity</h3>
                        <p className="text-gray-500 mb-4">Start participating in hackathons to see your activity here</p>
                        <div className="flex gap-2 justify-center">
                          <Link href="/explore">
                            <Button size="sm">
                              <Rocket className="w-4 h-4 mr-2" />
                              Explore Events
                            </Button>
                          </Link>
                          <Link href="/submit">
                            <Button size="sm" variant="outline">
                              <Code className="w-4 h-4 mr-2" />
                              Submit Project
                            </Button>
                          </Link>
                        </div>
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