import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useConfetti } from "@/components/ui/confetti";
import { 
  Calendar, Clock, Globe, Users, Trophy, MapPin, 
  ExternalLink, ArrowRight, Star, Settings
} from "lucide-react";
import { api } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

export default function SimpleEventDetail() {
  const { slug } = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  const { toast } = useToast();
  const { trigger: triggerConfetti, Confetti } = useConfetti();

  const { data: event, isLoading } = useQuery({
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Skeleton className="h-8 w-3/4 mb-4" />
          <Skeleton className="h-4 w-1/2 mb-8" />
          <div className="grid grid-cols-4 gap-4 mb-8">
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-medium text-gray-900 mb-4">Event not found</h1>
          <Link href="/explore">
            <Button variant="outline">Back to explore</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleRegister = () => {
    toast({
      title: "Registration successful",
      description: "You've been registered for this hackathon.",
    });
    triggerConfetti();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDuration = () => {
    const start = new Date(event.startDate);
    const end = new Date(event.endDate);
    const hours = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60));
    return `${hours}h`;
  };

  return (
    <div className="min-h-screen bg-white" data-testid="simple-event-detail">
      <Confetti />
      
      {/* Header */}
      <div className="border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-3xl font-medium text-gray-900 mb-3">{event.title}</h1>
              <p className="text-gray-600 text-lg">{event.description}</p>
            </div>
            <div>
              <Button onClick={handleRegister} className="bg-gray-900 hover:bg-gray-800">
                Register Now
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Calendar className="w-5 h-5 text-gray-600 mx-auto mb-2" />
              <div className="text-sm font-medium text-gray-900">{formatDate(event.startDate)}</div>
              <div className="text-xs text-gray-500">Start Date</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Clock className="w-5 h-5 text-gray-600 mx-auto mb-2" />
              <div className="text-sm font-medium text-gray-900">{getDuration()}</div>
              <div className="text-xs text-gray-500">Duration</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Trophy className="w-5 h-5 text-gray-600 mx-auto mb-2" />
              <div className="text-sm font-medium text-gray-900">${(event.prizePool / 1000).toFixed(0)}k</div>
              <div className="text-xs text-gray-500">Prize Pool</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Users className="w-5 h-5 text-gray-600 mx-auto mb-2" />
              <div className="text-sm font-medium text-gray-900">{event.participantCount.toLocaleString()}</div>
              <div className="text-xs text-gray-500">Participants</div>
            </div>
          </div>

          {/* Status & Location */}
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                event.status === 'active' ? 'bg-green-500' :
                event.status === 'upcoming' ? 'bg-yellow-500' :
                'bg-gray-400'
              }`} />
              <span className="capitalize">{event.status.replace('_', ' ')}</span>
            </div>
            <Separator orientation="vertical" className="h-4" />
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{event.location}</span>
            </div>
            <Separator orientation="vertical" className="h-4" />
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              <span className="capitalize">{event.format}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start bg-gray-50 p-1 rounded-lg mb-8">
            <TabsTrigger value="overview" className="rounded-md">Overview</TabsTrigger>
            <TabsTrigger value="prizes" className="rounded-md">Prizes</TabsTrigger>
            <TabsTrigger value="rules" className="rounded-md">Rules</TabsTrigger>
            <TabsTrigger value="teams" className="rounded-md">Teams</TabsTrigger>
            <TabsTrigger value="submissions" className="rounded-md">Submissions</TabsTrigger>
            <TabsTrigger value="timeline" className="rounded-md">Timeline</TabsTrigger>
            <TabsTrigger value="resources" className="rounded-md">Resources</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            <div>
              <h2 className="text-xl font-medium text-gray-900 mb-4">About</h2>
              <p className="text-gray-600 leading-relaxed mb-6">{event.longDescription}</p>
              
              {event.tracks && event.tracks.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Tracks</h3>
                  <div className="flex flex-wrap gap-2">
                    {event.tracks.map(track => (
                      <Badge key={track} variant="outline" className="rounded-full">
                        {track}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Links and Social Media */}
            <div>
              <h2 className="text-xl font-medium text-gray-900 mb-4">Links & Social</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {event.links && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Official Links</h3>
                    <div className="space-y-2">
                      {event.links.website && (
                        <a 
                          href={event.links.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Official Website
                        </a>
                      )}
                      {event.links.registration && (
                        <a 
                          href={event.links.registration} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Registration
                        </a>
                      )}
                      {event.links.devpost && (
                        <a 
                          href={event.links.devpost} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Devpost
                        </a>
                      )}
                      {event.links.discord && (
                        <a 
                          href={event.links.discord} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Discord
                        </a>
                      )}
                    </div>
                  </div>
                )}
                
                {event.socials && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Social Media</h3>
                    <div className="space-y-2">
                      {Object.entries(event.socials).map(([platform, url]) => (
                        <a 
                          key={platform}
                          href={url as string} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors capitalize"
                        >
                          <ExternalLink className="w-4 h-4" />
                          {platform}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="prizes" className="space-y-6">
            <h2 className="text-xl font-medium text-gray-900">Prizes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {event.prizes?.map((prize, index) => (
                <Card key={index} className="border border-gray-200">
                  <CardContent className="p-6 text-center">
                    {prize.place && (
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-3 text-white font-medium ${
                        prize.place === 1 ? 'bg-yellow-500' :
                        prize.place === 2 ? 'bg-gray-400' :
                        'bg-orange-600'
                      }`}>
                        {prize.place}
                      </div>
                    )}
                    <h3 className="font-medium text-gray-900 mb-2">{prize.title}</h3>
                    <div className="text-2xl font-medium text-gray-900 mb-2">
                      ${(prize.amount / 1000).toFixed(0)}k
                    </div>
                    {prize.description && (
                      <p className="text-sm text-gray-600">{prize.description}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="rules" className="space-y-6">
            <h2 className="text-xl font-medium text-gray-900">Rules & Guidelines</h2>
            <div className="space-y-3">
              {event.rules?.map((rule, index) => (
                <div key={index} className="flex gap-3 p-4 bg-gray-50 rounded-lg">
                  <div className="text-gray-900 font-medium text-sm min-w-0 flex-1">
                    {rule}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="teams" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-medium text-gray-900">Teams</h2>
              <Button variant="outline" size="sm">
                Create Team
              </Button>
            </div>
            
            {teams && teams.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {teams.map(team => (
                  <Card key={team.id} className="border border-gray-200">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium text-gray-900">{team.name}</h3>
                        <Badge variant="outline" className="text-xs">
                          {team.members?.length || 0}/4
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">{team.description}</p>
                      <Button variant="outline" size="sm" className="w-full">
                        Join Team
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 mb-4">No teams yet</p>
                <Button variant="outline">Create the first team</Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="submissions" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-medium text-gray-900">Submissions</h2>
              <Button variant="outline" size="sm">
                Submit Project
              </Button>
            </div>
            
            {submissions && submissions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {submissions.map(submission => (
                  <Card key={submission.id} className="border border-gray-200">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-medium text-gray-900">{submission.title}</h3>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Star className="w-4 h-4" />
                          <span>{submission.averageScore || 0}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">{submission.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-500">
                          by Team
                        </div>
                        <Button variant="ghost" size="sm">
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 mb-4">No submissions yet</p>
                <Button variant="outline">Submit first project</Button>
              </div>
            )}
          </TabsContent>

          {/* Timeline Tab */}
          <TabsContent value="timeline" className="space-y-6">
            <h2 className="text-xl font-medium text-gray-900">Timeline</h2>
            {event.timeline && event.timeline.length > 0 ? (
              <div className="space-y-4">
                {event.timeline.map((item, index) => (
                  <div key={index} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm font-medium text-gray-900 min-w-0 flex-1">
                      {item.title}
                    </div>
                    <div className="text-sm text-gray-500 whitespace-nowrap">
                      {item.time}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600">Timeline coming soon</p>
              </div>
            )}
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources" className="space-y-6">
            <h2 className="text-xl font-medium text-gray-900">Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Getting Started</h3>
                <div className="space-y-3">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Hackathon Guide</h4>
                    <p className="text-sm text-gray-600">Everything you need to know to participate</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Submission Guidelines</h4>
                    <p className="text-sm text-gray-600">How to submit your project properly</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Judging Criteria</h4>
                    <p className="text-sm text-gray-600">What judges will be looking for</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Development Tools</h3>
                <div className="space-y-3">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">API Access</h4>
                    <p className="text-sm text-gray-600">Free APIs and services for participants</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Design Assets</h4>
                    <p className="text-sm text-gray-600">Logos, colors, and brand guidelines</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Code Templates</h4>
                    <p className="text-sm text-gray-600">Starter projects and boilerplates</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact & Support */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Need Help?</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg text-center">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white text-sm">💬</span>
                  </div>
                  <h4 className="font-medium text-gray-900 mb-2">Join Discord</h4>
                  <p className="text-sm text-gray-600">Get help from mentors and peers</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg text-center">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white text-sm">📧</span>
                  </div>
                  <h4 className="font-medium text-gray-900 mb-2">Email Support</h4>
                  <p className="text-sm text-gray-600">Direct help from organizers</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg text-center">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white text-sm">📚</span>
                  </div>
                  <h4 className="font-medium text-gray-900 mb-2">Documentation</h4>
                  <p className="text-sm text-gray-600">Detailed guides and tutorials</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}