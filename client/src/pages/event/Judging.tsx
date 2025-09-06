import { useEvent } from '@/contexts/EventContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Star, Trophy, Target, Clock, Users, 
  Award, Lightbulb, Code, Palette, Zap 
} from 'lucide-react';

const judgingCriteria = [
  {
    id: 'innovation',
    title: 'Innovation & Creativity',
    description: 'How original and creative is the solution?',
    weight: 25,
    icon: Lightbulb,
    color: 'text-yellow-500'
  },
  {
    id: 'technical',
    title: 'Technical Implementation',
    description: 'Quality of code, architecture, and execution',
    weight: 25,
    icon: Code,
    color: 'text-blue-500'
  },
  {
    id: 'design',
    title: 'Design & User Experience',
    description: 'Visual appeal and ease of use',
    weight: 20,
    icon: Palette,
    color: 'text-purple-500'
  },
  {
    id: 'impact',
    title: 'Impact & Usefulness',
    description: 'Potential to solve real-world problems',
    weight: 20,
    icon: Target,
    color: 'text-green-500'
  },
  {
    id: 'presentation',
    title: 'Presentation & Demo',
    description: 'Clarity and effectiveness of the pitch',
    weight: 10,
    icon: Trophy,
    color: 'text-red-500'
  }
];

const judges = [
  {
    id: 'judge-1',
    name: 'Michael Chen',
    title: 'VP of Engineering',
    company: 'Stripe',
    avatar: '',
    expertise: ['Fintech', 'Distributed Systems', 'API Design', 'Scalability'],
    bio: 'Engineering leader focused on building robust financial infrastructure.'
  },
  {
    id: 'judge-2',
    name: 'Dr. Rebecca Liu',
    title: 'Director of AI Research',
    company: 'OpenAI',
    avatar: '',
    expertise: ['Artificial Intelligence', 'Machine Learning', 'Ethics', 'Research'],
    bio: 'AI researcher passionate about responsible AI development and deployment.'
  },
  {
    id: 'judge-3',
    name: 'Sarah Williams',
    title: 'Head of Product Design',
    company: 'Figma',
    avatar: '',
    expertise: ['Product Design', 'User Research', 'Design Systems', 'Accessibility'],
    bio: 'Design leader with expertise in creating inclusive digital experiences.'
  },
  {
    id: 'judge-4',
    name: 'Carlos Rodriguez',
    title: 'Founder & CTO',
    company: 'GreenTech Solutions',
    avatar: '',
    expertise: ['Climate Tech', 'Sustainability', 'IoT', 'Data Analytics'],
    bio: 'Climate tech entrepreneur building solutions for environmental challenges.'
  }
];

const judgingProcess = [
  {
    phase: 'Initial Review',
    description: 'Judges review all submissions and documentation',
    duration: '2 hours',
    status: 'upcoming'
  },
  {
    phase: 'Demo Sessions',
    description: 'Top 20 teams present live demos to judges',
    duration: '3 hours',
    status: 'upcoming'
  },
  {
    phase: 'Deliberation',
    description: 'Judges discuss and score all projects',
    duration: '1 hour',
    status: 'upcoming'
  },
  {
    phase: 'Final Selection',
    description: 'Winners selected across all categories',
    duration: '30 minutes',
    status: 'upcoming'
  }
];

export default function Judging() {
  const { event } = useEvent();

  if (!event) return null;

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-4">Judging Information</h2>
        <p className="text-muted-foreground">
          Learn about our judging criteria, process, and meet the expert judges who will evaluate your projects.
        </p>
      </div>

      {/* Judging Criteria */}
      <section>
        <h3 className="text-xl font-bold text-foreground mb-6">Judging Criteria</h3>
        <div className="grid gap-4">
          {judgingCriteria.map((criteria) => {
            const IconComponent = criteria.icon;
            return (
              <Card key={criteria.id} className="p-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <IconComponent className={`w-6 h-6 ${criteria.color}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-foreground">{criteria.title}</h4>
                      <Badge variant="outline">{criteria.weight}%</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{criteria.description}</p>
                    <Progress value={criteria.weight} className="h-2" />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Meet the Judges */}
      <section>
        <h3 className="text-xl font-bold text-foreground mb-6">Meet the Judges</h3>
        <div className="grid md:grid-cols-2 gap-6">
          {judges.map((judge) => (
            <Card key={judge.id}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={judge.avatar} alt={judge.name} />
                    <AvatarFallback className="text-lg font-medium">
                      {getInitials(judge.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="font-bold text-foreground mb-1">{judge.name}</h4>
                    <p className="text-sm font-medium text-coral mb-1">{judge.title}</p>
                    <p className="text-sm text-muted-foreground mb-3">{judge.company}</p>
                    <p className="text-sm text-muted-foreground mb-3">{judge.bio}</p>
                    <div className="flex flex-wrap gap-2">
                      {judge.expertise.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Judging Process */}
      <section>
        <h3 className="text-xl font-bold text-foreground mb-6">Judging Process</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {judgingProcess.map((phase, index) => (
            <Card key={index} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-full bg-sky/20 flex items-center justify-center text-sm font-bold text-sky">
                    {index + 1}
                  </div>
                  <Clock className="w-4 h-4 text-muted-foreground" />
                </div>
                <CardTitle className="text-lg">{phase.phase}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">{phase.description}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span>{phase.duration}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Tips for Success */}
      <Card className="bg-gradient-to-r from-mint/10 to-sky/10 border-mint/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Star className="w-5 h-5 text-coral" />
            Tips for a Successful Submission
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-foreground mb-3">Demo Preparation</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Keep your demo under 3 minutes</li>
                <li>• Focus on the problem you're solving</li>
                <li>• Show, don't just tell</li>
                <li>• Have a backup plan for technical issues</li>
                <li>• Practice your pitch beforehand</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-3">Documentation</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Clear project description and goals</li>
                <li>• Technical architecture overview</li>
                <li>• Setup and installation instructions</li>
                <li>• Screenshots and demo video</li>
                <li>• Future roadmap and potential impact</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}