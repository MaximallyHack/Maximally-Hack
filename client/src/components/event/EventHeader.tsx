import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Globe, Trophy, Share, Rocket } from "lucide-react";
import type { Event } from "@/lib/api";
import Countdown from "./Countdown";

interface EventHeaderProps {
  event: Event;
}

export default function EventHeader({ event }: EventHeaderProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatPrize = (amount: number) => {
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}k`;
    }
    return `$${amount}`;
  };

  const getJoinButtonText = () => {
    switch (event.status) {
      case 'active':
        return 'Join Hackathon';
      case 'upcoming':
      case 'registration_open':
        return 'Register Now';
      case 'completed':
        return 'View Results';
      default:
        return 'Learn More';
    }
  };

  return (
    <section className="bg-gradient-to-br from-sky/20 via-coral/10 to-mint/20 py-12" data-testid="event-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex-1">
            <h1 className="font-heading font-bold text-4xl lg:text-5xl text-foreground mb-4 float-animation">
              {event.title}
            </h1>
            <p className="text-lg text-muted-foreground mb-6 max-w-3xl">
              {event.longDescription || event.description}
            </p>
            
            {/* Event Info Pills */}
            <div className="flex flex-wrap gap-3 mb-6">
              <Badge className="bg-sky text-white px-4 py-2 rounded-full font-medium text-sm">
                <Calendar className="w-4 h-4 mr-2" />
                {formatDate(event.startDate)} - {formatDate(event.endDate)}
              </Badge>
              <Badge className="bg-mint text-foreground px-4 py-2 rounded-full font-medium text-sm">
                <Globe className="w-4 h-4 mr-2" />
                {event.location}
              </Badge>
              <Badge className="bg-coral text-white px-4 py-2 rounded-full font-medium text-sm">
                <Trophy className="w-4 h-4 mr-2" />
                {formatPrize(event.prizePool)} Prize Pool
              </Badge>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              size="lg"
              className="bg-coral text-white px-8 py-4 rounded-full font-medium text-lg hover-scale hover:bg-coral/80 transition-colors"
              data-testid="button-join-event"
            >
              <Rocket className="w-5 h-5 mr-2" />
              {getJoinButtonText()}
            </Button>
            <Button 
              variant="outline"
              size="lg"
              className="border-2 border-coral text-coral px-8 py-4 rounded-full font-medium text-lg hover-scale hover:bg-coral/10 transition-colors"
              data-testid="button-share-event"
            >
              <Share className="w-5 h-5 mr-2" />
              Share
            </Button>
          </div>
        </div>
        
        {/* Countdown Timer */}
        {(event.status === 'upcoming' || event.status === 'registration_open') && (
          <div className="mt-8">
            <Countdown targetDate={event.startDate} />
          </div>
        )}
        
        {/* Event Stats */}
        <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 mt-8 border border-border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-coral mb-2">{event.participantCount.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Participants</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-sky mb-2">
                {Math.floor((new Date(event.endDate).getTime() - new Date(event.startDate).getTime()) / (1000 * 60 * 60))}
              </div>
              <div className="text-sm text-muted-foreground">Hours Duration</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-mint mb-2">{event.tracks.length}</div>
              <div className="text-sm text-muted-foreground">Prize Tracks</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
