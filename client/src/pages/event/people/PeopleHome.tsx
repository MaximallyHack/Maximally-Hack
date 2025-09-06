import { useEvent } from '@/contexts/EventContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link, useParams } from 'wouter';
import { 
  Users, UserCheck, MessageCircle, 
  Calendar, Star, Award 
} from 'lucide-react';

export default function PeopleHome() {
  const { event } = useEvent();
  const { slug } = useParams();

  if (!event) return null;

  const peopleCategories = [
    {
      id: 'judges',
      title: 'Judges',
      description: 'Meet the expert judges who will evaluate your projects',
      count: 8,
      icon: Award,
      color: 'text-coral',
      bgColor: 'bg-coral/10',
      href: `/e/${slug}/people/judges`
    },
    {
      id: 'mentors',
      title: 'Mentors',
      description: 'Get guidance from industry experts and experienced developers',
      count: 12,
      icon: UserCheck,
      color: 'text-sky',
      bgColor: 'bg-sky/10',
      href: `/e/${slug}/people/mentors`
    },
    {
      id: 'participants',
      title: 'Participants',
      description: 'Connect with fellow hackers and potential teammates',
      count: 234,
      icon: Users,
      color: 'text-mint',
      bgColor: 'bg-mint/10',
      href: `/e/${slug}/people/participants`
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground mb-4">People</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Connect with judges, mentors, and fellow participants. Build your network and get the support you need to succeed.
        </p>
      </div>

      {/* People Categories */}
      <div className="grid md:grid-cols-3 gap-6">
        {peopleCategories.map((category) => {
          const IconComponent = category.icon;
          return (
            <Link key={category.id} href={category.href}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <div>
                  <CardHeader className="text-center pb-4">
                    <div className={`w-16 h-16 rounded-full ${category.bgColor} flex items-center justify-center mx-auto mb-4`}>
                      <IconComponent className={`w-8 h-8 ${category.color}`} />
                    </div>
                    <CardTitle className="text-xl">{category.title}</CardTitle>
                    <div className="text-3xl font-bold text-foreground">
                      {category.count}
                    </div>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-sm text-muted-foreground mb-4">
                      {category.description}
                    </p>
                    <Button variant="outline" className="w-full">
                      Browse {category.title}
                    </Button>
                  </CardContent>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <section>
        <h3 className="text-xl font-bold text-foreground mb-6">Quick Actions</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-sky" />
                Book a Mentor Session
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Schedule 1-on-1 time with industry experts to get guidance on your project.
              </p>
              <Button variant="outline" className="w-full" asChild>
                <Link href={`/e/${slug}/people/mentors`}>
                  View Available Mentors
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <MessageCircle className="w-5 h-5 text-coral" />
                Join the Community
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Connect with other participants in our Discord community for real-time collaboration.
              </p>
              <Button variant="outline" className="w-full">
                Join Discord
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Featured People */}
      <section>
        <h3 className="text-xl font-bold text-foreground mb-6">Featured This Week</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-gradient-to-br from-coral to-yellow rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white font-bold text-lg">SL</span>
              </div>
              <h4 className="font-semibold text-foreground mb-1">Sarah Liu</h4>
              <p className="text-sm text-coral mb-2">Head Judge</p>
              <p className="text-xs text-muted-foreground mb-3">
                AI researcher at OpenAI with 10+ years experience
              </p>
              <div className="flex items-center justify-center gap-1 mb-3">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="text-sm">4.9 rating</span>
              </div>
              <Button size="sm" variant="outline" asChild>
                <Link href={`/e/${slug}/people/judges/sarah-liu`}>
                  View Profile
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-gradient-to-br from-sky to-mint rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white font-bold text-lg">MC</span>
              </div>
              <h4 className="font-semibold text-foreground mb-1">Michael Chen</h4>
              <p className="text-sm text-sky mb-2">Top Mentor</p>
              <p className="text-xs text-muted-foreground mb-3">
                Senior engineer at Google, mentored 50+ teams
              </p>
              <div className="flex items-center justify-center gap-1 mb-3">
                <Users className="w-4 h-4 text-sky" />
                <span className="text-sm">47 sessions</span>
              </div>
              <Button size="sm" variant="outline" asChild>
                <Link href={`/e/${slug}/people/mentors/michael-chen`}>
                  Book Session
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-gradient-to-br from-mint to-yellow rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white font-bold text-lg">AK</span>
              </div>
              <h4 className="font-semibold text-foreground mb-1">Alex Kim</h4>
              <p className="text-sm text-mint mb-2">Top Participant</p>
              <p className="text-xs text-muted-foreground mb-3">
                Full-stack developer leading "EduTech Revolution"
              </p>
              <div className="flex items-center justify-center gap-1 mb-3">
                <Trophy className="w-4 h-4 text-yellow-500" />
                <span className="text-sm">Team leader</span>
              </div>
              <Button size="sm" variant="outline">
                Connect
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

function Trophy({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
  );
}