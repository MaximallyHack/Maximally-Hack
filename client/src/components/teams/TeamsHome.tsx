import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Users, Plus, Search, MessageCircle, Calendar, TrendingUp, Award } from "lucide-react";
import teamsData, { type Team, type Activity, type User } from "@/lib/fixtures/teamsData";

const currentUserId = "1"; // Mock current user

export default function TeamsHome() {
  const [userTeams, setUserTeams] = useState<Team[]>([]);
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  const [stats, setStats] = useState({ totalTeams: 0, activeApplications: 0, invitations: 0 });

  useEffect(() => {
    // Get user's teams
    const teams = teamsData.teams.filter(team => 
      team.members.some(member => member.userId === currentUserId)
    );
    setUserTeams(teams);

    // Get recent activities for user's teams
    const activities = teamsData.activities
      .filter(activity => teams.some(team => team.id === activity.teamId))
      .slice(0, 5);
    setRecentActivity(activities);

    // Calculate stats
    const totalTeams = teams.length;
    const activeApplications = teamsData.teamRequests.filter(req => 
      teams.some(team => team.id === req.teamId) && req.status === 'pending'
    ).length;
    setStats({ totalTeams, activeApplications, invitations: 2 });
  }, []);

  const getTeamRole = (team: Team) => {
    const member = team.members.find(m => m.userId === currentUserId);
    return member?.role || "Member";
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'team_created': return <Plus className="w-4 h-4 text-coral" />;
      case 'member_joined': return <Users className="w-4 h-4 text-mint" />;
      case 'application_received': return <MessageCircle className="w-4 h-4 text-sky" />;
      default: return <Calendar className="w-4 h-4 text-gray-400" />;
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    }
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-foreground mb-2">Teams Dashboard</h1>
        <p className="text-muted-foreground">Manage your teams and discover collaboration opportunities</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-coral/5 to-coral/10 border-coral/20" data-testid="stat-total-teams">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">My Teams</p>
                <p className="text-2xl font-bold text-coral">{stats.totalTeams}</p>
              </div>
              <Users className="w-8 h-8 text-coral" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-mint/5 to-mint/10 border-mint/20" data-testid="stat-applications">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Applications</p>
                <p className="text-2xl font-bold text-mint">{stats.activeApplications}</p>
              </div>
              <MessageCircle className="w-8 h-8 text-mint" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-sky/5 to-sky/10 border-sky/20" data-testid="stat-invitations">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Team Invitations</p>
                <p className="text-2xl font-bold text-sky">{stats.invitations}</p>
              </div>
              <Award className="w-8 h-8 text-sky" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* My Teams */}
        <Card data-testid="my-teams-section">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-semibold">My Teams</CardTitle>
            <div className="flex gap-2">
              <Link to="/teams/create" data-testid="button-create-team">
                <Button size="sm" className="bg-coral hover:bg-coral/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Team
                </Button>
              </Link>
              <Link to="/teams/find" data-testid="button-find-teams">
                <Button size="sm" variant="outline" className="border-mint text-mint hover:bg-mint/10">
                  <Search className="w-4 h-4 mr-2" />
                  Find Teams
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {userTeams.length === 0 ? (
              <div className="text-center py-8" data-testid="empty-teams-state">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold text-foreground mb-2">No teams yet</h3>
                <p className="text-muted-foreground mb-4">Start your hackathon journey by creating or joining a team</p>
                <div className="flex gap-2 justify-center">
                  <Link to="/teams/create">
                    <Button size="sm" className="bg-coral hover:bg-coral/90">
                      Create Team
                    </Button>
                  </Link>
                  <Link to="/teams/find">
                    <Button size="sm" variant="outline">
                      Find Teams
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {userTeams.map((team) => (
                  <div key={team.id} className="p-4 border border-border rounded-xl hover:shadow-sm transition-shadow" data-testid={`team-card-${team.id}`}>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <Link to={`/teams/${team.id}`} className="font-semibold text-foreground hover:text-coral transition-colors">
                          {team.name}
                        </Link>
                        <p className="text-sm text-[#6C6C6C] dark:text-muted-foreground mb-2">{getTeamRole(team)}</p>
                      </div>
                      <Badge variant={team.status === 'recruiting' ? 'default' : 'secondary'} className="bg-mint/10 text-mint">
                        {team.status === 'recruiting' ? 'Recruiting' : 'Full'}
                      </Badge>
                    </div>
                    <p className="text-sm text-[#6C6C6C] dark:text-muted-foreground mb-4 line-clamp-2">{team.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">
                          {team.members.slice(0, 3).map((member, idx) => {
                            const user = teamsData.users.find(u => u.id === member.userId);
                            return (
                              <Avatar key={member.userId} className="w-6 h-6 ring-2 ring-background">
                                <AvatarFallback className="text-xs bg-gradient-to-br from-coral to-coral/80 text-white">
                                  {user?.avatar}
                                </AvatarFallback>
                              </Avatar>
                            );
                          })}
                          {team.members.length > 3 && (
                            <div className="w-6 h-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                              <span className="text-xs text-muted-foreground">+{team.members.length - 3}</span>
                            </div>
                          )}
                        </div>
                        <span className="text-sm text-[#6C6C6C] dark:text-muted-foreground ml-2">{team.members.length}/5 members</span>
                      </div>
                      <Link to={`/teams/${team.id}`}>
                        <Button size="sm" variant="outline" className="border-sky text-sky hover:bg-sky/10">
                          View Team
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
                <Link to="/teams/my" className="block" data-testid="link-view-all-teams">
                  <Button variant="ghost" className="w-full text-coral hover:text-coral/80">
                    View All My Teams
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card data-testid="recent-activity-section">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {recentActivity.length === 0 ? (
              <div className="text-center py-8" data-testid="empty-activity-state">
                <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold text-foreground mb-2">No recent activity</h3>
                <p className="text-muted-foreground">Team activities will appear here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentActivity.map((activity, index) => {
                  const team = teamsData.teams.find(t => t.id === activity.teamId);
                  const user = teamsData.users.find(u => u.id === activity.userId);
                  return (
                    <div key={activity.id} className="flex items-start gap-3" data-testid={`activity-${activity.id}`}>
                      {getActivityIcon(activity.type)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground">
                          <span className="font-medium">{user?.fullName}</span>
                          <span className="text-muted-foreground"> {activity.message}</span>
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground">{team?.name}</span>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground">{formatTimeAgo(activity.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="mt-8" data-testid="quick-actions-section">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Link to="/teams/lfg" data-testid="quick-action-lfg">
              <Button variant="outline" className="w-full h-20 flex-col gap-2 border-mint text-mint hover:bg-mint/10">
                <MessageCircle className="w-6 h-6" />
                <span className="font-medium">Browse LFG</span>
              </Button>
            </Link>
            <Link to="/teams/invites" data-testid="quick-action-invites">
              <Button variant="outline" className="w-full h-20 flex-col gap-2 border-sky text-sky hover:bg-sky/10">
                <Award className="w-6 h-6" />
                <span className="font-medium">My Invites</span>
              </Button>
            </Link>
            <Link to="/teams/requests" data-testid="quick-action-requests">
              <Button variant="outline" className="w-full h-20 flex-col gap-2 border-coral text-coral hover:bg-coral/10">
                <Users className="w-6 h-6" />
                <span className="font-medium">Join Requests</span>
              </Button>
            </Link>
            <Link to="/teams/match" data-testid="quick-action-match">
              <Button variant="outline" className="w-full h-20 flex-col gap-2 border-yellow text-yellow hover:bg-yellow/10">
                <Search className="w-6 h-6" />
                <span className="font-medium">Team Match</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}