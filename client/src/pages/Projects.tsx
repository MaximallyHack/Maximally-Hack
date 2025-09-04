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
  const [selectedTech, setSelectedTech] = useState<string>("");
  const [sortBy, setSortBy] = useState("score");
  const [selectedProject, setSelectedProject] = useState<Submission | null>(null);

  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects', searchQuery, selectedTech, sortBy],
    queryFn: async () => {
      let projects = await api.getFeaturedProjects();
      
      // Filter by search query
      if (searchQuery) {
        projects = projects.filter(p => 
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.techStack.some(tech => tech.toLowerCase().includes(searchQuery.toLowerCase()))
        );
      }
      
      // Filter by tech stack
      if (selectedTech) {
        projects = projects.filter(p => p.techStack.includes(selectedTech));
      }
      
      // Sort projects
      switch (sortBy) {
        case 'score':
          projects.sort((a, b) => (b.averageScore || 0) - (a.averageScore || 0));
          break;
        case 'date':
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

  // Get unique tech stack options
  const allTechStack = projects ? Array.from(new Set(projects.flatMap(p => p.techStack))) : [];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (id && specificProject) {
    return (
      <div className="min-h-screen bg-cream py-8" data-testid="project-detail-page">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Project Hero */}
          <div className="bg-white rounded-2xl p-8 shadow-soft border border-soft-gray mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <h1 className="font-heading font-bold text-3xl text-text-dark">{specificProject.title}</h1>
                  {specificProject.awards && specificProject.awards.length > 0 && (
                    <Badge className="bg-coral/20 text-coral px-3 py-1 rounded-full text-sm border-0">
                      <Trophy className="w-3 h-3 mr-1" />
                      {specificProject.awards[0]}
                    </Badge>
                  )}
                </div>
                
                <p className="text-lg text-text-muted mb-6">{specificProject.tagline}</p>
                
                <div className="flex items-center gap-4 mb-6">
                  {specificProject.averageScore && (
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow" fill="currentColor" />
                      <span className="font-medium">{specificProject.averageScore.toFixed(1)}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1 text-text-muted text-sm">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(specificProject.submittedAt)}</span>
                  </div>
                  <Badge className="bg-mint/20 text-mint px-2 py-1 rounded-full text-sm border-0">
                    {specificProject.track}
                  </Badge>
                </div>

                <div className="flex gap-3">
                  {specificProject.demoUrl && (
                    <Button className="bg-coral text-white hover:bg-coral/80" asChild>
                      <a href={specificProject.demoUrl} target="_blank" rel="noopener noreferrer" data-testid="button-view-demo">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Demo
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

              {specificProject.images && specificProject.images.length > 0 && (
                <div className="aspect-video rounded-xl overflow-hidden">
                  <img 
                    src={specificProject.images[0]} 
                    alt={specificProject.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Project Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl p-8 shadow-soft border border-soft-gray mb-8">
                <h2 className="font-heading font-bold text-2xl text-text-dark mb-4">About the Project</h2>
                <p className="text-text-muted mb-6">{specificProject.longDescription}</p>
                
                {specificProject.features && specificProject.features.length > 0 && (
                  <>
                    <h3 className="font-heading font-semibold text-xl text-text-dark mb-4">Key Features</h3>
                    <ul className="space-y-2">
                      {specificProject.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-success rounded-full mt-2"></div>
                          <span className="text-text-muted">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </div>

            <div>
              <div className="bg-white rounded-2xl p-6 shadow-soft border border-soft-gray mb-6">
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

              <div className="bg-white rounded-2xl p-6 shadow-soft border border-soft-gray">
                <h3 className="font-heading font-semibold text-lg text-text-dark mb-4">Team</h3>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-text-muted" />
                  <span className="text-text-muted text-sm">Team information will be available soon</span>
                </div>
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
          <div className="flex flex-col lg:flex-row gap-4">
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
                <SelectItem value="">All Technologies</SelectItem>
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
                <SelectItem value="score">Sort by Score</SelectItem>
                <SelectItem value="date">Sort by Date</SelectItem>
                <SelectItem value="title">Sort by Title</SelectItem>
              </SelectContent>
            </Select>
          </div>
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
            <h3 className="font-heading font-semibold text-xl text-text-dark mb-2">No projects found</h3>
            <p className="text-text-muted mb-6">
              {searchQuery || selectedTech 
                ? "Try adjusting your search or filters"
                : "Projects will appear here as they are submitted"
              }
            </p>
            <Button 
              onClick={() => {
                setSearchQuery("");
                setSelectedTech("");
              }}
              className="bg-coral text-white hover:bg-coral/80"
              data-testid="button-clear-filters"
            >
              Clear Filters
            </Button>
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
