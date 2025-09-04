import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { CrayonSquiggle } from "@/components/ui/floating-elements";
import { 
  CheckCircle, 
  Star, 
  Users, 
  Trophy, 
  Zap, 
  Globe, 
  Mail, 
  Building,
  Target,
  Rocket,
  Heart
} from "lucide-react";

interface SponsorshipPackage {
  id: string;
  name: string;
  price: string;
  color: string;
  icon: React.ReactNode;
  featured?: boolean;
  benefits: string[];
  placements: string[];
  limits: {
    events: string;
    logos: string;
    mentions: string;
  };
}

const sponsorshipPackages: SponsorshipPackage[] = [
  {
    id: "bronze",
    name: "Bronze",
    price: "$2,500",
    color: "mint",
    icon: <Star className="w-6 h-6" />,
    benefits: [
      "Logo on event pages",
      "Social media mentions",
      "Newsletter inclusion",
      "Basic analytics report",
    ],
    placements: ["Event page footer", "Social media posts"],
    limits: {
      events: "Up to 5 events",
      logos: "Small logo placement",
      mentions: "2 social mentions/month"
    }
  },
  {
    id: "silver",
    name: "Silver",
    price: "$5,000",
    color: "sky",
    icon: <Trophy className="w-6 h-6" />,
    featured: true,
    benefits: [
      "Prominent logo placement",
      "Dedicated sponsor spotlight",
      "Prize track sponsorship",
      "Judge nomination rights",
      "Detailed analytics",
      "Event booth space",
    ],
    placements: ["Event page header", "Prize announcements", "Judge profiles"],
    limits: {
      events: "Up to 15 events",
      logos: "Medium logo placement",
      mentions: "5 social mentions/month"
    }
  },
  {
    id: "gold",
    name: "Gold",
    price: "$10,000",
    color: "coral",
    icon: <Rocket className="w-6 h-6" />,
    benefits: [
      "Premium logo placement",
      "Custom prize track",
      "Keynote speaking slot",
      "Talent recruitment access",
      "Private judging panel",
      "Custom branding options",
      "Dedicated account manager",
      "Priority event selection",
    ],
    placements: ["Homepage feature", "Event banners", "Opening ceremony"],
    limits: {
      events: "Unlimited events",
      logos: "Large logo placement",
      mentions: "10 social mentions/month"
    }
  }
];

const mockSponsors = [
  { name: "Google", logo: "🔍", tier: "Gold" },
  { name: "Microsoft", logo: "🪟", tier: "Gold" },
  { name: "Meta", logo: "📘", tier: "Silver" },
  { name: "OpenAI", logo: "🤖", tier: "Silver" },
  { name: "GitHub", logo: "🐙", tier: "Bronze" },
  { name: "Vercel", logo: "▲", tier: "Bronze" },
  { name: "Stripe", logo: "💳", tier: "Silver" },
  { name: "Notion", logo: "📝", tier: "Bronze" },
];

