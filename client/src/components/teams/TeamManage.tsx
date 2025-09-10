import { useState } from 'react';
import { useParams, useLocation, Link } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Users, 
  UserPlus, 
  UserCheck, 
  UserX, 
  Send, 
  Crown, 
  Shield, 
  Trash2,
  Settings,
  Mail,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabaseApi } from '@/lib/supabaseApi';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export default function TeamManage() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isInviting, setIsInviting] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteMessage, setInviteMessage] = useState('');
  const [activeTab, setActiveTab] = useState('applications');

  // Get team data
  const { data: team, isLoading: teamLoading, error: teamError } = useQuery({
    queryKey: ['team', id],
    queryFn: async () => {
      if (!id) return null;
      return await supabaseApi.getTeam(id);
    },
    enabled: !!id
  });

  // Get team applications
  const { data: applications = [], isLoading: applicationsLoading } = useQuery({
    queryKey: ['teamApplications', id],
    queryFn: async () => {
      if (!id) return [];
      return await supabaseApi.getTeamApplications(id);
    },
    enabled: !!id && !!team
  });

  // Get team invitations
  const { data: invitations = [], isLoading: invitationsLoading } = useQuery({
    queryKey: ['teamInvitations', id],
    queryFn: async () => {
      if (!id) return [];
      return await supabaseApi.getTeamInvitations(id);
    },
    enabled: !!id && !!team
  });

  // Application status mutation
  const updateApplicationMutation = useMutation({
    mutationFn: async ({ applicationId, status }: { applicationId: string; status: 'accepted' | 'rejected' }) => {
      await supabaseApi.updateApplicationStatus(applicationId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teamApplications', id] });
      queryClient.invalidateQueries({ queryKey: ['team', id] });
      toast({
        title: "Success",
        description: "Application status updated successfully"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update application",
        variant: "destructive"
      });
    }
  });

  // Remove member mutation
  const removeMemberMutation = useMutation({
    mutationFn: async (userId: string) => {
      if (!id) throw new Error('Team ID required');
      await supabaseApi.removeMemberFromTeam(id, userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team', id] });
      toast({
        title: "Success",
        description: "Member removed from team successfully"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to remove member",
        variant: "destructive"
      });
    }
  });

  // Send invitation mutation
  const sendInvitationMutation = useMutation({
    mutationFn: async () => {
      // First find user by email
      const { data: users } = await supabaseApi.getUsers();
      const targetUser = users.find(u => u.email === inviteEmail || u.username === inviteEmail);
      
      if (!targetUser) {
        throw new Error('User not found with that email/username');
      }
      
      if (!id) throw new Error('Team ID required');
      await supabaseApi.inviteToTeam(id, targetUser.id, inviteMessage);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teamInvitations', id] });
      setInviteEmail('');
      setInviteMessage('');
      setIsInviting(false);
      toast({
        title: "Invitation Sent",
        description: "Team invitation has been sent successfully"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send invitation",
        variant: "destructive"
      });
    }
  });

  if (teamLoading) {
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

  if (teamError || !team) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="p-12 text-center">
          <AlertTriangle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Team not found</h3>
          <p className="text-muted-foreground mb-4">The team you're looking for doesn't exist or you don't have permission to manage it.</p>
          <Button onClick={() => navigate('/teams')} className="bg-coral hover:bg-coral/90">
            Back to Teams
          </Button>
        </Card>
      </div>
    );
  }

  if (team.leader_id !== user?.id) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="p-12 text-center">
          <Shield className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Access Denied</h3>
          <p className="text-muted-foreground mb-4">Only team leaders can access team management.</p>
          <Button onClick={() => navigate(`/teams/${id}`)} className="bg-coral hover:bg-coral/90">
            Back to Team
          </Button>
        </Card>
      </div>
    );
  }

  const pendingApplications = applications.filter(app => app.status === 'pending');
  const pendingInvitations = invitations.filter(inv => inv.status === 'pending');
  const teamMembers = team.members || [];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(`/teams/${id}`)} className="text-coral hover:text-coral/80">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Team
          </Button>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-heading font-bold text-foreground mb-2">Manage {team.name}</h1>
            <p className="text-muted-foreground">Manage team members, applications, and invitations</p>
          </div>
          <div className="flex gap-2">
            <Link to={`/teams/${id}/settings`}>
              <Button variant="outline" className="border-coral text-coral hover:bg-coral/10">
                <Settings className="w-4 h-4 mr-2" />
                Team Settings
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="applications" className="relative">
                Applications
                {pendingApplications.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 bg-coral text-white text-xs">
                    {pendingApplications.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="members">Members ({teamMembers.length})</TabsTrigger>
              <TabsTrigger value="invitations" className="relative">
                Invitations
                {pendingInvitations.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 bg-sky text-white text-xs">
                    {pendingInvitations.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            {/* Applications Tab */}
            <TabsContent value="applications">
              <Card>
                <CardHeader>
                  <CardTitle>Team Applications</CardTitle>
                </CardHeader>
                <CardContent>
                  {applicationsLoading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="animate-pulse flex items-center gap-4 p-4 border border-border rounded-lg">
                          <div className="w-12 h-12 bg-muted rounded-full"></div>
                          <div className="flex-1">
                            <div className="h-4 bg-muted rounded mb-2 w-32"></div>
                            <div className="h-3 bg-muted rounded w-64"></div>
                          </div>
                          <div className="flex gap-2">
                            <div className="w-20 h-8 bg-muted rounded"></div>
                            <div className="w-20 h-8 bg-muted rounded"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : applications.length === 0 ? (
                    <div className="text-center py-8">
                      <UserCheck className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No applications yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {applications.map((app) => (
                        <div key={app.id} className="flex items-start gap-4 p-4 border border-border rounded-lg">
                          <Avatar className="w-12 h-12">
                            <AvatarFallback className="bg-gradient-to-br from-coral to-coral/80 text-white font-semibold">
                              {app.applicant.full_name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2) || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-foreground">{app.applicant.full_name || app.applicant.username}</h3>
                              <Badge variant={app.status === 'pending' ? 'secondary' : app.status === 'accepted' ? 'default' : 'destructive'}>
                                {app.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">@{app.applicant.username}</p>
                            {app.message && (
                              <div className="bg-muted/30 rounded-lg p-3 mb-3">
                                <p className="text-sm">{app.message}</p>
                              </div>
                            )}
                            {app.skills && app.skills.length > 0 && (
                              <div className="flex flex-wrap gap-1 mb-3">
                                {app.skills.map((skill: string) => (
                                  <Badge key={skill} variant="outline" className="text-xs">
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            )}
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                Applied {new Date(app.applied_at).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          {app.status === 'pending' && (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => updateApplicationMutation.mutate({ applicationId: app.id, status: 'accepted' })}
                                disabled={updateApplicationMutation.isPending}
                                className="bg-mint hover:bg-mint/90"
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Accept
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateApplicationMutation.mutate({ applicationId: app.id, status: 'rejected' })}
                                disabled={updateApplicationMutation.isPending}
                                className="text-red-600 border-red-200 hover:bg-red-50"
                              >
                                <XCircle className="w-4 h-4 mr-1" />
                                Reject
                              </Button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Members Tab */}
            <TabsContent value="members">
              <Card>
                <CardHeader>
                  <CardTitle>Team Members ({teamMembers.length}/{team.max_size})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {teamMembers.map((member: any) => {
                      const isLeader = member.id === team.leader_id;
                      const canRemove = !isLeader && member.id !== user?.id;
                      
                      return (
                        <div key={member.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
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
                            {canRemove && (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                                    <UserX className="w-4 h-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Remove Member</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to remove {member.name} from the team? This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => removeMemberMutation.mutate(member.id)}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Remove Member
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Invitations Tab */}
            <TabsContent value="invitations">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Team Invitations</CardTitle>
                    <Dialog open={isInviting} onOpenChange={setIsInviting}>
                      <DialogTrigger asChild>
                        <Button className="bg-sky hover:bg-sky/90">
                          <UserPlus className="w-4 h-4 mr-2" />
                          Invite Member
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Invite Team Member</DialogTitle>
                          <DialogDescription>
                            Send an invitation to join your team
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="invite-email">Email or Username</Label>
                            <Input
                              id="invite-email"
                              type="text"
                              placeholder="Enter email or username"
                              value={inviteEmail}
                              onChange={(e) => setInviteEmail(e.target.value)}
                            />
                          </div>
                          <div>
                            <Label htmlFor="invite-message">Message (optional)</Label>
                            <Textarea
                              id="invite-message"
                              placeholder="Add a personal message..."
                              value={inviteMessage}
                              onChange={(e) => setInviteMessage(e.target.value)}
                              rows={3}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsInviting(false)}>
                            Cancel
                          </Button>
                          <Button 
                            onClick={() => sendInvitationMutation.mutate()}
                            disabled={!inviteEmail.trim() || sendInvitationMutation.isPending}
                            className="bg-sky hover:bg-sky/90"
                          >
                            <Send className="w-4 h-4 mr-2" />
                            Send Invitation
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  {invitationsLoading ? (
                    <div className="space-y-4">
                      {[1, 2].map(i => (
                        <div key={i} className="animate-pulse flex items-center gap-4 p-4 border border-border rounded-lg">
                          <div className="w-12 h-12 bg-muted rounded-full"></div>
                          <div className="flex-1">
                            <div className="h-4 bg-muted rounded mb-2 w-32"></div>
                            <div className="h-3 bg-muted rounded w-64"></div>
                          </div>
                          <div className="w-20 h-6 bg-muted rounded"></div>
                        </div>
                      ))}
                    </div>
                  ) : invitations.length === 0 ? (
                    <div className="text-center py-8">
                      <Mail className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No invitations sent yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {invitations.map((invitation) => (
                        <div key={invitation.id} className="flex items-start gap-4 p-4 border border-border rounded-lg">
                          <Avatar className="w-12 h-12">
                            <AvatarFallback className="bg-gradient-to-br from-sky to-sky/80 text-white font-semibold">
                              {invitation.invitee.full_name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2) || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-foreground">{invitation.invitee.full_name || invitation.invitee.username}</h3>
                              <Badge variant={invitation.status === 'pending' ? 'secondary' : invitation.status === 'accepted' ? 'default' : 'destructive'}>
                                {invitation.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">@{invitation.invitee.username}</p>
                            {invitation.message && (
                              <div className="bg-muted/30 rounded-lg p-3 mb-3">
                                <p className="text-sm">{invitation.message}</p>
                              </div>
                            )}
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                Sent {new Date(invitation.sent_at).toLocaleDateString()}
                              </div>
                              {invitation.responded_at && (
                                <div className="flex items-center gap-1">
                                  <CheckCircle className="w-3 h-3" />
                                  Responded {new Date(invitation.responded_at).toLocaleDateString()}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
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
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Team Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Team Size</span>
                <span className="text-sm font-medium">{teamMembers.length}/{team.max_size}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Pending Applications</span>
                <span className="text-sm font-medium text-coral">{pendingApplications.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Pending Invitations</span>
                <span className="text-sm font-medium text-sky">{pendingInvitations.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge variant={team.status === 'recruiting' ? 'default' : 'secondary'} className="bg-mint/10 text-mint">
                  {team.status === 'recruiting' ? 'Recruiting' : team.status === 'full' ? 'Full' : 'Closed'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to={`/teams/${id}`} className="block">
                <Button variant="outline" className="w-full">
                  <Users className="w-4 h-4 mr-2" />
                  View Team Page
                </Button>
              </Link>
              <Link to={`/teams/${id}/settings`} className="block">
                <Button variant="outline" className="w-full border-coral text-coral hover:bg-coral/10">
                  <Settings className="w-4 h-4 mr-2" />
                  Team Settings
                </Button>
              </Link>
              <Link to={`/teams/${id}/mails`} className="block">
                <Button className="w-full bg-sky hover:bg-sky/90">
                  <Mail className="w-4 h-4 mr-2" />
                  Team Mails
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
