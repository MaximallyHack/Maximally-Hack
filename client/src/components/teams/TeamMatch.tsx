import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Users, ArrowLeft, Heart, X, Zap, Filter,
  Calendar, MapPin, Code, Palette, Brain, Target 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/supabaseApi";

// Mock team match interface
interface TeamMatch {
  id: string;
  name: string;
  description: string;
  lookingFor: string[];
  skills: string[];
  eventName?: string;
  eventId?: string;
  leaderId: string;
  leaderName: string;
  leaderAvatar?: string;
  membersCount: number;
  maxSize: number;
  track?: string;
  matchScore: number; // 0-100
  compatibility: {
    skillsMatch: number;
    roleMatch: number;
    eventMatch: boolean;
  };
  created: string;
}

export default function TeamMatch() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedTeams, setLikedTeams] = useState<string[]>([]);
  const [passedTeams, setPassedTeams] = useState<string[]>([]);
  
  // Filters
  const [filters, setFilters] = useState({
    skills: [] as string[],
    roles: [] as string[],
    eventType: 'all',
    minMembers: 1,
    maxMembers: 10
  });
  
  const [showFilters, setShowFilters] = useState(false);

  // Get user skills from profile
  const userSkills = user?.skills || [];
  const userPreferredRoles = ['Frontend Developer', 'UI/UX Designer']; // Could be from user profile

  // Get available teams for matching
  const { data: allTeams = [], isLoading: teamsLoading } = useQuery({
    queryKey: ['teams'],
    queryFn: () => api.getTeams(),
    enabled: !!user
  });

  // Simple matching algorithm
  const calculateMatchScore = (team: any) => {
    if (!user) return 0;
    
    const teamSkills = team.requiredSkills || team.skills || [];
    const teamRoles = team.lookingForRoles || team.looking_for || [];
    
    // Skills match (0-50 points)
    const skillsIntersection = userSkills.filter(skill => teamSkills.includes(skill));
    const skillsMatch = teamSkills.length > 0 ? (skillsIntersection.length / teamSkills.length) * 50 : 25;
    
    // Role match (0-30 points)
    const rolesIntersection = userPreferredRoles.filter(role => teamRoles.includes(role));
    const roleMatch = teamRoles.length > 0 ? (rolesIntersection.length / teamRoles.length) * 30 : 15;
    
    // Team not full (20 points)
    const sizeBonus = (team.members?.length || 0) < (team.maxSize || team.max_size || 4) ? 20 : 0;
    
    return Math.round(skillsMatch + roleMatch + sizeBonus);
  };

  // Filter and rank teams by match score
  const teamMatches = allTeams
    .filter(team => 
      team.status === 'recruiting' && 
      team.leaderId !== user?.id && 
      team.leader_id !== user?.id &&
      !team.members?.some((member: any) => member.id === user?.id)
    )
    .map(team => ({
      ...team,
      matchScore: calculateMatchScore(team),
      compatibility: {
        skillsMatch: Math.round(((userSkills.filter(skill => 
          (team.requiredSkills || team.skills || []).includes(skill)).length) / 
          Math.max((team.requiredSkills || team.skills || []).length, 1)) * 100),
        roleMatch: Math.round(((userPreferredRoles.filter(role => 
          (team.lookingForRoles || team.looking_for || []).includes(role)).length) / 
          Math.max((team.lookingForRoles || team.looking_for || []).length, 1)) * 100),
        eventMatch: true // For now, assume all teams are event matches
      }
    }))
    .sort((a, b) => b.matchScore - a.matchScore);

  // Filter teams based on user actions and filters
  const availableTeams = teamMatches.filter(team => 
    !likedTeams.includes(team.id) && 
    !passedTeams.includes(team.id)
  );

  const currentTeam = availableTeams[currentIndex];
  const hasMoreTeams = currentIndex < availableTeams.length - 1;

  const handleLike = async (team: any) => {
    if (!user) {
      toast({ title: "Error", description: "Please log in to match with teams", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      // Send application to the team
      await api.applyToTeam(team.id, `I'm interested in joining your team! I have ${userSkills.length > 0 ? userSkills.join(', ') : 'relevant'} skills that could contribute to your project.`, userSkills);
      
      setLikedTeams(prev => [...prev, team.id]);
      
      toast({ 
        title: "Application Sent!", 
        description: `Your application has been sent to ${team.name}. They'll review it soon!`,
        duration: 2000
      });
      
      // Move to next team
      if (hasMoreTeams) {
        setCurrentIndex(prev => prev + 1);
      }
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to send application", 
        variant: "destructive" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePass = () => {
    if (!currentTeam) return;
    
    setPassedTeams(prev => [...prev, currentTeam.id]);
    
    if (hasMoreTeams) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const getMatchColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getMatchLabel = (score: number) => {
    if (score >= 85) return 'Excellent Match';
    if (score >= 70) return 'Good Match';
    if (score >= 50) return 'Fair Match';
    return 'Poor Match';
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    }
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Link to="/teams">
            <Button variant="ghost" size="sm" className="text-coral hover:text-coral/80">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Teams
            </Button>
          </Link>
        </div>
        <h1 className="text-3xl font-heading font-bold text-foreground mb-2">Smart Team Matching</h1>
        <p className="text-muted-foreground">Discover teams that match your skills and interests</p>
      </div>

      {teamsLoading ? (
        <Card className="text-center py-12">
          <CardContent>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-coral mx-auto mb-4"></div>
            <p className="text-muted-foreground">Finding your perfect team matches...</p>
          </CardContent>
        </Card>
      ) : availableTeams.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Zap className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">All caught up!</h3>
            <p className="text-muted-foreground mb-6">
              You've seen all available teams. Check back later for new matches or explore teams manually.
            </p>
            <div className="flex gap-2 justify-center">
              <Link to="/teams/find">
                <Button>Browse All Teams</Button>
              </Link>
              <Button 
                variant="outline" 
                onClick={() => {
                  setCurrentIndex(0);
                  setLikedTeams([]);
                  setPassedTeams([]);
                }}
              >
                Reset Matches
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : currentTeam ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main matching card */}
          <div className="lg:col-span-3">
            <Card className="overflow-hidden">
              <div className="relative">
                {/* Match score indicator */}
                <div className="absolute top-4 right-4 z-10">
                  <Badge className={`${getMatchColor(currentTeam.matchScore)} bg-white/90 backdrop-blur-sm`}>
                    <Zap className="w-3 h-3 mr-1" />
                    {currentTeam.matchScore}% Match
                  </Badge>
                </div>
                
                <div className="bg-gradient-to-br from-coral/10 to-sky/10 p-6 pb-0">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-16 h-16 ring-2 ring-white">
                      <AvatarFallback className="bg-coral text-white text-lg">
                        {currentTeam.name?.[0] || '?'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-foreground mb-1">{currentTeam.name}</h2>
                      <p className="text-sm text-muted-foreground mb-2">
                        {(currentTeam.members?.length || 0)}/{currentTeam.maxSize || currentTeam.max_size || 4} members • 
                        Created {formatTimeAgo(currentTeam.created_at || new Date().toISOString())}
                      </p>
                      {currentTeam.track && (
                        <div className="flex items-center gap-1 text-sm text-coral font-medium">
                          <Calendar className="w-4 h-4" />
                          <span>{currentTeam.track}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <CardContent className="p-6">
                <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
                  {currentTeam.description}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Looking for */}
                  <div>
                    <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                      <Target className="w-4 h-4 text-coral" />
                      Looking For
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {(currentTeam.lookingForRoles || currentTeam.looking_for || []).map((role) => {
                        const isMatch = userPreferredRoles.includes(role);
                        return (
                          <Badge 
                            key={role} 
                            variant={isMatch ? "default" : "secondary"}
                            className={isMatch ? "bg-coral text-white" : ""}
                          >
                            {isMatch && <Heart className="w-3 h-3 mr-1" />}
                            {role}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* Skills */}
                  <div>
                    <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                      <Code className="w-4 h-4 text-mint" />
                      Tech Stack
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {(currentTeam.requiredSkills || currentTeam.skills || []).map((skill) => {
                        const isMatch = userSkills.includes(skill);
                        return (
                          <Badge 
                            key={skill} 
                            variant={isMatch ? "default" : "outline"}
                            className={isMatch ? "bg-mint text-white" : ""}
                          >
                            {isMatch && <Zap className="w-3 h-3 mr-1" />}
                            {skill}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                </div>
                
                {/* Match details */}
                <div className="bg-muted/30 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-foreground mb-3">Why This Match?</h3>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className={`text-2xl font-bold ${getMatchColor(currentTeam.compatibility.skillsMatch)}`}>
                        {currentTeam.compatibility.skillsMatch}%
                      </div>
                      <div className="text-xs text-muted-foreground">Skills Match</div>
                    </div>
                    <div>
                      <div className={`text-2xl font-bold ${getMatchColor(currentTeam.compatibility.roleMatch)}`}>
                        {currentTeam.compatibility.roleMatch}%
                      </div>
                      <div className="text-xs text-muted-foreground">Role Match</div>
                    </div>
                    <div>
                      <div className={`text-2xl font-bold ${currentTeam.compatibility.eventMatch ? 'text-green-600' : 'text-gray-400'}`}>
                        {currentTeam.compatibility.eventMatch ? '✓' : '—'}
                      </div>
                      <div className="text-xs text-muted-foreground">Event Match</div>
                    </div>
                  </div>
                </div>
                
                {/* Action buttons */}
                <div className="flex gap-4 justify-center">
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={handlePass}
                    className="flex-1 max-w-32 h-14 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="w-6 h-6" />
                  </Button>
                  
                  <Link to={`/teams/${currentTeam.id}`} className="flex-1 max-w-32">
                    <Button variant="outline" size="lg" className="w-full h-14">
                      <Users className="w-6 h-6" />
                    </Button>
                  </Link>
                  
                  <Button
                    size="lg"
                    onClick={() => handleLike(currentTeam)}
                    disabled={isLoading}
                    className="flex-1 max-w-32 h-14 bg-coral hover:bg-coral/90"
                  >
                    <Heart className="w-6 h-6" />
                  </Button>
                </div>
                
                <div className="text-center mt-4 text-sm text-muted-foreground">
                  {currentIndex + 1} of {availableTeams.length} teams
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Teams Viewed</span>
                    <span>{currentIndex + 1}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Interested</span>
                    <span className="text-coral">{likedTeams.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Passed</span>
                    <span className="text-muted-foreground">{passedTeams.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Your Profile */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Your Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm font-medium mb-1">Looking For</div>
                    <div className="flex flex-wrap gap-1">
                      {userPreferredRoles.slice(0, 2).map(role => (
                        <Badge key={role} variant="secondary" className="text-xs">
                          {role}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium mb-1">Skills</div>
                    <div className="flex flex-wrap gap-1">
                      {userSkills.slice(0, 3).map(skill => (
                        <Badge key={skill} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link to="/teams/find">
                  <Button variant="outline" size="sm" className="w-full">
                    Browse All Teams
                  </Button>
                </Link>
                <Link to="/teams/create">
                  <Button variant="outline" size="sm" className="w-full">
                    Create Team
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <Card className="text-center py-12">
          <CardContent>
            <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No teams available</h3>
            <p className="text-muted-foreground mb-6">
              There are no teams available for matching right now. Check back later!
            </p>
            <Link to="/teams/find">
              <Button>Browse All Teams</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
