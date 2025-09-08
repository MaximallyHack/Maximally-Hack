import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Search, 
  Filter, 
  Users, 
  ExternalLink, 
  Github, 
  Mail, 
  MessageSquare,
  Trophy,
  Medal,
  Award,
  X,
  Plus
} from "lucide-react";
import { api } from "@/lib/api";
import { FloatingElement, CrayonSquiggle } from "@/components/ui/floating-elements";
import { type Project } from "@shared/schema";

const techFilters = [
  "React", "Vue", "Angular", "Node.js", "Python", "JavaScript", "TypeScript", 
  "Go", "Rust", "Java", "Swift", "Kotlin", "Flutter", "React Native",
  "MongoDB", "PostgreSQL", "MySQL", "Firebase", "Supabase"
];

const tagFilters = [
  "AI & ML", "Web Development", "Mobile", "Game Dev", "Data Science", 
  "DevOps", "UI/UX", "Blockchain", "IoT", "AR/VR"
];

const roleFilters = [
  "Frontend Developer", "Backend Developer", "Designer", "Product Manager", 
  "Data Scientist", "DevOps Engineer", "Mobile Developer"
];

const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "popular", label: "Most Popular" },
  { value: "contributors", label: "Looking for Contributors" },
  { value: "winners", label: "Award Winners" }
];

interface ProjectCardProps {
  project: Project & {
    teamCount: number;
    openRolesCount: number;
    isWinner: boolean;
    isFinalist: boolean;
  };
}

