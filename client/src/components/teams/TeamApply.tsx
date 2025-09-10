import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, Send, Users, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/supabaseApi";

const commonSkills = [
  "React", "TypeScript", "Python", "Node.js", "UI/UX Design", "Machine Learning",
  "Mobile Development", "Backend Development", "Data Science", "DevOps",
  "Product Management", "Marketing", "Business Development", "AWS", "Figma"
];

export default function TeamApply() {
  const [, navigate] = useLocation();
  const [match, params] = useRoute('/teams/:teamId/apply');
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    message: '',
    skills: [] as string[]
  });
  const [newSkill, setNewSkill] = useState('');

  const teamId = params?.teamId;

  // Fetch team details
  const { data: team, isLoading } = useQuery({
    queryKey: ['team', teamId],
    queryFn: () => api.getTeam(teamId!),
    enabled: !!teamId
  });

  const addSkill = (skill: string) => {
    if (skill && !formData.skills.includes(skill)) {
      setFormData(prev => ({ ...prev, skills: [...prev.skills, skill] }));
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({ title: "Error", description: "Please log in to apply", variant: "destructive" });
      return;
    }

    if (!teamId) {
      toast({ title: "Error", description: "Team not found", variant: "destructive" });
      return;
    }
    
    if (!formData.message.trim()) {
      toast({ title: "Error", description: "Please enter a message", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    
    try {
      await api.applyToTeam(teamId, formData.message, formData.skills);
      
      toast({ 
        title: "Application Sent!", 
        description: "Your application has been sent to the team. They will review it soon." 
      });
      
      navigate(`/teams/${teamId}`);
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to send application", 
        variant: "destructive" 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-coral"></div>
        </div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardContent className="p-12 text-center">
            <h3 className="text-lg font-semibold mb-2">Team not found</h3>
            <p className="text-muted-foreground mb-4">The team you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/teams')}>Back to Teams</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate(`/teams/${teamId}`)} 
            className="text-coral hover:text-coral/80"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Team
          </Button>
        </div>
        <h1 className="text-3xl font-heading font-bold text-foreground mb-2">Apply to Join Team</h1>
        <p className="text-muted-foreground">Send your application to join this amazing team</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Application Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="w-5 h-5 text-coral" />
                Your Application
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Message */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Why do you want to join this team? *
                  </label>
                  <Textarea
                    placeholder="Tell the team why you're interested and what you can contribute..."
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    className="h-32 resize-none"
                    required
                  />
                </div>

                {/* Skills */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Your Skills
                  </label>
                  <div className="flex gap-2 mb-3">
                    <Input
                      placeholder="Add a skill..."
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addSkill(newSkill);
                        }
                      }}
                    />
                    <Button type="button" onClick={() => addSkill(newSkill)} disabled={!newSkill.trim()}>
                      Add
                    </Button>
                  </div>
                  
                  {/* Common Skills */}
                  <div className="mb-4">
                    <p className="text-xs text-muted-foreground mb-2">Popular skills:</p>
                    <div className="flex flex-wrap gap-1">
                      {commonSkills.map(skill => (
                        <Button
                          key={skill}
                          type="button"
                          variant="outline"
                          size="sm"
                          className="text-xs h-7"
                          onClick={() => addSkill(skill)}
                          disabled={formData.skills.includes(skill)}
                        >
                          {skill}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Selected Skills */}
                  {formData.skills.length > 0 && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">Selected skills:</p>
                      <div className="flex flex-wrap gap-2">
                        {formData.skills.map(skill => (
                          <Badge key={skill} variant="secondary" className="bg-coral/10 text-coral cursor-pointer"
                            onClick={() => removeSkill(skill)}
                          >
                            {skill} ×
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-coral hover:bg-coral/90" 
                  disabled={isSubmitting || !formData.message.trim()}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sending Application...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Application
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Team Info Sidebar */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Team Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-foreground text-lg mb-2">{team.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">{team.description}</p>
              </div>
              
              {/* Team Size */}
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {(team.members || []).length}/{team.maxSize || team.max_size} members
                </span>
              </div>
              
              {/* Required Skills */}
              {(team.requiredSkills || team.skills || []).length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-2">Looking for:</h4>
                  <div className="flex flex-wrap gap-1">
                    {(team.requiredSkills || team.skills || []).map(skill => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Looking for Roles */}
              {(team.lookingForRoles || team.looking_for || []).length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-2">Roles needed:</h4>
                  <div className="flex flex-wrap gap-1">
                    {(team.lookingForRoles || team.looking_for || []).map(role => (
                      <Badge key={role} variant="outline" className="text-xs">
                        {role}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
