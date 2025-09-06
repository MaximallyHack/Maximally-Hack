import { createContext, useContext, ReactNode, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { queryClient } from '@/lib/queryClient';

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

  // Prefetch related data when event loads to improve sub-page navigation
  useEffect(() => {
    if (event?.id) {
      // Prefetch teams and submissions data
      queryClient.prefetchQuery({
        queryKey: ['teams', event.id],
        queryFn: () => api.getTeams(event.id),
        staleTime: 5 * 60 * 1000,
      });

      queryClient.prefetchQuery({
        queryKey: ['submissions', event.id],
        queryFn: () => api.getSubmissions(event.id),
        staleTime: 5 * 60 * 1000,
      });
    }
  }, [event?.id]);

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