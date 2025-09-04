import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Upload, 
  Plus, 
  X, 
  Eye, 
  Save, 
  Rocket, 
  Github, 
  ExternalLink, 
  Presentation,
  Users,
  Mail,
  MessageSquare
} from "lucide-react";
import { insertProjectSchema, type InsertProject } from "@shared/schema";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { FloatingElement, CrayonSquiggle } from "@/components/ui/floating-elements";
import Confetti from "@/components/ui/confetti";

const techOptions = [
  "React", "Vue", "Angular", "Node.js", "Python", "JavaScript", "TypeScript", 
  "Go", "Rust", "Java", "Swift", "Kotlin", "Flutter", "React Native",
  "MongoDB", "PostgreSQL", "MySQL", "Firebase", "Supabase", "Docker",
  "AWS", "Vercel", "Netlify", "Figma", "Unity", "Unreal Engine"
];

const roleOptions = [
  "Frontend Developer", "Backend Developer", "Full Stack Developer", 
  "UI/UX Designer", "Product Manager", "Data Scientist", "DevOps Engineer",
  "Mobile Developer", "Game Developer", "QA Engineer", "Technical Writer"
];

export default function PublishProject() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showConfetti, setShowConfetti] = useState(false);
  const [isDraft, setIsDraft] = useState(false);
  const [selectedTech, setSelectedTech] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [openRoles, setOpenRoles] = useState<string[]>([]);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  const form = useForm<InsertProject>({
    resolver: zodResolver(insertProjectSchema.extend({
      tags: insertProjectSchema.shape.tags.optional(),
      techStack: insertProjectSchema.shape.techStack.optional(),
    })),
    defaultValues: {
      title: "",
      oneLiner: "",
      description: "",
      fullDescription: "",
      coverImage: "",
      tags: [],
      techStack: [],
      repoLink: "",
      demoLink: "",
      slidesLink: "",
      ownerId: "mock-user-1", // Mock user for demo
      ownerName: "Alex Chen",
      ownerAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face",
      joinPolicy: "open",
      contactMethod: "form",
      contactEmail: "",
      lookingForContributors: false,
      published: false,
    }
  });

  const publishMutation = useMutation({
    mutationFn: async (data: InsertProject) => {
      // Mock API call for demo
      return { id: 'project-' + Date.now(), ...data };
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      if (!isDraft) {
        setShowConfetti(true);
        toast({
          title: "🎉 Project Published!",
          description: "Your project is now live in the gallery.",
        });
        setTimeout(() => {
          setLocation(`/projects/${data.id}`);
        }, 2000);
      } else {
        toast({
          title: "Draft Saved",
          description: "Your project draft has been saved.",
        });
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save project. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertProject) => {
    const projectData = {
      ...data,
      tags: selectedTags,
      techStack: selectedTech,
      published: !isDraft,
      publishedAt: !isDraft ? new Date().toISOString() : null,
    };
    publishMutation.mutate(projectData);
  };

  const addTech = (tech: string) => {
    if (!selectedTech.includes(tech)) {
      setSelectedTech([...selectedTech, tech]);
    }
  };

  const removeTech = (tech: string) => {
    setSelectedTech(selectedTech.filter(t => t !== tech));
  };

  const addTag = (tag: string) => {
    if (!selectedTags.includes(tag) && selectedTags.length < 5) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const removeTag = (tag: string) => {
    setSelectedTags(selectedTags.filter(t => t !== tag));
  };

  const toggleRole = (role: string) => {
    if (openRoles.includes(role)) {
      setOpenRoles(openRoles.filter(r => r !== role));
    } else {
      setOpenRoles([...openRoles, role]);
    }
  };

  const projectPreview = {
    title: form.watch("title") || "Your Project Title",
    oneLiner: form.watch("oneLiner") || "A brief description of your project",
    coverImage: coverPreview || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=300&h=200&fit=crop",
    tags: selectedTags,
    techStack: selectedTech,
    ownerName: "Alex Chen",
    ownerAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face",
    lookingForContributors: form.watch("lookingForContributors"),
    openRoles: openRoles.length,
  };

  return (
    <div className="min-h-screen bg-cream py-8">
      {showConfetti && <Confetti active={true} />}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <FloatingElement>
            <h1 className="font-heading font-bold text-3xl text-text-dark mb-2">
              Publish Your Project
            </h1>
          </FloatingElement>
          <CrayonSquiggle className="mb-4" />
          <p className="text-text-muted text-lg">
            Share your project with the community and find collaborators
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Project Basics */}
                <Card className="bg-white shadow-soft border-soft-gray">
                  <CardHeader>
                    <CardTitle className="font-heading text-xl text-text-dark">
                      Project Basics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Project Title</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="My Awesome Project" 
                              {...field} 
                              data-testid="input-project-title"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="oneLiner"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>One-liner</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="A brief, catchy description of your project" 
                              {...field} 
                              data-testid="input-project-oneliner"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div>
                      <Label htmlFor="cover-upload">Cover Image</Label>
                      <div className="mt-2 border-2 border-dashed border-soft-gray rounded-lg p-6 text-center">
                        <Upload className="w-8 h-8 text-text-muted mx-auto mb-2" />
                        <p className="text-sm text-text-muted">
                          Upload a cover image or drag and drop
                        </p>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm" 
                          className="mt-2"
                          data-testid="button-upload-cover"
                        >
                          Choose File
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label>Tags (max 5)</Label>
                      <div className="mt-2">
                        <Input 
                          placeholder="Type a tag and press Enter"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              const value = e.currentTarget.value.trim();
                              if (value) {
                                addTag(value);
                                e.currentTarget.value = '';
                              }
                            }
                          }}
                          data-testid="input-add-tag"
                        />
                        <div className="flex flex-wrap gap-2 mt-2">
                          {selectedTags.map((tag) => (
                            <Badge 
                              key={tag} 
                              className="bg-mint text-text-dark"
                              data-testid={`tag-${tag}`}
                            >
                              {tag}
                              <X 
                                className="w-3 h-3 ml-1 cursor-pointer" 
                                onClick={() => removeTag(tag)}
                              />
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label>Tech Stack</Label>
                      <Select onValueChange={addTech}>
                        <SelectTrigger data-testid="select-tech-stack">
                          <SelectValue placeholder="Select technologies" />
                        </SelectTrigger>
                        <SelectContent>
                          {techOptions.map((tech) => (
                            <SelectItem key={tech} value={tech}>
                              {tech}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedTech.map((tech) => (
                          <Badge 
                            key={tech} 
                            className="bg-sky text-white"
                            data-testid={`tech-${tech}`}
                          >
                            {tech}
                            <X 
                              className="w-3 h-3 ml-1 cursor-pointer" 
                              onClick={() => removeTech(tech)}
                            />
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* About the Project */}
                <Card className="bg-white shadow-soft border-soft-gray">
                  <CardHeader>
                    <CardTitle className="font-heading text-xl text-text-dark">
                      About the Project
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Short Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="A brief overview of your project..."
                              className="h-24"
                              {...field} 
                              data-testid="textarea-description"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="fullDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Write-up (Markdown)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="## About the Project&#10;&#10;Detailed description of your project, features, and goals..."
                              className="h-48 font-mono text-sm"
                              {...field} 
                              data-testid="textarea-full-description"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="repoLink"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              <Github className="w-4 h-4 inline mr-1" />
                              Repository
                            </FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="https://github.com/user/repo" 
                                {...field} 
                                data-testid="input-repo-link"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="demoLink"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              <ExternalLink className="w-4 h-4 inline mr-1" />
                              Live Demo
                            </FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="https://demo.com" 
                                {...field} 
                                data-testid="input-demo-link"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="slidesLink"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              <Presentation className="w-4 h-4 inline mr-1" />
                              Slides
                            </FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="https://slides.com" 
                                {...field} 
                                data-testid="input-slides-link"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Team & Help Wanted */}
                <Card className="bg-white shadow-soft border-soft-gray">
                  <CardHeader>
                    <CardTitle className="font-heading text-xl text-text-dark">
                      Team & Collaboration
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center space-x-2">
                      <FormField
                        control={form.control}
                        name="lookingForContributors"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                            <FormControl>
                              <Switch
                                checked={field.value || false}
                                onCheckedChange={field.onChange}
                                data-testid="switch-looking-for-contributors"
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Looking for contributors</FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>

                    {form.watch("lookingForContributors") && (
                      <div>
                        <Label>Roles Needed</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                          {roleOptions.map((role) => (
                            <div 
                              key={role} 
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                id={role}
                                checked={openRoles.includes(role)}
                                onCheckedChange={() => toggleRole(role)}
                                data-testid={`checkbox-role-${role}`}
                              />
                              <Label 
                                htmlFor={role} 
                                className="text-sm font-normal cursor-pointer"
                              >
                                {role}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <FormField
                      control={form.control}
                      name="joinPolicy"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Join Policy</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-join-policy">
                                <SelectValue placeholder="Select join policy" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="open">Open Join</SelectItem>
                              <SelectItem value="request">Request to Join</SelectItem>
                              <SelectItem value="invite">Invite Only</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Contact */}
                <Card className="bg-white shadow-soft border-soft-gray">
                  <CardHeader>
                    <CardTitle className="font-heading text-xl text-text-dark">
                      Contact
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="contactMethod"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Method</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-contact-method">
                                <SelectValue placeholder="Select contact method" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="form">
                                <MessageSquare className="w-4 h-4 inline mr-2" />
                                Contact Form
                              </SelectItem>
                              <SelectItem value="email">
                                <Mail className="w-4 h-4 inline mr-2" />
                                Public Email
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {form.watch("contactMethod") === "email" && (
                      <FormField
                        control={form.control}
                        name="contactEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contact Email</FormLabel>
                            <FormControl>
                              <Input 
                                type="email"
                                placeholder="contact@example.com" 
                                {...field} 
                                data-testid="input-contact-email"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </CardContent>
                </Card>

                {/* Submit Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    type="submit"
                    size="lg"
                    className="bg-coral text-white hover:bg-coral/80 px-8 py-3 rounded-full font-medium"
                    disabled={publishMutation.isPending}
                    onClick={() => setIsDraft(false)}
                    data-testid="button-publish"
                  >
                    <Rocket className="w-5 h-5 mr-2" />
                    {publishMutation.isPending ? "Publishing..." : "Publish to Gallery"}
                  </Button>
                  
                  <Button
                    type="submit"
                    variant="outline"
                    size="lg"
                    className="border-2 border-mint text-text-dark hover:bg-mint/20 px-8 py-3 rounded-full font-medium"
                    disabled={publishMutation.isPending}
                    onClick={() => setIsDraft(true)}
                    data-testid="button-save-draft"
                  >
                    <Save className="w-5 h-5 mr-2" />
                    Save Draft
                  </Button>
                </div>
              </form>
            </Form>
          </div>

          {/* Preview Section */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <Card className="bg-white shadow-soft border-soft-gray">
                <CardHeader>
                  <CardTitle className="font-heading text-lg text-text-dark flex items-center">
                    <Eye className="w-5 h-5 mr-2" />
                    Live Preview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-white rounded-2xl border-2 border-soft-gray overflow-hidden">
                    <div className="aspect-video bg-gradient-to-br from-sky/20 to-mint/20 relative">
                      {projectPreview.coverImage && (
                        <img 
                          src={projectPreview.coverImage} 
                          alt="Cover" 
                          className="w-full h-full object-cover"
                        />
                      )}
                      {projectPreview.lookingForContributors && (
                        <Badge className="absolute top-3 right-3 bg-coral text-white">
                          Open Roles
                        </Badge>
                      )}
                    </div>
                    
                    <div className="p-4">
                      <h3 className="font-heading font-semibold text-lg text-text-dark mb-1">
                        {projectPreview.title}
                      </h3>
                      <p className="text-sm text-text-muted mb-3">
                        {projectPreview.oneLiner}
                      </p>
                      
                      <div className="flex flex-wrap gap-1 mb-3">
                        {projectPreview.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} className="bg-mint/20 text-text-dark text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {projectPreview.tags.length > 3 && (
                          <Badge className="bg-soft-gray text-text-muted text-xs">
                            +{projectPreview.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Avatar className="w-6 h-6">
                            <AvatarImage src={projectPreview.ownerAvatar} />
                            <AvatarFallback>AC</AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-text-muted">
                            {projectPreview.ownerName}
                          </span>
                        </div>
                        
                        {projectPreview.lookingForContributors && projectPreview.openRoles > 0 && (
                          <Badge className="bg-yellow text-text-dark text-xs">
                            <Users className="w-3 h-3 mr-1" />
                            {projectPreview.openRoles} roles
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}