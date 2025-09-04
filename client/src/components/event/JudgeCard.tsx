import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ExternalLink, Linkedin, Twitter, Star } from "lucide-react";
import type { Judge } from "@/lib/api";

interface JudgeCardProps {
  judge: Judge;
  showContactButton?: boolean;
}

export default function JudgeCard({ judge, showContactButton = false }: JudgeCardProps) {
  const getAvailabilityColor = () => {
    switch (judge.availability) {
      case 'Available': return 'success';
      case 'Limited': return 'yellow';
      case 'Unavailable': return 'error';
      default: return 'sky';
    }
  };

  return (
    <Card className="bg-white rounded-2xl p-6 shadow-soft border border-soft-gray hover-scale cursor-pointer transition-all duration-200" data-testid={`judge-card-${judge.id}`}>
      <div className="text-center space-y-4">
        {/* Avatar */}
        <Avatar className="w-20 h-20 mx-auto">
          <AvatarImage src={judge.avatar} alt={judge.name} />
          <AvatarFallback className="bg-sky text-white text-xl">
            {judge.name.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>

        {/* Basic Info */}
        <div>
          <h3 className="font-heading font-semibold text-lg text-text-dark mb-1">{judge.name}</h3>
          <p className="text-text-muted text-sm mb-2">{judge.title} at {judge.company}</p>
          <p className="text-text-muted text-xs">{judge.location}</p>
        </div>

        {/* Bio */}
        <p className="text-text-muted text-sm line-clamp-3">{judge.bio}</p>

        {/* Expertise Tags */}
        <div className="flex flex-wrap gap-2 justify-center">
          {judge.expertise.slice(0, 3).map((skill) => (
            <Badge key={skill} className="bg-sky/20 text-sky px-2 py-1 rounded-full text-xs border-0">
              {skill}
            </Badge>
          ))}
          {judge.expertise.length > 3 && (
            <Badge className="bg-soft-gray text-text-muted px-2 py-1 rounded-full text-xs border-0">
              +{judge.expertise.length - 3}
            </Badge>
          )}
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-coral">{judge.eventsJudged}</div>
            <div className="text-xs text-text-muted">Events Judged</div>
          </div>
          <div>
            <div className="flex items-center justify-center gap-1">
              <span className="text-lg font-bold text-yellow">{judge.rating}</span>
              <Star className="w-4 h-4 text-yellow" fill="currentColor" />
            </div>
            <div className="text-xs text-text-muted">Rating</div>
          </div>
        </div>

        {/* Availability */}
        <Badge className={`bg-${getAvailabilityColor()}/20 text-${getAvailabilityColor()} px-3 py-1 rounded-full text-sm border-0`}>
          {judge.availability}
        </Badge>

        {/* Quote */}
        {judge.quote && (
          <blockquote className="text-text-muted italic text-sm border-l-4 border-mint pl-4 text-left">
            "{judge.quote}"
          </blockquote>
        )}

        {/* Badges */}
        <div className="flex flex-wrap gap-2 justify-center">
          {judge.badges.slice(0, 2).map((badge) => (
            <Badge key={badge} className="bg-mint/20 text-mint px-2 py-1 rounded-full text-xs border-0">
              {badge}
            </Badge>
          ))}
        </div>

        {/* Social Links */}
        <div className="flex justify-center gap-3">
          {judge.social.linkedin && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-text-muted hover:text-sky"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.open(`https://linkedin.com/in/${judge.social.linkedin}`, '_blank');
              }}
              data-testid={`button-linkedin-${judge.id}`}
            >
              <Linkedin className="w-4 h-4" />
            </Button>
          )}
          {judge.social.twitter && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-text-muted hover:text-sky"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.open(`https://twitter.com/${judge.social.twitter}`, '_blank');
              }}
              data-testid={`button-twitter-${judge.id}`}
            >
              <Twitter className="w-4 h-4" />
            </Button>
          )}
          {judge.social.website && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-text-muted hover:text-coral"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.open(judge.social.website, '_blank');
              }}
              data-testid={`button-website-${judge.id}`}
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Contact Button */}
        {showContactButton && judge.availability === 'Available' && (
          <Button 
            className="w-full bg-coral text-white hover:bg-coral/80 rounded-full"
            data-testid={`button-contact-${judge.id}`}
          >
            Invite to Judge
          </Button>
        )}
      </div>
    </Card>
  );
}
