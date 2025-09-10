import { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Shield, Building, User, Mail, Lock, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function OrganizerSignin() {
  const { user, login, register, isLoggedIn } = useAuth();
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    fullName: '',
    password: '',
    organizationName: '',
    website: '',
  });

  // Redirect if already logged in as organizer
  if (isLoggedIn && user?.isOrganizer) {
    return <Navigate to="/organizer/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        const result = await login(formData.username, formData.password);
        if (result.success) {
          toast({
            title: "Welcome back!",
            description: "Successfully signed in to your organizer account.",
          });
        } else {
          toast({
            title: "Sign in failed",
            description: result.error || "Invalid credentials",
            variant: "destructive",
          });
        }
      } else {
        const result = await register({
          ...formData,
          role: 'organizer',
        });
        if (result.success) {
          toast({
            title: "Account created!",
            description: "Your organizer account has been created successfully.",
          });
        } else {
          toast({
            title: "Registration failed",
            description: result.error || "Failed to create account",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="w-full max-w-lg">
        <Card className="border-2">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-coral/10 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-coral" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">
                {isLogin ? 'Organizer Sign In' : 'Become an Organizer'}
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                {isLogin 
                  ? 'Access your event management dashboard' 
                  : 'Create and manage amazing hackathons'
                }
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username/Email */}
              <div className="space-y-2">
                <Label htmlFor={isLogin ? 'username' : 'email'}>
                  {isLogin ? 'Username or Email' : 'Email Address'}
                </Label>
                <div className="relative">
                  <Input
                    id={isLogin ? 'username' : 'email'}
                    name={isLogin ? 'username' : 'email'}
                    type={isLogin ? 'text' : 'email'}
                    placeholder={isLogin ? 'Enter username or email' : 'organizer@company.com'}
                    value={isLogin ? formData.username : formData.email}
                    onChange={handleInputChange}
                    className="pl-10"
                    required
                    data-testid={`input-${isLogin ? 'username' : 'email'}`}
                  />
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                </div>
              </div>

              {/* Registration-only fields */}
              {!isLogin && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <div className="relative">
                      <Input
                        id="username"
                        name="username"
                        type="text"
                        placeholder="Choose a username"
                        value={formData.username}
                        onChange={handleInputChange}
                        className="pl-10"
                        required
                        data-testid="input-username"
                      />
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <div className="relative">
                      <Input
                        id="fullName"
                        name="fullName"
                        type="text"
                        placeholder="Your full name"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="pl-10"
                        required
                        data-testid="input-full-name"
                      />
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="organizationName">Organization</Label>
                    <div className="relative">
                      <Input
                        id="organizationName"
                        name="organizationName"
                        type="text"
                        placeholder="Your company or organization"
                        value={formData.organizationName}
                        onChange={handleInputChange}
                        className="pl-10"
                        data-testid="input-organization"
                      />
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website">Website (Optional)</Label>
                    <div className="relative">
                      <Input
                        id="website"
                        name="website"
                        type="url"
                        placeholder="https://your-website.com"
                        value={formData.website}
                        onChange={handleInputChange}
                        className="pl-10"
                        data-testid="input-website"
                      />
                      <ExternalLink className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>
                </>
              )}

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-10"
                    required
                    data-testid="input-password"
                  />
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                </div>
              </div>

              {/* Demo credentials helper */}
              {isLogin && (
                <div className="p-3 bg-muted rounded-lg text-sm">
                  <p className="font-medium text-muted-foreground mb-1">Demo Organizer Account:</p>
                  <p className="text-xs text-muted-foreground">
                    Username: <code className="bg-background px-1 rounded">event_master</code> | 
                    Password: <code className="bg-background px-1 rounded">demo123</code>
                  </p>
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
                data-testid="button-submit"
              >
                {isLoading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Organizer Account')}
              </Button>
            </form>

            <Separator />

            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                {isLogin ? "Don't have an organizer account?" : "Already have an account?"}
              </p>
              <Button 
                variant="ghost" 
                onClick={() => setIsLogin(!isLogin)}
                data-testid="button-toggle-mode"
              >
                {isLogin ? 'Create Organizer Account' : 'Sign In Instead'}
              </Button>
            </div>

            <div className="text-center">
              <Link to="/auth/login">
                <Button variant="outline" size="sm" data-testid="button-participant-login">
                  <User className="w-4 h-4 mr-2" />
                  Participant Login
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}