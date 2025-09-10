import { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import {
  ArrowLeft,
  Mail,
  Send,
  Inbox,
  Archive,
  Star,
  Trash2,
  Edit,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Reply,
  Forward,
  Clock,
  AlertCircle,
  CheckCircle,
  Users,
  User,
  Paperclip,
  X,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabaseApi } from '@/lib/supabaseApi';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface TeamMail {
  id: string;
  teamId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  recipientIds: string[];
  subject: string;
  body: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  mailType: 'team' | 'announcement' | 'meeting' | 'update' | 'alert';
  attachments: string[];
  isRead: boolean;
  isStarred: boolean;
  isArchived: boolean;
  important: boolean;
  sentAt: string;
  readAt?: string;
}

interface MailDraft {
  id?: string;
  subject: string;
  body: string;
  recipientIds: string[];
  mailType: 'team' | 'announcement' | 'meeting' | 'update' | 'alert';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  attachments: string[];
}

export default function TeamMails() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('inbox');
  const [selectedMails, setSelectedMails] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [showCompose, setShowCompose] = useState(false);
  const [selectedMail, setSelectedMail] = useState<TeamMail | null>(null);
  const [showReply, setShowReply] = useState(false);

  // Mail composition state
  const [draft, setDraft] = useState<MailDraft>({
    subject: '',
    body: '',
    recipientIds: [],
    mailType: 'team',
    priority: 'normal',
    attachments: []
  });

  // Get team data
  const { data: team, isLoading: teamLoading } = useQuery({
    queryKey: ['team', id],
    queryFn: async () => {
      if (!id) return null;
      return await supabaseApi.getTeam(id);
    },
    enabled: !!id
  });

  // Get team mails
  const { data: mails = [], isLoading: mailsLoading, refetch: refetchMails } = useQuery({
    queryKey: ['teamMails', id],
    queryFn: async () => {
      if (!id) return [];
      return await supabaseApi.getTeamMails(id);
    },
    enabled: !!id && !!team
  });

  // Get mail drafts
  const { data: drafts = [] } = useQuery({
    queryKey: ['teamMailDrafts', id],
    queryFn: async () => {
      if (!id) return [];
      return await supabaseApi.getTeamMailDrafts(id);
    },
    enabled: !!id && !!team
  });

  // Send mail mutation
  const sendMailMutation = useMutation({
    mutationFn: async (mailData: MailDraft) => {
      if (!id) throw new Error('Team ID required');
      return await supabaseApi.sendTeamMail(id, mailData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teamMails', id] });
      setShowCompose(false);
      resetDraft();
      toast({
        title: "Mail Sent",
        description: "Your message has been sent successfully."
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send mail.",
        variant: "destructive"
      });
    }
  });

  // Mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: async (mailIds: string[]) => {
      return await supabaseApi.markTeamMailsAsRead(mailIds);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teamMails', id] });
      toast({
        title: "Success",
        description: "Mail(s) marked as read."
      });
    }
  });

  const resetDraft = () => {
    setDraft({
      subject: '',
      body: '',
      recipientIds: [],
      mailType: 'team',
      priority: 'normal',
      attachments: []
    });
  };

  const handleSendMail = () => {
    if (!draft.subject.trim() || !draft.body.trim() || draft.recipientIds.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in subject, message, and select recipients.",
        variant: "destructive"
      });
      return;
    }
    sendMailMutation.mutate(draft);
  };

  const handleSelectAllTeam = () => {
    const allMemberIds = team?.members?.map((member: any) => member.id) || [];
    setDraft(prev => ({ ...prev, recipientIds: allMemberIds }));
  };

  const handleRecipientToggle = (memberId: string, checked: boolean) => {
    setDraft(prev => ({
      ...prev,
      recipientIds: checked 
        ? [...prev.recipientIds, memberId]
        : prev.recipientIds.filter(id => id !== memberId)
    }));
  };

  const filteredMails = mails.filter((mail: TeamMail) => {
    const matchesSearch = searchQuery === '' || 
      mail.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mail.body.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mail.senderName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterType === 'all' || mail.mailType === filterType;
    
    const matchesTab = activeTab === 'inbox' && !mail.isArchived ||
                     activeTab === 'sent' && mail.senderId === user?.id ||
                     activeTab === 'archived' && mail.isArchived ||
                     activeTab === 'starred' && mail.isStarred;
    
    return matchesSearch && matchesFilter && matchesTab;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600';
      case 'high': return 'text-orange-600';
      case 'low': return 'text-blue-600';
      default: return 'text-muted-foreground';
    }
  };

  const getMailTypeIcon = (type: string) => {
    switch (type) {
      case 'announcement': return <MessageSquare className="w-4 h-4 text-coral" />;
      case 'meeting': return <Clock className="w-4 h-4 text-sky" />;
      case 'alert': return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'update': return <CheckCircle className="w-4 h-4 text-mint" />;
      default: return <Mail className="w-4 h-4 text-muted-foreground" />;
    }
  };

  if (teamLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-muted rounded w-64"></div>
          <div className="h-32 bg-muted rounded"></div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="h-96 bg-muted rounded"></div>
            <div className="lg:col-span-3 h-96 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="p-12 text-center">
          <Mail className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Team not found</h3>
          <p className="text-muted-foreground mb-4">The team you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/teams')} className="bg-coral hover:bg-coral/90">
            Back to Teams
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(`/teams/${id}`)} className="text-coral hover:text-coral/80">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Team
          </Button>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
              <Mail className="w-8 h-8 inline mr-3 text-sky" />
              Team Mails
            </h1>
            <p className="text-muted-foreground">Internal communication for {team.name}</p>
          </div>
          <div className="flex gap-2">
            <Dialog open={showCompose} onOpenChange={setShowCompose}>
              <DialogTrigger asChild>
                <Button className="bg-coral hover:bg-coral/90">
                  <Edit className="w-4 h-4 mr-2" />
                  Compose Mail
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Compose New Mail</DialogTitle>
                  <DialogDescription>Send a message to your team members</DialogDescription>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Mail Type</Label>
                      <Select value={draft.mailType} onValueChange={(value: any) => setDraft(prev => ({ ...prev, mailType: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="team">Team Message</SelectItem>
                          <SelectItem value="announcement">Announcement</SelectItem>
                          <SelectItem value="meeting">Meeting</SelectItem>
                          <SelectItem value="update">Update</SelectItem>
                          <SelectItem value="alert">Alert</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Priority</Label>
                      <Select value={draft.priority} onValueChange={(value: any) => setDraft(prev => ({ ...prev, priority: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Subject</Label>
                    <Input
                      placeholder="Enter subject..."
                      value={draft.subject}
                      onChange={(e) => setDraft(prev => ({ ...prev, subject: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Recipients</Label>
                      <Button type="button" variant="outline" size="sm" onClick={handleSelectAllTeam}>
                        Select All Team
                      </Button>
                    </div>
                    <div className="border rounded-lg p-4 max-h-32 overflow-y-auto">
                      <div className="grid grid-cols-2 gap-2">
                        {team.members?.map((member: any) => (
                          <div key={member.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={member.id}
                              checked={draft.recipientIds.includes(member.id)}
                              onCheckedChange={(checked) => handleRecipientToggle(member.id, checked as boolean)}
                            />
                            <label htmlFor={member.id} className="text-sm flex items-center gap-2 cursor-pointer">
                              <Avatar className="w-5 h-5">
                                <AvatarFallback className="text-xs">
                                  {member.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2) || 'U'}
                                </AvatarFallback>
                              </Avatar>
                              {member.name || member.username}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Message</Label>
                    <Textarea
                      placeholder="Type your message..."
                      rows={8}
                      value={draft.body}
                      onChange={(e) => setDraft(prev => ({ ...prev, body: e.target.value }))}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowCompose(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSendMail}
                    disabled={sendMailMutation.isPending}
                    className="bg-coral hover:bg-coral/90"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send Mail
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Mail Navigation */}
          <Card>
            <CardContent className="p-3">
              <div className="space-y-1">
                <Button 
                  variant={activeTab === 'inbox' ? 'default' : 'ghost'} 
                  className="w-full justify-start"
                  onClick={() => setActiveTab('inbox')}
                >
                  <Inbox className="w-4 h-4 mr-2" />
                  Inbox
                  {mails.filter((m: TeamMail) => !m.isRead && !m.isArchived).length > 0 && (
                    <Badge className="ml-auto bg-coral">{mails.filter((m: TeamMail) => !m.isRead && !m.isArchived).length}</Badge>
                  )}
                </Button>
                <Button 
                  variant={activeTab === 'sent' ? 'default' : 'ghost'} 
                  className="w-full justify-start"
                  onClick={() => setActiveTab('sent')}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Sent
                </Button>
                <Button 
                  variant={activeTab === 'starred' ? 'default' : 'ghost'} 
                  className="w-full justify-start"
                  onClick={() => setActiveTab('starred')}
                >
                  <Star className="w-4 h-4 mr-2" />
                  Starred
                </Button>
                <Button 
                  variant={activeTab === 'archived' ? 'default' : 'ghost'} 
                  className="w-full justify-start"
                  onClick={() => setActiveTab('archived')}
                >
                  <Archive className="w-4 h-4 mr-2" />
                  Archived
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Drafts */}
          {drafts.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Drafts ({drafts.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {drafts.slice(0, 3).map((draft: any) => (
                    <div key={draft.id} className="p-2 border rounded-lg cursor-pointer hover:bg-muted">
                      <p className="text-sm font-medium truncate">{draft.subject || 'No subject'}</p>
                      <p className="text-xs text-muted-foreground">Auto-saved</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Main Mail Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Search and Filter */}
          <Card>
            <CardContent className="p-4">
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search mails..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="All types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="team">Team Messages</SelectItem>
                    <SelectItem value="announcement">Announcements</SelectItem>
                    <SelectItem value="meeting">Meetings</SelectItem>
                    <SelectItem value="update">Updates</SelectItem>
                    <SelectItem value="alert">Alerts</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Mail List or Detail View */}
          {selectedMail ? (
            /* Mail Detail View */
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Button variant="ghost" size="sm" onClick={() => setSelectedMail(null)}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to {activeTab}
                  </Button>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Reply className="w-4 h-4 mr-2" />
                      Reply
                    </Button>
                    <Button variant="outline" size="sm">
                      <Forward className="w-4 h-4 mr-2" />
                      Forward
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>
                          <Star className="w-4 h-4 mr-2" />
                          {selectedMail.isStarred ? 'Unstar' : 'Star'}
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Archive className="w-4 h-4 mr-2" />
                          Archive
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-gradient-to-br from-coral to-coral/80 text-white font-semibold">
                        {selectedMail.senderName?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-semibold text-foreground">{selectedMail.senderName}</p>
                          <p className="text-sm text-muted-foreground">{new Date(selectedMail.sentAt).toLocaleString()}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {getMailTypeIcon(selectedMail.mailType)}
                          <Badge variant="outline" className={getPriorityColor(selectedMail.priority)}>
                            {selectedMail.priority}
                          </Badge>
                        </div>
                      </div>
                      <h2 className="text-xl font-bold text-foreground mb-4">{selectedMail.subject}</h2>
                      <div className="prose max-w-none">
                        <p className="whitespace-pre-wrap">{selectedMail.body}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            /* Mail List View */
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="capitalize">
                    {activeTab} ({filteredMails.length})
                  </CardTitle>
                  {selectedMails.length > 0 && (
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => markAsReadMutation.mutate(selectedMails)}
                      >
                        Mark as Read
                      </Button>
                      <Button variant="outline" size="sm">
                        <Archive className="w-4 h-4 mr-2" />
                        Archive
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {mailsLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="animate-pulse flex items-center gap-4 p-4 border rounded-lg">
                        <div className="w-10 h-10 bg-muted rounded-full"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-muted rounded mb-2 w-3/4"></div>
                          <div className="h-3 bg-muted rounded w-1/2"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : filteredMails.length === 0 ? (
                  <div className="text-center py-8">
                    <Inbox className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No mails found</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredMails.map((mail: TeamMail) => (
                      <div 
                        key={mail.id} 
                        className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors ${
                          !mail.isRead ? 'border-l-4 border-l-coral' : ''
                        }`}
                        onClick={() => setSelectedMail(mail)}
                      >
                        <Checkbox
                          checked={selectedMails.includes(mail.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedMails(prev => [...prev, mail.id]);
                            } else {
                              setSelectedMails(prev => prev.filter(id => id !== mail.id));
                            }
                          }}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-gradient-to-br from-sky to-sky/80 text-white font-semibold">
                            {mail.senderName?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className={`font-medium truncate ${!mail.isRead ? 'font-bold' : ''}`}>
                              {mail.senderName}
                            </p>
                            {getMailTypeIcon(mail.mailType)}
                            {mail.isStarred && <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />}
                            {mail.important && <AlertCircle className="w-4 h-4 text-red-500" />}
                          </div>
                          <p className={`truncate text-sm mb-1 ${!mail.isRead ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>
                            {mail.subject}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">{mail.body}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <Badge variant="outline" className={`text-xs ${getPriorityColor(mail.priority)}`}>
                            {mail.priority}
                          </Badge>
                          <p className="text-xs text-muted-foreground">
                            {new Date(mail.sentAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
