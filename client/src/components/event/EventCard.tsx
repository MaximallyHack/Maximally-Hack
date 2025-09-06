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
    <Card className="group bg-white rounded-2xl p-6 shadow-soft hover-scale cursor-pointer border border-soft-gray transition-all duration-200" data-testid={`event-card-${event.slug}`}>
      <Link href={`/e/${event.slug}`}>
        <div className="space-y-4">
          {/* Header */}
          <Badge
            className={`bg-${getStatusColor()} text-black/60 rounded-full text-sm font-medium border-0`}
          >
            <span className="mr-1">{getStatusIcon()}</span>
            {event.status.charAt(0).toUpperCase() + event.status.slice(1).replace('_', ' ')}
          </Badge>

          {/* Content */}
          <div>
            <h3 className="font-heading font-semibold text-3xl text-text-dark mb-2">
              {event.title}
            </h3>
            <p className="text-text-muted text-sm mb-4 line-clamp-2">
              {event.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {event.tags.slice(0, 3).map((tag) => (
                <Badge 
                  key={tag}
                  variant="secondary"
                  className="bg-sky text-black/70 px-2 py-1 rounded-md text-xs border-0"
                >
                  {tag}
                </Badge>
              ))}
              {event.tags.length > 3 && (
                <Badge variant="secondary" className="bg-soft-gray text-text-muted px-2 py-1 rounded-full text-xs border-0">
                  +{event.tags.length - 3}
                </Badge>
              )}
            </div>

            {/* Stats */}
            <div className="flex flex-col justify-between text-sm text-text-muted gap-1 mb-4 text-textDark font-semibold">
              <div className="flex items-center gap-1">
                <Trophy className="w-4 h-4" />
                <span>Prize: {formatPrize(event.prizePool)}</span>
              </div>
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
              <div className="flex gap-2 justify-start">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-text-muted hover:text-coral"
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
                  className="h-8 w-8 text-text-muted hover:text-sky"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  data-testid={`button-share-${event.slug}`}
                >
                  <Share className="w-4 h-4" />
                </Button>
              </div>

              <Button 
                size="sm" 
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors
                  ${event.status === 'active' ? 'bg-coral hover:bg-coral/80 text-white' :
                    event.status === 'upcoming' ? 'bg-mint hover:bg-mint/80 text-text-dark' :
                    event.status === 'registration_open' ? 'bg-sky hover:bg-sky/80 text-white' :
                    'bg-soft-gray hover:bg-soft-gray/80 text-text-muted'
                  }`}
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
