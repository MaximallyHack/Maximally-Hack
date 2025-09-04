import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useConfetti } from "@/components/ui/confetti";
import { CrayonSquiggle } from "@/components/ui/floating-elements";
import { 
  User, 
  Users, 
  Gavel, 
  Calendar,
  ArrowRight, 
  ArrowLeft,
  Code,
  Palette,
  Brain,
  Smartphone,
  Globe,
  Database,
  Shield,
  Zap
} from "lucide-react";

type UserRole = 'participant' | 'organizer' | 'judge';

interface OnboardingData {
  role: UserRole;
  name: string;
  username: string;
  bio: string;
  location: string;
  skills: string[];
  interests: string[];
  experience: string;
  github: string;
  linkedin: string;
  website: string;
}

const roleOptions = [
  {
    id: 'participant' as UserRole,
    title: 'Participant',
    description: 'Join hackathons, build projects, and collaborate with teams',
    icon: <User className="w-8 h-8" />,
    color: 'coral',
    benefits: ['Join any hackathon', 'Find teammates', 'Submit projects', 'Win prizes']
  },
  {
    id: 'organizer' as UserRole,
    title: 'Organizer',
    description: 'Host and manage hackathons for your community',
    icon: <Calendar className="w-8 h-8" />,
    color: 'mint',
    benefits: ['Create events', 'Manage participants', 'Set up judging', 'Award prizes']
  },
  {
    id: 'judge' as UserRole,
    title: 'Judge',
    description: 'Evaluate projects and mentor participants',
    icon: <Gavel className="w-8 h-8" />,
    color: 'sky',
    benefits: ['Review submissions', 'Provide feedback', 'Select winners', 'Mentor teams']
  }
];

const skillOptions = [
  { name: 'Frontend', icon: <Code className="w-4 h-4" /> },
  { name: 'Backend', icon: <Database className="w-4 h-4" /> },
  { name: 'Mobile', icon: <Smartphone className="w-4 h-4" /> },
  { name: 'Design', icon: <Palette className="w-4 h-4" /> },
  { name: 'AI/ML', icon: <Brain className="w-4 h-4" /> },
  { name: 'DevOps', icon: <Shield className="w-4 h-4" /> },
  { name: 'Web3', icon: <Globe className="w-4 h-4" /> },
  { name: 'IoT', icon: <Zap className="w-4 h-4" /> },
];

const interestOptions = [
  'Healthcare', 'Education', 'Climate', 'Social Impact', 'FinTech', 'Gaming', 
  'E-commerce', 'Enterprise', 'Consumer Apps', 'Developer Tools', 'Security', 'AR/VR'
];

