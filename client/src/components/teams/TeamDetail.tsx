import { useState, useEffect } from "react";
import { useParams, Link, useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, MessageCircle, Settings, Calendar, MapPin, ArrowLeft, Crown, Mail, ExternalLink } from "lucide-react";
import teamsData, { type Team, type User } from "@/lib/fixtures/teamsData";

const currentUserId = "1"; // Mock current user

export default function TeamDetail() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const [team, setTeam] = useState<Team | null>(null);
  const [teamMembers, setTeamMembers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const foundTeam = teamsData.teams.find(t => t.id === id);
      if (foundTeam) {
        setTeam(foundTeam);
        const members = foundTeam.members.map(member => 
          teamsData.users.find(user => user.id === member.userId)
        ).filter(Boolean) as User[];
        setTeamMembers(members);
      }
    }
    setIsLoading(false);
  }, [id]);

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-muted rounded w-64"></div>
          <div className="h-32 bg-muted rounded"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 h-96 bg-muted rounded"></div>
            <div className="h-96 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="p-12 text-center" data-testid="team-not-found">
          <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Team not found</h3>
          <p className="text-muted-foreground mb-4">The team you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/teams/find')} className="bg-coral hover:bg-coral/90">
            Find Other Teams
          </Button>
        </Card>
      </div>
    );
  }

  const isCurrentUserMember = team.members.some(member => member.userId === currentUserId);
  const isCurrentUserLeader = team.leaderId === currentUserId;
  const currentUserRole = team.members.find(member => member.userId === currentUserId)?.role;
  const teamLeader = teamsData.users.find(user => user.id === team.leaderId);
  const availableSpots = team.maxSize - team.members.length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/teams')} className="text-coral hover:text-coral/80" data-testid="button-back">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Teams
          </Button>
        </div>
        
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-heading font-bold text-foreground">{team.name}</h1>
              <Badge variant={team.status === 'recruiting' ? 'default' : 'secondary'} className="bg-mint/10 text-mint">
                {team.status === 'recruiting' ? `${availableSpots} spots available` : team.status === 'full' ? 'Team Full' : 'Closed'}
              </Badge>
              {isCurrentUserMember && <Crown className="w-5 h-5 text-yellow" />}
            </div>
            <p className="text-lg text-muted-foreground mb-4">{team.description}</p>
            {isCurrentUserMember && (
              <Badge variant="secondary" className="bg-sky/10 text-sky">
                Your role: {currentUserRole}
              </Badge>
            )}
          </div>
          
          <div className="flex gap-2">
            {isCurrentUserMember ? (
              <>
                <Link to={`/teams/${team.id}/chat`}>
                  <Button className="bg-sky hover:bg-sky/90" data-testid="button-team-chat">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Team Chat
                  </Button>
                </Link>
                {isCurrentUserLeader && (
                  <Link to={`/teams/${team.id}/manage`}>
                    <Button variant="outline" className="border-coral text-coral hover:bg-coral/10" data-testid="button-manage-team">
                      <Settings className="w-4 h-4 mr-2" />
                      Manage
                    </Button>
                  </Link>
                )}
              </>
            ) : (
              <Link to={`/teams/${team.id}/apply`}>
                <Button 
                  className="bg-coral hover:bg-coral/90" 
                  disabled={team.status !== 'recruiting'}
                  data-testid="button-apply-team"
                >
                  {team.status === 'recruiting' ? 'Apply to Join' : 'Team Full'}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="overview" className="space-y-6" data-testid="team-detail-tabs">
            <TabsList>
              <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
              <TabsTrigger value="members" data-testid="tab-members">Members ({team.members.length})</TabsTrigger>
              <TabsTrigger value="activity" data-testid="tab-activity">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6" data-testid="tab-content-overview">
              {/* Project Idea */}
              {team.projectIdea && (
                <Card data-testid="project-idea-section">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ExternalLink className="w-5 h-5 text-sky" />
                      Project Idea
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground">{team.projectIdea}</p>
                  </CardContent>
                </Card>
              )}

              {/* Skills & Roles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card data-testid="required-skills-section">
                  <CardHeader>
                    <CardTitle className="text-lg">Required Skills</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {team.requiredSkills.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {team.requiredSkills.map(skill => (
                          <Badge key={skill} variant="secondary" className="bg-coral/10 text-coral">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-sm">No specific skills required</p>
                    )}
                  </CardContent>
                </Card>

                <Card data-testid="looking-for-section">
                  <CardHeader>
                    <CardTitle className="text-lg">Looking For</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {team.lookingForRoles.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {team.lookingForRoles.map(role => (
                          <Badge key={role} variant="secondary" className="bg-mint/10 text-mint">
                            {role}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-sm">No specific roles needed</p>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Tags */}
              {team.tags.length > 0 && (
                <Card data-testid="tags-section">
                  <CardHeader>
                    <CardTitle className="text-lg">Categories</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {team.tags.map(tag => (
                        <Badge key={tag} variant="outline" className="border-sky/20 text-sky">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="members" className="space-y-6" data-testid="tab-content-members">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Team Members ({team.members.length}/{team.maxSize})</span>
                    {isCurrentUserLeader && (
                      <Link to={`/teams/${team.id}/manage`}>
                        <Button size="sm" variant="outline" className="border-coral text-coral hover:bg-coral/10">
                          <Settings className="w-4 h-4 mr-2" />
                          Manage Members
                        </Button>
                      </Link>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {team.members.map(member => {
                      const user = teamsData.users.find(u => u.id === member.userId);
                      const isLeader = member.userId === team.leaderId;
                      
                      return (
                        <div key={member.userId} className="flex items-center justify-between p-4 border border-border rounded-lg" data-testid={`member-${member.userId}`}>
                          <div className="flex items-center gap-3">
                            <Avatar className="w-12 h-12">
                              <AvatarFallback className="bg-gradient-to-br from-coral to-coral/80 text-white font-semibold">
                                {user?.avatar}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-foreground">{user?.fullName}</h3>
                                {isLeader && <Crown className="w-4 h-4 text-yellow" />}
                              </div>
                              <p className="text-sm text-muted-foreground">{member.role}</p>
                              <p className="text-xs text-muted-foreground">@{user?.username}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {user?.skills.slice(0, 3).map(skill => (
                              <Badge key={skill} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {user && user.skills.length > 3 && (
                              <Badge variant="secondary" className="text-xs">+{user.skills.length - 3}</Badge>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="space-y-6" data-testid="tab-content-activity">
              <Card data-testid="activity-section">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Mock activity feed */}
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-3 bg-mint/5 rounded-lg">
                      <Users className="w-5 h-5 text-mint mt-0.5" />
                      <div>
                        <p className="text-sm text-foreground">
                          <strong>Mike Johnson</strong> joined as ML Engineer
                        </p>
                        <p className="text-xs text-muted-foreground">2 days ago</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-sky/5 rounded-lg">
                      <MessageCircle className="w-5 h-5 text-sky mt-0.5" />
                      <div>
                        <p className="text-sm text-foreground">
                          <strong>Alex Chen</strong> started a discussion about project architecture
                        </p>
                        <p className="text-xs text-muted-foreground">3 days ago</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-coral/5 rounded-lg">
                      <Calendar className="w-5 h-5 text-coral mt-0.5" />
                      <div>
                        <p className="text-sm text-foreground">
                          Team was created by <strong>Alex Chen</strong>
                        </p>
                        <p className="text-xs text-muted-foreground">1 week ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Team Stats */}
          <Card data-testid="team-stats-section">
            <CardHeader>
              <CardTitle className="text-lg">Team Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Team Size</span>
                <span className="text-sm font-medium">{team.members.length}/{team.maxSize} members</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Available Spots</span>
                <span className="text-sm font-medium">{availableSpots}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Created</span>
                <span className="text-sm font-medium">{new Date(team.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Last Activity</span>
                <span className="text-sm font-medium">{new Date(team.lastActivity).toLocaleDateString()}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge variant={team.status === 'recruiting' ? 'default' : 'secondary'} className="bg-mint/10 text-mint">
                  {team.status === 'recruiting' ? 'Recruiting' : team.status === 'full' ? 'Full' : 'Closed'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Team Leader */}
          {teamLeader && (
            <Card data-testid="team-leader-section">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Crown className="w-5 h-5 text-yellow" />
                  Team Leader
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-gradient-to-br from-coral to-coral/80 text-white font-semibold">
                      {teamLeader.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{teamLeader.fullName}</h3>
                    <p className="text-sm text-muted-foreground">@{teamLeader.username}</p>
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-sm text-muted-foreground mb-2">{teamLeader.bio}</p>
                  <div className="flex flex-wrap gap-1">
                    {teamLeader.skills.slice(0, 3).map(skill => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {teamLeader.skills.length > 3 && (
                      <Badge variant="secondary" className="text-xs">+{teamLeader.skills.length - 3}</Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card data-testid="quick-actions-section">
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {isCurrentUserMember ? (
                <>
                  <Link to={`/teams/${team.id}/chat`} className="block">
                    <Button className="w-full bg-sky hover:bg-sky/90" data-testid="action-team-chat">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Team Chat
                    </Button>
                  </Link>
                  {isCurrentUserLeader && (
                    <Link to={`/teams/${team.id}/manage`} className="block">
                      <Button variant="outline" className="w-full border-coral text-coral hover:bg-coral/10" data-testid="action-manage">
                        <Settings className="w-4 h-4 mr-2" />
                        Manage Team
                      </Button>
                    </Link>
                  )}
                  <Link to={`/teams/${team.id}/settings`} className="block">
                    <Button variant="outline" className="w-full" data-testid="action-settings">
                      Settings
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to={`/teams/${team.id}/apply`} className="block">
                    <Button 
                      className="w-full bg-coral hover:bg-coral/90" 
                      disabled={team.status !== 'recruiting'}
                      data-testid="action-apply"
                    >
                      {team.status === 'recruiting' ? 'Apply to Join' : 'Team Full'}
                    </Button>
                  </Link>
                  <Button variant="outline" className="w-full" data-testid="action-contact">
                    <Mail className="w-4 h-4 mr-2" />
                    Contact Team
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}