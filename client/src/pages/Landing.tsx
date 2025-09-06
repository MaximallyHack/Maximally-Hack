import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Plus, Rocket, Users, Trophy } from "lucide-react";
import EventCard from "@/components/event/EventCard";
import { FloatingElement, DecorativeElements, CrayonSquiggle } from "@/components/ui/floating-elements";
import { api } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

export default function Landing() {
  const { data: featuredEvents, isLoading: eventsLoading } = useQuery({
    queryKey: ['featured-events'],
    queryFn: api.getFeaturedEvents,
  });

  return (
    <div className="min-h-screen bg-background" data-testid="landing-page">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-cream via-sky/10 to-mint/10 py-20">
        <DecorativeElements />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <FloatingElement>
            <h1 className="font-heading font-bold text-5xl md:text-6xl text-foreground mb-6">
              Where Great Ideas
              <span className="text-coral"> Come to Life</span>
            </h1>
          </FloatingElement>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join the friendliest hackathon community. Create, collaborate, and compete in events that celebrate innovation and creativity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/explore">
              <Button size="lg" className="bg-coral text-white px-8 py-4 rounded-full font-medium text-lg hover-scale hover:bg-coral/80 transition-colors" data-testid="button-explore-events">
                <Search className="w-5 h-5 mr-2" />
                Explore Events
              </Button>
            </Link>
            <Link href="/organizer/events/new">
              <Button variant="outline" size="lg" className="border-2 border-mint text-foreground px-8 py-4 rounded-full font-medium text-lg hover-scale hover:bg-mint/20 transition-colors" data-testid="button-join-community">
                <Plus className="w-5 h-5 mr-2" />
                Join Our Community
              </Button>
            </Link>
          </div>
        </div>
      </section>
      {/* Category Pills */}
      <section className="py-8 bg-soft-gray/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3 justify-center text-[#6d6d6d]">
            <Badge className="bg-sky text-white px-4 py-2 rounded-full text-sm font-medium hover-scale cursor-pointer" data-testid="category-ai">
              🤖 AI & ML
            </Badge>
            <Badge className="bg-mint text-foreground px-4 py-2 rounded-full text-sm font-medium hover-scale cursor-pointer" data-testid="category-student">
              🎓 Student
            </Badge>
            <Badge className="bg-yellow text-foreground px-4 py-2 rounded-full text-sm font-medium hover-scale cursor-pointer" data-testid="category-beginner">
              👶 Beginner
            </Badge>
            <Badge className="bg-coral text-white px-4 py-2 rounded-full text-sm font-medium hover-scale cursor-pointer" data-testid="category-weekend">
              ⚡ Weekend
            </Badge>
            <Badge className="bg-text-dark text-white px-4 py-2 rounded-full text-sm font-medium hover-scale cursor-pointer" data-testid="category-prize">
              💰 Prize $10k+
            </Badge>
          </div>
        </div>
      </section>
      {/* Featured Events */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-3xl text-foreground mb-4">Featured Hackathons</h2>
            <CrayonSquiggle className="mx-auto mb-6" />
            <p className="text-muted-foreground text-lg">Join these exciting events happening now</p>
          </div>
          
          {eventsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-card rounded-2xl p-6 shadow-soft border border-border">
                  <Skeleton className="h-4 w-20 mb-4" />
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <div className="flex gap-2 mb-4">
                    <Skeleton className="h-6 w-12" />
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-10" />
                  </div>
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              ))}
            </div>
          ) : featuredEvents && featuredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="font-heading font-semibold text-xl text-foreground mb-2">No Featured Events</h3>
              <p className="text-muted-foreground mb-6">Check back soon for exciting hackathons!</p>
              <Link href="/explore">
                <Button className="bg-coral text-white hover:bg-coral/80">Explore All Events</Button>
              </Link>
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/explore">
              <Button size="lg" className="bg-sky text-white px-8 py-3 rounded-full font-medium hover-scale hover:bg-sky/80 transition-colors" data-testid="button-explore-all">
                <Search className="w-5 h-5 mr-2" />
                Explore All Events
              </Button>
            </Link>
          </div>
        </div>
      </section>
      {/* How It Works */}
      <section className="py-16 bg-soft-gray/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-3xl text-foreground mb-4">How It Works</h2>
            <CrayonSquiggle className="mx-auto mb-6" />
            <p className="text-muted-foreground text-lg">Three simple steps to hackathon success</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <FloatingElement delay={0}>
                <div className="bg-coral w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 hover-scale">
                  <Search className="w-6 h-6 text-white" />
                </div>
              </FloatingElement>
              <h3 className="font-heading font-semibold text-xl text-foreground mb-2">1. Discover</h3>
              <p className="text-muted-foreground">Browse exciting hackathons, filter by your interests, and find the perfect challenge for your skills.</p>
            </div>
            <div className="text-center">
              <FloatingElement delay={0.5}>
                <div className="bg-mint w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 hover-scale">
                  <Users className="w-6 h-6 text-foreground" />
                </div>
              </FloatingElement>
              <h3 className="font-heading font-semibold text-xl text-foreground mb-2">2. Team Up</h3>
              <p className="text-muted-foreground">Join existing teams or create your own. Connect with like-minded builders and form the dream team.</p>
            </div>
            <div className="text-center">
              <FloatingElement delay={1}>
                <div className="bg-sky w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 hover-scale">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
              </FloatingElement>
              <h3 className="font-heading font-semibold text-xl text-foreground mb-2">3. Build & Win</h3>
              <p className="text-muted-foreground">Create amazing projects, submit your work, and compete for prizes while learning from the community.</p>
            </div>
          </div>
        </div>
      </section>
      {/* Social Proof */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-3xl text-foreground mb-4">Trusted by Amazing Judges</h2>
            <CrayonSquiggle className="mx-auto mb-6" />
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-4 mb-8">
            <div className="flex -space-x-2">
              {[
                "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face",
                "https://images.unsplash.com/photo-1494790108755-2616b612b829?w=32&h=32&fit=crop&crop=face",
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face",
                "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face",
                "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=face"
              ].map((src, i) => (
                <Avatar key={i} className="w-8 h-8 border-2 border-white">
                  <AvatarImage src={src} alt={`Judge ${i + 1}`} />
                  <AvatarFallback>J{i + 1}</AvatarFallback>
                </Avatar>
              ))}
            </div>
            <span className="text-muted-foreground">200+ Expert Judges</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card rounded-2xl p-6 shadow-soft text-center">
              <p className="text-muted-foreground italic mb-4">"The most welcoming hackathon platform I've ever used. The community here is incredible!"</p>
              <div className="text-yellow">⭐⭐⭐⭐⭐</div>
            </div>
            <div className="bg-card rounded-2xl p-6 shadow-soft text-center">
              <p className="text-muted-foreground italic mb-4">"Maximally Hack makes organizing events a breeze. The tools are intuitive and powerful."</p>
              <div className="text-yellow">⭐⭐⭐⭐⭐</div>
            </div>
            <div className="bg-card rounded-2xl p-6 shadow-soft text-center">
              <p className="text-muted-foreground italic mb-4">"Amazing projects, talented people, and fair judging. This is where innovation happens!"</p>
              <div className="text-yellow">⭐⭐⭐⭐⭐</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
