import { Button } from "./button";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Plus, Search, Calendar, Users, Trophy, Lightbulb } from "lucide-react";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({ icon, title, description, action, className = "" }: EmptyStateProps) {
  return (
    <Card className={`text-center ${className}`}>
      <CardContent className="py-12">
        <div className="flex flex-col items-center space-y-4">
          {icon && (
            <div className="p-4 bg-muted rounded-full">
              {icon}
            </div>
          )}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-muted-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">{description}</p>
          </div>
          {action && (
            <Button onClick={action.onClick} className="mt-4">
              {action.label}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Predefined empty states for common use cases
export function NoEventsFound({ onCreateEvent }: { onCreateEvent?: () => void }) {
  return (
    <EmptyState
      icon={<Calendar className="h-8 w-8 text-muted-foreground" />}
      title="No hackathons to explore"
      description="Be the first to create an amazing hackathon experience! Start building your community today."
      action={onCreateEvent ? {
        label: "Create Hackathon",
        onClick: onCreateEvent
      } : undefined}
    />
  );
}

export function NoFeaturedEvents() {
  return (
    <EmptyState
      icon={<Trophy className="h-8 w-8 text-muted-foreground" />}
      title="No hackathons to feature"
      description="Featured hackathons will appear here once events are created and gain popularity."
    />
  );
}

export function NoTeamsFound({ onCreateTeam }: { onCreateTeam?: () => void }) {
  return (
    <EmptyState
      icon={<Users className="h-8 w-8 text-muted-foreground" />}
      title="No teams found"
      description="Start your hackathon journey by creating a team or joining others who share your interests!"
      action={onCreateTeam ? {
        label: "Create Team",
        onClick: onCreateTeam
      } : undefined}
    />
  );
}

export function NoSubmissionsFound({ onCreateSubmission }: { onCreateSubmission?: () => void }) {
  return (
    <EmptyState
      icon={<Lightbulb className="h-8 w-8 text-muted-foreground" />}
      title="No submissions yet"
      description="Be the first to showcase your innovative project! Submit your work and inspire others."
      action={onCreateSubmission ? {
        label: "Submit Project",
        onClick: onCreateSubmission
      } : undefined}
    />
  );
}

export function NoProjectsFound() {
  return (
    <EmptyState
      icon={<Lightbulb className="h-8 w-8 text-muted-foreground" />}
      title="No projects to showcase"
      description="Amazing projects will appear here once participants start submitting their innovative solutions."
    />
  );
}

export function NoJudgesFound() {
  return (
    <EmptyState
      icon={<Users className="h-8 w-8 text-muted-foreground" />}
      title="No judges available"
      description="Expert judges will be listed here once they join the platform to evaluate submissions."
    />
  );
}

export function NoSearchResults({ query }: { query: string }) {
  return (
    <EmptyState
      icon={<Search className="h-8 w-8 text-muted-foreground" />}
      title="No results found"
      description={`No hackathons match "${query}". Try adjusting your search terms or filters.`}
    />
  );
}

export function LoadingEmptyState() {
  return (
    <Card className="text-center">
      <CardContent className="py-12">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </CardContent>
    </Card>
  );
}
