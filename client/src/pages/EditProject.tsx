import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Save, ArrowLeft, Plus, X, Github, Globe, 
  Code, Tag, Edit3, CheckCircle, Trash2
} from "lucide-react";

interface ProjectData {
  title: string;
  tagline: string;
  description: string;
  githubUrl: string;
  demoUrl: string;
  eventId: string;
  tags: string[];
  techStack: string[];
}

const commonTags = [
  'AI', 'Machine Learning', 'Web Development', 'Mobile', 'Backend', 'Frontend', 
  'Design', 'UI/UX', 'Data Science', 'IoT', 'Blockchain', 'API', 'Database',
  'Healthcare', 'Education', 'Climate', 'Fintech', 'Gaming', 'Social Impact'
];

const techOptions = [
  'React', 'Vue', 'Angular', 'Node.js', 'Python', 'JavaScript', 'TypeScript', 
  'Go', 'Rust', 'Java', 'Swift', 'Kotlin', 'Flutter', 'React Native',
  'MongoDB', 'PostgreSQL', 'MySQL', 'Firebase', 'Supabase', 'Docker',
  'AWS', 'Vercel', 'Netlify', 'Figma', 'Unity', 'TensorFlow', 'PyTorch'
];

export default function EditProject() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const [data, setData] = useState<ProjectData>({
    title: '',
    tagline: '',
    description: '',
    githubUrl: '',
    demoUrl: '',
    eventId: '',
    tags: [],
    techStack: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const { data: events } = useQuery({
    queryKey: ['events'],
    queryFn: api.getEvents,
  });

  const { data: submissions } = useQuery({
    queryKey: ['submissions'],
    queryFn: () => api.getSubmissions(),
  });

  useEffect(() => {
    const loadProject = async () => {
      if (!submissions || !id) return;
      
      const project = submissions.find(s => s.id === id);
      if (!project) {
        toast({
          title: "Project not found",
          description: "The project you're trying to edit doesn't exist",
          variant: "destructive"
        });
        setLocation('/dashboard');
        return;
      }

      if (project.submittedBy !== user?.id) {
        toast({
          title: "Access denied",
          description: "You don't have permission to edit this project",
          variant: "destructive"
        });
        setLocation('/dashboard');
        return;
      }

      setData({
        title: project.title,
        tagline: project.tagline || '',
        description: project.description,
        githubUrl: project.githubUrl || '',
        demoUrl: project.demoUrl || '',
        eventId: project.eventId || '',
        tags: project.tags || [],
        techStack: project.techStack || []
      });
      setIsLoading(false);
    };

    loadProject();
  }, [submissions, id, user?.id, toast, setLocation]);

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-medium text-gray-900 mb-4">Please log in to edit projects</h1>
          <Button onClick={() => setLocation('/login')}>Go to Login</Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h1 className="text-xl font-medium text-gray-900">Loading project...</h1>
        </div>
      </div>
    );
  }

  const availableEvents = events?.filter(event => 
    event.status === 'active' || event.status === 'upcoming' || event.status === 'registration_open'
  ) || [];

  const handleSave = async () => {
    if (!data.title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a project title",
        variant: "destructive"
      });
      return;
    }

    if (!data.tagline.trim()) {
      toast({
        title: "Tagline required", 
        description: "Please enter a brief tagline for your project",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Project updated!",
        description: "Your changes have been saved successfully",
      });

      setLocation('/dashboard');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update project. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const addTag = (tag: string) => {
    if (!data.tags.includes(tag) && data.tags.length < 5) {
      setData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
  };

  const removeTag = (tagToRemove: string) => {
    setData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const addTech = (tech: string) => {
    if (!data.techStack.includes(tech) && data.techStack.length < 8) {
      setData(prev => ({
        ...prev,
        techStack: [...prev.techStack, tech]
      }));
    }
  };

  const removeTech = (techToRemove: string) => {
    setData(prev => ({
      ...prev,
      techStack: prev.techStack.filter(tech => tech !== techToRemove)
    }));
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setLocation('/dashboard')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
          <h1 className="text-3xl font-medium text-gray-900">Edit Project</h1>
          <p className="text-gray-600 mt-1">Update your project information</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-blue-500" />
              Project Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Project Title</label>
                <Input
                  placeholder="Enter your project title"
                  value={data.title}
                  onChange={(e) => setData(prev => ({ ...prev, title: e.target.value }))}
                  className="text-lg"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Tagline</label>
                <Input
                  placeholder="A brief, catchy description of your project"
                  value={data.tagline}
                  onChange={(e) => setData(prev => ({ ...prev, tagline: e.target.value }))}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Description</label>
                <Textarea
                  placeholder="Describe your project, what it does, how you built it, and what makes it special..."
                  value={data.description}
                  onChange={(e) => setData(prev => ({ ...prev, description: e.target.value }))}
                  rows={5}
                />
              </div>
            </div>

            {/* Event Selection */}
            <div>
              <label className="text-sm font-medium mb-2 block">Hackathon Event (Optional)</label>
              <Select value={data.eventId} onValueChange={(value) => setData(prev => ({ ...prev, eventId: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a hackathon event or leave blank for independent project" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Independent Project</SelectItem>
                  {availableEvents.map(event => (
                    <SelectItem key={event.id} value={event.id}>{event.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                  <Github className="w-4 h-4" />
                  GitHub URL
                </label>
                <Input
                  placeholder="https://github.com/username/repo"
                  value={data.githubUrl}
                  onChange={(e) => setData(prev => ({ ...prev, githubUrl: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Demo URL
                </label>
                <Input
                  placeholder="https://yourproject.com"
                  value={data.demoUrl}
                  onChange={(e) => setData(prev => ({ ...prev, demoUrl: e.target.value }))}
                />
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="text-sm font-medium mb-3 block flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Tags {data.tags.length > 0 && <span className="text-gray-500">({data.tags.length}/5)</span>}
              </label>
              
              {data.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {data.tags.map(tag => (
                    <Badge key={tag} className="bg-blue-100 text-blue-800 border-blue-200">
                      {tag}
                      <X 
                        className="w-3 h-3 ml-1 cursor-pointer" 
                        onClick={() => removeTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
              
              <div className="flex flex-wrap gap-2">
                {commonTags
                  .filter(tag => !data.tags.includes(tag))
                  .slice(0, 8)
                  .map(tag => (
                    <Badge 
                      key={tag} 
                      variant="outline" 
                      className="cursor-pointer hover:bg-blue-50"
                      onClick={() => addTag(tag)}
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
              </div>
            </div>

            {/* Tech Stack */}
            <div>
              <label className="text-sm font-medium mb-3 block flex items-center gap-2">
                <Code className="w-4 h-4" />
                Tech Stack {data.techStack.length > 0 && <span className="text-gray-500">({data.techStack.length}/8)</span>}
              </label>
              
              {data.techStack.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {data.techStack.map(tech => (
                    <Badge key={tech} className="bg-green-100 text-green-800 border-green-200">
                      {tech}
                      <X 
                        className="w-3 h-3 ml-1 cursor-pointer" 
                        onClick={() => removeTech(tech)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
              
              <div className="flex flex-wrap gap-2">
                {techOptions
                  .filter(tech => !data.techStack.includes(tech))
                  .slice(0, 10)
                  .map(tech => (
                    <Badge 
                      key={tech} 
                      variant="outline" 
                      className="cursor-pointer hover:bg-green-50"
                      onClick={() => addTech(tech)}
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      {tech}
                    </Badge>
                  ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-6 border-t">
              <Button 
                className="flex-1" 
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Save className="w-4 h-4 mr-2 animate-spin" />
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setLocation('/dashboard')}
                disabled={isSaving}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}