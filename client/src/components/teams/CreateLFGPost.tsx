import { useState } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Plus, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { api, type LFGPost, type Team } from '@/lib/api';

interface CreateLFGPostProps {
  eventId?: string;
  trigger?: React.ReactNode;
}

interface LFGPostForm {
  title: string;
  description: string;
  type: 'individual' | 'team';
  teamId: string;
  skills: string[];
  preferredRoles: string[];
  lookingFor: string[];
  availability: string;
  experienceLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

const commonSkills = [
  'React', 'TypeScript', 'Python', 'Node.js', 'UI/UX Design', 'Machine Learning',
  'Mobile Development', 'Backend Development', 'DevOps', 'Data Science',
  'Product Management', 'Marketing', 'Business Strategy', 'Figma', 'AWS'
];

const commonRoles = [
  'Frontend Developer', 'Backend Developer', 'Full-stack Developer', 'UI/UX Designer',
  'Product Manager', 'Data Scientist', 'ML Engineer', 'DevOps Engineer',
  'Marketing Specialist', 'Business Analyst', 'QA Engineer'
];

const availabilityOptions = [
  'Full-time', 'Part-time', 'Weekends only', 'Evenings only', 'Flexible'
];

export default function CreateLFGPost({ eventId, trigger }: CreateLFGPostProps) {
  const [open, setOpen] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newLookingFor, setNewLookingFor] = useState('');
  
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Get user's teams for team posts
  const { data: userTeams = [] } = useQuery({
    queryKey: ['user-teams', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const allTeams = await api.getTeams();
      return allTeams.filter(team => team.leaderId === user.id);
    },
    enabled: !!user?.id,
  });

  const [formData, setFormData] = useState<LFGPostForm>({
    title: '',
    description: '',
    type: 'individual',
    teamId: '',
    skills: [],
    preferredRoles: [],
    lookingFor: [],
    availability: '',
    experienceLevel: 'intermediate'
  });

