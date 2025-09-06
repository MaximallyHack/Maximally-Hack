import { useEvent } from '@/contexts/EventContext';

export default function Sponsors() {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-foreground">Sponsors</h2>
      <p className="text-muted-foreground">
        Meet the companies and organizations supporting this hackathon.
      </p>
    </div>
  );
}