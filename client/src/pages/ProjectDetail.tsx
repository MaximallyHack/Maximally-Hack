import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { 
  ExternalLink, 
  Github, 
  Share2, 
  Users, 
  Mail, 
  MessageSquare,
  Trophy,
  Medal,
  Award,
  Calendar,
  MapPin,
  CheckCircle,
  Clock,
  Circle,
  ArrowLeft,
  Eye,
  Heart,
  Star
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { FloatingElement } from "@/components/ui/floating-elements";
import JoinRequestModal from "@/components/project/JoinRequestModal";
import ContactModal from "@/components/project/ContactModal";

interface ProjectDetailProps {
  params: { id: string };
}

export default function ProjectDetail() {
  const [, params] = useRoute<{ id: string }>("/projects/:id");
  const { toast } = useToast();
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

  // Mock data for demo
  const { data: project, isLoading } = useQuery({
    queryKey: ['project', params?.id],
    queryFn: async () => {
      // Mock project data
      return {
        id: params?.id || "1",
        title: "EcoTrack",
        oneLiner: "AI-powered carbon footprint tracker for individuals and businesses",
        description: "A comprehensive platform to track, analyze, and reduce carbon emissions using advanced AI algorithms and real-time data processing.",
        fullDescription: `# EcoTrack - Carbon Footprint Tracker

## Overview
EcoTrack is an innovative AI-powered platform designed to help individuals and businesses monitor, analyze, and reduce their carbon footprint. Using cutting-edge machine learning algorithms, we provide personalized insights and actionable recommendations.

## Key Features
- **Real-time Tracking**: Monitor your carbon emissions across all activities
- **AI Insights**: Get personalized recommendations based on your usage patterns
- **Business Dashboard**: Corporate tools for tracking organizational impact
- **Goal Setting**: Set and track reduction targets with progress monitoring
- **Community Challenges**: Participate in group challenges to maximize impact

## Technology Stack
Built with modern technologies including React Native for mobile, Python for AI/ML backend, and TensorFlow for machine learning models.

## Impact
Already helping 10,000+ users reduce their carbon footprint by an average of 25% in the first 6 months.`,
        coverImage: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=600&h=400&fit=crop",
        tags: ["AI & ML", "Sustainability", "Mobile", "Climate Tech"],
        techStack: ["React Native", "Python", "TensorFlow", "PostgreSQL", "AWS"],
        repoLink: "https://github.com/ecotrack/app",
        demoLink: "https://ecotrack-demo.com",
        slidesLink: "https://slides.com/ecotrack-pitch",
        ownerId: "user-1",
        ownerName: "Sarah Johnson",
        ownerAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b829?w=64&h=64&fit=crop&crop=face",
        lookingForContributors: true,
        badges: ["Winner", "People's Choice"],
        teamMembers: [
          {
            id: "member-1",
            name: "Sarah Johnson",
            role: "Product Lead",
            avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b829?w=32&h=32&fit=crop&crop=face",
            isOwner: true,
          },
          {
            id: "member-2", 
            name: "Alex Rivera",
            role: "AI Engineer",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face",
            isOwner: false,
          }
        ],
        openRoles: [
          {
            id: "role-1",
            title: "Frontend Developer",
            description: "Help build React Native mobile app and web dashboard",
            skills: ["React Native", "TypeScript", "UI/UX"],
          },
          {
            id: "role-2",
            title: "Data Scientist", 
            description: "Improve ML models for carbon footprint predictions",
            skills: ["Python", "TensorFlow", "Data Analysis"],
          },
          {
            id: "role-3",
            title: "UX Designer",
            description: "Design intuitive interfaces for sustainability insights",
            skills: ["Figma", "User Research", "Prototyping"],
          }
        ],
        tasks: [
          {
            id: "task-1",
            title: "Implement dark mode",
            status: "open",
            priority: "medium"
          },
          {
            id: "task-2", 
            title: "Add social sharing features",
            status: "in_progress",
            priority: "high"
          },
          {
            id: "task-3",
            title: "Optimize ML model performance", 
            status: "done",
            priority: "high"
          },
          {
            id: "task-4",
            title: "Create onboarding tutorial",
            status: "open",
            priority: "low"
          }
        ],
        eventId: "hackathon-2024",
        eventName: "Climate Tech Hackathon 2024",
        contactMethod: "form",
        published: true,
        publishedAt: "2024-01-15T10:00:00Z",
        viewCount: 1247,
        starCount: 89,
        screenshots: [
          "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=400&h=300&fit=crop"
        ]
      };
    },
    staleTime: Infinity,
  });

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: project?.title,
          text: project?.oneLiner,
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled or error occurred
      }
    } else {
      // Fallback to clipboard
      await navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied!",
        description: "Project link copied to clipboard",
      });
    }
  };

  const statusIcons = {
    open: <Circle className="w-4 h-4 text-coral" />,
    in_progress: <Clock className="w-4 h-4 text-yellow" />,
    done: <CheckCircle className="w-4 h-4 text-mint" />
  };

  const badgeIcons = {
    'Winner': <Trophy className="w-4 h-4" />,
    'Finalist': <Medal className="w-4 h-4" />,
    'People\'s Choice': <Award className="w-4 h-4" />
  };

  if (isLoading || !project) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-soft-gray rounded mb-4 w-1/4"></div>
            <div className="h-64 bg-soft-gray rounded mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-soft-gray rounded w-3/4"></div>
              <div className="h-4 bg-soft-gray rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Navigation */}
        <div className="mb-6">
          <Link href="/projects">
            <Button variant="ghost" className="text-muted-foreground hover:text-card-foreground" data-testid="button-back">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Projects
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Section */}
            <div>
              <div className="aspect-video bg-gradient-to-br from-sky/20 to-mint/20 rounded-2xl overflow-hidden mb-6 relative">
                {project.coverImage && (
                  <img 
                    src={project.coverImage} 
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                )}
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {project.badges?.map((badge) => (
                    <Badge 
                      key={badge} 
                      className="bg-yellow text-card-foreground shadow-soft"
                      data-testid={`badge-${badge}`}
                    >
                      {badgeIcons[badge as keyof typeof badgeIcons]}
                      <span className="ml-1">{badge}</span>
                    </Badge>
                  ))}
                </div>

                {/* Stats */}
                <div className="absolute bottom-4 right-4 flex gap-2">
                  <Badge className="bg-card/90 text-card-foreground">
                    <Eye className="w-3 h-3 mr-1" />
                    {project.viewCount}
                  </Badge>
                  <Badge className="bg-card/90 text-card-foreground">
                    <Star className="w-3 h-3 mr-1" />
                    {project.starCount}
                  </Badge>
                </div>
              </div>

              <FloatingElement>
                <h1 className="font-heading font-bold text-3xl text-card-foreground mb-3">
                  {project.title}
                </h1>
              </FloatingElement>
              
              <p className="text-xl text-muted-foreground mb-4">
                {project.oneLiner}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {project.tags?.map((tag) => (
                  <Badge key={tag} className="bg-mint/20 text-card-foreground">
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                {project.repoLink && (
                  <Button asChild className="bg-text-dark text-white hover:bg-text-dark/80">
                    <a href={project.repoLink} target="_blank" rel="noopener noreferrer" data-testid="button-view-repo">
                      <Github className="w-4 h-4 mr-2" />
                      View Repository
                    </a>
                  </Button>
                )}
                
                {project.demoLink && (
                  <Button asChild variant="outline" className="border-coral text-coral hover:bg-coral/20">
                    <a href={project.demoLink} target="_blank" rel="noopener noreferrer" data-testid="button-view-demo">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Live Demo
                    </a>
                  </Button>
                )}

                <Button 
                  variant="outline" 
                  onClick={handleShare}
                  className="border-sky text-sky hover:bg-sky/20"
                  data-testid="button-share"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>

            {/* About Section */}
            <Card className="bg-card shadow-soft border-border">
              <CardHeader>
                <CardTitle className="font-heading text-xl text-card-foreground">
                  About the Project
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  {project.fullDescription?.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4 last:mb-0">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Screenshots */}
            {project.screenshots && project.screenshots.length > 0 && (
              <Card className="bg-card shadow-soft border-border">
                <CardHeader>
                  <CardTitle className="font-heading text-xl text-card-foreground">
                    Screenshots
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {project.screenshots.map((screenshot, index) => (
                      <div key={index} className="aspect-video bg-soft-gray rounded-lg overflow-hidden">
                        <img 
                          src={screenshot} 
                          alt={`Screenshot ${index + 1}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tasks Preview */}
            {project.tasks && project.tasks.length > 0 && (
              <Card className="bg-card shadow-soft border-border">
                <CardHeader>
                  <CardTitle className="font-heading text-xl text-card-foreground">
                    Sample Tasks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {project.tasks.slice(0, 6).map((task) => (
                      <div key={task.id} className="flex items-center justify-between p-3 bg-soft-gray/30 rounded-lg">
                        <div className="flex items-center space-x-3">
                          {statusIcons[task.status as keyof typeof statusIcons]}
                          <span className="text-sm text-card-foreground">{task.title}</span>
                        </div>
                        <Badge className={`text-xs ${
                          task.priority === 'high' ? 'bg-coral text-white' :
                          task.priority === 'medium' ? 'bg-yellow text-card-foreground' :
                          'bg-mint text-card-foreground'
                        }`}>
                          {task.priority}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  
                  {project.lookingForContributors && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <Button 
                        onClick={() => setShowJoinModal(true)}
                        className="bg-coral text-white hover:bg-coral/80 w-full"
                        data-testid="button-ask-to-work"
                      >
                        Ask to Work on Tasks
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Team */}
            <Card className="bg-card shadow-soft border-border">
              <CardHeader>
                <CardTitle className="font-heading text-lg text-card-foreground">
                  Team
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {project.teamMembers?.map((member) => (
                    <div key={member.id} className="flex items-center space-x-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm text-card-foreground">{member.name}</p>
                          {member.isOwner && (
                            <Badge className="bg-coral text-white text-xs">Owner</Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{member.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Open Roles */}
            {project.lookingForContributors && project.openRoles && project.openRoles.length > 0 && (
              <Card className="bg-card shadow-soft border-border">
                <CardHeader>
                  <CardTitle className="font-heading text-lg text-card-foreground">
                    We Need Help With
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {project.openRoles.map((role) => (
                      <div key={role.id} className="border border-border rounded-lg p-3">
                        <h4 className="font-medium text-sm text-card-foreground mb-1">{role.title}</h4>
                        <p className="text-xs text-muted-foreground mb-2">{role.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {role.skills?.map((skill) => (
                            <Badge key={skill} className="bg-sky/20 text-sky text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-2">
                    <Button 
                      onClick={() => setShowJoinModal(true)}
                      className="bg-coral text-white hover:bg-coral/80 w-full"
                      data-testid="button-join-team"
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Join the Team
                    </Button>
                    
                    <Button 
                      onClick={() => setShowContactModal(true)}
                      variant="outline" 
                      className="border-mint text-mint hover:bg-mint/20 w-full"
                      data-testid="button-contact-team"
                    >
                      {project.contactMethod === 'email' ? (
                        <Mail className="w-4 h-4 mr-2" />
                      ) : (
                        <MessageSquare className="w-4 h-4 mr-2" />
                      )}
                      Send a Quick Note
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Project Info */}
            <Card className="bg-card shadow-soft border-border">
              <CardHeader>
                <CardTitle className="font-heading text-lg text-card-foreground">
                  Project Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {project.eventName && (
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{project.eventName}</span>
                  </div>
                )}
                
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Published {new Date(project.publishedAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Tech Stack */}
                <div>
                  <p className="text-sm font-medium text-card-foreground mb-2">Tech Stack</p>
                  <div className="flex flex-wrap gap-1">
                    {project.techStack?.map((tech) => (
                      <Badge key={tech} className="bg-text-dark text-white text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Modals */}
      <JoinRequestModal 
        open={showJoinModal}
        onOpenChange={setShowJoinModal}
        project={project}
        openRoles={project.openRoles || []}
      />
      
      <ContactModal 
        open={showContactModal}
        onOpenChange={setShowContactModal}
        project={project}
      />
    </div>
  );
}