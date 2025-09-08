import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Search, Filter, Users, Calendar, MapPin, ArrowLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api, type Team, type User } from "@/lib/supabaseApi";

interface FilterOptions {
  search: string;
  teamSize: string;
  skills: string[];
  status: string;
  tags: string[];
}

const allSkills = ["React", "TypeScript", "Python", "Node.js", "UI/UX Design", "Machine Learning", "Mobile Development", "Backend Development"];
const allTags = ["AI", "HealthTech", "FinTech", "Sustainability", "Education", "Gaming", "Social Impact", "Developer Tools"];

export default function FindTeam() {
  const [, navigate] = useLocation();
  const [filteredTeams, setFilteredTeams] = useState<Team[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({
    search: "",
    teamSize: "all",
    skills: [],
    status: "all",
    tags: []
  });
  const [showFilters, setShowFilters] = useState(false);

  const { data: teams = [], isLoading } = useQuery({
    queryKey: ['teams'],
    queryFn: async () => {
      const allTeams = await api.getTeams();
      return allTeams.filter((team: any) => team.status === 'recruiting');
    }
  });

  useEffect(() => {
    // Apply filters
    let filtered = teams;

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter((team: any) =>
        team.name.toLowerCase().includes(searchTerm) ||
        (team.description || '').toLowerCase().includes(searchTerm)
      );
    }

    // Team size filter
    if (filters.teamSize !== "all") {
      const [min, max] = filters.teamSize.split("-").map(n => parseInt(n));
      filtered = filtered.filter((team: any) => {
        const availableSpots = (team.max_size || team.maxSize || 4) - (team.members?.length || 0);
        if (max) {
          return availableSpots >= min && availableSpots <= max;
        }
        return availableSpots >= min;
      });
    }

    // Skills filter
    if (filters.skills.length > 0) {
      filtered = filtered.filter((team: any) =>
        filters.skills.some(skill => (team.skills || []).includes(skill))
      );
    }

    // Status filter
    if (filters.status !== "all") {
      filtered = filtered.filter((team: any) => team.status === filters.status);
    }

    // Tags filter
    if (filters.tags.length > 0) {
      filtered = filtered.filter((team: any) =>
        filters.tags.some(tag => (team.track && [team.track].includes(tag)))
      );
    }

    setFilteredTeams(filtered);
  }, [teams, filters]);

  const toggleSkillFilter = (skill: string) => {
    setFilters(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const toggleTagFilter = (tag: string) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      teamSize: "all",
      skills: [],
      status: "all",
      tags: []
    });
  };

  const getTeamLeader = (team: any): User | undefined => {
    // For now, return a basic leader object
    return team.members?.find((member: any) => member.id === team.leader_id);
  };

  const getAvailableSpots = (team: any) => {
    return (team.max_size || team.maxSize || 4) - (team.members?.length || 0);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/teams')} className="text-coral hover:text-coral/80" data-testid="button-back">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Teams
          </Button>
        </div>
        <h1 className="text-3xl font-heading font-bold text-foreground mb-2">Find Your Perfect Team</h1>
        <p className="text-muted-foreground">Discover teams that match your skills and interests</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <div className="lg:col-span-1 space-y-6">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden">
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
              onClick={() => setShowFilters(!showFilters)}
              data-testid="button-toggle-filters"
            >
              <Filter className="w-4 h-4" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>
          </div>

          <div className={`space-y-6 ${showFilters || 'max-lg:hidden'}`}>
            {/* Search */}
            <Card data-testid="search-section">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Search className="w-5 h-5 text-coral" />
                  Search
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  placeholder="Search teams..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="w-full"
                  data-testid="input-search"
                />
              </CardContent>
            </Card>

            {/* Team Size Filter */}
            <Card data-testid="team-size-section">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="w-5 h-5 text-mint" />
                  Available Spots
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={filters.teamSize} onValueChange={(value) => setFilters(prev => ({ ...prev, teamSize: value }))}>
                  <SelectTrigger data-testid="select-team-size">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Teams</SelectItem>
                    <SelectItem value="1-1">1 spot available</SelectItem>
                    <SelectItem value="2-2">2 spots available</SelectItem>
                    <SelectItem value="3-5">3+ spots available</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Status Filter */}
            <Card data-testid="status-section">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-sky" />
                  Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger data-testid="select-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="recruiting">Recruiting</SelectItem>
                    <SelectItem value="full">Full</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Skills Filter */}
            <Card data-testid="skills-section">
              <CardHeader>
                <CardTitle className="text-lg">Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {allSkills.map(skill => (
                    <Button
                      key={skill}
                      variant={filters.skills.includes(skill) ? "default" : "outline"}
                      size="sm"
                      className={`text-xs ${filters.skills.includes(skill) ? 'bg-coral hover:bg-coral/90' : 'border-coral/20 text-coral hover:bg-coral/10'}`}
                      onClick={() => toggleSkillFilter(skill)}
                      data-testid={`skill-filter-${skill}`}
                    >
                      {skill}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tags Filter */}
            <Card data-testid="tags-section">
              <CardHeader>
                <CardTitle className="text-lg">Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {allTags.map(tag => (
                    <Button
                      key={tag}
                      variant={filters.tags.includes(tag) ? "default" : "outline"}
                      size="sm"
                      className={`text-xs ${filters.tags.includes(tag) ? 'bg-mint hover:bg-mint/90' : 'border-mint/20 text-mint hover:bg-mint/10'}`}
                      onClick={() => toggleTagFilter(tag)}
                      data-testid={`tag-filter-${tag}`}
                    >
                      {tag}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Clear Filters */}
            <Button variant="outline" onClick={clearFilters} className="w-full" data-testid="button-clear-filters">
              Clear All Filters
            </Button>
          </div>
        </div>

        {/* Teams Grid */}
        <div className="lg:col-span-3">
          {/* Results Header */}
          <div className="flex items-center justify-between mb-6" data-testid="results-header">
            <h2 className="text-xl font-semibold">
              {filteredTeams.length} {filteredTeams.length === 1 ? 'team' : 'teams'} found
            </h2>
            <div className="flex gap-2">
              <Link to="/teams/create" data-testid="button-create-team">
                <Button className="bg-coral hover:bg-coral/90">
                  Create Team
                </Button>
              </Link>
            </div>
          </div>

          {/* Teams Grid */}
          <div className="space-y-6">
            {filteredTeams.length === 0 ? (
              <Card className="p-12 text-center" data-testid="empty-state">
                <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No teams found</h3>
                <p className="text-muted-foreground mb-4">Try adjusting your filters or create your own team</p>
                <div className="flex gap-2 justify-center">
                  <Button variant="outline" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                  <Link to="/teams/create">
                    <Button className="bg-coral hover:bg-coral/90">
                      Create Team
                    </Button>
                  </Link>
                </div>
              </Card>
            ) : (
              filteredTeams.map(team => {
                const leader = getTeamLeader(team);
                const availableSpots = getAvailableSpots(team);
                
                return (
                  <Card key={team.id} className="hover:shadow-md transition-shadow" data-testid={`team-card-${team.id}`}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Link to={`/teams/${team.id}`} className="text-xl font-semibold text-foreground hover:text-coral transition-colors">
                              {team.name}
                            </Link>
                            <Badge variant={team.status === 'recruiting' ? 'default' : 'secondary'} className="bg-mint/10 text-mint">
                              {team.status === 'recruiting' ? `${availableSpots} spots available` : 'Full'}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground mb-3 line-clamp-2">{team.description}</p>
                          {team.projectIdea && (
                            <p className="text-sm text-foreground mb-3 bg-sky/5 p-3 rounded-lg border border-sky/10">
                              <strong>Project:</strong> {team.projectIdea}
                            </p>
                          )}
                        </div>
                        <Link to={`/teams/${team.id}`}>
                          <Button className="bg-coral hover:bg-coral/90" data-testid={`button-view-${team.id}`}>
                            View Team
                          </Button>
                        </Link>
                      </div>

                      {/* Team Info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h4 className="text-sm font-medium text-foreground mb-2">Team Lead</h4>
                          <div className="flex items-center gap-2">
                            <Avatar className="w-6 h-6">
                              <AvatarFallback className="text-xs bg-gradient-to-br from-coral to-coral/80 text-white">
                                {leader?.avatar}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-muted-foreground">{leader?.fullName}</span>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-foreground mb-2">Team Size</h4>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">{team.members.length}/{team.maxSize} members</span>
                          </div>
                        </div>
                      </div>

                      {/* Skills */}
                      {team.requiredSkills.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-foreground mb-2">Required Skills</h4>
                          <div className="flex flex-wrap gap-2">
                            {team.requiredSkills.slice(0, 4).map(skill => (
                              <Badge key={skill} variant="secondary" className="bg-coral/10 text-coral text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {team.requiredSkills.length > 4 && (
                              <Badge variant="secondary" className="text-xs">+{team.requiredSkills.length - 4} more</Badge>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Looking For */}
                      {team.lookingForRoles.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-foreground mb-2">Looking For</h4>
                          <div className="flex flex-wrap gap-2">
                            {team.lookingForRoles.slice(0, 3).map(role => (
                              <Badge key={role} variant="secondary" className="bg-mint/10 text-mint text-xs">
                                {role}
                              </Badge>
                            ))}
                            {team.lookingForRoles.length > 3 && (
                              <Badge variant="secondary" className="text-xs">+{team.lookingForRoles.length - 3} more</Badge>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Tags */}
                      {team.tags.length > 0 && (
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-2">
                            {team.tags.slice(0, 3).map(tag => (
                              <Badge key={tag} variant="outline" className="border-sky/20 text-sky text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {team.tags.length > 3 && (
                              <Badge variant="outline" className="text-xs">+{team.tags.length - 3} more</Badge>
                            )}
                          </div>
                        </div>
                      )}

                      <Separator className="my-4" />

                      {/* Actions */}
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          Last activity: {new Date(team.lastActivity).toLocaleDateString()}
                        </span>
                        <div className="flex gap-2">
                          <Link to={`/teams/${team.id}/apply`}>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="border-mint text-mint hover:bg-mint/10"
                              disabled={team.status !== 'recruiting'}
                              data-testid={`button-apply-${team.id}`}
                            >
                              {team.status === 'recruiting' ? 'Apply to Join' : 'Team Full'}
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}