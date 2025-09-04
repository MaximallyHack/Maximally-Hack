import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import EventHeader from "@/components/event/EventHeader";
import TeamCard from "@/components/event/TeamCard";
import ProjectCard from "@/components/event/ProjectCard";
import JudgeCard from "@/components/event/JudgeCard";
import { CrayonSquiggle } from "@/components/ui/floating-elements";
import { useConfetti } from "@/components/ui/confetti";
import { Trophy, Users, Star, Calendar, Clock, Globe, Check } from "lucide-react";
import { api } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

export default function EventDetail() {
  const { slug } = useParams();
  const [activeTab, setActiveTab] = useState("about");
  const { toast } = useToast();
  const { isActive: confettiActive, trigger: triggerConfetti, Confetti } = useConfetti();

  const { data: event, isLoading: eventLoading } = useQuery({
    queryKey: ['events', slug],
    queryFn: () => api.getEvent(slug!),
    enabled: !!slug,
  });

  const { data: teams } = useQuery({
    queryKey: ['teams', event?.id],
    queryFn: () => api.getTeams(event?.id),
    enabled: !!event?.id,
  });

  const { data: submissions } = useQuery({
    queryKey: ['submissions', event?.id],
    queryFn: () => api.getSubmissions(event?.id),
    enabled: !!event?.id,
  });

  const { data: judges } = useQuery({
    queryKey: ['judges'],
    queryFn: api.getJudges,
  });

  if (eventLoading) {
    return (
      <div className="min-h-screen bg-cream">
        <div className="bg-gradient-to-br from-sky/20 via-coral/10 to-mint/20 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Skeleton className="h-12 w-3/4 mb-4" />
            <Skeleton className="h-4 w-1/2 mb-6" />
            <div className="flex gap-3 mb-6">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-36" />
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
          <div className="text-6xl mb-4">😵</div>
          <h1 className="font-heading font-bold text-2xl text-text-dark mb-2">Event Not Found</h1>
          <p className="text-text-muted mb-6">The hackathon you're looking for doesn't exist.</p>
          <Link href="/explore">
            <Button className="bg-coral text-white hover:bg-coral/80">Browse Events</Button>
          </Link>
        </div>
      </div>
    );
  }

  const eventJudges = judges?.filter(judge => event.judges.includes(judge.id)) || [];

  const handleJoinEvent = () => {
    toast({
      title: "Registration Successful! 🎉",
      description: "Welcome to the hackathon! Check your email for details.",
    });
    triggerConfetti();
  };

  const handleJoinTeam = (teamId: string) => {
    toast({
      title: "Join Request Sent! 📩",
      description: "The team leader will review your request soon.",
    });
  };

  return (
    <div className="min-h-screen bg-cream" data-testid="event-detail-page">
      <Confetti />
      
      {/* Event Header */}
      <EventHeader event={event} />

      {/* Event Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-7 bg-white rounded-xl border border-soft-gray p-1">
            <TabsTrigger value="about" className="rounded-lg" data-testid="tab-about">About</TabsTrigger>
            <TabsTrigger value="prizes" className="rounded-lg" data-testid="tab-prizes">Prizes</TabsTrigger>
            <TabsTrigger value="rules" className="rounded-lg" data-testid="tab-rules">Rules</TabsTrigger>
            <TabsTrigger value="timeline" className="rounded-lg" data-testid="tab-timeline">Timeline</TabsTrigger>
            <TabsTrigger value="judges" className="rounded-lg" data-testid="tab-judges">Judges</TabsTrigger>
            <TabsTrigger value="teams" className="rounded-lg" data-testid="tab-teams">Teams</TabsTrigger>
            <TabsTrigger value="submissions" className="rounded-lg" data-testid="tab-submissions">Submissions</TabsTrigger>
          </TabsList>

          {/* About Tab */}
          <TabsContent value="about" className="mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="prose max-w-none">
                  <h2 className="font-heading font-bold text-2xl text-text-dark mb-4">About the Challenge</h2>
                  <CrayonSquiggle className="mb-6" />
                  <p className="text-text-muted mb-6">{event.longDescription}</p>
                  
                  <h3 className="font-heading font-semibold text-xl text-text-dark mb-3">Tracks</h3>
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {event.tracks.map(track => (
                      <Badge key={track} className="bg-mint/20 text-mint px-3 py-2 rounded-lg text-sm border-0">
                        {track}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              <div>
                <div className="bg-white rounded-2xl p-6 shadow-soft border border-soft-gray mb-6">
                  <h3 className="font-heading font-semibold text-lg text-text-dark mb-4">Event Details</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Calendar className="text-coral mr-3 w-4 h-4" />
                      <span className="text-text-muted text-sm">
                        {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="text-sky mr-3 w-4 h-4" />
                      <span className="text-text-muted text-sm">
                        {Math.floor((new Date(event.endDate).getTime() - new Date(event.startDate).getTime()) / (1000 * 60 * 60))} hours
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Globe className="text-mint mr-3 w-4 h-4" />
                      <span className="text-text-muted text-sm">{event.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="text-yellow mr-3 w-4 h-4" />
                      <span className="text-text-muted text-sm">Teams of 1-{event.maxTeamSize}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-soft border border-soft-gray">
                  <h3 className="font-heading font-semibold text-lg text-text-dark mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="w-full bg-coral text-white hover:bg-coral/80" data-testid="button-register">
                          Register for Event
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-white">
                        <DialogHeader>
                          <DialogTitle>Join {event.title}</DialogTitle>
                          <DialogDescription>Choose how you'd like to participate</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <Button 
                            className="w-full bg-coral text-white hover:bg-coral/80"
                            onClick={handleJoinEvent}
                            data-testid="button-join-solo"
                          >
                            Join as Solo Participant
                          </Button>
                          <Button 
                            className="w-full bg-mint text-text-dark hover:bg-mint/80"
                            onClick={handleJoinEvent}
                            data-testid="button-create-team"
                          >
                            Create a New Team
                          </Button>
                          <Button 
                            className="w-full bg-sky text-white hover:bg-sky/80"
                            onClick={handleJoinEvent}
                            data-testid="button-join-existing"
                          >
                            Join Existing Team
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    <Link href={`/e/${event.slug}/submit`}>
                      <Button variant="outline" className="w-full border-sky text-sky hover:bg-sky/10" data-testid="button-submit">
                        Submit Project
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Prizes Tab */}
          <TabsContent value="prizes" className="mt-8">
            <div className="text-center mb-12">
              <h2 className="font-heading font-bold text-3xl text-text-dark mb-4">
                Prize Pool: ${(event.prizePool / 1000).toFixed(0)}k
              </h2>
              <CrayonSquiggle className="mx-auto mb-6" />
            </div>

            {/* Main Prizes */}
            <div className="flex justify-center items-end gap-4 mb-12">
              {event.prizes
                .filter(p => p.place)
                .sort((a, b) => a.place - b.place)
                .map((prize, index) => (
                  <div 
                    key={prize.place}
                    className={`bg-white rounded-2xl p-6 shadow-soft border text-center transition-transform hover-scale ${
                      prize.place === 1 ? 'border-coral scale-110' : 'border-soft-gray'
                    }`}
                  >
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                      prize.place === 1 ? 'bg-coral' :
                      prize.place === 2 ? 'bg-sky' : 'bg-mint'
                    }`}>
                      <span className={`text-2xl font-bold ${
                        prize.place === 1 ? 'text-white' :
                        prize.place === 2 ? 'text-white' : 'text-text-dark'
                      }`}>
                        {prize.place}
                      </span>
                    </div>
                    <h3 className="font-heading font-semibold text-lg text-text-dark mb-2">{prize.title}</h3>
                    <p className={`text-2xl font-bold mb-2 ${
                      prize.place === 1 ? 'text-coral' :
                      prize.place === 2 ? 'text-sky' : 'text-mint'
                    }`}>
                      ${(prize.amount / 1000).toFixed(0)}k
                    </p>
                    {prize.description && (
                      <p className="text-text-muted text-sm">{prize.description}</p>
                    )}
                  </div>
                ))
              }
            </div>

            {/* Track Prizes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {event.prizes
                .filter(p => p.track)
                .map(prize => (
                  <div key={prize.track} className="bg-white rounded-2xl p-6 shadow-soft border border-soft-gray">
                    <h3 className="font-heading font-semibold text-lg text-text-dark mb-3">
                      {prize.track} Track
                    </h3>
                    <p className="text-text-muted mb-3">{prize.title}</p>
                    <p className="text-xl font-bold text-coral">${(prize.amount / 1000).toFixed(0)}k Prize</p>
                  </div>
                ))
              }
            </div>
          </TabsContent>

          {/* Rules Tab */}
          <TabsContent value="rules" className="mt-8">
            <div className="bg-white rounded-2xl p-8 shadow-soft border border-soft-gray">
              <h2 className="font-heading font-bold text-2xl text-text-dark mb-6">Competition Rules</h2>
              <div className="space-y-4">
                {event.rules?.map((rule, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="bg-success rounded-full p-1 mt-1">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <p className="text-text-muted">{rule}</p>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Timeline Tab */}
          <TabsContent value="timeline" className="mt-8">
            <div className="bg-white rounded-2xl p-8 shadow-soft border border-soft-gray">
              <h2 className="font-heading font-bold text-2xl text-text-dark mb-6">Event Timeline</h2>
              <div className="space-y-6">
                {event.timeline?.map((item, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="bg-coral rounded-full p-2">
                      <Clock className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold text-lg text-text-dark">{item.title}</h3>
                      <p className="text-sky font-medium text-sm">{item.time}</p>
                      <p className="text-text-muted">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Judges Tab */}
          <TabsContent value="judges" className="mt-8">
            <div className="text-center mb-12">
              <h2 className="font-heading font-bold text-2xl text-text-dark mb-4">Meet Our Expert Judges</h2>
              <CrayonSquiggle className="mx-auto mb-6" />
              <p className="text-text-muted">Industry leaders who will evaluate your projects</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {eventJudges.map(judge => (
                <JudgeCard key={judge.id} judge={judge} />
              ))}
            </div>
          </TabsContent>

          {/* Teams Tab */}
          <TabsContent value="teams" className="mt-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="font-heading font-bold text-2xl text-text-dark mb-2">Team Formation</h2>
                <p className="text-text-muted">Find teammates or create your own team</p>
              </div>
              <Button className="bg-coral text-white px-6 py-3 rounded-full font-medium hover-scale hover:bg-coral/80" data-testid="button-create-team">
                Create Team
              </Button>
            </div>

            {teams && teams.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teams.map(team => (
                  <TeamCard key={team.id} team={team} onJoinRequest={handleJoinTeam} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">👥</div>
                <h3 className="font-heading font-semibold text-xl text-text-dark mb-2">No teams yet</h3>
                <p className="text-text-muted mb-6">Be the first to create a team!</p>
                <Button className="bg-coral text-white hover:bg-coral/80">Create First Team</Button>
              </div>
            )}
          </TabsContent>

          {/* Submissions Tab */}
          <TabsContent value="submissions" className="mt-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="font-heading font-bold text-2xl text-text-dark mb-2">Project Submissions</h2>
                <p className="text-text-muted">Amazing projects built during this hackathon</p>
              </div>
              <Link href={`/e/${event.slug}/submit`}>
                <Button className="bg-coral text-white px-6 py-3 rounded-full font-medium hover-scale hover:bg-coral/80" data-testid="button-submit-project">
                  Submit Project
                </Button>
              </Link>
            </div>

            {submissions && submissions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {submissions.map(submission => (
                  <ProjectCard key={submission.id} project={submission} showScore />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">💻</div>
                <h3 className="font-heading font-semibold text-xl text-text-dark mb-2">No submissions yet</h3>
                <p className="text-text-muted mb-6">Projects will appear here once the submission period opens.</p>
                <Link href={`/e/${event.slug}/submit`}>
                  <Button className="bg-coral text-white hover:bg-coral/80">Submit First Project</Button>
                </Link>
              </div>
            )}
          </TabsContent>

          {/* FAQs Tab */}
          <TabsContent value="faqs" className="mt-8">
            <div className="bg-white rounded-2xl p-8 shadow-soft border border-soft-gray">
              <h2 className="font-heading font-bold text-2xl text-text-dark mb-6">Frequently Asked Questions</h2>
              <Accordion type="single" collapsible className="w-full">
                {event.faqs?.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left font-heading font-semibold text-text-dark">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-text-muted">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
