import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, ArrowLeft, SkipForward, Globe, Github, Twitter, Link } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { JudgeApplicationData } from "./JudgeApplicationModal";

interface PortfolioLinksProps {
  form: UseFormReturn<JudgeApplicationData>;
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
  isTestMode: boolean;
}

export function PortfolioLinks({ form, onNext, onPrev, onSkip, isTestMode }: PortfolioLinksProps) {
  const { register, watch } = form;
  
  const portfolio = {
    website: watch("website") || "",
    github: watch("github") || "",
    twitter: watch("twitter") || "",
    otherLinks: watch("otherLinks") || "",
  };

  const hasAnyLinks = Object.values(portfolio).some(value => value.length > 0);

  return (
    <div className="flex flex-col min-h-full">
      <div className="flex-1 p-8">
        <div className="max-w-lg mx-auto">
          <div className="mb-8 text-center">
            <div className="w-16 h-16 bg-sky/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Globe className="w-8 h-8 text-sky" />
            </div>
            <h1 className="font-heading font-bold text-3xl text-text-dark mb-3">
              Share your work with us
            </h1>
            <p className="text-text-muted text-lg">
              This is completely optional, but helps us understand your background better.
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="website" className="text-base font-medium text-text-dark flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Personal Website
              </Label>
              <Input
                id="website"
                {...register("website")}
                placeholder="https://yourwebsite.com"
                className="h-12 text-base rounded-xl border-2 focus:border-sky"
                data-testid="input-website"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="github" className="text-base font-medium text-text-dark flex items-center gap-2">
                <Github className="w-4 h-4" />
                GitHub Profile
              </Label>
              <Input
                id="github"
                {...register("github")}
                placeholder="https://github.com/yourusername"
                className="h-12 text-base rounded-xl border-2 focus:border-sky"
                data-testid="input-github"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="twitter" className="text-base font-medium text-text-dark flex items-center gap-2">
                <Twitter className="w-4 h-4" />
                Twitter/X Profile
              </Label>
              <Input
                id="twitter"
                {...register("twitter")}
                placeholder="https://twitter.com/yourusername"
                className="h-12 text-base rounded-xl border-2 focus:border-sky"
                data-testid="input-twitter"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="otherLinks" className="text-base font-medium text-text-dark flex items-center gap-2">
                <Link className="w-4 h-4" />
                Other Links
              </Label>
              <Input
                id="otherLinks"
                {...register("otherLinks")}
                placeholder="Portfolio, blog, YouTube channel, etc."
                className="h-12 text-base rounded-xl border-2 focus:border-sky"
                data-testid="input-other-links"
              />
            </div>
          </div>

          {hasAnyLinks && (
            <div className="mt-6 bg-mint/10 rounded-xl p-4 border border-mint/30">
              <h3 className="font-heading font-semibold text-lg mb-2 text-mint">
                Great! We'll check out your work 🎉
              </h3>
              <p className="text-text-muted text-sm">
                Your portfolio helps us understand your expertise and match you with relevant hackathons.
              </p>
            </div>
          )}

          {!hasAnyLinks && (
            <div className="mt-6 bg-soft-gray/20 rounded-xl p-6 border border-soft-gray/30">
              <h3 className="font-heading font-semibold text-lg mb-2 text-text-dark">
                No problem at all! 👍
              </h3>
              <p className="text-text-muted text-sm">
                Your experience and motivation are what matter most. You can always add portfolio links later through your judge profile.
              </p>
            </div>
          )}

          {isTestMode && (
            <div className="mt-8 p-4 bg-yellow/10 rounded-xl border border-yellow/30">
              <p className="text-yellow-700 text-sm mb-2">
                🧪 Test Mode: Sample portfolio links available
              </p>
              <div className="text-xs text-yellow-600 mb-2">
                Will fill: Personal website, GitHub, and Twitter profiles
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onSkip}
                className="text-yellow-700 hover:bg-yellow/20"
                data-testid="button-skip-question"
              >
                <SkipForward className="w-4 h-4 mr-1" />
                Add sample links
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
          className="bg-sky text-white px-6 py-2 rounded-full font-medium hover-scale hover:bg-sky/80 transition-colors"
          data-testid="button-next"
        >
          Continue to Review
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}