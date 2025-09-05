import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, UserPlus } from "lucide-react";
import type { Team, User } from "@/lib/api";

interface TeamCardProps {
  team: Team;
  members?: User[];
  onJoinRequest?: (teamId: string) => void;
}

export default function TeamCard({ team, members = [], onJoinRequest }: TeamCardProps) {
  const getStatusColor = () => {
    switch (team.status) {
      case 'recruiting': return 'mint';
      case 'full': return 'coral';
      case 'disbanded': return 'error';
      default: return 'sky';
    }
  };

  const getStatusText = () => {
    switch (team.status) {
      case 'recruiting': return `${team.members.length}/${team.maxSize} members`;
      case 'full': return 'Team Full';
      case 'disbanded': return 'Disbanded';
      default: return 'Unknown';
    }
  };

  const handleJoinRequest = () => {
    if (onJoinRequest) {
      onJoinRequest(team.id);
    }
  };

  return (
    <Card className="bg-card rounded-2xl p-6 shadow-soft border border-border hover-scale transition-all duration-200" data-testid={`team-card-${team.id}`}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="font-heading font-semibold text-lg text-card-foreground">{team.name}</h3>
          <Badge className={`bg-${getStatusColor()}/20 text-${getStatusColor()} px-2 py-1 rounded-full text-xs border-0`}>
            {getStatusText()}
          </Badge>
        </div>

        {/* Description */}
        <p className="text-muted-foreground text-sm line-clamp-2">{team.description}</p>

        {/* Looking For Tags */}
        {team.lookingFor.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {team.lookingFor.map((skill) => (
              <Badge key={skill} className="bg-coral/20 text-coral px-2 py-1 rounded-full text-xs border-0">
                Need: {skill}
              </Badge>
            ))}
          </div>
        )}

        {/* Skills */}
        <div className="flex flex-wrap gap-2">
          {team.skills.slice(0, 3).map((skill) => (
            <Badge key={skill} className="bg-sky/20 text-sky px-2 py-1 rounded-full text-xs border-0">
              {skill}
            </Badge>
          ))}
          {team.skills.length > 3 && (
            <Badge className="bg-muted text-muted-foreground px-2 py-1 rounded-full text-xs border-0">
              +{team.skills.length - 3}
            </Badge>
          )}
        </div>

        {/* Track */}
        {team.track && (
          <Badge className="bg-mint/20 text-mint px-3 py-1 rounded-full text-sm border-0">
            {team.track} Track
          </Badge>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2">
          {/* Members */}
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {members.slice(0, 3).map((member, index) => (
                <Avatar key={member.id} className="w-8 h-8 border-2 border-background">
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback className="bg-sky text-white text-xs">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              ))}
              {team.members.length > 3 && (
                <div className="w-8 h-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs text-muted-foreground">
                  +{team.members.length - 3}
                </div>
              )}
            </div>
            {team.members.length === 0 && (
              <div className="flex items-center text-muted-foreground text-sm">
                <Users className="w-4 h-4 mr-1" />
                <span>Looking for teammates</span>
              </div>
            )}
          </div>

          {/* Action Button */}
          {team.status === 'recruiting' && (
            <Button
              size="sm"
              className="bg-mint text-card-foreground px-4 py-2 rounded-full text-sm hover-scale hover:bg-mint/80"
              onClick={handleJoinRequest}
              data-testid={`button-join-team-${team.id}`}
            >
              <UserPlus className="w-4 h-4 mr-1" />
              Request Join
            </Button>
          )}
          
          {team.status === 'full' && (
            <Badge className="bg-coral/20 text-coral px-3 py-1 rounded-full text-sm border-0">
              Team Full
            </Badge>
          )}
        </div>
      </div>
    </Card>
  );
}
