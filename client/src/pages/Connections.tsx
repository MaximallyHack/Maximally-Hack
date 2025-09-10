import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { supabaseApi } from '@/lib/supabaseApi';
import { 
  Users, UserCheck, UserPlus, UserX, MessageSquare, Search,
  Clock, CheckCircle, XCircle, Send, MapPin, Calendar
} from 'lucide-react';

type Connection = {
  id: string;
  user_id_a: string;
  user_id_b: string;
  connected_at: string;
  user: {
    id: string;
    username: string;
    full_name?: string;
    avatar_url?: string;
    headline?: string;
    location?: string;
    skills?: string[];
    bio?: string;
  };
  mutual_connections?: number;
};

type ConnectionRequest = {
  id: string;
  requester_id: string;
  recipient_id: string;
  message?: string;
  status: 'pending' | 'accepted' | 'declined' | 'blocked' | 'cancelled';
  created_at: string;
  responded_at?: string;
  requester?: {
    id: string;
    username: string;
    full_name?: string;
    avatar_url?: string;
    headline?: string;
    location?: string;
    skills?: string[];
    bio?: string;
  };
  recipient?: {
    id: string;
    username: string;
    full_name?: string;
    avatar_url?: string;
    headline?: string;
    location?: string;
    skills?: string[];
    bio?: string;
  };
};

