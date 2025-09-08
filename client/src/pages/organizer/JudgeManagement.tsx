import { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Mail, 
  ExternalLink,
  Star,
  Clock,
  CheckCircle,
  XCircle,
  Users,
  Award,
  BarChart3,
  ArrowLeft
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabaseApi } from '@/lib/supabaseApi';

interface Judge {
  id: string;
  name: string;
  title: string;
  company: string;
  bio: string;
  avatar?: string;
  email: string;
  linkedin?: string;
  twitter?: string;
  expertise: string[];
  status: 'pending' | 'confirmed' | 'declined';
  assignedSubmissions: number;
  completedEvaluations: number;
  averageScore: number;
  joinedAt: string;
}

interface JudgingCriterion {
  id: string;
  name: string;
  weight: number;
  description: string;
  maxScore: number;
}


const mockCriteria: JudgingCriterion[] = [
  {
    id: '1',
    name: 'Innovation',
    weight: 30,
    description: 'Originality and creativity of the solution',
    maxScore: 10
  },
  {
    id: '2',
    name: 'Technical Excellence',
    weight: 25,
    description: 'Quality of implementation and technical approach',
    maxScore: 10
  },
  {
    id: '3',
    name: 'Impact',
    weight: 25,
    description: 'Potential real-world impact and scalability',
    maxScore: 10
  },
  {
    id: '4',
    name: 'Presentation',
    weight: 20,
    description: 'Quality of demo and communication',
    maxScore: 10
  }
];

