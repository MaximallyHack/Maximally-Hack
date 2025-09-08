import { CreateEventForm } from '../components/CreateEventForm';
import { useLocation } from 'wouter';

export default function CreateEventPage() {
  const [, navigate] = useLocation();

  const handleSuccess = () => {
    navigate('/explore');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-cream to-sky/10 py-12">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-text-dark mb-4">
            Create Your Hackathon
          </h1>
          <p className="text-lg text-text-muted max-w-2xl mx-auto">
            Launch your own hackathon and bring together innovators to build amazing projects
          </p>
        </div>
        
        <CreateEventForm onSuccess={handleSuccess} />
      </div>
    </div>
  );
}
