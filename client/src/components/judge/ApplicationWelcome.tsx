import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Clock, Users } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { JudgeApplicationData } from "./JudgeApplicationModal";

interface ApplicationWelcomeProps {
  form: UseFormReturn<JudgeApplicationData>;
  onNext: () => void;
  onSkipAll: () => void;
  isTestMode: boolean;
}

export function ApplicationWelcome({ onNext, onSkipAll, isTestMode }: ApplicationWelcomeProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-full p-8 text-center">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-coral to-mint rounded-full flex items-center justify-center">
            <Sparkles className="w-12 h-12 text-white" />
          </div>
          <h1 className="font-heading font-bold text-4xl text-text-dark mb-4">
            Join Our Expert Judge Community
          </h1>
          <p className="text-lg text-text-muted leading-relaxed">
            Help shape the future of innovation by evaluating groundbreaking projects 
            and mentoring the next generation of builders and creators.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-soft">
            <div className="w-12 h-12 bg-coral/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-6 h-6 text-coral" />
            </div>
            <h3 className="font-heading font-semibold text-lg mb-2">5-7 Minutes</h3>
            <p className="text-text-muted text-sm">Quick application process</p>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-soft">
            <div className="w-12 h-12 bg-sky/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-sky" />
            </div>
            <h3 className="font-heading font-semibold text-lg mb-2">Expert Network</h3>
            <p className="text-text-muted text-sm">Join 200+ industry leaders</p>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-soft">
            <div className="w-12 h-12 bg-mint/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-6 h-6 text-mint" />
            </div>
            <h3 className="font-heading font-semibold text-lg mb-2">Make Impact</h3>
            <p className="text-text-muted text-sm">Guide innovative projects</p>
          </div>
        </div>

        <div className="bg-soft-gray/30 rounded-2xl p-6 mb-8">
          <h3 className="font-heading font-semibold text-lg mb-3">What You'll Do as a Judge</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-coral rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-text-muted">Evaluate project submissions</span>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-sky rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-text-muted">Provide constructive feedback</span>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-mint rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-text-muted">Mentor participants</span>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-yellow rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-text-muted">Network with industry peers</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={onNext}
            className="bg-coral text-white px-8 py-4 rounded-full font-medium text-lg hover-scale hover:bg-coral/80 transition-colors"
            data-testid="button-start-application"
          >
            Start Application
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          
          {isTestMode && (
            <Button
              variant="outline"
              onClick={onSkipAll}
              className="border-2 border-yellow text-yellow-700 px-8 py-4 rounded-full font-medium text-lg hover-scale hover:bg-yellow/20 transition-colors"
              data-testid="button-skip-all"
            >
              Skip All (Test Mode)
            </Button>
          )}
        </div>
        
        {isTestMode && (
          <p className="text-yellow-600 text-sm mt-4">
            🧪 Test mode is enabled - you can skip questions or auto-fill with sample data
          </p>
        )}
      </div>
    </div>
  );
}