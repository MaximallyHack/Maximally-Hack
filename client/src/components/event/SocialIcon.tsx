import { ExternalLink } from "lucide-react";
import { SiInstagram, SiLinkedin, SiYoutube, SiX, SiDiscord, SiTelegram } from "react-icons/si";

interface SocialIconProps {
  platform: string;
  url?: string;
  showTooltip?: boolean;
}

export default function SocialIcon({ platform, url, showTooltip = true }: SocialIconProps) {
  if (!url) return null;

  const getIcon = () => {
    switch (platform.toLowerCase()) {
      case 'instagram': return <SiInstagram className="w-5 h-5" />;
      case 'linkedin': return <SiLinkedin className="w-5 h-5" />;
      case 'youtube': return <SiYoutube className="w-5 h-5" />;
      case 'twitter': 
      case 'x': return <SiX className="w-5 h-5" />;
      case 'discord': return <SiDiscord className="w-5 h-5" />;
      case 'telegram': return <SiTelegram className="w-5 h-5" />;
      default: return <ExternalLink className="w-5 h-5" />;
    }
  };

  const getColor = () => {
    switch (platform.toLowerCase()) {
      case 'instagram': return "hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500";
      case 'linkedin': return "hover:bg-blue-600";
      case 'youtube': return "hover:bg-red-600";
      case 'twitter': return "hover:bg-blue-400";
      case 'discord': return "hover:bg-indigo-600";
      case 'telegram': return "hover:bg-blue-500";
      default: return "hover:bg-sky";
    }
  };

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`w-10 h-10 rounded-full bg-white border border-soft-gray flex items-center justify-center text-text-muted ${getColor()} hover:text-white transition-all duration-200 hover-scale shadow-soft`}
      title={showTooltip ? `Follow us on ${platform}` : undefined}
      data-testid={`social-icon-${platform.toLowerCase()}`}
    >
      {getIcon()}
    </a>
  );
}