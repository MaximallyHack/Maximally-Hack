import { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { Judge as APIJudge } from '@/lib/api';
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

const mockJudges: Judge[] = [
  {
    id: '1',
    name: 'Dr. Sarah Chen',
    title: 'Senior AI Research Scientist',
    company: 'TechCorp',
    bio: 'Leading AI researcher with 10+ years of experience in machine learning and neural networks.',
    avatar: '/api/placeholder/64/64',
    email: 'sarah.chen@techcorp.com',
    linkedin: 'sarah-chen-ai',
    expertise: ['Machine Learning', 'Neural Networks', 'Computer Vision'],
    status: 'confirmed',
    assignedSubmissions: 15,
    completedEvaluations: 12,
    averageScore: 7.8,
    joinedAt: '2025-01-15T10:00:00Z'
  },
  {
    id: '2',
    name: 'Marcus Rodriguez',
    title: 'CTO',
    company: 'StartupX',
    bio: 'Tech entrepreneur and startup mentor with expertise in scaling technology companies.',
    email: 'marcus@startupx.com',
    twitter: 'marcustech',
    expertise: ['Startups', 'Product Development', 'Tech Strategy'],
    status: 'pending',
    assignedSubmissions: 0,
    completedEvaluations: 0,
    averageScore: 0,
    joinedAt: '2025-01-20T14:30:00Z'
  }
];

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
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('judges');
  const [judges, setJudges] = useState<Judge[]>([]);
  const [criteria, setCriteria] = useState<JudgingCriterion[]>(mockCriteria);
  const [isAddJudgeOpen, setIsAddJudgeOpen] = useState(false);
  const [isAddCriterionOpen, setIsAddCriterionOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load judges data
  useEffect(() => {
    const loadJudges = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const eventJudges = await api.getEventJudges(id);
        
        // Transform API judges to component judge format
        const transformedJudges: Judge[] = eventJudges.map(judge => ({
          id: judge.id,
          name: judge.name,
          title: judge.title,
          company: judge.company,
          bio: judge.bio,
          avatar: judge.avatar,
          email: '', // API doesn't have email
          linkedin: judge.social?.linkedin,
          twitter: judge.social?.twitter,
          expertise: judge.expertise,
          status: 'confirmed', // API judges are confirmed by default
          assignedSubmissions: 0, // These would come from scoring data
          completedEvaluations: 0,
          averageScore: judge.rating || 0,
          joinedAt: new Date().toISOString()
        }));
        
        setJudges(transformedJudges);
      } catch (error) {
        console.error('Error loading judges:', error);
        toast({
          title: "Error loading judges",
          description: "Failed to load judge data. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadJudges();
  }, [id, toast]);

  // Redirect if user is not an organizer
  if (!user?.isOrganizer) {
    return <Navigate to="/organizer" replace />;
  }

  if (!id) {
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

  const handleInviteJudge = async (judgeData: any) => {
    if (!id) return;
    
    try {
      setIsSubmitting(true);
      
      // Create judge using API
      const apiJudgeData = {
        name: judgeData.name,
        title: judgeData.title,
        company: judgeData.company,
        bio: judgeData.bio,
        expertise: judgeData.expertise || [],
        avatar: judgeData.avatar || '',
        location: '',
        social: {
          linkedin: judgeData.linkedin,
          twitter: judgeData.twitter,
          website: judgeData.website
        },
        badges: [],
        eventsJudged: 0,
        rating: 0,
        quote: judgeData.bio || '',
        availability: 'Available' as const,
        timezone: 'UTC'
      };
      
      const createdJudge = await api.createJudge(id, apiJudgeData);
      
      // Transform and add to local state
      const newJudge: Judge = {
        id: createdJudge.id,
        name: createdJudge.name,
        title: createdJudge.title,
        company: createdJudge.company,
        bio: createdJudge.bio,
        avatar: createdJudge.avatar,
        email: judgeData.email || '', // Use form data for email
        linkedin: createdJudge.social?.linkedin,
        twitter: createdJudge.social?.twitter,
        expertise: createdJudge.expertise,
        status: 'confirmed',
        assignedSubmissions: 0,
        completedEvaluations: 0,
        averageScore: createdJudge.rating || 0,
        joinedAt: new Date().toISOString()
      };
      
      setJudges(prev => [...prev, newJudge]);
      setIsAddJudgeOpen(false);
      
      toast({
        title: "Judge added",
        description: `${judgeData.name} has been added as a judge`,
      });
    } catch (error) {
      console.error('Error adding judge:', error);
      toast({
        title: "Failed to add judge",
        description: "There was a problem adding the judge. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveJudge = async (judgeId: string) => {
    try {
      setIsSubmitting(true);
      
      await api.deleteJudge(judgeId);
      setJudges(prev => prev.filter(judge => judge.id !== judgeId));
      
      toast({
        title: "Judge removed",
        description: "Judge has been removed from the event",
      });
    } catch (error) {
      console.error('Error removing judge:', error);
      toast({
        title: "Removal failed",
        description: "Failed to remove judge. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
              {isLoading ? (
                <div className="space-y-6">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="animate-pulse">
                      <CardHeader>
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-16 bg-soft-gray rounded-full"></div>
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-soft-gray rounded w-1/3"></div>
                            <div className="h-3 bg-soft-gray rounded w-1/4"></div>
                            <div className="h-3 bg-soft-gray rounded w-1/2"></div>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              ) : judges.length === 0 ? (
                <Card className="p-8 text-center">
                  <div className="text-gray-500 dark:text-gray-400">
                    <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">No judges yet</h3>
                    <p className="text-sm mb-4">Invite judges to start building your judging panel</p>
                    <Button onClick={() => setIsAddJudgeOpen(true)} data-testid="button-add-first-judge">
                      <Plus className="w-4 h-4 mr-2" />
                      Invite Your First Judge
                    </Button>
                  </div>
                </Card>
              ) : (
                judges.map((judge) => (
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
                ))
              )}
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