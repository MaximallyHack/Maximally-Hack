import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogOverlay, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { X, ArrowLeft, ArrowRight, SkipForward } from "lucide-react";
import { ApplicationWelcome } from "./ApplicationWelcome";
import { PersonalInfo } from "./PersonalInfo";
import { ProfessionalBackground } from "./ProfessionalBackground";
import { ExpertiseSelection } from "./ExpertiseSelection";
import { ExperienceForm } from "./ExperienceForm";
import { AvailabilityForm } from "./AvailabilityForm";
import { MotivationForm } from "./MotivationForm";
import { PortfolioLinks } from "./PortfolioLinks";
import { ApplicationReview } from "./ApplicationReview";
import { SuccessScreen } from "./SuccessScreen";

export const judgeApplicationSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Valid email is required"),
  linkedin: z.string().optional(),
  jobTitle: z.string().min(2, "Job title is required"),
  company: z.string().min(2, "Company is required"),
  yearsExperience: z.number().min(0).max(50),
  expertiseAreas: z.array(z.string()).min(1, "Select at least one expertise area"),
  hasJudgingExperience: z.boolean(),
  judgingDetails: z.string().optional(),
  timezone: z.string().min(1, "Timezone is required"),
  availability: z.array(z.string()).min(1, "Select at least one availability option"),
  eventTypes: z.array(z.string()).min(1, "Select at least one event type"),
  motivation: z.string().min(50, "Please explain your motivation (minimum 50 characters)"),
  website: z.string().optional(),
  github: z.string().optional(),
  twitter: z.string().optional(),
  otherLinks: z.string().optional(),
});

export type JudgeApplicationData = z.infer<typeof judgeApplicationSchema>;

const TOTAL_STEPS = 11;

const STEP_TITLES = [
  "Welcome",
  "Personal Info", 
  "Contact Details",
  "Professional Background",
  "Expertise Areas",
  "Judging Experience", 
  "Availability",
  "Motivation",
  "Portfolio (Optional)",
  "Review Application",
  "Success"
];

