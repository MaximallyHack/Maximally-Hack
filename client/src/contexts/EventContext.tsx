import { createContext, useContext, ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

interface EventContextType {
  event: any | null;
  isLoading: boolean;
  error: any;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

interface EventProviderProps {
  children: ReactNode;
  slug: string;
}

export function EventProvider({ children, slug }: EventProviderProps) {
  const { data: event, isLoading, error } = useQuery({
    queryKey: ['events', slug],
    queryFn: () => api.getEvent(slug),
    enabled: !!slug,
  });

  return (
    <EventContext.Provider value={{ event, isLoading, error }}>
      {children}
    </EventContext.Provider>
  );
}

export function useEvent() {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error('useEvent must be used within an EventProvider');
  }
  return context;
}