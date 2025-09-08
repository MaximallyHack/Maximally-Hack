import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useAuth } from '../contexts/SupabaseAuthContext';
import { api } from '../lib/api';
import { useToast } from '../hooks/use-toast';

interface CreateEventFormProps {
  onSuccess?: () => void;
}

export function CreateEventForm({ onSuccess }: CreateEventFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    location: 'Online',
    format: 'online' as 'online' | 'in-person' | 'hybrid',
    maxTeamSize: 4,
    prizePool: 0
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to create an event',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Generate a slug from title
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      
      const eventData = {
        ...formData,
        slug,
        status: 'upcoming' as const,
        participantCount: 0,
        organizerId: user.id,
        tracks: ['General'],
        tags: ['Hackathon'],
        judges: [],
        sponsors: [],
        prizes: formData.prizePool > 0 ? [
          { place: 1, amount: formData.prizePool, title: 'First Place', description: 'Winner takes all!' }
        ] : []
      };

      await api.createEvent(eventData);
      
      toast({
        title: 'Success!',
        description: 'Event created successfully!'
      });
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        location: 'Online',
        format: 'online',
        maxTeamSize: 4,
        prizePool: 0
      });
      
      onSuccess?.();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create event',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="py-6">
          <p className="text-center text-muted-foreground">
            Please log in to create an event.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Event</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Event Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="AI Innovation Challenge 2024"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Describe your hackathon..."
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date *</Label>
              <Input
                id="startDate"
                type="datetime-local"
                value={formData.startDate}
                onChange={(e) => handleChange('startDate', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date *</Label>
              <Input
                id="endDate"
                type="datetime-local"
                value={formData.endDate}
                onChange={(e) => handleChange('endDate', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="format">Format</Label>
            <Select value={formData.format} onValueChange={(value) => handleChange('format', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="in-person">In-Person</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder="Online, San Francisco, etc."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="maxTeamSize">Max Team Size</Label>
              <Input
                id="maxTeamSize"
                type="number"
                min="1"
                max="10"
                value={formData.maxTeamSize}
                onChange={(e) => handleChange('maxTeamSize', parseInt(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="prizePool">Prize Pool ($)</Label>
              <Input
                id="prizePool"
                type="number"
                min="0"
                value={formData.prizePool}
                onChange={(e) => handleChange('prizePool', parseInt(e.target.value))}
                placeholder="0"
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create Event'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
