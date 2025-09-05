import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, ArrowLeft, SkipForward, Heart } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { JudgeApplicationData } from "./JudgeApplicationModal";

interface MotivationFormProps {
  form: UseFormReturn<JudgeApplicationData>;
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
  isTestMode: boolean;
}

export function MotivationForm({ form, onNext, onPrev, onSkip, isTestMode }: MotivationFormProps) {
  const { register, watch, formState: { errors } } = form;
  
  const motivation = watch("motivation") || "";
  const charCount = motivation.length;
  const minChars = 50;
  const maxChars = 500;

  return (
    <div className="flex flex-col min-h-full">
      <div className="flex-1 p-8">
        <div className="max-w-lg mx-auto">
          <div className="mb-8 text-center">
            <div className="w-16 h-16 bg-coral/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-coral" />
            </div>
            <h1 className="font-heading font-bold text-3xl text-text-dark mb-3">
              Why do you want to be a judge on Maximally Hack?
            </h1>
            <p className="text-text-muted text-lg">
              Help us understand your motivation and what drives your passion for innovation.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Textarea
                {...register("motivation")}
                placeholder="I'm excited to judge because I want to..."
                className="min-h-[160px] text-base rounded-xl border-2 focus:border-coral resize-none"
                maxLength={maxChars}
                data-testid="textarea-motivation"
              />
              
              <div className="flex justify-between items-center text-sm">
                <div className={`${charCount < minChars ? 'text-coral' : 'text-mint'}`}>
                  {charCount < minChars 
                    ? `${minChars - charCount} more characters needed`
                    : '✓ Minimum reached'
                  }
                </div>
                <div className={`${charCount > maxChars * 0.9 ? 'text-yellow-600' : 'text-text-muted'}`}>
                  {charCount}/{maxChars}
                </div>
              </div>
              
              {errors.motivation && (
                <p className="text-coral text-sm">{errors.motivation.message}</p>
              )}
            </div>

            <div className="bg-sky/10 rounded-xl p-6 border border-sky/30">
              <h3 className="font-heading font-semibold text-lg mb-3 text-sky">
                💡 Need inspiration? Consider mentioning:
              </h3>
              <div className="space-y-2 text-sm text-text-muted">
                <div className="flex items-start gap-2">
                  <span className="text-sky">•</span>
                  <span>Your passion for innovation and technology</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-sky">•</span>
                  <span>How you want to give back to the community</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-sky">•</span>
                  <span>What you hope to learn from participants</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-sky">•</span>
                  <span>Your experience with mentoring or coaching</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-sky">•</span>
                  <span>Specific areas where you can provide valuable feedback</span>
                </div>
              </div>
            </div>
          </div>

          {isTestMode && (
            <div className="mt-8 p-4 bg-yellow/10 rounded-xl border border-yellow/30">
              <p className="text-yellow-700 text-sm mb-2">
                🧪 Test Mode: Sample motivation available
              </p>
              <div className="text-xs text-yellow-600 mb-2 max-h-16 overflow-hidden">
                Will fill: "I'm passionate about fostering innovation and helping young developers grow..."
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onSkip}
                className="text-yellow-700 hover:bg-yellow/20"
                data-testid="button-skip-question"
              >
                <SkipForward className="w-4 h-4 mr-1" />
                Use sample motivation
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
          disabled={charCount < minChars}
          className="bg-coral text-white px-6 py-2 rounded-full font-medium hover-scale hover:bg-coral/80 transition-colors disabled:opacity-50 disabled:hover:scale-100"
          data-testid="button-next"
        >
          Continue
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}