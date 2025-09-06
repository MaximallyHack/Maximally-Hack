import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Calendar, 
  Users, 
  Trophy, 
  Rocket, 
  CheckCircle, 
  Star, 
  Mail, 
  Phone, 
  Building, 
  Globe,
  ArrowRight,
  Sparkles
} from "lucide-react";

export default function Organize() {
  const [formData, setFormData] = useState({
    organizationName: "",
    email: "",
    phone: "",
    website: "",
    eventName: "",
    description: "",
    expectedParticipants: "",
    timeline: ""
  });

  const features = [
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Event Management",
      description: "Complete event lifecycle management from planning to execution",
      color: "coral"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Team Formation",
      description: "Automated team matching and formation tools",
      color: "mint"
    },
    {
      icon: <Trophy className="w-6 h-6" />,
      title: "Prizes & Recognition",
      description: "Flexible prize structures and winner recognition system",
      color: "yellow"
    },
    {
      icon: <Rocket className="w-6 h-6" />,
      title: "Launch Support",
      description: "Marketing and promotional support for your hackathon",
      color: "sky"
    }
  ];

  const benefits = [
    "Zero setup fees - only pay when your event is live",
    "Dedicated event manager and technical support",
    "Custom branding and white-label options",
    "Real-time analytics and participant insights",
    "Automated registration and communication flows",
    "Integration with sponsor management tools"
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
  };

  return (
    <div className="min-h-screen bg-cream" data-testid="organize-page">
      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-coral to-coral/80 rounded-2xl flex items-center justify-center shadow-lg">
              <Rocket className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="font-heading font-bold text-4xl md:text-6xl text-text-dark mb-6">
            Organize with{" "}
            <span className="bg-gradient-to-r from-coral to-sky bg-clip-text text-transparent">
              Maximally Hack
            </span>
          </h1>
          <p className="text-xl text-text-muted max-w-3xl mx-auto mb-8">
            Partner with us to create unforgettable hackathon experiences. We handle the platform, 
            you focus on building an amazing community of innovators.
          </p>
          <div className="flex items-center justify-center gap-4 mb-12">
            <Badge className="bg-mint/20 text-mint border-mint/30 px-4 py-2 text-sm font-medium">
              ✨ Trusted by 500+ organizers
            </Badge>
            <Badge className="bg-coral/20 text-coral border-coral/30 px-4 py-2 text-sm font-medium">
              🎯 98% success rate
            </Badge>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-3xl text-text-dark mb-4">
              Everything You Need to Run Amazing Hackathons
            </h2>
            <p className="text-lg text-text-muted max-w-2xl mx-auto">
              Our platform provides all the tools and support you need to create memorable hackathon experiences
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-soft-gray bg-white rounded-2xl">
                <CardHeader className="text-center pb-4">
                  <div className={`w-12 h-12 mx-auto rounded-xl flex items-center justify-center mb-4 bg-${feature.color}/20 text-${feature.color} group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg font-semibold text-text-dark">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-text-muted text-center">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-heading font-bold text-3xl text-text-dark mb-6">
                Why Choose Our Platform?
              </h2>
              <p className="text-lg text-text-muted mb-8">
                Join hundreds of successful organizers who trust Maximally Hack to power their events.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-mint mt-1 flex-shrink-0" />
                    <p className="text-text-dark">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-coral/5 via-sky/5 to-mint/5 rounded-2xl p-8">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Star className="w-5 h-5 text-yellow fill-current" />
                  <Star className="w-5 h-5 text-yellow fill-current" />
                  <Star className="w-5 h-5 text-yellow fill-current" />
                  <Star className="w-5 h-5 text-yellow fill-current" />
                  <Star className="w-5 h-5 text-yellow fill-current" />
                </div>
                <blockquote className="text-lg font-medium text-text-dark italic mb-4">
                  "Maximally Hack made our first hackathon incredibly smooth. The team formation feature was a game-changer!"
                </blockquote>
                <p className="text-text-muted">— Sarah Chen, Tech Innovators Hackathon</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-3xl text-text-dark mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-text-muted">
              Tell us about your hackathon idea and we'll help bring it to life
            </p>
          </div>

          <Card className="bg-white rounded-2xl shadow-lg border-soft-gray">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-text-dark text-center">
                Partner With Us
              </CardTitle>
              <CardDescription className="text-center text-text-muted">
                Fill out this form and our team will get back to you within 24 hours
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="organizationName" className="text-text-dark font-medium">
                      Organization Name *
                    </Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-3 w-4 h-4 text-text-muted" />
                      <Input
                        id="organizationName"
                        name="organizationName"
                        value={formData.organizationName}
                        onChange={handleInputChange}
                        placeholder="Your organization"
                        className="pl-10 border-soft-gray focus:border-coral"
                        required
                        data-testid="input-organization-name"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-text-dark font-medium">
                      Email Address *
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-4 h-4 text-text-muted" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="contact@organization.com"
                        className="pl-10 border-soft-gray focus:border-coral"
                        required
                        data-testid="input-email"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-text-dark font-medium">
                      Phone Number
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 w-4 h-4 text-text-muted" />
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="(555) 123-4567"
                        className="pl-10 border-soft-gray focus:border-coral"
                        data-testid="input-phone"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website" className="text-text-dark font-medium">
                      Website
                    </Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-3 w-4 h-4 text-text-muted" />
                      <Input
                        id="website"
                        name="website"
                        value={formData.website}
                        onChange={handleInputChange}
                        placeholder="https://organization.com"
                        className="pl-10 border-soft-gray focus:border-coral"
                        data-testid="input-website"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="eventName" className="text-text-dark font-medium">
                    Proposed Event Name *
                  </Label>
                  <Input
                    id="eventName"
                    name="eventName"
                    value={formData.eventName}
                    onChange={handleInputChange}
                    placeholder="e.g., Innovation Challenge 2025"
                    className="border-soft-gray focus:border-coral"
                    required
                    data-testid="input-event-name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-text-dark font-medium">
                    Event Description *
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Tell us about your hackathon concept, theme, and goals..."
                    className="border-soft-gray focus:border-coral min-h-[100px]"
                    required
                    data-testid="textarea-description"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="expectedParticipants" className="text-text-dark font-medium">
                      Expected Participants
                    </Label>
                    <Input
                      id="expectedParticipants"
                      name="expectedParticipants"
                      value={formData.expectedParticipants}
                      onChange={handleInputChange}
                      placeholder="e.g., 100-200"
                      className="border-soft-gray focus:border-coral"
                      data-testid="input-participants"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timeline" className="text-text-dark font-medium">
                      Proposed Timeline
                    </Label>
                    <Input
                      id="timeline"
                      name="timeline"
                      value={formData.timeline}
                      onChange={handleInputChange}
                      placeholder="e.g., Q2 2025"
                      className="border-soft-gray focus:border-coral"
                      data-testid="input-timeline"
                    />
                  </div>
                </div>

                <div className="pt-6">
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-coral to-coral/90 hover:from-coral/90 hover:to-coral/80 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                    data-testid="button-submit"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Send Partnership Request
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-coral/5 via-sky/5 to-mint/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-heading font-bold text-3xl text-text-dark mb-4">
            Questions? We're Here to Help
          </h2>
          <p className="text-lg text-text-muted mb-8">
            Our team is ready to discuss your hackathon vision and answer any questions you have
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" className="border-coral text-coral hover:bg-coral/10 font-medium px-8 py-3">
              <Mail className="w-4 h-4 mr-2" />
              partners@maximallyhack.com
            </Button>
            <Button variant="outline" className="border-sky text-sky hover:bg-sky/10 font-medium px-8 py-3">
              <Phone className="w-4 h-4 mr-2" />
              Schedule a Call
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}