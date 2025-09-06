import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Users, Plus, X, ArrowLeft, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TeamFormData {
  name: string;
  description: string;
  projectIdea: string;
  requiredSkills: string[];
  lookingForRoles: string[];
  maxSize: number;
  isPublic: boolean;
  tags: string[];
}

const commonSkills = [
  "React", "TypeScript", "Python", "Node.js", "UI/UX Design", "Machine Learning",
  "Mobile Development", "Backend Development", "DevOps", "Data Science",
  "Product Management", "Marketing", "Business Strategy", "Figma", "AWS"
];

const commonRoles = [
  "Frontend Developer", "Backend Developer", "Full-stack Developer", "UI/UX Designer",
  "Product Manager", "Data Scientist", "ML Engineer", "DevOps Engineer",
  "Marketing Specialist", "Business Analyst", "QA Engineer"
];

const commonTags = [
  "AI", "HealthTech", "FinTech", "Sustainability", "Education", "Gaming",
  "Social Impact", "Developer Tools", "Mobile App", "Web App", "IoT", "Blockchain"
];

export default function CreateTeam() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState<TeamFormData>({
    name: "",
    description: "",
    projectIdea: "",
    requiredSkills: [],
    lookingForRoles: [],
    maxSize: 4,
    isPublic: true,
    tags: []
  });

  const [newSkill, setNewSkill] = useState("");
  const [newRole, setNewRole] = useState("");
  const [newTag, setNewTag] = useState("");

  const addSkill = (skill: string) => {
    if (skill && !formData.requiredSkills.includes(skill)) {
      setFormData(prev => ({ ...prev, requiredSkills: [...prev.requiredSkills, skill] }));
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      requiredSkills: prev.requiredSkills.filter(skill => skill !== skillToRemove)
    }));
  };

  const addRole = (role: string) => {
    if (role && !formData.lookingForRoles.includes(role)) {
      setFormData(prev => ({ ...prev, lookingForRoles: [...prev.lookingForRoles, role] }));
      setNewRole("");
    }
  };

  const removeRole = (roleToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      lookingForRoles: prev.lookingForRoles.filter(role => role !== roleToRemove)
    }));
  };

  const addTag = (tag: string) => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, tag] }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({ title: "Error", description: "Team name is required", variant: "destructive" });
      return;
    }
    
    if (!formData.description.trim()) {
      toast({ title: "Error", description: "Team description is required", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({ title: "Success!", description: "Team created successfully!" });
      navigate('/teams/my');
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/teams')} className="text-coral hover:text-coral/80" data-testid="button-back">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Teams
          </Button>
        </div>
        <h1 className="text-3xl font-heading font-bold text-foreground mb-2">Create Your Team</h1>
        <p className="text-muted-foreground">Build your dream hackathon team and find amazing collaborators</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card data-testid="basic-info-section">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-coral" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="team-name" className="text-sm font-medium">Team Name *</Label>
                  <Input
                    id="team-name"
                    placeholder="Enter your team name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="mt-1"
                    data-testid="input-team-name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="description" className="text-sm font-medium">Team Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your team's mission and what makes you unique"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="mt-1 h-24"
                    data-testid="textarea-description"
                  />
                </div>

                <div>
                  <Label htmlFor="project-idea" className="text-sm font-medium">Project Idea</Label>
                  <Textarea
                    id="project-idea"
                    placeholder="What are you planning to build? (optional)"
                    value={formData.projectIdea}
                    onChange={(e) => setFormData(prev => ({ ...prev, projectIdea: e.target.value }))}
                    className="mt-1 h-20"
                    data-testid="textarea-project-idea"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="team-size" className="text-sm font-medium">Team Size *</Label>
                    <Select value={formData.maxSize.toString()} onValueChange={(value) => setFormData(prev => ({ ...prev, maxSize: parseInt(value) }))}>
                      <SelectTrigger className="mt-1" data-testid="select-team-size">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2">2 members</SelectItem>
                        <SelectItem value="3">3 members</SelectItem>
                        <SelectItem value="4">4 members</SelectItem>
                        <SelectItem value="5">5 members</SelectItem>
                        <SelectItem value="6">6 members</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Skills & Roles */}
            <Card data-testid="skills-roles-section">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-mint" />
                  Skills & Roles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Required Skills */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">Required Skills</Label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {formData.requiredSkills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="bg-coral/10 text-coral flex items-center gap-1" data-testid={`skill-badge-${skill}`}>
                        {skill}
                        <X className="w-3 h-3 cursor-pointer" onClick={() => removeSkill(skill)} />
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2 mb-2">
                    <Input
                      placeholder="Add a skill"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill(newSkill))}
                      className="flex-1"
                      data-testid="input-new-skill"
                    />
                    <Button type="button" size="sm" onClick={() => addSkill(newSkill)} className="bg-coral hover:bg-coral/90" data-testid="button-add-skill">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {commonSkills.map((skill) => (
                      <Button
                        key={skill}
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs border-coral/20 text-coral hover:bg-coral/10"
                        onClick={() => addSkill(skill)}
                        disabled={formData.requiredSkills.includes(skill)}
                        data-testid={`common-skill-${skill}`}
                      >
                        {skill}
                      </Button>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Looking for Roles */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">Looking for Roles</Label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {formData.lookingForRoles.map((role) => (
                      <Badge key={role} variant="secondary" className="bg-mint/10 text-mint flex items-center gap-1" data-testid={`role-badge-${role}`}>
                        {role}
                        <X className="w-3 h-3 cursor-pointer" onClick={() => removeRole(role)} />
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2 mb-2">
                    <Input
                      placeholder="Add a role"
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRole(newRole))}
                      className="flex-1"
                      data-testid="input-new-role"
                    />
                    <Button type="button" size="sm" onClick={() => addRole(newRole)} className="bg-mint hover:bg-mint/90" data-testid="button-add-role">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {commonRoles.map((role) => (
                      <Button
                        key={role}
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs border-mint/20 text-mint hover:bg-mint/10"
                        onClick={() => addRole(role)}
                        disabled={formData.lookingForRoles.includes(role)}
                        data-testid={`common-role-${role}`}
                      >
                        {role}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card data-testid="tags-section">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5 text-sky" />
                  Tags & Categories
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Label className="text-sm font-medium mb-3 block">Project Tags</Label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {formData.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="bg-sky/10 text-sky flex items-center gap-1" data-testid={`tag-badge-${tag}`}>
                        {tag}
                        <X className="w-3 h-3 cursor-pointer" onClick={() => removeTag(tag)} />
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2 mb-2">
                    <Input
                      placeholder="Add a tag"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag(newTag))}
                      className="flex-1"
                      data-testid="input-new-tag"
                    />
                    <Button type="button" size="sm" onClick={() => addTag(newTag)} className="bg-sky hover:bg-sky/90" data-testid="button-add-tag">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {commonTags.map((tag) => (
                      <Button
                        key={tag}
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs border-sky/20 text-sky hover:bg-sky/10"
                        onClick={() => addTag(tag)}
                        disabled={formData.tags.includes(tag)}
                        data-testid={`common-tag-${tag}`}
                      >
                        {tag}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Preview */}
            <Card className="sticky top-8" data-testid="preview-section">
              <CardHeader>
                <CardTitle className="text-lg">Team Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-foreground">{formData.name || "Your Team Name"}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{formData.description || "Your team description will appear here..."}</p>
                  </div>
                  
                  {formData.projectIdea && (
                    <div>
                      <h4 className="text-sm font-medium text-foreground mb-1">Project Idea</h4>
                      <p className="text-sm text-muted-foreground">{formData.projectIdea}</p>
                    </div>
                  )}
                  
                  {formData.requiredSkills.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-foreground mb-2">Required Skills</h4>
                      <div className="flex flex-wrap gap-1">
                        {formData.requiredSkills.slice(0, 3).map((skill) => (
                          <Badge key={skill} variant="secondary" className="bg-coral/10 text-coral text-xs">{skill}</Badge>
                        ))}
                        {formData.requiredSkills.length > 3 && <Badge variant="secondary" className="text-xs">+{formData.requiredSkills.length - 3}</Badge>}
                      </div>
                    </div>
                  )}
                  
                  {formData.lookingForRoles.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-foreground mb-2">Looking For</h4>
                      <div className="flex flex-wrap gap-1">
                        {formData.lookingForRoles.slice(0, 2).map((role) => (
                          <Badge key={role} variant="secondary" className="bg-mint/10 text-mint text-xs">{role}</Badge>
                        ))}
                        {formData.lookingForRoles.length > 2 && <Badge variant="secondary" className="text-xs">+{formData.lookingForRoles.length - 2}</Badge>}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between pt-4 border-t">
                    <span className="text-sm text-muted-foreground">Team Size</span>
                    <span className="text-sm font-medium">1/{formData.maxSize} members</span>
                  </div>
                  
                  <Badge className="w-full justify-center bg-mint/10 text-mint hover:bg-mint/20">Recruiting</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-4 mt-8 pt-6 border-t" data-testid="form-actions">
          <Button type="button" variant="outline" onClick={() => navigate('/teams')} data-testid="button-cancel">
            Cancel
          </Button>
          <Button type="submit" className="bg-coral hover:bg-coral/90" disabled={isLoading} data-testid="button-create-team">
            {isLoading ? "Creating Team..." : "Create Team"}
          </Button>
        </div>
      </form>
    </div>
  );
}