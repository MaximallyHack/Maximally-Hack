import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface LinkChipProps {
  label: string;
  url?: string;
  icon?: React.ReactNode;
}

export default function LinkChip({ label, url, icon }: LinkChipProps) {
  if (!url) return null;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block hover-scale"
      data-testid={`link-chip-${label.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <Badge className="bg-white hover:bg-soft-gray border border-soft-gray text-text-dark px-4 py-2 rounded-full transition-all duration-200 shadow-soft">
        <span className="flex items-center gap-2">
          {icon}
          {label}
          <ExternalLink className="w-3 h-3" />
        </span>
      </Badge>
    </a>
  );
}