import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Medal, Award, TrendingUp, TrendingDown, Minus, Star, Users, Calendar } from "lucide-react";
import { CrayonSquiggle } from "@/components/ui/floating-elements";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import type { User, Judge } from "@/lib/api";

type LeaderboardType = 'hackers' | 'organizers' | 'judges';

interface RankedUser extends User {
  rank: number;
  points: number;
  change: 'up' | 'down' | 'same';
}

interface RankedJudge extends Judge {
  rank: number;
  points: number;
  change: 'up' | 'down' | 'same';
}

export default function Leaderboards() {
  const [activeTab, setActiveTab] = useState<LeaderboardType>('hackers');
  const [season, setSeason] = useState('2024');

  const { data: leaderboardData, isLoading } = useQuery({
    queryKey: ['leaderboards', activeTab, season],
    queryFn: () => api.getLeaderboards(activeTab),
  });

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-yellow" />;
      default:
        return <span className="text-lg font-bold text-text-muted">#{rank}</span>;
    }
  };

  const getChangeIcon = (change: 'up' | 'down' | 'same') => {
    switch (change) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-success" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-error" />;
      default:
        return <Minus className="w-4 h-4 text-text-muted" />;
    }
  };

  const calculatePoints = (user: User): number => {
    return user.stats.wins * 100 + user.stats.finals * 50 + user.stats.hackathonsParticipated * 10;
  };

  const calculateJudgePoints = (judge: Judge): number => {
    return judge.eventsJudged * 20 + judge.rating * 10;
  };

  const processHackerData = (users: User[]): RankedUser[] => {
    return users.map((user, index) => ({
      ...user,
      rank: index + 1,
      points: calculatePoints(user),
      change: Math.random() > 0.5 ? 'up' : Math.random() > 0.5 ? 'down' : 'same'
    }));
  };

  const processJudgeData = (judges: Judge[]): RankedJudge[] => {
    return judges.map((judge, index) => ({
      ...judge,
      rank: index + 1,
      points: calculateJudgePoints(judge),
      change: Math.random() > 0.5 ? 'up' : Math.random() > 0.5 ? 'down' : 'same'
    }));
  };

  const rankedData = leaderboardData ? (
    activeTab === 'judges' 
      ? processJudgeData(leaderboardData as Judge[])
      : processHackerData(leaderboardData as User[])
  ) : [];

  return (
    <div className="min-h-screen bg-cream py-8" data-testid="leaderboards-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="font-heading font-bold text-4xl text-text-dark mb-4">Leaderboards</h1>
          <CrayonSquiggle className="mx-auto mb-6" />
          <p className="text-text-muted text-lg">Celebrating our most active community members</p>
        </div>

        {/* Season Selector */}
        <div className="flex justify-center mb-8">
          <Select value={season} onValueChange={setSeason}>
            <SelectTrigger className="w-48 border-soft-gray rounded-xl bg-white" data-testid="select-season">
              <SelectValue placeholder="Select Season" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">2024 Season</SelectItem>
              <SelectItem value="2023">2023 Season</SelectItem>
              <SelectItem value="all-time">All Time</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Leaderboard Tabs */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as LeaderboardType)} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white rounded-xl border border-soft-gray p-1 mb-8">
            <TabsTrigger value="hackers" className="rounded-lg" data-testid="tab-hackers">
              <Users className="w-4 h-4 mr-2" />
              Hackers
            </TabsTrigger>
            <TabsTrigger value="organizers" className="rounded-lg" data-testid="tab-organizers">
              <Calendar className="w-4 h-4 mr-2" />
              Organizers
            </TabsTrigger>
            <TabsTrigger value="judges" className="rounded-lg" data-testid="tab-judges">
              <Star className="w-4 h-4 mr-2" />
              Jury Board
            </TabsTrigger>
          </TabsList>

          {/* Top 3 Podium */}
          {!isLoading && rankedData.length >= 3 && (
            <div className="flex justify-center items-end gap-4 mb-12">
              {/* 2nd Place */}
              <div className="bg-white rounded-2xl p-6 shadow-soft border border-soft-gray text-center">
                <Avatar className="w-16 h-16 mx-auto mb-4">
                  <AvatarImage src={rankedData[1].avatar} alt={rankedData[1].name} />
                  <AvatarFallback className="bg-sky text-white">
                    {rankedData[1].name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <Medal className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <h3 className="font-heading font-semibold text-lg text-text-dark mb-1">{rankedData[1].name}</h3>
                <p className="text-text-muted text-sm mb-2">
                  {'company' in rankedData[1] ? rankedData[1].company : rankedData[1].location}
                </p>
                <div className="text-2xl font-bold text-sky">{rankedData[1].points}</div>
                <div className="text-xs text-text-muted">points</div>
              </div>

              {/* 1st Place */}
              <div className="bg-white rounded-2xl p-8 shadow-soft border border-coral text-center transform scale-110">
                <Avatar className="w-20 h-20 mx-auto mb-4">
                  <AvatarImage src={rankedData[0].avatar} alt={rankedData[0].name} />
                  <AvatarFallback className="bg-coral text-white text-xl">
                    {rankedData[0].name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <Trophy className="w-10 h-10 text-yellow mx-auto mb-2" />
                <h3 className="font-heading font-semibold text-xl text-text-dark mb-1">{rankedData[0].name}</h3>
                <p className="text-text-muted text-sm mb-2">
                  {'company' in rankedData[0] ? rankedData[0].company : rankedData[0].location}
                </p>
                <div className="text-3xl font-bold text-coral">{rankedData[0].points}</div>
                <div className="text-xs text-text-muted">points</div>
              </div>

              {/* 3rd Place */}
              <div className="bg-white rounded-2xl p-6 shadow-soft border border-soft-gray text-center">
                <Avatar className="w-16 h-16 mx-auto mb-4">
                  <AvatarImage src={rankedData[2].avatar} alt={rankedData[2].name} />
                  <AvatarFallback className="bg-mint text-text-dark">
                    {rankedData[2].name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <Award className="w-8 h-8 text-yellow mx-auto mb-2" />
                <h3 className="font-heading font-semibold text-lg text-text-dark mb-1">{rankedData[2].name}</h3>
                <p className="text-text-muted text-sm mb-2">
                  {'company' in rankedData[2] ? rankedData[2].company : rankedData[2].location}
                </p>
                <div className="text-2xl font-bold text-mint">{rankedData[2].points}</div>
                <div className="text-xs text-text-muted">points</div>
              </div>
            </div>
          )}

          {/* Hackers Tab */}
          <TabsContent value="hackers">
            {isLoading ? (
              <div className="bg-white rounded-2xl shadow-soft border border-soft-gray overflow-hidden">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 border-b border-soft-gray">
                    <Skeleton className="w-8 h-8" />
                    <Skeleton className="w-12 h-12 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-32 mb-2" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                    <Skeleton className="w-16 h-6" />
                    <Skeleton className="w-4 h-4" />
                  </div>
                ))}
              </div>
            ) : rankedData.length > 0 ? (
              <div className="bg-white rounded-2xl shadow-soft border border-soft-gray overflow-hidden">
                {rankedData.map((user, index) => (
                  <div 
                    key={user.id} 
                    className={`flex items-center gap-4 p-4 hover:bg-soft-gray/50 transition-colors ${
                      index < rankedData.length - 1 ? 'border-b border-soft-gray' : ''
                    }`}
                    data-testid={`leaderboard-row-${user.rank}`}
                  >
                    <div className="w-8 flex justify-center">
                      {getRankIcon(user.rank)}
                    </div>
                    
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="bg-sky text-white">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-text-dark">{user.name}</h3>
                      <p className="text-text-muted text-sm">{user.location}</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="font-bold text-lg text-coral">{user.points}</div>
                      <div className="text-xs text-text-muted">points</div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {getChangeIcon(user.change)}
                    </div>
                    
                    <div className="hidden md:flex gap-2">
                      {user.badges.slice(0, 2).map(badge => (
                        <Badge key={badge} className="bg-mint/20 text-mint px-2 py-1 rounded-full text-xs border-0">
                          {badge}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🏆</div>
                <h3 className="font-heading font-semibold text-xl text-text-dark mb-2">No hackers yet</h3>
                <p className="text-text-muted">The leaderboard will update as people participate in hackathons!</p>
              </div>
            )}
          </TabsContent>

          {/* Organizers Tab */}
          <TabsContent value="organizers">
            {isLoading ? (
              <div className="bg-white rounded-2xl shadow-soft border border-soft-gray overflow-hidden">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 border-b border-soft-gray">
                    <Skeleton className="w-8 h-8" />
                    <Skeleton className="w-12 h-12 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-32 mb-2" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                    <Skeleton className="w-16 h-6" />
                    <Skeleton className="w-4 h-4" />
                  </div>
                ))}
              </div>
            ) : rankedData.length > 0 ? (
              <div className="bg-white rounded-2xl shadow-soft border border-soft-gray overflow-hidden">
                {rankedData.map((organizer, index) => (
                  <div 
                    key={organizer.id} 
                    className={`flex items-center gap-4 p-4 hover:bg-soft-gray/50 transition-colors ${
                      index < rankedData.length - 1 ? 'border-b border-soft-gray' : ''
                    }`}
                    data-testid={`organizer-row-${organizer.rank}`}
                  >
                    <div className="w-8 flex justify-center">
                      {getRankIcon(organizer.rank)}
                    </div>
                    
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={organizer.avatar} alt={organizer.name} />
                      <AvatarFallback className="bg-mint text-text-dark">
                        {organizer.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-text-dark">{organizer.name}</h3>
                      <p className="text-text-muted text-sm">{organizer.location}</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="font-bold text-lg text-mint">{(organizer as any).stats?.organized || 0}</div>
                      <div className="text-xs text-text-muted">events</div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {getChangeIcon(organizer.change)}
                    </div>
                    
                    <div className="hidden md:flex gap-2">
                      {organizer.badges.slice(0, 2).map(badge => (
                        <Badge key={badge} className="bg-coral/20 text-coral px-2 py-1 rounded-full text-xs border-0">
                          {badge}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">📅</div>
                <h3 className="font-heading font-semibold text-xl text-text-dark mb-2">No organizers yet</h3>
                <p className="text-text-muted">The leaderboard will update as people organize events!</p>
              </div>
            )}
          </TabsContent>

          {/* Judges Tab */}
          <TabsContent value="judges">
            {isLoading ? (
              <div className="bg-white rounded-2xl shadow-soft border border-soft-gray overflow-hidden">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 border-b border-soft-gray">
                    <Skeleton className="w-8 h-8" />
                    <Skeleton className="w-12 h-12 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-32 mb-2" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                    <Skeleton className="w-16 h-6" />
                    <Skeleton className="w-4 h-4" />
                  </div>
                ))}
              </div>
            ) : rankedData.length > 0 ? (
              <div className="bg-white rounded-2xl shadow-soft border border-soft-gray overflow-hidden">
                {rankedData.map((judge, index) => {
                  const judgeData = judge as RankedJudge;
                  return (
                    <div 
                      key={judgeData.id} 
                      className={`flex items-center gap-4 p-4 hover:bg-soft-gray/50 transition-colors ${
                        index < rankedData.length - 1 ? 'border-b border-soft-gray' : ''
                      }`}
                      data-testid={`judge-row-${judgeData.rank}`}
                    >
                      <div className="w-8 flex justify-center">
                        {getRankIcon(judgeData.rank)}
                      </div>
                      
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={judgeData.avatar} alt={judgeData.name} />
                        <AvatarFallback className="bg-yellow text-text-dark">
                          {judgeData.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <h3 className="font-semibold text-text-dark">{judgeData.name}</h3>
                        <p className="text-text-muted text-sm">{judgeData.company}</p>
                      </div>
                      
                      <div className="text-center">
                        <div className="font-bold text-lg text-yellow">{judgeData.eventsJudged}</div>
                        <div className="text-xs text-text-muted">events</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow" fill="currentColor" />
                          <span className="font-medium">{judgeData.rating}</span>
                        </div>
                        <div className="text-xs text-text-muted">rating</div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {getChangeIcon(judgeData.change)}
                      </div>
                      
                      <div className="hidden md:flex gap-2">
                        {judgeData.badges.slice(0, 2).map(badge => (
                          <Badge key={badge} className="bg-sky/20 text-sky px-2 py-1 rounded-full text-xs border-0">
                            {badge}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">⭐</div>
                <h3 className="font-heading font-semibold text-xl text-text-dark mb-2">No judges yet</h3>
                <p className="text-text-muted">The leaderboard will update as judges participate in events!</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
