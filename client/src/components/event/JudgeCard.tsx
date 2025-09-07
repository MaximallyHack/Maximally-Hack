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

export default function JuryMemberCard({ judge, showContactButton = false }: JudgeCardProps) {
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
      <div className="space-y-4">
        <div className="flex flex-row justify-start">
          {/* Avatar */}
          <Avatar className="w-20 h-20 mx-2">
            <AvatarImage src={judge.avatar} alt={judge.name} />
            <AvatarFallback className="bg-sky text-white text-xl">
              {judge.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>

          {/* Basic Info */}
          <div className="">
            <h3 className="font-heading font-semibold text-xl text-text-dark ">{judge.name}</h3>
            <p className="text-text-muted text-sm">{judge.title} at {judge.company}</p>
            <p className="text-text-muted text-xs">{judge.location}</p>
          </div>
          
        </div>
        {/*
        Quote 
        {judge.quote && (
          <blockquote className="text-text-muted italic text-sm border-l-4 border-mint pl-4 text-left">
            "{judge.quote}"
          </blockquote>
        )}
        */}
        {/* Bio */}
        <p className="text-text-muted text-xs justify-start line-clamp-3">{judge.bio}</p>

        {/* Expertise Tags */}
        <div className="flex flex-row gap-2 justify-start">
          {judge.expertise.slice(0, 2).map((skill) => (
            <Badge key={skill} className="bg-sky text-black/60 px-2 py-1 rounded-full text-xs border-0">
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
        <div className="flex flex-col justify-start gap-1">
          <div className="flex flex-row items-center gap-2">
            <div className="text-sm text-text-muted font-semibold">Events Judged:</div>
            <div className="text-md font-bold text-coral">{judge.eventsJudged}</div>
          </div>
          <div className="flex flex-row items-center gap-2">
            <div className="text-sm text-text-muted font-semibold">Rating:</div>
            <div className="flex items-center">
              <span className="text-md font-bold text-yellow">{judge.rating}</span>
              <Star className="w-4 h-4 text-yellow" fill="currentColor" />
            </div>
          </div>
          <div className="flex flex-row items-center">
            {/* Availability */}
            <div className="text-sm text-text-muted font-semibold">Status:</div>
            <Badge className={`bg-${getAvailabilityColor()}/20 text-${getAvailabilityColor()} px-3 py-1 rounded-full text-md border-0`}>
              {judge.availability}
            </Badge>
          </div>
        </div>

        {/*Footer*/}
        <div className="flex justify-between">
          {/* Social Links */}
          <div className="flex justify-start gap-3">
            {judge.social.linkedin && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-text-muted hover:text-textDark"
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
                className="h-8 w-8 text-text-muted hover:text-textDark"
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
                className="h-8 w-8 text-text-muted hover:text-textDark"
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

          <div className="flex justify-end">
            {/* Contact Button */}
            {showContactButton && judge.availability === 'Available' && (
              <Button 
                className="w-full bg-coral text-white text-xs hover:bg-coral/80 rounded-full"
                data-testid={`button-contact-${judge.id}`}
              >
                Invite to Judge
              </Button>
            )}
          </div>

        </div>
      </div>
    </Card>
  );
}
