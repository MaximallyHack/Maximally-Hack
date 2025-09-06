import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Users, MessageCircle, Search, Plus, ArrowLeft, Crown, Clock } from "lucide-react";
import teamsData, { type LFGPost, type User, type Team } from "@/lib/fixtures/teamsData";

const currentUserId = "1"; // Mock current user

export default function TeamsLFG() {
  const [, navigate] = useLocation();
  const [lfgPosts, setLfgPosts] = useState<LFGPost[]>([]);
  const [individualPosts, setIndividualPosts] = useState<LFGPost[]>([]);
  const [teamPosts, setTeamPosts] = useState<LFGPost[]>([]);

  useEffect(() => {
    const posts = teamsData.lfgPosts.filter(post => post.status === 'active');
    setLfgPosts(posts);
    setIndividualPosts(posts.filter(post => post.type === 'individual'));
    setTeamPosts(posts.filter(post => post.type === 'team'));
  }, []);

  const getUser = (userId: string): User | undefined => {
    return teamsData.users.find(user => user.id === userId);
  };

  const getTeam = (teamId: string): Team | undefined => {
    return teamsData.teams.find(team => team.id === teamId);
  };

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    }
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const IndividualPostCard = ({ post }: { post: LFGPost }) => {
    const user = post.userId ? getUser(post.userId) : null;
    
    return (
      <Card className="hover:shadow-md transition-shadow" data-testid={`individual-post-${post.id}`}>
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Avatar className="w-12 h-12">
              <AvatarFallback className="bg-gradient-to-br from-coral to-coral/80 text-white font-semibold">
                {user?.avatar}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-foreground">{post.title}</h3>
                <Badge className="bg-mint/10 text-mint">Individual</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-1">{user?.fullName} • @{user?.username}</p>
              <p className="text-foreground mb-4">{post.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {post.skills && post.skills.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-2">Skills</h4>
                    <div className="flex flex-wrap gap-1">
                      {post.skills.slice(0, 3).map(skill => (
                        <Badge key={skill} variant="secondary" className="bg-coral/10 text-coral text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {post.skills.length > 3 && (
                        <Badge variant="secondary" className="text-xs">+{post.skills.length - 3}</Badge>
                      )}
                    </div>
                  </div>
                )}
                {post.preferredRoles && post.preferredRoles.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-2">Preferred Roles</h4>
                    <div className="flex flex-wrap gap-1">
                      {post.preferredRoles.slice(0, 2).map(role => (
                        <Badge key={role} variant="secondary" className="bg-mint/10 text-mint text-xs">
                          {role}
                        </Badge>
                      ))}
                      {post.preferredRoles.length > 2 && (
                        <Badge variant="secondary" className="text-xs">+{post.preferredRoles.length - 2}</Badge>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{formatTimeAgo(post.postedAt)}</span>
                  {post.availability && (
                    <>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-sm text-muted-foreground">{post.availability}</span>
                    </>
                  )}
                </div>
                <Button size="sm" className="bg-coral hover:bg-coral/90" data-testid={`button-contact-${post.id}`}>
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Contact
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const TeamPostCard = ({ post }: { post: LFGPost }) => {
    const team = post.teamId ? getTeam(post.teamId) : null;
    const teamLeader = team ? getUser(team.leaderId) : null;
    
    return (
      <Card className="hover:shadow-md transition-shadow" data-testid={`team-post-${post.id}`}>
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-foreground">{post.title}</h3>
                <Badge className="bg-sky/10 text-sky">Team</Badge>
              </div>
              
              {team && (
                <div className="flex items-center gap-2 mb-3">
                  <Link to={`/teams/${team.id}`} className="text-coral hover:text-coral/80 font-medium">
                    {team.name}
                  </Link>
                  <span className="text-muted-foreground">•</span>
                  <div className="flex items-center gap-1">
                    <Avatar className="w-5 h-5">
                      <AvatarFallback className="text-xs bg-gradient-to-br from-coral to-coral/80 text-white">
                        {teamLeader?.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-muted-foreground">{teamLeader?.fullName}</span>
                    <Crown className="w-3 h-3 text-yellow" />
                  </div>
                </div>
              )}
              
              <p className="text-foreground mb-4">{post.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {post.skills && post.skills.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-2">Required Skills</h4>
                    <div className="flex flex-wrap gap-1">
                      {post.skills.slice(0, 3).map(skill => (
                        <Badge key={skill} variant="secondary" className="bg-coral/10 text-coral text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {post.skills.length > 3 && (
                        <Badge variant="secondary" className="text-xs">+{post.skills.length - 3}</Badge>
                      )}
                    </div>
                  </div>
                )}
                {post.lookingFor && post.lookingFor.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-2">Looking For</h4>
                    <div className="flex flex-wrap gap-1">
                      {post.lookingFor.slice(0, 2).map(role => (
                        <Badge key={role} variant="secondary" className="bg-mint/10 text-mint text-xs">
                          {role}
                        </Badge>
                      ))}
                      {post.lookingFor.length > 2 && (
                        <Badge variant="secondary" className="text-xs">+{post.lookingFor.length - 2}</Badge>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              {team && (
                <Link to={`/teams/${team.id}`}>
                  <Button size="sm" variant="outline" className="border-sky text-sky hover:bg-sky/10" data-testid={`button-view-team-${post.id}`}>
                    View Team
                  </Button>
                </Link>
              )}
              <Link to={`/teams/${post.teamId}/apply`}>
                <Button size="sm" className="bg-coral hover:bg-coral/90" data-testid={`button-apply-team-${post.id}`}>
                  Apply to Join
                </Button>
              </Link>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Posted {formatTimeAgo(post.postedAt)}</span>
              {team && (
                <>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-sm text-muted-foreground">{team.members.length}/{team.maxSize} members</span>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/teams')} className="text-coral hover:text-coral/80" data-testid="button-back">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Teams
          </Button>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-heading font-bold text-foreground mb-2">Looking for Group</h1>
            <p className="text-muted-foreground">Find teammates or discover individuals looking to join teams</p>
          </div>
          <Button className="bg-coral hover:bg-coral/90" data-testid="button-create-post">
            <Plus className="w-4 h-4 mr-2" />
            Create Post
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-coral/5 to-coral/10 border-coral/20" data-testid="stat-total-posts">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Posts</p>
                <p className="text-2xl font-bold text-coral">{lfgPosts.length}</p>
              </div>
              <MessageCircle className="w-8 h-8 text-coral" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-mint/5 to-mint/10 border-mint/20" data-testid="stat-individuals">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Individuals</p>
                <p className="text-2xl font-bold text-mint">{individualPosts.length}</p>
              </div>
              <Users className="w-8 h-8 text-mint" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-sky/5 to-sky/10 border-sky/20" data-testid="stat-teams">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Teams</p>
                <p className="text-2xl font-bold text-sky">{teamPosts.length}</p>
              </div>
              <Search className="w-8 h-8 text-sky" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* LFG Posts */}
      <Tabs defaultValue="all" className="space-y-6" data-testid="lfg-tabs">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all" data-testid="tab-all">All Posts ({lfgPosts.length})</TabsTrigger>
          <TabsTrigger value="individuals" data-testid="tab-individuals">Individuals ({individualPosts.length})</TabsTrigger>
          <TabsTrigger value="teams" data-testid="tab-teams">Teams ({teamPosts.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6" data-testid="tab-content-all">
          {lfgPosts.length === 0 ? (
            <Card className="p-12 text-center" data-testid="empty-all-state">
              <MessageCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
              <p className="text-muted-foreground mb-4">Be the first to post in the LFG board!</p>
              <Button className="bg-coral hover:bg-coral/90">
                Create First Post
              </Button>
            </Card>
          ) : (
            <div className="space-y-6">
              {lfgPosts.map(post => 
                post.type === 'individual' 
                  ? <IndividualPostCard key={post.id} post={post} />
                  : <TeamPostCard key={post.id} post={post} />
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="individuals" className="space-y-6" data-testid="tab-content-individuals">
          {individualPosts.length === 0 ? (
            <Card className="p-12 text-center" data-testid="empty-individuals-state">
              <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No individual posts</h3>
              <p className="text-muted-foreground mb-4">No individuals are currently looking for teams</p>
              <Button className="bg-mint hover:bg-mint/90">
                Post as Individual
              </Button>
            </Card>
          ) : (
            <div className="space-y-6">
              {individualPosts.map(post => <IndividualPostCard key={post.id} post={post} />)}
            </div>
          )}
        </TabsContent>

        <TabsContent value="teams" className="space-y-6" data-testid="tab-content-teams">
          {teamPosts.length === 0 ? (
            <Card className="p-12 text-center" data-testid="empty-teams-state">
              <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No team posts</h3>
              <p className="text-muted-foreground mb-4">No teams are currently recruiting members</p>
              <Button className="bg-sky hover:bg-sky/90">
                Post for Team
              </Button>
            </Card>
          ) : (
            <div className="space-y-6">
              {teamPosts.map(post => <TeamPostCard key={post.id} post={post} />)}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}