import { Button } from "@/components/ui/button";
import { ExternalLink, Users, Trophy } from "lucide-react";
import { SiDiscord } from "react-icons/si";

interface StickyCTAProps {
  event: any;
  onRegister: () => void;
  className?: string;
}

export default function StickyCTA({ event, onRegister, className }: StickyCTAProps) {
  return (
    <div className={`bg-white/95 backdrop-blur-lg border border-soft-gray rounded-2xl p-6 shadow-soft sticky top-6 ${className}`} data-testid="sticky-cta">
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="font-heading font-bold text-lg text-text-dark mb-2">{event.title}</h3>
          <p className="text-sm text-text-muted">Ready to join?</p>
        </div>
        
        <div className="space-y-3">
          <Button 
            onClick={onRegister}
            className="w-full bg-coral text-white hover:bg-coral/80 hover-scale"
            data-testid="sticky-register-button"
          >
            <Users className="w-4 h-4 mr-2" />
            Register Now
          </Button>
          
          {event.discordUrl && (
            <Button 
              variant="outline"
              className="w-full border-sky text-sky hover:bg-sky/10"
              onClick={() => window.open(event.discordUrl, '_blank')}
              data-testid="sticky-discord-button"
            >
              <SiDiscord className="w-4 h-4 mr-2" />
              Join Discord
            </Button>
          )}
          
          <Button 
            variant="outline"
            className="w-full border-mint text-mint hover:bg-mint/10"
            onClick={() => window.open(event.devpostUrl, '_blank')}
            data-testid="sticky-devpost-button"
          >
            <Trophy className="w-4 h-4 mr-2" />
            View on Devpost
          </Button>
        </div>
        
        <div className="text-center pt-4 border-t border-soft-gray">
          <p className="text-xs text-text-muted">
            Prize Pool: <span className="font-bold text-coral">${(event.prizePool / 1000).toFixed(0)}k</span>
          </p>
        </div>
      </div>
    </div>
  );
}