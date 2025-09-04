interface CriteriaBarProps {
  name: string;
  percentage: number;
  description?: string;
}

export default function CriteriaBar({ name, percentage, description }: CriteriaBarProps) {
  const getColor = (pct: number) => {
    if (pct >= 40) return "bg-coral";
    if (pct >= 30) return "bg-sky";
    return "bg-mint";
  };

  return (
    <div className="bg-white rounded-xl p-4 border border-soft-gray shadow-soft" data-testid={`criteria-bar-${name.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-heading font-semibold text-text-dark">{name}</h4>
        <span className="font-bold text-coral">{percentage}%</span>
      </div>
      
      <div className="w-full bg-soft-gray rounded-full h-3 mb-2 overflow-hidden">
        <div 
          className={`h-full ${getColor(percentage)} rounded-full transition-all duration-1000 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      {description && (
        <p className="text-text-muted text-sm">{description}</p>
      )}
    </div>
  );
}