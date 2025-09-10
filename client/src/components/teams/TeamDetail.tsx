import { useState, useEffect } from "react";
import { useParams, Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, MessageCircle, Settings, Calendar, MapPin, ArrowLeft, Crown, Mail, ExternalLink, UserPlus, UserCheck, Send, CheckCircle, XCircle } from "lucide-react";
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { supabaseApi, type Team, type User } from '@/lib/supabaseApi';

export default function TeamDetail() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { user: supabaseUser } = useSupabaseAuth();

  const { data: team, isLoading, error } = useQuery({
    queryKey: ['team', id],
    queryFn: async () => {
      if (!id) return null;
      const teamData = await supabaseApi.getTeam(id);
      return teamData as any;
    },
    enabled: !!id
  });

  const { data: teamActivity, isLoading: activityLoading } = useQuery({
    queryKey: ['teamActivity', id],
    queryFn: async () => {
      if (!id) return [];
      return await supabaseApi.getTeamActivity(id);
    },
    enabled: !!id
  });

  const teamMembers = (team?.members || []) as User[];

  // Helper function to get activity icon
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'member_joined':
        return <UserPlus className="w-5 h-5 text-mint mt-0.5" />;
      case 'team_created':
        return <Calendar className="w-5 h-5 text-coral mt-0.5" />;
      case 'application_submitted':
        return <Send className="w-5 h-5 text-sky mt-0.5" />;
      case 'application_reviewed':
        return <CheckCircle className="w-5 h-5 text-mint mt-0.5" />;
      case 'invitation_sent':
        return <Mail className="w-5 h-5 text-coral mt-0.5" />;
      case 'invitation_responded':
        return <UserCheck className="w-5 h-5 text-mint mt-0.5" />;
      default:
        return <MessageCircle className="w-5 h-5 text-sky mt-0.5" />;
    }
  };

  // Helper function to get activity message
  const getActivityMessage = (activity: any) => {
    const userName = activity.user.name;
    
    switch (activity.type) {
      case 'member_joined':
        return `${userName} joined the team${activity.data.role === 'leader' ? ' as leader' : ''}`;
      case 'team_created':
        return `Team was created by ${userName}`;
      case 'application_submitted':
        return `${userName} applied to join the team`;
      case 'application_reviewed':
        return `${userName} ${activity.data.status === 'accepted' ? 'accepted' : 'rejected'} ${activity.data.applicant?.name}'s application`;
      case 'invitation_sent':
        return `${userName} invited ${activity.data.invitee?.name} to join the team`;
      case 'invitation_responded':
        return `${userName} ${activity.data.status === 'accepted' ? 'accepted' : 'rejected'} the team invitation`;
      default:
        return `${userName} performed an action`;
    }
  };

  // Helper function to get activity background color
  const getActivityBgColor = (type: string) => {
    switch (type) {
      case 'member_joined':
      case 'application_reviewed':
      case 'invitation_responded':
        return 'bg-mint/5';
      case 'team_created':
      case 'invitation_sent':
        return 'bg-coral/5';
      case 'application_submitted':
      default:
        return 'bg-sky/5';
    }
  };

  // Helper function to format timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 60) {
      return `${diffMins === 0 ? 'Just now' : `${diffMins} min${diffMins === 1 ? '' : 's'} ago`}`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
    } else if (diffDays < 30) {
      return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

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

  const isCurrentUserMember = teamMembers.some((member: any) => member.id === user?.id);
  const isCurrentUserLeader = team.leader_id === user?.id;
  const currentUserRole = isCurrentUserLeader ? "Leader" : "Member";
  const teamLeader = teamMembers.find((member: any) => member.id === team.leader_id);
  const availableSpots = (team.max_size ?? team.maxSize) - teamMembers.length;

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
                <Link to={`/teams/${team.id}/mails`}>
                  <Button className="bg-sky hover:bg-sky/90" data-testid="button-team-mails">
                    <Mail className="w-4 h-4 mr-2" />
                    Team Mails
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
              {team.description && (
                <Card data-testid="project-idea-section">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ExternalLink className="w-5 h-5 text-sky" />
                      Project Idea
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground">{team.description}</p>
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
                    {(team.skills || []).length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {(team.skills || []).map((skill: string) => (
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
                    {(team.looking_for || []).length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {(team.looking_for || []).map((role: string) => (
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

              {/* Tags (Track) */}
              {team.track && (
                <Card data-testid="tags-section">
                  <CardHeader>
                    <CardTitle className="text-lg">Track</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="border-sky/20 text-sky">
                        {team.track}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="members" className="space-y-6" data-testid="tab-content-members">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Team Members ({teamMembers.length}/{team.max_size ?? team.maxSize})</span>
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
                    {teamMembers.map((member: any) => {
                      const isLeader = member.id === team.leader_id;
                      
                      return (
                        <div key={member.id} className="flex items-center justify-between p-4 border border-border rounded-lg" data-testid={`member-${member.id}`}>
                          <div className="flex items-center gap-3">
                            <Avatar className="w-12 h-12">
                              <AvatarFallback className="bg-gradient-to-br from-coral to-coral/80 text-white font-semibold">
                                {member.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2) || 'U'}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-foreground">{member.name || member.username}</h3>
                                {isLeader && <Crown className="w-4 h-4 text-yellow" />}
                              </div>
                              <p className="text-sm text-muted-foreground">{isLeader ? 'Leader' : 'Member'}</p>
                              <p className="text-xs text-muted-foreground">@{member.username}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {(member.skills || []).slice(0, 3).map((skill: string) => (
                              <Badge key={skill} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {member.skills && member.skills.length > 3 && (
                              <Badge variant="secondary" className="text-xs">+{member.skills.length - 3}</Badge>
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
                  {activityLoading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="animate-pulse flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                          <div className="w-5 h-5 bg-muted rounded"></div>
                          <div className="flex-1">
                            <div className="h-4 bg-muted rounded mb-2"></div>
                            <div className="h-3 bg-muted rounded w-24"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : teamActivity && teamActivity.length > 0 ? (
                    <div className="space-y-4">
                      {teamActivity.slice(0, 10).map((activity, index) => (
                        <div key={`${activity.type}-${activity.timestamp}-${index}`} className={`flex items-start gap-3 p-3 ${getActivityBgColor(activity.type)} rounded-lg`}>
                          {getActivityIcon(activity.type)}
                          <div>
                            <p className="text-sm text-foreground">
                              {getActivityMessage(activity)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatTimestamp(activity.timestamp)}
                            </p>
                          </div>
                        </div>
                      ))}
                      {teamActivity.length === 0 && (
                        <div className="text-center py-8">
                          <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                          <p className="text-muted-foreground">No recent activity</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No recent activity</p>
                    </div>
                  )}
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
                <span className="text-sm font-medium">{teamMembers.length}/{team.max_size ?? team.maxSize} members</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Available Spots</span>
                <span className="text-sm font-medium">{availableSpots}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Created</span>
                <span className="text-sm font-medium">{new Date(team.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge variant={team.status === 'recruiting' ? 'default' : 'secondary'} className="bg-mint/10 text-mint">
                  {team.status === 'recruiting' ? 'Recruiting' : team.status === 'full' ? 'Full' : 'Closed'}
                </Badge>
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
                      {teamLeader.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2) || 'L'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{teamLeader.name || teamLeader.username}</h3>
                    <p className="text-sm text-muted-foreground">@{teamLeader.username}</p>
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-sm text-muted-foreground mb-2">{teamLeader.bio}</p>
                  <div className="flex flex-wrap gap-1">
                    {(teamLeader.skills || []).slice(0, 3).map((skill: string) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {(teamLeader.skills || []).length > 3 && (
                      <Badge variant="secondary" className="text-xs">+{(teamLeader.skills || []).length - 3}</Badge>
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
                  <Link to={`/teams/${team.id}/mails`} className="block">
                    <Button className="w-full bg-sky hover:bg-sky/90" data-testid="action-team-mails">
                      <Mail className="w-4 h-4 mr-2" />
                      Team Mails
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