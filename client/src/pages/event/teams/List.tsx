import { useEvent } from '@/contexts/EventContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link } from 'wouter';
import { 
  Search, Users, Plus, Clock, 
  UserPlus, CheckCircle, X 
} from 'lucide-react';

const mockTeams = [
  {
    id: 'team-1',
    name: 'AI Climate Solutions',
    description: 'Building ML models to predict and prevent climate disasters. Looking for passionate developers!',
    leaderId: 'user-1',
    leaderName: 'Sarah Chen',
    members: [
      { id: 'user-1', name: 'Sarah Chen', role: 'Team Lead & AI Engineer', skills: ['Python', 'TensorFlow', 'Climate Data'] },
      { id: 'user-2', name: 'Marcus Rodriguez', role: 'Backend Developer', skills: ['Node.js', 'PostgreSQL', 'APIs'] }
    ],
    lookingFor: ['Frontend Developer', 'UI/UX Designer', 'Data Scientist'],
    skills: ['Python', 'TensorFlow', 'Node.js', 'PostgreSQL'],
    maxSize: 5,
    status: 'recruiting' as const,
    track: 'Climate & Sustainability',
    created: '2024-01-15T10:00:00Z'
  },
  {
    id: 'team-2',
    name: 'EduTech Revolution',
    description: 'Creating accessible learning tools for students with disabilities.',
    leaderId: 'user-3',
    leaderName: 'Alex Kim',
    members: [
      { id: 'user-3', name: 'Alex Kim', role: 'Product Manager', skills: ['Product Strategy', 'User Research', 'Accessibility'] },
      { id: 'user-4', name: 'Jordan Lee', role: 'Full Stack Developer', skills: ['React', 'Express', 'MongoDB'] },
      { id: 'user-5', name: 'Taylor Swift', role: 'UX Designer', skills: ['Figma', 'User Testing', 'Accessibility Design'] }
    ],
    lookingFor: ['Mobile Developer', 'Accessibility Expert'],
    skills: ['React', 'Express', 'MongoDB', 'Figma', 'Accessibility'],
    maxSize: 4,
    status: 'recruiting' as const,
    track: 'Education & Learning',
    created: '2024-01-15T14:30:00Z'
  },
  {
    id: 'team-3',
    name: 'HealthConnect',
    description: 'Platform connecting rural patients with urban healthcare providers.',
    leaderId: 'user-6',
    leaderName: 'Dr. Priya Patel',
    members: [
      { id: 'user-6', name: 'Dr. Priya Patel', role: 'Healthcare Expert & PM', skills: ['Healthcare', 'Telemedicine', 'Compliance'] },
      { id: 'user-7', name: 'Kevin Zhang', role: 'Frontend Developer', skills: ['Vue.js', 'TypeScript', 'WebRTC'] },
      { id: 'user-8', name: 'Maya Johnson', role: 'Backend Developer', skills: ['Python', 'FastAPI', 'Healthcare APIs'] },
      { id: 'user-9', name: 'Lisa Wong', role: 'Security Engineer', skills: ['HIPAA', 'Encryption', 'Security Audits'] }
    ],
    lookingFor: [],
    skills: ['Vue.js', 'TypeScript', 'Python', 'FastAPI', 'Healthcare', 'HIPAA'],
    maxSize: 4,
    status: 'full' as const,
    track: 'Healthcare & Wellness',
    created: '2024-01-14T09:15:00Z'
  }
];

export default function TeamsList() {
  const { event } = useEvent();

  if (!event) return null;

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'recruiting':
        return 'bg-success/20 text-success';
      case 'full':
        return 'bg-muted text-muted-foreground';
      case 'closed':
        return 'bg-destructive/20 text-destructive';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'recruiting':
        return <UserPlus className="w-4 h-4" />;
      case 'full':
        return <CheckCircle className="w-4 h-4" />;
      case 'closed':
        return <X className="w-4 h-4" />;
      default:
        return <Users className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Teams</h2>
          <p className="text-muted-foreground">
            Find teammates or browse existing teams looking for members
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Team
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search teams..."
            className="pl-10"
          />
        </div>
        <Select>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Teams</SelectItem>
            <SelectItem value="recruiting">Recruiting</SelectItem>
            <SelectItem value="full">Team Full</SelectItem>
          </SelectContent>
        </Select>
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
      </div>

      {/* Teams Grid */}
      <div className="grid gap-6">
        {mockTeams.map((team) => (
          <Card key={team.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <CardTitle className="text-xl">
                      <Link href={`/e/${event.slug}/teams/${team.id}`}>
                        <span className="hover:text-coral cursor-pointer">
                          {team.name}
                        </span>
                      </Link>
                    </CardTitle>
                    <Badge className={getStatusColor(team.status)}>
                      {getStatusIcon(team.status)}
                      <span className="ml-1 capitalize">{team.status}</span>
                    </Badge>
                    <Badge variant="outline">{team.track}</Badge>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    {team.description}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Team Members */}
              <div>
                <h4 className="text-sm font-medium text-foreground mb-2">
                  Team Members ({team.members.length}/{team.maxSize})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {team.members.map((member) => (
                    <div key={member.id} className="flex items-center gap-2 bg-muted rounded-full px-3 py-1">
                      <Avatar className="w-5 h-5">
                        <AvatarFallback className="text-xs">
                          {getInitials(member.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{member.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {member.role}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Looking For */}
              {team.lookingFor.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-2">Looking For</h4>
                  <div className="flex flex-wrap gap-2">
                    {team.lookingFor.map((role, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        <Plus className="w-3 h-3 mr-1" />
                        {role}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills */}
              <div>
                <h4 className="text-sm font-medium text-foreground mb-2">Team Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {team.skills.map((skill, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>Created {formatDate(team.created)}</span>
                </div>
                
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" asChild>
                    <Link href={`/e/${event.slug}/teams/${team.id}`}>
                      View Details
                    </Link>
                  </Button>
                  {team.status === 'recruiting' && (
                    <Button size="sm">
                      <UserPlus className="w-4 h-4 mr-1" />
                      Join Team
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {mockTeams.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Teams Yet</h3>
            <p className="text-muted-foreground mb-4">
              Be the first to create a team for this hackathon!
            </p>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create First Team
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}