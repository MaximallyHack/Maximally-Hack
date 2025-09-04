import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, ExternalLink, Github, Star, Trophy, Calendar, Users, Code } from "lucide-react";
import ProjectCard from "@/components/event/ProjectCard";
import { CrayonSquiggle } from "@/components/ui/floating-elements";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import type { Submission } from "@/lib/api";

export default function Projects() {
  const { id } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTech, setSelectedTech] = useState<string>("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("popular");
  const [selectedProject, setSelectedProject] = useState<Submission | null>(null);

  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects', searchQuery, selectedTech, selectedTags, sortBy],
    queryFn: async () => {
      let projects = await api.getFeaturedProjects();
      
      // Filter by search query
      if (searchQuery) {
        projects = projects.filter(p => 
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.techStack.some(tech => tech.toLowerCase().includes(searchQuery.toLowerCase())) ||
          p.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
        );
      }
      
      // Filter by tech stack
      if (selectedTech && selectedTech !== "all") {
        projects = projects.filter(p => p.techStack.includes(selectedTech));
      }
      
      // Filter by tags
      if (selectedTags.length > 0) {
        projects = projects.filter(p => 
          selectedTags.some(tag => p.tags.includes(tag))
        );
      }
      
      // Sort projects
      switch (sortBy) {
        case 'popular':
          projects.sort((a, b) => (b.averageScore || 0) - (a.averageScore || 0));
          break;
        case 'new':
          projects.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
          break;
        case 'title':
          projects.sort((a, b) => a.title.localeCompare(b.title));
          break;
      }
      
      return projects;
    },
  });

  // If we have an ID, try to find and show that specific project
  const { data: specificProject } = useQuery({
    queryKey: ['project', id],
    queryFn: () => api.getSubmission(id!),
    enabled: !!id,
  });

  // Get unique tech stack and tag options
  const allTechStack = projects ? Array.from(new Set(projects.flatMap(p => p.techStack))) : [];
  const allTags = projects ? Array.from(new Set(projects.flatMap(p => p.tags))) : [];
  
  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };
  
  const resetFilters = () => {
    setSearchQuery("");
    setSelectedTech("all");
    setSelectedTags([]);
    setSortBy("popular");
  };
  
  const hasActiveFilters = searchQuery || selectedTech !== "all" || selectedTags.length > 0;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (id && specificProject) {
    // Mock team members data based on teamId
    const mockTeamMembers = [
      { id: "user-1", name: "Alex Chen", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face", role: "Team Lead" },
      { id: "user-2", name: "Sarah Williams", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face", role: "Designer" },
      { id: "user-3", name: "Mike Johnson", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face", role: "Developer" }
    ];
    
    const mockReadme = `# ${specificProject.title}

${specificProject.longDescription}

## Features

${specificProject.features?.map(feature => `- ${feature}`).join('\n') || 'No features listed.'}

## Tech Stack

${specificProject.techStack.map(tech => `- ${tech}`).join('\n')}

## Getting Started

1. Clone the repository
2. Install dependencies: \`npm install\`
3. Start the development server: \`npm start\`

## Contributing

We welcome contributions! Please see our contributing guidelines for more details.`;

    return (
      <div className="min-h-screen bg-cream py-8" data-testid="project-detail-page">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Project Hero */}
          <div className="bg-white rounded-2xl p-8 shadow-soft border border-soft-gray mb-8">
            {/* Cover Image */}
            {specificProject.images && specificProject.images.length > 0 && (
              <div className="aspect-video rounded-xl overflow-hidden mb-6">
                <img 
                  src={specificProject.images[0]} 
                  alt={specificProject.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="flex-1">
                <h1 className="font-heading font-bold text-4xl text-text-dark mb-3">{specificProject.title}</h1>
                <p className="text-xl text-text-muted mb-4">{specificProject.tagline}</p>
                
                {/* Tag Chips */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {specificProject.tags.map(tag => (
                    <Badge key={tag} className="bg-sky/20 text-sky px-3 py-1 rounded-full text-sm border-0">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-3">
                  {specificProject.demoUrl && (
                    <Button className="bg-coral text-white hover:bg-coral/80" asChild>
                      <a href={specificProject.demoUrl} target="_blank" rel="noopener noreferrer" data-testid="button-view-demo">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Live Demo
                      </a>
                    </Button>
                  )}
                  {specificProject.githubUrl && (
                    <Button variant="outline" className="border-sky text-sky hover:bg-sky/10" asChild>
                      <a href={specificProject.githubUrl} target="_blank" rel="noopener noreferrer" data-testid="button-view-code">
                        <Github className="w-4 h-4 mr-2" />
                        View Code
                      </a>
                    </Button>
                  )}
                </div>
              </div>
              
              {/* Awards */}
              {specificProject.awards && specificProject.awards.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {specificProject.awards.map((award, index) => (
                    <Badge key={index} className="bg-coral/20 text-coral px-3 py-2 rounded-full text-sm border-0">
                      <Trophy className="w-3 h-3 mr-1" />
                      {award}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Team Section */}
              <div className="bg-white rounded-2xl p-6 shadow-soft border border-soft-gray mb-8">
                <h2 className="font-heading font-bold text-xl text-text-dark mb-4">Team</h2>
                <div className="flex flex-wrap gap-4">
                  {mockTeamMembers.map((member) => (
                    <div key={member.id} className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback className="bg-sky text-white">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-text-dark">{member.name}</div>
                        <div className="text-xs text-text-muted">{member.role}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Screenshots Strip */}
              {specificProject.images && specificProject.images.length > 1 && (
                <div className="bg-white rounded-2xl p-6 shadow-soft border border-soft-gray mb-8">
                  <h2 className="font-heading font-bold text-xl text-text-dark mb-4">Screenshots</h2>
                  <div className="flex gap-4 overflow-x-auto pb-2">
                    {specificProject.images.slice(1).map((image, index) => (
                      <div key={index} className="flex-shrink-0 w-64 aspect-video rounded-lg overflow-hidden">
                        <img 
                          src={image} 
                          alt={`Screenshot ${index + 1}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* README */}
              <div className="bg-white rounded-2xl p-8 shadow-soft border border-soft-gray">
                <h2 className="font-heading font-bold text-xl text-text-dark mb-4">README</h2>
                <div className="prose max-w-none text-text-muted">
                  <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">{mockReadme}</pre>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Event Info */}
              <div className="bg-white rounded-2xl p-6 shadow-soft border border-soft-gray">
                <h3 className="font-heading font-semibold text-lg text-text-dark mb-4">Event</h3>
                <Badge className="bg-mint/20 text-mint px-3 py-2 rounded-full text-sm border-0 mb-2">
                  {specificProject.track}
                </Badge>
                <div className="flex items-center gap-2 text-text-muted text-sm">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(specificProject.submittedAt)}</span>
                </div>
                {specificProject.averageScore && (
                  <div className="flex items-center gap-2 mt-2">
                    <Star className="w-4 h-4 text-yellow" fill="currentColor" />
                    <span className="text-text-dark font-medium">{specificProject.averageScore.toFixed(1)} / 10</span>
                  </div>
                )}
              </div>
              
              {/* Tech Stack */}
              <div className="bg-white rounded-2xl p-6 shadow-soft border border-soft-gray">
                <h3 className="font-heading font-semibold text-lg text-text-dark mb-4">Tech Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {specificProject.techStack.map(tech => (
                    <Badge key={tech} className="bg-sky/20 text-sky px-2 py-1 rounded-full text-xs border-0">
                      <Code className="w-3 h-3 mr-1" />
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {/* Share */}
              <div className="bg-white rounded-2xl p-6 shadow-soft border border-soft-gray">
                <h3 className="font-heading font-semibold text-lg text-text-dark mb-4">Share</h3>
                <Button 
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    // Could show a toast here
                  }}
                  variant="outline" 
                  className="w-full border-coral text-coral hover:bg-coral/10"
                  data-testid="button-copy-link"
                >
                  Copy Link
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream py-8" data-testid="projects-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="font-heading font-bold text-4xl text-text-dark mb-4">Project Gallery</h1>
          <CrayonSquiggle className="mx-auto mb-6" />
          <p className="text-text-muted text-lg">Discover amazing projects built by our community</p>
        </div>
        
        {/* Search and Filters */}
        <div className="bg-white rounded-2xl p-6 shadow-soft mb-8 border border-soft-gray">
          {/* Top Row - Search, Tech, Sort, Reset */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search projects, technologies, or descriptions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-soft-gray rounded-xl focus:ring-2 focus:ring-sky focus:border-transparent"
                  data-testid="input-search-projects"
                />
              </div>
            </div>
            
            <Select value={selectedTech} onValueChange={setSelectedTech}>
              <SelectTrigger className="w-48 border-soft-gray rounded-xl" data-testid="select-tech-stack">
                <SelectValue placeholder="Tech Stack" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Technologies</SelectItem>
                {allTechStack.map(tech => (
                  <SelectItem key={tech} value={tech}>{tech}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48 border-soft-gray rounded-xl" data-testid="select-sort-by">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">Popular</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="title">A-Z</SelectItem>
              </SelectContent>
            </Select>
            
            {hasActiveFilters && (
              <Button
                onClick={resetFilters}
                variant="outline"
                className="border-coral text-coral hover:bg-coral/10 px-6"
                data-testid="button-reset-filters"
              >
                Reset
              </Button>
            )}
          </div>
          
          {/* Tags Row */}
          {allTags.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-text-dark mb-3">Filter by Tags</h3>
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag) => (
                  <Badge
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`cursor-pointer transition-colors px-3 py-2 rounded-full border-0 text-sm ${
                      selectedTags.includes(tag)
                        ? 'bg-sky text-white'
                        : 'bg-soft-gray text-text-dark hover:bg-soft-gray/80'
                    }`}
                    data-testid={`tag-${tag.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-soft border border-soft-gray">
                <Skeleton className="h-4 w-20 mb-4" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-4" />
                <div className="flex gap-2 mb-4">
                  <Skeleton className="h-6 w-12" />
                  <Skeleton className="h-6 w-16" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : projects && projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div 
                key={project.id} 
                onClick={() => setSelectedProject(project)}
                className="cursor-pointer"
                data-testid={`project-card-${project.id}`}
              >
                <ProjectCard project={project} showScore />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="font-heading font-semibold text-xl text-text-dark mb-2">No projects match your filters</h3>
            <p className="text-text-muted mb-6">
              {hasActiveFilters
                ? "Try adjusting your search or filters to see more projects"
                : "Projects will appear here as they are submitted to hackathons"
              }
            </p>
            {hasActiveFilters && (
              <Button 
                onClick={resetFilters}
                className="bg-coral text-white hover:bg-coral/80"
                data-testid="button-clear-filters"
              >
                Reset Filters
              </Button>
            )}
          </div>
        )}

        {/* Project Detail Modal */}
        <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
          <DialogContent className="max-w-4xl bg-white" data-testid="project-detail-modal">
            {selectedProject && (
              <>
                <DialogHeader>
                  <DialogTitle className="font-heading font-bold text-2xl text-text-dark">
                    {selectedProject.title}
                  </DialogTitle>
                  <DialogDescription className="text-text-muted">
                    {selectedProject.tagline}
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {selectedProject.images && selectedProject.images.length > 0 && (
                    <div className="aspect-video rounded-xl overflow-hidden">
                      <img 
                        src={selectedProject.images[0]} 
                        alt={selectedProject.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <div>
                    <p className="text-text-muted mb-4">{selectedProject.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {selectedProject.techStack.slice(0, 6).map(tech => (
                        <Badge key={tech} className="bg-sky/20 text-sky px-2 py-1 rounded-full text-xs border-0">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex gap-3">
                      {selectedProject.demoUrl && (
                        <Button className="bg-coral text-white hover:bg-coral/80" asChild>
                          <a href={selectedProject.demoUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Demo
                          </a>
                        </Button>
                      )}
                      {selectedProject.githubUrl && (
                        <Button variant="outline" className="border-sky text-sky hover:bg-sky/10" asChild>
                          <a href={selectedProject.githubUrl} target="_blank" rel="noopener noreferrer">
                            <Github className="w-4 h-4 mr-2" />
                            Code
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
