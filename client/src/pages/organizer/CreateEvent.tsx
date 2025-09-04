import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useConfetti } from "@/components/ui/confetti";
import { CrayonSquiggle } from "@/components/ui/floating-elements";
import { 
  ArrowRight, 
  ArrowLeft,
  Calendar,
  MapPin,
  Trophy,
  Users,
  Clock,
  Eye,
  Settings,
  Plus,
  X,
  Save,
  Rocket
} from "lucide-react";

interface EventData {
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
}

const defaultEventData: EventData = {
  title: '',
  slug: '',
  description: '',
  longDescription: '',
  startDate: '',
  endDate: '',
  registrationOpen: '',
  registrationClose: '',
  submissionOpen: '',
  submissionClose: '',
  format: 'online',
  location: '',
  maxTeamSize: 4,
  tracks: [],
  tags: [],
  prizes: [],
  rules: [],
  timeline: [],
  faqs: [],
  isPublic: false
};

const commonTracks = ['General', 'AI/ML', 'Web Development', 'Mobile', 'Gaming', 'Healthcare', 'Education', 'Climate', 'FinTech', 'Social Impact'];
const commonTags = ['AI', 'Web3', 'Mobile', 'Design', 'Backend', 'Frontend', 'Student', 'Beginner', 'Weekend', 'Online'];

