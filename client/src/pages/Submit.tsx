import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useConfetti } from "@/components/ui/confetti";
import { CrayonSquiggle } from "@/components/ui/floating-elements";
import { 
  Save,
  Send,
  ExternalLink,
  Github,
  FileText,
  Users,
  Tag,
  Eye,
  AlertCircle,
  CheckCircle,
  Plus,
  X,
  Link as LinkIcon,
  Clock,
  Trophy
} from "lucide-react";
import { supabaseApi } from "@/lib/supabaseApi";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import type { Event, Submission } from "@/lib/supabaseApi";

interface SubmissionData {
  title: string;
  tagline: string;
  description: string;
  demoUrl: string;
  githubUrl: string;
  slidesUrl: string;
  videoUrl: string;
  track: string;
  tags: string[];
  teamId: string;
}

const defaultSubmissionData: SubmissionData = {
  title: '',
  tagline: '',
  description: '',
  demoUrl: '',
  githubUrl: '',
  slidesUrl: '',
  videoUrl: '',
  track: '',
  tags: [],
  teamId: 'solo'
};

const commonTags = [
  'AI', 'Machine Learning', 'Web Development', 'Mobile', 'Backend', 'Frontend', 
  'Design', 'UI/UX', 'Data Science', 'IoT', 'Blockchain', 'API', 'Database',
  'React', 'Node.js', 'Python', 'TypeScript', 'JavaScript', 'CSS'
];

const mockTeams = [
  { id: 'team-1', name: 'AI Innovators' },
  { id: 'team-2', name: 'Climate Warriors' },
  { id: 'team-3', name: 'EduTech Builders' }
];

