import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useConfetti } from "@/components/ui/confetti";
import { CrayonSquiggle } from "@/components/ui/floating-elements";
import { 
  Upload,
  FileText,
  Code,
  ExternalLink,
  Github,
  Save,
  Sparkles,
  Image,
  Camera,
  X,
  Eye
} from "lucide-react";

interface ProjectData {
  title: string;
  oneLiner: string;
  description: string;
  readme: string;
  repoUrl: string;
  demoUrl: string;
  slidesUrl: string;
  tags: string[];
  techStack: string[];
  coverImage: string;
  screenshots: string[];
}

const availableTags = [
  "AI", "Web", "Mobile", "Design", "Open Source", "Healthcare", "Education", 
  "Climate", "Fintech", "Gaming", "Social Impact", "Productivity", "Developer Tools"
];

const techOptions = [
  "React", "Next.js", "Vue", "Angular", "Node.js", "Python", "TypeScript", 
  "JavaScript", "Go", "Rust", "Swift", "Kotlin", "React Native", "Flutter",
  "PostgreSQL", "MongoDB", "Firebase", "Supabase", "Prisma", "GraphQL",
  "Tailwind CSS", "Figma", "AWS", "Vercel", "Docker"
];

const defaultProjectData: ProjectData = {
  title: '',
  oneLiner: '',
  description: '',
  readme: '',
  repoUrl: '',
  demoUrl: '',
  slidesUrl: '',
  tags: [],
  techStack: [],
  coverImage: '',
  screenshots: []
};

