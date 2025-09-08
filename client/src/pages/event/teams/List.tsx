import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEvent } from '@/contexts/EventContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabaseApi } from '@/lib/supabaseApi';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useConfetti } from '@/components/ui/confetti';
import { Link } from 'wouter';
import {
  Users, Plus, Search, Filter, MessageSquare, ExternalLink,
  Clock, Target, Zap, UserPlus, Star, MapPin, CheckCircle, X
} from 'lucide-react';

// Mock team data - in a real app this would come from an API
const mockTeams = [
  {
    id: '1',
    name: 'AI Innovators',
    description: 'Building the next-gen AI assistant for productivity and workflow automation',
    members: [
      { id: '1', name: 'Sarah Chen', avatar: '', role: 'Team Lead', skills: ['React', 'Node.js'] },
      { id: '2', name: 'Mike Rodriguez', avatar: '', role: 'Designer', skills: ['Figma', 'UI/UX'] }
    ],
    lookingFor: ['Python Developer', 'ML Engineer'],
    skills: ['React', 'Node.js', 'Figma', 'UI/UX'],
    maxSize: 4,
    track: '🛠️ Build with AI',
    status: 'open',
    lastActive: '2 hours ago'
  },
  {
    id: '2',
    name: 'EcoTrack',
    description: 'Carbon footprint tracking app with gamification elements',
    members: [
      { id: '3', name: 'Emma Wilson', avatar: '', role: 'Full-stack', skills: ['Vue', 'Python'] }
    ],
    lookingFor: ['Mobile Developer', 'Data Scientist', 'Designer'],
    skills: ['Vue', 'Python', 'Data Science'],
    maxSize: 4,
    track: '🧪 Experiment with AI',
    status: 'open',
    lastActive: '1 hour ago'
  },
  {
    id: '3',
    name: 'CreativeAI Studio',
    description: 'AI-powered content creation platform for artists and creators',
    members: [
      { id: '4', name: 'Alex Kim', avatar: '', role: 'Creative Lead', skills: ['Adobe Creative Suite'] },
      { id: '5', name: 'Jordan Taylor', avatar: '', role: 'Developer', skills: ['React', 'OpenAI API'] },
      { id: '6', name: 'Casey Martinez', avatar: '', role: 'Product Manager', skills: ['Strategy'] }
    ],
    lookingFor: ['Backend Developer'],
    skills: ['React', 'OpenAI API', 'Creative Suite'],
    maxSize: 4,
    track: '🎨 Create with AI',
    status: 'almost-full',
    lastActive: '30 minutes ago'
  }
];