interface JudgeApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function JudgeApplicationModal({ isOpen, onClose }: JudgeApplicationModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isTestMode, setIsTestMode] = useState(true); // Enable test mode by default
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const form = useForm<JudgeApplicationData>({
    resolver: zodResolver(judgeApplicationSchema),
    defaultValues: {
      fullName: "",
      email: "",
      linkedin: "",
      jobTitle: "",
      company: "",
      yearsExperience: 0,
      expertiseAreas: [],
      hasJudgingExperience: false,
      judgingDetails: "",
      timezone: "",
      availability: [],
      eventTypes: [],
      motivation: "",
      website: "",
      github: "",
      twitter: "",
      otherLinks: "",
    },
    mode: "onChange"
  });

  // Save draft to localStorage
  const saveDraft = () => {
    if (currentStep > 0) {
      localStorage.setItem('judgeApplicationDraft', JSON.stringify({
        data: form.getValues(),
        step: currentStep,
        timestamp: Date.now()
      }));
    }
  };

  // Load draft from localStorage
  useEffect(() => {
    if (isOpen) {
      const draft = localStorage.getItem('judgeApplicationDraft');
      if (draft && !hasSubmitted) {
        try {
          const parsedDraft = JSON.parse(draft);
          const daysSinceLastSave = (Date.now() - parsedDraft.timestamp) / (1000 * 60 * 60 * 24);
          
          if (daysSinceLastSave < 7) { // Keep draft for a week
            form.reset(parsedDraft.data);
            setCurrentStep(parsedDraft.step);
          }
        } catch (e) {
          // Ignore invalid draft data
        }
      }
    }
  }, [isOpen, form, hasSubmitted]);

  // Save draft on form changes
  useEffect(() => {
    const subscription = form.watch(() => saveDraft());
    return () => subscription.unsubscribe();
  }, [form, currentStep]);

  const nextStep = async () => {
    let fieldsToValidate: (keyof JudgeApplicationData)[] = [];
    
    switch (currentStep) {
      case 1:
        fieldsToValidate = ['fullName'];
        break;
      case 2:
        fieldsToValidate = ['email'];
        break;
      case 3:
        fieldsToValidate = ['jobTitle', 'company'];
        break;
      case 4:
        fieldsToValidate = ['expertiseAreas'];
        break;
      case 6:
        fieldsToValidate = ['timezone', 'availability', 'eventTypes'];
        break;
      case 7:
        fieldsToValidate = ['motivation'];
        break;
    }

    if (fieldsToValidate.length > 0) {
      const isValid = await form.trigger(fieldsToValidate);
      if (!isValid && !isTestMode) return;
    }

    setCurrentStep(prev => Math.min(prev + 1, TOTAL_STEPS - 1));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const skipStep = () => {
    if (isTestMode) {
      fillTestData(currentStep);
      nextStep();
    }
  };

  const skipToEnd = () => {
    if (isTestMode) {
      fillAllTestData();
      setCurrentStep(TOTAL_STEPS - 2); // Go to review step
    }
  };

  const fillTestData = (step: number) => {
    const testData: Partial<JudgeApplicationData> = {};
    
    switch (step) {
      case 1:
        testData.fullName = "Alex Johnson";
        break;
      case 2:
        testData.email = "alex.johnson@example.com";
        testData.linkedin = "https://linkedin.com/in/alexjohnson";
        break;
      case 3:
        testData.jobTitle = "Senior Software Engineer";
        testData.company = "TechCorp Inc";
        testData.yearsExperience = 5;
        break;
      case 4:
        testData.expertiseAreas = ["Web Development", "AI/ML", "Mobile Development"];
        break;
      case 5:
        testData.hasJudgingExperience = true;
        testData.judgingDetails = "I've judged 3 local hackathons and mentored students in coding competitions.";
        break;
      case 6:
        testData.timezone = "PST";
        testData.availability = ["Weekends", "Evening"];
        testData.eventTypes = ["Virtual", "In-person"];
        break;
      case 7:
        testData.motivation = "I'm passionate about fostering innovation and helping young developers grow. Judging hackathons allows me to give back to the community while discovering amazing new ideas and technologies.";
        break;
      case 8:
        testData.website = "https://alexjohnson.dev";
        testData.github = "https://github.com/alexjohnson";
        testData.twitter = "https://twitter.com/alexjohnson";
        break;
    }
    
    Object.entries(testData).forEach(([key, value]) => {
      form.setValue(key as keyof JudgeApplicationData, value as any);
    });
  };

  const fillAllTestData = () => {
    const allTestData: JudgeApplicationData = {
      fullName: "Alex Johnson",
      email: "alex.johnson@example.com",
      linkedin: "https://linkedin.com/in/alexjohnson",
      jobTitle: "Senior Software Engineer",
      company: "TechCorp Inc",
      yearsExperience: 5,
      expertiseAreas: ["Web Development", "AI/ML", "Mobile Development"],
      hasJudgingExperience: true,
      judgingDetails: "I've judged 3 local hackathons and mentored students in coding competitions.",
      timezone: "PST",
      availability: ["Weekends", "Evening"],
      eventTypes: ["Virtual", "In-person"],
      motivation: "I'm passionate about fostering innovation and helping young developers grow. Judging hackathons allows me to give back to the community while discovering amazing new ideas and technologies.",
      website: "https://alexjohnson.dev",
      github: "https://github.com/alexjohnson",
      twitter: "https://twitter.com/alexjohnson",
      otherLinks: "",
    };
    
    form.reset(allTestData);
  };

  const handleSubmit = async () => {
    const isValid = await form.trigger();
    if (isValid || isTestMode) {
      console.log('Judge Application Submitted:', form.getValues());
      localStorage.removeItem('judgeApplicationDraft'); // Clear draft
      setHasSubmitted(true);
      setCurrentStep(TOTAL_STEPS - 1); // Go to success screen
    }
  };

  const handleClose = () => {
    if (currentStep === TOTAL_STEPS - 1) {
      // Reset everything when closing from success screen
      setCurrentStep(0);
      setHasSubmitted(false);
      form.reset();
      localStorage.removeItem('judgeApplicationDraft');
    }
    onClose();
  };

  const progress = ((currentStep) / (TOTAL_STEPS - 1)) * 100;

  const renderCurrentStep = () => {
    const stepProps = {
      form,
      onNext: nextStep,
      onPrev: prevStep,
      onSkip: skipStep,
      isTestMode,
    };

    switch (currentStep) {
      case 0:
        return <ApplicationWelcome {...stepProps} onSkipAll={skipToEnd} />;
      case 1:
        return <PersonalInfo {...stepProps} />;
      case 2:
        return <PersonalInfo {...stepProps} step="contact" />;
      case 3:
        return <ProfessionalBackground {...stepProps} />;
      case 4:
        return <ExpertiseSelection {...stepProps} />;
      case 5:
        return <ExperienceForm {...stepProps} />;
      case 6:
        return <AvailabilityForm {...stepProps} />;
      case 7:
        return <MotivationForm {...stepProps} />;
      case 8:
        return <PortfolioLinks {...stepProps} />;
      case 9:
        return <ApplicationReview {...stepProps} onSubmit={handleSubmit} />;
      case 10:
        return <SuccessScreen onClose={handleClose} isTestMode={isTestMode} />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogOverlay className="bg-black/50 backdrop-blur-sm" />
      <DialogContent className="max-w-4xl w-full h-[90vh] p-0 overflow-hidden bg-cream border-none">
        <DialogTitle className="sr-only">{STEP_TITLES[currentStep]}</DialogTitle>
        <DialogDescription className="sr-only">
          {currentStep === 0 ? "Welcome to the Judge Application Process" : "Step " + (currentStep + 1) + " of " + TOTAL_STEPS + " in the Judge Application"}
        </DialogDescription>
        
        {/* Test Mode Banner */}
        {isTestMode && currentStep < TOTAL_STEPS - 1 && (
          <div className="bg-yellow/20 border-b border-yellow/30 px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow rounded-full"></div>
              <span className="text-yellow-700 font-medium text-sm">TEST MODE - This application won't be submitted</span>
            </div>
            <Button
              variant="ghost" 
              size="sm"
              onClick={() => setIsTestMode(false)}
              className="text-yellow-700 hover:bg-yellow/10"
            >
              Disable Test Mode
            </Button>
          </div>
        )}

        {/* Header with Progress */}
        {currentStep < TOTAL_STEPS - 1 && (
          <div className="px-6 py-4 border-b border-soft-gray/20">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClose}
                  className="hover:bg-soft-gray/20"
                >
                  <X className="w-4 h-4" />
                </Button>
                <h2 className="font-heading font-bold text-lg text-text-dark">
                  {STEP_TITLES[currentStep]}
                </h2>
              </div>
              <div className="text-sm text-text-muted">
                {currentStep + 1} of {TOTAL_STEPS - 1}
              </div>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          {renderCurrentStep()}
        </div>
      </DialogContent>
    </Dialog>
  );
}