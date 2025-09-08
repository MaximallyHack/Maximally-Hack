import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
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
  Upload, Play, ExternalLink, Github, Globe, Users,
  Trophy, Star, Clock, Eye, Heart, MessageSquare, Filter, Search
} from 'lucide-react';

// Mock submission data
const mockSubmissions = [
  {
    id: '1',
    title: 'EcoTracker Pro',
    tagline: 'AI-powered carbon footprint tracking with gamification',
    description: 'A comprehensive platform that uses computer vision and machine learning to automatically track personal carbon emissions from daily activities. Features gamification elements, social challenges, and personalized recommendations for reducing environmental impact.',
    team: {
      name: 'Green Innovators',
      members: ['Sarah Chen', 'Mike Rodriguez', 'Emma Wilson']
    },
    track: '🧪 Experiment with AI',
    submittedAt: '2025-08-31T22:30:00Z',
    demoUrl: 'https://ecotracker-demo.vercel.app',
    repoUrl: 'https://github.com/greeninnovators/ecotracker',
    videoUrl: 'https://youtube.com/watch?v=demo123',
    tech: ['React', 'TensorFlow', 'Node.js', 'MongoDB', 'OpenAI API'],
    images: ['/api/placeholder/400/300', '/api/placeholder/400/300'],
    likes: 23,
    views: 145,
    status: 'submitted'
  },
  {
    id: '2',
    title: 'StudyBuddy AI',
    tagline: 'Your personalized AI learning companion',
    description: 'An intelligent tutoring system that adapts to individual learning styles and provides personalized study plans. Uses natural language processing to answer questions and create custom practice problems.',
    team: {
      name: 'EduTech Pioneers',
      members: ['Alex Kim', 'Jordan Taylor']
    },
    track: '🛠️ Build with AI',
    submittedAt: '2025-08-31T21:15:00Z',
    demoUrl: 'https://studybuddy-ai.netlify.app',
    repoUrl: 'https://github.com/edutechpioneers/studybuddy',
    videoUrl: 'https://youtube.com/watch?v=demo456',
    tech: ['Vue.js', 'Python', 'FastAPI', 'PostgreSQL', 'Anthropic Claude'],
    images: ['/api/placeholder/400/300'],
    likes: 18,
    views: 92,
    status: 'submitted'
  },
  {
    id: '3',
    title: 'CreativeCanvas',
    tagline: 'Collaborative AI art creation platform',
    description: 'A platform where artists can collaborate with AI to create stunning digital art. Features real-time collaboration, style transfer, and AI-assisted sketching tools.',
    team: {
      name: 'AI Artists',
      members: ['Casey Martinez', 'Riley Johnson', 'Taylor Swift', 'Morgan Davis']
    },
    track: '🎨 Create with AI',
    submittedAt: '2025-08-31T20:45:00Z',
    demoUrl: 'https://creativecanvas.app',
    repoUrl: 'https://github.com/aiartists/creativecanvas',
    videoUrl: 'https://youtube.com/watch?v=demo789',
    tech: ['React', 'WebGL', 'Python', 'Stable Diffusion', 'Firebase'],
    images: ['/api/placeholder/400/300', '/api/placeholder/400/300', '/api/placeholder/400/300'],
    likes: 31,
    views: 203,
    status: 'submitted'
  }
];

