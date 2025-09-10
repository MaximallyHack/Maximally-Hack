import { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowLeft,
  Settings,
  Shield,
  Users,
  Mail,
  Eye,
  EyeOff,
  Crown,
  AlertTriangle,
  Save,
  X,
  Plus,
  Bell,
  Lock,
  Globe,
  UserCheck,
  MessageSquare
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

interface TeamSettings {
  id: string;
  teamId: string;
  teamDescription?: string;
  teamVisibility: 'public' | 'private' | 'invite-only';
  allowJoinRequests: boolean;
  autoAcceptApplications: boolean;
  maxMembersOverride?: number;
  enableTeamMails: boolean;
  mailNotifications: boolean;
  allowExternalContact: boolean;
  showMemberProfiles: boolean;
  showMemberSkills: boolean;
  showTeamActivity: boolean;
  showJoinCode: boolean;
  memberCanInvite: boolean;
  memberCanViewApplications: boolean;
  memberCanManageSettings: boolean;
  teamTags: string[];
  customFields: Record<string, any>;
}

export default function TeamSettings() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('general');
  const [hasChanges, setHasChanges] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [settings, setSettings] = useState<Partial<TeamSettings>>({});

  // Get team data
  const { data: team, isLoading: teamLoading } = useQuery({
    queryKey: ['team', id],
    queryFn: async () => {
      if (!id) return null;
      return await supabaseApi.getTeam(id);
    },
    enabled: !!id
  });

  // Get team settings
  const { data: teamSettings, isLoading: settingsLoading, error: settingsError } = useQuery({
    queryKey: ['teamSettings', id],
    queryFn: async () => {
      if (!id) return null;
      return await supabaseApi.getTeamSettings(id);
    },
    enabled: !!id,
    retry: false
  });

  // Initialize settings when data is loaded
  useEffect(() => {
    if (teamSettings) {
      setSettings({
        ...teamSettings,
        teamTags: teamSettings.teamTags || []
      });
    }
  }, [teamSettings]);

  // Update team settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: async (settingsData: Partial<TeamSettings>) => {
      if (!id) throw new Error('Team ID required');
      return await supabaseApi.updateTeamSettings(id, settingsData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teamSettings', id] });
      setHasChanges(false);
      toast({
        title: "Settings Updated",
        description: "Team settings have been saved successfully."
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update team settings.",
        variant: "destructive"
      });
    }
  });

  const handleSettingChange = (key: keyof TeamSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSaveSettings = () => {
    updateSettingsMutation.mutate(settings);
  };

  const addTag = () => {
    if (newTag.trim() && !settings.teamTags?.includes(newTag.trim())) {
      const updatedTags = [...(settings.teamTags || []), newTag.trim()];
      handleSettingChange('teamTags', updatedTags);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    const updatedTags = (settings.teamTags || []).filter(tag => tag !== tagToRemove);
    handleSettingChange('teamTags', updatedTags);
  };

  if (teamLoading || settingsLoading) {
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
        <Card className="p-12 text-center">
          <AlertTriangle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Team not found</h3>
          <p className="text-muted-foreground mb-4">The team you're looking for doesn't exist or you don't have access to it.</p>
          <Button onClick={() => navigate('/teams')} className="bg-coral hover:bg-coral/90">
            Back to Teams
          </Button>
        </Card>
      </div>
    );
  }

  // Check permissions - only team leaders or members with permission can access settings
  const isTeamLeader = team.leader_id === user?.id;
  const canManageSettings = isTeamLeader || (teamSettings?.memberCanManageSettings);

  if (!isTeamLeader && teamSettings && !teamSettings.memberCanManageSettings) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="p-12 text-center">
          <Shield className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Access Denied</h3>
          <p className="text-muted-foreground mb-4">You don't have permission to manage team settings.</p>
          <Button onClick={() => navigate(`/teams/${id}`)} className="bg-coral hover:bg-coral/90">
            Back to Team
          </Button>
        </Card>
      </div>
    );
  }

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
            <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
              <Settings className="w-8 h-8 inline mr-3 text-coral" />
              Team Settings
            </h1>
            <p className="text-muted-foreground">Manage {team.name}'s preferences and permissions</p>
          </div>
          {hasChanges && (
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => {
                setSettings({ ...teamSettings });
                setHasChanges(false);
              }}>
                <X className="w-4 h-4 mr-2" />
                Discard Changes
              </Button>
              <Button 
                onClick={handleSaveSettings}
                disabled={updateSettingsMutation.isPending}
                className="bg-coral hover:bg-coral/90"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="general">
                <Globe className="w-4 h-4 mr-2" />
                General
              </TabsTrigger>
              <TabsTrigger value="privacy">
                <Lock className="w-4 h-4 mr-2" />
                Privacy
              </TabsTrigger>
              <TabsTrigger value="communication">
                <Mail className="w-4 h-4 mr-2" />
                Communication
              </TabsTrigger>
              <TabsTrigger value="permissions">
                <UserCheck className="w-4 h-4 mr-2" />
                Permissions
              </TabsTrigger>
            </TabsList>

            {/* General Settings Tab */}
            <TabsContent value="general">
              <Card>
                <CardHeader>
                  <CardTitle>General Team Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="team-description">Team Description</Label>
                    <Textarea
                      id="team-description"
                      placeholder="Add a detailed description for your team..."
                      value={settings.teamDescription || ''}
                      onChange={(e) => handleSettingChange('teamDescription', e.target.value)}
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="team-visibility">Team Visibility</Label>
                    <Select
                      value={settings.teamVisibility}
                      onValueChange={(value) => handleSettingChange('teamVisibility', value as 'public' | 'private' | 'invite-only')}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select visibility" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">
                          <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4" />
                            <div>
                              <div className="font-medium">Public</div>
                              <div className="text-xs text-muted-foreground">Anyone can see and join</div>
                            </div>
                          </div>
                        </SelectItem>
                        <SelectItem value="private">
                          <div className="flex items-center gap-2">
                            <Eye className="w-4 h-4" />
                            <div>
                              <div className="font-medium">Private</div>
                              <div className="text-xs text-muted-foreground">Visible but requires approval to join</div>
                            </div>
                          </div>
                        </SelectItem>
                        <SelectItem value="invite-only">
                          <div className="flex items-center gap-2">
                            <EyeOff className="w-4 h-4" />
                            <div>
                              <div className="font-medium">Invite Only</div>
                              <div className="text-xs text-muted-foreground">Hidden, only invited members can join</div>
                            </div>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="max-members">Maximum Members (Override)</Label>
                    <Input
                      id="max-members"
                      type="number"
                      min="1"
                      max="20"
                      placeholder={`Default: ${team.max_size || 4}`}
                      value={settings.maxMembersOverride || ''}
                      onChange={(e) => handleSettingChange('maxMembersOverride', parseInt(e.target.value) || undefined)}
                    />
                    <p className="text-xs text-muted-foreground">Leave empty to use default team size limit</p>
                  </div>

                  <div className="space-y-4">
                    <Label>Team Tags</Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {(settings.teamTags || []).map((tag) => (
                        <Badge key={tag} variant="secondary" className="bg-coral/10 text-coral">
                          {tag}
                          <button
                            onClick={() => removeTag(tag)}
                            className="ml-1 text-coral/70 hover:text-coral"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add a tag..."
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addTag()}
                      />
                      <Button onClick={addTag} variant="outline">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Privacy Settings Tab */}
            <TabsContent value="privacy">
              <Card>
                <CardHeader>
                  <CardTitle>Privacy Settings</CardTitle>
                  <p className="text-sm text-muted-foreground">Control what information is visible to others</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Show Member Profiles</Label>
                      <p className="text-sm text-muted-foreground">Allow others to see team member profiles</p>
                    </div>
                    <Switch
                      checked={settings.showMemberProfiles}
                      onCheckedChange={(checked) => handleSettingChange('showMemberProfiles', checked)}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Show Member Skills</Label>
                      <p className="text-sm text-muted-foreground">Display individual member skills and expertise</p>
                    </div>
                    <Switch
                      checked={settings.showMemberSkills}
                      onCheckedChange={(checked) => handleSettingChange('showMemberSkills', checked)}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Show Team Activity</Label>
                      <p className="text-sm text-muted-foreground">Show recent team activity and updates</p>
                    </div>
                    <Switch
                      checked={settings.showTeamActivity}
                      onCheckedChange={(checked) => handleSettingChange('showTeamActivity', checked)}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Show Join Code</Label>
                      <p className="text-sm text-muted-foreground">Display the team join code publicly</p>
                    </div>
                    <Switch
                      checked={settings.showJoinCode}
                      onCheckedChange={(checked) => handleSettingChange('showJoinCode', checked)}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Allow Join Requests</Label>
                      <p className="text-sm text-muted-foreground">Let people request to join your team</p>
                    </div>
                    <Switch
                      checked={settings.allowJoinRequests}
                      onCheckedChange={(checked) => handleSettingChange('allowJoinRequests', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Auto-Accept Applications</Label>
                      <p className="text-sm text-muted-foreground">Automatically accept all join requests</p>
                    </div>
                    <Switch
                      checked={settings.autoAcceptApplications}
                      disabled={!settings.allowJoinRequests}
                      onCheckedChange={(checked) => handleSettingChange('autoAcceptApplications', checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Communication Settings Tab */}
            <TabsContent value="communication">
              <Card>
                <CardHeader>
                  <CardTitle>Communication Settings</CardTitle>
                  <p className="text-sm text-muted-foreground">Manage team communication preferences</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Enable Team Mails</Label>
                      <p className="text-sm text-muted-foreground">Allow team members to send internal emails</p>
                    </div>
                    <Switch
                      checked={settings.enableTeamMails}
                      onCheckedChange={(checked) => handleSettingChange('enableTeamMails', checked)}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Mail Notifications</Label>
                      <p className="text-sm text-muted-foreground">Send notifications for new team emails</p>
                    </div>
                    <Switch
                      checked={settings.mailNotifications}
                      disabled={!settings.enableTeamMails}
                      onCheckedChange={(checked) => handleSettingChange('mailNotifications', checked)}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Allow External Contact</Label>
                      <p className="text-sm text-muted-foreground">Let non-members contact the team</p>
                    </div>
                    <Switch
                      checked={settings.allowExternalContact}
                      onCheckedChange={(checked) => handleSettingChange('allowExternalContact', checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Permissions Tab */}
            <TabsContent value="permissions">
              <Card>
                <CardHeader>
                  <CardTitle>Member Permissions</CardTitle>
                  <p className="text-sm text-muted-foreground">Control what team members can do</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {!isTeamLeader && (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-yellow-600" />
                        <p className="text-sm text-yellow-800">You can only view these settings. Only team leaders can modify member permissions.</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Members Can Invite</Label>
                      <p className="text-sm text-muted-foreground">Allow members to send team invitations</p>
                    </div>
                    <Switch
                      checked={settings.memberCanInvite}
                      disabled={!isTeamLeader}
                      onCheckedChange={(checked) => handleSettingChange('memberCanInvite', checked)}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Members Can View Applications</Label>
                      <p className="text-sm text-muted-foreground">Let members see pending join requests</p>
                    </div>
                    <Switch
                      checked={settings.memberCanViewApplications}
                      disabled={!isTeamLeader}
                      onCheckedChange={(checked) => handleSettingChange('memberCanViewApplications', checked)}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Members Can Manage Settings</Label>
                      <p className="text-sm text-muted-foreground">Allow members to modify some team settings</p>
                    </div>
                    <Switch
                      checked={settings.memberCanManageSettings}
                      disabled={!isTeamLeader}
                      onCheckedChange={(checked) => handleSettingChange('memberCanManageSettings', checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Team Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="w-5 h-5" />
                {team.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Members</span>
                <span className="text-sm font-medium">{team.members?.length || 0}/{settings.maxMembersOverride || team.max_size}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge variant={team.status === 'recruiting' ? 'default' : 'secondary'} className="bg-mint/10 text-mint">
                  {team.status === 'recruiting' ? 'Recruiting' : team.status === 'full' ? 'Full' : 'Closed'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Your Role</span>
                <div className="flex items-center gap-1">
                  {isTeamLeader && <Crown className="w-3 h-3 text-yellow" />}
                  <span className="text-sm font-medium">{isTeamLeader ? 'Leader' : 'Member'}</span>
                </div>
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
                  View Team
                </Button>
              </Link>
              <Link to={`/teams/${id}/mails`} className="block">
                <Button variant="outline" className="w-full border-sky text-sky hover:bg-sky/10">
                  <Mail className="w-4 h-4 mr-2" />
                  Team Mails
                </Button>
              </Link>
              {isTeamLeader && (
                <Link to={`/teams/${id}/manage`} className="block">
                  <Button className="w-full bg-coral hover:bg-coral/90">
                    <Settings className="w-4 h-4 mr-2" />
                    Manage Team
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>

          {/* Save Changes Reminder */}
          {hasChanges && (
            <Card className="border-coral/20 bg-coral/5">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-4 h-4 text-coral" />
                  <span className="text-sm font-medium text-coral">Unsaved Changes</span>
                </div>
                <p className="text-xs text-muted-foreground mb-3">You have unsaved changes. Don't forget to save them before leaving.</p>
                <Button 
                  onClick={handleSaveSettings}
                  disabled={updateSettingsMutation.isPending}
                  className="w-full bg-coral hover:bg-coral/90"
                  size="sm"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
