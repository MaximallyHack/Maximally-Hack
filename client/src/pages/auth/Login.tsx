import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { FloatingElement, CrayonSquiggle } from "@/components/ui/floating-elements";
import { Mail, ArrowRight, Github, Chrome, Rocket, Shield, Heart } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleMagicLink = async () => {
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address to continue.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Magic link sent! ✨",
      description: "Check your email for a secure login link.",
    });
    
    setIsLoading(false);
  };

  const handleSocialLogin = (provider: string) => {
    toast({
      title: `Continue with ${provider}`,
      description: "Redirecting to secure authentication...",
    });
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center py-12 px-4" data-testid="login-page">
      <div className="w-full max-w-md">
        {/* Logo and Welcome */}
        <div className="text-center mb-8">
          <FloatingElement>
            <div className="w-16 h-16 bg-coral rounded-full flex items-center justify-center mx-auto mb-4">
              <Rocket className="w-8 h-8 text-white" />
            </div>
          </FloatingElement>
          <h1 className="font-heading font-bold text-3xl text-text-dark mb-2">Welcome Back</h1>
          <p className="text-text-muted">Sign in to your HackSpace account</p>
        </div>

        <Card className="bg-white rounded-2xl p-8 shadow-soft border border-soft-gray">
          {/* Magic Link Section */}
          <div className="space-y-6">
            <div>
              <h2 className="font-heading font-semibold text-xl text-text-dark mb-4 flex items-center gap-2">
                <Mail className="w-5 h-5 text-coral" />
                Sign in with Email
              </h2>
              <p className="text-text-muted text-sm mb-4">
                We'll send you a secure magic link - no password needed!
              </p>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-text-dark mb-2">
                    Email address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full border-soft-gray focus:ring-2 focus:ring-coral focus:border-transparent"
                    data-testid="input-email"
                  />
                </div>
                
                <Button 
                  onClick={handleMagicLink}
                  disabled={isLoading}
                  className="w-full bg-coral text-white hover:bg-coral/80 rounded-full py-3 font-medium transition-colors"
                  data-testid="button-magic-link"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Sending Magic Link...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Send Magic Link
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </Button>
              </div>
            </div>

            <div className="relative">
              <Separator className="bg-soft-gray" />
              <div className="absolute inset-0 flex justify-center">
                <span className="bg-white px-4 text-text-muted text-sm">or continue with</span>
              </div>
            </div>

            {/* Social Login */}
            <div className="space-y-3">
              <Button
                variant="outline"
                onClick={() => handleSocialLogin('GitHub')}
                className="w-full border-soft-gray hover:bg-soft-gray/50 rounded-full py-3 font-medium transition-colors"
                data-testid="button-github"
              >
                <Github className="w-5 h-5 mr-2" />
                Continue with GitHub
              </Button>
              
              <Button
                variant="outline"
                onClick={() => handleSocialLogin('Google')}
                className="w-full border-soft-gray hover:bg-soft-gray/50 rounded-full py-3 font-medium transition-colors"
                data-testid="button-google"
              >
                <Chrome className="w-5 h-5 mr-2" />
                Continue with Google
              </Button>
            </div>

            {/* Security Note */}
            <div className="bg-sky/10 rounded-xl p-4 border border-sky/20">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-sky mt-0.5" />
                <div>
                  <h3 className="font-medium text-text-dark text-sm">Secure & Private</h3>
                  <p className="text-text-muted text-xs mt-1">
                    Your data is encrypted and we never share your information with third parties.
                  </p>
                </div>
              </div>
            </div>

            {/* Sign Up Link */}
            <div className="text-center pt-4 border-t border-soft-gray">
              <p className="text-text-muted text-sm">
                New to HackSpace?{" "}
                <Link href="/onboarding" className="text-coral hover:text-coral/80 font-medium transition-colors" data-testid="link-sign-up">
                  Create your account
                </Link>
              </p>
            </div>
          </div>
        </Card>

        {/* Features */}
        <div className="mt-8 text-center">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="text-center">
              <div className="text-2xl mb-1">🚀</div>
              <div className="text-text-muted text-xs">Join Events</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-1">🤝</div>
              <div className="text-text-muted text-xs">Find Teams</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-1">🏆</div>
              <div className="text-text-muted text-xs">Win Prizes</div>
            </div>
          </div>
        </div>

        {/* Legal Links */}
        <div className="mt-8 text-center space-x-4 text-xs text-text-muted">
          <Link href="/legal/terms" className="hover:text-text-dark transition-colors" data-testid="link-terms">
            Terms of Service
          </Link>
          <span>•</span>
          <Link href="/legal/privacy" className="hover:text-text-dark transition-colors" data-testid="link-privacy">
            Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  );
}