export default function SubmissionsList() {
  const { event } = useEvent();
  const { user } = useAuth();
  const { user: supabaseUser } = useSupabaseAuth();
  const { toast } = useToast();
  const { trigger: triggerConfetti, Confetti } = useConfetti();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTrack, setSelectedTrack] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);

  const { data: submissions = [], isLoading } = useQuery({
    queryKey: ['submissions', event?.id],
    queryFn: () => supabaseApi.getSubmissions(event?.id),
    enabled: !!event?.id,
  });

  const { data: userSubmissions = [] } = useQuery({
    queryKey: ['user-submissions', supabaseUser?.id],
    queryFn: () => supabaseApi.getUserSubmissions(),
    enabled: !!supabaseUser?.id,
  });

  if (!event) return null;

  const filteredSubmissions = submissions.filter(submission => {
    const matchesSearch = submission.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         submission.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (submission.tagline || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTrack = selectedTrack === 'all' || submission.track === selectedTrack;
    return matchesSearch && matchesTrack;
  });

  // Sort submissions
  const sortedSubmissions = [...filteredSubmissions].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.submittedAt || '').getTime() - new Date(a.submittedAt || '').getTime();
      case 'popular':
        // Use average score if available, otherwise 0
        return (b.averageScore || 0) - (a.averageScore || 0);
      case 'views':
        // Views not implemented yet, use creation order
        return 0;
      default:
        return 0;
    }
  });

  const handleLikeSubmission = (submissionTitle: string) => {
    toast({
      title: '❤️ Liked!',
      description: `You liked "${submissionTitle}". Great choice!`
    });
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const submitted = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - submitted.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const canSubmit = (event.status === 'active' || event.status === 'registration_open') && supabaseUser;
  const hasUserSubmitted = userSubmissions.some(s => s.eventId === event.id);

  return (
    <div className="space-y-6">
      <Confetti />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Submissions</h1>
          <p className="text-muted-foreground">Explore amazing projects built during the hackathon</p>
        </div>
        
        {canSubmit && !hasUserSubmitted && (
          <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
            <DialogTrigger asChild>
              <Button>
                <Upload className="w-4 h-4 mr-2" />
                Submit Project
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Submit Your Project</DialogTitle>
                <DialogDescription>
                  Share your amazing creation with the community and judges!
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Project Title</Label>
                    <Input placeholder="e.g., EcoTracker Pro" />
                  </div>
                  <div className="space-y-2">
                    <Label>Track</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select track" />
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
                </div>
                
                <div className="space-y-2">
                  <Label>Tagline</Label>
                  <Input placeholder="One-line description of your project" />
                </div>
                
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea 
                    placeholder="Describe your project, what it does, and how it works..."
                    rows={4}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Demo URL</Label>
                    <Input placeholder="https://your-project-demo.com" />
                  </div>
                  <div className="space-y-2">
                    <Label>Repository URL</Label>
                    <Input placeholder="https://github.com/username/project" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Demo Video URL</Label>
                  <Input placeholder="https://youtube.com/watch?v=..." />
                  <p className="text-xs text-muted-foreground">Max 2 minutes. YouTube, Vimeo, or Loom links accepted.</p>
                </div>
                
                <div className="space-y-2">
                  <Label>Technologies Used</Label>
                  <Input placeholder="React, Node.js, OpenAI API, MongoDB..." />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowSubmitDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  toast({
                    title: '🎉 Project Submitted!',
                    description: 'Your project has been submitted successfully!'
                  });
                  triggerConfetti();
                  setShowSubmitDialog(false);
                }}>
                  Submit Project
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
        
        {hasUserSubmitted && (
          <div className="flex items-center gap-2 text-success">
            <Trophy className="w-4 h-4" />
            <span className="text-sm font-medium">Project Submitted!</span>
          </div>
        )}
      </div>

      {/* Submission Status Banner */}
      {event.status === 'active' && (
        <Card className="bg-gradient-to-r from-coral/10 to-sky/10 border-coral/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-coral" />
                <div>
                  <p className="font-medium text-foreground">Submissions are open!</p>
                  <p className="text-sm text-muted-foreground">
                    Submit your project before the deadline to be eligible for prizes.
                  </p>
                </div>
              </div>
              {canSubmit && !hasUserSubmitted && (
                <Button size="sm" onClick={() => setShowSubmitDialog(true)}>
                  Submit Now
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search projects by title, description, or team..."
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
        
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="popular">Most Liked</SelectItem>
            <SelectItem value="views">Most Viewed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Upload className="w-4 h-4 text-sky" />
              <div>
                <div className="text-lg font-bold">{mockSubmissions.length}</div>
                <div className="text-xs text-muted-foreground">Total Submissions</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-mint" />
              <div>
                <div className="text-lg font-bold">8</div>
                <div className="text-xs text-muted-foreground">Teams Participated</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-coral" />
              <div>
                <div className="text-lg font-bold">72</div>
                <div className="text-xs text-muted-foreground">Total Likes</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-yellow" />
              <div>
                <div className="text-lg font-bold">440</div>
                <div className="text-xs text-muted-foreground">Total Views</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Submissions Grid */}
      <div className="grid gap-6">
        {sortedSubmissions.length === 0 ? (
          <Card className="p-12 text-center">
            <Upload className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No submissions found</h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm || selectedTrack !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'Be the first to submit your project!'}
            </p>
            {canSubmit && !hasUserSubmitted && (
              <Button onClick={() => setShowSubmitDialog(true)}>
                <Upload className="w-4 h-4 mr-2" />
                Submit Project
              </Button>
            )}
          </Card>
        ) : (
          sortedSubmissions.map((submission) => (
            <Card key={submission.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Project Images */}
                <div className="lg:w-80">
                  <div className="grid grid-cols-2 gap-2">
                    {submission.images.slice(0, 4).map((image, index) => (
                      <div key={index} className="aspect-video bg-muted rounded-lg overflow-hidden">
                        <img 
                          src={image} 
                          alt={`${submission.title} screenshot ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Project Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-bold text-foreground">{submission.title}</h3>
                      <Badge variant="secondary">{submission.track}</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatTimeAgo(submission.submittedAt)}
                    </div>
                  </div>
                  
                  <p className="text-lg text-muted-foreground mb-2">{submission.tagline}</p>
                  <p className="text-muted-foreground mb-4 line-clamp-3">{submission.description}</p>
                  
                  {/* Team */}
                  <div className="flex items-center gap-2 mb-4">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-foreground font-medium">{submission.team.name}</span>
                    <span className="text-sm text-muted-foreground">
                      ({submission.team.members.join(', ')})
                    </span>
                  </div>
                  
                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {submission.tech.map((tech, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                  
                  {/* Stats and Actions */}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        {submission.likes}
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {submission.views}
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-4 h-4" />
                        0 comments
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      {submission.demoUrl && (
                        <Button size="sm" variant="outline" asChild>
                          <a href={submission.demoUrl} target="_blank" rel="noopener noreferrer">
                            <Play className="w-4 h-4 mr-1" />
                            Demo
                          </a>
                        </Button>
                      )}
                      {submission.repoUrl && (
                        <Button size="sm" variant="outline" asChild>
                          <a href={submission.repoUrl} target="_blank" rel="noopener noreferrer">
                            <Github className="w-4 h-4 mr-1" />
                            Code
                          </a>
                        </Button>
                      )}
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleLikeSubmission(submission.title)}
                      >
                        <Heart className="w-4 h-4 mr-1" />
                        Like
                      </Button>
                    </div>
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