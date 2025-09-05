import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, ArrowLeft, SkipForward } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { JudgeApplicationData } from "./JudgeApplicationModal";

interface PersonalInfoProps {
  form: UseFormReturn<JudgeApplicationData>;
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
  isTestMode: boolean;
  step?: "basic" | "contact";
}

export function PersonalInfo({ form, onNext, onPrev, onSkip, isTestMode, step = "basic" }: PersonalInfoProps) {
  const { register, formState: { errors }, watch } = form;
  
  const isBasicStep = step === "basic";
  
  return (
    <div className="flex flex-col min-h-full">
      <div className="flex-1 p-8">
        <div className="max-w-lg mx-auto">
          <div className="mb-8">
            <h1 className="font-heading font-bold text-3xl text-text-dark mb-3">
              {isBasicStep ? "Let's start with the basics" : "How can we reach you?"}
            </h1>
            <p className="text-text-muted text-lg">
              {isBasicStep 
                ? "We'd love to know who you are and get to know you better."
                : "We'll use this information to contact you about your application and future opportunities."
              }
            </p>
          </div>

          <div className="space-y-6">
            {isBasicStep ? (
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-base font-medium text-text-dark">
                  What's your full name? *
                </Label>
                <Input
                  id="fullName"
                  {...register("fullName")}
                  placeholder="Enter your full name"
                  className="h-12 text-base rounded-xl border-2 focus:border-coral"
                  data-testid="input-fullname"
                />
                {errors.fullName && (
                  <p className="text-coral text-sm">{errors.fullName.message}</p>
                )}
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-base font-medium text-text-dark">
                    Your email address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    placeholder="your.email@example.com"
                    className="h-12 text-base rounded-xl border-2 focus:border-coral"
                    data-testid="input-email"
                  />
                  {errors.email && (
                    <p className="text-coral text-sm">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="linkedin" className="text-base font-medium text-text-dark">
                    LinkedIn Profile
                    <span className="text-text-muted ml-2">(Optional)</span>
                  </Label>
                  <Input
                    id="linkedin"
                    {...register("linkedin")}
                    placeholder="https://linkedin.com/in/yourprofile"
                    className="h-12 text-base rounded-xl border-2 focus:border-sky"
                    data-testid="input-linkedin"
                  />
                </div>
              </>
            )}
          </div>

          {isTestMode && (
            <div className="mt-8 p-4 bg-yellow/10 rounded-xl border border-yellow/30">
              <p className="text-yellow-700 text-sm mb-2">
                🧪 Test Mode: Skip this question or auto-fill with sample data
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={onSkip}
                className="text-yellow-700 hover:bg-yellow/20"
                data-testid="button-skip-question"
              >
                <SkipForward className="w-4 h-4 mr-1" />
                Skip this question
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
          disabled={isBasicStep ? !watch("fullName") : !watch("email")}
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