import { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { 
  Save, 
  Eye, 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Edit, 
  Calendar,
  Trophy,
  Scale,
  Gavel,
  Users,
  Heart,
  Info,
  HelpCircle,
  BookOpen
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EventContent {
  overview: {
    highlights: Array<{
      title: string;
      value: string;
      description: string;
      icon: string;
      color: string;
    }>;
    quickStart: Array<{
      id: string;
      title: string;
      description: string;
      action: string;
      required: boolean;
    }>;
    whyJoin: string[];
  };
  timeline: {
    items: Array<{
      id: string;
      time: string;
      title: string;
      description: string;
      status: 'completed' | 'active' | 'upcoming';
      type: 'milestone' | 'deadline' | 'event';
    }>;
    showLive: boolean;
  };
  prizes: {
    total: number;
    currency: string;
    categories: Array<{
      id: string;
      title: string;
      description: string;
      prizes: Array<{
        place: number;
        amount: number;
        title: string;
        description: string;
      }>;
    }>;
    rules: string[];
  };
  rules: {
    sections: Array<{
      id: string;
      title: string;
      description: string;
      category: string;
    }>;
    importantNotes: Array<{
      type: 'warning' | 'info';
      title: string;
      message: string;
    }>;
    deadlines: Array<{
      title: string;
      date: string;
      status: 'open' | 'closed' | 'upcoming';
    }>;
  };
  judging: {
    criteria: Array<{
      id: string;
      name: string;
      weight: number;
      description: string;
      maxScore: number;
    }>;
    process: string[];
    timeline: Array<{
      time: string;
      title: string;
      description: string;
    }>;
  };
  sponsors: {
    tiers: Array<{
      name: string;
      level: number;
      benefits: string[];
    }>;
  };
  about: {
    story: string;
    mission: string;
    team: Array<{
      name: string;
      role: string;
      bio: string;
      avatar?: string;
    }>;
    contact: {
      email: string;
      social: Record<string, string>;
    };
  };
  resources: {
    categories: Array<{
      title: string;
      description: string;
      items: Array<{
        title: string;
        description: string;
        url: string;
        type: 'documentation' | 'tool' | 'template' | 'api';
      }>;
    }>;
  };
  help: {
    faqs: Array<{
      id: string;
      question: string;
      answer: string;
      category: string;
    }>;
    support: {
      email: string;
      discord?: string;
      slack?: string;
      hours: string;
    };
    guides: Array<{
      title: string;
      description: string;
      url: string;
    }>;
  };
}

export default function EventContentEditor() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Mock event data - in real app, this would come from API
  const [eventContent, setEventContent] = useState<EventContent>({
    overview: {
      highlights: [
        {
          title: 'Prize Pool',
          value: '$50,000',
          description: 'Total prizes available',
          icon: 'Trophy',
          color: 'text-coral'
        },
        {
          title: 'Participants',
          value: '500+',
          description: 'Expected participants',
          icon: 'Users',
          color: 'text-sky'
        }
      ],
      quickStart: [
        {
          id: '1',
          title: 'Register your team',
          description: 'Form your team of up to 4 members',
          action: 'Register Now',
          required: true
        },
        {
          id: '2',
          title: 'Join the Discord',
          description: 'Connect with other participants',
          action: 'Join Discord',
          required: false
        }
      ],
      whyJoin: [
        'Build innovative solutions with AI',
        'Network with industry experts',
        'Win amazing prizes and recognition',
        'Learn from experienced mentors'
      ]
    },
    timeline: {
      items: [
        {
          id: '1',
          time: '2025-01-15T09:00:00Z',
          title: 'Registration Opens',
          description: 'Team registration and individual sign-ups begin',
          status: 'completed',
          type: 'milestone'
        },
        {
          id: '2', 
          time: '2025-02-01T18:00:00Z',
          title: 'Hackathon Begins',
          description: 'Opening ceremony and project building starts',
          status: 'upcoming',
          type: 'event'
        }
      ],
      showLive: true
    },
    prizes: {
      total: 50000,
      currency: 'USD',
      categories: [
        {
          id: '1',
          title: 'Grand Prize',
          description: 'Best overall project',
          prizes: [
            { place: 1, amount: 20000, title: 'First Place', description: 'The most innovative and impactful solution' }
          ]
        }
      ],
      rules: [
        'All submissions must be original work',
        'Teams can have up to 4 members',
        'Projects must be submitted by the deadline'
      ]
    },
    rules: {
      sections: [
        {
          id: '1',
          title: 'Eligibility',
          description: 'Open to students and professionals worldwide',
          category: 'participation'
        }
      ],
      importantNotes: [
        {
          type: 'warning',
          title: 'Deadline',
          message: 'All submissions must be completed by the final deadline'
        }
      ],
      deadlines: [
        {
          title: 'Registration Deadline',
          date: '2025-01-31T23:59:59Z',
          status: 'open'
        }
      ]
    },
    judging: {
      criteria: [
        {
          id: '1',
          name: 'Innovation',
          weight: 30,
          description: 'Originality and creativity of the solution',
          maxScore: 10
        },
        {
          id: '2',
          name: 'Technical Excellence',
          weight: 25,
          description: 'Quality of implementation and code',
          maxScore: 10
        }
      ],
      process: [
        'Initial screening by organizers',
        'Detailed evaluation by expert judges',
        'Final presentations to judging panel'
      ],
      timeline: []
    },
    sponsors: {
      tiers: [
        {
          name: 'Platinum',
          level: 1,
          benefits: ['Logo on website', 'Booth space', 'Speaking opportunity']
        }
      ]
    },
    about: {
      story: 'This hackathon was created to bring together the brightest minds in technology.',
      mission: 'To foster innovation and create solutions that make a positive impact.',
      team: [
        {
          name: 'Maria Rodriguez',
          role: 'Event Director',
          bio: 'Experienced event organizer with 5+ years in tech events'
        }
      ],
      contact: {
        email: 'organizer@event.com',
        social: {
          twitter: '@event',
          linkedin: 'event-company'
        }
      }
    },
    resources: {
      categories: [
        {
          title: 'APIs',
          description: 'Useful APIs for your projects',
          items: [
            {
              title: 'OpenAI API',
              description: 'Access powerful AI models',
              url: 'https://openai.com/api',
              type: 'api'
            }
          ]
        }
      ]
    },
    help: {
      faqs: [
        {
          id: '1',
          question: 'How do I register for the event?',
          answer: 'Click the registration button and fill out the form.',
          category: 'registration'
        }
      ],
      support: {
        email: 'support@event.com',
        discord: 'https://discord.gg/event',
        hours: '9 AM - 6 PM PST'
      },
      guides: [
        {
          title: 'Getting Started Guide',
          description: 'Everything you need to know to participate',
          url: '/guides/getting-started'
        }
      ]
    }
  });

  // Redirect if user is not an organizer or can't edit this event
  if (!user?.isOrganizer || !user?.canEditEvent(id || '')) {
    return <Navigate to="/organizer" replace />;
  }

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // In real app, save to backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      setHasUnsavedChanges(false);
      toast({
        title: "Content saved",
        description: "Your event content has been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Save failed",
        description: "Failed to save event content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      // In real app, publish to backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Event published",
        description: "Your event is now live and visible to participants.",
      });
    } catch (error) {
      toast({
        title: "Publish failed",
        description: "Failed to publish event. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPublishing(false);
    }
  };

  const sectionConfigs = [
    { key: 'overview', label: 'Overview', icon: Eye },
    { key: 'timeline', label: 'Timeline', icon: Calendar },
    { key: 'prizes', label: 'Prizes', icon: Trophy },
    { key: 'rules', label: 'Rules', icon: Scale },
    { key: 'judging', label: 'Judging', icon: Gavel },
    { key: 'sponsors', label: 'Sponsors', icon: Heart },
    { key: 'about', label: 'About', icon: Info },
    { key: 'resources', label: 'Resources', icon: BookOpen },
    { key: 'help', label: 'Help', icon: HelpCircle },
  ];

  return (
    <div className="min-h-screen bg-background" data-testid="event-content-editor">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild data-testid="button-back">
              <a href="/organizer">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </a>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Edit Event Content</h1>
              <p className="text-muted-foreground">Customize all sections of your event page</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {hasUnsavedChanges && (
              <Badge variant="outline" className="text-orange-600 border-orange-600">
                Unsaved Changes
              </Badge>
            )}
            <Button variant="outline" size="sm" data-testid="button-preview">
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSave}
              disabled={isSaving}
              data-testid="button-save"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
            <Button 
              onClick={handlePublish}
              disabled={isPublishing}
              data-testid="button-publish"
            >
              {isPublishing ? 'Publishing...' : 'Publish'}
            </Button>
          </div>
        </div>

        {/* Content Editor */}
        <Card>
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-9 rounded-none border-b">
                {sectionConfigs.map((section) => {
                  const Icon = section.icon;
                  return (
                    <TabsTrigger 
                      key={section.key} 
                      value={section.key}
                      className="flex items-center gap-2"
                      data-testid={`tab-${section.key}`}
                    >
                      <Icon className="w-4 h-4" />
                      {section.label}
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Event Highlights</h3>
                  {eventContent.overview.highlights.map((highlight, index) => (
                    <Card key={index} className="p-4 mb-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <Label>Title</Label>
                          <Input 
                            value={highlight.title} 
                            onChange={(e) => {
                              const newHighlights = [...eventContent.overview.highlights];
                              newHighlights[index].title = e.target.value;
                              setEventContent(prev => ({
                                ...prev,
                                overview: { ...prev.overview, highlights: newHighlights }
                              }));
                              setHasUnsavedChanges(true);
                            }}
                            data-testid={`input-highlight-title-${index}`}
                          />
                        </div>
                        <div>
                          <Label>Value</Label>
                          <Input 
                            value={highlight.value}
                            onChange={(e) => {
                              const newHighlights = [...eventContent.overview.highlights];
                              newHighlights[index].value = e.target.value;
                              setEventContent(prev => ({
                                ...prev,
                                overview: { ...prev.overview, highlights: newHighlights }
                              }));
                              setHasUnsavedChanges(true);
                            }}
                            data-testid={`input-highlight-value-${index}`}
                          />
                        </div>
                        <div>
                          <Label>Description</Label>
                          <Input 
                            value={highlight.description}
                            onChange={(e) => {
                              const newHighlights = [...eventContent.overview.highlights];
                              newHighlights[index].description = e.target.value;
                              setEventContent(prev => ({
                                ...prev,
                                overview: { ...prev.overview, highlights: newHighlights }
                              }));
                              setHasUnsavedChanges(true);
                            }}
                            data-testid={`input-highlight-description-${index}`}
                          />
                        </div>
                        <div className="flex items-end">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => {
                              const newHighlights = eventContent.overview.highlights.filter((_, i) => i !== index);
                              setEventContent(prev => ({
                                ...prev,
                                overview: { ...prev.overview, highlights: newHighlights }
                              }));
                              setHasUnsavedChanges(true);
                            }}
                            data-testid={`button-remove-highlight-${index}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      const newHighlight = {
                        title: 'New Highlight',
                        value: '0',
                        description: 'Description',
                        icon: 'Star',
                        color: 'text-coral'
                      };
                      setEventContent(prev => ({
                        ...prev,
                        overview: { 
                          ...prev.overview, 
                          highlights: [...prev.overview.highlights, newHighlight] 
                        }
                      }));
                      setHasUnsavedChanges(true);
                    }}
                    data-testid="button-add-highlight"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Highlight
                  </Button>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-4">Why Join This Event</h3>
                  {eventContent.overview.whyJoin.map((reason, index) => (
                    <div key={index} className="flex items-center gap-2 mb-2">
                      <Input 
                        value={reason}
                        onChange={(e) => {
                          const newReasons = [...eventContent.overview.whyJoin];
                          newReasons[index] = e.target.value;
                          setEventContent(prev => ({
                            ...prev,
                            overview: { ...prev.overview, whyJoin: newReasons }
                          }));
                          setHasUnsavedChanges(true);
                        }}
                        data-testid={`input-why-join-${index}`}
                      />
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          const newReasons = eventContent.overview.whyJoin.filter((_, i) => i !== index);
                          setEventContent(prev => ({
                            ...prev,
                            overview: { ...prev.overview, whyJoin: newReasons }
                          }));
                          setHasUnsavedChanges(true);
                        }}
                        data-testid={`button-remove-why-join-${index}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setEventContent(prev => ({
                        ...prev,
                        overview: { 
                          ...prev.overview, 
                          whyJoin: [...prev.overview.whyJoin, 'New reason to join'] 
                        }
                      }));
                      setHasUnsavedChanges(true);
                    }}
                    data-testid="button-add-why-join"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Reason
                  </Button>
                </div>
              </TabsContent>

              {/* Timeline Tab */}
              <TabsContent value="timeline" className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Event Timeline</h3>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="show-live">Show Live Updates</Label>
                    <Switch 
                      id="show-live"
                      checked={eventContent.timeline.showLive}
                      onCheckedChange={(checked) => {
                        setEventContent(prev => ({
                          ...prev,
                          timeline: { ...prev.timeline, showLive: checked }
                        }));
                        setHasUnsavedChanges(true);
                      }}
                      data-testid="switch-show-live"
                    />
                  </div>
                </div>

                {eventContent.timeline.items.map((item, index) => (
                  <Card key={index} className="p-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <Label>Date & Time</Label>
                        <Input 
                          type="datetime-local"
                          value={new Date(item.time).toISOString().slice(0, 16)}
                          onChange={(e) => {
                            const newItems = [...eventContent.timeline.items];
                            newItems[index].time = new Date(e.target.value).toISOString();
                            setEventContent(prev => ({
                              ...prev,
                              timeline: { ...prev.timeline, items: newItems }
                            }));
                            setHasUnsavedChanges(true);
                          }}
                          data-testid={`input-timeline-time-${index}`}
                        />
                      </div>
                      <div>
                        <Label>Title</Label>
                        <Input 
                          value={item.title}
                          onChange={(e) => {
                            const newItems = [...eventContent.timeline.items];
                            newItems[index].title = e.target.value;
                            setEventContent(prev => ({
                              ...prev,
                              timeline: { ...prev.timeline, items: newItems }
                            }));
                            setHasUnsavedChanges(true);
                          }}
                          data-testid={`input-timeline-title-${index}`}
                        />
                      </div>
                      <div>
                        <Label>Status</Label>
                        <select 
                          value={item.status}
                          onChange={(e) => {
                            const newItems = [...eventContent.timeline.items];
                            newItems[index].status = e.target.value as 'completed' | 'active' | 'upcoming';
                            setEventContent(prev => ({
                              ...prev,
                              timeline: { ...prev.timeline, items: newItems }
                            }));
                            setHasUnsavedChanges(true);
                          }}
                          className="w-full p-2 border rounded-md"
                          data-testid={`select-timeline-status-${index}`}
                        >
                          <option value="upcoming">Upcoming</option>
                          <option value="active">Active</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>
                      <div className="flex items-end">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            const newItems = eventContent.timeline.items.filter((_, i) => i !== index);
                            setEventContent(prev => ({
                              ...prev,
                              timeline: { ...prev.timeline, items: newItems }
                            }));
                            setHasUnsavedChanges(true);
                          }}
                          data-testid={`button-remove-timeline-${index}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Label>Description</Label>
                      <Textarea 
                        value={item.description}
                        onChange={(e) => {
                          const newItems = [...eventContent.timeline.items];
                          newItems[index].description = e.target.value;
                          setEventContent(prev => ({
                            ...prev,
                            timeline: { ...prev.timeline, items: newItems }
                          }));
                          setHasUnsavedChanges(true);
                        }}
                        data-testid={`textarea-timeline-description-${index}`}
                      />
                    </div>
                  </Card>
                ))}

                <Button 
                  variant="outline"
                  onClick={() => {
                    const newItem = {
                      id: Date.now().toString(),
                      time: new Date().toISOString(),
                      title: 'New Timeline Item',
                      description: 'Description of the timeline item',
                      status: 'upcoming' as const,
                      type: 'milestone' as const
                    };
                    setEventContent(prev => ({
                      ...prev,
                      timeline: { 
                        ...prev.timeline, 
                        items: [...prev.timeline.items, newItem] 
                      }
                    }));
                    setHasUnsavedChanges(true);
                  }}
                  data-testid="button-add-timeline-item"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Timeline Item
                </Button>
              </TabsContent>

              {/* Additional tabs would go here for prizes, rules, judging, etc. */}
              <TabsContent value="prizes" className="p-6">
                <div className="text-center py-12">
                  <Trophy className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">Prizes Editor</h3>
                  <p className="text-muted-foreground">Configure prize categories and amounts for your event.</p>
                  <p className="text-sm text-muted-foreground mt-2">Coming soon...</p>
                </div>
              </TabsContent>

              <TabsContent value="rules" className="p-6">
                <div className="text-center py-12">
                  <Scale className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">Rules Editor</h3>
                  <p className="text-muted-foreground">Define rules, eligibility, and important guidelines.</p>
                  <p className="text-sm text-muted-foreground mt-2">Coming soon...</p>
                </div>
              </TabsContent>

              <TabsContent value="judging" className="p-6">
                <div className="text-center py-12">
                  <Gavel className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">Judging Editor</h3>
                  <p className="text-muted-foreground">Set up judging criteria and manage the evaluation process.</p>
                  <p className="text-sm text-muted-foreground mt-2">Coming soon...</p>
                </div>
              </TabsContent>

              <TabsContent value="sponsors" className="p-6">
                <div className="text-center py-12">
                  <Heart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">Sponsors Editor</h3>
                  <p className="text-muted-foreground">Manage sponsor information and showcase your partners.</p>
                  <p className="text-sm text-muted-foreground mt-2">Coming soon...</p>
                </div>
              </TabsContent>

              <TabsContent value="about" className="p-6">
                <div className="text-center py-12">
                  <Info className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">About Editor</h3>
                  <p className="text-muted-foreground">Tell your story and introduce your organizing team.</p>
                  <p className="text-sm text-muted-foreground mt-2">Coming soon...</p>
                </div>
              </TabsContent>

              <TabsContent value="resources" className="p-6">
                <div className="text-center py-12">
                  <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">Resources Editor</h3>
                  <p className="text-muted-foreground">Curate helpful resources and tools for participants.</p>
                  <p className="text-sm text-muted-foreground mt-2">Coming soon...</p>
                </div>
              </TabsContent>

              <TabsContent value="help" className="p-6">
                <div className="text-center py-12">
                  <HelpCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">Help Editor</h3>
                  <p className="text-muted-foreground">Create FAQs and support resources for participants.</p>
                  <p className="text-sm text-muted-foreground mt-2">Coming soon...</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}