export default function Connections() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [connections, setConnections] = useState<Connection[]>([]);
  const [pendingRequests, setPendingRequests] = useState<ConnectionRequest[]>([]);
  const [sentRequests, setSentRequests] = useState<ConnectionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('connections');

  // Fetch all connection data
  useEffect(() => {
    const fetchConnectionData = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        const [connectionsData, pendingData, sentData] = await Promise.all([
          supabaseApi.getUserConnections(),
          supabaseApi.getPendingConnectionRequests(),
          supabaseApi.getSentConnectionRequests()
        ]);
        
        setConnections(connectionsData);
        setPendingRequests(pendingData);
        setSentRequests(sentData);
      } catch (error) {
        console.error('Error fetching connection data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConnectionData();
  }, [user]);

  const handleAcceptRequest = async (requestId: string) => {
    try {
      await supabaseApi.acceptConnectionRequest(requestId);
      
      // Move request from pending to connections
      const request = pendingRequests.find(r => r.id === requestId);
      if (request?.requester) {
        const newConnection: Connection = {
          id: requestId,
          user_id_a: request.requester_id,
          user_id_b: user!.id,
          connected_at: new Date().toISOString(),
          user: request.requester,
          mutual_connections: 0
        };
        setConnections([newConnection, ...connections]);
      }
      
      setPendingRequests(pendingRequests.filter(r => r.id !== requestId));
    } catch (error) {
      console.error('Error accepting connection request:', error);
    }
  };

  const handleDeclineRequest = async (requestId: string) => {
    try {
      await supabaseApi.declineConnectionRequest(requestId);
      setPendingRequests(pendingRequests.filter(r => r.id !== requestId));
    } catch (error) {
      console.error('Error declining connection request:', error);
    }
  };

  const handleCancelRequest = async (requestId: string) => {
    try {
      await supabaseApi.cancelConnectionRequest(requestId);
      setSentRequests(sentRequests.filter(r => r.id !== requestId));
    } catch (error) {
      console.error('Error canceling connection request:', error);
    }
  };

  const handleRemoveConnection = async (connectionId: string, userId: string) => {
    try {
      await supabaseApi.removeConnection(userId);
      setConnections(connections.filter(c => c.id !== connectionId));
    } catch (error) {
      console.error('Error removing connection:', error);
    }
  };

  // Filter connections based on search
  const filteredConnections = connections.filter(connection =>
    !searchQuery || 
    connection.user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    connection.user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    connection.user.headline?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    connection.user.skills?.some(skill => 
      skill.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const renderConnectionCard = (connection: Connection) => (
    <Card key={connection.id} className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <Avatar className="w-12 h-12">
            <AvatarImage src={connection.user.avatar_url || undefined} alt={connection.user.full_name} />
            <AvatarFallback>
              {connection.user.full_name?.[0]?.toUpperCase() ||
                connection.user.username?.[0]?.toUpperCase() ||
                'U'}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex justify-between items-start mb-2">
              <div className="cursor-pointer" onClick={() => setLocation(`/profile/${connection.user.username}`)}>
                <h3 className="font-semibold hover:text-blue-600">
                  {connection.user.full_name || connection.user.username}
                </h3>
                <p className="text-sm text-gray-600">@{connection.user.username}</p>
                {connection.user.headline && (
                  <p className="text-xs text-gray-700 font-medium">{connection.user.headline}</p>
                )}
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <MessageSquare className="w-4 h-4 mr-1" />
                  Message
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                      <UserX className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Remove Connection</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <p>Are you sure you want to remove {connection.user.full_name || connection.user.username} from your connections?</p>
                      <div className="flex gap-2">
                        <Button 
                          variant="destructive" 
                          onClick={() => handleRemoveConnection(connection.id, connection.user.id)}
                          className="flex-1"
                        >
                          Remove
                        </Button>
                        <Button variant="outline" className="flex-1">
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-4">
                {connection.user.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {connection.user.location}
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Connected {new Date(connection.connected_at).toLocaleDateString()}
                </div>
              </div>
              
              {connection.mutual_connections && connection.mutual_connections > 0 && (
                <span>{connection.mutual_connections} mutual connections</span>
              )}
            </div>
            
            {connection.user.skills && connection.user.skills.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {connection.user.skills.slice(0, 3).map((skill, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
                {connection.user.skills.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{connection.user.skills.length - 3} more
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderRequestCard = (request: ConnectionRequest, type: 'received' | 'sent') => {
    const otherUser = type === 'received' ? request.requester : request.recipient;
    if (!otherUser) return null;

    return (
      <Card key={request.id} className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <Avatar className="w-12 h-12">
              <AvatarImage src={otherUser.avatar_url || undefined} alt={otherUser.full_name} />
              <AvatarFallback>
                {otherUser.full_name?.[0]?.toUpperCase() ||
                  otherUser.username?.[0]?.toUpperCase() ||
                  'U'}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex justify-between items-start mb-2">
                <div className="cursor-pointer" onClick={() => setLocation(`/profile/${otherUser.username}`)}>
                  <h3 className="font-semibold hover:text-blue-600">
                    {otherUser.full_name || otherUser.username}
                  </h3>
                  <p className="text-sm text-gray-600">@{otherUser.username}</p>
                  {otherUser.headline && (
                    <p className="text-xs text-gray-700 font-medium">{otherUser.headline}</p>
                  )}
                </div>
                
                <div className="flex gap-2">
                  {type === 'received' ? (
                    <>
                      <Button 
                        onClick={() => handleAcceptRequest(request.id)}
                        size="sm"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Accept
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => handleDeclineRequest(request.id)}
                        size="sm"
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Decline
                      </Button>
                    </>
                  ) : (
                    <Button 
                      variant="outline"
                      onClick={() => handleCancelRequest(request.id)}
                      size="sm"
                      className="text-red-600"
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
              
              {request.message && (
                <div className="bg-gray-50 rounded-md p-2 mb-2">
                  <p className="text-sm text-gray-700">"{request.message}"</p>
                </div>
              )}
              
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {type === 'received' ? 'Received' : 'Sent'} {new Date(request.created_at).toLocaleDateString()}
                </div>
                {otherUser.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {otherUser.location}
                  </div>
                )}
              </div>
              
              {otherUser.skills && otherUser.skills.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {otherUser.skills.slice(0, 3).map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {otherUser.skills.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{otherUser.skills.length - 3} more
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading connections...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Connections</h1>
          <p className="text-gray-600">Manage your professional network</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="connections">
              Connections ({connections.length})
            </TabsTrigger>
            <TabsTrigger value="pending">
              Pending Requests ({pendingRequests.length})
            </TabsTrigger>
            <TabsTrigger value="sent">
              Sent Requests ({sentRequests.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="connections" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Your Connections
                  </CardTitle>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search connections..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {filteredConnections.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">
                      {searchQuery ? 'No connections found matching your search' : 'No connections yet'}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {searchQuery ? 'Try adjusting your search terms' : 'Start connecting with other users to build your network'}
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {filteredConnections.map(renderConnectionCard)}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pending" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Pending Connection Requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                {pendingRequests.length === 0 ? (
                  <div className="text-center py-12">
                    <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No pending requests</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Connection requests from other users will appear here
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {pendingRequests.map(request => renderRequestCard(request, 'received'))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sent" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="w-5 h-5" />
                  Sent Connection Requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                {sentRequests.length === 0 ? (
                  <div className="text-center py-12">
                    <Send className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No sent requests</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Connection requests you've sent to other users will appear here
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {sentRequests.map(request => renderRequestCard(request, 'sent'))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