export default function Submit() {
  const { slug } = useParams();
  const [, setLocation] = useLocation();
  const [data, setData] = useState<SubmissionData>(defaultSubmissionData);
  const [isDraft, setIsDraft] = useState(true);
  const [urlStatuses, setUrlStatuses] = useState<{[key: string]: 'checking' | 'valid' | 'invalid' | 'idle'}>({});
  const [currentSubmission, setCurrentSubmission] = useState<Submission | null>(null);
  const { toast } = useToast();
  const { isActive: confettiActive, trigger: triggerConfetti, Confetti } = useConfetti();
  const { user } = useSupabaseAuth();
  const queryClient = useQueryClient();

  const { data: event, isLoading: eventLoading } = useQuery({
    queryKey: ['event', slug],
    queryFn: () => supabaseApi.getEvent(slug!),
    enabled: !!slug,
  });

  // If no slug (direct /projects/create), use mock event or none
  const currentEvent = event || (slug ? null : {
    id: 'general',
    title: 'General Project',
    tracks: ['General', 'Web Development', 'Mobile', 'AI/ML', 'Design']
  });

  const { data: teams } = useQuery({
    queryKey: ['teams', event?.id],
    queryFn: () => supabaseApi.getTeams(event?.id),
    enabled: !!event?.id,
  });

  const { data: userSubmissions } = useQuery({
    queryKey: ['user-submissions', user?.id, event?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const submissions = await supabaseApi.getUserSubmissions();
      return submissions.filter(sub => sub.eventId === event?.id);
    },
    enabled: !!user?.id && !!event?.id,
  });

  // Check URL validity
  const checkUrl = async (url: string, field: string) => {
    if (!url.trim()) {
      setUrlStatuses(prev => ({ ...prev, [field]: 'idle' }));
      return;
    }

    setUrlStatuses(prev => ({ ...prev, [field]: 'checking' }));
    
    // Simple URL validation
    try {
      new URL(url);
      // Simulate API check
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUrlStatuses(prev => ({ ...prev, [field]: 'valid' }));
    } catch {
      setUrlStatuses(prev => ({ ...prev, [field]: 'invalid' }));
    }
  };

  useEffect(() => {
    if (data.demoUrl) {
      const timer = setTimeout(() => checkUrl(data.demoUrl, 'demo'), 500);
      return () => clearTimeout(timer);
    }
  }, [data.demoUrl]);

  useEffect(() => {
    if (data.githubUrl) {
      const timer = setTimeout(() => checkUrl(data.githubUrl, 'github'), 500);
      return () => clearTimeout(timer);
    }
  }, [data.githubUrl]);

  // Load existing submission data if available
  useEffect(() => {
    if (userSubmissions && userSubmissions.length > 0) {
      const existingSubmission = userSubmissions[0]; // Get the latest submission for this event
      setCurrentSubmission(existingSubmission);
      setData({
        title: existingSubmission.title || '',
        tagline: existingSubmission.tagline || '',
        description: existingSubmission.description || '',
        demoUrl: existingSubmission.demoUrl || '',
        githubUrl: existingSubmission.githubUrl || '',
        slidesUrl: existingSubmission.slidesUrl || '',
        videoUrl: existingSubmission.videoUrl || '',
        track: existingSubmission.track || '',
        tags: existingSubmission.tags || [],
        teamId: existingSubmission.teamId || 'solo'
      });
      setIsDraft(existingSubmission.status === 'draft');
    }
  }, [userSubmissions]);

  const addTag = (tag: string) => {
    if (!data.tags.includes(tag)) {
      setData(prev => ({ ...prev, tags: [...prev.tags, tag] }));
    }
  };

  const removeTag = (tag: string) => {
    setData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
  };

  const createSubmissionMutation = useMutation({
    mutationFn: (submissionData: Partial<Submission>) => supabaseApi.createSubmission(submissionData),
    onSuccess: (submission) => {
      setCurrentSubmission(submission);
      queryClient.invalidateQueries({ queryKey: ['user-submissions'] });
      toast({
        title: "Draft saved! 💾",
        description: "Your submission has been saved as a draft.",
      });
    },
    onError: (error) => {
      console.error('Error saving draft:', error);
      toast({
        title: "Error",
        description: "Failed to save draft. Please try again.",
        variant: "destructive"
      });
    }
  });

  const updateSubmissionMutation = useMutation({
    mutationFn: ({ id, data: updateData }: { id: string, data: Partial<Submission> }) => 
      supabaseApi.updateSubmission(id, updateData),
    onSuccess: (submission) => {
      setCurrentSubmission(submission);
      queryClient.invalidateQueries({ queryKey: ['user-submissions'] });
      toast({
        title: "Draft updated! 💾",
        description: "Your submission has been updated.",
      });
    },
    onError: (error) => {
      console.error('Error updating submission:', error);
      toast({
        title: "Error",
        description: "Failed to update submission. Please try again.",
        variant: "destructive"
      });
    }
  });

  const submitFinalMutation = useMutation({
    mutationFn: (id: string) => supabaseApi.submitSubmission(id),
    onSuccess: () => {
      setIsDraft(false);
      queryClient.invalidateQueries({ queryKey: ['user-submissions'] });
      triggerConfetti();
      toast({
        title: "Submission successful! 🎉",
        description: "Your project has been submitted to the hackathon.",
      });
      setTimeout(() => {
        setLocation(`/e/${slug}`);
      }, 2000);
    },
    onError: (error) => {
      console.error('Error submitting:', error);
      toast({
        title: "Error",
        description: "Failed to submit project. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleSaveDraft = async () => {
    if (!event || !user) return;

    const submissionData = {
      title: data.title,
      tagline: data.tagline,
      description: data.description,
      eventId: event.id,
      track: data.track,
      tags: data.tags,
      techStack: data.tags, // Use tags as tech stack for now
      demoUrl: data.demoUrl,
      githubUrl: data.githubUrl,
      slidesUrl: data.slidesUrl,
      videoUrl: data.videoUrl,
      teamId: data.teamId !== 'solo' ? data.teamId : undefined,
      features: [], // TODO: implement features if needed
      images: [], // TODO: implement image upload if needed
      status: 'draft' as const
    };

    if (currentSubmission) {
      updateSubmissionMutation.mutate({ id: currentSubmission.id, data: submissionData });
    } else {
      createSubmissionMutation.mutate(submissionData);
    }
  };

  const handleSubmitFinal = async () => {
    if (!data.title || !data.description || !data.track || !data.demoUrl || !data.githubUrl) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields before submitting.",
        variant: "destructive",
      });
      return;
    }

    if (!currentSubmission) {
      // Save as draft first if no submission exists
      await handleSaveDraft();
      // The mutation will handle the rest
      return;
    }

    submitFinalMutation.mutate(currentSubmission.id);
  };

  const getUrlIcon = (field: string) => {
    const status = urlStatuses[field] || 'idle';
    switch (status) {
      case 'checking':
        return <div className="w-4 h-4 border-2 border-sky border-t-transparent rounded-full animate-spin" />;
      case 'valid':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'invalid':
        return <AlertCircle className="w-4 h-4 text-error" />;
      default:
        return <LinkIcon className="w-4 h-4 text-text-muted" />;
    }
  };

  if (eventLoading) {
    return (
      <div className="min-h-screen bg-cream py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-soft-gray rounded mb-4 w-1/4"></div>
            <div className="h-4 bg-soft-gray rounded mb-8 w-1/2"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-96 bg-soft-gray rounded-2xl"></div>
              <div className="h-96 bg-soft-gray rounded-2xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <Card className="bg-white rounded-2xl p-8 shadow-soft border border-soft-gray text-center">
          <div className="text-6xl mb-4">😵</div>
          <h1 className="font-heading font-bold text-2xl text-text-dark mb-2">Event Not Found</h1>
          <p className="text-text-muted mb-6">The hackathon you're trying to submit to doesn't exist.</p>
          <Button onClick={() => setLocation('/explore')} className="bg-coral text-white hover:bg-coral/80">
            Browse Events
          </Button>
        </Card>
      </div>
    );
  }

  const submissionDeadline = event.submissionClose ? new Date(event.submissionClose) : null;
  const submissionStart = event.submissionOpen ? new Date(event.submissionOpen) : null;
  const now = new Date();
  const isSubmissionOpen = submissionStart && submissionDeadline ? 
    now >= submissionStart && now <= submissionDeadline : false;
  const timeLeft = submissionDeadline.getTime() - now.getTime();
  const daysLeft = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hoursLeft = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  return (
    <div className="min-h-screen bg-cream py-8" data-testid="submit-page">
      <Confetti />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-heading font-bold text-4xl text-text-dark mb-2">
            Submit to {event.title}
          </h1>
          <p className="text-text-muted mb-4">Share your amazing project with the community</p>
          
          {!isSubmissionOpen ? (
            <div className="bg-error/10 border border-error/20 rounded-xl p-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-error" />
                <span className="text-error font-medium">Submission window is closed</span>
              </div>
            </div>
          ) : (
            <div className="bg-yellow/10 border border-yellow/20 rounded-xl p-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-yellow" />
                <span className="text-yellow font-medium">
                  {daysLeft > 0 ? `${daysLeft} days, ${hoursLeft} hours left` : `${hoursLeft} hours left`} to submit
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Submission Form */}
          <Card className="bg-white rounded-2xl p-8 shadow-soft border border-soft-gray">
            <div className="space-y-6">
              {/* Basic Information */}
              <div>
                <h2 className="font-heading font-bold text-xl text-text-dark mb-4">Project Information</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-dark mb-2">
                      Project Title *
                    </label>
                    <Input
                      value={data.title}
                      onChange={(e) => setData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter your project title"
                      className="border-soft-gray focus:ring-2 focus:ring-coral focus:border-transparent"
                      data-testid="input-title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-dark mb-2">
                      One-line Description *
                    </label>
                    <Input
                      value={data.tagline}
                      onChange={(e) => setData(prev => ({ ...prev, tagline: e.target.value }))}
                      placeholder="A brief, catchy description of your project"
                      className="border-soft-gray focus:ring-2 focus:ring-coral focus:border-transparent"
                      data-testid="input-tagline"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-dark mb-2">
                      Detailed Description *
                    </label>
                    <Textarea
                      value={data.description}
                      onChange={(e) => setData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe your project in detail. What problem does it solve? How does it work? What makes it special?"
                      rows={8}
                      className="border-soft-gray focus:ring-2 focus:ring-coral focus:border-transparent"
                      data-testid="textarea-description"
                    />
                    <p className="text-xs text-text-muted mt-1">
                      {data.description.length}/2000 characters
                    </p>
                  </div>
                </div>
              </div>

              <Separator className="bg-soft-gray" />

              {/* Links */}
              <div>
                <h3 className="font-heading font-semibold text-lg text-text-dark mb-4">Project Links</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-dark mb-2">
                      Demo URL *
                    </label>
                    <div className="relative">
                      <Input
                        value={data.demoUrl}
                        onChange={(e) => setData(prev => ({ ...prev, demoUrl: e.target.value }))}
                        placeholder="https://your-demo.com"
                        className="pr-10 border-soft-gray focus:ring-2 focus:ring-coral focus:border-transparent"
                        data-testid="input-demo-url"
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        {getUrlIcon('demo')}
                      </div>
                    </div>
                    {data.demoUrl && urlStatuses.demo === 'invalid' && (
                      <p className="text-error text-xs mt-1">Please enter a valid URL</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-dark mb-2">
                      GitHub Repository *
                    </label>
                    <div className="relative">
                      <Input
                        value={data.githubUrl}
                        onChange={(e) => setData(prev => ({ ...prev, githubUrl: e.target.value }))}
                        placeholder="https://github.com/username/project"
                        className="pr-10 border-soft-gray focus:ring-2 focus:ring-coral focus:border-transparent"
                        data-testid="input-github-url"
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        {getUrlIcon('github')}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-dark mb-2">
                      Presentation Slides (Optional)
                    </label>
                    <Input
                      value={data.slidesUrl}
                      onChange={(e) => setData(prev => ({ ...prev, slidesUrl: e.target.value }))}
                      placeholder="https://slides.com/your-presentation"
                      className="border-soft-gray focus:ring-2 focus:ring-coral focus:border-transparent"
                      data-testid="input-slides-url"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-dark mb-2">
                      Demo Video (Optional)
                    </label>
                    <Input
                      value={data.videoUrl}
                      onChange={(e) => setData(prev => ({ ...prev, videoUrl: e.target.value }))}
                      placeholder="https://youtube.com/watch?v=..."
                      className="border-soft-gray focus:ring-2 focus:ring-coral focus:border-transparent"
                      data-testid="input-video-url"
                    />
                  </div>
                </div>
              </div>

              <Separator className="bg-soft-gray" />

              {/* Categorization */}
              <div>
                <h3 className="font-heading font-semibold text-lg text-text-dark mb-4">Categorization</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-dark mb-2">
                      Competition Track *
                    </label>
                    <Select value={data.track} onValueChange={(value) => setData(prev => ({ ...prev, track: value }))}>
                      <SelectTrigger className="border-soft-gray" data-testid="select-track">
                        <SelectValue placeholder="Select a track" />
                      </SelectTrigger>
                      <SelectContent>
                        {event.tracks.map(track => (
                          <SelectItem key={track} value={track}>{track}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-dark mb-2">
                      Team
                    </label>
                    <Select value={data.teamId} onValueChange={(value) => setData(prev => ({ ...prev, teamId: value }))}>
                      <SelectTrigger className="border-soft-gray" data-testid="select-team">
                        <SelectValue placeholder="Select your team (optional for solo)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="solo">Solo Submission</SelectItem>
                        {teams?.map(team => (
                          <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-dark mb-4">
                      Technologies & Tags
                    </label>
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-2 mb-4">
                      {commonTags.map(tag => (
                        <Badge
                          key={tag}
                          onClick={() => data.tags.includes(tag) ? removeTag(tag) : addTag(tag)}
                          className={`cursor-pointer transition-colors p-2 rounded-lg border-0 text-center text-xs ${
                            data.tags.includes(tag)
                              ? 'bg-sky text-white'
                              : 'bg-soft-gray text-text-dark hover:bg-soft-gray/80'
                          }`}
                          data-testid={`tag-${tag.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {data.tags.map(tag => (
                        <Badge key={tag} className="bg-sky text-white px-3 py-1 rounded-full border-0 flex items-center gap-2">
                          {tag}
                          <X className="w-3 h-3 cursor-pointer" onClick={() => removeTag(tag)} />
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Live Preview */}
          <div className="space-y-6">
            {/* Preview Card */}
            <Card className="bg-white rounded-2xl p-6 shadow-soft border border-soft-gray">
              <div className="flex items-center gap-2 mb-4">
                <Eye className="w-5 h-5 text-sky" />
                <h3 className="font-heading font-semibold text-lg text-text-dark">Live Preview</h3>
              </div>
              
              <div className="space-y-4">
                {/* Preview Header */}
                <div className="flex items-center justify-between">
                  {data.track && (
                    <Badge className="bg-mint/20 text-mint px-3 py-1 rounded-full text-sm border-0">
                      {data.track}
                    </Badge>
                  )}
                  {data.tags.length > 0 && (
                    <div className="flex gap-1">
                      {data.tags.slice(0, 2).map(tag => (
                        <Badge key={tag} className="bg-sky/20 text-sky px-2 py-1 rounded-full text-xs border-0">
                          {tag}
                        </Badge>
                      ))}
                      {data.tags.length > 2 && (
                        <Badge className="bg-soft-gray text-text-muted px-2 py-1 rounded-full text-xs border-0">
                          +{data.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>

                {/* Preview Content */}
                <div>
                  <h4 className="font-heading font-semibold text-lg text-text-dark mb-2">
                    {data.title || 'Your Project Title'}
                  </h4>
                  <p className="text-text-muted text-sm mb-3">
                    {data.tagline || 'Your one-line description will appear here'}
                  </p>
                  <p className="text-text-muted text-sm">
                    {data.description ? 
                      data.description.substring(0, 150) + (data.description.length > 150 ? '...' : '') :
                      'Your detailed description will appear here...'
                    }
                  </p>
                </div>

                {/* Preview Links */}
                <div className="flex gap-2">
                  {data.demoUrl && (
                    <Button size="sm" variant="outline" className="border-sky text-sky hover:bg-sky/10 rounded-full">
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Demo
                    </Button>
                  )}
                  {data.githubUrl && (
                    <Button size="sm" variant="outline" className="border-coral text-coral hover:bg-coral/10 rounded-full">
                      <Github className="w-3 h-3 mr-1" />
                      Code
                    </Button>
                  )}
                </div>

                {/* Team Info */}
                {data.teamId && (
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-text-muted" />
                    <span className="text-text-muted text-sm">
                      Team: {teams?.find(t => t.id === data.teamId)?.name || 'Selected Team'}
                    </span>
                  </div>
                )}
              </div>
            </Card>

            {/* Submission Tips */}
            <Card className="bg-sky/10 rounded-2xl p-6 border border-sky/20">
              <h3 className="font-semibold text-text-dark mb-3 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-sky" />
                What Judges Look For
              </h3>
              <ul className="space-y-2 text-sm text-text-muted">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-success rounded-full mt-2"></div>
                  <span><strong>Clear problem statement:</strong> What real problem are you solving?</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-success rounded-full mt-2"></div>
                  <span><strong>Working demo:</strong> Show your solution in action</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-success rounded-full mt-2"></div>
                  <span><strong>Technical innovation:</strong> Clever use of technology and APIs</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-success rounded-full mt-2"></div>
                  <span><strong>Impact potential:</strong> How could this scale and help people?</span>
                </li>
              </ul>
            </Card>

            {/* Submission Status */}
            <Card className="bg-white rounded-2xl p-6 shadow-soft border border-soft-gray">
              <h3 className="font-heading font-semibold text-lg text-text-dark mb-4">Submission Status</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-text-muted">Status</span>
                  <Badge className={`px-3 py-1 rounded-full border-0 ${
                    isDraft ? 'bg-yellow/20 text-yellow' : 'bg-success/20 text-success'
                  }`}>
                    {isDraft ? 'Draft' : 'Submitted'}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-text-muted">Required Fields</span>
                  <div className="flex items-center gap-1">
                    {data.title && data.description && data.track && data.demoUrl && data.githubUrl ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-success" />
                        <span className="text-success text-sm">Complete</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4 text-error" />
                        <span className="text-error text-sm">Missing fields</span>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-text-muted">Submission Window</span>
                  {isSubmissionOpen ? (
                    <div className="flex items-center gap-1">
                      <CheckCircle className="w-4 h-4 text-success" />
                      <span className="text-success text-sm">Open</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <AlertCircle className="w-4 h-4 text-error" />
                      <span className="text-error text-sm">Closed</span>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Sticky Footer Actions */}
        <div className="sticky bottom-0 bg-cream/95 backdrop-blur-sm border-t border-soft-gray mt-8 py-4">
          <div className="flex justify-between items-center">
            <div className="text-sm text-text-muted">
              {isDraft ? 'Changes saved automatically' : 'Submission completed'}
            </div>
            
            <div className="flex gap-4">
              <Button 
                onClick={handleSaveDraft}
                variant="outline"
                className="border-mint text-mint hover:bg-mint/10 rounded-full px-6"
                data-testid="button-save-draft"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Draft
              </Button>
              
              <Button 
                onClick={handleSubmitFinal}
                disabled={!isSubmissionOpen || !data.title || !data.description || !data.track || !data.demoUrl || !data.githubUrl}
                className="bg-coral text-white hover:bg-coral/80 rounded-full px-8"
                data-testid="button-submit-final"
              >
                <Send className="w-4 h-4 mr-2" />
                Submit Final Project 🎉
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
