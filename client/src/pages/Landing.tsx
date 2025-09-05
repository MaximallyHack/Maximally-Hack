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
    <div className="min-h-screen bg-cream" data-testid="landing-page">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-cream via-sky/10 to-mint/10 py-20">
        <DecorativeElements />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <FloatingElement>
            <h1 className="font-heading font-bold text-5xl md:text-6xl text-text-dark mb-6">
              Where Great Ideas
              <span className="text-coral"> Come to Life</span>
            </h1>
          </FloatingElement>
          <p className="text-xl text-text-muted mb-8 max-w-2xl mx-auto">
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
              <Button variant="outline" size="lg" className="border-2 border-mint text-text-dark px-8 py-4 rounded-full font-medium text-lg hover-scale hover:bg-mint/20 transition-colors" data-testid="button-join-community">
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
          <div className="flex flex-wrap gap-3 justify-center">
            <Badge className="bg-sky text-white px-4 py-2 rounded-full text-sm font-medium hover-scale cursor-pointer" data-testid="category-ai">
              🤖 AI & ML
            </Badge>
            <Badge className="bg-mint text-text-dark px-4 py-2 rounded-full text-sm font-medium hover-scale cursor-pointer" data-testid="category-student">
              🎓 Student
            </Badge>
            <Badge className="bg-yellow text-text-dark px-4 py-2 rounded-full text-sm font-medium hover-scale cursor-pointer" data-testid="category-beginner">
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
            <h2 className="font-heading font-bold text-3xl text-text-dark mb-4">Featured Hackathons</h2>
            <CrayonSquiggle className="mx-auto mb-6" />
            <p className="text-text-muted text-lg">Join these exciting events happening now</p>
          </div>
          
          {eventsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-soft border border-soft-gray">
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
              <h3 className="font-heading font-semibold text-xl text-text-dark mb-2">No Featured Events</h3>
              <p className="text-text-muted mb-6">Check back soon for exciting hackathons!</p>
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
            <h2 className="font-heading font-bold text-3xl text-text-dark mb-4">How It Works</h2>
            <CrayonSquiggle className="mx-auto mb-6" />
            <p className="text-text-muted text-lg">Three simple steps to hackathon success</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <FloatingElement delay={0}>
                <div className="bg-coral w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 hover-scale">
                  <Search className="w-6 h-6 text-white" />
                </div>
              </FloatingElement>
              <h3 className="font-heading font-semibold text-xl text-text-dark mb-2">1. Discover</h3>
              <p className="text-text-muted">Browse exciting hackathons, filter by your interests, and find the perfect challenge for your skills.</p>
            </div>
            <div className="text-center">
              <FloatingElement delay={0.5}>
                <div className="bg-mint w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 hover-scale">
                  <Users className="w-6 h-6 text-text-dark" />
                </div>
              </FloatingElement>
              <h3 className="font-heading font-semibold text-xl text-text-dark mb-2">2. Team Up</h3>
              <p className="text-text-muted">Join existing teams or create your own. Connect with like-minded builders and form the dream team.</p>
            </div>
            <div className="text-center">
              <FloatingElement delay={1}>
                <div className="bg-sky w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 hover-scale">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
              </FloatingElement>
              <h3 className="font-heading font-semibold text-xl text-text-dark mb-2">3. Build & Win</h3>
              <p className="text-text-muted">Create amazing projects, submit your work, and compete for prizes while learning from the community.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials */}
      <section className="py-16 bg-gradient-to-br from-cream via-soft-gray/20 to-mint/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-3xl text-text-dark mb-4">Loved by Industry Leaders</h2>
            <CrayonSquiggle className="mx-auto mb-4" />
            <p className="text-text-muted text-lg">What our expert judges say about the platform</p>
          </div>
          
          {/* Judge Avatar Row */}
          <div className="flex flex-wrap justify-center items-center gap-4 mb-12">
            <div className="flex -space-x-3">
              {[
                { src: "https://images.unsplash.com/photo-1494790108755-2616b612b829?w=40&h=40&fit=crop&crop=face", name: "Dr. Sarah Chen" },
                { src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face", name: "Mark Rodriguez" },
                { src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face", name: "Lisa Thompson" },
                { src: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=40&h=40&fit=crop&crop=face", name: "Dr. Maria Gonzalez" },
                { src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face", name: "James Wilson" },
                { src: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=40&h=40&fit=crop&crop=face", name: "Dr. Priya Patel" }
              ].map((judge, i) => (
                <Avatar key={i} className="w-10 h-10 border-3 border-white hover-scale transition-transform duration-300 cursor-pointer">
                  <AvatarImage src={judge.src} alt={judge.name} />
                  <AvatarFallback className="text-xs">{judge.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
              ))}
            </div>
            <div className="text-center">
              <span className="text-text-dark font-semibold">200+ Expert Judges</span>
              <div className="text-yellow text-sm">★★★★★ 4.9/5 Platform Rating</div>
            </div>
          </div>
          
          {/* Symmetrical Testimonial Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <div className="bg-gradient-to-br from-coral/10 to-coral/5 border border-coral/20 rounded-2xl p-6 shadow-soft hover-scale transition-all duration-300 group h-full flex flex-col" data-testid="testimonial-sarah">
              <div className="flex items-start gap-3 mb-4">
                <Avatar className="w-12 h-12 border-2 border-coral/30">
                  <AvatarImage src="https://images.unsplash.com/photo-1494790108755-2616b612b829?w=48&h=48&fit=crop&crop=face" alt="Dr. Sarah Chen" />
                  <AvatarFallback>SC</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h4 className="font-heading font-bold text-lg text-text-dark">Dr. Sarah Chen</h4>
                  <p className="text-coral font-semibold text-sm">AI Research Director, Google</p>
                  <div className="flex items-center gap-1 mt-1">
                    <div className="text-yellow text-xs">★★★★★</div>
                    <span className="text-text-muted text-xs">4.9/5</span>
                  </div>
                </div>
              </div>
              <blockquote className="text-text-dark mb-4 flex-grow">
                "The caliber of AI projects I've seen here is remarkable. Maximally Hack attracts the most innovative minds in tech."
              </blockquote>
              <div className="flex flex-wrap gap-1">
                <Badge className="bg-coral/30 text-coral text-xs">AI Expert</Badge>
                <Badge className="bg-text-dark/10 text-text-dark text-xs">25 Events</Badge>
              </div>
            </div>

            <div className="bg-gradient-to-br from-mint/10 to-mint/5 border border-mint/20 rounded-2xl p-6 shadow-soft hover-scale transition-all duration-300 group h-full flex flex-col" data-testid="testimonial-mark">
              <div className="flex items-start gap-3 mb-4">
                <Avatar className="w-12 h-12 border-2 border-mint/30">
                  <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=48&h=48&fit=crop&crop=face" alt="Mark Rodriguez" />
                  <AvatarFallback>MR</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h4 className="font-heading font-bold text-lg text-text-dark">Mark Rodriguez</h4>
                  <p className="text-mint font-semibold text-sm">CTO, HealthTech Innovations</p>
                  <div className="flex items-center gap-1 mt-1">
                    <div className="text-yellow text-xs">★★★★★</div>
                    <span className="text-text-muted text-xs">4.8/5</span>
                  </div>
                </div>
              </div>
              <blockquote className="text-text-dark mb-4 flex-grow">
                "This platform makes judging a joy. The submission process is seamless and the community is genuinely supportive."
              </blockquote>
              <div className="flex flex-wrap gap-1">
                <Badge className="bg-mint/30 text-mint text-xs">HealthTech</Badge>
                <Badge className="bg-text-dark/10 text-text-dark text-xs">18 Events</Badge>
              </div>
            </div>

            <div className="bg-gradient-to-br from-sky/10 to-sky/5 border border-sky/20 rounded-2xl p-6 shadow-soft hover-scale transition-all duration-300 group h-full flex flex-col" data-testid="testimonial-lisa">
              <div className="flex items-start gap-3 mb-4">
                <Avatar className="w-12 h-12 border-2 border-sky/30">
                  <AvatarImage src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=48&h=48&fit=crop&crop=face" alt="Lisa Thompson" />
                  <AvatarFallback>LT</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h4 className="font-heading font-bold text-lg text-text-dark">Lisa Thompson</h4>
                  <p className="text-sky font-semibold text-sm">Head of Sustainability, Microsoft</p>
                  <div className="flex items-center gap-1 mt-1">
                    <div className="text-yellow text-xs">★★★★★</div>
                    <span className="text-text-muted text-xs">4.9/5</span>
                  </div>
                </div>
              </div>
              <blockquote className="text-text-dark mb-4 flex-grow">
                "I've discovered groundbreaking climate tech solutions here. The focus on real-world impact is incredible."
              </blockquote>
              <div className="flex flex-wrap gap-1">
                <Badge className="bg-sky/30 text-sky text-xs">Climate Tech</Badge>
                <Badge className="bg-text-dark/10 text-text-dark text-xs">22 Events</Badge>
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow/10 to-yellow/5 border border-yellow/30 rounded-2xl p-6 shadow-soft hover-scale transition-all duration-300 group h-full flex flex-col" data-testid="testimonial-maria">
              <div className="flex items-start gap-3 mb-4">
                <Avatar className="w-12 h-12 border-2 border-yellow/50">
                  <AvatarImage src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=48&h=48&fit=crop&crop=face" alt="Dr. Maria Gonzalez" />
                  <AvatarFallback>MG</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h4 className="font-heading font-bold text-lg text-text-dark">Dr. Maria Gonzalez</h4>
                  <p className="text-yellow-600 font-semibold text-sm">Research Scientist, OpenAI</p>
                  <div className="flex items-center gap-1 mt-1">
                    <div className="text-yellow text-xs">★★★★★</div>
                    <span className="text-text-muted text-xs">4.9/5</span>
                  </div>
                </div>
              </div>
              <blockquote className="text-text-dark mb-4 flex-grow">
                "The AI safety awareness shown by participants gives me hope for the future of technology."
              </blockquote>
              <div className="flex flex-wrap gap-1">
                <Badge className="bg-yellow/30 text-yellow-700 text-xs">AI Safety</Badge>
                <Badge className="bg-text-dark/10 text-text-dark text-xs">20 Events</Badge>
              </div>
            </div>

            <div className="bg-gradient-to-br from-text-dark/5 to-text-dark/10 border border-text-dark/10 rounded-2xl p-6 shadow-soft hover-scale transition-all duration-300 group h-full flex flex-col" data-testid="testimonial-james">
              <div className="flex items-start gap-3 mb-4">
                <Avatar className="w-12 h-12 border-2 border-text-dark/20">
                  <AvatarImage src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=48&h=48&fit=crop&crop=face" alt="James Wilson" />
                  <AvatarFallback>JW</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h4 className="font-heading font-bold text-lg text-text-dark">James Wilson</h4>
                  <p className="text-text-dark font-semibold text-sm">CEO, EcoTech Ventures</p>
                  <div className="flex items-center gap-1 mt-1">
                    <div className="text-yellow text-xs">★★★★☆</div>
                    <span className="text-text-muted text-xs">4.6/5</span>
                  </div>
                </div>
              </div>
              <blockquote className="text-text-dark mb-4 flex-grow">
                "I've found my next investment opportunities right here. The entrepreneurial spirit is infectious."
              </blockquote>
              <div className="flex flex-wrap gap-1">
                <Badge className="bg-text-dark/20 text-text-dark text-xs">Investor</Badge>
                <Badge className="bg-mint/20 text-mint text-xs">12 Events</Badge>
              </div>
            </div>

            <div className="bg-gradient-to-br from-coral/8 to-mint/8 border border-coral/15 rounded-2xl p-6 shadow-soft hover-scale transition-all duration-300 group h-full flex flex-col" data-testid="testimonial-priya">
              <div className="flex items-start gap-3 mb-4">
                <Avatar className="w-12 h-12 border-2 border-coral/20">
                  <AvatarImage src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=48&h=48&fit=crop&crop=face" alt="Dr. Priya Patel" />
                  <AvatarFallback>PP</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h4 className="font-heading font-bold text-lg text-text-dark">Dr. Priya Patel</h4>
                  <p className="text-coral font-semibold text-sm">CMO, Teladoc Health</p>
                  <div className="flex items-center gap-1 mt-1">
                    <div className="text-yellow text-xs">★★★★★</div>
                    <span className="text-text-muted text-xs">4.8/5</span>
                  </div>
                </div>
              </div>
              <blockquote className="text-text-dark mb-4 flex-grow">
                "The healthcare innovations coming out of these hackathons genuinely advance patient care."
              </blockquote>
              <div className="flex flex-wrap gap-1">
                <Badge className="bg-coral/20 text-coral text-xs">Digital Health</Badge>
                <Badge className="bg-text-dark/10 text-text-dark text-xs">16 Events</Badge>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-12">
            <p className="text-text-muted mb-4">Join our community of expert judges and innovative builders</p>
            <Link href="/judge/register">
              <Button className="bg-coral text-white px-6 py-3 rounded-full font-medium hover-scale hover:bg-coral/80 transition-colors" data-testid="button-become-judge">
                Become a Judge
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
