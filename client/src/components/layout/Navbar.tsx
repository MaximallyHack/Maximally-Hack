import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Rocket, Menu, Plus } from "lucide-react";

export default function Navbar() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { href: "/", label: "Home", testId: "nav-home" },
    { href: "/explore", label: "Explore", testId: "nav-explore" },
    { href: "/projects", label: "Projects", testId: "nav-projects" },
    { href: "/judges", label: "Judges", testId: "nav-judges" },
    { href: "/leaders", label: "Leaderboards", testId: "nav-leaders" },
  ];

  const isActive = (href: string) => {
    if (href === "/" && location === "/") return true;
    if (href !== "/" && location.startsWith(href)) return true;
    return false;
  };

  return (
    <nav className="sticky top-0 z-50 bg-cream/95 backdrop-blur-sm border-b border-soft-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 hover-scale" data-testid="logo-link">
            <div className="w-8 h-8 bg-coral rounded-full flex items-center justify-center">
              <Rocket className="w-4 h-4 text-white" />
            </div>
            <span className="font-heading font-bold text-xl text-text-dark">Maximally Hack</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} data-testid={item.testId}>
                <span className={`transition-colors hover:text-coral ${
                  isActive(item.href) ? "text-coral font-medium" : "text-text-dark"
                }`}>
                  {item.label}
                </span>
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/login">
              <Button variant="outline" className="bg-mint border-mint text-text-dark hover:bg-mint/80" data-testid="button-login">
                Login
              </Button>
            </Link>
            <Link href="/organizer/events/new">
              <Button className="bg-coral hover:bg-coral/80 text-white" data-testid="button-create-event">
                <Plus className="w-4 h-4 mr-2" />
                Create Event
              </Button>
            </Link>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" data-testid="button-mobile-menu">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-cream">
                <div className="flex flex-col space-y-4 mt-8">
                  {navItems.map((item) => (
                    <Link 
                      key={item.href} 
                      href={item.href} 
                      onClick={() => setIsOpen(false)}
                      data-testid={`mobile-${item.testId}`}
                    >
                      <span className={`block py-2 transition-colors hover:text-coral ${
                        isActive(item.href) ? "text-coral font-medium" : "text-text-dark"
                      }`}>
                        {item.label}
                      </span>
                    </Link>
                  ))}
                  <div className="pt-4 border-t border-soft-gray space-y-3">
                    <Link href="/login" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" className="w-full bg-mint border-mint text-text-dark hover:bg-mint/80" data-testid="mobile-button-login">
                        Login
                      </Button>
                    </Link>
                    <Link href="/organizer/events/new" onClick={() => setIsOpen(false)}>
                      <Button className="w-full bg-coral hover:bg-coral/80 text-white" data-testid="mobile-button-create-event">
                        <Plus className="w-4 h-4 mr-2" />
                        Create Event
                      </Button>
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
