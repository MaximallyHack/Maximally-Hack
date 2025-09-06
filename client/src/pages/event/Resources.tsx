import { useEvent } from '@/contexts/EventContext';

export default function Resources() {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-foreground">Resources</h2>
      <p className="text-muted-foreground">
        Tools, APIs, and resources to help you build your project.
      </p>
    </div>
  );
}