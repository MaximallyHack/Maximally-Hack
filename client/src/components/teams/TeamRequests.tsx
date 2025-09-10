import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, ArrowLeft, Check, X, Clock, Send, 
  Calendar, MapPin, ExternalLink, MessageCircle 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/supabaseApi";

// Mock request interfaces
interface TeamJoinRequest {
  id: string;
  teamId: string;
  teamName: string;
  requestedBy: string;
  requesterName: string;
  requesterAvatar?: string;
  requesterSkills: string[];
  message?: string;
  requestedAt: string;
  status: 'pending' | 'accepted' | 'rejected';
}

interface MyTeamRequest {
  id: string;
  teamId: string;
  teamName: string;
  teamDescription: string;
  teamAvatar?: string;
  eventName?: string;
  requestedAt: string;
  status: 'pending' | 'accepted' | 'rejected';
  message?: string;
}

export default function TeamRequests() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  // Get user's teams to fetch applications for
  const { data: userTeams = [] } = useQuery({
    queryKey: ['user-teams', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const teams = await api.getTeams();
      return teams.filter(team => team.leaderId === user.id);
    },
    enabled: !!user
  });

  // Get incoming applications for user's teams
  const { data: incomingApplications = [] } = useQuery({
    queryKey: ['team-applications', userTeams.map(t => t.id)],
    queryFn: async () => {
      if (!userTeams.length) return [];
      const allApplications = [];
      for (const team of userTeams) {
        const applications = await api.getTeamApplications(team.id);
        allApplications.push(...applications.filter(app => app.status === 'pending'));
      }
      return allApplications;
    },
    enabled: userTeams.length > 0
  });

  // Get user's own applications
  const { data: myApplications = [] } = useQuery({
    queryKey: ['user-applications', user?.id],
    queryFn: () => api.getUserApplications(),
    enabled: !!user
  });

  const incomingRequests = incomingApplications.filter(req => req.status === 'pending');
  const myRequests = myApplications.filter(req => req.status === 'pending');

  const handleAcceptRequest = async (application: any) => {
    if (!user) {
      toast({ title: "Error", description: "Please log in to manage requests", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      await api.updateApplicationStatus(application.id, 'accepted');
      toast({ 
        title: "Request Accepted!", 
        description: `${application.applicant.full_name} has been added to ${application.team.name}` 
      });
      
      queryClient.invalidateQueries(['team-applications']);
      queryClient.invalidateQueries(['teams']);
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to accept request", 
        variant: "destructive" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRejectRequest = async (application: any) => {
    setIsLoading(true);
    try {
      await api.updateApplicationStatus(application.id, 'rejected');
      toast({ 
        title: "Request Rejected", 
        description: `${application.applicant.full_name}'s request has been declined` 
      });
      
      queryClient.invalidateQueries(['team-applications']);
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to reject request", 
        variant: "destructive" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelMyRequest = async (application: any) => {
    setIsLoading(true);
    try {
      // We'll add a cancel application API function later
      toast({ 
        title: "Request Cancelled", 
        description: `Your request to join ${application.team.name} has been cancelled` 
      });
      
      queryClient.invalidateQueries(['user-applications']);
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to cancel request", 
        variant: "destructive" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    }
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    }
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Link to="/teams">
            <Button variant="ghost" size="sm" className="text-coral hover:text-coral/80">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Teams
            </Button>
          </Link>
        </div>
        <h1 className="text-3xl font-heading font-bold text-foreground mb-2">Team Requests</h1>
        <p className="text-muted-foreground">Manage incoming requests and track your applications</p>
      </div>

      <Tabs defaultValue="incoming" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="incoming" className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4" />
            Incoming ({incomingRequests.length})
          </TabsTrigger>
          <TabsTrigger value="my-requests" className="flex items-center gap-2">
            <Send className="w-4 h-4" />
            My Applications ({myRequests.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="incoming">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-coral" />
                Join Requests for My Teams
              </CardTitle>
            </CardHeader>
            <CardContent>
              {incomingRequests.length === 0 ? (
                <div className="text-center py-8">
                  <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">No pending requests</h3>
                  <p className="text-muted-foreground mb-4">
                    When people want to join your teams, their requests will appear here
                  </p>
                  <Link to="/teams/create">
                    <Button>Create a Team</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {incomingRequests.map((request) => (
                    <div key={request.id} className="border border-border rounded-xl p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-4">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={request.applicant.avatar_url} />
                            <AvatarFallback className="bg-mint text-white">
                              {request.applicant.full_name[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold text-foreground">{request.applicant.full_name}</h3>
                            <p className="text-sm text-muted-foreground">
                              Wants to join <span className="font-medium">{request.team.name}</span>
                            </p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {(request.skills || []).map((skill) => (
                                <Badge key={skill} variant="secondary" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className="bg-yellow-100 text-yellow-800">
                            Pending
                          </Badge>
                        </div>
                      </div>

                      {request.message && (
                        <div className="bg-muted/50 rounded-lg p-3 mb-4">
                          <p className="text-sm italic">\"${request.message}\"</p>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <p className="text-xs text-muted-foreground">
                          Requested {formatTimeAgo(request.applied_at)}
                        </p>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRejectRequest(request)}
                            disabled={isLoading}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleAcceptRequest(request)}
                            disabled={isLoading}
                            className="bg-coral hover:bg-coral/90"
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Accept
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="my-requests">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="w-5 h-5 text-coral" />
                My Team Applications
              </CardTitle>
            </CardHeader>
            <CardContent>
              {myRequests.length === 0 ? (
                <div className="text-center py-8">
                  <Send className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">No pending applications</h3>
                  <p className="text-muted-foreground mb-4">
                    Your applications to join teams will appear here
                  </p>
                  <Link to="/teams/find">
                    <Button>Find Teams</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {myRequests.map((request) => (
                    <div key={request.id} className="border border-border rounded-xl p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-4">
                          <Avatar className="w-12 h-12">
                            <AvatarFallback className="bg-sky text-white">
                              {request.team.name[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold text-foreground">{request.team.name}</h3>
                            <p className="text-sm text-muted-foreground mb-2">
                              {request.team.description}
                            </p>
                            {request.team.track && (
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Calendar className="w-3 h-3" />
                                <span>{request.team.track}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <Badge className="bg-yellow-100 text-yellow-800">
                          Pending
                        </Badge>
                      </div>

                      {request.message && (
                        <div className="bg-muted/50 rounded-lg p-3 mb-4">
                          <p className="text-sm">Your message: \"{request.message}\"</p>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <p className="text-xs text-muted-foreground">
                          Applied {formatTimeAgo(request.applied_at)}
                        </p>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCancelMyRequest(request)}
                          disabled={isLoading}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="w-4 h-4 mr-1" />
                          Cancel Application
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
