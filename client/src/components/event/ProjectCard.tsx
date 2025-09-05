import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ExternalLink, Github, Trophy, Star } from "lucide-react";
import type { Submission, User } from "@/lib/api";

interface ProjectCardProps {
  project: Submission;
  teamMembers?: User[];
  showScore?: boolean;
}

export default function ProjectCard({ project, teamMembers = [], showScore = false }: ProjectCardProps) {
  const getAwardColor = (award: string) => {
    if (award.includes('First') || award.includes('Winner')) return 'coral';
    if (award.includes('Second')) return 'sky';
    if (award.includes('Third')) return 'mint';
    if (award.includes('Finalist')) return 'yellow';
    return 'success';
  };

  const getTrackColor = (track: string) => {
    const colorMap: { [key: string]: string } = {
      'Healthcare': 'coral',
      'Education': 'yellow',
      'Climate': 'mint',
      'Social Justice': 'sky',
      'AI': 'sky',
      'Blockchain': 'coral',
    };
    return colorMap[track] || 'mint';
  };

  return (
    <Card className="bg-card rounded-2xl p-6 shadow-soft border border-border hover-scale cursor-pointer transition-all duration-200" data-testid={`project-card-${project.id}`}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          {project.awards && project.awards.length > 0 ? (
            <Badge className={`bg-${getAwardColor(project.awards[0])}/20 text-${getAwardColor(project.awards[0])} px-3 py-1 rounded-full text-sm font-medium border-0`}>
              <Trophy className="w-3 h-3 mr-1" />
              {project.awards[0]}
            </Badge>
          ) : (
            <Badge className={`bg-${getTrackColor(project.track)}/20 text-${getTrackColor(project.track)} px-3 py-1 rounded-full text-sm font-medium border-0`}>
              {project.track}
            </Badge>
          )}
          
          {showScore && project.averageScore && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Star className="w-4 h-4 mr-1 text-yellow" fill="currentColor" />
              <span>Score: {project.averageScore.toFixed(1)}</span>
            </div>
          )}
        </div>

        {/* Project Image */}
        {project.images && project.images.length > 0 && (
          <div className="aspect-video rounded-xl overflow-hidden">
            <img 
              src={project.images[0]} 
              alt={project.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div>
          <h3 className="font-heading font-semibold text-lg text-card-foreground mb-2 group-hover:text-coral transition-colors">
            {project.title}
          </h3>
          <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
            {project.tagline || project.description}
          </p>

          {/* Tech Stack */}
          <div className="flex flex-wrap gap-2 mb-4">
            {project.techStack.slice(0, 3).map((tech) => (
              <Badge key={tech} className="bg-sky/20 text-sky px-2 py-1 rounded-full text-xs border-0">
                {tech}
              </Badge>
            ))}
            {project.techStack.length > 3 && (
              <Badge className="bg-muted text-muted-foreground px-2 py-1 rounded-full text-xs border-0">
                +{project.techStack.length - 3}
              </Badge>
            )}
          </div>

          {/* Features */}
          {project.features && project.features.length > 0 && (
            <div className="mb-4">
              <ul className="text-xs text-muted-foreground space-y-1">
                {project.features.slice(0, 2).map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-success mr-2">•</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2">
          {/* Team Members */}
          <div className="flex -space-x-2">
            {teamMembers.slice(0, 3).map((member) => (
              <Avatar key={member.id} className="w-6 h-6 border-2 border-background">
                <AvatarImage src={member.avatar} alt={member.name} />
                <AvatarFallback className="bg-mint text-white text-xs">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            ))}
            {teamMembers.length > 3 && (
              <div className="w-6 h-6 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs text-muted-foreground">
                +{teamMembers.length - 3}
              </div>
            )}
          </div>

          {/* Links */}
          <div className="flex gap-2">
            {project.demoUrl && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-sky"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.open(project.demoUrl, '_blank');
                }}
                data-testid={`button-demo-${project.id}`}
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
            )}
            {project.githubUrl && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-coral"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.open(project.githubUrl, '_blank');
                }}
                data-testid={`button-github-${project.id}`}
              >
                <Github className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
