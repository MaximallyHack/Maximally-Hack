import { Link } from "wouter";
import { Rocket } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-soft-gray border-t border-soft-gray mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-coral rounded-full flex items-center justify-center">
                <Rocket className="w-4 h-4 text-white" />
              </div>
              <span className="font-heading font-bold text-xl text-text-dark">Maximally Hack</span>
            </div>
            <p className="text-text-muted text-sm">
              The friendliest hackathon platform where great ideas come to life.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h3 className="font-heading font-semibold text-text-dark mb-4">Platform</h3>
            <ul className="space-y-2 text-sm text-text-muted">
              <li>
                <Link href="/explore" className="hover:text-coral transition-colors" data-testid="footer-explore">
                  Explore Events
                </Link>
              </li>
              <li>
                <Link href="/organizer" className="hover:text-coral transition-colors" data-testid="footer-organize">
                  Organize with Us
                </Link>
              </li>
              <li>
                <Link href="/judges" className="hover:text-coral transition-colors" data-testid="footer-judges">
                  Judge Hub
                </Link>
              </li>
              <li>
                <Link href="/leaders" className="hover:text-coral transition-colors" data-testid="footer-leaderboards">
                  Leaderboards
                </Link>
              </li>
              <li>
                <Link href="/sponsors" className="hover:text-coral transition-colors" data-testid="footer-sponsors">
                  Sponsors
                </Link>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="font-heading font-semibold text-text-dark mb-4">Community</h3>
            <ul className="space-y-2 text-sm text-text-muted">
              <li>
                <a href="#" className="hover:text-coral transition-colors" data-testid="footer-discord">
                  Discord
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-coral transition-colors" data-testid="footer-twitter">
                  Twitter
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-coral transition-colors" data-testid="footer-github">
                  GitHub
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-coral transition-colors" data-testid="footer-blog">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-heading font-semibold text-text-dark mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-text-muted">
              <li>
                <Link href="/help" className="hover:text-coral transition-colors" data-testid="footer-help">
                  Help Center
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-coral transition-colors" data-testid="footer-contact">
                  Contact Us
                </a>
              </li>
              <li>
                <Link href="/legal/privacy" className="hover:text-coral transition-colors" data-testid="footer-privacy">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/legal/terms" className="hover:text-coral transition-colors" data-testid="footer-terms">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="crayon-squiggle my-8"></div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-text-muted">
          <p>&copy; 2024 Maximally Hack. Made with ❤️ for the hacker community.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-coral transition-colors" data-testid="footer-social-twitter">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" className="hover:text-coral transition-colors" data-testid="footer-social-github">
              <i className="fab fa-github"></i>
            </a>
            <a href="#" className="hover:text-coral transition-colors" data-testid="footer-social-discord">
              <i className="fab fa-discord"></i>
            </a>
            <a href="#" className="hover:text-coral transition-colors" data-testid="footer-social-linkedin">
              <i className="fab fa-linkedin"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
