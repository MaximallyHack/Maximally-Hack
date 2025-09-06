import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Users, Settings, UserMinus, UserPlus, ArrowLeft, Crown, Mail, Shield, Trash2, Edit } from "lucide-react";
import teamsData, { type Team, type User, type TeamMember } from "@/lib/fixtures/teamsData";
import { useToast } from "@/hooks/use-toast";

const currentUserId = "1"; // Mock current user

export default function TeamManagement() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [team, setTeam] = useState<Team | null>(null);
  const [teamMembers, setTeamMembers] = useState<User[]>([]);
  const [pendingApplications] = useState(3); // Mock data
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const foundTeam = teamsData.teams.find(t => t.id === id);
      if (foundTeam) {
        // Check if current user is the team leader
        if (foundTeam.leaderId !== currentUserId) {
          toast({ title: "Access Denied", description: "You don't have permission to manage this team.", variant: "destructive" });
          navigate(`/teams/${id}`);
          return;
        }
        
        setTeam(foundTeam);
        const members = foundTeam.members.map(member => 
          teamsData.users.find(user => user.id === member.userId)
        ).filter(Boolean) as User[];
        setTeamMembers(members);
      }
    }
    setIsLoading(false);
  }, [id, navigate, toast]);

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
          <Settings className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Team not found</h3>
          <p className="text-muted-foreground mb-4">The team you're trying to manage doesn't exist.</p>
          <Button onClick={() => navigate('/teams')} className="bg-coral hover:bg-coral/90">
            Back to Teams
          </Button>
        </Card>
      </div>
    );
  }

  const handleRemoveMember = (memberId: string) => {
    toast({ title: "Member Removed", description: "Team member has been removed successfully." });
    // In a real app, this would make an API call
  };

  const handleChangeRole = (memberId: string, newRole: string) => {
    toast({ title: "Role Updated", description: `Member role has been updated to ${newRole}.` });
    // In a real app, this would make an API call
  };

  const MemberCard = ({ member, user }: { member: TeamMember; user: User }) => {
    const isLeader = member.userId === team.leaderId;
    
    return (
      <Card key={member.userId} className="p-4" data-testid={`member-card-${member.userId}`}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 flex-1">
            <Avatar className="w-12 h-12">
              <AvatarFallback className="bg-gradient-to-br from-coral to-coral/80 text-white font-semibold">
                {user.avatar}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-foreground">{user.fullName}</h3>
                {isLeader && <Crown className="w-4 h-4 text-yellow" />}
                {member.role === 'admin' && <Shield className="w-4 h-4 text-blue-500" />}
              </div>
              <p className="text-sm text-muted-foreground mb-1">@{user.username}</p>
              <Badge variant="secondary" className="text-xs">{member.role}</Badge>
            </div>
          </div>
          
          {!isLeader && (
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => {}} data-testid={`button-edit-${member.userId}`}>
                <Edit className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={() => {}} data-testid={`button-message-${member.userId}`}>
                <Mail className="w-4 h-4" />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button size="sm" variant="outline" className="border-red-200 text-red-600 hover:bg-red-50" data-testid={`button-remove-${member.userId}`}>
                    <UserMinus className="w-4 h-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Remove Team Member</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to remove {user.fullName} from the team? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleRemoveMember(member.userId)} className="bg-red-600 hover:bg-red-700">
                      Remove Member
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>
        
        <div className="mt-3 pt-3 border-t border-border">
          <div className="flex flex-wrap gap-1 mb-2">
            {user.skills.slice(0, 4).map(skill => (
              <Badge key={skill} variant="secondary" className="text-xs">{skill}</Badge>
            ))}
            {user.skills.length > 4 && (
              <Badge variant="secondary" className="text-xs">+{user.skills.length - 4}</Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{user.bio}</p>
        </div>
      </Card>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(`/teams/${team.id}`)} className="text-coral hover:text-coral/80" data-testid="button-back">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Team
          </Button>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-heading font-bold text-foreground mb-2">Manage {team.name}</h1>
            <p className="text-muted-foreground">Team leadership tools and member management</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate(`/teams/${team.id}/edit`)} data-testid="button-edit-team">
              <Edit className="w-4 h-4 mr-2" />
              Edit Team
            </Button>
            <Button className="bg-mint hover:bg-mint/90" data-testid="button-invite-members">
              <UserPlus className="w-4 h-4 mr-2" />
              Invite Members
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-coral/5 to-coral/10 border-coral/20" data-testid="stat-total-members">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Members</p>
                <p className="text-2xl font-bold text-coral">{team.members.length}</p>
              </div>
              <Users className="w-8 h-8 text-coral" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-mint/5 to-mint/10 border-mint/20" data-testid="stat-available-spots">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Available Spots</p>
                <p className="text-2xl font-bold text-mint">{team.maxSize - team.members.length}</p>
              </div>
              <UserPlus className="w-8 h-8 text-mint" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-sky/5 to-sky/10 border-sky/20" data-testid="stat-pending-applications">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Applications</p>
                <p className="text-2xl font-bold text-sky">{pendingApplications}</p>
              </div>
              <Mail className="w-8 h-8 text-sky" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow/5 to-yellow/10 border-yellow/20" data-testid="stat-team-status">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Team Status</p>
                <p className="text-lg font-bold text-yellow capitalize">{team.status}</p>
              </div>
              <Settings className="w-8 h-8 text-yellow" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Management Tabs */}
      <Tabs defaultValue="members" className="space-y-6" data-testid="management-tabs">
        <TabsList>
          <TabsTrigger value="members" data-testid="tab-members">Members ({team.members.length})</TabsTrigger>
          <TabsTrigger value="applications" data-testid="tab-applications">Applications ({pendingApplications})</TabsTrigger>
          <TabsTrigger value="settings" data-testid="tab-settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="space-y-6" data-testid="tab-content-members">
          <Card data-testid="members-section">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Team Members</span>
                <Button size="sm" className="bg-mint hover:bg-mint/90">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Invite New Member
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {team.members.map(member => {
                  const user = teamsData.users.find(u => u.id === member.userId);
                  return user ? <MemberCard key={member.userId} member={member} user={user} /> : null;
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="applications" className="space-y-6" data-testid="tab-content-applications">
          <Card data-testid="applications-section">
            <CardHeader>
              <CardTitle>Pending Applications</CardTitle>
            </CardHeader>
            <CardContent>
              {pendingApplications === 0 ? (
                <div className="text-center py-8" data-testid="no-applications">
                  <Mail className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No pending applications</h3>
                  <p className="text-muted-foreground">All caught up! No new applications to review.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Mock applications */}
                  {Array.from({ length: pendingApplications }).map((_, index) => (
                    <Card key={index} className="p-4" data-testid={`application-${index}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-12 h-12">
                            <AvatarFallback className="bg-gradient-to-br from-sky to-sky/80 text-white font-semibold">
                              JD
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold text-foreground">Jane Developer</h3>
                            <p className="text-sm text-muted-foreground">Wants to join as Frontend Developer</p>
                            <p className="text-xs text-muted-foreground mt-1">Applied 2 days ago</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" data-testid={`button-view-application-${index}`}>
                            View Profile
                          </Button>
                          <Button size="sm" variant="outline" className="border-red-200 text-red-600 hover:bg-red-50" data-testid={`button-reject-${index}`}>
                            Reject
                          </Button>
                          <Button size="sm" className="bg-mint hover:bg-mint/90" data-testid={`button-accept-${index}`}>
                            Accept
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6" data-testid="tab-content-settings">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Team Settings */}
            <Card data-testid="team-settings-section">
              <CardHeader>
                <CardTitle className="text-lg">Team Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-foreground">Recruiting Status</h3>
                    <p className="text-sm text-muted-foreground">Control if your team accepts new members</p>
                  </div>
                  <Badge className={`${team.status === 'recruiting' ? 'bg-mint/10 text-mint' : 'bg-muted'}`}>
                    {team.status === 'recruiting' ? 'Open' : 'Closed'}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-foreground">Team Visibility</h3>
                    <p className="text-sm text-muted-foreground">Control who can see your team</p>
                  </div>
                  <Badge className="bg-sky/10 text-sky">
                    {team.isPublic ? 'Public' : 'Private'}
                  </Badge>
                </div>
                
                <div className="pt-4">
                  <Button variant="outline" className="w-full">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Team Details
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-red-200" data-testid="danger-zone-section">
              <CardHeader>
                <CardTitle className="text-lg text-red-600 flex items-center gap-2">
                  <Trash2 className="w-5 h-5" />
                  Danger Zone
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium text-foreground mb-2">Transfer Leadership</h3>
                  <p className="text-sm text-muted-foreground mb-3">Transfer team leadership to another member</p>
                  <Button variant="outline" className="border-yellow-200 text-yellow-600 hover:bg-yellow-50" data-testid="button-transfer-leadership">
                    Transfer Leadership
                  </Button>
                </div>
                
                <div>
                  <h3 className="font-medium text-foreground mb-2">Delete Team</h3>
                  <p className="text-sm text-muted-foreground mb-3">Permanently delete this team. This action cannot be undone.</p>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50" data-testid="button-delete-team">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Team
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Team</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{team.name}"? This will permanently remove the team and all its data. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction className="bg-red-600 hover:bg-red-700">
                          Delete Team
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}