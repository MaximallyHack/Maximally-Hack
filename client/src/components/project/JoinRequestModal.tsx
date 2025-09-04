import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Users, Send } from "lucide-react";
import { insertJoinRequestSchema, type InsertJoinRequest } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import Confetti from "@/components/ui/confetti";

interface JoinRequestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: {
    id: string;
    title: string;
    ownerName: string;
  };
  openRoles: Array<{
    id: string;
    title: string;
    description?: string;
  }>;
}

export default function JoinRequestModal({ open, onOpenChange, project, openRoles }: JoinRequestModalProps) {
  const { toast } = useToast();
  const [showConfetti, setShowConfetti] = useState(false);

  const form = useForm<InsertJoinRequest>({
    resolver: zodResolver(insertJoinRequestSchema.extend({
      pitch: insertJoinRequestSchema.shape.pitch.optional(),
      portfolioLink: insertJoinRequestSchema.shape.portfolioLink.optional(),
    })),
    defaultValues: {
      projectId: project.id,
      userId: "mock-user-2", // Mock user for demo
      userName: "Jordan Smith",
      userAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=face",
      roleRequested: "",
      pitch: "",
      portfolioLink: "",
      status: "pending",
    }
  });

  const submitMutation = useMutation({
    mutationFn: async (data: InsertJoinRequest) => {
      // Mock API call for demo
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { id: 'request-' + Date.now(), ...data };
    },
    onSuccess: () => {
      setShowConfetti(true);
      toast({
        title: "🎉 Request Sent!",
        description: `Your join request has been sent to ${project.ownerName}. They'll review it soon!`,
      });
      
      setTimeout(() => {
        setShowConfetti(false);
        onOpenChange(false);
        form.reset();
      }, 2000);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send join request. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertJoinRequest) => {
    submitMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white">
        {showConfetti && <Confetti active={true} />}
        
        <DialogHeader>
          <DialogTitle className="font-heading text-xl text-text-dark flex items-center">
            <Users className="w-5 h-5 mr-2 text-coral" />
            Join the Team
          </DialogTitle>
        </DialogHeader>

        <div className="mb-4">
          <p className="text-sm text-text-muted">
            Send a request to join <strong>{project.title}</strong> and start collaborating with the team!
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="roleRequested"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role you want to play</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-role-requested">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {openRoles.map((role) => (
                        <SelectItem key={role.id} value={role.title}>
                          {role.title}
                        </SelectItem>
                      ))}
                      <SelectItem value="other">Other (specify in pitch)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pitch"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Short pitch</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Tell them why you'd be a great addition to the team..."
                      className="h-24"
                      {...field} 
                      data-testid="textarea-pitch"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="portfolioLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Portfolio/Work link (optional)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="https://github.com/yourname or portfolio link" 
                      {...field} 
                      data-testid="input-portfolio-link"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1"
                data-testid="button-cancel-join"
              >
                Cancel
              </Button>
              
              <Button
                type="submit"
                disabled={submitMutation.isPending || !form.watch("roleRequested")}
                className="bg-coral text-white hover:bg-coral/80 flex-1"
                data-testid="button-send-request"
              >
                <Send className="w-4 h-4 mr-2" />
                {submitMutation.isPending ? "Sending..." : "Send Request"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}