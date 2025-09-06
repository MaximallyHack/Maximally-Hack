import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Rocket, Menu, User, LogOut, Settings } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function Navbar() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { user, isLoggedIn, logout } = useAuth();

  const navItems = [
    { href: "/explore", label: "Explore", testId: "nav-explore" },
    { href: "/projects", label: "Projects", testId: "nav-projects" },
    { href: "/judges", label: "The Jury Board", testId: "nav-jury-board" },
  ];

  const isActive = (href: string) => {
    if (href === "/" && location === "/") return true;
    if (href !== "/" && location.startsWith(href)) return true;
    return false;
  };

  return (
    <>
      {/* Test Mode Badge */}
      <div className="text-center py-1 px-4 text-sm font-medium text-[#273f42] bg-[#a6e3bc]">
        🧪 Test Mode - All data is simulated for preview
      </div>
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 hover-scale" data-testid="logo-link">
            <div className="w-8 h-8 bg-coral rounded-full flex items-center justify-center">
              <Rocket className="w-4 h-4 text-white" />
            </div>
            <span className="font-heading font-bold text-xl text-foreground">Maximally Hack</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-6">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} data-testid={item.testId}>
                <span className={`transition-colors hover:text-coral ${
                  isActive(item.href) ? "text-coral font-medium" : "text-foreground"
                }`}>
                  {item.label}
                </span>
              </Link>
            ))}
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-3">
              <ThemeToggle />
              {isLoggedIn ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-coral text-white">
                          {user?.fullName?.charAt(0) || user?.username?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">{user?.fullName || user?.username}</p>
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        My Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="flex items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        Profile Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="flex items-center text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link href="/login">
                    <Button variant="outline" className="border-coral text-coral hover:bg-coral/10" data-testid="button-login">
                      Login
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button className="bg-coral hover:bg-coral/80 text-white" data-testid="button-signup">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu */}
            <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" data-testid="button-mobile-menu">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col space-y-4 mt-8">
                  <div className="flex items-center justify-between pb-2">
                    <span className="font-medium text-foreground">Theme</span>
                    <ThemeToggle />
                  </div>
                  {navItems.map((item) => (
                    <Link 
                      key={item.href} 
                      href={item.href} 
                      onClick={() => setIsOpen(false)}
                      data-testid={`mobile-${item.testId}`}
                    >
                      <span className={`block py-2 transition-colors hover:text-coral ${
                        isActive(item.href) ? "text-coral font-medium" : "text-foreground"
                      }`}>
                        {item.label}
                      </span>
                    </Link>
                  ))}
                  <div className="pt-4 border-t border-border space-y-3">
                    {isLoggedIn ? (
                      <>
                        <div className="px-2 py-2">
                          <p className="font-medium text-foreground">{user?.fullName || user?.username}</p>
                          <p className="text-sm text-muted-foreground">{user?.email}</p>
                        </div>
                        <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                          <Button variant="outline" className="w-full border-coral text-coral hover:bg-coral/10">
                            <User className="w-4 h-4 mr-2" />
                            My Dashboard
                          </Button>
                        </Link>
                        <Button onClick={() => { logout(); setIsOpen(false); }} className="w-full bg-red-500 hover:bg-red-600 text-white">
                          <LogOut className="w-4 h-4 mr-2" />
                          Log out
                        </Button>
                      </>
                    ) : (
                      <>
                        <Link href="/login" onClick={() => setIsOpen(false)}>
                          <Button variant="outline" className="w-full border-coral text-coral hover:bg-coral/10" data-testid="mobile-button-login">
                            Login
                          </Button>
                        </Link>
                        <Link href="/signup" onClick={() => setIsOpen(false)}>
                          <Button className="w-full bg-coral hover:bg-coral/80 text-white" data-testid="mobile-button-signup">
                            Sign Up
                          </Button>
                        </Link>
                      </>
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
