import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ArrowLeft, SkipForward, Sparkles } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { JudgeApplicationData } from "./JudgeApplicationModal";

interface ExpertiseSelectionProps {
  form: UseFormReturn<JudgeApplicationData>;
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
  isTestMode: boolean;
}

const EXPERTISE_AREAS = [
  { id: "web", label: "Web Development", color: "bg-coral text-white" },
  { id: "mobile", label: "Mobile Development", color: "bg-sky text-white" },
  { id: "ai", label: "AI/ML", color: "bg-mint text-text-dark" },
  { id: "blockchain", label: "Blockchain", color: "bg-yellow text-text-dark" },
  { id: "iot", label: "IoT", color: "bg-coral/70 text-white" },
  { id: "cybersecurity", label: "Cybersecurity", color: "bg-text-dark text-white" },
  { id: "data", label: "Data Science", color: "bg-sky/70 text-white" },
  { id: "devops", label: "DevOps", color: "bg-mint/70 text-text-dark" },
  { id: "gaming", label: "Game Development", color: "bg-yellow/70 text-text-dark" },
  { id: "ar_vr", label: "AR/VR", color: "bg-coral/50 text-text-dark" },
  { id: "fintech", label: "FinTech", color: "bg-sky/50 text-text-dark" },
  { id: "healthtech", label: "HealthTech", color: "bg-mint/50 text-text-dark" },
  { id: "edtech", label: "EdTech", color: "bg-yellow/50 text-text-dark" },
  { id: "climate", label: "Climate Tech", color: "bg-mint text-white" },
  { id: "hardware", label: "Hardware", color: "bg-text-dark/70 text-white" },
  { id: "ui_ux", label: "UI/UX Design", color: "bg-coral/30 text-text-dark" },
];

export function ExpertiseSelection({ form, onNext, onPrev, onSkip, isTestMode }: ExpertiseSelectionProps) {
  const { watch, setValue, formState: { errors } } = form;
  
  const selectedAreas = watch("expertiseAreas") || [];
  
  const toggleExpertise = (areaLabel: string) => {
    const currentAreas = selectedAreas;
    const isSelected = currentAreas.includes(areaLabel);
    
    if (isSelected) {
      setValue("expertiseAreas", currentAreas.filter(area => area !== areaLabel));
    } else {
      setValue("expertiseAreas", [...currentAreas, areaLabel]);
    }
  };

  return (
    <div className="flex flex-col min-h-full">
      <div className="flex-1 p-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8 text-center">
            <div className="w-16 h-16 bg-sky/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-sky" />
            </div>
            <h1 className="font-heading font-bold text-3xl text-text-dark mb-3">
              What areas are you most passionate about?
            </h1>
            <p className="text-text-muted text-lg">
              Select all the expertise areas where you can provide valuable feedback and insights.
            </p>
          </div>

          <div className="mb-6">
            <div className="flex flex-wrap gap-3 justify-center">
              {EXPERTISE_AREAS.map((area) => {
                const isSelected = selectedAreas.includes(area.label);
                return (
                  <button
                    key={area.id}
                    type="button"
                    onClick={() => toggleExpertise(area.label)}
                    className={`px-4 py-2 rounded-full font-medium text-sm transition-all duration-200 hover-scale ${
                      isSelected 
                        ? `${area.color} ring-2 ring-offset-2 ring-sky/50 scale-105`
                        : 'bg-white border-2 border-soft-gray/30 text-text-dark hover:border-sky/50'
                    }`}
                    data-testid={`expertise-${area.id}`}
                  >
                    {area.label}
                  </button>
                );
              })}
            </div>
          </div>

          {selectedAreas.length > 0 && (
            <div className="bg-soft-gray/20 rounded-xl p-6 mb-6">
              <h3 className="font-heading font-semibold text-lg mb-3">Selected Areas ({selectedAreas.length})</h3>
              <div className="flex flex-wrap gap-2">
                {selectedAreas.map((area) => (
                  <Badge key={area} className="bg-sky/20 text-sky px-3 py-1">
                    {area}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {errors.expertiseAreas && (
            <p className="text-coral text-center mb-4">{errors.expertiseAreas.message}</p>
          )}

          {isTestMode && (
            <div className="mt-8 p-4 bg-yellow/10 rounded-xl border border-yellow/30">
              <p className="text-yellow-700 text-sm mb-2">
                🧪 Test Mode: Auto-select popular areas
              </p>
              <div className="text-xs text-yellow-600 mb-2">
                Will select: Web Development, AI/ML, Mobile Development
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onSkip}
                className="text-yellow-700 hover:bg-yellow/20"
                data-testid="button-skip-question"
              >
                <SkipForward className="w-4 h-4 mr-1" />
                Auto-select areas
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between p-6 border-t border-soft-gray/20">
        <Button
          variant="ghost"
          onClick={onPrev}
          className="flex items-center gap-2 hover:bg-soft-gray/20"
          data-testid="button-prev"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        
        <Button
          onClick={onNext}
          disabled={selectedAreas.length === 0}
          className="bg-sky text-white px-6 py-2 rounded-full font-medium hover-scale hover:bg-sky/80 transition-colors disabled:opacity-50 disabled:hover:scale-100"
          data-testid="button-next"
        >
          Continue
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}