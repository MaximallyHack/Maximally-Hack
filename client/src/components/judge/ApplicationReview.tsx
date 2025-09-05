import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Send, Edit, Globe, Github, Twitter, Link, Mail, Briefcase, MapPin, Clock, Award } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { JudgeApplicationData } from "./JudgeApplicationModal";

interface ApplicationReviewProps {
  form: UseFormReturn<JudgeApplicationData>;
  onPrev: () => void;
  onSubmit: () => void;
  isTestMode: boolean;
}

export function ApplicationReview({ form, onPrev, onSubmit, isTestMode }: ApplicationReviewProps) {
  const data = form.watch();

  const sections = [
    {
      title: "Personal Information",
      icon: <Mail className="w-5 h-5" />,
      fields: [
        { label: "Full Name", value: data.fullName },
        { label: "Email", value: data.email },
        { label: "LinkedIn", value: data.linkedin || "Not provided" },
      ]
    },
    {
      title: "Professional Background", 
      icon: <Briefcase className="w-5 h-5" />,
      fields: [
        { label: "Job Title", value: data.jobTitle },
        { label: "Company", value: data.company },
        { label: "Years of Experience", value: `${data.yearsExperience} years` },
      ]
    },
    {
      title: "Expertise Areas",
      icon: <Award className="w-5 h-5" />,
      content: (
        <div className="flex flex-wrap gap-2">
          {data.expertiseAreas?.map((area) => (
            <Badge key={area} className="bg-sky/20 text-sky">
              {area}
            </Badge>
          ))}
        </div>
      )
    },
    {
      title: "Judging Experience",
      icon: <Award className="w-5 h-5" />,
      fields: [
        { 
          label: "Previous Experience", 
          value: data.hasJudgingExperience ? "Yes" : "First time judge" 
        },
        ...(data.judgingDetails ? [{ label: "Details", value: data.judgingDetails }] : [])
      ]
    },
    {
      title: "Availability",
      icon: <Clock className="w-5 h-5" />,
      fields: [
        { label: "Timezone", value: data.timezone },
      ],
      content: (
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-text-muted">Available:</span>
            {data.availability?.map((item) => (
              <Badge key={item} className="bg-coral/20 text-coral text-xs">
                {item}
              </Badge>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-text-muted">Event Types:</span>
            {data.eventTypes?.map((item) => (
              <Badge key={item} className="bg-mint/20 text-mint text-xs">
                {item}
              </Badge>
            ))}
          </div>
        </div>
      )
    },
  ];

  const portfolioLinks = [
    { label: "Website", value: data.website, icon: <Globe className="w-4 h-4" /> },
    { label: "GitHub", value: data.github, icon: <Github className="w-4 h-4" /> },
    { label: "Twitter", value: data.twitter, icon: <Twitter className="w-4 h-4" /> },
    { label: "Other Links", value: data.otherLinks, icon: <Link className="w-4 h-4" /> },
  ].filter(link => link.value);

  return (
    <div className="flex flex-col min-h-full">
      <div className="flex-1 p-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="font-heading font-bold text-3xl text-text-dark mb-3">
              Review Your Application
            </h1>
            <p className="text-text-muted text-lg">
              Please review all information before submitting. You can go back to make changes if needed.
            </p>
          </div>

          <div className="space-y-6">
            {sections.map((section, index) => (
              <div key={section.title} className="bg-white rounded-2xl p-6 shadow-soft border border-soft-gray/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-sky/20 rounded-full flex items-center justify-center">
                    {section.icon}
                  </div>
                  <h3 className="font-heading font-semibold text-xl text-text-dark">
                    {section.title}
                  </h3>
                </div>
                
                {section.fields && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {section.fields.map((field) => (
                      <div key={field.label}>
                        <div className="text-sm font-medium text-text-muted mb-1">
                          {field.label}
                        </div>
                        <div className="text-text-dark">
                          {field.value || "Not provided"}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {section.content && section.content}
              </div>
            ))}

            {/* Motivation Section */}
            <div className="bg-white rounded-2xl p-6 shadow-soft border border-soft-gray/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-coral/20 rounded-full flex items-center justify-center">
                  <Edit className="w-5 h-5" />
                </div>
                <h3 className="font-heading font-semibold text-xl text-text-dark">
                  Motivation
                </h3>
              </div>
              <div className="bg-soft-gray/20 rounded-xl p-4">
                <p className="text-text-dark leading-relaxed">
                  "{data.motivation}"
                </p>
              </div>
            </div>

            {/* Portfolio Links */}
            {portfolioLinks.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-soft border border-soft-gray/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-mint/20 rounded-full flex items-center justify-center">
                    <Globe className="w-5 h-5" />
                  </div>
                  <h3 className="font-heading font-semibold text-xl text-text-dark">
                    Portfolio & Links
                  </h3>
                </div>
                <div className="space-y-3">
                  {portfolioLinks.map((link) => (
                    <div key={link.label} className="flex items-center gap-3">
                      <div className="text-mint">{link.icon}</div>
                      <div>
                        <div className="text-sm font-medium text-text-muted">
                          {link.label}
                        </div>
                        <a 
                          href={link.value} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sky hover:underline break-all"
                        >
                          {link.value}
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {isTestMode && (
              <div className="bg-yellow/10 rounded-2xl p-6 border border-yellow/30">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-2 h-2 bg-yellow rounded-full"></div>
                  <h3 className="font-heading font-semibold text-lg text-yellow-700">
                    Test Mode Active
                  </h3>
                </div>
                <p className="text-yellow-700 text-sm">
                  🧪 This is a test submission. The application will be logged to the console but not actually sent to our team.
                </p>
              </div>
            )}
          </div>
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
          Back to Edit
        </Button>
        
        <Button
          onClick={onSubmit}
          className={`px-8 py-3 rounded-full font-medium hover-scale transition-colors ${
            isTestMode 
              ? 'bg-yellow-500 text-white hover:bg-yellow-500/80'
              : 'bg-mint text-white hover:bg-mint/80'
          }`}
          data-testid="button-submit"
        >
          {isTestMode ? 'Submit Test Application' : 'Submit Application'}
          <Send className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}