export default function UploadProject() {
  const [, setLocation] = useLocation();
  const [data, setData] = useState<ProjectData>(defaultProjectData);
  const [isDraft, setIsDraft] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { isActive: confettiActive, trigger: triggerConfetti, Confetti } = useConfetti();

  const toggleTag = (tag: string) => {
    setData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const toggleTech = (tech: string) => {
    setData(prev => ({
      ...prev,
      techStack: prev.techStack.includes(tech)
        ? prev.techStack.filter(t => t !== tech)
        : [...prev.techStack, tech]
    }));
  };

  const handleSaveDraft = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Draft saved! 💾",
      description: "Your project has been saved as a draft. You can continue editing anytime.",
    });
    
    setIsSubmitting(false);
    setIsDraft(true);
  };

  const handleSubmitFinal = async () => {
    if (!data.title || !data.oneLiner || !data.description) {
      toast({
        title: "Missing required fields",
        description: "Please fill in title, one-liner, and description.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    triggerConfetti();
    
    const projectId = `project-${Date.now()}`;
    
    toast({
      title: "Project published! 🎉",
      description: "Your project is now live in the gallery for everyone to see!",
    });
    
    setIsSubmitting(false);
    setIsDraft(false);
    
    // Show "View in gallery" option
    setTimeout(() => {
      toast({
        title: "Ready to share? 🚀",
        description: (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setLocation(`/projects/${projectId}`)}
            className="mt-2"
          >
            View in Gallery
          </Button>
        ),
      });
    }, 2000);
  };

  const mockUploadImage = (type: 'cover' | 'screenshot') => {
    const mockUrl = `https://images.unsplash.com/photo-${Date.now()}?w=400&h=300&fit=crop`;
    
    if (type === 'cover') {
      setData(prev => ({ ...prev, coverImage: mockUrl }));
      toast({
        title: "Cover image uploaded! 📸",
        description: "Image preview updated",
      });
    } else {
      setData(prev => ({ 
        ...prev, 
        screenshots: [...prev.screenshots, mockUrl] 
      }));
      toast({
        title: "Screenshot added! 📷",
        description: "Screenshot uploaded successfully",
      });
    }
  };

  const removeScreenshot = (index: number) => {
    setData(prev => ({
      ...prev,
      screenshots: prev.screenshots.filter((_, i) => i !== index)
    }));
  };

  const isFormValid = data.title && data.oneLiner && data.description;

  return (
    <div className="min-h-screen bg-cream py-8 px-4" data-testid="upload-project-page">
      <Confetti />
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-coral rounded-full flex items-center justify-center mx-auto mb-4">
            <Upload className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-heading font-bold text-4xl text-text-dark mb-2">Share Your Project</h1>
          <CrayonSquiggle className="mx-auto mb-4" />
          <p className="text-text-muted text-lg max-w-2xl mx-auto">
            Show off your amazing work to the community. Get feedback, inspire others, and celebrate your achievements!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <Card className="bg-white rounded-2xl p-8 shadow-soft border border-soft-gray">
            <div className="space-y-8">
              {/* Basic Info */}
              <div>
                <h3 className="font-heading font-semibold text-xl text-text-dark mb-6">Project Details</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-dark mb-2">Project Title *</label>
                    <Input
                      value={data.title}
                      onChange={(e) => setData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="My Awesome Project"
                      className="border-soft-gray focus:ring-2 focus:ring-coral focus:border-transparent"
                      data-testid="input-title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-dark mb-2">One-Liner *</label>
                    <Input
                      value={data.oneLiner}
                      onChange={(e) => setData(prev => ({ ...prev, oneLiner: e.target.value }))}
                      placeholder="A brief, catchy description of what your project does"
                      className="border-soft-gray focus:ring-2 focus:ring-coral focus:border-transparent"
                      data-testid="input-oneliner"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-dark mb-2">Description *</label>
                    <Textarea
                      value={data.description}
                      onChange={(e) => setData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Tell the story of your project. What problem does it solve? How does it work? What makes it special?"
                      rows={4}
                      className="border-soft-gray focus:ring-2 focus:ring-coral focus:border-transparent"
                      data-testid="textarea-description"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-text-dark mb-2">README Documentation</label>
                    <Textarea
                      value={data.readme}
                      onChange={(e) => setData(prev => ({ ...prev, readme: e.target.value }))}
                      placeholder="Write your project documentation in Markdown format. Include setup instructions, usage examples, and contribution guidelines..."
                      rows={8}
                      className="border-soft-gray focus:ring-2 focus:ring-coral focus:border-transparent font-mono text-sm"
                      data-testid="textarea-readme"
                    />
                    <p className="text-xs text-text-muted mt-1">Supports Markdown formatting</p>
                  </div>
                </div>
              </div>

              {/* Links */}
              <div>
                <h3 className="font-heading font-semibold text-lg text-text-dark mb-4">Project Links</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-dark mb-2 flex items-center gap-2">
                      <Github className="w-4 h-4" />
                      Repository URL
                    </label>
                    <Input
                      value={data.repoUrl}
                      onChange={(e) => setData(prev => ({ ...prev, repoUrl: e.target.value }))}
                      placeholder="https://github.com/yourusername/project"
                      className="border-soft-gray focus:ring-2 focus:ring-coral focus:border-transparent"
                      data-testid="input-repo"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-dark mb-2 flex items-center gap-2">
                      <ExternalLink className="w-4 h-4" />
                      Live Demo URL
                    </label>
                    <Input
                      value={data.demoUrl}
                      onChange={(e) => setData(prev => ({ ...prev, demoUrl: e.target.value }))}
                      placeholder="https://your-project-demo.com"
                      className="border-soft-gray focus:ring-2 focus:ring-coral focus:border-transparent"
                      data-testid="input-demo"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-dark mb-2 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Presentation/Slides URL
                    </label>
                    <Input
                      value={data.slidesUrl}
                      onChange={(e) => setData(prev => ({ ...prev, slidesUrl: e.target.value }))}
                      placeholder="https://slides.com/your-presentation"
                      className="border-soft-gray focus:ring-2 focus:ring-coral focus:border-transparent"
                      data-testid="input-slides"
                    />
                  </div>
                </div>
              </div>

              {/* Tags & Tech */}
              <div>
                <h3 className="font-heading font-semibold text-lg text-text-dark mb-4">Categories & Tech Stack</h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-text-dark mb-3">Tags</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {availableTags.map((tag) => (
                        <Badge
                          key={tag}
                          onClick={() => toggleTag(tag)}
                          className={`cursor-pointer transition-colors p-2 rounded-lg border-0 text-center text-sm ${
                            data.tags.includes(tag)
                              ? 'bg-coral text-white'
                              : 'bg-soft-gray text-text-dark hover:bg-soft-gray/80'
                          }`}
                          data-testid={`tag-${tag.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-dark mb-3">Tech Stack</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {techOptions.map((tech) => (
                        <Badge
                          key={tech}
                          onClick={() => toggleTech(tech)}
                          className={`cursor-pointer transition-colors p-2 rounded-lg border-0 text-center text-xs ${
                            data.techStack.includes(tech)
                              ? 'bg-sky text-white'
                              : 'bg-soft-gray text-text-dark hover:bg-soft-gray/80'
                          }`}
                          data-testid={`tech-${tech.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Media Upload */}
              <div>
                <h3 className="font-heading font-semibold text-lg text-text-dark mb-4">Visual Assets</h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-text-dark mb-3">Cover Image</label>
                    <div className="border-2 border-dashed border-soft-gray rounded-xl p-6 text-center hover:border-coral/50 transition-colors">
                      {data.coverImage ? (
                        <div className="relative">
                          <img 
                            src={data.coverImage} 
                            alt="Cover" 
                            className="w-full h-32 object-cover rounded-lg mb-3"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => mockUploadImage('cover')}
                            className="border-coral text-coral hover:bg-coral/10"
                          >
                            <Image className="w-4 h-4 mr-2" />
                            Replace Image
                          </Button>
                        </div>
                      ) : (
                        <div>
                          <Image className="w-8 h-8 text-text-muted mx-auto mb-3" />
                          <p className="text-text-muted mb-3">Upload a cover image for your project</p>
                          <Button
                            variant="outline"
                            onClick={() => mockUploadImage('cover')}
                            className="border-coral text-coral hover:bg-coral/10"
                            data-testid="button-upload-cover"
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            Choose Image
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-dark mb-3">Screenshots</label>
                    <div className="space-y-4">
                      {data.screenshots.length > 0 && (
                        <div className="grid grid-cols-2 gap-3">
                          {data.screenshots.map((screenshot, index) => (
                            <div key={index} className="relative group">
                              <img 
                                src={screenshot} 
                                alt={`Screenshot ${index + 1}`} 
                                className="w-full h-24 object-cover rounded-lg"
                              />
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeScreenshot(index)}
                                className="absolute top-1 right-1 w-6 h-6 bg-red-500 hover:bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <div className="border-2 border-dashed border-soft-gray rounded-lg p-4 text-center hover:border-sky/50 transition-colors">
                        <Camera className="w-6 h-6 text-text-muted mx-auto mb-2" />
                        <p className="text-text-muted text-sm mb-3">Add screenshots to showcase your project</p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => mockUploadImage('screenshot')}
                          className="border-sky text-sky hover:bg-sky/10"
                          data-testid="button-add-screenshot"
                        >
                          <Camera className="w-4 h-4 mr-2" />
                          Add Screenshot
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 pt-6 border-t border-soft-gray flex gap-4">
              <Button
                onClick={handleSaveDraft}
                disabled={isSubmitting}
                variant="outline"
                className="flex-1 border-mint text-mint hover:bg-mint/10"
                data-testid="button-save-draft"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Draft
              </Button>
              
              <Button
                onClick={handleSubmitFinal}
                disabled={!isFormValid || isSubmitting}
                className="flex-1 bg-coral text-white hover:bg-coral/80"
                data-testid="button-submit-final"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Publishing...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Publish Project
                  </span>
                )}
              </Button>
            </div>
          </Card>

          {/* Live Preview */}
          <div className="space-y-6">
            <div>
              <h3 className="font-heading font-semibold text-xl text-text-dark mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5 text-coral" />
                Live Preview
              </h3>
              <p className="text-text-muted text-sm mb-6">See how your project will appear in the gallery</p>
            </div>

            <Card className="bg-white rounded-2xl p-6 shadow-soft border border-soft-gray">
              {/* Cover Image */}
              <div className="mb-6">
                {data.coverImage ? (
                  <img 
                    src={data.coverImage} 
                    alt="Project cover" 
                    className="w-full h-48 object-cover rounded-xl"
                  />
                ) : (
                  <div className="w-full h-48 bg-soft-gray rounded-xl flex items-center justify-center">
                    <div className="text-center">
                      <Image className="w-8 h-8 text-text-muted mx-auto mb-2" />
                      <p className="text-text-muted text-sm">Cover image will appear here</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Project Info */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-heading font-bold text-xl text-text-dark">
                    {data.title || 'Your Project Title'}
                  </h4>
                  <p className="text-text-muted mt-1">
                    {data.oneLiner || 'Your one-liner will appear here'}
                  </p>
                </div>

                {(data.tags.length > 0 || data.techStack.length > 0) && (
                  <div className="flex flex-wrap gap-2">
                    {data.tags.map((tag) => (
                      <Badge key={tag} className="bg-coral/10 text-coral border-0 text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {data.techStack.slice(0, 3).map((tech) => (
                      <Badge key={tech} className="bg-sky/10 text-sky border-0 text-xs">
                        {tech}
                      </Badge>
                    ))}
                    {data.techStack.length > 3 && (
                      <Badge className="bg-soft-gray text-text-muted border-0 text-xs">
                        +{data.techStack.length - 3} more
                      </Badge>
                    )}
                  </div>
                )}

                {data.description && (
                  <div>
                    <p className="text-text-muted text-sm leading-relaxed line-clamp-4">
                      {data.description}
                    </p>
                  </div>
                )}

                {/* Action Links */}
                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!data.repoUrl}
                    className="border-text-dark text-text-dark hover:bg-soft-gray"
                  >
                    <Github className="w-4 h-4 mr-2" />
                    Code
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!data.demoUrl}
                    className="border-coral text-coral hover:bg-coral/10"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Demo
                  </Button>
                  {data.slidesUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-sky text-sky hover:bg-sky/10"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Slides
                    </Button>
                  )}
                </div>
              </div>
            </Card>

            {/* Screenshot Preview */}
            {data.screenshots.length > 0 && (
              <Card className="bg-white rounded-2xl p-6 shadow-soft border border-soft-gray">
                <h5 className="font-medium text-text-dark mb-4">Screenshots</h5>
                <div className="grid grid-cols-2 gap-3">
                  {data.screenshots.map((screenshot, index) => (
                    <img 
                      key={index}
                      src={screenshot} 
                      alt={`Screenshot ${index + 1}`} 
                      className="w-full h-20 object-cover rounded-lg"
                    />
                  ))}
                </div>
              </Card>
            )}
            
            {/* README Preview */}
            {data.readme && (
              <Card className="bg-white rounded-2xl p-6 shadow-soft border border-soft-gray">
                <h5 className="font-medium text-text-dark mb-4 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  README Documentation
                </h5>
                <div className="prose max-w-none text-text-muted">
                  <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed bg-soft-gray/30 p-4 rounded-lg">
                    {data.readme}
                  </pre>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}