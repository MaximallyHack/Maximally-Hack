import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, Filter, Grid, List, Calendar, Trophy, Users, MapPin,
  SlidersHorizontal, X, ArrowUpDown, ArrowRight
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import type { Event } from "@/lib/api";
import { Link } from "wouter";

interface Filters {
  status?: string;
  format?: string;
  tags: string[];
  prizeMin: number;
  sortBy: string;
}

export default function SimpleExplore() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [filters, setFilters] = useState<Filters>({
    tags: [],
    prizeMin: 0,
    sortBy: 'date',
  });

  const { data: events, isLoading } = useQuery({
    queryKey: ['events', searchQuery, filters],
    queryFn: () => api.searchEvents(searchQuery, filters),
  });

  const categories = [
    { id: 'all', label: 'All Events', count: events?.length || 0 },
    { id: 'active', label: 'Active', count: events?.filter(e => e.status === 'active').length || 0 },
    { id: 'upcoming', label: 'Upcoming', count: events?.filter(e => e.status === 'upcoming').length || 0 },
    { id: 'registration_open', label: 'Open', count: events?.filter(e => e.status === 'registration_open').length || 0 },
  ];

  const filteredEvents = useMemo(() => {
    if (!events) return [];
    
    let filtered = events;
    
    if (activeCategory !== 'all') {
      filtered = filtered.filter(event => event.status === activeCategory);
    }
    
    return filtered;
  }, [events, activeCategory]);

  const handleFilterChange = (key: keyof Filters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const addTag = (tag: string) => {
    if (!filters.tags.includes(tag)) {
      handleFilterChange('tags', [...filters.tags, tag]);
    }
  };

  const removeTag = (tag: string) => {
    handleFilterChange('tags', filters.tags.filter(t => t !== tag));
  };

  const clearFilters = () => {
    setFilters({
      tags: [],
      prizeMin: 0,
      sortBy: 'date',
    });
    setSearchQuery("");
    setActiveCategory("all");
  };

  const availableTags = ['AI', 'Healthcare', 'Education', 'Climate', 'Blockchain', 'Web3', 'Mobile', 'IoT'];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'upcoming': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'registration_open': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-background" data-testid="simple-explore-page">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-medium mb-3 text-[#e6e8ed] bg-[transparent]">Explore Hackathons</h1>
          <p className="text-muted-foreground">Discover amazing events and join the community</p>
        </div>

        {/* Search and Quick Filters */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                type="text"
                placeholder="Search hackathons..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 border-border focus:border-ring"
              />
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="h-12 border-border"
              >
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filters
                {(filters.tags.length > 0 || filters.prizeMin > 0) && (
                  <Badge className="ml-2 bg-foreground text-background rounded-full w-5 h-5 p-0 flex items-center justify-center text-xs">
                    {filters.tags.length + (filters.prizeMin > 0 ? 1 : 0)}
                  </Badge>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="h-12 border-border"
              >
                {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* Category Tabs */}
          <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
            <TabsList className="bg-muted p-1 rounded-lg w-full justify-start">
              {categories.map(category => (
                <TabsTrigger 
                  key={category.id} 
                  value={category.id}
                  className="rounded-md data-[state=active]:bg-background"
                >
                  {category.label}
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {category.count}
                  </Badge>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-6 p-6 bg-muted rounded-lg space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-foreground">Filters</h3>
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear all
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Format</label>
                  <Select value={filters.format} onValueChange={(value) => handleFilterChange('format', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="online">Online</SelectItem>
                      <SelectItem value="in-person">In-person</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Sort by</label>
                  <Select value={filters.sortBy} onValueChange={(value) => handleFilterChange('sortBy', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date">Date</SelectItem>
                      <SelectItem value="prize">Prize Pool</SelectItem>
                      <SelectItem value="participants">Participants</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Min Prize</label>
                  <Select value={filters.prizeMin.toString()} onValueChange={(value) => handleFilterChange('prizeMin', parseInt(value))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any amount" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Any amount</SelectItem>
                      <SelectItem value="1000">$1k+</SelectItem>
                      <SelectItem value="5000">$5k+</SelectItem>
                      <SelectItem value="10000">$10k+</SelectItem>
                      <SelectItem value="25000">$25k+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Tags</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {availableTags.map(tag => (
                    <Button
                      key={tag}
                      variant={filters.tags.includes(tag) ? "default" : "outline"}
                      size="sm"
                      onClick={() => filters.tags.includes(tag) ? removeTag(tag) : addTag(tag)}
                      className="rounded-full"
                    >
                      {tag}
                      {filters.tags.includes(tag) && (
                        <X className="w-3 h-3 ml-1" />
                      )}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Events Grid/List */}
        {isLoading ? (
          <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-64" />
            ))}
          </div>
        ) : filteredEvents.length > 0 ? (
          <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {filteredEvents.map(event => (
              <Link key={event.id} href={`/e/${event.slug}`}>
                <Card className="border border-border hover:border-ring transition-colors cursor-pointer">
                  <CardContent className={`p-6 ${viewMode === 'list' ? 'flex items-center gap-6' : ''}`}>
                    <div className={viewMode === 'list' ? 'flex-1' : ''}>
                      <div className="flex items-center justify-between mb-3">
                        <Badge className={`${getStatusColor(event.status)} rounded-full text-xs font-medium`}>
                          {event.status.replace('_', ' ')}
                        </Badge>
                        <div className="text-sm font-medium text-foreground">
                          ${(event.prizePool / 1000).toFixed(0)}k
                        </div>
                      </div>

                      <h3 className="font-medium text-foreground mb-2 line-clamp-1">{event.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{event.description}</p>

                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(event.startDate)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{event.participantCount.toLocaleString()}</span>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>

                    {viewMode === 'list' && (
                      <div className="text-right">
                        <div className="text-sm font-medium text-foreground mb-1">
                          {event.format}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {event.location}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-lg font-medium text-foreground mb-2">No hackathons found</h3>
            <p className="text-muted-foreground mb-6">Try adjusting your search or filters</p>
            <Button variant="outline" onClick={clearFilters}>
              Clear filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}