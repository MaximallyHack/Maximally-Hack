import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, MapPin, ExternalLink, Linkedin, Twitter, Star, Filter } from "lucide-react";
import JuryMemberCard from "@/components/event/JudgeCard";
import { CrayonSquiggle } from "@/components/ui/floating-elements";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import type { Judge } from "@/lib/api";

export default function JuryBoard() {
  const { id } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedExpertise, setSelectedExpertise] = useState<string>("all");
  const [selectedAvailability, setSelectedAvailability] = useState<string>("all");
  const [selectedJudge, setSelectedJudge] = useState<Judge | null>(null);

  const { data: judges, isLoading } = useQuery({
    queryKey: ['judges', searchQuery, selectedExpertise, selectedAvailability],
    queryFn: async () => {
      let judges = await api.getJudges();
      
      // Filter by search query
      if (searchQuery) {
        judges = judges.filter(j => 
          j.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          j.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
          j.expertise.some(exp => exp.toLowerCase().includes(searchQuery.toLowerCase()))
        );
      }
      
      // Filter by expertise
      if (selectedExpertise && selectedExpertise !== "all") {
        judges = judges.filter(j => j.expertise.includes(selectedExpertise));
      }
      
      // Filter by availability
      if (selectedAvailability && selectedAvailability !== "all") {
        judges = judges.filter(j => j.availability === selectedAvailability);
      }
      
      return judges;
    },
  });

  // If we have an ID, try to find and show that specific judge
  const { data: specificJudge } = useQuery({
    queryKey: ['judge', id],
    queryFn: () => api.getJudge(id!),
    enabled: !!id,
  });

  // Get unique expertise options
  const allExpertise = judges ? Array.from(new Set(judges.flatMap(j => j.expertise))) : [];

  if (id && specificJudge) {
    return (
      <div className="min-h-screen bg-background py-8" data-testid="judge-detail-page">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Judge Hero */}
          <div className="bg-card rounded-2xl p-8 shadow-soft border border-border mb-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <Avatar className="w-32 h-32">
                <AvatarImage src={specificJudge.avatar} alt={specificJudge.name} />
                <AvatarFallback className="bg-sky text-white text-3xl">
                  {specificJudge.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              
              <div className="text-center md:text-left flex-1">
                <h1 className="font-heading font-bold text-3xl text-card-foreground mb-2">{specificJudge.name}</h1>
                <p className="text-xl text-muted-foreground mb-4">{specificJudge.title} at {specificJudge.company}</p>
                
                <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow" fill="currentColor" />
                    <span className="font-medium">{specificJudge.rating}</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground text-sm">
                    <MapPin className="w-4 h-4" />
                    <span>{specificJudge.location}</span>
                  </div>
                  <Badge className={`bg-${specificJudge.availability === 'Available' ? 'success' : specificJudge.availability === 'Limited' ? 'yellow' : 'error'}/20 text-${specificJudge.availability === 'Available' ? 'success' : specificJudge.availability === 'Limited' ? 'yellow' : 'error'} px-3 py-1 rounded-full text-sm border-0`}>
                    {specificJudge.availability}
                  </Badge>
                </div>

                <div className="flex justify-center md:justify-start gap-3">
                  {specificJudge.social.linkedin && (
                    <Button variant="outline" size="icon" className="border-sky text-sky hover:bg-sky/10" asChild>
                      <a href={`https://linkedin.com/in/${specificJudge.social.linkedin}`} target="_blank" rel="noopener noreferrer" data-testid="button-linkedin">
                        <Linkedin className="w-4 h-4" />
                      </a>
                    </Button>
                  )}
                  {specificJudge.social.twitter && (
                    <Button variant="outline" size="icon" className="border-sky text-sky hover:bg-sky/10" asChild>
                      <a href={`https://twitter.com/${specificJudge.social.twitter}`} target="_blank" rel="noopener noreferrer" data-testid="button-twitter">
                        <Twitter className="w-4 h-4" />
                      </a>
                    </Button>
                  )}
                  {specificJudge.social.website && (
                    <Button variant="outline" size="icon" className="border-coral text-coral hover:bg-coral/10" asChild>
                      <a href={specificJudge.social.website} target="_blank" rel="noopener noreferrer" data-testid="button-website">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Judge Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-card rounded-2xl p-8 shadow-soft border border-border mb-8">
                <h2 className="font-heading font-bold text-2xl text-card-foreground mb-4">About</h2>
                <p className="text-muted-foreground mb-6">{specificJudge.bio}</p>
                
                {specificJudge.quote && (
                  <blockquote className="border-l-4 border-mint pl-6 italic text-muted-foreground">
                    "{specificJudge.quote}"
                  </blockquote>
                )}
              </div>
            </div>

            <div>
              <div className="bg-card rounded-2xl p-6 shadow-soft border border-border mb-6">
                <h3 className="font-heading font-semibold text-lg text-card-foreground mb-4">Expertise</h3>
                <div className="flex flex-wrap gap-2">
                  {specificJudge.expertise.map(skill => (
                    <Badge key={skill} className="bg-sky/20 text-sky px-2 py-1 rounded-full text-xs border-0">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="bg-card rounded-2xl p-6 shadow-soft border border-border mb-6">
                <h3 className="font-heading font-semibold text-lg text-card-foreground mb-4">Experience</h3>
                <div className="space-y-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-coral">{specificJudge.eventsJudged}</div>
                    <div className="text-sm text-muted-foreground">Events Judged</div>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-2xl p-6 shadow-soft border border-border">
                <h3 className="font-heading font-semibold text-lg text-card-foreground mb-4">Badges</h3>
                <div className="flex flex-wrap gap-2">
                  {specificJudge.badges.map(badge => (
                    <Badge key={badge} className="bg-mint/20 text-mint px-2 py-1 rounded-full text-xs border-0">
                      {badge}
                    </Badge>
                  ))}
                </div>
              </div>

              {specificJudge.availability === 'Available' && (
                <div className="mt-6">
                  <Button className="w-full bg-coral text-white hover:bg-coral/80" data-testid="button-invite-jury-member">
                    Invite to Jury Board
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8" data-testid="judges-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="font-heading font-bold text-4xl text-card-foreground mb-4">The Jury Board</h1>
          <CrayonSquiggle className="mx-auto mb-6" />
          <p className="text-muted-foreground text-lg">Connect with industry leaders and invite them to join your jury board</p>
        </div>
        
        {/* Search and Filters */}
        <div className="bg-card rounded-2xl p-6 shadow-soft mb-8 border border-border">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search jury members by name, company, or expertise..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-sky focus:border-transparent"
                  data-testid="input-search-jury-members"
                />
              </div>
            </div>
            
            <Select value={selectedExpertise} onValueChange={setSelectedExpertise}>
              <SelectTrigger className="w-48 border-border rounded-xl" data-testid="select-expertise">
                <SelectValue placeholder="Expertise" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Expertise</SelectItem>
                {allExpertise.map(exp => (
                  <SelectItem key={exp} value={exp}>{exp}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedAvailability} onValueChange={setSelectedAvailability}>
              <SelectTrigger className="w-48 border-border rounded-xl" data-testid="select-availability">
                <SelectValue placeholder="Availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Availability</SelectItem>
                <SelectItem value="Available">Available</SelectItem>
                <SelectItem value="Limited">Limited</SelectItem>
                <SelectItem value="Unavailable">Unavailable</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="bg-card rounded-2xl p-6 shadow-soft border border-border text-center">
                <Skeleton className="w-20 h-20 rounded-full mx-auto mb-4" />
                <Skeleton className="h-6 w-3/4 mx-auto mb-2" />
                <Skeleton className="h-4 w-1/2 mx-auto mb-4" />
                <div className="flex gap-2 justify-center mb-4">
                  <Skeleton className="h-6 w-12" />
                  <Skeleton className="h-6 w-16" />
                </div>
                <Skeleton className="h-4 w-20 mx-auto" />
              </div>
            ))}
          </div>
        ) : judges && judges.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {judges.map((judge) => (
              <div 
                key={judge.id} 
                onClick={() => setSelectedJudge(judge)}
                className="cursor-pointer"
                data-testid={`judge-card-${judge.id}`}
              >
                <JuryMemberCard judge={judge} showContactButton />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">👨‍💼</div>
            <h3 className="font-heading font-semibold text-xl text-card-foreground mb-2">No jury members found</h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery || selectedExpertise || selectedAvailability
                ? "Try adjusting your search or filters"
                : "Our jury board network is growing. Check back soon!"
              }
            </p>
            <Button 
              onClick={() => {
                setSearchQuery("");
                setSelectedExpertise("");
                setSelectedAvailability("");
              }}
              className="bg-coral text-white hover:bg-coral/80"
              data-testid="button-clear-filters"
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Judge Detail Modal */}
        <Dialog open={!!selectedJudge} onOpenChange={() => setSelectedJudge(null)}>
          <DialogContent className="max-w-2xl bg-card" data-testid="judge-detail-modal">
            {selectedJudge && (
              <>
                <DialogHeader>
                  <div className="flex items-center gap-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={selectedJudge.avatar} alt={selectedJudge.name} />
                      <AvatarFallback className="bg-sky text-white">
                        {selectedJudge.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <DialogTitle className="font-heading font-bold text-xl text-card-foreground">
                        {selectedJudge.name}
                      </DialogTitle>
                      <DialogDescription className="text-muted-foreground">
                        {selectedJudge.title} at {selectedJudge.company}
                      </DialogDescription>
                    </div>
                  </div>
                </DialogHeader>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-card-foreground mb-2">About</h3>
                    <p className="text-muted-foreground text-sm">{selectedJudge.bio}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-card-foreground mb-2">Expertise</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedJudge.expertise.slice(0, 6).map(skill => (
                        <Badge key={skill} className="bg-sky/20 text-sky px-2 py-1 rounded-full text-xs border-0">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center pt-4 border-t border-border">
                    <div className="flex gap-2">
                      {selectedJudge.social.linkedin && (
                        <Button variant="outline" size="icon" className="border-sky text-sky hover:bg-sky/10" asChild>
                          <a href={`https://linkedin.com/in/${selectedJudge.social.linkedin}`} target="_blank" rel="noopener noreferrer">
                            <Linkedin className="w-4 h-4" />
                          </a>
                        </Button>
                      )}
                      {selectedJudge.social.twitter && (
                        <Button variant="outline" size="icon" className="border-sky text-sky hover:bg-sky/10" asChild>
                          <a href={`https://twitter.com/${selectedJudge.social.twitter}`} target="_blank" rel="noopener noreferrer">
                            <Twitter className="w-4 h-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                    
                    {selectedJudge.availability === 'Available' && (
                      <Button className="bg-coral text-white hover:bg-coral/80">
                        Invite to Jury Board
                      </Button>
                    )}
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