export default function JudgeManagement() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { user: supabaseUser } = useSupabaseAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('judges');
  const [criteria, setCriteria] = useState<JudgingCriterion[]>(mockCriteria);
  const [isAddJudgeOpen, setIsAddJudgeOpen] = useState(false);
  const [isAddCriterionOpen, setIsAddCriterionOpen] = useState(false);

  const { data: allJudges = [], isLoading: judgesLoading } = useQuery({
    queryKey: ['judges'],
    queryFn: () => supabaseApi.getJudges(),
  });

  const { data: eventJudges = [], isLoading: eventJudgesLoading } = useQuery({
    queryKey: ['event-judges', id],
    queryFn: () => supabaseApi.getEventJudges(id!),
    enabled: !!id,
  });

  const assignJudgeMutation = useMutation({
    mutationFn: ({ eventId, judgeId }: { eventId: string, judgeId: string }) => 
      supabaseApi.assignJudgeToEvent(eventId, judgeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event-judges'] });
      toast({
        title: 'Judge Assigned',
        description: 'Judge has been successfully assigned to this event.',
      });
    },
    onError: (error) => {
      console.error('Error assigning judge:', error);
      toast({
        title: 'Assignment Failed',
        description: 'Failed to assign judge to event.',
        variant: 'destructive'
      });
    }
  });

  const removeJudgeMutation = useMutation({
    mutationFn: ({ eventId, judgeId }: { eventId: string, judgeId: string }) => 
      supabaseApi.removeJudgeFromEvent(eventId, judgeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event-judges'] });
      toast({
        title: 'Judge Removed',
        description: 'Judge has been removed from this event.',
      });
    },
    onError: (error) => {
      console.error('Error removing judge:', error);
      toast({
        title: 'Removal Failed',
        description: 'Failed to remove judge from event.',
        variant: 'destructive'
      });
    }
  });

  const isLoading = judgesLoading || eventJudgesLoading;

  // Redirect if user is not an organizer or can't edit this event
  if (!user?.isOrganizer || !user?.canEditEvent(id || '')) {
    return <Navigate to="/organizer" replace />;
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'declined': return <XCircle className="w-4 h-4 text-red-600" />;
      default: return <Clock className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'declined': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    }
  };

  const handleAssignJudge = (judgeId: string) => {
    if (!id) return;
    assignJudgeMutation.mutate({ eventId: id, judgeId });
  };

  const handleRemoveJudge = (judgeId: string) => {
    if (!id) return;
    removeJudgeMutation.mutate({ eventId: id, judgeId });
  };

  const availableJudges = allJudges.filter(
    judge => !eventJudges.some(eventJudge => eventJudge.id === judge.id)
  );

  return (
    <div className="min-h-screen bg-background" data-testid="judge-management">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild data-testid="button-back">
              <a href="/organizer">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </a>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Judge Management</h1>
              <p className="text-muted-foreground">Manage judges and evaluation criteria</p>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {Array.from({length: 4}).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-8 bg-muted rounded w-1/2 mb-2"></div>
                    <div className="h-3 bg-muted rounded w-full"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="h-64 bg-muted rounded animate-pulse"></div>
          </div>
        ) : (
        <>
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Judges</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{judges.length}</div>
              <p className="text-xs text-muted-foreground">
                {judges.filter(j => j.status === 'confirmed').length} confirmed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Evaluations</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {judges.reduce((acc, judge) => acc + judge.completedEvaluations, 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                {judges.reduce((acc, judge) => acc + judge.assignedSubmissions, 0)} assigned
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Score</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {judges.length > 0 
                  ? (judges.reduce((acc, judge) => acc + judge.averageScore, 0) / judges.filter(j => j.averageScore > 0).length || 0).toFixed(1)
                  : '0'
                }
              </div>
              <p className="text-xs text-muted-foreground">Out of 10</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Criteria</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{criteria.length}</div>
              <p className="text-xs text-muted-foreground">Evaluation criteria</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="judges" data-testid="tab-judges">Judges</TabsTrigger>
            <TabsTrigger value="criteria" data-testid="tab-criteria">Criteria</TabsTrigger>
            <TabsTrigger value="assignments" data-testid="tab-assignments">Assignments</TabsTrigger>
          </TabsList>

          {/* Judges Tab */}
          <TabsContent value="judges" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Event Judges</h3>
              <Dialog open={isAddJudgeOpen} onOpenChange={setIsAddJudgeOpen}>
                <DialogTrigger asChild>
                  <Button data-testid="button-add-judge">
                    <Plus className="w-4 h-4 mr-2" />
                    Invite Judge
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Invite Judge</DialogTitle>
                    <DialogDescription>
                      Send an invitation to join your judging panel
                    </DialogDescription>
                  </DialogHeader>
                  <JudgeInviteForm onSubmit={handleInviteJudge} onCancel={() => setIsAddJudgeOpen(false)} />
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-6">
              {judges.map((judge) => (
                <Card key={judge.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <Avatar className="w-16 h-16">
                          <AvatarImage src={judge.avatar} alt={judge.name} />
                          <AvatarFallback>
                            {judge.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <CardTitle className="text-lg">{judge.name}</CardTitle>
                            <Badge className={getStatusBadge(judge.status)}>
                              {judge.status}
                            </Badge>
                          </div>
                          <p className="text-sm font-medium text-coral">{judge.title}</p>
                          <p className="text-sm text-muted-foreground">{judge.company}</p>
                          <p className="text-sm text-muted-foreground mt-2 max-w-2xl">{judge.bio}</p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {judge.expertise.map((skill) => (
                              <Badge key={skill} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {judge.status === 'confirmed' && (
                          <div className="text-right text-sm">
                            <div className="font-medium">{judge.completedEvaluations}/{judge.assignedSubmissions}</div>
                            <div className="text-muted-foreground">Evaluations</div>
                          </div>
                        )}
                        <div className="flex gap-1">
                          {judge.email && (
                            <Button size="sm" variant="outline" asChild data-testid={`button-email-${judge.id}`}>
                              <a href={`mailto:${judge.email}`}>
                                <Mail className="w-4 h-4" />
                              </a>
                            </Button>
                          )}
                          {judge.linkedin && (
                            <Button size="sm" variant="outline" asChild data-testid={`button-linkedin-${judge.id}`}>
                              <a href={`https://linkedin.com/in/${judge.linkedin}`} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            </Button>
                          )}
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleRemoveJudge(judge.id)}
                            data-testid={`button-remove-judge-${judge.id}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Criteria Tab */}
          <TabsContent value="criteria" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Judging Criteria</h3>
              <Dialog open={isAddCriterionOpen} onOpenChange={setIsAddCriterionOpen}>
                <DialogTrigger asChild>
                  <Button data-testid="button-add-criterion">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Criterion
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Judging Criterion</DialogTitle>
                    <DialogDescription>
                      Create a new evaluation criterion for submissions
                    </DialogDescription>
                  </DialogHeader>
                  {/* Criterion form would go here */}
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {criteria.map((criterion) => (
                <Card key={criterion.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold">{criterion.name}</h4>
                          <Badge variant="outline">{criterion.weight}%</Badge>
                          <Badge variant="secondary">Max: {criterion.maxScore}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{criterion.description}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" data-testid={`button-edit-criterion-${criterion.id}`}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" data-testid={`button-remove-criterion-${criterion.id}`}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Weight</span>
                  <Badge variant={criteria.reduce((acc, c) => acc + c.weight, 0) === 100 ? "default" : "destructive"}>
                    {criteria.reduce((acc, c) => acc + c.weight, 0)}%
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Assignments Tab */}
          <TabsContent value="assignments" className="space-y-6">
            <div className="text-center py-12">
              <Award className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Judge Assignments</h3>
              <p className="text-muted-foreground mb-4">
                Assign judges to submissions and track evaluation progress.
              </p>
              <Button data-testid="button-manage-assignments">Coming Soon</Button>
            </div>
          </TabsContent>
        </Tabs>
        </>
        )}
      </div>
    </div>
  );
}

// Judge Invite Form Component
function JudgeInviteForm({ onSubmit, onCancel }: { onSubmit: (data: any) => void; onCancel: () => void }) {
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    company: '',
    email: '',
    bio: '',
    linkedin: '',
    expertise: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      expertise: formData.expertise.split(',').map(s => s.trim()).filter(Boolean)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            required
            data-testid="input-judge-name"
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            required
            data-testid="input-judge-email"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            required
            data-testid="input-judge-title"
          />
        </div>
        <div>
          <Label htmlFor="company">Company</Label>
          <Input
            id="company"
            value={formData.company}
            onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
            required
            data-testid="input-judge-company"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          value={formData.bio}
          onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
          placeholder="Brief professional background..."
          data-testid="textarea-judge-bio"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="linkedin">LinkedIn (optional)</Label>
          <Input
            id="linkedin"
            value={formData.linkedin}
            onChange={(e) => setFormData(prev => ({ ...prev, linkedin: e.target.value }))}
            placeholder="linkedin-username"
            data-testid="input-judge-linkedin"
          />
        </div>
        <div>
          <Label htmlFor="expertise">Expertise (comma-separated)</Label>
          <Input
            id="expertise"
            value={formData.expertise}
            onChange={(e) => setFormData(prev => ({ ...prev, expertise: e.target.value }))}
            placeholder="AI, Machine Learning, Startups"
            data-testid="input-judge-expertise"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel} data-testid="button-cancel-invite">
          Cancel
        </Button>
        <Button type="submit" data-testid="button-send-invite">
          Send Invitation
        </Button>
      </div>
    </form>
  );
}