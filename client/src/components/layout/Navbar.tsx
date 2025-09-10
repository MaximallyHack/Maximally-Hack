import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Badge } from "@/components/ui/badge";
import {
  Rocket,
  Menu,
  User,
  LogOut,
  Settings,
  Search,
  Calendar,
  Users,
  Sparkles,
  UserPlus,
} from "lucide-react";
import { useAuth } from "@/contexts/SupabaseAuthContext";

export default function Navbar() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut, switchTestRole } = useAuth();
  const profile = user; // user already contains profile data
  const [rocketClass, setRocketClass] = useState(
    "w-5 h-5 text-white group-hover:rotate-12 transition-transform duration-300 rocket-animation"
  );
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const profileHandle = user?.user_metadata?.username || user?.id;
  const navItems = [
    { href: "/explore", label: "Explore Hackathons", icon: Search, testId: "nav-explore" },
    { href: "/teams", label: "Teams", icon: Users, testId: "nav-teams" },
    { href: "/organize", label: "Organize with Us", icon: UserPlus, testId: "nav-organize" },
  ];

  const isActive = (href: string) => {
    if (href === "/" && location === "/") return true;
    if (href !== "/" && location.startsWith(href)) return true;
    return false;
  };

  const triggerRocketAnimation = () => {
    setRocketClass(
      "w-5 h-5 text-white group-hover:rotate-12 transition-transform duration-300"
    );
    setTimeout(() => {
      setRocketClass(
        "w-5 h-5 text-white group-hover:rotate-12 transition-transform duration-300 rocket-animation"
      );
    }, 10);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      triggerRocketAnimation();
    }, 2000);
    return () => clearTimeout(timer);
  }, [location]);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      triggerRocketAnimation();
    }, 300000); // 5 min
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <>
      {/* Demo Mode Banner */}
      <div className="bg-gradient-to-r from-mint/80 to-sky/60 text-foreground text-center py-2 px-4 text-sm font-medium shadow-sm">
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4" />
          <span>🧪 Demo Mode - Experience the platform with simulated data</span>
          <Sparkles className="w-4 h-4" />
        </div>
      </div>

      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-18 mb-4 mt-4">
            <Link
              to="/"
              className="flex items-center space-x-3 hover-scale group transition-all duration-300"
              data-testid="logo-link"
            >
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-coral to-coral/80 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105 overflow-hidden">
                  <Rocket className={rocketClass} />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow rounded-full animate-pulse"></div>
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-bold text-xl text-foreground group-hover:text-coral transition-colors duration-300">
                  Maximally Hack
                </span>
                <span className="text-xs text-muted-foreground font-medium tracking-wide">
                  Event Discovery & Teams
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.href} to={item.href} data-testid={item.testId}>
                    <div
                      className={`group flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 hover:bg-coral/10 hover:shadow-sm ${
                        isActive(item.href)
                          ? "bg-coral/15 text-coral font-medium shadow-sm"
                          : "text-foreground hover:text-coral"
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 transition-all duration-300 ${
                          isActive(item.href)
                            ? "text-coral"
                            : "text-muted-foreground group-hover:text-coral"
                        }`}
                      />
                      <span className="font-medium text-sm">{item.label}</span>
                      {isActive(item.href) && (
                        <div className="w-1.5 h-1.5 bg-coral rounded-full"></div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center space-x-4">
              <ThemeToggle />
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-10 w-10 rounded-full hover:ring-2 hover:ring-coral/20 transition-all duration-300"
                    >
                      <Avatar className="h-10 w-10 ring-2 ring-coral/20">
                        <AvatarImage
                          src={user.user_metadata?.avatar_url || undefined}
                          alt={user.user_metadata?.full_name || user.email || "User"}
                        />
                        <AvatarFallback className="bg-gradient-to-br from-coral to-coral/80 text-white font-semibold">
                          {user.user_metadata?.full_name
                            ? user.user_metadata.full_name[0].toUpperCase()
                            : user.email?.[0]?.toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-mint rounded-full border-2 border-background"></div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-64 p-2" align="end">
                    <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-coral/5 to-sky/5 rounded-lg mb-2">
                      <Avatar className="h-12 w-12">
                        <AvatarImage
                          src={user.user_metadata?.avatar_url || undefined}
                        />
                        <AvatarFallback className="bg-gradient-to-br from-coral to-coral/80 text-white font-semibold text-lg">
                          {user.user_metadata?.full_name
                            ? user.user_metadata.full_name[0].toUpperCase()
                            : user.email?.[0]?.toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-semibold text-foreground">
                          {user.user_metadata?.full_name || user.email}
                        </p>
                        <p className="text-sm text-muted-foreground truncate">
                          {user.email}
                        </p>
                      <Badge variant="secondary" className="mt-1 text-xs">
                        {user?.role === 'organizer' ? '🏢' : user?.role === 'judge' ? '⚖️' : '👨‍💻'} {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                      </Badge>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link
                        to={`/profile/${user?.username || user?.id}`}
                        className="flex items-center p-3 rounded-lg hover:bg-coral/5"
                      >
                        <User className="mr-3 h-4 w-4 text-coral" />
                        <span className="font-medium">My Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        to="/dashboard"
                        className="flex items-center p-3 rounded-lg hover:bg-sky/5"
                      >
                        <Settings className="mr-3 h-4 w-4 text-sky" />
                        <span className="font-medium">Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {/* Test Role Switcher */}
                    <div className="px-3 py-2">
                      <p className="text-xs font-medium text-muted-foreground mb-2">🎭 Test Mode - Switch Role:</p>
                      <div className="flex gap-1">
                        <Button 
                          size="sm" 
                          variant={user?.role === 'participant' ? 'default' : 'outline'} 
                          className="text-xs h-6 px-2"
                          onClick={() => switchTestRole('participant')}
                        >
                          👨‍💻
                        </Button>
                        <Button 
                          size="sm" 
                          variant={user?.role === 'organizer' ? 'default' : 'outline'} 
                          className="text-xs h-6 px-2"
                          onClick={() => switchTestRole('organizer')}
                        >
                          🏢
                        </Button>
                        <Button 
                          size="sm" 
                          variant={user?.role === 'judge' ? 'default' : 'outline'} 
                          className="text-xs h-6 px-2"
                          onClick={() => switchTestRole('judge')}
                        >
                          ⚖️
                        </Button>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={async () => {
                        await signOut();
                      }}
                      className="flex items-center p-3 rounded-lg hover:bg-red-50 text-red-600"
                    >
                      <LogOut className="mr-3 h-4 w-4" />
                      <span className="font-medium">Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link to="/login">
                    <Button
                      variant="outline"
                      className="border-coral text-coral hover:bg-coral/10 font-medium transition-all duration-300 hover:shadow-sm"
                      data-testid="button-login"
                    >
                      Login
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button className="bg-gradient-to-r from-coral to-coral/90 hover:from-coral/90 hover:to-coral/80 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Join Now
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu */}
            <div className="lg:hidden">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-coral/10 transition-colors duration-300"
                    data-testid="button-mobile-menu"
                  >
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="p-0">
                  <div className="flex flex-col h-full">
                    {/* Mobile Nav Links */}
                    <div className="flex-1 p-6 space-y-2">
                      {navItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.href}
                            to={item.href}
                            onClick={() => setIsOpen(false)}
                          >
                            <div
                              className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-300 hover:bg-coral/10 ${
                                isActive(item.href)
                                  ? "bg-coral/15 text-coral"
                                  : "text-foreground"
                              }`}
                            >
                              <Icon className="w-5 h-5" />
                              <span className="font-medium">{item.label}</span>
                            </div>
                          </Link>
                        );
                      })}
                    </div>

                    {/* Mobile Footer Auth */}
                    <div className="p-6 border-t bg-gradient-to-r from-mint/5 to-yellow/5">
                      {user ? (
                        <div className="space-y-3">
                          <Link to="/dashboard" onClick={() => setIsOpen(false)}>
                            <Button className="w-full">Dashboard</Button>
                          </Link>
                          <Button
                            onClick={async () => {
                              await signOut();
                              setIsOpen(false);
                            }}
                            className="w-full bg-red-500 hover:bg-red-600 text-white"
                          >
                            <LogOut className="w-4 h-4 mr-2" />
                            Log out
                          </Button>
                        </div>
                      ) : (
                        <div className="flex flex-col space-y-4">
                          <Link to="/login" onClick={() => setIsOpen(false)}>
                            <Button
                              variant="outline"
                              className="w-full h-14 rounded-xl border border-coral hover:bg-coral/10 text-coral flex items-center justify-center font-medium transition-all duration-300"
                            >
                              Login
                            </Button>
                          </Link>
                          <Link to="/signup" onClick={() => setIsOpen(false)}>
                            <Button className="w-full h-14 rounded-xl bg-gradient-to-r from-coral to-coral/90 hover:from-coral/90 hover:to-coral/80 text-white font-medium flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300">
                              <Sparkles className="w-4 h-4 mr-2" />
                              Join Now
                            </Button>
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
