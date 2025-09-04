import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useConfetti } from "@/components/ui/confetti";

// Enhanced Components
import LinkChip from "@/components/event/LinkChip";
import FactBadge from "@/components/event/FactBadge";
import TimelineItem from "@/components/event/TimelineItem";
import EnhancedPrizeCard from "@/components/event/EnhancedPrizeCard";
import CriteriaBar from "@/components/event/CriteriaBar";
import SocialIcon from "@/components/event/SocialIcon";
import StickyCTA from "@/components/event/StickyCTA";
import GalleryGrid from "@/components/event/GalleryGrid";
import Countdown from "@/components/event/Countdown";

// Icons
import { 
  Calendar, Clock, Globe, Users, MapPin, Zap, Heart, Target, 
  Trophy, Star, CheckCircle, ExternalLink, Play, Share2,
  MessageCircle, Phone, Mail, Sparkles, Rocket, Code
} from "lucide-react";
import { SiDiscord, SiTelegram } from "react-icons/si";

import { api } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Event } from "@/lib/api";

export default function EnhancedEventDetail() {
  const { slug } = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  const { toast } = useToast();
  const { isActive: confettiActive, trigger: triggerConfetti, Confetti } = useConfetti();

  const { data: event, isLoading: eventLoading } = useQuery({
    queryKey: ['events', slug],
    queryFn: () => api.getEvent(slug!),
    enabled: !!slug,
  });

  const { data: judges } = useQuery({
    queryKey: ['judges'],
    queryFn: api.getJudges,
  });

  // Scroll to section when tab changes
  useEffect(() => {
    if (activeTab !== "overview") {
      const element = document.getElementById(activeTab);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [activeTab]);

  if (eventLoading) {
    return (
      <div className="min-h-screen bg-cream">
        <div className="bg-gradient-to-br from-sky/20 via-coral/10 to-mint/20 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Skeleton className="h-16 w-3/4 mb-6" />
            <Skeleton className="h-6 w-1/2 mb-8" />
            <div className="flex gap-4 mb-8">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-28" />
              <Skeleton className="h-10 w-40" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <div className="text-8xl mb-6">🤖</div>
          <h1 className="font-heading font-bold text-3xl text-text-dark mb-4">Event Not Found</h1>
          <p className="text-text-muted text-lg mb-8">The hackathon you're looking for doesn't exist.</p>
          <Link href="/explore">
            <Button className="bg-coral text-white hover:bg-coral/80 px-8 py-3 text-lg">
              Discover Events
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const eventJudges = judges?.filter(judge => event.judges.includes(judge.id)) || [];

  const handleRegister = () => {
    toast({
      title: "🎉 Registration Successful!",
      description: "Welcome to the revolution! Check your email for next steps.",
    });
    triggerConfetti();
  };

  const shareEvent = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: event.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied! 📋",
        description: "Share this amazing event with your friends!",
      });
    }
  };

  return (
    <div className="min-h-screen bg-cream" data-testid="enhanced-event-detail">
      <Confetti />
      
      {/* Header Strip */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-soft-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1">
              <h1 className="font-heading font-bold text-2xl md:text-3xl text-text-dark">{event.title}</h1>
              {event.tagline && (
                <p className="text-text-muted mt-1 text-lg">{event.tagline}</p>
              )}
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <FactBadge 
                icon={Calendar} 
                label="Date" 
                value={`${new Date(event.startDate).toLocaleDateString()} - ${new Date(event.endDate).toLocaleDateString()}`}
                color="coral"
              />
              
              <Button onClick={handleRegister} className="bg-coral text-white hover:bg-coral/80 px-6 py-2">
                <Users className="w-4 h-4 mr-2" />
                Register
              </Button>
              
              {event.links?.discord && (
                <Button variant="outline" className="border-sky text-sky hover:bg-sky/10" onClick={() => window.open(event.links.discord, '_blank')}>
                  <SiDiscord className="w-4 h-4 mr-2" />
                  Discord
                </Button>
              )}
            </div>
          </div>
          
          {/* Social Icons Row */}
          {event.socials && Object.keys(event.socials).length > 0 && (
            <div className="flex items-center gap-3 mt-4 pt-4 border-t border-soft-gray">
              <span className="text-text-muted text-sm">Follow us:</span>
              {Object.entries(event.socials).map(([platform, url]) => (
                <SocialIcon key={platform} platform={platform} url={url as string} />
              ))}
              <Button
                variant="ghost"
                size="sm"
                onClick={shareEvent}
                className="ml-auto text-text-muted hover:text-text-dark"
              >
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Hero Block */}
      <section className="relative bg-gradient-to-br from-sky/10 via-coral/5 to-mint/10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              {/* Cover Image or Video */}
              {event.hero?.coverImage && (
                <div className="relative rounded-2xl overflow-hidden shadow-soft mb-8">
                  <img 
                    src={event.hero.coverImage} 
                    alt={`${event.title} cover`}
                    className="w-full h-64 object-cover"
                  />
                  {event.hero.promoVideo && (
                    <Button 
                      className="absolute inset-0 bg-black/50 text-white hover:bg-black/70 w-full h-full flex items-center justify-center"
                      onClick={() => window.open(event.hero.promoVideo, '_blank')}
                    >
                      <Play className="w-12 h-12" />
                    </Button>
                  )}
                </div>
              )}
              
              {/* Countdown Timer */}
              {event.hero?.countdown && (
                <Card className="bg-white/80 backdrop-blur-sm border-coral shadow-soft">
                  <CardContent className="p-6 text-center">
                    <h3 className="font-heading font-semibold text-lg text-text-dark mb-4">Event Starts In:</h3>
                    <Countdown targetDate={event.startDate} />
                  </CardContent>
                </Card>
              )}
            </div>
            
            <div>
              {/* Quick Facts */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <FactBadge icon={Globe} label="Format" value={event.format} color="sky" />
                <FactBadge icon={Users} label="Team Size" value={`1-${event.maxTeamSize}`} color="mint" />
                <FactBadge icon={Trophy} label="Prize Pool" value={`$${(event.prizePool / 1000).toFixed(0)}k`} color="coral" />
                <FactBadge icon={MapPin} label="Location" value={event.location} color="yellow" />
              </div>
              
              {/* Registration Status */}
              <Card className="bg-gradient-to-r from-coral to-coral/80 text-white shadow-soft mb-6">
                <CardContent className="p-6 text-center">
                  <Sparkles className="w-8 h-8 mx-auto mb-3" />
                  <h3 className="font-heading font-bold text-xl mb-2">{event.participantCount.toLocaleString()}+ Registered!</h3>
                  <p className="opacity-90">Join the movement of innovators building for good</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Tabs Navigation */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 md:grid-cols-8 bg-white rounded-xl border border-soft-gray p-1 mb-8">
                <TabsTrigger value="overview" className="rounded-lg text-xs md:text-sm">Overview</TabsTrigger>
                <TabsTrigger value="schedule" className="rounded-lg text-xs md:text-sm">Schedule</TabsTrigger>
                <TabsTrigger value="prizes" className="rounded-lg text-xs md:text-sm">Prizes</TabsTrigger>
                <TabsTrigger value="judges" className="rounded-lg text-xs md:text-sm">Judges</TabsTrigger>
                <TabsTrigger value="rules" className="rounded-lg text-xs md:text-sm">Rules</TabsTrigger>
                <TabsTrigger value="community" className="rounded-lg text-xs md:text-sm">Community</TabsTrigger>
                <TabsTrigger value="gallery" className="rounded-lg text-xs md:text-sm">Gallery</TabsTrigger>
                <TabsTrigger value="contact" className="rounded-lg text-xs md:text-sm">Contact</TabsTrigger>
              </TabsList>

              {/* Overview Section */}
              <TabsContent value="overview" id="overview">
                <div className="space-y-8">
                  {/* Description */}
                  <Card className="bg-white shadow-soft border border-soft-gray">
                    <CardContent className="p-8">
                      <div className="prose max-w-none">
                        <h2 className="font-heading font-bold text-2xl text-text-dark mb-6 flex items-center">
                          <Target className="w-6 h-6 text-coral mr-3" />
                          About the Challenge
                        </h2>
                        <div className="text-text-muted whitespace-pre-line leading-relaxed">
                          {event.longDescription}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Why Join */}
                  {event.whyJoin && (
                    <Card className="bg-gradient-to-br from-mint/10 to-sky/10 border border-mint/20 shadow-soft">
                      <CardContent className="p-8">
                        <h3 className="font-heading font-bold text-xl text-text-dark mb-6 flex items-center">
                          <Rocket className="w-6 h-6 text-mint mr-3" />
                          Why Join This Challenge?
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {event.whyJoin.map((reason: string, index: number) => (
                            <div key={index} className="flex items-start gap-3 bg-white/50 rounded-lg p-4">
                              <CheckCircle className="w-5 h-5 text-mint mt-0.5 flex-shrink-0" />
                              <span className="text-text-dark">{reason}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Quick Links Grid */}
                  {event.links && (
                    <Card className="bg-white shadow-soft border border-soft-gray">
                      <CardContent className="p-8">
                        <h3 className="font-heading font-bold text-xl text-text-dark mb-6 flex items-center">
                          <ExternalLink className="w-6 h-6 text-sky mr-3" />
                          Quick Links
                        </h3>
                        <div className="flex flex-wrap gap-3">
                          {Object.entries(event.links).map(([key, url]) => (
                            <LinkChip 
                              key={key}
                              label={key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                              url={url as string}
                            />
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Tracks */}
                  <Card className="bg-white shadow-soft border border-soft-gray">
                    <CardContent className="p-8">
                      <h3 className="font-heading font-bold text-xl text-text-dark mb-6 flex items-center">
                        <Code className="w-6 h-6 text-yellow mr-3" />
                        Challenge Tracks
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {event.tracks.map((track: string) => (
                          <div key={track} className="bg-gradient-to-r from-yellow/10 to-coral/10 border border-yellow/20 rounded-xl p-4 hover-scale">
                            <h4 className="font-heading font-semibold text-lg text-text-dark">{track}</h4>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Schedule Section */}
              <TabsContent value="schedule" id="schedule">
                <Card className="bg-white shadow-soft border border-soft-gray">
                  <CardContent className="p-8">
                    <h2 className="font-heading font-bold text-2xl text-text-dark mb-8 flex items-center">
                      <Clock className="w-6 h-6 text-coral mr-3" />
                      Event Timeline
                    </h2>
                    <div className="space-y-6">
                      {event.timeline?.map((item: any, index: number) => (
                        <TimelineItem
                          key={index}
                          time={item.time}
                          title={item.title}
                          description={item.description}
                          isActive={item.isActive}
                          isCompleted={item.isCompleted}
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Prizes Section */}
              <TabsContent value="prizes" id="prizes">
                <div className="space-y-8">
                  <div className="text-center">
                    <h2 className="font-heading font-bold text-3xl text-text-dark mb-4">
                      Total Prize Pool: ${(event.prizePool / 1000).toFixed(0)}k
                    </h2>
                    <p className="text-text-muted text-lg">Life-changing rewards for world-changing solutions</p>
                  </div>

                  {/* Main Prizes */}
                  <div className="flex justify-center items-end gap-6 mb-12">
                    {event.prizes
                      .filter((p: any) => p.place)
                      .sort((a: any, b: any) => a.place - b.place)
                      .map((prize: any) => (
                        <EnhancedPrizeCard
                          key={prize.place}
                          place={prize.place}
                          amount={prize.amount}
                          title={prize.title}
                          description={prize.description}
                          isFeatured={prize.place === 1}
                        />
                      ))}
                  </div>

                  {/* Track Prizes */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {event.prizes
                      .filter((p: any) => p.track)
                      .map((prize: any) => (
                        <EnhancedPrizeCard
                          key={prize.track}
                          track={prize.track}
                          amount={prize.amount}
                          title={prize.title}
                          description={prize.description}
                        />
                      ))}
                  </div>
                </div>
              </TabsContent>

              {/* Judges Section */}
              <TabsContent value="judges" id="judges">
                <Card className="bg-white shadow-soft border border-soft-gray">
                  <CardContent className="p-8">
                    <h2 className="font-heading font-bold text-2xl text-text-dark mb-6 flex items-center">
                      <Star className="w-6 h-6 text-coral mr-3" />
                      Expert Judge Panel
                    </h2>
                    
                    {/* Judging Criteria */}
                    {event.criteria && (
                      <div className="mb-8">
                        <h3 className="font-heading font-semibold text-lg text-text-dark mb-4">Evaluation Criteria</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {event.criteria.map((criterion: any, index: number) => (
                            <CriteriaBar
                              key={index}
                              name={criterion.name}
                              percentage={criterion.percentage}
                              description={criterion.description}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {eventJudges.map(judge => (
                        <div key={judge.id} className="text-center hover-scale">
                          <div className="bg-gradient-to-br from-sky/10 to-coral/10 rounded-xl p-6 border border-soft-gray">
                            <div className="w-16 h-16 bg-coral rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold text-xl">
                              {judge.name.charAt(0)}
                            </div>
                            <h4 className="font-heading font-semibold text-lg text-text-dark">{judge.name}</h4>
                            <p className="text-text-muted text-sm">{judge.title}</p>
                            <p className="text-sky text-sm font-medium">{judge.company}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Rules Section */}
              <TabsContent value="rules" id="rules">
                <Card className="bg-white shadow-soft border border-soft-gray">
                  <CardContent className="p-8">
                    <h2 className="font-heading font-bold text-2xl text-text-dark mb-8 flex items-center">
                      <CheckCircle className="w-6 h-6 text-mint mr-3" />
                      Rules & Eligibility
                    </h2>
                    
                    <div className="space-y-6">
                      {event.rules?.map((rule: string, index: number) => (
                        <div key={index} className="flex items-start gap-3 bg-mint/5 rounded-lg p-4">
                          <CheckCircle className="w-5 h-5 text-mint mt-0.5 flex-shrink-0" />
                          <span className="text-text-dark">{rule}</span>
                        </div>
                      ))}
                    </div>

                    {event.eligibility && (
                      <div className="mt-8 p-6 bg-sky/5 rounded-xl border border-sky/20">
                        <h3 className="font-heading font-semibold text-lg text-text-dark mb-4">Key Requirements</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div><strong>Age Limit:</strong> {event.eligibility.age}</div>
                          <div><strong>Team Size:</strong> {event.eligibility.teamSize}</div>
                          <div><strong>IP Policy:</strong> {event.eligibility.ipPolicy}</div>
                          <div>
                            <strong>Code of Conduct:</strong> 
                            <a href={event.eligibility.codeOfConduct} target="_blank" rel="noopener noreferrer" className="text-sky hover:underline ml-1">
                              View Guidelines
                            </a>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Community Section */}
              <TabsContent value="community" id="community">
                <Card className="bg-white shadow-soft border border-soft-gray">
                  <CardContent className="p-8">
                    <h2 className="font-heading font-bold text-2xl text-text-dark mb-8 flex items-center">
                      <MessageCircle className="w-6 h-6 text-sky mr-3" />
                      Join Our Community
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {event.community?.discord && (
                        <Button 
                          className="h-24 bg-indigo-600 hover:bg-indigo-700 text-white flex-col"
                          onClick={() => window.open(event.community.discord, '_blank')}
                        >
                          <SiDiscord className="w-8 h-8 mb-2" />
                          <span>Join Discord</span>
                        </Button>
                      )}
                      
                      {event.community?.telegram && (
                        <Button 
                          className="h-24 bg-blue-500 hover:bg-blue-600 text-white flex-col"
                          onClick={() => window.open(event.community.telegram, '_blank')}
                        >
                          <SiTelegram className="w-8 h-8 mb-2" />
                          <span>Telegram Group</span>
                        </Button>
                      )}
                      
                      {event.community?.forum && (
                        <Button 
                          className="h-24 bg-coral hover:bg-coral/80 text-white flex-col"
                          onClick={() => window.open(event.community.forum, '_blank')}
                        >
                          <Globe className="w-8 h-8 mb-2" />
                          <span>Community Forum</span>
                        </Button>
                      )}
                    </div>
                    
                    {event.community?.responseTime && (
                      <div className="mt-6 p-4 bg-yellow/10 rounded-lg border border-yellow/20">
                        <p className="text-text-dark text-center">
                          <strong>⚡ Quick Response:</strong> Our team responds within {event.community.responseTime}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Gallery Section */}
              <TabsContent value="gallery" id="gallery">
                <Card className="bg-white shadow-soft border border-soft-gray">
                  <CardContent className="p-8">
                    <h2 className="font-heading font-bold text-2xl text-text-dark mb-8 flex items-center">
                      <Play className="w-6 h-6 text-coral mr-3" />
                      Event Gallery
                    </h2>
                    
                    {event.gallery && event.gallery.length > 0 ? (
                      <GalleryGrid items={event.gallery} />
                    ) : (
                      <div className="text-center py-16">
                        <div className="text-6xl mb-4">📷</div>
                        <h3 className="font-heading font-semibold text-xl text-text-dark mb-2">Gallery Coming Soon</h3>
                        <p className="text-text-muted">Check back for amazing photos and videos from the event!</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Contact Section */}
              <TabsContent value="contact" id="contact">
                <Card className="bg-white shadow-soft border border-soft-gray">
                  <CardContent className="p-8">
                    <h2 className="font-heading font-bold text-2xl text-text-dark mb-8 flex items-center">
                      <Mail className="w-6 h-6 text-mint mr-3" />
                      Get In Touch
                    </h2>
                    
                    {event.contact && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-coral rounded-full flex items-center justify-center">
                              <Mail className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="font-semibold text-text-dark">Email</p>
                              <a href={`mailto:${event.contact.email}`} className="text-coral hover:underline">
                                {event.contact.email}
                              </a>
                            </div>
                          </div>
                          
                          {event.contact.phone && (
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-sky rounded-full flex items-center justify-center">
                                <Phone className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <p className="font-semibold text-text-dark">Phone</p>
                                <a href={`tel:${event.contact.phone}`} className="text-sky hover:underline">
                                  {event.contact.phone}
                                </a>
                              </div>
                            </div>
                          )}
                          
                          {event.contact.organizer && (
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-mint rounded-full flex items-center justify-center">
                                <Users className="w-5 h-5 text-text-dark" />
                              </div>
                              <div>
                                <p className="font-semibold text-text-dark">Organizer</p>
                                <p className="text-text-muted">{event.contact.organizer}</p>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="bg-gradient-to-br from-coral/10 to-sky/10 rounded-xl p-6">
                          <h3 className="font-heading font-semibold text-lg text-text-dark mb-4">Need Help?</h3>
                          <p className="text-text-muted mb-4">
                            Have questions about the event, technical setup, or anything else? We're here to help!
                          </p>
                          <Button className="w-full bg-coral text-white hover:bg-coral/80">
                            <Mail className="w-4 h-4 mr-2" />
                            Send Message
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sticky Sidebar */}
          <div className="lg:col-span-1">
            <StickyCTA event={event} onRegister={handleRegister} />
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-soft-gray p-4 z-50">
        <div className="flex gap-3">
          <Button 
            onClick={handleRegister}
            className="flex-1 bg-coral text-white hover:bg-coral/80"
          >
            Register Now
          </Button>
          {event.links?.discord && (
            <Button 
              variant="outline"
              className="border-sky text-sky"
              onClick={() => window.open(event.links.discord, '_blank')}
            >
              <SiDiscord className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}