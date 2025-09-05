import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ArrowRight, ArrowLeft, SkipForward, Briefcase } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { JudgeApplicationData } from "./JudgeApplicationModal";

interface ProfessionalBackgroundProps {
  form: UseFormReturn<JudgeApplicationData>;
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
  isTestMode: boolean;
}

export function ProfessionalBackground({ form, onNext, onPrev, onSkip, isTestMode }: ProfessionalBackgroundProps) {
  const { register, formState: { errors }, watch, setValue } = form;
  
  const yearsExperience = watch("yearsExperience");
  
  const handleSliderChange = (value: number[]) => {
    setValue("yearsExperience", value[0]);
  };

  return (
    <div className="flex flex-col min-h-full">
      <div className="flex-1 p-8">
        <div className="max-w-lg mx-auto">
          <div className="mb-8">
            <div className="w-16 h-16 bg-mint/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-8 h-8 text-mint" />
            </div>
            <h1 className="font-heading font-bold text-3xl text-text-dark mb-3 text-center">
              Tell us about your professional background
            </h1>
            <p className="text-text-muted text-lg text-center">
              Help us understand your expertise and experience level.
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="jobTitle" className="text-base font-medium text-text-dark">
                Current Job Title *
              </Label>
              <Input
                id="jobTitle"
                {...register("jobTitle")}
                placeholder="e.g. Senior Software Engineer"
                className="h-12 text-base rounded-xl border-2 focus:border-mint"
                data-testid="input-job-title"
              />
              {errors.jobTitle && (
                <p className="text-coral text-sm">{errors.jobTitle.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="company" className="text-base font-medium text-text-dark">
                Company/Organization *
              </Label>
              <Input
                id="company"
                {...register("company")}
                placeholder="e.g. Google, Microsoft, Startup Inc"
                className="h-12 text-base rounded-xl border-2 focus:border-mint"
                data-testid="input-company"
              />
              {errors.company && (
                <p className="text-coral text-sm">{errors.company.message}</p>
              )}
            </div>

            <div className="space-y-4">
              <Label className="text-base font-medium text-text-dark">
                Years of Experience *
              </Label>
              <div className="px-4">
                <Slider
                  value={[yearsExperience || 0]}
                  onValueChange={handleSliderChange}
                  max={30}
                  min={0}
                  step={1}
                  className="py-4"
                />
                <div className="flex justify-between text-sm text-text-muted mt-2">
                  <span>0 years</span>
                  <span className="font-medium text-mint text-lg">{yearsExperience} years</span>
                  <span>30+ years</span>
                </div>
              </div>
            </div>
          </div>

          {isTestMode && (
            <div className="mt-8 p-4 bg-yellow/10 rounded-xl border border-yellow/30">
              <p className="text-yellow-700 text-sm mb-2">
                🧪 Test Mode: Sample data available
              </p>
              <div className="text-xs text-yellow-600 mb-2">
                Will fill: Senior Software Engineer, TechCorp Inc, 5 years experience
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onSkip}
                className="text-yellow-700 hover:bg-yellow/20"
                data-testid="button-skip-question"
              >
                <SkipForward className="w-4 h-4 mr-1" />
                Use sample data
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
          disabled={!watch("jobTitle") || !watch("company")}
          className="bg-mint text-white px-6 py-2 rounded-full font-medium hover-scale hover:bg-mint/80 transition-colors disabled:opacity-50 disabled:hover:scale-100"
          data-testid="button-next"
        >
          Continue
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}