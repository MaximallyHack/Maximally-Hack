import { Trophy, Star, Award } from "lucide-react";

interface EnhancedPrizeCardProps {
  place?: number;
  track?: string;
  amount: number;
  title: string;
  description?: string;
  isFeatured?: boolean;
}

export default function EnhancedPrizeCard({ place, track, amount, title, description, isFeatured }: EnhancedPrizeCardProps) {
  const getIcon = () => {
    if (place === 1) return <Trophy className="w-6 h-6" />;
    if (place === 2) return <Star className="w-6 h-6" />;
    if (place === 3) return <Award className="w-6 h-6" />;
    return <Award className="w-6 h-6" />;
  };

  const getColors = () => {
    if (place === 1) return "from-coral via-coral/80 to-coral text-white border-coral";
    if (place === 2) return "from-sky via-sky/80 to-sky text-white border-sky";
    if (place === 3) return "from-mint via-mint/80 to-mint text-text-dark border-mint";
    return "from-yellow via-yellow/80 to-yellow text-text-dark border-yellow";
  };

  const getSize = () => {
    if (place === 1) return "scale-110 z-10";
    if (place === 2) return "scale-105 z-5";
    return "scale-100";
  };

  return (
    <div 
      className={`relative bg-gradient-to-br ${getColors()} rounded-2xl p-6 shadow-soft border-2 transition-all duration-300 hover-scale ${getSize()} ${
        isFeatured ? "ring-4 ring-coral/20" : ""
      }`}
      data-testid={`prize-card-${place ? `place-${place}` : `track-${track?.toLowerCase().replace(/\s+/g, '-')}`}`}
    >
      {/* Floating decoration */}
      {place === 1 && (
        <div className="absolute -top-3 -right-3 w-8 h-8 bg-yellow rounded-full flex items-center justify-center animate-pulse">
          <span className="text-text-dark font-bold text-sm">★</span>
        </div>
      )}
      
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-4">
          {getIcon()}
        </div>
        
        <h3 className="font-heading font-bold text-xl mb-2">
          {track ? `${track} Track` : title}
        </h3>
        
        <div className="text-3xl font-bold mb-3">
          ${amount >= 1000 ? `${(amount / 1000).toFixed(0)}k` : amount}
        </div>
        
        {description && (
          <p className="text-sm opacity-90">{description}</p>
        )}
        
        {place && (
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg">
            <span className="font-bold text-text-dark">{place}</span>
          </div>
        )}
      </div>
    </div>
  );
}