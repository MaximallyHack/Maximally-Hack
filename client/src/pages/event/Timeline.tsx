import { useEvent } from '@/contexts/EventContext';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, Users, Trophy, Zap, Calendar, Play } from 'lucide-react';

export default function Timeline() {
  const { event } = useEvent();

  if (!event) return null;

  const currentTime = new Date();
  const eventStart = new Date(event.startDate);
  const eventEnd = new Date(event.endDate);
  
  // Use the timeline from the event data if available, otherwise create a default one
  const timelineItems = event.timeline || [
    {
      time: "Registration Opens",
      title: "Welcome Builders!",
      description: "Registration is now open. Join the community and prepare for the hackathon.",
      isActive: false,
      isCompleted: true
    },
    {
      time: "Event Kickoff",
      title: "Let's Build Something Amazing!",
      description: "Official hackathon begins. Time to form teams and start building.",
      isActive: currentTime >= eventStart && currentTime < eventEnd,
      isCompleted: currentTime > eventStart
    },
    {
      time: "Mid-Event Check-in",
      title: "Progress Share & Mentorship",
      description: "Share your progress, get feedback, and connect with mentors.",
      isActive: false,
      isCompleted: false
    },
    {
      time: "Final Stretch",
      title: "Polish & Perfect",
      description: "Last chance to polish your projects and prepare for submission.",
      isActive: false,
      isCompleted: false
    },
    {
      time: "Submissions Close",
      title: "Time's Up!",
      description: "All submissions must be in. No more changes allowed.",
      isActive: false,
      isCompleted: false
    },
    {
      time: "Judging Period",
      title: "Review & Evaluation",
      description: "Judges review all submissions and select winners.",
      isActive: false,
      isCompleted: false
    },
    {
      time: "Winners Announced",
      title: "Celebration Time!",
      description: "Winners announced and prizes distributed.",
      isActive: false,
      isCompleted: false
    }
  ];

  const getItemIcon = (item: any, index: number) => {
    if (item.isCompleted) return <CheckCircle className="w-5 h-5 text-success" />;
    if (item.isActive) return <Zap className="w-5 h-5 text-coral animate-pulse" />;
    return <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground">{index + 1}</div>;
  };

  const getItemColor = (item: any) => {
    if (item.isCompleted) return 'border-success/30 bg-success/5';
    if (item.isActive) return 'border-coral/30 bg-coral/5';
    return 'border-border';
  };

  const formatEventTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-8">
      {/* Event Overview */}
      <section className="text-center">
        <h1 className="text-3xl font-bold text-foreground mb-4">Event Timeline</h1>
        <p className="text-lg text-muted-foreground mb-6">
          Track your hackathon journey from registration to winners announcement
        </p>
        
        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <Play className="w-5 h-5 text-mint" />
              <div className="text-left">
                <p className="text-sm text-muted-foreground">Starts</p>
                <p className="font-medium">{formatEventTime(event.startDate)}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <Trophy className="w-5 h-5 text-coral" />
              <div className="text-left">
                <p className="text-sm text-muted-foreground">Ends</p>
                <p className="font-medium">{formatEventTime(event.endDate)}</p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Current Status */}
      <section>
        <Card className="p-6 bg-gradient-to-r from-sky/10 to-mint/10 border-sky/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-sky/20 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-sky" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Current Status</h3>
                <p className="text-muted-foreground">
                  {event.status === 'upcoming' && 'Event starts soon - get ready!'}
                  {event.status === 'registration_open' && 'Registration is open - join now!'}
                  {event.status === 'active' && 'Hackathon is live - keep building!'}
                  {event.status === 'completed' && 'Event completed - congratulations to all participants!'}
                </p>
              </div>
            </div>
            
            <Badge 
              className={
                event.status === 'active' ? 'bg-success/20 text-success' :
                event.status === 'registration_open' ? 'bg-yellow/20 text-yellow' :
                event.status === 'completed' ? 'bg-muted text-muted-foreground' :
                'bg-sky/20 text-sky'
              }
            >
              {event.status === 'registration_open' ? 'Registration Open' :
               event.status === 'active' ? 'Live Now' :
               event.status === 'completed' ? 'Completed' :
               'Upcoming'}
            </Badge>
          </div>
        </Card>
      </section>

      {/* Timeline */}
      <section>
        <h2 className="text-2xl font-bold text-foreground mb-6">Hackathon Journey</h2>
        
        <div className="space-y-6">
          {timelineItems.map((item, index) => (
            <div key={index} className="flex gap-6">
              {/* Timeline Line */}
              <div className="flex flex-col items-center">
                <div className="flex-shrink-0 w-10 h-10 rounded-full border-2 bg-background flex items-center justify-center">
                  {getItemIcon(item, index)}
                </div>
                {index < timelineItems.length - 1 && (
                  <div className={`w-0.5 h-12 mt-2 ${
                    item.isCompleted ? 'bg-success' : 'bg-border'
                  }`} />
                )}
              </div>
              
              {/* Content */}
              <Card className={`flex-1 p-6 ${getItemColor(item)}`}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                      {item.isActive && (
                        <Badge variant="secondary" className="bg-coral/20 text-coral">
                          <Zap className="w-3 h-3 mr-1" />
                          Active Now
                        </Badge>
                      )}
                      {item.isCompleted && (
                        <Badge variant="secondary" className="bg-success/20 text-success">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Complete
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground font-medium mb-1">{item.time}</p>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                  
                  {item.isActive && (
                    <div className="flex items-center gap-1 text-sm text-coral">
                      <Clock className="w-4 h-4" />
                      <span>Happening now</span>
                    </div>
                  )}
                </div>
                
                {/* Action Buttons for Active Items */}
                {item.isActive && (
                  <div className="flex gap-2 mt-4 pt-4 border-t">
                    <Button size="sm">
                      <Users className="w-4 h-4 mr-2" />
                      Join Discord
                    </Button>
                    <Button size="sm" variant="outline">
                      <Trophy className="w-4 h-4 mr-2" />
                      View Submissions
                    </Button>
                  </div>
                )}
              </Card>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Stats */}
      <section>
        <h2 className="text-2xl font-bold text-foreground mb-6">Event Progress</h2>
        
        <div className="grid md:grid-cols-4 gap-4">
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-sky mb-1">234</div>
            <div className="text-sm text-muted-foreground">Registered</div>
          </Card>
          
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-mint mb-1">47</div>
            <div className="text-sm text-muted-foreground">Teams Formed</div>
          </Card>
          
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-coral mb-1">12</div>
            <div className="text-sm text-muted-foreground">Submissions</div>
          </Card>
          
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow mb-1">8</div>
            <div className="text-sm text-muted-foreground">Mentors Available</div>
          </Card>
        </div>
      </section>
    </div>
  );
}