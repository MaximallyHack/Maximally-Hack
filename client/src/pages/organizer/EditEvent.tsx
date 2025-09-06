import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { CrayonSquiggle } from "@/components/ui/floating-elements";
import { 
  ArrowLeft,
  Save,
  Eye,
  Plus,
  X,
  Calendar,
  MapPin,
  Users,
  Trophy,
  Clock,
  AlertTriangle,
  CheckCircle,
  FileText,
  Settings
} from "lucide-react";

interface EventData {
  id: string;
  title: string;
  slug: string;
  description: string;
  longDescription: string;
  startDate: string;
  endDate: string;
  registrationOpen: string;
  registrationClose: string;
  submissionOpen: string;
  submissionClose: string;
  format: 'online' | 'in-person' | 'hybrid';
  location: string;
  maxTeamSize: number;
  tracks: string[];
  tags: string[];
  prizes: Array<{
    place?: number;
    track?: string;
    amount: number;
    title: string;
    description?: string;
  }>;
  rules: string[];
  timeline: Array<{
    time: string;
    title: string;
    description: string;
  }>;
  faqs: Array<{
    question: string;
    answer: string;
  }>;
  isPublic: boolean;
  status: string;
}

const commonTracks = ['General', 'AI/ML', 'Web Development', 'Mobile', 'Gaming', 'Healthcare', 'Education', 'Climate', 'FinTech', 'Social Impact'];
const commonTags = ['AI', 'Web3', 'Mobile', 'Design', 'Backend', 'Frontend', 'Student', 'Beginner', 'Weekend', 'Online'];