export default function Sponsors() {
  const [selectedPackage, setSelectedPackage] = useState<SponsorshipPackage | null>(null);
  const [contactForm, setContactForm] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    package: "",
    message: "",
    budget: ""
  });
  const { toast } = useToast();

  const handleContactSubmit = () => {
    toast({
      title: "Thank you for your interest! 🎉",
      description: "Our partnerships team will contact you within 24 hours.",
    });
    setSelectedPackage(null);
    setContactForm({
      companyName: "",
      contactName: "",
      email: "",
      phone: "",
      package: "",
      message: "",
      budget: ""
    });
  };

  return (
    <div className="min-h-screen bg-cream py-8" data-testid="sponsors-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="font-heading font-bold text-5xl text-text-dark mb-6">
            Partner with HackSpace
          </h1>
          <CrayonSquiggle className="mx-auto mb-6" />
          <p className="text-xl text-text-muted mb-8 max-w-3xl mx-auto">
            Connect with the next generation of innovators and builders. Showcase your brand to thousands of talented developers, designers, and entrepreneurs.
          </p>
          <div className="flex items-center justify-center gap-8 text-text-muted">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-coral" />
              <span>50k+ Participants</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-sky" />
              <span>Global Reach</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-mint" />
              <span>Tech Talent</span>
            </div>
          </div>
        </div>

        {/* Sponsorship Packages */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-3xl text-text-dark mb-4">Sponsorship Packages</h2>
            <p className="text-text-muted text-lg">Choose the perfect level of partnership for your goals</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {sponsorshipPackages.map((pkg) => (
              <Card 
                key={pkg.id}
                className={`relative bg-white rounded-2xl p-8 shadow-soft border transition-all duration-200 hover-scale cursor-pointer ${
                  pkg.featured ? 'border-coral ring-2 ring-coral/20' : 'border-soft-gray'
                }`}
                onClick={() => setSelectedPackage(pkg)}
                data-testid={`package-card-${pkg.id}`}
              >
                {pkg.featured && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-coral text-white px-4 py-1 rounded-full text-sm font-medium border-0">
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <div className={`w-16 h-16 bg-${pkg.color} rounded-full flex items-center justify-center mx-auto mb-4 text-white`}>
                    {pkg.icon}
                  </div>
                  <h3 className="font-heading font-bold text-2xl text-text-dark mb-2">{pkg.name}</h3>
                  <div className="text-3xl font-bold text-coral mb-2">{pkg.price}</div>
                  <p className="text-text-muted text-sm">per year</p>
                </div>

                <div className="space-y-3 mb-6">
                  {pkg.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-success mt-0.5" />
                      <span className="text-text-muted text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-text-dark mb-2">Package Limits</h4>
                  <div className="space-y-1 text-sm text-text-muted">
                    <div>{pkg.limits.events}</div>
                    <div>{pkg.limits.logos}</div>
                    <div>{pkg.limits.mentions}</div>
                  </div>
                </div>

                <Button 
                  className={`w-full rounded-full font-medium transition-colors ${
                    pkg.featured 
                      ? 'bg-coral text-white hover:bg-coral/80' 
                      : 'bg-soft-gray text-text-dark hover:bg-soft-gray/80'
                  }`}
                  data-testid={`button-select-${pkg.id}`}
                >
                  Get Started
                </Button>
              </Card>
            ))}
          </div>
        </section>

        {/* Current Sponsors */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-3xl text-text-dark mb-4">Trusted by Industry Leaders</h2>
            <CrayonSquiggle className="mx-auto mb-6" />
            <p className="text-text-muted text-lg">Join these amazing companies supporting innovation</p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-soft border border-soft-gray">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {mockSponsors.map((sponsor, index) => (
                <div key={index} className="text-center group hover-scale">
                  <div className="text-4xl mb-2">{sponsor.logo}</div>
                  <div className="font-semibold text-text-dark">{sponsor.name}</div>
                  <Badge className={`mt-1 px-2 py-1 rounded-full text-xs border-0 ${
                    sponsor.tier === 'Gold' ? 'bg-coral/20 text-coral' :
                    sponsor.tier === 'Silver' ? 'bg-sky/20 text-sky' :
                    'bg-mint/20 text-mint'
                  }`}>
                    {sponsor.tier}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sample Placements */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-3xl text-text-dark mb-4">Sponsor Placement Preview</h2>
            <p className="text-text-muted text-lg">See how your brand will be featured across the platform</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="bg-white rounded-2xl p-6 shadow-soft border border-soft-gray">
              <h3 className="font-heading font-semibold text-xl text-text-dark mb-4">Event Page Integration</h3>
              <div className="bg-soft-gray/50 rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-text-muted">Powered by</span>
                  <div className="flex gap-2">
                    <span className="bg-coral text-white px-2 py-1 rounded text-xs">Your Logo</span>
                    <span className="bg-sky text-white px-2 py-1 rounded text-xs">Partner</span>
                  </div>
                </div>
                <div className="text-text-dark font-medium">AI for Good Challenge</div>
                <div className="text-text-muted text-sm">Sponsored prize track: Healthcare Innovation</div>
              </div>
            </Card>

            <Card className="bg-white rounded-2xl p-6 shadow-soft border border-soft-gray">
              <h3 className="font-heading font-semibold text-xl text-text-dark mb-4">Homepage Feature</h3>
              <div className="bg-soft-gray/50 rounded-xl p-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl mb-2">🏆</div>
                  <div className="text-text-dark font-medium">Sponsor Spotlight</div>
                  <div className="text-text-muted text-sm">Your company feature + call-to-action</div>
                  <Button size="sm" className="mt-2 bg-mint text-text-dark">Learn More</Button>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <div className="bg-gradient-to-br from-coral/10 via-sky/10 to-mint/10 rounded-2xl p-12">
            <h2 className="font-heading font-bold text-3xl text-text-dark mb-4">
              Ready to Partner with Us?
            </h2>
            <p className="text-text-muted text-lg mb-8 max-w-2xl mx-auto">
              Let's discuss how we can create a custom partnership that meets your goals and showcases your brand to our thriving community.
            </p>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button size="lg" className="bg-coral text-white px-8 py-4 rounded-full font-medium text-lg hover-scale hover:bg-coral/80" data-testid="button-contact-us">
                  <Mail className="w-5 h-5 mr-2" />
                  Contact Our Team
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl bg-white" data-testid="contact-modal">
                <DialogHeader>
                  <DialogTitle className="font-heading font-bold text-2xl text-text-dark">
                    Let's Partner Together
                  </DialogTitle>
                  <DialogDescription className="text-text-muted">
                    Tell us about your company and partnership goals. We'll create a custom proposal for you.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-dark mb-2">Company Name</label>
                    <Input
                      value={contactForm.companyName}
                      onChange={(e) => setContactForm(prev => ({ ...prev, companyName: e.target.value }))}
                      placeholder="Your Company"
                      data-testid="input-company-name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-text-dark mb-2">Contact Name</label>
                    <Input
                      value={contactForm.contactName}
                      onChange={(e) => setContactForm(prev => ({ ...prev, contactName: e.target.value }))}
                      placeholder="Your Name"
                      data-testid="input-contact-name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-text-dark mb-2">Email</label>
                    <Input
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="your@company.com"
                      data-testid="input-email"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-text-dark mb-2">Phone</label>
                    <Input
                      value={contactForm.phone}
                      onChange={(e) => setContactForm(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+1 (555) 123-4567"
                      data-testid="input-phone"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-text-dark mb-2">Interested Package</label>
                    <Select value={contactForm.package} onValueChange={(value) => setContactForm(prev => ({ ...prev, package: value }))}>
                      <SelectTrigger data-testid="select-package">
                        <SelectValue placeholder="Select package" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bronze">Bronze - $2,500</SelectItem>
                        <SelectItem value="silver">Silver - $5,000</SelectItem>
                        <SelectItem value="gold">Gold - $10,000</SelectItem>
                        <SelectItem value="custom">Custom Package</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-text-dark mb-2">Annual Budget Range</label>
                    <Select value={contactForm.budget} onValueChange={(value) => setContactForm(prev => ({ ...prev, budget: value }))}>
                      <SelectTrigger data-testid="select-budget">
                        <SelectValue placeholder="Select range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="under-5k">Under $5,000</SelectItem>
                        <SelectItem value="5k-10k">$5,000 - $10,000</SelectItem>
                        <SelectItem value="10k-25k">$10,000 - $25,000</SelectItem>
                        <SelectItem value="25k-50k">$25,000 - $50,000</SelectItem>
                        <SelectItem value="50k-plus">$50,000+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="mt-4">
                  <label className="block text-sm font-medium text-text-dark mb-2">Message</label>
                  <Textarea
                    value={contactForm.message}
                    onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Tell us about your partnership goals and how you'd like to work together..."
                    rows={4}
                    data-testid="textarea-message"
                  />
                </div>
                
                <div className="flex gap-4 mt-6">
                  <Button 
                    className="flex-1 bg-coral text-white hover:bg-coral/80"
                    onClick={handleContactSubmit}
                    data-testid="button-submit-contact"
                  >
                    Send Inquiry
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </section>

        {/* Package Detail Modal */}
        <Dialog open={!!selectedPackage} onOpenChange={() => setSelectedPackage(null)}>
          <DialogContent className="max-w-3xl bg-white" data-testid="package-detail-modal">
            {selectedPackage && (
              <>
                <DialogHeader>
                  <DialogTitle className="font-heading font-bold text-2xl text-text-dark flex items-center gap-3">
                    <div className={`w-12 h-12 bg-${selectedPackage.color} rounded-full flex items-center justify-center text-white`}>
                      {selectedPackage.icon}
                    </div>
                    {selectedPackage.name} Partnership
                  </DialogTitle>
                  <DialogDescription className="text-text-muted">
                    Everything included in the {selectedPackage.name} sponsorship package
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-text-dark mb-3">Package Benefits</h3>
                    <div className="space-y-2">
                      {selectedPackage.benefits.map((benefit, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-success mt-0.5" />
                          <span className="text-text-muted text-sm">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-text-dark mb-3">Placement Locations</h3>
                    <div className="space-y-2">
                      {selectedPackage.placements.map((placement, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <Zap className="w-4 h-4 text-coral mt-0.5" />
                          <span className="text-text-muted text-sm">{placement}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6 p-4 bg-soft-gray/50 rounded-xl">
                      <h4 className="font-semibold text-text-dark mb-2">Package Limits</h4>
                      <div className="space-y-1 text-sm text-text-muted">
                        <div>📅 {selectedPackage.limits.events}</div>
                        <div>🏷️ {selectedPackage.limits.logos}</div>
                        <div>📱 {selectedPackage.limits.mentions}</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-4 mt-6 pt-6 border-t border-soft-gray">
                  <div className="flex-1">
                    <div className="text-2xl font-bold text-coral">{selectedPackage.price}</div>
                    <div className="text-text-muted text-sm">per year</div>
                  </div>
                  <Button 
                    className="bg-coral text-white hover:bg-coral/80 px-8"
                    onClick={() => setSelectedPackage(null)}
                    data-testid="button-get-started"
                  >
                    Get Started
                  </Button>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
