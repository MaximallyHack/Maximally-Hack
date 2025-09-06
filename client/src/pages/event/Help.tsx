import { useEvent } from '@/contexts/EventContext';

export default function Help() {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-foreground">Help & Support</h2>
      <p className="text-muted-foreground">
        Get help and support during the hackathon.
      </p>
    </div>
  );
}