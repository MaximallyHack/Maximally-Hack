import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { CrayonSquiggle } from "@/components/ui/floating-elements";
import { 
  User, 
  MapPin, 
  Linkedin, 
  Twitter, 
  Globe,
  Star,
  Gavel,
  ArrowRight
} from "lucide-react";

interface JudgeData {
  name: string;
  email: string;
  headline: string;
  region: string;
  bio: string;
  linkedin: string;
  twitter: string;
  website: string;
  expertise: string[];
}

const expertiseOptions = [
  "AI/ML", "Web Development", "Mobile", "Design", "Backend", "Frontend",
  "DevOps", "Data Science", "Blockchain", "IoT", "Security", "Product",
  "No-code", "AR/VR", "Gaming", "Fintech", "Healthcare", "Education"
];

const defaultJudgeData: JudgeData = {
  name: '',
  email: '',
  headline: '',
  region: '',
  bio: '',
  linkedin: '',
  twitter: '',
  website: '',
  expertise: []
};

export default function JudgeRegister() {
  const [, setLocation] = useLocation();
  const [data, setData] = useState<JudgeData>(defaultJudgeData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const toggleExpertise = (skill: string) => {
    setData(prev => ({
      ...prev,
      expertise: prev.expertise.includes(skill)
        ? prev.expertise.filter(s => s !== skill)
        : [...prev.expertise, skill]
    }));
  };

  const handleSubmit = async () => {
    if (!data.name || !data.email || !data.headline || data.expertise.length === 0) {
      toast({
        title: "Missing required fields",
        description: "Please fill in name, email, headline, and select at least one expertise area.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const judgeId = `judge-${Date.now()}`;
    
    toast({
      title: "Welcome to the Judge Hub! 🎉",
      description: "Your profile has been created successfully. You'll start receiving invites soon!",
    });
    
    setIsSubmitting(false);
    
    // Redirect to the new judge profile
    setTimeout(() => {
      setLocation(`/judges/${judgeId}`);
    }, 2000);
  };

  const isFormValid = data.name && data.email && data.headline && data.expertise.length > 0;

  return (
    <div className="min-h-screen bg-cream py-8 px-4" data-testid="judge-register-page">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-sky rounded-full flex items-center justify-center mx-auto mb-4">
            <Gavel className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-heading font-bold text-4xl text-text-dark mb-2">Join as a Judge</h1>
          <CrayonSquiggle className="mx-auto mb-4" />
          <p className="text-text-muted text-lg max-w-2xl mx-auto">
            Share your expertise and help shape the next generation of innovators. 
            Judge amazing projects and mentor talented teams.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <Card className="bg-white rounded-2xl p-8 shadow-soft border border-soft-gray">
            <div className="space-y-6">
              {/* Basic Info */}
              <div>
                <h3 className="font-heading font-semibold text-xl text-text-dark mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-sky" />
                  Basic Information
                </h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-dark mb-2">Full Name *</label>
                      <Input
                        value={data.name}
                        onChange={(e) => setData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Your full name"
                        className="border-soft-gray focus:ring-2 focus:ring-sky focus:border-transparent"
                        data-testid="input-name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-text-dark mb-2">Email *</label>
                      <Input
                        type="email"
                        value={data.email}
                        onChange={(e) => setData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="your@email.com"
                        className="border-soft-gray focus:ring-2 focus:ring-sky focus:border-transparent"
                        data-testid="input-email"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-dark mb-2">Professional Headline *</label>
                    <Input
                      value={data.headline}
                      onChange={(e) => setData(prev => ({ ...prev, headline: e.target.value }))}
                      placeholder="e.g., Senior Product Manager at Tech Corp"
                      className="border-soft-gray focus:ring-2 focus:ring-sky focus:border-transparent"
                      data-testid="input-headline"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-dark mb-2">Region</label>
                    <Input
                      value={data.region}
                      onChange={(e) => setData(prev => ({ ...prev, region: e.target.value }))}
                      placeholder="e.g., San Francisco, US"
                      className="border-soft-gray focus:ring-2 focus:ring-sky focus:border-transparent"
                      data-testid="input-region"
                    />
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div>
                <h3 className="font-heading font-semibold text-lg text-text-dark mb-4">Social Links</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-dark mb-2 flex items-center gap-2">
                      <Linkedin className="w-4 h-4 text-sky" />
                      LinkedIn
                    </label>
                    <Input
                      value={data.linkedin}
                      onChange={(e) => setData(prev => ({ ...prev, linkedin: e.target.value }))}
                      placeholder="https://linkedin.com/in/yourname"
                      className="border-soft-gray focus:ring-2 focus:ring-sky focus:border-transparent"
                      data-testid="input-linkedin"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-dark mb-2 flex items-center gap-2">
                      <Twitter className="w-4 h-4 text-sky" />
                      Twitter/X
                    </label>
                    <Input
                      value={data.twitter}
                      onChange={(e) => setData(prev => ({ ...prev, twitter: e.target.value }))}
                      placeholder="https://x.com/yourhandle"
                      className="border-soft-gray focus:ring-2 focus:ring-sky focus:border-transparent"
                      data-testid="input-twitter"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-dark mb-2 flex items-center gap-2">
                      <Globe className="w-4 h-4 text-sky" />
                      Website
                    </label>
                    <Input
                      value={data.website}
                      onChange={(e) => setData(prev => ({ ...prev, website: e.target.value }))}
                      placeholder="https://yourwebsite.com"
                      className="border-soft-gray focus:ring-2 focus:ring-sky focus:border-transparent"
                      data-testid="input-website"
                    />
                  </div>
                </div>
              </div>

              {/* Expertise */}
              <div>
                <h3 className="font-heading font-semibold text-lg text-text-dark mb-4">Expertise Areas *</h3>
                <p className="text-text-muted text-sm mb-4">Select areas where you can provide valuable feedback</p>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {expertiseOptions.map((skill) => (
                    <Badge
                      key={skill}
                      onClick={() => toggleExpertise(skill)}
                      className={`cursor-pointer transition-colors p-3 rounded-xl border-0 text-center text-sm ${
                        data.expertise.includes(skill)
                          ? 'bg-sky text-white'
                          : 'bg-soft-gray text-text-dark hover:bg-soft-gray/80'
                      }`}
                      data-testid={`expertise-${skill.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Bio */}
              <div>
                <h3 className="font-heading font-semibold text-lg text-text-dark mb-4">About You</h3>
                <Textarea
                  value={data.bio}
                  onChange={(e) => setData(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Tell us about your experience and what motivates you to judge hackathons..."
                  rows={4}
                  className="border-soft-gray focus:ring-2 focus:ring-sky focus:border-transparent"
                  data-testid="textarea-bio"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8 pt-6 border-t border-soft-gray">
              <Button
                onClick={handleSubmit}
                disabled={!isFormValid || isSubmitting}
                className="w-full bg-sky text-white hover:bg-sky/80 rounded-full py-3 font-medium transition-colors"
                data-testid="button-submit"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating Your Profile...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Join Judge Hub
                    <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </Button>
            </div>
          </Card>

          {/* Live Preview */}
          <div className="space-y-6">
            <div>
              <h3 className="font-heading font-semibold text-xl text-text-dark mb-4">Profile Preview</h3>
              <p className="text-text-muted text-sm mb-6">See how your profile will appear to organizers</p>
            </div>

            <Card className="bg-white rounded-2xl p-6 shadow-soft border border-soft-gray">
              <div className="text-center mb-6">
                <Avatar className="w-20 h-20 mx-auto mb-4">
                  <AvatarImage src="" alt={data.name || "Judge"} />
                  <AvatarFallback className="bg-sky text-white text-xl">
                    {data.name ? data.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'J'}
                  </AvatarFallback>
                </Avatar>
                
                <h4 className="font-heading font-bold text-xl text-text-dark mb-2">
                  {data.name || 'Your Name'}
                </h4>
                
                <p className="text-text-muted mb-4">
                  {data.headline || 'Your professional headline'}
                </p>

                {data.region && (
                  <div className="flex items-center justify-center gap-1 text-text-muted text-sm mb-4">
                    <MapPin className="w-4 h-4" />
                    <span>{data.region}</span>
                  </div>
                )}
              </div>

              {data.expertise.length > 0 && (
                <div className="mb-6">
                  <h5 className="font-medium text-text-dark mb-3">Expertise</h5>
                  <div className="flex flex-wrap gap-2">
                    {data.expertise.slice(0, 6).map((skill) => (
                      <Badge key={skill} className="bg-sky/10 text-sky border-0 text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {data.expertise.length > 6 && (
                      <Badge className="bg-soft-gray text-text-muted border-0 text-xs">
                        +{data.expertise.length - 6} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {data.bio && (
                <div className="mb-6">
                  <h5 className="font-medium text-text-dark mb-3">About</h5>
                  <p className="text-text-muted text-sm leading-relaxed">
                    {data.bio}
                  </p>
                </div>
              )}

              <div className="border-t border-soft-gray pt-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-text-dark">0</div>
                    <div className="text-xs text-text-muted">Events Judged</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-text-dark">New</div>
                    <div className="text-xs text-text-muted">Status</div>
                  </div>
                  <div>
                    <div className="flex justify-center">
                      <Star className="w-4 h-4 text-yellow" fill="currentColor" />
                    </div>
                    <div className="text-xs text-text-muted">Rating</div>
                  </div>
                </div>
              </div>

              <Button 
                variant="outline"
                className="w-full mt-4 border-sky text-sky hover:bg-sky/10"
                disabled
              >
                Invite to Judge
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}