export default function EditEvent() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('basic');
  const [hasChanges, setHasChanges] = useState(false);

  // Mock event data with realistic values
  const [data, setData] = useState<EventData>({
    id: id || 'ai-for-good-2024',
    title: 'AI for Good Challenge',
    slug: 'ai-for-good-challenge',
    description: 'Build AI solutions that make a positive impact on society and the environment.',
    longDescription: 'Join us for a 48-hour hackathon focused on developing AI solutions for social good. Whether you\'re passionate about climate change, healthcare, education, or social justice, this is your chance to use technology to make a difference.',
    startDate: '2024-12-15T10:00',
    endDate: '2024-12-17T18:00',
    registrationOpen: '2024-11-01T09:00',
    registrationClose: '2024-12-14T23:59',
    submissionOpen: '2024-12-15T10:00',
    submissionClose: '2024-12-17T16:00',
    format: 'hybrid',
    location: 'San Francisco, CA + Virtual',
    maxTeamSize: 4,
    tracks: ['AI/ML', 'Healthcare', 'Climate', 'Education'],
    tags: ['AI', 'Social Impact', 'Weekend'],
    prizes: [
      { place: 1, amount: 10000, title: 'First Place', description: 'Overall winner' },
      { place: 2, amount: 5000, title: 'Second Place', description: 'Runner up' },
      { place: 3, amount: 2500, title: 'Third Place', description: 'Third place winner' },
      { track: 'AI/ML', amount: 3000, title: 'Best AI Solution', description: 'Most innovative AI implementation' },
    ],
    rules: [
      'Teams can have 1-4 members',
      'All team members must register individually',
      'Projects must be started from scratch during the event',
      'Teams must submit their project by the deadline',
      'All code must be open source and available on GitHub'
    ],
    timeline: [
      { time: '2024-12-15T10:00', title: 'Opening Ceremony', description: 'Welcome and kickoff' },
      { time: '2024-12-15T11:00', title: 'Hacking Begins', description: 'Start building!' },
      { time: '2024-12-16T12:00', title: 'Lunch & Check-in', description: 'Lunch and progress updates' },
      { time: '2024-12-17T16:00', title: 'Submissions Due', description: 'Final project submissions' },
      { time: '2024-12-17T17:00', title: 'Presentations', description: 'Team presentations to judges' },
      { time: '2024-12-17T18:00', title: 'Awards Ceremony', description: 'Winners announcement' }
    ],
    faqs: [
      { question: 'What should I bring?', answer: 'Bring your laptop, charger, and any hardware you want to use. We\'ll provide food, drinks, and swag!' },
      { question: 'Can I participate remotely?', answer: 'Yes! This is a hybrid event. Remote participants will have access to all workshops and mentoring sessions via video calls.' },
      { question: 'Do I need a team?', answer: 'You can participate solo or form teams of up to 4 people. We\'ll have team formation activities at the beginning.' }
    ],
    isPublic: true,
    status: 'active'
  });

  const handleTitleChange = (title: string) => {
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/g, '');
    setData(prev => ({ ...prev, title, slug }));
    setHasChanges(true);
  };

  const updateData = (updates: Partial<EventData>) => {
    setData(prev => ({ ...prev, ...updates }));
    setHasChanges(true);
  };

  const addTrack = (track: string) => {
    if (!data.tracks.includes(track)) {
      setData(prev => ({ ...prev, tracks: [...prev.tracks, track] }));
      setHasChanges(true);
    }
  };

  const removeTrack = (track: string) => {
    setData(prev => ({ ...prev, tracks: prev.tracks.filter(t => t !== track) }));
    setHasChanges(true);
  };

  const addTag = (tag: string) => {
    if (!data.tags.includes(tag)) {
      setData(prev => ({ ...prev, tags: [...prev.tags, tag] }));
      setHasChanges(true);
    }
  };

  const removeTag = (tag: string) => {
    setData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
    setHasChanges(true);
  };

  const addPrize = () => {
    setData(prev => ({
      ...prev,
      prizes: [...prev.prizes, { amount: 0, title: '', description: '' }]
    }));
    setHasChanges(true);
  };

  const updatePrize = (index: number, updates: Partial<typeof data.prizes[0]>) => {
    setData(prev => ({
      ...prev,
      prizes: prev.prizes.map((prize, i) => i === index ? { ...prize, ...updates } : prize)
    }));
    setHasChanges(true);
  };

  const removePrize = (index: number) => {
    setData(prev => ({
      ...prev,
      prizes: prev.prizes.filter((_, i) => i !== index)
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    toast({
      title: "Event Updated! ✅",
      description: "Your changes have been saved successfully.",
    });
    setHasChanges(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'upcoming': return 'yellow';
      case 'completed': return 'sky';
      case 'draft': return 'mint';
      default: return 'mint';
    }
  };

  return (
    <div className="min-h-screen bg-cream py-8" data-testid="edit-event-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => setLocation(`/organizer/events/${data.id}/overview`)}
              className="text-text-muted hover:text-text-dark"
              data-testid="button-back"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Overview
            </Button>
            <div>
              <h1 className="font-heading font-bold text-3xl text-text-dark">Edit Event</h1>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-text-muted">{data.title}</p>
                <Badge className={`bg-${getStatusColor(data.status)}/20 text-${getStatusColor(data.status)} px-2 py-1 rounded-full text-xs border-0`}>
                  {data.status}
                </Badge>
                {hasChanges && (
                  <Badge className="bg-yellow/20 text-yellow px-2 py-1 rounded-full text-xs border-0">
                    Unsaved changes
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href={`/e/${data.id}`}>
              <Button variant="outline" className="border-sky text-sky hover:bg-sky/10" data-testid="button-preview">
                <Eye className="w-4 h-4 mr-2" />
                View Event
              </Button>
            </Link>
            <Button 
              onClick={handleSave}
              disabled={!hasChanges}
              className="bg-coral text-white hover:bg-coral/80"
              data-testid="button-save"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-5 bg-white rounded-xl border border-soft-gray p-1 mb-8">
                <TabsTrigger value="basic" className="rounded-lg">Basic Info</TabsTrigger>
                <TabsTrigger value="timing" className="rounded-lg">Timing</TabsTrigger>
                <TabsTrigger value="tracks" className="rounded-lg">Tracks</TabsTrigger>
                <TabsTrigger value="content" className="rounded-lg">Content</TabsTrigger>
                <TabsTrigger value="settings" className="rounded-lg">Settings</TabsTrigger>
              </TabsList>

              {/* Basic Info Tab */}
              <TabsContent value="basic">
                <Card className="bg-white rounded-2xl p-8 shadow-soft border border-soft-gray">
                  <div className="text-center mb-8">
                    <h2 className="font-heading font-bold text-2xl text-text-dark mb-2">Basic Information</h2>
                    <CrayonSquiggle className="mx-auto mb-4" />
                    <p className="text-text-muted">Update your event details</p>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-text-dark mb-2">Event Title *</label>
                      <Input
                        value={data.title}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        className="border-soft-gray focus:ring-2 focus:ring-coral focus:border-transparent"
                        data-testid="input-title"
                      />
                      {data.slug && (
                        <p className="text-xs text-text-muted mt-1">URL: maximallyhack.com/e/{data.slug}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-dark mb-2">Short Description *</label>
                      <Textarea
                        value={data.description}
                        onChange={(e) => updateData({ description: e.target.value })}
                        rows={3}
                        className="border-soft-gray focus:ring-2 focus:ring-coral focus:border-transparent"
                        data-testid="textarea-description"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-dark mb-2">Long Description</label>
                      <Textarea
                        value={data.longDescription}
                        onChange={(e) => updateData({ longDescription: e.target.value })}
                        rows={6}
                        className="border-soft-gray focus:ring-2 focus:ring-coral focus:border-transparent"
                        data-testid="textarea-long-description"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-text-dark mb-2">Format</label>
                        <Select value={data.format} onValueChange={(value: any) => updateData({ format: value })}>
                          <SelectTrigger className="border-soft-gray" data-testid="select-format">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="online">Online</SelectItem>
                            <SelectItem value="in-person">In-person</SelectItem>
                            <SelectItem value="hybrid">Hybrid</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-dark mb-2">Location</label>
                        <Input
                          value={data.location}
                          onChange={(e) => updateData({ location: e.target.value })}
                          placeholder={data.format === 'online' ? 'Virtual' : 'City, Country'}
                          className="border-soft-gray focus:ring-2 focus:ring-coral focus:border-transparent"
                          data-testid="input-location"
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              {/* Timing Tab */}
              <TabsContent value="timing">
                <Card className="bg-white rounded-2xl p-8 shadow-soft border border-soft-gray">
                  <div className="text-center mb-8">
                    <h2 className="font-heading font-bold text-2xl text-text-dark mb-2">Event Timeline</h2>
                    <CrayonSquiggle className="mx-auto mb-4" />
                    <p className="text-text-muted">Manage your event schedule</p>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-text-dark mb-2">Start Date *</label>
                        <Input
                          type="datetime-local"
                          value={data.startDate}
                          onChange={(e) => updateData({ startDate: e.target.value })}
                          className="border-soft-gray focus:ring-2 focus:ring-coral focus:border-transparent"
                          data-testid="input-start-date"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-dark mb-2">End Date *</label>
                        <Input
                          type="datetime-local"
                          value={data.endDate}
                          onChange={(e) => updateData({ endDate: e.target.value })}
                          className="border-soft-gray focus:ring-2 focus:ring-coral focus:border-transparent"
                          data-testid="input-end-date"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-text-dark mb-2">Registration Opens *</label>
                        <Input
                          type="datetime-local"
                          value={data.registrationOpen}
                          onChange={(e) => updateData({ registrationOpen: e.target.value })}
                          className="border-soft-gray focus:ring-2 focus:ring-coral focus:border-transparent"
                          data-testid="input-registration-open"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-dark mb-2">Registration Closes *</label>
                        <Input
                          type="datetime-local"
                          value={data.registrationClose}
                          onChange={(e) => updateData({ registrationClose: e.target.value })}
                          className="border-soft-gray focus:ring-2 focus:ring-coral focus:border-transparent"
                          data-testid="input-registration-close"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-text-dark mb-2">Submissions Open *</label>
                        <Input
                          type="datetime-local"
                          value={data.submissionOpen}
                          onChange={(e) => updateData({ submissionOpen: e.target.value })}
                          className="border-soft-gray focus:ring-2 focus:ring-coral focus:border-transparent"
                          data-testid="input-submission-open"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-dark mb-2">Submissions Close *</label>
                        <Input
                          type="datetime-local"
                          value={data.submissionClose}
                          onChange={(e) => updateData({ submissionClose: e.target.value })}
                          className="border-soft-gray focus:ring-2 focus:ring-coral focus:border-transparent"
                          data-testid="input-submission-close"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-dark mb-2">Max Team Size</label>
                      <Select value={data.maxTeamSize.toString()} onValueChange={(value) => updateData({ maxTeamSize: parseInt(value) })}>
                        <SelectTrigger className="border-soft-gray" data-testid="select-team-size">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Solo only</SelectItem>
                          <SelectItem value="2">Teams of 2</SelectItem>
                          <SelectItem value="3">Teams of 3</SelectItem>
                          <SelectItem value="4">Teams of 4</SelectItem>
                          <SelectItem value="5">Teams of 5</SelectItem>
                          <SelectItem value="6">Teams of 6</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              {/* Tracks Tab */}
              <TabsContent value="tracks">
                <Card className="bg-white rounded-2xl p-8 shadow-soft border border-soft-gray">
                  <div className="text-center mb-8">
                    <h2 className="font-heading font-bold text-2xl text-text-dark mb-2">Tracks & Categories</h2>
                    <CrayonSquiggle className="mx-auto mb-4" />
                    <p className="text-text-muted">Organize your hackathon with tracks and tags</p>
                  </div>

                  <div className="space-y-8">
                    <div>
                      <label className="block text-sm font-medium text-text-dark mb-4">Competition Tracks *</label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                        {commonTracks.map(track => (
                          <Badge
                            key={track}
                            onClick={() => data.tracks.includes(track) ? removeTrack(track) : addTrack(track)}
                            className={`cursor-pointer transition-colors p-3 rounded-xl border-0 ${
                              data.tracks.includes(track)
                                ? 'bg-coral text-white'
                                : 'bg-soft-gray text-text-dark hover:bg-soft-gray/80'
                            }`}
                            data-testid={`track-${track.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                          >
                            {track}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {data.tracks.map(track => (
                          <Badge key={track} className="bg-coral text-white px-3 py-1 rounded-full border-0 flex items-center gap-2">
                            {track}
                            <X className="w-3 h-3 cursor-pointer" onClick={() => removeTrack(track)} />
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-dark mb-4">Tags</label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                        {commonTags.map(tag => (
                          <Badge
                            key={tag}
                            onClick={() => data.tags.includes(tag) ? removeTag(tag) : addTag(tag)}
                            className={`cursor-pointer transition-colors p-2 rounded-lg border-0 text-sm ${
                              data.tags.includes(tag)
                                ? 'bg-sky text-white'
                                : 'bg-soft-gray text-text-dark hover:bg-soft-gray/80'
                            }`}
                            data-testid={`tag-${tag.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {data.tags.map(tag => (
                          <Badge key={tag} className="bg-sky text-white px-2 py-1 rounded-full border-0 flex items-center gap-1 text-xs">
                            {tag}
                            <X className="w-3 h-3 cursor-pointer" onClick={() => removeTag(tag)} />
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              {/* Content Tab */}
              <TabsContent value="content">
                <Card className="bg-white rounded-2xl p-8 shadow-soft border border-soft-gray">
                  <div className="text-center mb-8">
                    <h2 className="font-heading font-bold text-2xl text-text-dark mb-2">Event Content</h2>
                    <CrayonSquiggle className="mx-auto mb-4" />
                    <p className="text-text-muted">Manage prizes, rules, and FAQs</p>
                  </div>

                  <div className="space-y-8">
                    {/* Prizes Section */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <label className="block text-sm font-medium text-text-dark">Prizes</label>
                        <Button
                          onClick={addPrize}
                          variant="outline"
                          size="sm"
                          className="border-coral text-coral hover:bg-coral/10"
                          data-testid="button-add-prize"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Add Prize
                        </Button>
                      </div>
                      <div className="space-y-4">
                        {data.prizes.map((prize, index) => (
                          <div key={index} className="bg-soft-gray/30 rounded-xl p-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <Input
                                placeholder="Prize title"
                                value={prize.title}
                                onChange={(e) => updatePrize(index, { title: e.target.value })}
                                className="border-soft-gray"
                                data-testid={`input-prize-title-${index}`}
                              />
                              <Input
                                type="number"
                                placeholder="Amount ($)"
                                value={prize.amount}
                                onChange={(e) => updatePrize(index, { amount: parseInt(e.target.value) || 0 })}
                                className="border-soft-gray"
                                data-testid={`input-prize-amount-${index}`}
                              />
                              <div className="flex gap-2">
                                <Input
                                  placeholder="Description (optional)"
                                  value={prize.description || ''}
                                  onChange={(e) => updatePrize(index, { description: e.target.value })}
                                  className="border-soft-gray flex-1"
                                  data-testid={`input-prize-description-${index}`}
                                />
                                <Button
                                  onClick={() => removePrize(index)}
                                  variant="ghost"
                                  size="icon"
                                  className="text-text-muted hover:text-coral"
                                  data-testid={`button-remove-prize-${index}`}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Rules Section */}
                    <div>
                      <label className="block text-sm font-medium text-text-dark mb-4">Rules & Guidelines</label>
                      <div className="space-y-3">
                        {data.rules.map((rule, index) => (
                          <div key={index} className="flex gap-2">
                            <Input
                              placeholder="Add a rule..."
                              value={rule}
                              onChange={(e) => {
                                const newRules = [...data.rules];
                                newRules[index] = e.target.value;
                                updateData({ rules: newRules });
                              }}
                              className="border-soft-gray flex-1"
                              data-testid={`input-rule-${index}`}
                            />
                            <Button
                              onClick={() => {
                                const newRules = data.rules.filter((_, i) => i !== index);
                                updateData({ rules: newRules });
                              }}
                              variant="ghost"
                              size="icon"
                              className="text-text-muted hover:text-coral"
                              data-testid={`button-remove-rule-${index}`}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          onClick={() => updateData({ rules: [...data.rules, ''] })}
                          variant="outline"
                          size="sm"
                          className="border-mint text-mint hover:bg-mint/10"
                          data-testid="button-add-rule"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Add Rule
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings">
                <Card className="bg-white rounded-2xl p-8 shadow-soft border border-soft-gray">
                  <div className="text-center mb-8">
                    <h2 className="font-heading font-bold text-2xl text-text-dark mb-2">Event Settings</h2>
                    <CrayonSquiggle className="mx-auto mb-4" />
                    <p className="text-text-muted">Configure visibility and advanced options</p>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-sky/10 rounded-xl border border-sky/20">
                      <div>
                        <h4 className="font-medium text-text-dark">Event Visibility</h4>
                        <p className="text-text-muted text-sm">When enabled, your event will be visible to everyone and open for registration</p>
                      </div>
                      <Switch
                        checked={data.isPublic}
                        onCheckedChange={(checked) => updateData({ isPublic: checked })}
                        data-testid="switch-public"
                      />
                    </div>

                    <div className="bg-coral/10 rounded-xl p-6 border border-coral/20">
                      <div className="flex items-center gap-3 mb-4">
                        <AlertTriangle className="w-5 h-5 text-coral" />
                        <h4 className="font-medium text-text-dark">Danger Zone</h4>
                      </div>
                      <p className="text-text-muted text-sm mb-4">
                        These actions are irreversible. Please proceed with caution.
                      </p>
                      <div className="space-y-3">
                        <Button variant="outline" className="border-coral text-coral hover:bg-coral/10" data-testid="button-archive">
                          Archive Event
                        </Button>
                        <Button variant="outline" className="border-coral text-coral hover:bg-coral/10" data-testid="button-delete">
                          Delete Event
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Event Status */}
              <Card className="bg-white rounded-2xl p-6 shadow-soft border border-soft-gray">
                <h3 className="font-heading font-semibold text-lg text-text-dark mb-4">Event Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-text-muted text-sm">Status</span>
                    <Badge className={`bg-${getStatusColor(data.status)}/20 text-${getStatusColor(data.status)} px-2 py-1 rounded-full text-xs border-0`}>
                      {data.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-text-muted text-sm">Visibility</span>
                    <Badge className={`${data.isPublic ? 'bg-success/20 text-success' : 'bg-yellow/20 text-yellow'} px-2 py-1 rounded-full text-xs border-0`}>
                      {data.isPublic ? 'Public' : 'Private'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-text-muted text-sm">Tracks</span>
                    <span className="font-medium text-text-dark">{data.tracks.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-text-muted text-sm">Prizes</span>
                    <span className="font-medium text-text-dark">${data.prizes.reduce((sum, prize) => sum + prize.amount, 0).toLocaleString()}</span>
                  </div>
                </div>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-white rounded-2xl p-6 shadow-soft border border-soft-gray">
                <h3 className="font-heading font-semibold text-lg text-text-dark mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start border-sky text-sky hover:bg-sky/10" data-testid="quick-manage">
                    <Settings className="w-4 h-4 mr-2" />
                    Manage Event
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-mint text-mint hover:bg-mint/10" data-testid="quick-timeline">
                    <Calendar className="w-4 h-4 mr-2" />
                    View Timeline
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-yellow text-text-dark hover:bg-yellow/10" data-testid="quick-participants">
                    <Users className="w-4 h-4 mr-2" />
                    View Participants
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}