import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { 
  Calendar, Trophy, Users, Clock, MapPin, ExternalLink,
  Settings, Bell, Award, TrendingUp
} from "lucide-react";

export default function Dashboard() {
  const { user, unregisterFromEvent } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");

  const { data: events } = useQuery({
    queryKey: ['events'],
    queryFn: api.getEvents,
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-medium text-gray-900 mb-4">Please log in</h1>
          <Link href="/login">
            <Button>Go to Login</Button>
          </Link>
        </div>
      </div>
    );
  }

  const registeredEvents = events?.filter(event => 
    user.registeredEvents.includes(event.id)
  ) || [];

  const upcomingEvents = registeredEvents.filter(event => 
    event.status === 'upcoming' || event.status === 'registration_open'
  );

  const activeEvents = registeredEvents.filter(event => 
    event.status === 'active'
  );

  const completedEvents = registeredEvents.filter(event => 
    event.status === 'completed'
  );

  const handleUnregister = async (eventId: string, eventTitle: string) => {
    const result = await unregisterFromEvent(eventId);
    if (result.success) {
      toast({
        title: "Unregistered successfully",
        description: `You've been removed from ${eventTitle}`,
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'registration_open': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-medium text-gray-900">
                Welcome back, {user.fullName || user.username}
              </h1>
              <p className="text-gray-600 mt-1">Track your hackathon journey and explore new opportunities</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </Button>
              <Link href="/profile">
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-semibold text-gray-900 mb-1">
                  {registeredEvents.length}
                </div>
                <div className="text-sm text-gray-600">Total Events</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-semibold text-blue-600 mb-1">
                  {activeEvents.length}
                </div>
                <div className="text-sm text-gray-600">Active Now</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-semibold text-green-600 mb-1">
                  {completedEvents.length}
                </div>
                <div className="text-sm text-gray-600">Completed</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-semibold text-purple-600 mb-1">
                  0
                </div>
                <div className="text-sm text-gray-600">Awards Won</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gray-50 p-1 rounded-lg mb-8">
            <TabsTrigger value="overview" className="rounded-md">Overview</TabsTrigger>
            <TabsTrigger value="active" className="rounded-md">Active Events</TabsTrigger>
            <TabsTrigger value="upcoming" className="rounded-md">Upcoming</TabsTrigger>
            <TabsTrigger value="completed" className="rounded-md">History</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {registeredEvents.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🚀</div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">No hackathons yet</h3>
                <p className="text-gray-600 mb-6">Start your journey by exploring and registering for hackathons</p>
                <Link href="/explore">
                  <Button className="bg-gray-900 hover:bg-gray-800">
                    Explore Hackathons
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Quick Actions */}
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-medium text-gray-900">Quick Actions</h2>
                  <Link href="/explore">
                    <Button variant="outline">Find More Events</Button>
                  </Link>
                </div>

                {/* Recent Activity */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {registeredEvents.slice(0, 3).map(event => (
                      <div key={event.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">Registered for {event.title}</p>
                          <p className="text-sm text-gray-600">Event starts {formatDate(event.startDate)}</p>
                        </div>
                        <Badge className={getStatusColor(event.status)}>
                          {event.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="active" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-medium text-gray-900">Active Events</h2>
            </div>
            
            {activeEvents.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-600">No active events</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activeEvents.map(event => (
                  <Card key={event.id} className="border border-green-200 bg-green-50">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{event.title}</CardTitle>
                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">{event.description}</p>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span>Ends {formatDate(event.endDate)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Trophy className="w-4 h-4 text-gray-500" />
                          <span>${(event.prizePool / 1000).toFixed(0)}k prize pool</span>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Link href={`/e/${event.slug}`}>
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            View Event
                          </Button>
                        </Link>
                        <Link href={`/e/${event.slug}/submit`}>
                          <Button size="sm" variant="outline">
                            Submit Project
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="upcoming" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-medium text-gray-900">Upcoming Events</h2>
            </div>
            
            {upcomingEvents.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-600 mb-4">No upcoming events</p>
                <Link href="/explore">
                  <Button variant="outline">Find Events to Join</Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {upcomingEvents.map(event => (
                  <Card key={event.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{event.title}</CardTitle>
                        <Badge className={getStatusColor(event.status)}>
                          {event.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">{event.description}</p>
                      <div className="space-y-2 text-sm mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span>Starts {formatDate(event.startDate)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Trophy className="w-4 h-4 text-gray-500" />
                          <span>${(event.prizePool / 1000).toFixed(0)}k prize pool</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/e/${event.slug}`}>
                          <Button size="sm">View Details</Button>
                        </Link>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleUnregister(event.id, event.title)}
                        >
                          Unregister
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-medium text-gray-900">Completed Events</h2>
            </div>
            
            {completedEvents.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-600">No completed events yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {completedEvents.map(event => (
                  <Card key={event.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 mb-1">{event.title}</h3>
                          <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>Completed {formatDate(event.endDate)}</span>
                            <span>${(event.prizePool / 1000).toFixed(0)}k prize pool</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-gray-100 text-gray-800">Completed</Badge>
                          <Link href={`/e/${event.slug}`}>
                            <Button size="sm" variant="outline">
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}