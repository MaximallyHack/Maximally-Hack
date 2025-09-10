import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabaseApi } from '@/lib/supabaseApi';
import { 
  Search, MapPin, Users, UserPlus, UserCheck, MessageSquare,
  Filter, SortDesc, Github, Linkedin, Globe
} from 'lucide-react';
import { debounce } from 'lodash';

type UserSearchResult = {
  id: string;
  username: string;
  full_name?: string;
  avatar_url?: string;
  headline?: string;
  location?: string;
  skills?: string[];
  bio?: string;
  github?: string;
  linkedin?: string;
  socials?: {
    twitter?: string;
    website?: string;
    [key: string]: string | undefined;
  };
  connection_status?: {
    isConnected: boolean;
    hasPendingRequest: boolean;
    isRequestSent: boolean;
  };
  projects_count?: number;
  certificates_count?: number;
  connections_count?: number;
};

export default function SearchUsers() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
  const [suggestedUsers, setSuggestedUsers] = useState<UserSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('search');
  const [filters, setFilters] = useState({
    location: '',
    skills: '',
    sortBy: 'relevance'
  });

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (query: string, filterOptions: any) => {
      if (!query.trim()) {
        setSearchResults([]);
        return;
      }

      setLoading(true);
      try {
        const results = await supabaseApi.searchUsers(query, filterOptions);
        setSearchResults(results);
      } catch (error) {
        console.error('Error searching users:', error);
      } finally {
        setLoading(false);
      }
    }, 300),
    []
  );

  // Search effect
  useEffect(() => {
    debouncedSearch(searchQuery, filters);
  }, [searchQuery, filters, debouncedSearch]);

  // Load suggested users on mount
  useEffect(() => {
    const loadSuggestedUsers = async () => {
      if (!user) return;
      try {
        const suggested = await supabaseApi.getSuggestedUsers();
        setSuggestedUsers(suggested);
      } catch (error) {
        console.error('Error loading suggested users:', error);
      }
    };

    loadSuggestedUsers();
  }, [user]);

  const handleConnect = async (targetUserId: string) => {
    if (!user) return;
    try {
      await supabaseApi.sendConnectionRequest(targetUserId);
      
      // Update the user's connection status in both search results and suggestions
      const updateStatus = (users: UserSearchResult[]) =>
        users.map(u => 
          u.id === targetUserId
            ? { ...u, connection_status: { ...u.connection_status, isRequestSent: true } }
            : u
        );
      
      setSearchResults(updateStatus);
      setSuggestedUsers(updateStatus);
    } catch (error) {
      console.error('Error sending connection request:', error);
    }
  };

  const handleAcceptConnection = async (targetUserId: string) => {
    if (!user) return;
    try {
      await supabaseApi.acceptConnectionRequest(targetUserId);
      
      // Update connection status
      const updateStatus = (users: UserSearchResult[]) =>
        users.map(u => 
          u.id === targetUserId
            ? { 
                ...u, 
                connection_status: { isConnected: true, hasPendingRequest: false, isRequestSent: false },
                connections_count: (u.connections_count || 0) + 1
              }
            : u
        );
      
      setSearchResults(updateStatus);
      setSuggestedUsers(updateStatus);
    } catch (error) {
      console.error('Error accepting connection:', error);
    }
  };

  const renderUserCard = (user: UserSearchResult) => (
    <Card key={user.id} className="hover:shadow-lg transition-shadow cursor-pointer">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={user.avatar_url || undefined} alt={user.full_name} />
            <AvatarFallback className="text-lg">
              {user.full_name?.[0]?.toUpperCase() ||
                user.username?.[0]?.toUpperCase() ||
                'U'}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex justify-between items-start mb-2">
              <div className="cursor-pointer" onClick={() => setLocation(`/profile/${user.username}`)}>
                <h3 className="font-semibold text-lg hover:text-blue-600">
                  {user.full_name || user.username}
                </h3>
                <p className="text-gray-600">@{user.username}</p>
                {user.headline && (
                  <p className="text-sm text-gray-700 font-medium">{user.headline}</p>
                )}
              </div>
              
              <div className="flex gap-2">
                {user.connection_status?.isConnected ? (
                  <Button variant="outline" size="sm" disabled>
                    <UserCheck className="w-4 h-4 mr-1" />
                    Connected
                  </Button>
                ) : user.connection_status?.hasPendingRequest ? (
                  <Button onClick={() => handleAcceptConnection(user.id)} size="sm">
                    <UserPlus className="w-4 h-4 mr-1" />
                    Accept
                  </Button>
                ) : user.connection_status?.isRequestSent ? (
                  <Button variant="outline" size="sm" disabled>
                    Request Sent
                  </Button>
                ) : (
                  <Button onClick={() => handleConnect(user.id)} size="sm">
                    <UserPlus className="w-4 h-4 mr-1" />
                    Connect
                  </Button>
                )}
                
                <Button variant="outline" size="sm">
                  <MessageSquare className="w-4 h-4 mr-1" />
                  Message
                </Button>
              </div>
            </div>
            
            {user.location && (
              <div className="flex items-center gap-1 text-gray-600 text-sm mb-2">
                <MapPin className="w-4 h-4" />
                {user.location}
              </div>
            )}
            
            {user.bio && (
              <p className="text-gray-700 text-sm mb-3 line-clamp-2">{user.bio}</p>
            )}
            
            {user.skills && user.skills.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {user.skills.slice(0, 5).map((skill, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
                {user.skills.length > 5 && (
                  <Badge variant="outline" className="text-xs">
                    +{user.skills.length - 5} more
                  </Badge>
                )}
              </div>
            )}
            
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex gap-4">
                <span>{user.connections_count || 0} connections</span>
                {user.projects_count !== undefined && (
                  <span>{user.projects_count} projects</span>
                )}
                {user.certificates_count !== undefined && (
                  <span>{user.certificates_count} certificates</span>
                )}
              </div>
              
              <div className="flex gap-2">
                {user.github && (
                  <a href={user.github} target="_blank" rel="noopener noreferrer" 
                     className="text-gray-600 hover:text-gray-900">
                    <Github className="w-4 h-4" />
                  </a>
                )}
                {user.linkedin && (
                  <a href={user.linkedin} target="_blank" rel="noopener noreferrer"
                     className="text-gray-600 hover:text-gray-900">
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
                {user.socials?.website && (
                  <a href={user.socials.website} target="_blank" rel="noopener noreferrer"
                     className="text-gray-600 hover:text-gray-900">
                    <Globe className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Discover People</h1>
          <p className="text-gray-600">Connect with participants, judges, and organizers</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList>
            <TabsTrigger value="search">Search Users</TabsTrigger>
            <TabsTrigger value="suggested">Suggested for You</TabsTrigger>
          </TabsList>

          <TabsContent value="search" className="space-y-6">
            {/* Search and Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Search Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search by name, username, skills, or bio..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                      placeholder="Location..."
                      value={filters.location}
                      onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                    />
                    <Input
                      placeholder="Skills..."
                      value={filters.skills}
                      onChange={(e) => setFilters({ ...filters, skills: e.target.value })}
                    />
                    <Select
                      value={filters.sortBy}
                      onValueChange={(value) => setFilters({ ...filters, sortBy: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sort by..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="relevance">Relevance</SelectItem>
                        <SelectItem value="connections">Most Connected</SelectItem>
                        <SelectItem value="recent">Recently Joined</SelectItem>
                        <SelectItem value="alphabetical">Alphabetical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Search Results */}
            <div>
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Searching...</p>
                </div>
              ) : searchQuery && searchResults.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No users found for "{searchQuery}"</p>
                  <p className="text-sm text-gray-500 mt-1">Try adjusting your search terms or filters</p>
                </div>
              ) : (
                <div className="grid gap-6">
                  {searchResults.map(renderUserCard)}
                </div>
              )}
              
              {!searchQuery && (
                <div className="text-center py-12">
                  <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Start typing to search for users</p>
                  <p className="text-sm text-gray-500 mt-1">Search by name, username, skills, or bio</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="suggested" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Suggested for You
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  People you might want to connect with based on your profile and interests
                </p>
              </CardContent>
            </Card>

            <div>
              {suggestedUsers.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No suggestions available yet</p>
                  <p className="text-sm text-gray-500 mt-1">Complete your profile to get better suggestions</p>
                </div>
              ) : (
                <div className="grid gap-6">
                  {suggestedUsers.map(renderUserCard)}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