export default function List() {
  const { event } = useEvent();
  const { user } = useAuth();
  const { user: supabaseUser } = useSupabaseAuth();
  const { toast } = useToast();
  const { trigger: triggerConfetti, Confetti } = useConfetti();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTrack, setSelectedTrack] = useState('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newTeam, setNewTeam] = useState({
    name: '',
    description: '',
    track: '',
    lookingFor: ''
  });

  const { data: teams = [], isLoading } = useQuery({
    queryKey: ['teams', event?.id],
    queryFn: () => supabaseApi.getTeams(event?.id),
    enabled: !!event?.id,
  });

  const createTeamMutation = useMutation({
    mutationFn: (teamData: any) => supabaseApi.createTeam(teamData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      toast({
        title: '🚀 Team Created!',
        description: `"${newTeam.name}" is ready to hack! Start recruiting teammates.`
      });
      triggerConfetti();
      setShowCreateDialog(false);
      setNewTeam({ name: '', description: '', track: '', lookingFor: '' });
    },
    onError: (error) => {
      console.error('Error creating team:', error);
      toast({
        title: 'Error',
        description: 'Failed to create team. Please try again.',
        variant: 'destructive'
      });
    }
  });

  if (!event) return null;

  const filteredTeams = teams.filter(team => {
    const matchesSearch = team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (team.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTrack = selectedTrack === 'all' || team.track === selectedTrack;
    return matchesSearch && matchesTrack;
  });

  const handleCreateTeam = () => {
    if (!newTeam.name.trim()) {
      toast({
        title: 'Team name required',
        description: 'Please enter a name for your team.',
        variant: 'destructive'
      });
      return;
    }

    if (!event) return;

    const teamData = {
      eventId: event.id,
      name: newTeam.name,
      description: newTeam.description,
      track: newTeam.track,
      lookingFor: newTeam.lookingFor ? newTeam.lookingFor.split(',').map(s => s.trim()) : [],
      maxMembers: 4,
      isRecruiting: true
    };

    createTeamMutation.mutate(teamData);
  };

  const handleJoinRequest = async (teamId: string, teamName: string) => {
    try {
      await supabaseApi.joinTeam(teamId);
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      toast({
        title: '🎉 Joined Team!',
        description: `You've successfully joined "${teamName}".`
      });
    } catch (error) {
      console.error('Error joining team:', error);
      toast({
        title: 'Error',
        description: 'Failed to join team. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-success/20 text-success';
      case 'almost-full': return 'bg-yellow/20 text-yellow';
      case 'full': return 'bg-muted text-muted-foreground';
      default: return 'bg-sky/20 text-sky';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'open': return 'Open';
      case 'almost-full': return 'Almost Full';
      case 'full': return 'Full';
      default: return 'Open';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <UserPlus className="w-4 h-4" />;
      case 'almost-full': return <Users className="w-4 h-4" />;
      case 'full': return <CheckCircle className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Confetti />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Teams</h1>
          <p className="text-muted-foreground">Find your perfect hackathon teammates</p>
        </div>
        
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Team
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Your Team</DialogTitle>
              <DialogDescription>
                Start your hackathon journey by creating a team. You can recruit up to 3 more members.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="team-name">Team Name</Label>
                <Input
                  id="team-name"
                  placeholder="e.g., AI Innovators"
                  value={newTeam.name}
                  onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="team-description">Description</Label>
                <Textarea
                  id="team-description"
                  placeholder="Briefly describe your project idea and goals..."
                  value={newTeam.description}
                  onChange={(e) => setNewTeam({ ...newTeam, description: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="team-track">Track</Label>
                <Select value={newTeam.track} onValueChange={(value) => setNewTeam({ ...newTeam, track: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a track" />
                  </SelectTrigger>
                  <SelectContent>
                    {event.tracks.map((track: string) => (
                      <SelectItem key={track} value={track}>
                        {track}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="team-looking-for">Looking for (roles/skills)</Label>
                <Input
                  id="team-looking-for"
                  placeholder="e.g., Python Developer, UI/UX Designer"
                  value={newTeam.lookingFor}
                  onChange={(e) => setNewTeam({ ...newTeam, lookingFor: e.target.value })}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateTeam}>
                Create Team
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search teams by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={selectedTrack} onValueChange={setSelectedTrack}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="All tracks" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All tracks</SelectItem>
            {event.tracks.map((track: string) => (
              <SelectItem key={track} value={track}>
                {track}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-sky" />
              <div>
                <div className="text-lg font-bold">12</div>
                <div className="text-xs text-muted-foreground">Active Teams</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-mint" />
              <div>
                <div className="text-lg font-bold">7</div>
                <div className="text-xs text-muted-foreground">Looking for Members</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-coral" />
              <div>
                <div className="text-lg font-bold">23</div>
                <div className="text-xs text-muted-foreground">Available Spots</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow" />
              <div>
                <div className="text-lg font-bold">5</div>
                <div className="text-xs text-muted-foreground">Recent Activity</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Teams Grid */}
      <div className="grid gap-6">
        {filteredTeams.length === 0 ? (
          <Card className="p-12 text-center">
            <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No teams found</h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm || selectedTrack !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'Be the first to create a team for this hackathon!'}
            </p>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Team
            </Button>
          </Card>
        ) : (
          filteredTeams.map((team) => (
            <Card key={team.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Team Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-bold text-foreground">{team.name}</h3>
                      <Badge className={getStatusColor(team.status)}>
                        {getStatusIcon(team.status)}
                        <span className="ml-1">{getStatusText(team.status)}</span>
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {team.lastActive}
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-4">{team.description}</p>
                  
                  <div className="flex items-center gap-4 mb-4">
                    <Badge variant="secondary">{team.track}</Badge>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Users className="w-4 h-4" />
                      {team.members.length}/{team.maxSize} members
                    </div>
                  </div>
                  
                  {/* Skills */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {team.skills.map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  
                  {/* Looking For */}
                  {team.lookingFor.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-foreground mb-2">Looking for:</p>
                      <div className="flex flex-wrap gap-2">
                        {team.lookingFor.map((role, index) => (
                          <Badge key={index} variant="secondary" className="text-xs bg-coral/20 text-coral">
                            {role}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Team Members & Actions */}
                <div className="lg:w-64 space-y-4">
                  {/* Members */}
                  <div>
                    <p className="text-sm font-medium text-foreground mb-2">Team Members</p>
                    <div className="space-y-2">
                      {team.members.map((member) => (
                        <div key={member.id} className="flex items-center gap-2">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="text-xs">
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{member.name}</p>
                            <p className="text-xs text-muted-foreground">{member.role}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="space-y-2">
                    {team.status !== 'full' && (
                      <Button 
                        className="w-full"
                        onClick={() => handleJoinRequest(team.name)}
                      >
                        <UserPlus className="w-4 h-4 mr-2" />
                        Request to Join
                      </Button>
                    )}
                    <Button variant="outline" className="w-full">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Message Team
                    </Button>
                    <Link href={`/teams/${team.id}`}>
                      <Button variant="ghost" size="sm" className="w-full">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}