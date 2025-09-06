import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";

interface Team {
  id: string;
  name: string;
  description: string;
  members: { id: string; name: string; avatar: string }[];
  maxMembers: number;
}

interface TeamCardProps {
  team: Team;
  onEdit: (team: Team) => void;
  onDelete: (teamId: string) => void;
}

export function TeamCard({ team, onEdit, onDelete }: TeamCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTeam, setEditedTeam] = useState<Team>(team);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setEditedTeam((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onEdit(editedTeam);
    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">{team.name}</CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => setIsEditing(true)}>
              Edit
            </DropdownMenuMenuItem>
            <DropdownMenuItem onSelect={() => onDelete(team.id)}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <p className="text-[#6C6C6C] dark:text-muted-foreground text-sm mb-3">{team.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex -space-x-4 overflow-hidden">
            {team.members.slice(0, 4).map((member) => (
              <Avatar key={member.id}>
                <AvatarImage src={member.avatar} alt={member.name} />
                <AvatarFallback>{member.name[0]}</AvatarFallback>
              </Avatar>
            ))}
            {team.members.length > 4 && (
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 text-sm font-medium text-gray-800 dark:text-gray-200">
                +{team.members.length - 4}
              </div>
            )}
          </div>
          <span className="text-sm text-[#6C6C6C] dark:text-muted-foreground">
            {team.members.length}/{team.maxMembers} members
          </span>
        </div>
      </CardContent>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Team</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                value={editedTeam.name}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                name="description"
                value={editedTeam.description}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="maxMembers" className="text-right">
                Max Members
              </Label>
              <Input
                id="maxMembers"
                name="maxMembers"
                type="number"
                value={editedTeam.maxMembers}
                onChange={(e) =>
                  setEditedTeam((prev) => ({
                    ...prev,
                    maxMembers: parseInt(e.target.value, 10),
                  }))
                }
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" onClick={handleSave}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}