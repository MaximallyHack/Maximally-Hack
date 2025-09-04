import { Clock } from "lucide-react";

interface TimelineItemProps {
  time: string;
  title: string;
  description: string;
  isActive?: boolean;
  isCompleted?: boolean;
}

export default function TimelineItem({ time, title, description, isActive, isCompleted }: TimelineItemProps) {
  return (
    <div className="flex items-start gap-4 group" data-testid={`timeline-item-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className={`relative flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all ${
        isCompleted 
          ? "bg-mint text-white shadow-lg" 
          : isActive 
            ? "bg-coral text-white shadow-lg animate-pulse" 
            : "bg-soft-gray text-text-muted group-hover:bg-sky/20 group-hover:text-sky"
      }`}>
        <Clock className="w-5 h-5" />
        {isActive && (
          <div className="absolute inset-0 rounded-full bg-coral animate-ping opacity-20"></div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="bg-white rounded-xl p-4 shadow-soft border border-soft-gray group-hover:shadow-lg transition-all">
          <h3 className="font-heading font-semibold text-lg text-text-dark mb-1">{title}</h3>
          <p className="text-coral font-medium text-sm mb-2">{time}</p>
          <p className="text-text-muted text-sm">{description}</p>
        </div>
      </div>
    </div>
  );
}