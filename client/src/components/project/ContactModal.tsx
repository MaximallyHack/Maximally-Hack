import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { MessageSquare, Send, Mail, HelpCircle, Heart, Lightbulb } from "lucide-react";
import { insertProjectMessageSchema, type InsertProjectMessage } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

interface ContactModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: {
    id: string;
    title: string;
    ownerName: string;
    contactMethod: string;
    contactEmail?: string;
  };
}

const subjectPresets = [
  { value: "question", label: "Question", icon: HelpCircle },
  { value: "collaboration", label: "Collaboration", icon: Heart },
  { value: "feedback", label: "Feedback", icon: Lightbulb },
];

export default function ContactModal({ open, onOpenChange, project }: ContactModalProps) {
  const { toast } = useToast();
  const [includeContact, setIncludeContact] = useState(false);

  const form = useForm<InsertProjectMessage>({
    resolver: zodResolver(insertProjectMessageSchema.extend({
      fromUserId: insertProjectMessageSchema.shape.fromUserId.optional(),
      fromEmail: insertProjectMessageSchema.shape.fromEmail.optional(),
    })),
    defaultValues: {
      projectId: project.id,
      fromUserId: "mock-user-2", // Mock user for demo
      fromName: "Jordan Smith",
      fromEmail: "",
      subject: "",
      message: "",
    }
  });

  const submitMutation = useMutation({
    mutationFn: async (data: InsertProjectMessage) => {
      // Mock API call for demo
      await new Promise(resolve => setTimeout(resolve, 800));
      return { id: 'message-' + Date.now(), ...data };
    },
    onSuccess: () => {
      toast({
        title: "Message Sent! 📩",
        description: `Your message has been sent to ${project.ownerName}. They'll get back to you soon!`,
      });
      
      onOpenChange(false);
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertProjectMessage) => {
    submitMutation.mutate(data);
  };

  const selectedPreset = subjectPresets.find(preset => preset.value === form.watch("subject"));

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="bg-white sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="font-heading text-xl text-text-dark flex items-center">
            <MessageSquare className="w-5 h-5 mr-2 text-mint" />
            Send a Quick Note
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 mb-4">
          <p className="text-sm text-text-muted">
            Reach out to <strong>{project.ownerName}</strong> about <strong>{project.title}</strong>
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>What's this about?</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-subject">
                        <SelectValue placeholder="Choose a subject" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {subjectPresets.map((preset) => (
                        <SelectItem key={preset.value} value={preset.value}>
                          <div className="flex items-center">
                            <preset.icon className="w-4 h-4 mr-2" />
                            {preset.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder={
                        selectedPreset?.value === "question" 
                          ? "I have a question about..."
                          : selectedPreset?.value === "collaboration"
                          ? "I'd love to collaborate on..."
                          : selectedPreset?.value === "feedback"
                          ? "Great work! I wanted to share some thoughts..."
                          : "Your message here..."
                      }
                      className="h-32"
                      {...field} 
                      data-testid="textarea-message"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center space-x-2">
              <Switch
                id="include-contact"
                checked={includeContact}
                onCheckedChange={setIncludeContact}
                data-testid="switch-include-contact"
              />
              <Label htmlFor="include-contact" className="text-sm">
                Include my contact info for follow-up
              </Label>
            </div>

            {includeContact && (
              <FormField
                control={form.control}
                name="fromEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your email</FormLabel>
                    <FormControl>
                      <Input 
                        type="email"
                        placeholder="your@email.com" 
                        {...field} 
                        data-testid="input-contact-email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1"
                data-testid="button-cancel-message"
              >
                Cancel
              </Button>
              
              <Button
                type="submit"
                disabled={submitMutation.isPending || !form.watch("subject") || !form.watch("message")}
                className="bg-mint text-text-dark hover:bg-mint/80 flex-1"
                data-testid="button-send-message"
              >
                <Send className="w-4 h-4 mr-2" />
                {submitMutation.isPending ? "Sending..." : "Send"}
              </Button>
            </div>
          </form>
        </Form>

        {project.contactMethod === 'email' && project.contactEmail && (
          <div className="mt-6 p-4 bg-soft-gray/30 rounded-lg">
            <p className="text-xs text-text-muted mb-2">
              You can also reach out directly:
            </p>
            <Button 
              asChild
              variant="ghost" 
              size="sm" 
              className="h-auto p-0 text-sky hover:text-sky/80"
            >
              <a href={`mailto:${project.contactEmail}`}>
                <Mail className="w-3 h-3 mr-1" />
                {project.contactEmail}
              </a>
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}