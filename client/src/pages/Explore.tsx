import { useState, useMemo, useCallback, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Search, Filter, Grid, List, X } from "lucide-react";
import EventCard from "@/components/event/EventCard";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import type { Event } from "@/lib/api";

interface Filters {
  status?: string;
  format?: string;
  tags: string[];
  prizeMin: number;
  sortBy: string;
}

export default function Explore() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState<Filters>({
    tags: [],
    prizeMin: 0,
    sortBy: 'date',
  });

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: events, isLoading, isFetching } = useQuery({
    queryKey: ['events', debouncedSearchQuery, filters],
    queryFn: () => api.searchEvents(debouncedSearchQuery, filters),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    refetchOnWindowFocus: false,
    keepPreviousData: true, // Keep previous results while loading new ones
  });

  const handleFilterChange = useCallback((key: keyof Filters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const addTag = useCallback((tag: string) => {
    if (!filters.tags.includes(tag)) {
      handleFilterChange('tags', [...filters.tags, tag]);
    }
  }, [filters.tags, handleFilterChange]);

  const removeTag = useCallback((tag: string) => {
    handleFilterChange('tags', filters.tags.filter(t => t !== tag));
  }, [filters.tags, handleFilterChange]);

  const clearFilters = useCallback(() => {
    setFilters({
      tags: [],
      prizeMin: 0,
      sortBy: 'date',
    });
    setSearchQuery("");
    setDebouncedSearchQuery("");
  }, []);

  const availableTags = useMemo(() => ['AI', 'Healthcare', 'Education', 'Climate', 'Blockchain', 'Web3', 'Mobile', 'IoT'], []);

  return (
    <div className="min-h-screen bg-background py-4 sm:py-8" data-testid="explore-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="animate-in fade-in slide-in-from-top-4 duration-700">
          <h1 className="font-heading font-bold text-2xl sm:text-4xl text-[#2a2d3a] dark:text-card-foreground mb-6 sm:mb-8">Explore Hackathons</h1>
        </div>
        
        {/* Search and Filters */}
        <div className="bg-card rounded-2xl p-4 sm:p-6 shadow-soft mb-6 sm:mb-8 border border-border transition-all duration-200">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 sm:w-5 sm:h-5" />
                <Input
                  type="text"
                  placeholder="Search hackathons..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-border rounded-xl focus:ring-2 focus:ring-sky focus:border-transparent transition-all duration-200"
                  data-testid="input-search"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            <Select value={filters.sortBy} onValueChange={(value) => handleFilterChange('sortBy', value)}>
              <SelectTrigger className="w-full sm:w-48 border-border rounded-xl h-10 sm:h-auto" data-testid="select-sort">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Sort by Date</SelectItem>
                <SelectItem value="popular">Sort by Popular</SelectItem>
                <SelectItem value="prize">Sort by Prize</SelectItem>
              </SelectContent>
            </Select>
            <Button className="bg-coral text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl hover:scale-[1.02] hover:bg-coral/90 transition-all duration-200" data-testid="button-filters">
              <Filter className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Filters</span>
            </Button>
          </div>
          
          {/* Active Filters */}
          {(filters.tags.length > 0 || filters.status || filters.format || filters.prizeMin > 0) && (
            <div className="flex flex-wrap gap-2 mb-4">
              {filters.tags.map(tag => (
                <Badge key={tag} className="bg-sky text-white px-3 py-1 rounded-full text-sm flex items-center">
                  {tag}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 ml-2 hover:bg-transparent"
                    onClick={() => removeTag(tag)}
                    data-testid={`remove-tag-${tag}`}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </Badge>
              ))}
              {filters.status && (
                <Badge className="bg-mint text-card-foreground px-3 py-1 rounded-full text-sm flex items-center">
                  {filters.status}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 ml-2 hover:bg-transparent"
                    onClick={() => handleFilterChange('status', undefined)}
                    data-testid="remove-status-filter"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </Badge>
              )}
              {filters.prizeMin > 0 && (
                <Badge className="bg-yellow text-card-foreground px-3 py-1 rounded-full text-sm flex items-center">
                  ${filters.prizeMin}k+ Prize
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 ml-2 hover:bg-transparent"
                    onClick={() => handleFilterChange('prizeMin', 0)}
                    data-testid="remove-prize-filter"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </Badge>
              )}
              <Button
                variant="ghost"
                onClick={clearFilters}
                className="text-muted-foreground hover:text-card-foreground"
                data-testid="button-clear-filters"
              >
                Clear All
              </Button>
            </div>
          )}
        </div>

        {/* Filter Sidebar and Results */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden mb-4">
            <Button 
              variant="outline" 
              className="w-full justify-start rounded-xl py-3"
              onClick={() => {/* TODO: Add mobile filter toggle */}}
            >
              <Filter className="w-4 h-4 mr-2" />
              Show Filters
            </Button>
          </div>
          
          {/* Filter Sidebar */}
          <div className="w-full lg:w-72 hidden lg:block">
            <div className="bg-card rounded-2xl p-6 shadow-soft sticky top-24 border border-border">
              <h3 className="font-heading font-semibold text-lg text-card-foreground mb-4">Filters</h3>
              
              {/* Time Filter */}
              <div className="mb-6">
                <h4 className="font-medium text-card-foreground mb-3">Time</h4>
                <div className="space-y-2">
                  {[
                    { value: 'upcoming', label: 'Upcoming' },
                    { value: 'active', label: 'Ongoing' },
                    { value: 'completed', label: 'Past' },
                  ].map(option => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`time-${option.value}`}
                        checked={filters.status === option.value}
                        onCheckedChange={(checked) => 
                          handleFilterChange('status', checked ? option.value : undefined)
                        }
                        data-testid={`checkbox-time-${option.value}`}
                      />
                      <label htmlFor={`time-${option.value}`} className="text-muted-foreground text-sm">
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Format Filter */}
              <div className="mb-6">
                <h4 className="font-medium text-card-foreground mb-3">Format</h4>
                <div className="space-y-2">
                  {[
                    { value: 'online', label: 'Online' },
                    { value: 'in-person', label: 'In-person' },
                    { value: 'hybrid', label: 'Hybrid' },
                  ].map(option => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`format-${option.value}`}
                        checked={filters.format === option.value}
                        onCheckedChange={(checked) => 
                          handleFilterChange('format', checked ? option.value : undefined)
                        }
                        data-testid={`checkbox-format-${option.value}`}
                      />
                      <label htmlFor={`format-${option.value}`} className="text-muted-foreground text-sm">
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div className="mb-6">
                <h4 className="font-medium text-card-foreground mb-3">Topics</h4>
                <div className="flex flex-wrap gap-2">
                  {availableTags.map(tag => (
                    <Badge
                      key={tag}
                      className={`cursor-pointer transition-colors ${
                        filters.tags.includes(tag)
                          ? 'bg-sky text-white'
                          : 'bg-soft-gray text-muted-foreground hover:bg-sky/20'
                      } px-2 py-1 rounded-full text-xs border-0`}
                      onClick={() => 
                        filters.tags.includes(tag) ? removeTag(tag) : addTag(tag)
                      }
                      data-testid={`tag-filter-${tag}`}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Prize Range */}
              <div className="mb-6">
                <h4 className="font-medium text-card-foreground mb-3">Minimum Prize</h4>
                <Slider
                  value={[filters.prizeMin]}
                  onValueChange={([value]) => handleFilterChange('prizeMin', value)}
                  max={100}
                  step={5}
                  className="w-full"
                  data-testid="slider-prize"
                />
                <div className="flex justify-between text-sm text-muted-foreground mt-2">
                  <span>$0</span>
                  <span>${filters.prizeMin}k</span>
                  <span>$100k+</span>
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <p className="text-muted-foreground" data-testid="results-count">
                  {isLoading ? 'Loading...' : `Showing ${events?.length || 0} hackathons`}
                </p>
                {isFetching && !isLoading && (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-coral border-t-transparent" />
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setViewMode('grid')}
                  className="p-2 border border-border rounded-lg transition-all duration-200 hover:scale-105"
                  data-testid="button-grid-view"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setViewMode('list')}
                  className="p-2 border border-border rounded-lg transition-all duration-200 hover:scale-105"
                  data-testid="button-list-view"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Events Grid/List */}
            {isLoading ? (
              <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'} gap-6`}>
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="bg-card rounded-2xl p-6 shadow-soft border border-border animate-pulse">
                    <div className="flex justify-between items-center mb-4">
                      <Skeleton className="h-6 w-24 rounded-full" />
                      <div className="flex gap-2">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <Skeleton className="h-8 w-8 rounded-full" />
                      </div>
                    </div>
                    <Skeleton className="h-7 w-4/5 mb-3 rounded-lg" />
                    <Skeleton className="h-4 w-full mb-2 rounded-md" />
                    <Skeleton className="h-4 w-3/4 mb-4 rounded-md" />
                    <div className="flex gap-2 mb-4">
                      <Skeleton className="h-6 w-16 rounded-full" />
                      <Skeleton className="h-6 w-20 rounded-full" />
                      <Skeleton className="h-6 w-14 rounded-full" />
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-4 rounded" />
                        <Skeleton className="h-4 w-20 rounded-md" />
                      </div>
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-4 rounded" />
                        <Skeleton className="h-4 w-16 rounded-md" />
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-border">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-4 rounded" />
                        <Skeleton className="h-4 w-24 rounded-md" />
                      </div>
                      <Skeleton className="h-9 w-20 rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : events && events.length > 0 ? (
              <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'} gap-4 sm:gap-6 transition-all duration-500 ease-out`}>
                {events.map((event: Event, index) => (
                  <div 
                    key={event.id} 
                    className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out transform hover:scale-[1.01] transition-transform"
                    style={{ 
                      animationDelay: `${Math.min(index * 75, 1000)}ms`,
                      animationFillMode: 'both'
                    }}
                  >
                    <EventCard event={event} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 sm:py-16 animate-in fade-in duration-500">
                <div className="text-4xl sm:text-6xl mb-4 animate-bounce">🔍</div>
                <h3 className="font-heading font-semibold text-lg sm:text-xl text-card-foreground mb-2">No hackathons found</h3>
                <p className="text-muted-foreground mb-6 text-sm sm:text-base max-w-md mx-auto">
                  {searchQuery || Object.values(filters).some(f => f && (Array.isArray(f) ? f.length > 0 : true))
                    ? "Try adjusting your search or filters"
                    : "Check back soon for new events!"
                  }
                </p>
                <Button 
                  onClick={clearFilters} 
                  className="bg-coral text-white hover:bg-coral/80 hover:scale-105 transition-all duration-200" 
                  data-testid="button-reset-search"
                >
                  Reset Search
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
