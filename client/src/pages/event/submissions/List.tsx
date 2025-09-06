import { useEvent } from '@/contexts/EventContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link } from 'wouter';
import { 
  Search, Filter, ExternalLink, Users, 
  Trophy, Star, Clock, Code 
} from 'lucide-react';

const mockSubmissions = [
  {
    id: 'sub-1',
    title: 'EcoTrack - Carbon Footprint Manager',
    description: 'AI-powered app that helps individuals track and reduce their carbon footprint through personalized recommendations.',
    team: 'Green Innovators',
    members: ['Alice Chen', 'Bob Martinez', 'Carol Kim'],
    track: 'Climate & Sustainability',
    status: 'submitted',
    demoUrl: 'https://ecotrack.dev',
    likes: 42,
    submittedAt: '2024-12-15T14:30:00Z'
  },
  {
    id: 'sub-2', 
    title: 'MindfulAI - Mental Health Companion',
    description: 'Compassionate AI chatbot providing 24/7 mental health support with crisis detection and professional referrals.',
    team: 'HealthTech Heroes',
    members: ['David Lee', 'Emma Rodriguez'],
    track: 'Healthcare & Wellness',
    status: 'submitted',
    demoUrl: 'https://mindfulai.app',
    likes: 38,
    submittedAt: '2024-12-15T13:45:00Z'
  },
  {
    id: 'sub-3',
    title: 'CodeMentor - Interactive Learning Platform',
    description: 'Gamified coding education platform with real-time mentorship and adaptive learning paths.',
    team: 'EduCode',
    members: ['Frank Wilson', 'Grace Taylor', 'Henry Brown', 'Ivy Johnson'],
    track: 'Education & Learning', 
    status: 'submitted',
    demoUrl: 'https://codementor.edu',
    likes: 35,
    submittedAt: '2024-12-15T12:15:00Z'
  }
];

export default function SubmissionsList() {
  const { event } = useEvent();

  if (!event) return null;

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Project Submissions</h2>
          <p className="text-muted-foreground">
            Browse all submitted projects for this hackathon
          </p>
        </div>
        <Badge variant="outline" className="px-3 py-1">
          {mockSubmissions.length} Projects
        </Badge>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            className="pl-10"
          />
        </div>
        <Select>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by track" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tracks</SelectItem>
            <SelectItem value="ai">AI & Machine Learning</SelectItem>
            <SelectItem value="climate">Climate & Sustainability</SelectItem>
            <SelectItem value="health">Healthcare & Wellness</SelectItem>
            <SelectItem value="education">Education & Learning</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="icon">
          <Filter className="w-4 h-4" />
        </Button>
      </div>

      {/* Submissions Grid */}
      <div className="grid gap-6">
        {mockSubmissions.map((submission) => (
          <Card key={submission.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <CardTitle className="text-xl">
                      <Link href={`/e/${event.slug}/submissions/${submission.id}`}>
                        <span className="hover:text-coral cursor-pointer">
                          {submission.title}
                        </span>
                      </Link>
                    </CardTitle>
                    <Badge variant="outline">{submission.track}</Badge>
                  </div>
                  <p className="text-muted-foreground mb-3">
                    {submission.description}
                  </p>
                </div>
                <Button size="sm" variant="ghost" className="ml-4">
                  <Star className="w-4 h-4 mr-1" />
                  {submission.likes}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{submission.team}</span>
                  </div>
                  <div className="flex -space-x-2">
                    {submission.members.slice(0, 3).map((member, idx) => (
                      <Avatar key={idx} className="w-6 h-6 border-2 border-background">
                        <AvatarFallback className="text-xs">
                          {getInitials(member)}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                    {submission.members.length > 3 && (
                      <div className="w-6 h-6 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs">
                        +{submission.members.length - 3}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{formatDate(submission.submittedAt)}</span>
                  </div>
                  <Button size="sm" variant="outline" asChild>
                    <a href={submission.demoUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Demo
                    </a>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href={`/e/${event.slug}/submissions/${submission.id}`}>
                      View Details
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {mockSubmissions.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Code className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Submissions Yet</h3>
            <p className="text-muted-foreground mb-4">
              Be the first to submit your project for this hackathon!
            </p>
            <Button>Submit Your Project</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}