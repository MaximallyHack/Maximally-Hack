import { useEvent } from '@/contexts/EventContext';

export default function About() {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-foreground">About</h2>
      <p className="text-muted-foreground">
        Learn more about this hackathon and its organizers.
      </p>
    </div>
  );
}