import { useEvent } from '@/contexts/EventContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Award, Gift, Star, Zap } from 'lucide-react';

const prizeCategories = [
  {
    id: 'grand-prize',
    title: 'Grand Prize',
    description: 'Best overall project across all tracks',
    prizes: [
      { place: '1st Place', amount: 10000, icon: Trophy, color: 'text-yellow-500' },
      { place: '2nd Place', amount: 5000, icon: Award, color: 'text-gray-400' },
      { place: '3rd Place', amount: 2500, icon: Gift, color: 'text-amber-600' }
    ]
  },
  {
    id: 'track-prizes',
    title: 'Track Prizes',
    description: 'Best project in each specialized track',
    prizes: [
      { place: 'AI & Machine Learning', amount: 3000, icon: Zap, color: 'text-purple-500' },
      { place: 'Climate & Sustainability', amount: 3000, icon: Zap, color: 'text-green-500' },
      { place: 'Healthcare & Wellness', amount: 3000, icon: Zap, color: 'text-red-500' },
      { place: 'Education & Learning', amount: 3000, icon: Zap, color: 'text-blue-500' }
    ]
  },
  {
    id: 'special-prizes',
    title: 'Special Awards',
    description: 'Recognition for outstanding achievements',
    prizes: [
      { place: 'Most Innovative', amount: 1000, icon: Star, color: 'text-pink-500' },
      { place: 'Best Design', amount: 1000, icon: Star, color: 'text-indigo-500' },
      { place: 'Best Use of Tech', amount: 1000, icon: Star, color: 'text-cyan-500' },
      { place: 'People\'s Choice', amount: 1000, icon: Star, color: 'text-orange-500' }
    ]
  }
];

export default function Prizes() {
  const { event } = useEvent();

  if (!event) return null;

  const formatPrize = (amount: number) => {
    return `$${amount.toLocaleString()}`;
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground mb-4">Prize Pool</h2>
        <div className="text-5xl font-bold text-coral mb-4">
          ${event.prizePool.toLocaleString()}
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          We're excited to reward the most innovative, impactful, and well-executed projects. 
          Multiple ways to win means more opportunities for your team to be recognized!
        </p>
      </div>

      <div className="grid gap-8">
        {prizeCategories.map((category) => (
          <section key={category.id}>
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-foreground mb-2">{category.title}</h3>
              <p className="text-muted-foreground">{category.description}</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {category.prizes.map((prize, index) => {
                const IconComponent = prize.icon;
                return (
                  <Card key={index} className={`relative overflow-hidden ${
                    category.id === 'grand-prize' && index === 0 
                      ? 'ring-2 ring-coral bg-gradient-to-br from-coral/5 to-yellow/5' 
                      : ''
                  }`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <IconComponent className={`w-6 h-6 ${prize.color}`} />
                        {category.id === 'grand-prize' && index === 0 && (
                          <Badge className="bg-coral text-white">Winner</Badge>
                        )}
                      </div>
                      <CardTitle className="text-lg">{prize.place}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-foreground mb-2">
                        {formatPrize(prize.amount)}
                      </div>
                      {category.id === 'grand-prize' && (
                        <p className="text-sm text-muted-foreground">
                          Plus mentorship and networking opportunities
                        </p>
                      )}
                      {category.id === 'track-prizes' && (
                        <p className="text-sm text-muted-foreground">
                          Awarded per track category
                        </p>
                      )}
                      {category.id === 'special-prizes' && (
                        <p className="text-sm text-muted-foreground">
                          Judge's discretion award
                        </p>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {/* Additional Information */}
      <Card className="bg-gradient-to-r from-sky/10 to-mint/10 border-sky/20">
        <CardContent className="p-6">
          <h3 className="text-xl font-bold text-foreground mb-4">Additional Prize Information</h3>
          <div className="grid md:grid-cols-2 gap-6 text-sm text-muted-foreground">
            <div>
              <h4 className="font-semibold text-foreground mb-2">Eligibility</h4>
              <ul className="space-y-1 list-disc list-inside">
                <li>Must be registered for the hackathon</li>
                <li>Team size limited to 1-4 members</li>
                <li>Project built during hackathon period</li>
                <li>Must submit by deadline</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">Prize Distribution</h4>
              <ul className="space-y-1 list-disc list-inside">
                <li>Prizes split equally among team members</li>
                <li>Winners announced at closing ceremony</li>
                <li>Payments processed within 30 days</li>
                <li>Tax forms may be required</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}