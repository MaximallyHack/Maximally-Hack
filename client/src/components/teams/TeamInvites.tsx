import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Users, ArrowLeft, Check, X, Clock, Mail, 
  Calendar, MapPin, ExternalLink 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/supabaseApi";

// Mock invite interface - in production this would come from the API
interface TeamInvite {
  id: string;
  teamId: string;
  teamName: string;
  teamDescription: string;
  invitedBy: string;
  inviterName: string;
  inviterAvatar?: string;
  eventName?: string;
  eventId?: string;
  invitedAt: string;
  expiresAt: string;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  message?: string;
}

export default function TeamInvites() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  // Get user's invitations
  const { data: invitations = [], isLoading: invitationsLoading } = useQuery({
    queryKey: ['user-invitations', user?.id],
    queryFn: () => api.getUserInvitations(),
    enabled: !!user
  });

  const pendingInvites = invitations.filter(invite => invite.status === 'pending');

  const handleAcceptInvite = async (invitation: any) => {
    if (!user) {
      toast({ title: "Error", description: "Please log in to accept invites", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      await api.respondToInvitation(invitation.id, 'accepted');
      toast({ 
        title: "Invite Accepted!", 
        description: `You've joined ${invitation.team.name}. Welcome to the team!` 
      });
      
      queryClient.invalidateQueries(['user-invitations']);
      queryClient.invalidateQueries(['teams']);
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to accept invite", 
        variant: "destructive" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRejectInvite = async (invitation: any) => {
    setIsLoading(true);
    try {
      await api.respondToInvitation(invitation.id, 'rejected');
      toast({ 
        title: "Invite Rejected", 
        description: `You've declined the invitation to join ${invitation.team.name}` 
      });
      
      queryClient.invalidateQueries(['user-invitations']);
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to reject invite", 
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
        <h1 className="text-3xl font-heading font-bold text-foreground mb-2">Team Invitations</h1>
        <p className="text-muted-foreground">Manage your team invitations and join amazing projects</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-coral" />
            Pending Invitations ({pendingInvites.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {invitationsLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-coral"></div>
            </div>
          ) : pendingInvites.length === 0 ? (
            <div className="text-center py-8">
              <Mail className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold text-foreground mb-2">No pending invitations</h3>
              <p className="text-muted-foreground mb-4">
                When teams invite you to join, they'll appear here
              </p>
              <Link to="/teams/find">
                <Button>Explore Teams</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {pendingInvites.map((invite) => (
                <div key={invite.id} className="border border-border rounded-xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={invite.inviter?.avatar_url} />
                        <AvatarFallback className="bg-coral text-white">
                          {invite.inviter?.full_name?.[0] || '?'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-foreground text-lg">{invite.team.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Invited by <span className="font-medium">{invite.inviter?.full_name || 'Unknown'}</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4">{invite.team.description}</p>
                  
                  {invite.message && (
                    <div className="bg-muted/50 rounded-lg p-3 mb-4">
                      <p className="text-sm italic">\"${invite.message}\"</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <p className="text-xs text-muted-foreground">
                      Invited {formatTimeAgo(invite.sent_at)}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRejectInvite(invite)}
                        disabled={isLoading}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Decline
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleAcceptInvite(invite)}
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
    </div>
  );
}
