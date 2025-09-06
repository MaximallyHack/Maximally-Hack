import { useEffect } from 'react';
import { useLocation } from 'wouter';

export function HashRedirect() {
  const [location, navigate] = useLocation();

  useEffect(() => {
    // Check if we're on an event page with a hash
    const match = location.match(/^\/e\/([^\/]+)$/);
    if (match && window.location.hash) {
      const slug = match[1];
      const hash = window.location.hash.substring(1); // Remove #
      
      // Map old hash routes to new paths
      const hashToPathMap: Record<string, string> = {
        'prizes': '/prizes',
        'rules': '/rules',
        'timeline': '/timeline',
        'judging': '/judging',
        'submissions': '/submissions',
        'teams': '/teams',
        'people': '/people',
        'judges': '/people/judges',
        'mentors': '/people/mentors',
        'help': '/help',
        'resources': '/resources',
        'sponsors': '/sponsors',
        'about': '/about'
      };
      
      const newPath = hashToPathMap[hash];
      if (newPath) {
        // Remove the hash and navigate to the new path
        window.history.replaceState(null, '', window.location.pathname);
        navigate(`/e/${slug}${newPath}`);
      }
    }
  }, [location, navigate]);

  return null;
}