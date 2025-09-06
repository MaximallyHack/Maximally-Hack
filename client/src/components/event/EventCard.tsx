import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Trophy, Heart, Share } from "lucide-react";
import type { Event } from "@/lib/api";
import { statusColors, formatColors } from "@/lib/theme";

interface EventCardProps {
  event: Event;
  showActions?: boolean;
}

export default function EventCard({ event, showActions = true }: EventCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getTimeLeft = () => {
    const now = new Date();
    const start = new Date(event.startDate);
    const diff = start.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days > 0) return `${days} days left`;
    if (event.status === 'active') return 'Active now';
    if (event.status === 'completed') return 'Completed';
    return 'Starting soon';
  };

  const getStatusColor = () => {
    return statusColors[event.status] || 'sky';
  };

  const getStatusIcon = () => {
    switch (event.status) {
      case 'active': return '🟢';
      case 'upcoming': return '⏰';
      case 'completed': return '🏆';
      case 'registration_open': return '🌱';
      default: return '📅';
    }
  };

  const formatPrize = (amount: number) => {
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}k`;
    }
    return `$${amount}`;
  };

  return (
    <Card className="group bg-card rounded-2xl p-6 shadow-soft hover-scale cursor-pointer border border-border transition-all duration-200" data-testid={`event-card-${event.slug}`}>
      <Link href={`/e/${event.slug}`}>
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <Badge className="inline-flex items-center transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent hover:bg-primary/80 bg-yellow/20 px-3 py-1 rounded-full text-sm font-medium border-0 text-[#000000]">
              <span className="mr-1">{getStatusIcon()}</span>
              {event.status.charAt(0).toUpperCase() + event.status.slice(1).replace('_', ' ')}
            </Badge>
            
            {showActions && (
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-coral"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  data-testid={`button-heart-${event.slug}`}
                >
                  <Heart className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-sky"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  data-testid={`button-share-${event.slug}`}
                >
                  <Share className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Content */}
          <div>
            <h3 className="font-heading font-semibold text-xl text-card-foreground mb-2 group-hover:text-coral transition-colors">
              {event.title}
            </h3>
            <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
              {event.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {event.tags.slice(0, 3).map((tag) => (
                <Badge 
                  key={tag}
                  variant="secondary"
                  className="bg-sky/20 text-sky px-2 py-1 rounded-full text-xs border-0"
                >
                  {tag}
                </Badge>
              ))}
              {event.tags.length > 3 && (
                <Badge variant="secondary" className="bg-muted text-muted-foreground px-2 py-1 rounded-full text-xs border-0">
                  +{event.tags.length - 3}
                </Badge>
              )}
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{getTimeLeft()}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{event.participantCount.toLocaleString()} participants</span>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 font-semibold text-coral">
                <Trophy className="w-4 h-4" />
                <span>Prize: {formatPrize(event.prizePool)}</span>
              </div>
              
              <Button 
                size="sm" 
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-9 rounded-full px-4 py-2 text-sm font-medium transition-colors hover:bg-mint/80 bg-[#67a183] text-[#e6e8ed]"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                data-testid={`button-join-${event.slug}`}
              >
                {event.status === 'active' ? 'Join Now' :
                 event.status === 'upcoming' ? 'Register' :
                 event.status === 'registration_open' ? 'Register' :
                 'View Results'}
              </Button>
            </div>
          </div>
        </div>
      </Link>
    </Card>
  );
}