export default function CreateEvent() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const [activeTab, setActiveTab] = useState('basic');
  const [data, setData] = useState<EventData>(defaultEventData);
  const [isPreview, setIsPreview] = useState(false);
  const { toast } = useToast();
  const { isActive: confettiActive, trigger: triggerConfetti, Confetti } = useConfetti();

  const totalSteps = 5;
  const progress = (step / totalSteps) * 100;

  const handleTitleChange = (title: string) => {
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/g, '');
    setData(prev => ({ ...prev, title, slug }));
  };

  const addTrack = (track: string) => {
    if (!data.tracks.includes(track)) {
      setData(prev => ({ ...prev, tracks: [...prev.tracks, track] }));
    }
  };

  const removeTrack = (track: string) => {
    setData(prev => ({ ...prev, tracks: prev.tracks.filter(t => t !== track) }));
  };

  const addTag = (tag: string) => {
    if (!data.tags.includes(tag)) {
      setData(prev => ({ ...prev, tags: [...prev.tags, tag] }));
    }
  };

  const removeTag = (tag: string) => {
    setData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
  };

  const addPrize = () => {
    setData(prev => ({
      ...prev,
      prizes: [...prev.prizes, { amount: 0, title: '', description: '' }]
    }));
  };

  const updatePrize = (index: number, updates: Partial<typeof data.prizes[0]>) => {
    setData(prev => ({
      ...prev,
      prizes: prev.prizes.map((prize, i) => i === index ? { ...prize, ...updates } : prize)
    }));
  };

  const removePrize = (index: number) => {
    setData(prev => ({
      ...prev,
      prizes: prev.prizes.filter((_, i) => i !== index)
    }));
  };

  const addRule = () => {
    setData(prev => ({ ...prev, rules: [...prev.rules, ''] }));
  };

  const updateRule = (index: number, rule: string) => {
    setData(prev => ({
      ...prev,
      rules: prev.rules.map((r, i) => i === index ? rule : r)
    }));
  };

  const removeRule = (index: number) => {
    setData(prev => ({
      ...prev,
      rules: prev.rules.filter((_, i) => i !== index)
    }));
  };

  const addTimelineItem = () => {
    setData(prev => ({
      ...prev,
      timeline: [...prev.timeline, { time: '', title: '', description: '' }]
    }));
  };

  const updateTimelineItem = (index: number, updates: Partial<typeof data.timeline[0]>) => {
    setData(prev => ({
      ...prev,
      timeline: prev.timeline.map((item, i) => i === index ? { ...item, ...updates } : item)
    }));
  };

  const removeTimelineItem = (index: number) => {
    setData(prev => ({
      ...prev,
      timeline: prev.timeline.filter((_, i) => i !== index)
    }));
  };

  const addFAQ = () => {
    setData(prev => ({
      ...prev,
      faqs: [...prev.faqs, { question: '', answer: '' }]
    }));
  };

  const updateFAQ = (index: number, updates: Partial<typeof data.faqs[0]>) => {
    setData(prev => ({
      ...prev,
      faqs: prev.faqs.map((faq, i) => i === index ? { ...faq, ...updates } : faq)
    }));
  };

  const removeFAQ = (index: number) => {
    setData(prev => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index)
    }));
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return data.title && data.description && data.startDate && data.endDate;
      case 2:
        return data.registrationOpen && data.registrationClose && data.submissionOpen && data.submissionClose;
      case 3:
        return data.tracks.length > 0;
      case 4:
        return true; // Optional content
      case 5:
        return true; // Review step
      default:
        return true;
    }
  };

  const handleSaveDraft = () => {
    toast({
      title: "Draft saved! 💾",
      description: "Your event has been saved as a draft.",
    });
  };

  const handlePublish = () => {
    triggerConfetti();
    toast({
      title: "Event published! 🎉",
      description: "Your hackathon is now live and accepting registrations.",
    });
    
    setTimeout(() => {
      setLocation('/organizer');
    }, 2000);
  };

  if (isPreview) {
    return (
      <div className="min-h-screen bg-cream py-8" data-testid="event-preview">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="font-heading font-bold text-3xl text-text-dark">Event Preview</h1>
            <Button 
              onClick={() => setIsPreview(false)}
              variant="outline" 
              className="border-coral text-coral hover:bg-coral/10"
              data-testid="button-exit-preview"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Editor
            </Button>
          </div>

          <Card className="bg-white rounded-2xl p-8 shadow-soft border border-soft-gray">
            <div className="text-center mb-8">
              <h2 className="font-heading font-bold text-4xl text-text-dark mb-4">{data.title || 'Your Event Title'}</h2>
              <p className="text-text-muted text-lg mb-6">{data.description || 'Your event description will appear here'}</p>
              
              <div className="flex flex-wrap gap-3 justify-center">
                <Badge className="bg-sky text-white px-4 py-2 rounded-full">
                  <Calendar className="w-4 h-4 mr-2" />
                  {data.startDate ? new Date(data.startDate).toLocaleDateString() : 'Start Date'}
                </Badge>
                <Badge className="bg-mint text-text-dark px-4 py-2 rounded-full">
                  <MapPin className="w-4 h-4 mr-2" />
                  {data.location || data.format}
                </Badge>
                <Badge className="bg-coral text-white px-4 py-2 rounded-full">
                  <Trophy className="w-4 h-4 mr-2" />
                  {data.prizes.reduce((sum, prize) => sum + prize.amount, 0) ? `$${data.prizes.reduce((sum, prize) => sum + prize.amount, 0).toLocaleString()} Prize Pool` : 'Prize Pool TBD'}
                </Badge>
              </div>
            </div>

            {data.longDescription && (
              <div className="mb-8">
                <h3 className="font-heading font-semibold text-xl text-text-dark mb-4">About</h3>
                <p className="text-text-muted">{data.longDescription}</p>
              </div>
            )}

            {data.tracks.length > 0 && (
              <div className="mb-8">
                <h3 className="font-heading font-semibold text-xl text-text-dark mb-4">Tracks</h3>
                <div className="flex flex-wrap gap-3">
                  {data.tracks.map(track => (
                    <Badge key={track} className="bg-mint/20 text-mint px-3 py-2 rounded-lg border-0">
                      {track}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {data.prizes.length > 0 && (
              <div className="mb-8">
                <h3 className="font-heading font-semibold text-xl text-text-dark mb-4">Prizes</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data.prizes.map((prize, index) => (
                    <div key={index} className="bg-soft-gray/30 rounded-xl p-4">
                      <h4 className="font-semibold text-text-dark">{prize.title || `Prize ${index + 1}`}</h4>
                      <p className="text-coral font-bold">${prize.amount.toLocaleString()}</p>
                      {prize.description && <p className="text-text-muted text-sm">{prize.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream py-8" data-testid="create-event-page">
      <Confetti />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-heading font-bold text-4xl text-text-dark mb-2">Create New Event</h1>
            <p className="text-text-muted">Set up your hackathon with our step-by-step wizard</p>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={() => setIsPreview(true)}
              variant="outline" 
              className="border-sky text-sky hover:bg-sky/10 rounded-full px-6"
              data-testid="button-preview"
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button 
              onClick={handleSaveDraft}
              variant="outline" 
              className="border-mint text-mint hover:bg-mint/10 rounded-full px-6"
              data-testid="button-save-draft"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Draft
            </Button>
          </div>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-4 mb-8">
          <span className="text-sm text-text-muted">Step {step} of {totalSteps}</span>
          <Progress value={progress} className="flex-1 h-2" />
          <span className="text-sm text-text-muted">{Math.round(progress)}%</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <Card className="bg-white rounded-2xl p-8 shadow-soft border border-soft-gray">
              {/* Step 1: Basic Info */}
              {step === 1 && (
                <div>
                  <div className="text-center mb-8">
                    <h2 className="font-heading font-bold text-2xl text-text-dark mb-2">Basic Information</h2>
                    <CrayonSquiggle className="mx-auto mb-4" />
                    <p className="text-text-muted">Let's start with the essentials</p>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-text-dark mb-2">Event Title *</label>
                      <Input
                        value={data.title}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        placeholder="AI for Good Challenge"
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
                        onChange={(e) => setData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="A brief description that will appear on event cards..."
                        rows={3}
                        className="border-soft-gray focus:ring-2 focus:ring-coral focus:border-transparent"
                        data-testid="textarea-description"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-text-dark mb-2">Start Date *</label>
                        <Input
                          type="datetime-local"
                          value={data.startDate}
                          onChange={(e) => setData(prev => ({ ...prev, startDate: e.target.value }))}
                          className="border-soft-gray focus:ring-2 focus:ring-coral focus:border-transparent"
                          data-testid="input-start-date"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-dark mb-2">End Date *</label>
                        <Input
                          type="datetime-local"
                          value={data.endDate}
                          onChange={(e) => setData(prev => ({ ...prev, endDate: e.target.value }))}
                          className="border-soft-gray focus:ring-2 focus:ring-coral focus:border-transparent"
                          data-testid="input-end-date"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-text-dark mb-2">Format</label>
                        <Select value={data.format} onValueChange={(value: any) => setData(prev => ({ ...prev, format: value }))}>
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
                          onChange={(e) => setData(prev => ({ ...prev, location: e.target.value }))}
                          placeholder={data.format === 'online' ? 'Virtual' : 'City, Country'}
                          className="border-soft-gray focus:ring-2 focus:ring-coral focus:border-transparent"
                          data-testid="input-location"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Timing */}
              {step === 2 && (
                <div>
                  <div className="text-center mb-8">
                    <h2 className="font-heading font-bold text-2xl text-text-dark mb-2">Event Timeline</h2>
                    <CrayonSquiggle className="mx-auto mb-4" />
                    <p className="text-text-muted">Set up registration and submission windows</p>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-text-dark mb-2">Registration Opens *</label>
                        <Input
                          type="datetime-local"
                          value={data.registrationOpen}
                          onChange={(e) => setData(prev => ({ ...prev, registrationOpen: e.target.value }))}
                          className="border-soft-gray focus:ring-2 focus:ring-coral focus:border-transparent"
                          data-testid="input-registration-open"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-dark mb-2">Registration Closes *</label>
                        <Input
                          type="datetime-local"
                          value={data.registrationClose}
                          onChange={(e) => setData(prev => ({ ...prev, registrationClose: e.target.value }))}
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
                          onChange={(e) => setData(prev => ({ ...prev, submissionOpen: e.target.value }))}
                          className="border-soft-gray focus:ring-2 focus:ring-coral focus:border-transparent"
                          data-testid="input-submission-open"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-dark mb-2">Submissions Close *</label>
                        <Input
                          type="datetime-local"
                          value={data.submissionClose}
                          onChange={(e) => setData(prev => ({ ...prev, submissionClose: e.target.value }))}
                          className="border-soft-gray focus:ring-2 focus:ring-coral focus:border-transparent"
                          data-testid="input-submission-close"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-dark mb-2">Max Team Size</label>
                      <Select value={data.maxTeamSize.toString()} onValueChange={(value) => setData(prev => ({ ...prev, maxTeamSize: parseInt(value) }))}>
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
                </div>
              )}

              {/* Step 3: Tracks & Tags */}
              {step === 3 && (
                <div>
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
                            className={`cursor-pointer transition-colors p-2 rounded-full border-0 text-center ${
                              data.tags.includes(tag)
                                ? 'bg-sky text-white'
                                : 'bg-soft-gray text-text-dark hover:bg-soft-gray/80'
                            }`}
                            data-testid={`tag-${tag.toLowerCase()}`}
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {data.tags.map(tag => (
                          <Badge key={tag} className="bg-sky text-white px-3 py-1 rounded-full border-0 flex items-center gap-2">
                            {tag}
                            <X className="w-3 h-3 cursor-pointer" onClick={() => removeTag(tag)} />
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Content */}
              {step === 4 && (
                <div>
                  <div className="text-center mb-8">
                    <h2 className="font-heading font-bold text-2xl text-text-dark mb-2">Event Content</h2>
                    <CrayonSquiggle className="mx-auto mb-4" />
                    <p className="text-text-muted">Add detailed information, prizes, and rules</p>
                  </div>

                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-4 bg-soft-gray rounded-xl p-1 mb-6">
                      <TabsTrigger value="basic" className="rounded-lg" data-testid="tab-basic">Details</TabsTrigger>
                      <TabsTrigger value="prizes" className="rounded-lg" data-testid="tab-prizes">Prizes</TabsTrigger>
                      <TabsTrigger value="rules" className="rounded-lg" data-testid="tab-rules">Rules</TabsTrigger>
                      <TabsTrigger value="timeline" className="rounded-lg" data-testid="tab-timeline">Timeline</TabsTrigger>
                    </TabsList>

                    <TabsContent value="basic">
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-text-dark mb-2">Long Description</label>
                          <Textarea
                            value={data.longDescription}
                            onChange={(e) => setData(prev => ({ ...prev, longDescription: e.target.value }))}
                            placeholder="Detailed description of your hackathon, including goals, expectations, and what participants will learn..."
                            rows={6}
                            className="border-soft-gray focus:ring-2 focus:ring-coral focus:border-transparent"
                            data-testid="textarea-long-description"
                          />
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="prizes">
                      <div className="space-y-6">
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium text-text-dark">Prize Structure</h3>
                          <Button onClick={addPrize} size="sm" className="bg-coral text-white hover:bg-coral/80" data-testid="button-add-prize">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Prize
                          </Button>
                        </div>
                        
                        <div className="space-y-4">
                          {data.prizes.map((prize, index) => (
                            <div key={index} className="p-4 bg-soft-gray/30 rounded-xl">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <Input
                                  value={prize.title}
                                  onChange={(e) => updatePrize(index, { title: e.target.value })}
                                  placeholder="Prize title"
                                  data-testid={`input-prize-title-${index}`}
                                />
                                <Input
                                  type="number"
                                  value={prize.amount}
                                  onChange={(e) => updatePrize(index, { amount: parseInt(e.target.value) || 0 })}
                                  placeholder="Amount ($)"
                                  data-testid={`input-prize-amount-${index}`}
                                />
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => removePrize(index)}
                                  className="border-error text-error hover:bg-error/10"
                                  data-testid={`button-remove-prize-${index}`}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                              <Textarea
                                value={prize.description}
                                onChange={(e) => updatePrize(index, { description: e.target.value })}
                                placeholder="Prize description (optional)"
                                rows={2}
                                data-testid={`textarea-prize-description-${index}`}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="rules">
                      <div className="space-y-6">
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium text-text-dark">Competition Rules</h3>
                          <Button onClick={addRule} size="sm" className="bg-mint text-text-dark hover:bg-mint/80" data-testid="button-add-rule">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Rule
                          </Button>
                        </div>
                        
                        <div className="space-y-3">
                          {data.rules.map((rule, index) => (
                            <div key={index} className="flex gap-3">
                              <Input
                                value={rule}
                                onChange={(e) => updateRule(index, e.target.value)}
                                placeholder="Enter a rule..."
                                className="flex-1"
                                data-testid={`input-rule-${index}`}
                              />
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => removeRule(index)}
                                className="border-error text-error hover:bg-error/10"
                                data-testid={`button-remove-rule-${index}`}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="timeline">
                      <div className="space-y-6">
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium text-text-dark">Event Timeline</h3>
                          <Button onClick={addTimelineItem} size="sm" className="bg-sky text-white hover:bg-sky/80" data-testid="button-add-timeline">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Item
                          </Button>
                        </div>
                        
                        <div className="space-y-4">
                          {data.timeline.map((item, index) => (
                            <div key={index} className="p-4 bg-soft-gray/30 rounded-xl">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <Input
                                  value={item.time}
                                  onChange={(e) => updateTimelineItem(index, { time: e.target.value })}
                                  placeholder="Time (e.g., Dec 15, 10:00 AM)"
                                  data-testid={`input-timeline-time-${index}`}
                                />
                                <Input
                                  value={item.title}
                                  onChange={(e) => updateTimelineItem(index, { title: e.target.value })}
                                  placeholder="Event title"
                                  data-testid={`input-timeline-title-${index}`}
                                />
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => removeTimelineItem(index)}
                                  className="border-error text-error hover:bg-error/10"
                                  data-testid={`button-remove-timeline-${index}`}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                              <Textarea
                                value={item.description}
                                onChange={(e) => updateTimelineItem(index, { description: e.target.value })}
                                placeholder="Description"
                                rows={2}
                                data-testid={`textarea-timeline-description-${index}`}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              )}

              {/* Step 5: Review */}
              {step === 5 && (
                <div>
                  <div className="text-center mb-8">
                    <h2 className="font-heading font-bold text-2xl text-text-dark mb-2">Review & Publish</h2>
                    <CrayonSquiggle className="mx-auto mb-4" />
                    <p className="text-text-muted">Review your event and make it live</p>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-soft-gray/30 rounded-xl p-6">
                      <h3 className="font-heading font-semibold text-xl text-text-dark mb-4">{data.title}</h3>
                      <p className="text-text-muted mb-4">{data.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-text-muted">Start:</span>
                          <span className="ml-2 font-medium">{data.startDate ? new Date(data.startDate).toLocaleString() : 'Not set'}</span>
                        </div>
                        <div>
                          <span className="text-text-muted">End:</span>
                          <span className="ml-2 font-medium">{data.endDate ? new Date(data.endDate).toLocaleString() : 'Not set'}</span>
                        </div>
                        <div>
                          <span className="text-text-muted">Format:</span>
                          <span className="ml-2 font-medium">{data.format}</span>
                        </div>
                        <div>
                          <span className="text-text-muted">Location:</span>
                          <span className="ml-2 font-medium">{data.location || 'Not set'}</span>
                        </div>
                        <div>
                          <span className="text-text-muted">Tracks:</span>
                          <span className="ml-2 font-medium">{data.tracks.length}</span>
                        </div>
                        <div>
                          <span className="text-text-muted">Prizes:</span>
                          <span className="ml-2 font-medium">${data.prizes.reduce((sum, prize) => sum + prize.amount, 0).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-sky/10 rounded-xl border border-sky/20">
                      <div>
                        <h4 className="font-medium text-text-dark">Make Event Public</h4>
                        <p className="text-text-muted text-sm">When enabled, your event will be visible to everyone and open for registration</p>
                      </div>
                      <Switch
                        checked={data.isPublic}
                        onCheckedChange={(checked) => setData(prev => ({ ...prev, isPublic: checked }))}
                        data-testid="switch-public"
                      />
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Progress Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-white rounded-2xl p-6 shadow-soft border border-soft-gray sticky top-8">
              <h3 className="font-heading font-semibold text-lg text-text-dark mb-6">Progress</h3>
              
              <div className="space-y-4">
                {[
                  { step: 1, title: 'Basic Info', completed: step > 1 || isStepValid() },
                  { step: 2, title: 'Timeline', completed: step > 2 },
                  { step: 3, title: 'Tracks & Tags', completed: step > 3 },
                  { step: 4, title: 'Content', completed: step > 4 },
                  { step: 5, title: 'Review', completed: false }
                ].map((item) => (
                  <div key={item.step} className={`flex items-center gap-3 ${step === item.step ? 'text-coral' : item.completed ? 'text-success' : 'text-text-muted'}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                      step === item.step ? 'bg-coral text-white' :
                      item.completed ? 'bg-success text-white' :
                      'bg-soft-gray text-text-muted'
                    }`}>
                      {item.completed ? '✓' : item.step}
                    </div>
                    <span className="font-medium">{item.title}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-soft-gray">
                <div className="text-sm text-text-muted mb-2">Total Prize Pool</div>
                <div className="text-2xl font-bold text-coral">
                  ${data.prizes.reduce((sum, prize) => sum + prize.amount, 0).toLocaleString()}
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          {step > 1 && (
            <Button
              variant="outline"
              onClick={() => setStep(step - 1)}
              className="border-soft-gray text-text-dark hover:bg-soft-gray/50 rounded-full px-6"
              data-testid="button-back"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          )}
          
          <div className="flex-1" />
          
          {step < totalSteps ? (
            <Button
              onClick={() => setStep(step + 1)}
              disabled={!isStepValid()}
              className="bg-coral text-white hover:bg-coral/80 rounded-full px-6"
              data-testid="button-next"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handlePublish}
              disabled={!data.isPublic}
              className="bg-coral text-white hover:bg-coral/80 rounded-full px-8"
              data-testid="button-publish"
            >
              <Rocket className="w-4 h-4 mr-2" />
              Publish Event 🎉
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
