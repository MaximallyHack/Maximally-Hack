import { useState } from "react";
import { useLocation } from "wouter";
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
  Save, Upload, ArrowLeft, Plus, X, Github, Globe, 
  Code, FileText, Tag, Sparkles, CheckCircle
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

const defaultProjectData: ProjectData = {
  title: '',
  tagline: '',
  description: '',
  githubUrl: '',
  demoUrl: '',
  eventId: '',
  tags: [],
  techStack: []
};

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

export default function CreateProject() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const [data, setData] = useState<ProjectData>(defaultProjectData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDraft, setIsDraft] = useState(false);

  const { data: events } = useQuery({
    queryKey: ['events'],
    queryFn: api.getEvents,
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-medium text-gray-900 mb-4">Please log in to create a project</h1>
          <Button onClick={() => setLocation('/login')}>Go to Login</Button>
        </div>
      </div>
    );
  }

  const availableEvents = events?.filter(event => 
    event.status === 'active' || event.status === 'upcoming' || event.status === 'registration_open'
  ) || [];

  const handleSubmit = async (saveAsDraft: boolean = false) => {
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

    setIsSubmitting(true);
    setIsDraft(saveAsDraft);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: saveAsDraft ? "Draft saved!" : "Project created!",
        description: saveAsDraft ? "Your project has been saved as a draft" : "Your project has been successfully created and published",
      });

      setLocation('/dashboard');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create project. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
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
          <h1 className="text-3xl font-medium text-gray-900">Create New Project</h1>
          <p className="text-gray-600 mt-1">Share your amazing project with the community</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-500" />
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
                onClick={() => handleSubmit(false)}
                disabled={isSubmitting}
              >
                {isSubmitting && !isDraft ? (
                  <>
                    <Upload className="w-4 h-4 mr-2 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Publish Project
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => handleSubmit(true)}
                disabled={isSubmitting}
              >
                {isSubmitting && isDraft ? (
                  <>
                    <Save className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save as Draft
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}