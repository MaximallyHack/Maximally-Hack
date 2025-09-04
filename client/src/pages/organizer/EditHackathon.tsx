import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  ChevronDown, 
  Plus, 
  X, 
  Calendar, 
  MapPin, 
  Link2, 
  Users, 
  Scale, 
  Clock, 
  Trophy, 
  Camera, 
  Phone, 
  Search, 
  FileText,
  Instagram,
  Youtube,
  Linkedin,
  Twitter,
  Facebook,
  Github,
  MessageCircle,
  Settings
} from "lucide-react";
import { CrayonSquiggle } from "@/components/ui/floating-elements";

const editHackathonSchema = z.object({
  // Basic Info
  title: z.string().min(1, "Title is required"),
  tagline: z.string().max(100, "Tagline must be under 100 characters"),
  shortDescription: z.string().max(300, "Short description must be under 300 characters"),
  fullDescription: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  mode: z.enum(["online", "offline", "hybrid"]),
  location: z.string().optional(),
  
  // Extra Links
  links: z.object({
    website: z.string().url().optional().or(z.literal("")),
    registration: z.string().url().optional().or(z.literal("")),
    devpost: z.string().url().optional().or(z.literal("")),
    infoDeck: z.string().url().optional().or(z.literal("")),
    faq: z.string().url().optional().or(z.literal("")),
    rules: z.string().url().optional().or(z.literal("")),
    sponsorDeck: z.string().url().optional().or(z.literal("")),
    volunteerSignup: z.string().url().optional().or(z.literal("")),
    mentorSignup: z.string().url().optional().or(z.literal("")),
    pressKit: z.string().url().optional().or(z.literal(""))
  }),
  
  // Social Media
  social: z.object({
    instagram: z.string().optional(),
    youtube: z.string().optional(),
    linkedin: z.string().optional(),
    twitter: z.string().optional(),
    facebook: z.string().optional(),
    github: z.string().optional(),
    blog: z.string().optional()
  }),
  
  // Community
  community: z.object({
    discord: z.string().optional(),
    whatsapp: z.string().optional(),
    telegram: z.string().optional(),
    forum: z.string().optional()
  }),
  
  // Team & Rules
  teamSizeMin: z.number().min(1),
  teamSizeMax: z.number().min(1),
  ageRestriction: z.number().optional(),
  eligibilityNote: z.string().optional(),
  codeOfConduct: z.string().url().optional().or(z.literal("")),
  
  // Judging
  showJudgesPublicly: z.boolean(),
  
  // Contact
  organizerName: z.string().min(1),
  contactEmail: z.string().email(),
  supportEmail: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  
  // SEO
  metaTitle: z.string().max(60).optional(),
  metaDescription: z.string().max(160).optional()
});

type EditHackathonForm = z.infer<typeof editHackathonSchema>;

interface Criterion {
  id: string;
  name: string;
  weight: number;
  description: string;
}

interface Judge {
  id: string;
  name: string;
  title: string;
  organization: string;
  avatar?: string;
  link?: string;
}

interface Milestone {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  description?: string;
}

interface Prize {
  id: string;
  title: string;
  amount: string;
  description: string;
}

interface CustomNote {
  id: string;
  title: string;
  content: string;
}

