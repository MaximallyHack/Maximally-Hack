import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface JoinRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (message: string) => void;
  projectTitle: string;
}

export default function JoinRequestModal({ isOpen, onClose, onSubmit, projectTitle }: JoinRequestModalProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    onSubmit(message);
    setMessage("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request to Join Project</DialogTitle>
          <DialogDescription>
            Send a message to the project owner requesting to join "{projectTitle}"
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell them why you'd like to join this project..."
              rows={4}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Send Request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
