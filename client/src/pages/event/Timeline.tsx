import { useEvent } from '@/contexts/EventContext';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, Circle, PlayCircle } from 'lucide-react';

const timelineEvents = [
  {
    id: '1',
    title: 'Registration Opens',
    description: 'Sign up opens for all participants',
    time: '2024-12-01 09:00',
    status: 'completed' as const
  },
  {
    id: '2',
    title: 'Opening Ceremony',
    description: 'Welcome presentation and rules overview',
    time: '2024-12-14 03:30',
    status: 'active' as const
  },
  {
    id: '3',
    title: 'Hacking Begins',
    description: 'Teams start building their projects',
    time: '2024-12-14 04:00',
    status: 'upcoming' as const
  },
  {
    id: '4',
    title: 'First Check-in',
    description: 'Teams share progress updates',
    time: '2024-12-14 16:00',
    status: 'upcoming' as const
  },
  {
    id: '5',
    title: 'Mentor Office Hours',
    description: '1-on-1 sessions with industry experts',
    time: '2024-12-14 18:00',
    status: 'upcoming' as const
  },
  {
    id: '6',
    title: 'Midnight Check-in',
    description: 'Late night progress sharing',
    time: '2024-12-15 00:00',
    status: 'upcoming' as const
  },
  {
    id: '7',
    title: 'Final Push',
    description: 'Last 6 hours of development',
    time: '2024-12-15 09:00',
    status: 'upcoming' as const
  },
  {
    id: '8',
    title: 'Submission Deadline',
    description: 'All projects must be submitted',
    time: '2024-12-15 15:00',
    status: 'upcoming' as const
  },
  {
    id: '9',
    title: 'Judging Period',
    description: 'Judges review and score submissions',
    time: '2024-12-15 15:30',
    status: 'upcoming' as const
  },
  {
    id: '10',
    title: 'Project Demos',
    description: 'Top teams present to judges',
    time: '2024-12-15 17:00',
    status: 'upcoming' as const
  },
  {
    id: '11',
    title: 'Awards Ceremony',
    description: 'Winners announced and prizes distributed',
    time: '2024-12-15 19:00',
    status: 'upcoming' as const
  }
];

export default function Timeline() {
  const { event } = useEvent();

  if (!event) return null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-success" />;
      case 'active':
        return <PlayCircle className="w-5 h-5 text-coral" />;
      default:
        return <Circle className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-success/20 text-success';
      case 'active':
        return 'bg-coral/20 text-coral';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Event Timeline</h2>
        <p className="text-muted-foreground">
          Follow the key milestones and important events throughout the hackathon.
        </p>
      </div>

      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-muted"></div>

        <div className="space-y-8">
          {timelineEvents.map((item, index) => (
            <div key={item.id} className="relative flex items-start gap-4">
              {/* Status Icon */}
              <div className="relative z-10 flex-shrink-0 bg-background p-1">
                {getStatusIcon(item.status)}
              </div>

              {/* Content Card */}
              <Card className="flex-1">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="font-semibold text-foreground">{item.title}</h3>
                    <Badge variant="secondary" className={getStatusColor(item.status)}>
                      {item.status === 'completed' ? 'Completed' : 
                       item.status === 'active' ? 'In Progress' : 'Upcoming'}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">
                    {item.description}
                  </p>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{formatTime(item.time)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}