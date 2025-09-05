import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ArrowLeft, SkipForward, Calendar } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { JudgeApplicationData } from "./JudgeApplicationModal";

interface AvailabilityFormProps {
  form: UseFormReturn<JudgeApplicationData>;
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
  isTestMode: boolean;
}

const AVAILABILITY_OPTIONS = [
  { id: "weekdays", label: "Weekdays", emoji: "🗓️" },
  { id: "weekends", label: "Weekends", emoji: "🏖️" },
  { id: "evenings", label: "Evenings", emoji: "🌆" },
  { id: "mornings", label: "Mornings", emoji: "🌅" },
  { id: "flexible", label: "Flexible", emoji: "🤝" },
];

const EVENT_TYPES = [
  { id: "virtual", label: "Virtual Events", emoji: "💻" },
  { id: "in-person", label: "In-Person Events", emoji: "🏢" },
  { id: "hybrid", label: "Hybrid Events", emoji: "🔀" },
];

const TIMEZONES = [
  "PST (Pacific)",
  "MST (Mountain)", 
  "CST (Central)",
  "EST (Eastern)",
  "UTC (GMT)",
  "CET (Central European)",
  "IST (India)",
  "JST (Japan)",
  "AEST (Australia Eastern)",
  "Other"
];

export function AvailabilityForm({ form, onNext, onPrev, onSkip, isTestMode }: AvailabilityFormProps) {
  const { watch, setValue, formState: { errors } } = form;
  
  const availability = watch("availability") || [];
  const eventTypes = watch("eventTypes") || [];
  const timezone = watch("timezone");

  const toggleAvailability = (option: string) => {
    const current = availability;
    const isSelected = current.includes(option);
    
    if (isSelected) {
      setValue("availability", current.filter(item => item !== option));
    } else {
      setValue("availability", [...current, option]);
    }
  };

  const toggleEventType = (type: string) => {
    const current = eventTypes;
    const isSelected = current.includes(type);
    
    if (isSelected) {
      setValue("eventTypes", current.filter(item => item !== type));
    } else {
      setValue("eventTypes", [...current, type]);
    }
  };

  return (
    <div className="flex flex-col min-h-full">
      <div className="flex-1 p-8">
        <div className="max-w-lg mx-auto">
          <div className="mb-8 text-center">
            <div className="w-16 h-16 bg-coral/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-coral" />
            </div>
            <h1 className="font-heading font-bold text-3xl text-text-dark mb-3">
              When are you typically available?
            </h1>
            <p className="text-text-muted text-lg">
              Help us match you with events that fit your schedule.
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <Label className="text-base font-medium text-text-dark">
                Your Timezone *
              </Label>
              <Select value={timezone} onValueChange={(value) => setValue("timezone", value)}>
                <SelectTrigger className="h-12 rounded-xl border-2">
                  <SelectValue placeholder="Select your timezone" />
                </SelectTrigger>
                <SelectContent>
                  {TIMEZONES.map((tz) => (
                    <SelectItem key={tz} value={tz}>
                      {tz}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.timezone && (
                <p className="text-coral text-sm">{errors.timezone.message}</p>
              )}
            </div>

            <div className="space-y-3">
              <Label className="text-base font-medium text-text-dark">
                When are you usually available? *
              </Label>
              <div className="flex flex-wrap gap-3">
                {AVAILABILITY_OPTIONS.map((option) => {
                  const isSelected = availability.includes(option.label);
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => toggleAvailability(option.label)}
                      className={`px-4 py-3 rounded-xl border-2 transition-all hover-scale ${
                        isSelected 
                          ? 'border-coral bg-coral text-white'
                          : 'border-soft-gray/30 bg-white hover:border-coral/50'
                      }`}
                      data-testid={`availability-${option.id}`}
                    >
                      <span className="mr-2">{option.emoji}</span>
                      {option.label}
                    </button>
                  );
                })}
              </div>
              {errors.availability && (
                <p className="text-coral text-sm">{errors.availability.message}</p>
              )}
            </div>

            <div className="space-y-3">
              <Label className="text-base font-medium text-text-dark">
                Event types you'd like to judge *
              </Label>
              <div className="flex flex-wrap gap-3">
                {EVENT_TYPES.map((type) => {
                  const isSelected = eventTypes.includes(type.label);
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => toggleEventType(type.label)}
                      className={`px-4 py-3 rounded-xl border-2 transition-all hover-scale ${
                        isSelected 
                          ? 'border-sky bg-sky text-white'
                          : 'border-soft-gray/30 bg-white hover:border-sky/50'
                      }`}
                      data-testid={`event-type-${type.id}`}
                    >
                      <span className="mr-2">{type.emoji}</span>
                      {type.label}
                    </button>
                  );
                })}
              </div>
              {errors.eventTypes && (
                <p className="text-coral text-sm">{errors.eventTypes.message}</p>
              )}
            </div>

            {(availability.length > 0 || eventTypes.length > 0) && (
              <div className="bg-soft-gray/20 rounded-xl p-4">
                <h3 className="font-medium mb-2">Your Preferences</h3>
                <div className="space-y-2">
                  {availability.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      <span className="text-sm text-text-muted">Available:</span>
                      {availability.map((item) => (
                        <Badge key={item} className="bg-coral/20 text-coral text-xs">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  )}
                  {eventTypes.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      <span className="text-sm text-text-muted">Events:</span>
                      {eventTypes.map((item) => (
                        <Badge key={item} className="bg-sky/20 text-sky text-xs">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {isTestMode && (
            <div className="mt-8 p-4 bg-yellow/10 rounded-xl border border-yellow/30">
              <p className="text-yellow-700 text-sm mb-2">
                🧪 Test Mode: Default availability settings
              </p>
              <div className="text-xs text-yellow-600 mb-2">
                Will set: PST timezone, Weekends + Evening availability, Virtual + In-person events
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onSkip}
                className="text-yellow-700 hover:bg-yellow/20"
                data-testid="button-skip-question"
              >
                <SkipForward className="w-4 h-4 mr-1" />
                Use default settings
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
          disabled={!timezone || availability.length === 0 || eventTypes.length === 0}
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