export default function Onboarding() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    role: 'participant',
    name: '',
    username: '',
    bio: '',
    location: '',
    skills: [],
    interests: [],
    experience: '',
    github: '',
    linkedin: '',
    website: ''
  });
  const { toast } = useToast();
  const { isActive: confettiActive, trigger: triggerConfetti, Confetti } = useConfetti();

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const handleRoleSelect = (role: UserRole) => {
    setData(prev => ({ ...prev, role }));
    setStep(2);
  };

  const toggleSkill = (skill: string) => {
    setData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const toggleInterest = (interest: string) => {
    setData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleComplete = () => {
    triggerConfetti();
    toast({
      title: "Welcome to HackSpace! 🎉",
      description: "Your profile has been created successfully.",
    });
    
    setTimeout(() => {
      setLocation('/');
    }, 2000);
  };

  const isStepValid = () => {
    switch (step) {
      case 2:
        return data.name.trim() && data.username.trim();
      case 3:
        return data.skills.length > 0;
      case 4:
        return true; // Optional step
      default:
        return true;
    }
  };

  return (
    <div className="min-h-screen bg-cream py-8 px-4" data-testid="onboarding-page">
      <Confetti />
      
      <div className="max-w-2xl mx-auto">
        {/* Progress Header */}
        <div className="text-center mb-8">
          <h1 className="font-heading font-bold text-3xl text-text-dark mb-2">Welcome to HackSpace</h1>
          <p className="text-text-muted mb-6">Let's set up your profile in just a few steps</p>
          
          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm text-text-muted">Step {step} of {totalSteps}</span>
            <Progress value={progress} className="flex-1 h-2" />
            <span className="text-sm text-text-muted">{Math.round(progress)}%</span>
          </div>
        </div>

        {/* Step 1: Role Selection */}
        {step === 1 && (
          <Card className="bg-white rounded-2xl p-8 shadow-soft border border-soft-gray">
            <div className="text-center mb-8">
              <h2 className="font-heading font-bold text-2xl text-text-dark mb-2">Choose Your Role</h2>
              <CrayonSquiggle className="mx-auto mb-4" />
              <p className="text-text-muted">How would you like to participate in HackSpace?</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {roleOptions.map((role) => (
                <div
                  key={role.id}
                  onClick={() => handleRoleSelect(role.id)}
                  className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-200 hover-scale ${
                    data.role === role.id 
                      ? `border-${role.color} bg-${role.color}/10` 
                      : 'border-soft-gray hover:border-soft-gray/60'
                  }`}
                  data-testid={`role-option-${role.id}`}
                >
                  <div className={`w-16 h-16 bg-${role.color} rounded-full flex items-center justify-center mx-auto mb-4 text-white`}>
                    {role.icon}
                  </div>
                  <h3 className="font-heading font-semibold text-lg text-text-dark text-center mb-2">
                    {role.title}
                  </h3>
                  <p className="text-text-muted text-sm text-center mb-4">
                    {role.description}
                  </p>
                  <div className="space-y-2">
                    {role.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center gap-2 text-xs text-text-muted">
                        <div className={`w-1.5 h-1.5 bg-${role.color} rounded-full`}></div>
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Step 2: Basic Info */}
        {step === 2 && (
          <Card className="bg-white rounded-2xl p-8 shadow-soft border border-soft-gray">
            <div className="text-center mb-8">
              <h2 className="font-heading font-bold text-2xl text-text-dark mb-2">Tell Us About Yourself</h2>
              <CrayonSquiggle className="mx-auto mb-4" />
              <p className="text-text-muted">Basic information for your profile</p>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-2">Full Name *</label>
                  <Input
                    value={data.name}
                    onChange={(e) => setData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Your full name"
                    className="border-soft-gray focus:ring-2 focus:ring-coral focus:border-transparent"
                    data-testid="input-name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-2">Username *</label>
                  <Input
                    value={data.username}
                    onChange={(e) => setData(prev => ({ ...prev, username: e.target.value }))}
                    placeholder="username"
                    className="border-soft-gray focus:ring-2 focus:ring-coral focus:border-transparent"
                    data-testid="input-username"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-dark mb-2">Location</label>
                <Input
                  value={data.location}
                  onChange={(e) => setData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="City, Country"
                  className="border-soft-gray focus:ring-2 focus:ring-coral focus:border-transparent"
                  data-testid="input-location"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-dark mb-2">Bio</label>
                <Textarea
                  value={data.bio}
                  onChange={(e) => setData(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Tell us a bit about yourself and your interests..."
                  rows={4}
                  className="border-soft-gray focus:ring-2 focus:ring-coral focus:border-transparent"
                  data-testid="textarea-bio"
                />
              </div>
            </div>
          </Card>
        )}

        {/* Step 3: Skills & Interests */}
        {step === 3 && (
          <Card className="bg-white rounded-2xl p-8 shadow-soft border border-soft-gray">
            <div className="text-center mb-8">
              <h2 className="font-heading font-bold text-2xl text-text-dark mb-2">Your Skills & Interests</h2>
              <CrayonSquiggle className="mx-auto mb-4" />
              <p className="text-text-muted">Help us match you with relevant opportunities</p>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="font-heading font-semibold text-lg text-text-dark mb-4">Skills *</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {skillOptions.map((skill) => (
                    <Badge
                      key={skill.name}
                      onClick={() => toggleSkill(skill.name)}
                      className={`cursor-pointer transition-colors p-3 rounded-xl border-0 ${
                        data.skills.includes(skill.name)
                          ? 'bg-coral text-white'
                          : 'bg-soft-gray text-text-dark hover:bg-soft-gray/80'
                      }`}
                      data-testid={`skill-${skill.name.toLowerCase()}`}
                    >
                      <div className="flex items-center gap-2">
                        {skill.icon}
                        <span>{skill.name}</span>
                      </div>
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-heading font-semibold text-lg text-text-dark mb-4">Interests</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {interestOptions.map((interest) => (
                    <Badge
                      key={interest}
                      onClick={() => toggleInterest(interest)}
                      className={`cursor-pointer transition-colors p-2 rounded-full border-0 text-center ${
                        data.interests.includes(interest)
                          ? 'bg-sky text-white'
                          : 'bg-soft-gray text-text-dark hover:bg-soft-gray/80'
                      }`}
                      data-testid={`interest-${interest.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                    >
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Step 4: Social Links */}
        {step === 4 && (
          <Card className="bg-white rounded-2xl p-8 shadow-soft border border-soft-gray">
            <div className="text-center mb-8">
              <h2 className="font-heading font-bold text-2xl text-text-dark mb-2">Connect Your Profiles</h2>
              <CrayonSquiggle className="mx-auto mb-4" />
              <p className="text-text-muted">Optional: Link your professional profiles</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-dark mb-2">GitHub Username</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted text-sm">
                    github.com/
                  </span>
                  <Input
                    value={data.github}
                    onChange={(e) => setData(prev => ({ ...prev, github: e.target.value }))}
                    placeholder="username"
                    className="pl-20 border-soft-gray focus:ring-2 focus:ring-coral focus:border-transparent"
                    data-testid="input-github"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-dark mb-2">LinkedIn Profile</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted text-sm">
                    linkedin.com/in/
                  </span>
                  <Input
                    value={data.linkedin}
                    onChange={(e) => setData(prev => ({ ...prev, linkedin: e.target.value }))}
                    placeholder="username"
                    className="pl-28 border-soft-gray focus:ring-2 focus:ring-coral focus:border-transparent"
                    data-testid="input-linkedin"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-dark mb-2">Personal Website</label>
                <Input
                  value={data.website}
                  onChange={(e) => setData(prev => ({ ...prev, website: e.target.value }))}
                  placeholder="https://yourwebsite.com"
                  className="border-soft-gray focus:ring-2 focus:ring-coral focus:border-transparent"
                  data-testid="input-website"
                />
              </div>
            </div>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          {step > 1 && (
            <Button
              variant="outline"
              onClick={() => setStep(step - 1)}
              className="border-soft-gray text-text-dark hover:bg-soft-gray/50 rounded-full px-6"
              data-testid="button-back"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          )}
          
          <div className="flex-1" />
          
          {step < totalSteps ? (
            <Button
              onClick={() => setStep(step + 1)}
              disabled={!isStepValid()}
              className="bg-coral text-white hover:bg-coral/80 rounded-full px-6"
              data-testid="button-next"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleComplete}
              className="bg-coral text-white hover:bg-coral/80 rounded-full px-8"
              data-testid="button-complete"
            >
              Complete Setup 🎉
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
