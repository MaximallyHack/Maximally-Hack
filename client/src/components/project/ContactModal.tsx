import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { subject: string; message: string }) => void;
  projectTitle: string;
}

export default function ContactModal({ isOpen, onClose, onSubmit, projectTitle }: ContactModalProps) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    onSubmit({ subject, message });
    setSubject("");
    setMessage("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Contact Project Owner</DialogTitle>
          <DialogDescription>
            Send a message about "{projectTitle}"
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="What's this about?"
            />
          </div>
          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Your message..."
              rows={4}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Send Message
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
