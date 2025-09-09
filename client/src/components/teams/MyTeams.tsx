import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Settings, MessageCircle, Calendar, ArrowLeft, Plus, Crown } from "lucide-react";
import teamsData, { type Team, type User } from "@/lib/fixtures/teamsData";

const currentUserId = "1"; // Mock current user

export default function MyTeams() {
  const [, navigate] = useLocation();
  const [userTeams, setUserTeams] = useState<Team[]>([]);
  const [leadingTeams, setLeadingTeams] = useState<Team[]>([]);
  const [memberTeams, setMemberTeams] = useState<Team[]>([]);

  useEffect(() => {
    const teams = teamsData.teams.filter(team => 
      team.members.some(member => member.userId === currentUserId)
    );

    const leading = teams.filter(team => team.leaderId === currentUserId);
    const member = teams.filter(team => team.leaderId !== currentUserId);

    setUserTeams(teams);
    setLeadingTeams(leading);
    setMemberTeams(member);
  }, []);

  const getTeamRole = (team: Team) => {
    const member = team.members.find(m => m.userId === currentUserId);
    return member?.role || "Member";
  };

  const getTeamMembers = (team: Team): User[] => {
    return team.members.map(member => 
      teamsData.users.find(user => user.id === member.userId)
    ).filter(Boolean) as User[];
  };

  const TeamCard = ({ team, showActions = true }: { team: Team; showActions?: boolean }) => {
    const members = getTeamMembers(team);
    const isLeader = team.leaderId === currentUserId;
    const availableSpots = team.maxSize - team.members.length;

    return (
      <Card className="hover:shadow-md transition-shadow" data-testid={`team-card-${team.id}`}>
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Link to={`/teams/${team.id}`} className="text-2xl font-semibold text-foreground hover:text-coral transition-colors">
                  {team.name}
                </Link>
                {isLeader && <Crown className="w-5 h-5 text-yellow-dark dark:text-yellow" />}
                <Badge variant={team.status === 'recruiting' ? 'default' : 'secondary'} className="bg-mint text-text-dark dark:bg-card dark:text-mint">
                  {team.status === 'recruiting' ? 'Recruiting' : team.status === 'full' ? 'Full' : 'Closed'}
                </Badge>
              </div>
              <p className="text-sm text-[#6C6C6C] dark:text-muted-foreground mb-2">{getTeamRole(team)}</p>
              <p className="text-muted-foreground mb-3 line-clamp-2">{team.description}</p>
            </div>
            {showActions && (
              <div className="flex gap-2">
                <Link to={`/teams/${team.id}/chat`}>
                  <Button size="sm" variant="outline" className="border-sky text-sky hover:bg-sky-dark" data-testid={`button-chat-${team.id}`}>
                    <MessageCircle className="w-4 h-4" />
                  </Button>
                </Link>
                {isLeader && (
                  <Link to={`/teams/${team.id}/manage`}>
                    <Button size="sm" variant="outline" className="border-coral text-coral hover:bg-coral-dark" data-testid={`button-manage-${team.id}`}>
                      <Settings className="w-4 h-4" />
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Project Idea */}
          {team.projectIdea && (
            <div className="mb-4">
              <p className="text-sm text-foreground bg-sky/5 p-3 rounded-lg border border-sky/10">
                <strong>Project:</strong> {team.projectIdea}
              </p>
            </div>
          )}

          {/* Team Members */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="text-sm font-medium text-foreground">Team Members</h4>
              <span className="text-xs text-text-dark dark:text-muted-foreground">({team.members.length}/{team.maxSize} members)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {members.slice(0, 5).map((member) => (
                  <Avatar key={member.id} className="w-8 h-8 ring-2 ring-background" title={member.fullName}>
                    <AvatarFallback className="text-xs bg-gradient-to-br from-coral to-coral/80 text-white">
                      {member.avatar}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {members.length > 5 && (
                  <div className="w-8 h-8 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                    <span className="text-xs text-muted-foreground">+{members.length - 5}</span>
                  </div>
                )}
              </div>
              {team.status === 'recruiting' && availableSpots > 0 && (
                <span className="text-sm text-mint-dark dark:text-mint">({availableSpots} spots available)</span>
              )}
            </div>
          </div>

          {/* Skills and Roles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {team.requiredSkills.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-foreground mb-2">Skills</h4>
                <div className="flex flex-wrap gap-1">
                  {team.requiredSkills.slice(0, 3).map(skill => (
                    <Badge key={skill} variant="secondary" className="bg-coral text-text-dark dark:bg-card dark:text-coral text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {team.requiredSkills.length > 3 && (
                    <Badge variant="secondary" className="text-xs">+{team.requiredSkills.length - 3}</Badge>
                  )}
                </div>
              </div>
            )}
            {team.lookingForRoles.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-foreground mb-2">Looking For</h4>
                <div className="flex flex-wrap gap-1">
                  {team.lookingForRoles.slice(0, 2).map(role => (
                    <Badge key={role} variant="secondary" className="bg-mint text-text-dark dark:bg-card dark:text-mint text-xs">
                      {role}
                    </Badge>
                  ))}
                  {team.lookingForRoles.length > 2 && (
                    <Badge variant="secondary" className="text-xs">+{team.lookingForRoles.length - 2}</Badge>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                Last activity: {new Date(team.lastActivity).toLocaleDateString()}
              </span>
            </div>
            <div className="flex gap-2">
              <Link to={`/teams/${team.id}`}>
                <Button size="sm" variant="outline" className="border-sky text-sky hover:bg-sky-dark" data-testid={`button-view-${team.id}`}>
                  View Details
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-heading font-bold text-foreground mb-2">My Teams</h1>
            <p className="text-muted-foreground">Manage your team memberships and leadership roles</p>
          </div>
          <Link to="/teams/create" data-testid="button-create-team">
            <Button className="bg-coral hover:bg-coral/50">
              <Plus className="w-4 h-4 mr-2" />
              Create Team
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-coral/5 to-coral/10 border-coral/20" data-testid="stat-total-teams">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Teams</p>
                <p className="text-2xl font-bold text-coral">{userTeams.length}</p>
              </div>
              <Users className="w-8 h-8 text-coral" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow/5 to-yellow/10 border-yellow/20" data-testid="stat-leading">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Leading</p>
                <p className="text-2xl font-bold text-yellow">{leadingTeams.length}</p>
              </div>
              <Crown className="w-8 h-8 text-yellow" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-mint/5 to-mint/10 border-mint/20" data-testid="stat-member">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Member of</p>
                <p className="text-2xl font-bold text-mint">{memberTeams.length}</p>
              </div>
              <Users className="w-8 h-8 text-mint" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Teams Tabs */}
      <Tabs defaultValue="all" className="space-y-6" data-testid="teams-tabs">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all" data-testid="tab-all">All Teams ({userTeams.length})</TabsTrigger>
          <TabsTrigger value="leading" data-testid="tab-leading">Leading ({leadingTeams.length})</TabsTrigger>
          <TabsTrigger value="member" data-testid="tab-member">Member ({memberTeams.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6" data-testid="tab-content-all">
          {userTeams.length === 0 ? (
            <Card className="p-12 text-center" data-testid="empty-all-state">
              <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No teams yet</h3>
              <p className="text-muted-foreground mb-4">You haven't joined any teams yet. Start by creating or finding a team!</p>
              <div className="flex gap-2 justify-center">
                <Link to="/teams/create">
                  <Button className="bg-coral hover:bg-coral/90">
                    Create Team
                  </Button>
                </Link>
                <Link to="/teams/find">
                  <Button variant="outline">
                    Find Teams
                  </Button>
                </Link>
              </div>
            </Card>
          ) : (
            <div className="space-y-6">
              {userTeams.map(team => <TeamCard key={team.id} team={team} />)}
            </div>
          )}
        </TabsContent>

        <TabsContent value="leading" className="space-y-6" data-testid="tab-content-leading">
          {leadingTeams.length === 0 ? (
            <Card className="p-12 text-center" data-testid="empty-leading-state">
              <Crown className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No teams leading</h3>
              <p className="text-muted-foreground mb-4">You're not currently leading any teams. Create a team to become a leader!</p>
              <Link to="/teams/create">
                <Button className="bg-coral hover:bg-coral/90">
                  Create Team
                </Button>
              </Link>
            </Card>
          ) : (
            <div className="space-y-6">
              {leadingTeams.map(team => <TeamCard key={team.id} team={team} />)}
            </div>
          )}
        </TabsContent>

        <TabsContent value="member" className="space-y-6" data-testid="tab-content-member">
          {memberTeams.length === 0 ? (
            <Card className="p-12 text-center" data-testid="empty-member-state">
              <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No member teams</h3>
              <p className="text-muted-foreground mb-4">You're not currently a member of any teams. Find a team to join!</p>
              <Link to="/teams/find">
                <Button variant="outline">
                  Find Teams
                </Button>
              </Link>
            </Card>
          ) : (
            <div className="space-y-6">
              {memberTeams.map(team => <TeamCard key={team.id} team={team} />)}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}