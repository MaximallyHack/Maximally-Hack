import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowRight, ArrowLeft, SkipForward, Award } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { JudgeApplicationData } from "./JudgeApplicationModal";

interface ExperienceFormProps {
  form: UseFormReturn<JudgeApplicationData>;
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
  isTestMode: boolean;
}

export function ExperienceForm({ form, onNext, onPrev, onSkip, isTestMode }: ExperienceFormProps) {
  const { register, watch, setValue } = form;
  
  const hasJudgingExperience = watch("hasJudgingExperience");
  const judgingDetails = watch("judgingDetails");

  return (
    <div className="flex flex-col min-h-full">
      <div className="flex-1 p-8">
        <div className="max-w-lg mx-auto">
          <div className="mb-8 text-center">
            <div className="w-16 h-16 bg-yellow/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-yellow-600" />
            </div>
            <h1 className="font-heading font-bold text-3xl text-text-dark mb-3">
              Have you judged hackathons or competitions before?
            </h1>
            <p className="text-text-muted text-lg">
              Don't worry if you haven't - we welcome first-time judges and provide guidance!
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setValue("hasJudgingExperience", true)}
                  className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                    hasJudgingExperience === true
                      ? 'border-yellow-500 bg-yellow/10 text-text-dark'
                      : 'border-soft-gray/30 bg-white hover:border-yellow/50'
                  }`}
                  data-testid="button-has-experience"
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">✅</div>
                    <div className="font-medium">Yes, I have experience</div>
                  </div>
                </button>
                
                <button
                  type="button"
                  onClick={() => {
                    setValue("hasJudgingExperience", false);
                    setValue("judgingDetails", "");
                  }}
                  className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                    hasJudgingExperience === false
                      ? 'border-yellow-500 bg-yellow/10 text-text-dark'
                      : 'border-soft-gray/30 bg-white hover:border-yellow/50'
                  }`}
                  data-testid="button-no-experience"
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">🌟</div>
                    <div className="font-medium">No, but I'm excited to start!</div>
                  </div>
                </button>
              </div>
            </div>

            {hasJudgingExperience === true && (
              <div className="space-y-2">
                <Label htmlFor="judgingDetails" className="text-base font-medium text-text-dark">
                  Tell us about your judging experience
                </Label>
                <Textarea
                  id="judgingDetails"
                  {...register("judgingDetails")}
                  placeholder="e.g. I've judged 3 local hackathons, mentored students in coding competitions, evaluated startup pitches..."
                  className="min-h-[120px] text-base rounded-xl border-2 focus:border-yellow-500"
                  data-testid="textarea-judging-details"
                />
                <p className="text-text-muted text-sm">
                  Include any relevant experience: hackathons, competitions, mentoring, etc.
                </p>
              </div>
            )}

            {hasJudgingExperience === false && (
              <div className="bg-mint/10 rounded-xl p-6 border border-mint/30">
                <h3 className="font-heading font-semibold text-lg mb-2 text-mint">
                  Perfect! We love first-time judges
                </h3>
                <div className="space-y-2 text-text-muted">
                  <p className="flex items-start gap-2">
                    <span className="text-mint">•</span>
                    We'll provide comprehensive judging guidelines
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-mint">•</span>
                    You'll be paired with experienced judges for support
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-mint">•</span>
                    Training sessions available before events
                  </p>
                </div>
              </div>
            )}
          </div>

          {isTestMode && (
            <div className="mt-8 p-4 bg-yellow/10 rounded-xl border border-yellow/30">
              <p className="text-yellow-700 text-sm mb-2">
                🧪 Test Mode: Sample experience available
              </p>
              <div className="text-xs text-yellow-600 mb-2">
                Will select "Yes" with sample judging experience text
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onSkip}
                className="text-yellow-700 hover:bg-yellow/20"
                data-testid="button-skip-question"
              >
                <SkipForward className="w-4 h-4 mr-1" />
                Use sample experience
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
          disabled={hasJudgingExperience === undefined}
          className="bg-yellow-500 text-white px-6 py-2 rounded-full font-medium hover-scale hover:bg-yellow-500/80 transition-colors disabled:opacity-50 disabled:hover:scale-100"
          data-testid="button-next"
        >
          Continue
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}