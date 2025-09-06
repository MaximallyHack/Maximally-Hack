import { useEvent } from '@/contexts/EventContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, Users, Clock, Code, Trophy, 
  AlertTriangle, CheckCircle, ExternalLink 
} from 'lucide-react';

const rulesSections = [
  {
    id: 'eligibility',
    title: 'Eligibility',
    icon: Users,
    color: 'text-blue-500',
    rules: [
      'Open to all developers, designers, and makers worldwide',
      'Participants must be 18+ or have guardian consent',
      'Teams can have 1-4 members maximum',
      'Individual participation is allowed',
      'Pre-existing teams are welcome'
    ]
  },
  {
    id: 'project-requirements',
    title: 'Project Requirements',
    icon: Code,
    color: 'text-green-500',
    rules: [
      'Projects must be built during the hackathon timeframe',
      'Use of pre-existing code libraries and frameworks is allowed',
      'Pre-built projects or significant prior work is not permitted',
      'All code must be original or properly attributed',
      'Open source projects are encouraged but not required'
    ]
  },
  {
    id: 'submission',
    title: 'Submission Guidelines',
    icon: Trophy,
    color: 'text-yellow-500',
    rules: [
      'Submit via Devpost by the deadline (no extensions)',
      'Include a working demo (video or live link)',
      'Provide clear documentation and setup instructions',
      'Source code must be accessible to judges',
      'List all team members and their contributions'
    ]
  },
  {
    id: 'conduct',
    title: 'Code of Conduct',
    icon: Shield,
    color: 'text-red-500',
    rules: [
      'Treat all participants, organizers, and sponsors with respect',
      'No harassment, discrimination, or inappropriate behavior',
      'Keep content family-friendly and professional',
      'Report any violations to organizers immediately',
      'Violation may result in disqualification'
    ]
  },
  {
    id: 'intellectual-property',
    title: 'Intellectual Property',
    icon: ExternalLink,
    color: 'text-purple-500',
    rules: [
      'Teams retain ownership of their projects',
      'Organizers may showcase projects for promotional purposes',
      'Third-party APIs and services subject to their terms',
      'Respect all copyright and licensing requirements',
      'Don\'t use proprietary code without permission'
    ]
  }
];

const importantNotes = [
  {
    type: 'warning',
    title: 'Submission Deadline',
    message: 'All submissions must be completed by December 15, 2024 at 3:00 PM PST. No exceptions or extensions will be granted.',
    icon: AlertTriangle
  },
  {
    type: 'info',
    title: 'Judging Criteria',
    message: 'Projects will be evaluated on innovation, technical implementation, design, and potential impact.',
    icon: CheckCircle
  },
  {
    type: 'info',
    title: 'Questions?',
    message: 'Join our Discord server or use the Help section if you need clarification on any rules.',
    icon: ExternalLink
  }
];

export default function Rules() {
  const { event } = useEvent();

  if (!event) return null;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-4">Rules & Guidelines</h2>
        <p className="text-muted-foreground">
          Please read through all rules carefully. Following these guidelines ensures a fair and enjoyable experience for everyone.
        </p>
      </div>

      {/* Important Alerts */}
      <div className="space-y-4">
        {importantNotes.map((note, index) => {
          const IconComponent = note.icon;
          return (
            <Alert key={index} className={
              note.type === 'warning' 
                ? 'border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950'
                : 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950'
            }>
              <IconComponent className={`h-4 w-4 ${
                note.type === 'warning' ? 'text-orange-600' : 'text-blue-600'
              }`} />
              <AlertDescription>
                <strong>{note.title}:</strong> {note.message}
              </AlertDescription>
            </Alert>
          );
        })}
      </div>

      {/* Rules Sections */}
      <div className="grid gap-6">
        {rulesSections.map((section) => {
          const IconComponent = section.icon;
          return (
            <Card key={section.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <IconComponent className={`w-5 h-5 ${section.color}`} />
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {section.rules.map((rule, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{rule}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Timeline and Deadlines */}
      <Card className="bg-gradient-to-r from-coral/10 to-yellow/10 border-coral/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-coral" />
            Important Deadlines
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-lg font-bold text-foreground mb-1">Registration</div>
              <div className="text-sm text-muted-foreground">Until event starts</div>
              <Badge className="mt-2 bg-success text-white">Open</Badge>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-foreground mb-1">Development</div>
              <div className="text-sm text-muted-foreground">48 hours total</div>
              <Badge className="mt-2 bg-yellow text-black">Active</Badge>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-foreground mb-1">Submission</div>
              <div className="text-sm text-muted-foreground">Dec 15, 3:00 PM PST</div>
              <Badge className="mt-2 bg-muted text-muted-foreground">Upcoming</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Need Help?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            If you have questions about the rules or need clarification, don't hesitate to reach out:
          </p>
          <div className="flex flex-wrap gap-3">
            <Badge variant="outline" className="cursor-pointer hover:bg-muted">
              💬 Discord #help-desk
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-muted">
              📧 help@hackathon.com
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-muted">
              🎯 Use the Help section
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}