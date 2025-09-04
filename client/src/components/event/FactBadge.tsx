import { LucideIcon } from "lucide-react";

interface FactBadgeProps {
  icon: LucideIcon;
  label: string;
  value: string;
  color?: "sky" | "coral" | "mint" | "yellow";
}

export default function FactBadge({ icon: Icon, label, value, color = "sky" }: FactBadgeProps) {
  const colorClasses = {
    sky: "bg-sky/10 text-sky border-sky/20",
    coral: "bg-coral/10 text-coral border-coral/20", 
    mint: "bg-mint/10 text-mint border-mint/20",
    yellow: "bg-yellow/10 text-yellow border-yellow/20"
  };

  return (
    <div className={`${colorClasses[color]} border rounded-full px-4 py-2 flex items-center gap-2 transition-all hover-scale`} data-testid={`fact-badge-${label.toLowerCase()}`}>
      <Icon className="w-4 h-4" />
      <span className="font-medium text-sm">
        <span className="font-normal">{label}:</span> {value}
      </span>
    </div>
  );
}