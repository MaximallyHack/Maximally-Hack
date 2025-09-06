import { useEvent } from '@/contexts/EventContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, Clock, Users, Trophy, Target, 
  Calendar, MapPin, Globe, ExternalLink 
} from 'lucide-react';

const quickStartItems = [
  {
    id: '1',
    title: 'Join the Discord',
    description: 'Connect with other participants and get real-time updates',
    completed: false,
    action: 'Join Discord'
  },
  {
    id: '2',
    title: 'Form or join a team',
    description: 'Find teammates with complementary skills',
    completed: false,
    action: 'Browse Teams'
  },
  {
    id: '3',
    title: 'Read the rules & judging criteria',
    description: 'Understand what judges are looking for',
    completed: false,
    action: 'View Rules'
  },
  {
    id: '4',
    title: 'Start building your project',
    description: 'Begin development and track your progress',
    completed: false,
    action: 'Create Project'
  }
];

export default function Overview() {
  const { event } = useEvent();

  if (!event) return null;

  return (
    <div className="space-y-8">
      {/* Hero Description */}
      <section>
        <h2 className="text-2xl font-bold text-foreground mb-4">About the Event</h2>
        <div className="prose prose-lg max-w-none">
          <p className="text-muted-foreground leading-relaxed">
            {event.longDescription || event.description}
          </p>
        </div>
      </section>

      {/* Quick Start Guide */}
      <section>
        <h2 className="text-2xl font-bold text-foreground mb-6">Quick Start Guide</h2>
        <div className="grid gap-4">
          {quickStartItems.map((item, index) => (
            <Card key={item.id} className="p-4">
              <div className="flex items-start gap-4">
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  item.completed ? 'bg-success text-white' : 'bg-muted text-muted-foreground'
                }`}>
                  {item.completed ? <CheckCircle className="w-4 h-4" /> : index + 1}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                  <Button size="sm" variant="outline">
                    {item.action}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Event Highlights */}
      <section>
        <h2 className="text-2xl font-bold text-foreground mb-6">Event Highlights</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <Trophy className="h-4 w-4 text-coral" />
              <CardTitle className="text-sm font-medium ml-2">Prize Pool</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${event.prizePool.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Distributed across multiple tracks</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <Users className="h-4 w-4 text-sky" />
              <CardTitle className="text-sm font-medium ml-2">Participants</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">234</div>
              <p className="text-xs text-muted-foreground">Registered and ready to hack</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <Clock className="h-4 w-4 text-mint" />
              <CardTitle className="text-sm font-medium ml-2">Duration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">48 hours</div>
              <p className="text-xs text-muted-foreground">Non-stop innovation</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Key Information */}
      <section>
        <h2 className="text-2xl font-bold text-foreground mb-6">Key Information</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Event Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Date & Time</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Location</p>
                  <p className="text-sm text-muted-foreground">{event.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Globe className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Format</p>
                  <p className="text-sm text-muted-foreground">
                    {event.location === 'Virtual' ? 'Online Event' : 'In-Person Event'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Resources</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {event.discordUrl && (
                <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                  <a href={event.discordUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Discord Community
                  </a>
                </Button>
              )}
              {event.devpostUrl && (
                <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                  <a href={event.devpostUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Devpost Page
                  </a>
                </Button>
              )}
              <Button variant="outline" size="sm" className="w-full justify-start">
                <ExternalLink className="w-4 h-4 mr-2" />
                Event Website
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}