export default function EditHackathon() {
  const [openSections, setOpenSections] = useState<string[]>(["basic"]);
  const [criteria, setCriteria] = useState<Criterion[]>([]);
  const [judges, setJudges] = useState<Judge[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [customNotes, setCustomNotes] = useState<CustomNote[]>([]);

  const form = useForm<EditHackathonForm>({
    resolver: zodResolver(editHackathonSchema),
    defaultValues: {
      title: "",
      tagline: "",
      shortDescription: "",
      fullDescription: "",
      startDate: "",
      endDate: "",
      mode: "online",
      location: "",
      links: {
        website: "",
        registration: "",
        devpost: "",
        infoDeck: "",
        faq: "",
        rules: "",
        sponsorDeck: "",
        volunteerSignup: "",
        mentorSignup: "",
        pressKit: ""
      },
      social: {
        instagram: "",
        youtube: "",
        linkedin: "",
        twitter: "",
        facebook: "",
        github: "",
        blog: ""
      },
      community: {
        discord: "",
        whatsapp: "",
        telegram: "",
        forum: ""
      },
      teamSizeMin: 1,
      teamSizeMax: 4,
      ageRestriction: undefined,
      eligibilityNote: "",
      codeOfConduct: "",
      showJudgesPublicly: true,
      organizerName: "",
      contactEmail: "",
      supportEmail: "",
      phone: "",
      metaTitle: "",
      metaDescription: ""
    }
  });

  const toggleSection = (section: string) => {
    setOpenSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const addCriterion = () => {
    const newCriterion: Criterion = {
      id: Date.now().toString(),
      name: "",
      weight: 10,
      description: ""
    };
    setCriteria([...criteria, newCriterion]);
  };

  const removeCriterion = (id: string) => {
    setCriteria(criteria.filter(c => c.id !== id));
  };

  const addJudge = () => {
    const newJudge: Judge = {
      id: Date.now().toString(),
      name: "",
      title: "",
      organization: "",
      avatar: "",
      link: ""
    };
    setJudges([...judges, newJudge]);
  };

  const removeJudge = (id: string) => {
    setJudges(judges.filter(j => j.id !== id));
  };

  const addMilestone = () => {
    const newMilestone: Milestone = {
      id: Date.now().toString(),
      title: "",
      startDate: "",
      endDate: "",
      description: ""
    };
    setMilestones([...milestones, newMilestone]);
  };

  const removeMilestone = (id: string) => {
    setMilestones(milestones.filter(m => m.id !== id));
  };

  const addPrize = () => {
    const newPrize: Prize = {
      id: Date.now().toString(),
      title: "",
      amount: "",
      description: ""
    };
    setPrizes([...prizes, newPrize]);
  };

  const removePrize = (id: string) => {
    setPrizes(prizes.filter(p => p.id !== id));
  };

  const addCustomNote = () => {
    const newNote: CustomNote = {
      id: Date.now().toString(),
      title: "",
      content: ""
    };
    setCustomNotes([...customNotes, newNote]);
  };

  const removeCustomNote = (id: string) => {
    setCustomNotes(customNotes.filter(n => n.id !== id));
  };

  const onSubmit = (data: EditHackathonForm, isDraft: boolean = false) => {
    console.log("Form data:", data);
    console.log("Additional data:", { criteria, judges, milestones, prizes, customNotes });
    console.log("Is draft:", isDraft);
    // Here you would typically send the data to your API
  };

  const socialPlatforms = [
    { key: "instagram", icon: Instagram, label: "Instagram", placeholder: "https://instagram.com/yourhandle" },
    { key: "youtube", icon: Youtube, label: "YouTube", placeholder: "https://youtube.com/c/yourchannel" },
    { key: "linkedin", icon: Linkedin, label: "LinkedIn", placeholder: "https://linkedin.com/company/yourcompany" },
    { key: "twitter", icon: Twitter, label: "Twitter/X", placeholder: "https://twitter.com/yourhandle" },
    { key: "facebook", icon: Facebook, label: "Facebook", placeholder: "https://facebook.com/yourpage" },
    { key: "github", icon: Github, label: "GitHub", placeholder: "https://github.com/yourorg" },
    { key: "blog", icon: FileText, label: "Blog/Medium", placeholder: "https://yourblog.com" }
  ];

  const SectionHeader = ({ 
    id, 
    icon: Icon, 
    title, 
    description 
  }: { 
    id: string; 
    icon: any; 
    title: string; 
    description: string; 
  }) => (
    <CollapsibleTrigger 
      onClick={() => toggleSection(id)}
      className="flex items-center justify-between w-full p-4 hover:bg-cream/50 rounded-lg transition-colors"
      data-testid={`section-${id}`}
    >
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 text-coral" />
        <div className="text-left">
          <h3 className="font-heading font-bold text-lg text-text-dark">{title}</h3>
          <p className="text-sm text-text-muted">{description}</p>
        </div>
      </div>
      <ChevronDown 
        className={`w-5 h-5 text-text-muted transition-transform ${
          openSections.includes(id) ? "rotate-180" : ""
        }`} 
      />
    </CollapsibleTrigger>
  );

  return (
    <div className="min-h-screen bg-cream py-8" data-testid="edit-hackathon-page">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="relative">
            <CrayonSquiggle className="absolute -top-4 -right-4 w-8 h-8 text-yellow opacity-60" />
            <h1 className="font-heading font-bold text-4xl text-text-dark mb-2">
              Edit Hackathon
            </h1>
            <p className="text-lg text-text-muted max-w-2xl mx-auto">
              Configure every aspect of your hackathon with our comprehensive editing tools
            </p>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit((data) => onSubmit(data, false))}>
            <div className="space-y-4">

              {/* 1. Basic Info */}
              <Card className="bg-white rounded-2xl shadow-soft border border-soft-gray overflow-hidden">
                <Collapsible open={openSections.includes("basic")}>
                  <SectionHeader 
                    id="basic"
                    icon={Settings}
                    title="Basic Information"
                    description="Core details about your hackathon"
                  />
                  <CollapsibleContent>
                    <CardContent className="p-6 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem className="md:col-span-2">
                              <FormLabel>Hackathon Title *</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="e.g., AI for Good Hackathon 2024" 
                                  {...field} 
                                  data-testid="input-title"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="tagline"
                          render={({ field }) => (
                            <FormItem className="md:col-span-2">
                              <FormLabel>Tagline</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="e.g., Building the future with AI" 
                                  {...field} 
                                  data-testid="input-tagline"
                                />
                              </FormControl>
                              <FormDescription>
                                A catchy one-liner (max 100 characters)
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="shortDescription"
                          render={({ field }) => (
                            <FormItem className="md:col-span-2">
                              <FormLabel>Short Description</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Brief overview of your hackathon for cards and previews..."
                                  className="min-h-[100px]"
                                  {...field} 
                                  data-testid="textarea-short-description"
                                />
                              </FormControl>
                              <FormDescription>
                                Used in cards and previews (max 300 characters)
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="fullDescription"
                          render={({ field }) => (
                            <FormItem className="md:col-span-2">
                              <FormLabel>Full Description</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Detailed description of your hackathon, including theme, goals, activities..."
                                  className="min-h-[200px]"
                                  {...field} 
                                  data-testid="textarea-full-description"
                                />
                              </FormControl>
                              <FormDescription>
                                Complete details shown on the event page
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="startDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Start Date & Time *</FormLabel>
                              <FormControl>
                                <Input 
                                  type="datetime-local" 
                                  {...field} 
                                  data-testid="input-start-date"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="endDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>End Date & Time *</FormLabel>
                              <FormControl>
                                <Input 
                                  type="datetime-local" 
                                  {...field} 
                                  data-testid="input-end-date"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="mode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Event Mode *</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger data-testid="select-mode">
                                    <SelectValue placeholder="Select mode" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="online">🌐 Online</SelectItem>
                                  <SelectItem value="offline">📍 In-Person</SelectItem>
                                  <SelectItem value="hybrid">🔄 Hybrid</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {(form.watch("mode") === "offline" || form.watch("mode") === "hybrid") && (
                          <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Location</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="e.g., Tech Hub, San Francisco, CA" 
                                    {...field} 
                                    data-testid="input-location"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>

              {/* 2. Extra Links */}
              <Card className="bg-white rounded-2xl shadow-soft border border-soft-gray overflow-hidden">
                <Collapsible open={openSections.includes("links")}>
                  <SectionHeader 
                    id="links"
                    icon={Link2}
                    title="Extra Links"
                    description="Important URLs for your hackathon"
                  />
                  <CollapsibleContent>
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          { key: "website", label: "Official Website", placeholder: "https://yourhackathon.com" },
                          { key: "registration", label: "Registration Page", placeholder: "https://register.yourhackathon.com" },
                          { key: "devpost", label: "Devpost Page", placeholder: "https://yourhackathon.devpost.com" },
                          { key: "infoDeck", label: "Info Deck / Docs", placeholder: "https://docs.google.com/..." },
                          { key: "faq", label: "FAQ Link", placeholder: "https://yourhackathon.com/faq" },
                          { key: "rules", label: "Rules/Guidelines PDF", placeholder: "https://yourhackathon.com/rules.pdf" },
                          { key: "sponsorDeck", label: "Sponsor Deck", placeholder: "https://sponsor.yourhackathon.com" },
                          { key: "volunteerSignup", label: "Volunteer Sign-up", placeholder: "https://volunteer.yourhackathon.com" },
                          { key: "mentorSignup", label: "Mentor Sign-up", placeholder: "https://mentor.yourhackathon.com" },
                          { key: "pressKit", label: "Press Kit", placeholder: "https://press.yourhackathon.com" }
                        ].map(({ key, label, placeholder }) => (
                          <FormField
                            key={key}
                            control={form.control}
                            name={`links.${key}` as any}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{label}</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder={placeholder} 
                                    {...field} 
                                    data-testid={`input-link-${key}`}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>

              {/* 3. Social Media */}
              <Card className="bg-white rounded-2xl shadow-soft border border-soft-gray overflow-hidden">
                <Collapsible open={openSections.includes("social")}>
                  <SectionHeader 
                    id="social"
                    icon={MessageCircle}
                    title="Social Media"
                    description="Connect your social media accounts"
                  />
                  <CollapsibleContent>
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {socialPlatforms.map(({ key, icon: Icon, label, placeholder }) => (
                          <FormField
                            key={key}
                            control={form.control}
                            name={`social.${key}` as any}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                  <Icon className="w-4 h-4" />
                                  {label}
                                </FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder={placeholder} 
                                    {...field} 
                                    data-testid={`input-social-${key}`}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>

              {/* 4. Community */}
              <Card className="bg-white rounded-2xl shadow-soft border border-soft-gray overflow-hidden">
                <Collapsible open={openSections.includes("community")}>
                  <SectionHeader 
                    id="community"
                    icon={Users}
                    title="Community"
                    description="Chat platforms and community spaces"
                  />
                  <CollapsibleContent>
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          { key: "discord", label: "Discord Invite", placeholder: "https://discord.gg/..." },
                          { key: "whatsapp", label: "WhatsApp Group", placeholder: "https://chat.whatsapp.com/..." },
                          { key: "telegram", label: "Telegram Channel", placeholder: "https://t.me/..." },
                          { key: "forum", label: "Community Forum", placeholder: "https://forum.yourhackathon.com" }
                        ].map(({ key, label, placeholder }) => (
                          <FormField
                            key={key}
                            control={form.control}
                            name={`community.${key}` as any}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{label}</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder={placeholder} 
                                    {...field} 
                                    data-testid={`input-community-${key}`}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>

              {/* 5. Team & Rules */}
              <Card className="bg-white rounded-2xl shadow-soft border border-soft-gray overflow-hidden">
                <Collapsible open={openSections.includes("team-rules")}>
                  <SectionHeader 
                    id="team-rules"
                    icon={Users}
                    title="Team & Rules"
                    description="Team size limits and eligibility requirements"
                  />
                  <CollapsibleContent>
                    <CardContent className="p-6 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="teamSizeMin"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Min Team Size *</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  min="1" 
                                  {...field} 
                                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                                  data-testid="input-team-size-min"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="teamSizeMax"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Max Team Size *</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  min="1" 
                                  {...field} 
                                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                                  data-testid="input-team-size-max"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="ageRestriction"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Age Restriction (optional)</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  placeholder="e.g., 18"
                                  {...field} 
                                  onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                                  data-testid="input-age-restriction"
                                />
                              </FormControl>
                              <FormDescription>
                                Minimum age required to participate
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="codeOfConduct"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Code of Conduct</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="https://yourhackathon.com/code-of-conduct" 
                                  {...field} 
                                  data-testid="input-code-of-conduct"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="eligibilityNote"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Eligibility Note</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Any specific eligibility requirements or restrictions..."
                                className="min-h-[100px]"
                                {...field} 
                                data-testid="textarea-eligibility-note"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>

              {/* 6. Judging & Jury */}
              <Card className="bg-white rounded-2xl shadow-soft border border-soft-gray overflow-hidden">
                <Collapsible open={openSections.includes("judging")}>
                  <SectionHeader 
                    id="judging"
                    icon={Scale}
                    title="Judging & Jury Board"
                    description="Set judging criteria and manage jury members"
                  />
                  <CollapsibleContent>
                    <CardContent className="p-6 space-y-6">
                      <FormField
                        control={form.control}
                        name="showJudgesPublicly"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Show Jury Board Publicly</FormLabel>
                              <FormDescription>
                                Display jury member profiles on your event page
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                data-testid="switch-show-judges"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      {/* Judging Criteria */}
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-heading font-bold text-lg text-text-dark">Judging Criteria</h4>
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm" 
                            onClick={addCriterion}
                            data-testid="button-add-criterion"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Criterion
                          </Button>
                        </div>
                        <div className="space-y-4">
                          {criteria.map((criterion) => (
                            <Card key={criterion.id} className="p-4">
                              <div className="flex items-start gap-4">
                                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                                  <Input
                                    placeholder="Criterion name"
                                    value={criterion.name}
                                    onChange={(e) => setCriteria(criteria.map(c => 
                                      c.id === criterion.id ? { ...c, name: e.target.value } : c
                                    ))}
                                    data-testid={`input-criterion-name-${criterion.id}`}
                                  />
                                  <Input
                                    type="number"
                                    placeholder="Weight %"
                                    value={criterion.weight}
                                    onChange={(e) => setCriteria(criteria.map(c => 
                                      c.id === criterion.id ? { ...c, weight: parseInt(e.target.value) || 0 } : c
                                    ))}
                                    data-testid={`input-criterion-weight-${criterion.id}`}
                                  />
                                  <Input
                                    placeholder="Description"
                                    value={criterion.description}
                                    onChange={(e) => setCriteria(criteria.map(c => 
                                      c.id === criterion.id ? { ...c, description: e.target.value } : c
                                    ))}
                                    data-testid={`input-criterion-description-${criterion.id}`}
                                  />
                                </div>
                                <Button 
                                  type="button" 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => removeCriterion(criterion.id)}
                                  data-testid={`button-remove-criterion-${criterion.id}`}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            </Card>
                          ))}
                          {criteria.length === 0 && (
                            <p className="text-text-muted text-center py-8">
                              No judging criteria added yet. Click "Add Criterion" to get started.
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Jury Members */}
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-heading font-bold text-lg text-text-dark">Jury Board Members</h4>
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm" 
                            onClick={addJudge}
                            data-testid="button-add-judge"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Jury Member
                          </Button>
                        </div>
                        <div className="space-y-4">
                          {judges.map((judge) => (
                            <Card key={judge.id} className="p-4">
                              <div className="flex items-start gap-4">
                                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <Input
                                    placeholder="Judge name"
                                    value={judge.name}
                                    onChange={(e) => setJudges(judges.map(j => 
                                      j.id === judge.id ? { ...j, name: e.target.value } : j
                                    ))}
                                    data-testid={`input-judge-name-${judge.id}`}
                                  />
                                  <Input
                                    placeholder="Title"
                                    value={judge.title}
                                    onChange={(e) => setJudges(judges.map(j => 
                                      j.id === judge.id ? { ...j, title: e.target.value } : j
                                    ))}
                                    data-testid={`input-judge-title-${judge.id}`}
                                  />
                                  <Input
                                    placeholder="Organization"
                                    value={judge.organization}
                                    onChange={(e) => setJudges(judges.map(j => 
                                      j.id === judge.id ? { ...j, organization: e.target.value } : j
                                    ))}
                                    data-testid={`input-judge-organization-${judge.id}`}
                                  />
                                  <Input
                                    placeholder="Profile link (optional)"
                                    value={judge.link}
                                    onChange={(e) => setJudges(judges.map(j => 
                                      j.id === judge.id ? { ...j, link: e.target.value } : j
                                    ))}
                                    data-testid={`input-judge-link-${judge.id}`}
                                  />
                                </div>
                                <Button 
                                  type="button" 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => removeJudge(judge.id)}
                                  data-testid={`button-remove-judge-${judge.id}`}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            </Card>
                          ))}
                          {judges.length === 0 && (
                            <p className="text-text-muted text-center py-8">
                              No jury members added yet. Click "Add Jury Member" to get started.
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>

              {/* 7. Schedule */}
              <Card className="bg-white rounded-2xl shadow-soft border border-soft-gray overflow-hidden">
                <Collapsible open={openSections.includes("schedule")}>
                  <SectionHeader 
                    id="schedule"
                    icon={Clock}
                    title="Schedule"
                    description="Timeline and key milestones"
                  />
                  <CollapsibleContent>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-heading font-bold text-lg text-text-dark">Timeline Milestones</h4>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm" 
                          onClick={addMilestone}
                          data-testid="button-add-milestone"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Milestone
                        </Button>
                      </div>
                      <div className="space-y-4">
                        {milestones.map((milestone) => (
                          <Card key={milestone.id} className="p-4">
                            <div className="flex items-start gap-4">
                              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Input
                                  placeholder="Milestone title"
                                  value={milestone.title}
                                  onChange={(e) => setMilestones(milestones.map(m => 
                                    m.id === milestone.id ? { ...m, title: e.target.value } : m
                                  ))}
                                  data-testid={`input-milestone-title-${milestone.id}`}
                                />
                                <Input
                                  type="datetime-local"
                                  placeholder="Start date"
                                  value={milestone.startDate}
                                  onChange={(e) => setMilestones(milestones.map(m => 
                                    m.id === milestone.id ? { ...m, startDate: e.target.value } : m
                                  ))}
                                  data-testid={`input-milestone-start-${milestone.id}`}
                                />
                                <Input
                                  type="datetime-local"
                                  placeholder="End date"
                                  value={milestone.endDate}
                                  onChange={(e) => setMilestones(milestones.map(m => 
                                    m.id === milestone.id ? { ...m, endDate: e.target.value } : m
                                  ))}
                                  data-testid={`input-milestone-end-${milestone.id}`}
                                />
                                <Input
                                  placeholder="Description (optional)"
                                  value={milestone.description}
                                  onChange={(e) => setMilestones(milestones.map(m => 
                                    m.id === milestone.id ? { ...m, description: e.target.value } : m
                                  ))}
                                  className="md:col-span-2"
                                  data-testid={`input-milestone-description-${milestone.id}`}
                                />
                              </div>
                              <Button 
                                type="button" 
                                variant="outline" 
                                size="sm" 
                                onClick={() => removeMilestone(milestone.id)}
                                data-testid={`button-remove-milestone-${milestone.id}`}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          </Card>
                        ))}
                        {milestones.length === 0 && (
                          <p className="text-text-muted text-center py-8">
                            No milestones added yet. Click "Add Milestone" to create your timeline.
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>

              {/* 8. Prizes */}
              <Card className="bg-white rounded-2xl shadow-soft border border-soft-gray overflow-hidden">
                <Collapsible open={openSections.includes("prizes")}>
                  <SectionHeader 
                    id="prizes"
                    icon={Trophy}
                    title="Prizes"
                    description="Awards and recognition for winners"
                  />
                  <CollapsibleContent>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-heading font-bold text-lg text-text-dark">Prize Categories</h4>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm" 
                          onClick={addPrize}
                          data-testid="button-add-prize"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Prize
                        </Button>
                      </div>
                      <div className="space-y-4">
                        {prizes.map((prize) => (
                          <Card key={prize.id} className="p-4">
                            <div className="flex items-start gap-4">
                              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Input
                                  placeholder="Prize title"
                                  value={prize.title}
                                  onChange={(e) => setPrizes(prizes.map(p => 
                                    p.id === prize.id ? { ...p, title: e.target.value } : p
                                  ))}
                                  data-testid={`input-prize-title-${prize.id}`}
                                />
                                <Input
                                  placeholder="Amount (e.g., $5000)"
                                  value={prize.amount}
                                  onChange={(e) => setPrizes(prizes.map(p => 
                                    p.id === prize.id ? { ...p, amount: e.target.value } : p
                                  ))}
                                  data-testid={`input-prize-amount-${prize.id}`}
                                />
                                <Input
                                  placeholder="Description"
                                  value={prize.description}
                                  onChange={(e) => setPrizes(prizes.map(p => 
                                    p.id === prize.id ? { ...p, description: e.target.value } : p
                                  ))}
                                  data-testid={`input-prize-description-${prize.id}`}
                                />
                              </div>
                              <Button 
                                type="button" 
                                variant="outline" 
                                size="sm" 
                                onClick={() => removePrize(prize.id)}
                                data-testid={`button-remove-prize-${prize.id}`}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          </Card>
                        ))}
                        {prizes.length === 0 && (
                          <p className="text-text-muted text-center py-8">
                            No prizes added yet. Click "Add Prize" to set up your awards.
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>

              {/* 9. Media */}
              <Card className="bg-white rounded-2xl shadow-soft border border-soft-gray overflow-hidden">
                <Collapsible open={openSections.includes("media")}>
                  <SectionHeader 
                    id="media"
                    icon={Camera}
                    title="Media"
                    description="Logos, banners, and promotional content"
                  />
                  <CollapsibleContent>
                    <CardContent className="p-6 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-text-dark mb-2">
                            Event Logo
                          </label>
                          <div className="border-2 border-dashed border-soft-gray rounded-lg p-8 text-center">
                            <Camera className="w-8 h-8 text-text-muted mx-auto mb-2" />
                            <p className="text-text-muted">Upload logo (recommended: square format)</p>
                            <input 
                              type="file" 
                              accept="image/*" 
                              className="mt-2" 
                              data-testid="input-logo-upload"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-text-dark mb-2">
                            Event Banner
                          </label>
                          <div className="border-2 border-dashed border-soft-gray rounded-lg p-8 text-center">
                            <Camera className="w-8 h-8 text-text-muted mx-auto mb-2" />
                            <p className="text-text-muted">Upload banner (recommended: 16:9 format)</p>
                            <input 
                              type="file" 
                              accept="image/*" 
                              className="mt-2" 
                              data-testid="input-banner-upload"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-text-dark mb-2">
                          Gallery Images
                        </label>
                        <div className="border-2 border-dashed border-soft-gray rounded-lg p-8 text-center">
                          <Camera className="w-8 h-8 text-text-muted mx-auto mb-2" />
                          <p className="text-text-muted">Upload multiple images for your event gallery</p>
                          <input 
                            type="file" 
                            accept="image/*" 
                            multiple 
                            className="mt-2" 
                            data-testid="input-gallery-upload"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-text-dark mb-2">
                          Promo Video Link
                        </label>
                        <Input 
                          placeholder="https://youtube.com/watch?v=..." 
                          data-testid="input-promo-video"
                        />
                        <p className="text-xs text-text-muted mt-1">
                          YouTube, Vimeo, or other video platform link
                        </p>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>

              {/* 10. Contact */}
              <Card className="bg-white rounded-2xl shadow-soft border border-soft-gray overflow-hidden">
                <Collapsible open={openSections.includes("contact")}>
                  <SectionHeader 
                    id="contact"
                    icon={Phone}
                    title="Contact Information"
                    description="How participants can reach you"
                  />
                  <CollapsibleContent>
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="organizerName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Organizer Name *</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Your name or organization" 
                                  {...field} 
                                  data-testid="input-organizer-name"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="contactEmail"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Contact Email *</FormLabel>
                              <FormControl>
                                <Input 
                                  type="email" 
                                  placeholder="hello@yourhackathon.com" 
                                  {...field} 
                                  data-testid="input-contact-email"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="supportEmail"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Support Email</FormLabel>
                              <FormControl>
                                <Input 
                                  type="email" 
                                  placeholder="support@yourhackathon.com" 
                                  {...field} 
                                  data-testid="input-support-email"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input 
                                  type="tel" 
                                  placeholder="+1 (555) 123-4567" 
                                  {...field} 
                                  data-testid="input-phone"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>

              {/* 11. SEO */}
              <Card className="bg-white rounded-2xl shadow-soft border border-soft-gray overflow-hidden">
                <Collapsible open={openSections.includes("seo")}>
                  <SectionHeader 
                    id="seo"
                    icon={Search}
                    title="SEO & Social Preview"
                    description="How your event appears in search and social media"
                  />
                  <CollapsibleContent>
                    <CardContent className="p-6 space-y-6">
                      <FormField
                        control={form.control}
                        name="metaTitle"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Meta Title</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="AI for Good Hackathon 2024 | Build the Future" 
                                {...field} 
                                data-testid="input-meta-title"
                              />
                            </FormControl>
                            <FormDescription>
                              Shown in search results and browser tabs (max 60 characters)
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="metaDescription"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Meta Description</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Join us for the AI for Good Hackathon, where innovative minds collaborate to build AI solutions that make a positive impact on society..."
                                className="min-h-[100px]"
                                {...field} 
                                data-testid="textarea-meta-description"
                              />
                            </FormControl>
                            <FormDescription>
                              Shown in search results and social media previews (max 160 characters)
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div>
                        <label className="block text-sm font-medium text-text-dark mb-2">
                          Social Preview Image
                        </label>
                        <div className="border-2 border-dashed border-soft-gray rounded-lg p-8 text-center">
                          <Camera className="w-8 h-8 text-text-muted mx-auto mb-2" />
                          <p className="text-text-muted">Upload image for social media previews</p>
                          <p className="text-xs text-text-muted">Recommended: 1200x630px</p>
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="mt-2" 
                            data-testid="input-social-preview-upload"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>

              {/* 12. Custom Notes */}
              <Card className="bg-white rounded-2xl shadow-soft border border-soft-gray overflow-hidden">
                <Collapsible open={openSections.includes("custom")}>
                  <SectionHeader 
                    id="custom"
                    icon={FileText}
                    title="Custom Notes"
                    description="Additional information cards for your event"
                  />
                  <CollapsibleContent>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-heading font-bold text-lg text-text-dark">Extra Info Cards</h4>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm" 
                          onClick={addCustomNote}
                          data-testid="button-add-custom-note"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Custom Note
                        </Button>
                      </div>
                      <div className="space-y-4">
                        {customNotes.map((note) => (
                          <Card key={note.id} className="p-4">
                            <div className="flex items-start gap-4">
                              <div className="flex-1 space-y-4">
                                <Input
                                  placeholder="Card title"
                                  value={note.title}
                                  onChange={(e) => setCustomNotes(customNotes.map(n => 
                                    n.id === note.id ? { ...n, title: e.target.value } : n
                                  ))}
                                  data-testid={`input-note-title-${note.id}`}
                                />
                                <Textarea
                                  placeholder="Card content (supports markdown)"
                                  value={note.content}
                                  onChange={(e) => setCustomNotes(customNotes.map(n => 
                                    n.id === note.id ? { ...n, content: e.target.value } : n
                                  ))}
                                  className="min-h-[100px]"
                                  data-testid={`textarea-note-content-${note.id}`}
                                />
                              </div>
                              <Button 
                                type="button" 
                                variant="outline" 
                                size="sm" 
                                onClick={() => removeCustomNote(note.id)}
                                data-testid={`button-remove-note-${note.id}`}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          </Card>
                        ))}
                        {customNotes.length === 0 && (
                          <p className="text-text-muted text-center py-8">
                            No custom notes added yet. Click "Add Custom Note" to create additional information cards.
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 justify-end mt-8 p-6 bg-white rounded-2xl shadow-soft border border-soft-gray">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onSubmit(form.getValues(), true)}
                data-testid="button-save-draft"
              >
                Save Draft
              </Button>
              <Button 
                type="submit" 
                className="bg-coral text-white hover:bg-coral/80"
                data-testid="button-publish-changes"
              >
                Publish Changes
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}