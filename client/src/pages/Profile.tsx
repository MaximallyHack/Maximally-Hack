import { useAuth } from "@/contexts/SupabaseAuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useParams } from "wouter";
import { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";
import { supabaseApi } from "@/lib/supabaseApi";
import { 
  MapPin, Phone, Github, Linkedin, Twitter, Instagram, Globe,
  Users, Award, Calendar, Trophy, ExternalLink, Plus, Edit, Trash2,
  UserPlus, UserCheck, MessageSquare 
} from "lucide-react";

type ProfileData = {
  id: string;
  username: string;
  full_name?: string;
  avatar_url?: string;
  email?: string;
  phone?: string;
  location?: string;
  github?: string;
  linkedin?: string;
  skills: string[];
  interests: string[];
  bio?: string;
  headline?: string;
  socials?: {
    twitter?: string;
    instagram?: string;
    website?: string;
    [key: string]: string | undefined;
  };
};

type UserProject = {
  id: string;
  title: string;
  description?: string;
  url?: string;
  repo_url?: string;
  images?: string[];
  tags?: string[];
  created_at: string;
};

type UserCertificate = {
  id: string;
  title: string;
  issuer?: string;
  issue_date?: string;
  expiry_date?: string;
  credential_id?: string;
  credential_url?: string;
  skills?: string[];
  created_at: string;
};

type HackathonHistory = {
  id: string;
  event_id?: string;
  event_name?: string;
  role: 'participant' | 'judge' | 'organizer';
  team_id?: string;
  project_id?: string;
  started_at?: string;
  ended_at?: string;
  outcome?: any;
  created_at: string;
};

type ConnectionStatus = {
  isConnected: boolean;
  hasPendingRequest: boolean;
  isRequestSent: boolean;
  connectionCount: number;
  mutualConnections: number;
};

export default function Profile() {
  const { user, signOut } = useAuth();
  const { handle } = useParams<{ handle: string }>();

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [projects, setProjects] = useState<UserProject[]>([]);
  const [certificates, setCertificates] = useState<UserCertificate[]>([]);
  const [hackathonHistory, setHackathonHistory] = useState<HackathonHistory[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    isConnected: false,
    hasPendingRequest: false,
    isRequestSent: false,
    connectionCount: 0,
    mutualConnections: 0
  });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<ProfileData | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddProject, setShowAddProject] = useState(false);
  const [showAddCertificate, setShowAddCertificate] = useState(false);
  const [newProject, setNewProject] = useState<Partial<UserProject>>({});
  const [newCertificate, setNewCertificate] = useState<Partial<UserCertificate>>({});

  // ✅ Correct: check own profile
  const isOwnProfile = user && profile && user.id === profile.id;

  // Fetch user's additional data
  const fetchUserData = async (userId: string) => {
    try {
      const [projectsRes, certificatesRes, historyRes] = await Promise.all([
        supabaseApi.getUserProjects(userId),
        supabaseApi.getUserCertificates(userId),
        supabaseApi.getUserHackathonHistory(userId)
      ]);
      
      setProjects(projectsRes);
      setCertificates(certificatesRes);
      setHackathonHistory(historyRes);

      // Fetch connection status if viewing another user's profile
      if (!isOwnProfile && user) {
        const connectionData = await supabaseApi.getConnectionStatus(userId);
        setConnectionStatus(connectionData);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  // ✅ Fetch profile by username (or id if handle is uuid)
  useEffect(() => {
    async function fetchProfile() {
      if (!handle) {
        console.error('No handle provided for profile');
        setLoading(false);
        setProfile(null);
        return;
      }

      setLoading(true);
      console.log('Fetching profile for handle:', handle);

      const isUuid = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(handle);
      console.log('Handle is UUID:', isUuid, handle);

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select(
            "id, username, full_name, avatar_url, email, phone, location, github, linkedin, skills, interests, bio, headline, socials"
          )
          .or(isUuid ? `id.eq.${handle}` : `username.eq.${handle}`)
          .maybeSingle();
        
        console.log('Profile fetch result:', { data, error });

        if (error) {
          console.error("Supabase profile fetch error:", error);
          setProfile(null);
          setForm(null);
        } else if (data) {
          setProfile(data);
          setForm(data);
          console.log('Profile loaded successfully:', data);
          // Fetch additional user data
          await fetchUserData(data.id);
        } else {
          console.log('No profile found for handle:', handle);
          setProfile(null);
          setForm(null);
        }
      } catch (err) {
        console.error('Error in profile fetch:', err);
        setProfile(null);
        setForm(null);
      }

      setLoading(false);
    }
    
    fetchProfile();
  }, [handle, user]);

  // ✅ Save profile changes
  async function handleSave() {
    if (!form || !user || !isOwnProfile) return;

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: form.full_name,
        phone: form.phone,
        location: form.location,
        github: form.github,
        linkedin: form.linkedin,
        skills: form.skills,
        interests: form.interests,
        bio: form.bio,
        headline: form.headline,
        socials: form.socials || {},
      })
      .eq("id", user.id);

    if (!error) {
      setProfile(form);
      setEditing(false);
    }
  }

  // Add project
  const handleAddProject = async () => {
    if (!user || !newProject.title) return;
    try {
      const project = await supabaseApi.createUserProject({
        ...newProject,
        user_id: user.id
      });
      setProjects([project, ...projects]);
      setNewProject({});
      setShowAddProject(false);
    } catch (error) {
      console.error('Error adding project:', error);
    }
  };

  // Add certificate
  const handleAddCertificate = async () => {
    if (!user || !newCertificate.title) return;
    try {
      const certificate = await supabaseApi.createUserCertificate({
        ...newCertificate,
        user_id: user.id
      });
      setCertificates([certificate, ...certificates]);
      setNewCertificate({});
      setShowAddCertificate(false);
    } catch (error) {
      console.error('Error adding certificate:', error);
    }
  };

  // Handle connection actions
  const handleConnect = async () => {
    if (!user || !profile) return;
    try {
      await supabaseApi.sendConnectionRequest(profile.id);
      setConnectionStatus(prev => ({ ...prev, isRequestSent: true }));
    } catch (error) {
      console.error('Error sending connection request:', error);
    }
  };

  const handleAcceptConnection = async () => {
    if (!user || !profile) return;
    try {
      await supabaseApi.acceptConnectionRequest(profile.id);
      setConnectionStatus(prev => ({ 
        ...prev, 
        isConnected: true, 
        hasPendingRequest: false,
        connectionCount: prev.connectionCount + 1 
      }));
    } catch (error) {
      console.error('Error accepting connection:', error);
    }
  };

  const handleRemoveConnection = async () => {
    if (!user || !profile) return;
    try {
      await supabaseApi.removeConnection(profile.id);
      setConnectionStatus(prev => ({ 
        ...prev, 
        isConnected: false,
        connectionCount: prev.connectionCount - 1 
      }));
    } catch (error) {
      console.error('Error removing connection:', error);
    }
  };

  // ✅ Upload new avatar
  async function handleAvatarChange() {
    if (!isOwnProfile) return;
    const file = await selectFile();
    if (file) {
      const url = await uploadAvatar(file);
      if (url) {
        setProfile((prev) => (prev ? { ...prev, avatar_url: url } : prev));
        setForm((prev) => (prev ? { ...prev, avatar_url: url } : prev));
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading profile...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Profile not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header Section */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="flex flex-col items-center md:items-start">
                <Avatar className="w-32 h-32 mb-4">
                  <AvatarImage src={profile.avatar_url || undefined} alt={profile.full_name} />
                  <AvatarFallback className="text-2xl">
                    {profile.full_name?.[0]?.toUpperCase() ||
                      profile.username?.[0]?.toUpperCase() ||
                      "U"}
                  </AvatarFallback>
                </Avatar>
                {isOwnProfile && (
                  <Button onClick={handleAvatarChange} variant="outline" size="sm">
                    Change Avatar
                  </Button>
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                      {profile.full_name || "Unnamed User"}
                    </h1>
                    <p className="text-lg text-gray-600">@{profile.username}</p>
                    {profile.headline && (
                      <p className="text-md text-gray-700 mt-1 font-medium">{profile.headline}</p>
                    )}
                    {profile.location && (
                      <div className="flex items-center gap-1 text-gray-600 mt-2">
                        <MapPin className="w-4 h-4" />
                        {profile.location}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col gap-3 mt-4 md:mt-0">
                    {!isOwnProfile && user && (
                      <div className="flex gap-2">
                        {connectionStatus.isConnected ? (
                          <Button onClick={handleRemoveConnection} variant="outline">
                            <UserCheck className="w-4 h-4 mr-2" />
                            Connected
                          </Button>
                        ) : connectionStatus.hasPendingRequest ? (
                          <Button onClick={handleAcceptConnection}>
                            <UserPlus className="w-4 h-4 mr-2" />
                            Accept Request
                          </Button>
                        ) : connectionStatus.isRequestSent ? (
                          <Button disabled variant="outline">
                            Request Sent
                          </Button>
                        ) : (
                          <Button onClick={handleConnect}>
                            <UserPlus className="w-4 h-4 mr-2" />
                            Connect
                          </Button>
                        )}
                        <Button variant="outline">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Message
                        </Button>
                      </div>
                    )}
                    
                    <div className="flex gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span className="font-semibold">{connectionStatus.connectionCount}</span> connections
                      </div>
                      {connectionStatus.mutualConnections > 0 && (
                        <div className="text-gray-600">
                          {connectionStatus.mutualConnections} mutual
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {profile.bio && (
                  <p className="mt-4 text-gray-700 leading-relaxed">{profile.bio}</p>
                )}
                
                {/* Skills Tags */}
                {Array.isArray(profile.skills) && profile.skills.length > 0 && (
                  <div className="mt-4">
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Social Links */}
                <div className="flex gap-4 mt-4">
                  {profile.github && (
                    <a href={profile.github} target="_blank" rel="noopener noreferrer" 
                       className="text-gray-600 hover:text-gray-900">
                      <Github className="w-5 h-5" />
                    </a>
                  )}
                  {profile.linkedin && (
                    <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" 
                       className="text-gray-600 hover:text-gray-900">
                      <Linkedin className="w-5 h-5" />
                    </a>
                  )}
                  {profile.socials?.twitter && (
                    <a href={profile.socials.twitter} target="_blank" rel="noopener noreferrer" 
                       className="text-gray-600 hover:text-gray-900">
                      <Twitter className="w-5 h-5" />
                    </a>
                  )}
                  {profile.socials?.website && (
                    <a href={profile.socials.website} target="_blank" rel="noopener noreferrer" 
                       className="text-gray-600 hover:text-gray-900">
                      <Globe className="w-5 h-5" />
                    </a>
                  )}
                </div>
                
                {isOwnProfile && (
                  <div className="flex gap-3 mt-6">
                    <Button onClick={() => setEditing(true)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                    <Button onClick={signOut} variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                      Sign Out
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="projects">Projects ({projects.length})</TabsTrigger>
            <TabsTrigger value="certificates">Certificates ({certificates.length})</TabsTrigger>
            <TabsTrigger value="hackathons">Hackathons ({hackathonHistory.length})</TabsTrigger>
            {isOwnProfile && <TabsTrigger value="edit">Edit Profile</TabsTrigger>}
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Recent Activity Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Recent Projects */}
              {projects.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Trophy className="w-5 h-5" />
                      Recent Projects
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {projects.slice(0, 3).map((project) => (
                        <div key={project.id} className="border-l-2 border-blue-200 pl-3">
                          <h4 className="font-medium">{project.title}</h4>
                          <p className="text-sm text-gray-600 line-clamp-2">{project.description}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {/* Recent Certificates */}
              {certificates.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Award className="w-5 h-5" />
                      Recent Certificates
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {certificates.slice(0, 3).map((cert) => (
                        <div key={cert.id} className="border-l-2 border-green-200 pl-3">
                          <h4 className="font-medium">{cert.title}</h4>
                          <p className="text-sm text-gray-600">{cert.issuer}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {/* Recent Hackathons */}
              {hackathonHistory.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Recent Hackathons
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {hackathonHistory.slice(0, 3).map((hackathon) => (
                        <div key={hackathon.id} className="border-l-2 border-purple-200 pl-3">
                          <h4 className="font-medium">{hackathon.event_name}</h4>
                          <p className="text-sm text-gray-600 capitalize">{hackathon.role}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="projects">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Projects</CardTitle>
                  {isOwnProfile && (
                    <Dialog open={showAddProject} onOpenChange={setShowAddProject}>
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="w-4 h-4 mr-2" />
                          Add Project
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add New Project</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label>Title</Label>
                            <Input
                              value={newProject.title || ''}
                              onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                              placeholder="Project title"
                            />
                          </div>
                          <div>
                            <Label>Description</Label>
                            <Textarea
                              value={newProject.description || ''}
                              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                              placeholder="Project description"
                            />
                          </div>
                          <div>
                            <Label>Project URL</Label>
                            <Input
                              value={newProject.url || ''}
                              onChange={(e) => setNewProject({ ...newProject, url: e.target.value })}
                              placeholder="https://..."
                            />
                          </div>
                          <div>
                            <Label>Repository URL</Label>
                            <Input
                              value={newProject.repo_url || ''}
                              onChange={(e) => setNewProject({ ...newProject, repo_url: e.target.value })}
                              placeholder="https://github.com/..."
                            />
                          </div>
                          <div>
                            <Label>Tags</Label>
                            <Input
                              value={newProject.tags?.join(', ') || ''}
                              onChange={(e) => setNewProject({ 
                                ...newProject, 
                                tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                              })}
                              placeholder="React, Node.js, MongoDB"
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button onClick={handleAddProject} className="flex-1">
                              Add Project
                            </Button>
                            <Button variant="outline" onClick={() => setShowAddProject(false)}>
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {projects.map((project) => (
                    <div key={project.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg">{project.title}</h3>
                        <div className="flex gap-2">
                          {project.url && (
                            <a href={project.url} target="_blank" rel="noopener noreferrer">
                              <Button variant="ghost" size="sm">
                                <ExternalLink className="w-4 h-4" />
                              </Button>
                            </a>
                          )}
                          {project.repo_url && (
                            <a href={project.repo_url} target="_blank" rel="noopener noreferrer">
                              <Button variant="ghost" size="sm">
                                <Github className="w-4 h-4" />
                              </Button>
                            </a>
                          )}
                        </div>
                      </div>
                      {project.description && (
                        <p className="text-gray-600 mb-3">{project.description}</p>
                      )}
                      {project.tags && project.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {project.tags.map((tag, index) => (
                            <Badge key={index} variant="outline">{tag}</Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  {projects.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      {isOwnProfile ? 'Add your first project!' : 'No projects to show'}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="certificates">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Certificates</CardTitle>
                  {isOwnProfile && (
                    <Dialog open={showAddCertificate} onOpenChange={setShowAddCertificate}>
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="w-4 h-4 mr-2" />
                          Add Certificate
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add New Certificate</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label>Title</Label>
                            <Input
                              value={newCertificate.title || ''}
                              onChange={(e) => setNewCertificate({ ...newCertificate, title: e.target.value })}
                              placeholder="Certificate title"
                            />
                          </div>
                          <div>
                            <Label>Issuer</Label>
                            <Input
                              value={newCertificate.issuer || ''}
                              onChange={(e) => setNewCertificate({ ...newCertificate, issuer: e.target.value })}
                              placeholder="Issuing organization"
                            />
                          </div>
                          <div>
                            <Label>Issue Date</Label>
                            <Input
                              type="date"
                              value={newCertificate.issue_date || ''}
                              onChange={(e) => setNewCertificate({ ...newCertificate, issue_date: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label>Credential URL</Label>
                            <Input
                              value={newCertificate.credential_url || ''}
                              onChange={(e) => setNewCertificate({ ...newCertificate, credential_url: e.target.value })}
                              placeholder="https://..."
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button onClick={handleAddCertificate} className="flex-1">
                              Add Certificate
                            </Button>
                            <Button variant="outline" onClick={() => setShowAddCertificate(false)}>
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {certificates.map((cert) => (
                    <div key={cert.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-lg">{cert.title}</h3>
                          <p className="text-gray-600">{cert.issuer}</p>
                          {cert.issue_date && (
                            <p className="text-sm text-gray-500">Issued: {new Date(cert.issue_date).toLocaleDateString()}</p>
                          )}
                        </div>
                        {cert.credential_url && (
                          <a href={cert.credential_url} target="_blank" rel="noopener noreferrer">
                            <Button variant="ghost" size="sm">
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          </a>
                        )}
                      </div>
                      {cert.skills && cert.skills.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {cert.skills.map((skill, index) => (
                            <Badge key={index} variant="outline">{skill}</Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  {certificates.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      {isOwnProfile ? 'Add your first certificate!' : 'No certificates to show'}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hackathons">
            <Card>
              <CardHeader>
                <CardTitle>Hackathon History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {hackathonHistory.map((hackathon) => (
                    <div key={hackathon.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-lg">{hackathon.event_name}</h3>
                          <p className="text-gray-600 capitalize">{hackathon.role}</p>
                          {hackathon.started_at && (
                            <p className="text-sm text-gray-500">
                              {new Date(hackathon.started_at).toLocaleDateString()} - 
                              {hackathon.ended_at ? new Date(hackathon.ended_at).toLocaleDateString() : 'Present'}
                            </p>
                          )}
                        </div>
                      </div>
                      {hackathon.outcome && Object.keys(hackathon.outcome).length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm font-medium text-gray-700">Achievements:</p>
                          <div className="text-sm text-gray-600">
                            {hackathon.outcome.awards && (
                              <p>Awards: {hackathon.outcome.awards.join(', ')}</p>
                            )}
                            {hackathon.outcome.rank && (
                              <p>Rank: {hackathon.outcome.rank}</p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  {hackathonHistory.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No hackathon history to show
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {isOwnProfile && (
            <TabsContent value="edit">
              <Card>
                <CardHeader>
                  <CardTitle>Edit Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-w-lg">
                    <div>
                      <Label>Full Name</Label>
                      <Input
                        value={form?.full_name || ""}
                        onChange={(e) => setForm((f) => ({ ...f!, full_name: e.target.value }))}
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <Label>Headline</Label>
                      <Input
                        value={form?.headline || ""}
                        onChange={(e) => setForm((f) => ({ ...f!, headline: e.target.value }))}
                        placeholder="Software Engineer, Student, etc."
                      />
                    </div>
                    <div>
                      <Label>Bio</Label>
                      <Textarea
                        value={form?.bio || ""}
                        onChange={(e) => setForm((f) => ({ ...f!, bio: e.target.value }))}
                        placeholder="Tell us about yourself..."
                        rows={4}
                      />
                    </div>
                    <div>
                      <Label>Location</Label>
                      <Input
                        value={form?.location || ""}
                        onChange={(e) => setForm((f) => ({ ...f!, location: e.target.value }))}
                        placeholder="City, Country"
                      />
                    </div>
                    <div>
                      <Label>Phone</Label>
                      <Input
                        value={form?.phone || ""}
                        onChange={(e) => setForm((f) => ({ ...f!, phone: e.target.value }))}
                        placeholder="Your phone number"
                      />
                    </div>
                    <div>
                      <Label>GitHub</Label>
                      <Input
                        value={form?.github || ""}
                        onChange={(e) => setForm((f) => ({ ...f!, github: e.target.value }))}
                        placeholder="https://github.com/username"
                      />
                    </div>
                    <div>
                      <Label>LinkedIn</Label>
                      <Input
                        value={form?.linkedin || ""}
                        onChange={(e) => setForm((f) => ({ ...f!, linkedin: e.target.value }))}
                        placeholder="https://linkedin.com/in/username"
                      />
                    </div>
                    <div>
                      <Label>Twitter</Label>
                      <Input
                        value={form?.socials?.twitter || ""}
                        onChange={(e) => setForm((f) => ({ 
                          ...f!, 
                          socials: { ...f?.socials, twitter: e.target.value }
                        }))}
                        placeholder="https://twitter.com/username"
                      />
                    </div>
                    <div>
                      <Label>Website</Label>
                      <Input
                        value={form?.socials?.website || ""}
                        onChange={(e) => setForm((f) => ({ 
                          ...f!, 
                          socials: { ...f?.socials, website: e.target.value }
                        }))}
                        placeholder="https://yourwebsite.com"
                      />
                    </div>
                    <div>
                      <Label>Skills</Label>
                      <Input
                        value={form?.skills?.join(", ") || ""}
                        onChange={(e) => setForm((f) => ({
                          ...f!,
                          skills: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                        }))}
                        placeholder="JavaScript, React, Node.js"
                      />
                    </div>
                    <div>
                      <Label>Interests</Label>
                      <Input
                        value={form?.interests?.join(", ") || ""}
                        onChange={(e) => setForm((f) => ({
                          ...f!,
                          interests: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                        }))}
                        placeholder="Machine Learning, Web Development, Gaming"
                      />
                    </div>
                    <div className="flex gap-3 pt-4">
                      <Button onClick={handleSave} className="flex-1">
                        Save Changes
                      </Button>
                      <Button variant="outline" onClick={() => setEditing(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}

// helper file picker
async function selectFile(): Promise<File | null> {
  return new Promise((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = () => {
      const file = input.files?.[0] || null;
      resolve(file);
    };
    input.click();
  });
}

// Upload avatar to Supabase storage
async function uploadAvatar(file: File): Promise<string | null> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const { data, error } = await supabase.storage
      .from('avatars')
      .upload(fileName, file);

    if (error) {
      console.error('Upload error:', error);
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName);

    return publicUrl;
  } catch (error) {
    console.error('Upload error:', error);
    return null;
  }
}