  const createMutation = useMutation({
    mutationFn: (data: Partial<LFGPost>) => api.createLFGPost(data),
    onSuccess: () => {
      toast({
        title: 'Success!',
        description: 'Your LFG post has been created successfully.',
      });
      queryClient.invalidateQueries({ queryKey: ['lfg-posts'] });
      setOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create LFG post',
        variant: 'destructive',
      });
    },
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      type: 'individual',
      teamId: '',
      skills: [],
      preferredRoles: [],
      lookingFor: [],
      availability: '',
      experienceLevel: 'intermediate'
    });
    setNewSkill('');
    setNewRole('');
    setNewLookingFor('');
  };

  const addSkill = (skill: string) => {
    if (skill && !formData.skills.includes(skill)) {
      setFormData(prev => ({ ...prev, skills: [...prev.skills, skill] }));
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const addRole = (role: string) => {
    if (role && !formData.preferredRoles.includes(role)) {
      setFormData(prev => ({ ...prev, preferredRoles: [...prev.preferredRoles, role] }));
      setNewRole('');
    }
  };

  const removeRole = (roleToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      preferredRoles: prev.preferredRoles.filter(role => role !== roleToRemove)
    }));
  };

  const addLookingFor = (role: string) => {
    if (role && !formData.lookingFor.includes(role)) {
      setFormData(prev => ({ ...prev, lookingFor: [...prev.lookingFor, role] }));
      setNewLookingFor('');
    }
  };

  const removeLookingFor = (roleToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      lookingFor: prev.lookingFor.filter(role => role !== roleToRemove)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: 'Error',
        description: 'Please log in to create a post',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.title.trim() || !formData.description.trim()) {
      toast({
        title: 'Error',
        description: 'Title and description are required',
        variant: 'destructive',
      });
      return;
    }

    if (formData.type === 'team' && !formData.teamId) {
      toast({
        title: 'Error',
        description: 'Please select a team for team posts',
        variant: 'destructive',
      });
      return;
    }

    const postData: Partial<LFGPost> = {
      title: formData.title,
      description: formData.description,
      type: formData.type,
      skills: formData.skills,
      availability: formData.availability,
      experienceLevel: formData.experienceLevel,
      eventId,
    };

    if (formData.type === 'individual') {
      postData.preferredRoles = formData.preferredRoles;
    } else {
      postData.teamId = formData.teamId;
      postData.lookingFor = formData.lookingFor;
    }

    createMutation.mutate(postData);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-coral hover:bg-coral/90">
            <Plus className="w-4 h-4 mr-2" />
            Create Post
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create LFG Post</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Post Type */}
          <div className="space-y-3">
            <Label>Post Type</Label>
            <RadioGroup 
              value={formData.type} 
              onValueChange={(value: 'individual' | 'team') => 
                setFormData(prev => ({ ...prev, type: value, teamId: '' }))
              }
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="individual" id="individual" />
                <Label htmlFor="individual">Individual - I'm looking for a team</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="team" id="team" />
                <Label htmlFor="team">Team - We're looking for members</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Team Selection for Team Posts */}
          {formData.type === 'team' && (
            <div className="space-y-2">
              <Label htmlFor="team-select">Select Team</Label>
              <Select value={formData.teamId} onValueChange={(value) => 
                setFormData(prev => ({ ...prev, teamId: value }))
              }>
                <SelectTrigger id="team-select">
                  <SelectValue placeholder="Choose a team" />
                </SelectTrigger>
                <SelectContent>
                  {userTeams.map(team => (
                    <SelectItem key={team.id} value={team.id}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {userTeams.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  You don't have any teams yet. Create a team first to post as a team.
                </p>
              )}
            </div>
          )}

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder={formData.type === 'individual' ? 
                'Looking for a team to build...' : 
                'Seeking developers for our project...'
              }
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              placeholder="Describe what you're looking for, your project idea, or what you can offer..."
            />
          </div>

          {/* Skills */}
          <div className="space-y-2">
            <Label>Skills {formData.type === 'individual' ? '(Your Skills)' : '(Required Skills)'}</Label>
            <div className="flex gap-2">
              <Input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add a skill"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addSkill(newSkill);
                  }
                }}
              />
              <Button type="button" onClick={() => addSkill(newSkill)}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2 mb-2">
              {commonSkills.map(skill => (
                <Badge
                  key={skill}
                  variant="outline"
                  className="cursor-pointer hover:bg-coral/10"
                  onClick={() => addSkill(skill)}
                >
                  {skill}
                </Badge>
              ))}
            </div>
            <div className="flex flex-wrap gap-1">
              {formData.skills.map(skill => (
                <Badge key={skill} className="bg-coral/10 text-coral">
                  {skill}
                  <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => removeSkill(skill)} />
                </Badge>
              ))}
            </div>
          </div>

          {/* Individual: Preferred Roles */}
          {formData.type === 'individual' && (
            <div className="space-y-2">
              <Label>Preferred Roles</Label>
              <div className="flex gap-2">
                <Input
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  placeholder="Add a role"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addRole(newRole);
                    }
                  }}
                />
                <Button type="button" onClick={() => addRole(newRole)}>Add</Button>
              </div>
              <div className="flex flex-wrap gap-2 mb-2">
                {commonRoles.map(role => (
                  <Badge
                    key={role}
                    variant="outline"
                    className="cursor-pointer hover:bg-mint/10"
                    onClick={() => addRole(role)}
                  >
                    {role}
                  </Badge>
                ))}
              </div>
              <div className="flex flex-wrap gap-1">
                {formData.preferredRoles.map(role => (
                  <Badge key={role} className="bg-mint/10 text-mint">
                    {role}
                    <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => removeRole(role)} />
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Team: Looking For */}
          {formData.type === 'team' && (
            <div className="space-y-2">
              <Label>Looking For</Label>
              <div className="flex gap-2">
                <Input
                  value={newLookingFor}
                  onChange={(e) => setNewLookingFor(e.target.value)}
                  placeholder="Add a role"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addLookingFor(newLookingFor);
                    }
                  }}
                />
                <Button type="button" onClick={() => addLookingFor(newLookingFor)}>Add</Button>
              </div>
              <div className="flex flex-wrap gap-2 mb-2">
                {commonRoles.map(role => (
                  <Badge
                    key={role}
                    variant="outline"
                    className="cursor-pointer hover:bg-sky/10"
                    onClick={() => addLookingFor(role)}
                  >
                    {role}
                  </Badge>
                ))}
              </div>
              <div className="flex flex-wrap gap-1">
                {formData.lookingFor.map(role => (
                  <Badge key={role} className="bg-sky/10 text-sky">
                    {role}
                    <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => removeLookingFor(role)} />
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Availability */}
          <div className="space-y-2">
            <Label htmlFor="availability">Availability</Label>
            <Select value={formData.availability} onValueChange={(value) => 
              setFormData(prev => ({ ...prev, availability: value }))
            }>
              <SelectTrigger id="availability">
                <SelectValue placeholder="Select availability" />
              </SelectTrigger>
              <SelectContent>
                {availabilityOptions.map(option => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Experience Level */}
          <div className="space-y-2">
            <Label htmlFor="experience">Experience Level</Label>
            <Select value={formData.experienceLevel} onValueChange={(value: any) => 
              setFormData(prev => ({ ...prev, experienceLevel: value }))
            }>
              <SelectTrigger id="experience">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
                <SelectItem value="expert">Expert</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-coral hover:bg-coral/90"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? 'Creating...' : 'Create Post'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