function ProjectCard({ project }: ProjectCardProps) {
  const badgeIcons = {
    'Winner': <Trophy className="w-3 h-3" />,
    'Finalist': <Medal className="w-3 h-3" />,
    'People\'s Choice': <Award className="w-3 h-3" />
  };

  return (
    <Card className="bg-white dark:bg-gray-700 shadow-soft border-soft-gray hover-scale transition-all duration-200 group" data-testid={`project-card-${project.id}`}>
      <CardContent className="p-0">
        <div className="aspect-video bg-gradient-to-br from-sky/20 to-mint/20 relative overflow-hidden">
          {project.coverImage && (
            <img 
              src={project.coverImage} 
              alt={project.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
          )}
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            {project.badges?.map((badge) => (
              <Badge 
                key={badge} 
                className={`${
                  badge === 'Winner' || badge === 'Finalist'
                    ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                    : 'bg-yellow text-text-dark'
                } shadow-soft`}
                data-testid={`badge-${badge}`}
              >
                {badgeIcons[badge as keyof typeof badgeIcons]}
                <span className="ml-1">{badge}</span>
              </Badge>
            ))}
          </div>
          
          {project.lookingForContributors && project.openRolesCount > 0 && (
            <Badge className="absolute top-3 right-3 bg-coral text-white">
              Open Roles
            </Badge>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="font-heading font-semibold text-lg text-text-dark dark:text-gray-100 mb-1">
            {project.title}
          </h3>
          <p className="text-sm text-text-muted dark:text-gray-300 mb-3 line-clamp-2">
            {project.oneLiner}
          </p>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-3">
            {project.tags?.slice(0, 3).map((tag) => (
              <Badge key={tag} className="bg-mint/20 text-text-dark dark:text-gray-800 text-xs">
                {tag}
              </Badge>
            ))}
            {project.tags && project.tags.length > 3 && (
              <Badge className="bg-soft-gray text-text-muted dark:text-gray-300 text-xs">
                +{project.tags.length - 3}
              </Badge>
            )}
          </div>
          
          {/* Team and Roles */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Avatar className="w-6 h-6">
                <AvatarImage src={project.ownerAvatar || ""} />
                <AvatarFallback>{project.ownerName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <span className="text-sm text-text-muted dark:text-gray-300">
                {project.ownerName}
              </span>
              {project.teamCount > 1 && (
                <Badge className="bg-sky/20 text-sky text-xs">
                  +{project.teamCount - 1} team
                </Badge>
              )}
            </div>
            
            {project.lookingForContributors && project.openRolesCount > 0 && (
              <Badge className="bg-yellow text-text-dark dark:text-gray-800 text-xs">
                <Users className="w-3 h-3 mr-1" />
                {project.openRolesCount} roles
              </Badge>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-2">
            <Link href={`/projects/${project.id}`}>
              <Button 
                size="sm" 
                className="bg-coral text-white hover:bg-coral/80 flex-1"
                data-testid={`button-view-${project.id}`}
              >
                <ExternalLink className="w-4 h-4 mr-1" />
                View
              </Button>
            </Link>
            
            {project.lookingForContributors && (
              <Button 
                size="sm" 
                variant="outline" 
                className="border-mint text-mint hover:bg-mint/20"
                data-testid={`button-join-${project.id}`}
              >
                <Users className="w-4 h-4 mr-1" />
                Join
              </Button>
            )}
            
            <Button 
              size="sm" 
              variant="outline" 
              className="border-sky text-sky hover:bg-sky/20"
              data-testid={`button-contact-${project.id}`}
            >
              {project.contactMethod === 'email' ? (
                <Mail className="w-4 h-4" />
              ) : (
                <MessageSquare className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ProjectsGallery() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedTech, setSelectedTech] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [lookingForContributors, setLookingForContributors] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Fetch real project submissions from Supabase
  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects', searchQuery, sortBy, selectedTech, selectedTags, selectedRoles, lookingForContributors],
    queryFn: async () => {
      const submissions = await api.getSubmissions();
      
      // Transform submissions to match expected project format
      const transformedProjects = await Promise.all(submissions.map(async (submission: any) => {
        // Get owner info
        const owner = await api.getUser(submission.submitted_by);
        
        return {
          id: submission.id,
          title: submission.title,
          oneLiner: submission.tagline || submission.description?.substring(0, 100) + '...',
          description: submission.description,
          coverImage: submission.images?.[0] || '/api/placeholder/300/200',
          tags: submission.tags || [],
          techStack: submission.tech_stack || [],
          ownerName: owner?.name || 'Anonymous',
          ownerAvatar: owner?.avatar || '/api/placeholder/32/32',
          lookingForContributors: false, // Could add this field to submissions table
          badges: submission.awards || [],
          teamCount: 1, // Could fetch team info if team_id exists
          openRolesCount: 0, // Could implement if needed
          contactMethod: 'email',
          published: submission.status === 'submitted',
          demoUrl: submission.demo_url,
          githubUrl: submission.github_url,
          videoUrl: submission.video_url
        };
      }));
      
      // Apply filters
      let filtered = transformedProjects;
      
      if (searchQuery) {
        filtered = filtered.filter(p => 
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
        );
      }
      
      if (selectedTech.length > 0) {
        filtered = filtered.filter(p => 
          p.techStack.some(tech => selectedTech.includes(tech))
        );
      }
      
      if (selectedTags.length > 0) {
        filtered = filtered.filter(p => 
          p.tags.some(tag => selectedTags.includes(tag))
        );
      }
      
      if (lookingForContributors) {
        filtered = filtered.filter(p => p.lookingForContributors);
      }
      
      // Apply sorting
      switch (sortBy) {
        case 'popular':
          // Could sort by view count or likes if implemented
          break;
        case 'contributors':
          filtered = filtered.filter(p => p.lookingForContributors);
          break;
        case 'winners':
          filtered = filtered.filter(p => p.badges.length > 0);
          break;
        default: // newest
          filtered = filtered.reverse();
      }
      
      return filtered;
    },
  });

  const toggleTechFilter = (tech: string) => {
    setSelectedTech(prev => 
      prev.includes(tech) ? prev.filter(t => t !== tech) : [...prev, tech]
    );
  };

  const toggleTagFilter = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const toggleRoleFilter = (role: string) => {
    setSelectedRoles(prev => 
      prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
    );
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedTech([]);
    setSelectedTags([]);
    setSelectedRoles([]);
    setLookingForContributors(false);
  };

  const activeFiltersCount = selectedTech.length + selectedTags.length + selectedRoles.length + (lookingForContributors ? 1 : 0);

  return (
    <div className="min-h-screen bg-cream py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <FloatingElement>
            <h1 className="font-heading font-bold text-3xl text-text-dark mb-2">
              Project Gallery
            </h1>
          </FloatingElement>
          <CrayonSquiggle className="mb-4" />
          <p className="text-text-muted text-lg mb-6">
            Discover amazing projects and find collaboration opportunities
          </p>
          
          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              <Link href="/publish">
                <Button className="bg-coral text-white hover:bg-coral/80" data-testid="button-publish-project">
                  <Plus className="w-4 h-4 mr-2" />
                  Publish Project
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted w-4 h-4" />
                <Input
                  placeholder="Search projects, tags, or technologies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  data-testid="input-search-projects"
                />
              </div>
            </div>
            
            <div className="flex gap-3">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48" data-testid="select-sort-by">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button
                variant={showFilters ? "default" : "outline"}
                onClick={() => setShowFilters(!showFilters)}
                className={showFilters ? "bg-coral text-white" : ""}
                data-testid="button-toggle-filters"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge className="ml-2 bg-yellow text-text-dark">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </div>
          </div>

          {/* Active Filters */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm text-text-muted">Active filters:</span>
              {selectedTech.map(tech => (
                <Badge 
                  key={tech} 
                  className="bg-sky text-white cursor-pointer"
                  onClick={() => toggleTechFilter(tech)}
                  data-testid={`active-filter-tech-${tech}`}
                >
                  {tech} <X className="w-3 h-3 ml-1" />
                </Badge>
              ))}
              {selectedTags.map(tag => (
                <Badge 
                  key={tag} 
                  className="bg-mint text-text-dark cursor-pointer"
                  onClick={() => toggleTagFilter(tag)}
                  data-testid={`active-filter-tag-${tag}`}
                >
                  {tag} <X className="w-3 h-3 ml-1" />
                </Badge>
              ))}
              {lookingForContributors && (
                <Badge 
                  className="bg-coral text-white cursor-pointer"
                  onClick={() => setLookingForContributors(false)}
                  data-testid="active-filter-contributors"
                >
                  Looking for Contributors <X className="w-3 h-3 ml-1" />
                </Badge>
              )}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearAllFilters}
                data-testid="button-clear-filters"
              >
                Clear all
              </Button>
            </div>
          )}

          {/* Filter Panel */}
          {showFilters && (
            <Card className="bg-white shadow-soft border-soft-gray p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Technologies */}
                <div>
                  <Label className="font-medium mb-3 block">Technologies</Label>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {techFilters.map(tech => (
                      <div key={tech} className="flex items-center space-x-2">
                        <Checkbox
                          id={`tech-${tech}`}
                          checked={selectedTech.includes(tech)}
                          onCheckedChange={() => toggleTechFilter(tech)}
                          data-testid={`filter-tech-${tech}`}
                        />
                        <Label htmlFor={`tech-${tech}`} className="text-sm cursor-pointer">
                          {tech}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <Label className="font-medium mb-3 block">Categories</Label>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {tagFilters.map(tag => (
                      <div key={tag} className="flex items-center space-x-2">
                        <Checkbox
                          id={`tag-${tag}`}
                          checked={selectedTags.includes(tag)}
                          onCheckedChange={() => toggleTagFilter(tag)}
                          data-testid={`filter-tag-${tag}`}
                        />
                        <Label htmlFor={`tag-${tag}`} className="text-sm cursor-pointer">
                          {tag}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Other Filters */}
                <div>
                  <Label className="font-medium mb-3 block">Looking For</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="contributors"
                        checked={lookingForContributors}
                        onCheckedChange={(checked) => setLookingForContributors(checked === true)}
                        data-testid="filter-looking-for-contributors"
                      />
                      <Label htmlFor="contributors" className="text-sm cursor-pointer">
                        Open to Contributors
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="bg-white shadow-soft border-soft-gray">
                <CardContent className="p-0">
                  <Skeleton className="aspect-video w-full" />
                  <div className="p-4">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-3" />
                    <div className="flex gap-2 mb-3">
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-6 w-20" />
                    </div>
                    <div className="flex justify-between">
                      <Skeleton className="h-8 w-20" />
                      <Skeleton className="h-8 w-16" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : projects && projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project as any} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="font-heading font-semibold text-xl text-text-dark mb-2">
              No projects match your filters
            </h3>
            <p className="text-text-muted mb-6">
              Try clearing some filters or searching for something else.
            </p>
            <Button 
              onClick={clearAllFilters}
              className="bg-coral text-white hover:bg-coral/80"
              data-testid="button-clear-all-filters"
            >
              Clear All Filters
            </Button>
          </div>
        )}

        {projects && projects.length > 0 && (
          <div className="text-center mt-12">
            <p className="text-text-muted mb-4">
              Showing {projects.length} project{projects.length !== 1 ? 's' : ''}
            </p>
            <Button 
              variant="outline" 
              className="border-mint text-mint hover:bg-mint/20"
              data-testid="button-load-more"
            >
              Load More Projects
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}