import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft,
  ArrowRight,
  Save,
  Send,
  ExternalLink,
  Github,
  Star,
  Trophy,
  Users,
  Clock,
  ChevronLeft,
  ChevronRight,
  Target,
  Code,
  Lightbulb,
  Presentation,
  CheckCircle
} from "lucide-react";
import { api } from "@/lib/api";
import type { Submission } from "@/lib/api";

interface ScorePanelProps {
  submissionId: string;
  onBack: () => void;
}

interface Scores {
  impact: number;
  technical: number;
  creativity: number;
  presentation: number;
}

interface ScoringCriteria {
  id: keyof Scores;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  weight: number;
}

const criteriaConfig: ScoringCriteria[] = [
  {
    id: 'impact',
    name: 'Impact & Innovation',
    description: 'How well does this solution address the problem and create meaningful impact?',
    icon: <Target className="w-5 h-5" />,
    color: 'coral',
    weight: 30
  },
  {
    id: 'technical', 
    name: 'Technical Quality',
    description: 'Code quality, architecture, and technical execution of the solution.',
    icon: <Code className="w-5 h-5" />,
    color: 'sky',
    weight: 25
  },
  {
    id: 'creativity',
    name: 'Creativity & Design', 
    description: 'Originality of the idea and quality of user experience design.',
    icon: <Lightbulb className="w-5 h-5" />,
    color: 'mint',
    weight: 25
  },
  {
    id: 'presentation',
    name: 'Clarity & Communication',
    description: 'How well is the project explained and demonstrated?',
    icon: <Presentation className="w-5 h-5" />,
    color: 'yellow',
    weight: 20
  }
];

export default function ScorePanel({ submissionId, onBack }: ScorePanelProps) {
  const [scores, setScores] = useState<Scores>({
    impact: 5,
    technical: 5, 
    creativity: 5,
    presentation: 5
  });
  const [feedback, setFeedback] = useState("");
  const [isDraft, setIsDraft] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { toast } = useToast();

  const { data: submission, isLoading } = useQuery({
    queryKey: ['submission', submissionId],
    queryFn: () => api.getSubmission(submissionId),
    enabled: !!submissionId,
  });

  const calculateTotal = () => {
    return criteriaConfig.reduce((total, criteria) => {
      return total + (scores[criteria.id] * criteria.weight / 100);
    }, 0);
  };

  const handleScoreChange = (criteriaId: keyof Scores, value: number[]) => {
    setScores(prev => ({ ...prev, [criteriaId]: value[0] }));
  };

  const handleSaveDraft = () => {
    setIsDraft(true);
    toast({
      title: "Draft saved! 💾",
      description: "Your scoring progress has been saved.",
    });
  };

  const handleSubmitScore = () => {
    setIsDraft(false);
    toast({
      title: "Score submitted! ⭐",
      description: "Your evaluation has been submitted successfully.",
    });
  };

  const nextImage = () => {
    if (submission?.images) {
      setCurrentImageIndex((prev) => (prev + 1) % submission.images.length);
    }
  };

  const prevImage = () => {
    if (submission?.images) {
      setCurrentImageIndex((prev) => (prev - 1 + submission.images.length) % submission.images.length);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-soft-gray rounded mb-4 w-1/4"></div>
            <div className="h-12 bg-soft-gray rounded mb-8 w-3/4"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-96 bg-soft-gray rounded-2xl"></div>
              <div className="h-96 bg-soft-gray rounded-2xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="min-h-screen bg-cream py-8 flex items-center justify-center">
        <Card className="bg-white rounded-2xl p-8 shadow-soft border border-soft-gray text-center">
          <div className="text-6xl mb-4">😵</div>
          <h3 className="font-heading font-semibold text-xl text-text-dark mb-2">Submission Not Found</h3>
          <p className="text-text-muted mb-6">The project you're trying to score doesn't exist.</p>
          <Button onClick={onBack} className="bg-coral text-white hover:bg-coral/80">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream py-8" data-testid="score-panel">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button 
            onClick={onBack}
            variant="outline" 
            className="border-coral text-coral hover:bg-coral/10 rounded-full px-6"
            data-testid="button-back"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm text-text-muted">Total Score</div>
              <div className="text-2xl font-bold text-coral">{calculateTotal().toFixed(1)}/10</div>
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={handleSaveDraft}
                variant="outline"
                className="border-mint text-mint hover:bg-mint/10 rounded-full px-6"
                data-testid="button-save-draft"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Draft
              </Button>
              <Button 
                onClick={handleSubmitScore}
                className="bg-coral text-white hover:bg-coral/80 rounded-full px-6"
                data-testid="button-submit-score"
              >
                <Send className="w-4 h-4 mr-2" />
                Submit Score
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Project Details */}
          <Card className="bg-white rounded-2xl p-8 shadow-soft border border-soft-gray">
            <div className="space-y-6">
              {/* Project Header */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <h1 className="font-heading font-bold text-2xl text-text-dark">{submission.title}</h1>
                  <Badge className="bg-mint/20 text-mint px-3 py-1 rounded-full text-sm border-0">
                    {submission.track}
                  </Badge>
                </div>
                <p className="text-lg text-text-muted mb-4">{submission.tagline}</p>
                
                <div className="flex gap-3 mb-6">
                  {submission.demoUrl && (
                    <Button className="bg-coral text-white hover:bg-coral/80 rounded-full" asChild>
                      <a href={submission.demoUrl} target="_blank" rel="noopener noreferrer" data-testid="button-view-demo">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Demo
                      </a>
                    </Button>
                  )}
                  {submission.githubUrl && (
                    <Button variant="outline" className="border-sky text-sky hover:bg-sky/10 rounded-full" asChild>
                      <a href={submission.githubUrl} target="_blank" rel="noopener noreferrer" data-testid="button-view-code">
                        <Github className="w-4 h-4 mr-2" />
                        View Code
                      </a>
                    </Button>
                  )}
                </div>
              </div>

              {/* Project Images */}
              {submission.images && submission.images.length > 0 && (
                <div>
                  <h3 className="font-heading font-semibold text-lg text-text-dark mb-4">Project Screenshots</h3>
                  <div className="relative">
                    <div className="aspect-video rounded-xl overflow-hidden">
                      <img 
                        src={submission.images[currentImageIndex]} 
                        alt={`${submission.title} screenshot ${currentImageIndex + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {submission.images.length > 1 && (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                          onClick={prevImage}
                          data-testid="button-prev-image"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                          onClick={nextImage}
                          data-testid="button-next-image"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                        <div className="flex justify-center gap-2 mt-4">
                          {submission.images.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentImageIndex(index)}
                              className={`w-2 h-2 rounded-full transition-colors ${
                                index === currentImageIndex ? 'bg-coral' : 'bg-soft-gray'
                              }`}
                              data-testid={`image-indicator-${index}`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Project Description */}
              <div>
                <h3 className="font-heading font-semibold text-lg text-text-dark mb-4">Description</h3>
                <p className="text-text-muted mb-4">{submission.description}</p>
              </div>

              {/* Tech Stack */}
              <div>
                <h3 className="font-heading font-semibold text-lg text-text-dark mb-4">Tech Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {submission.techStack.map(tech => (
                    <Badge key={tech} className="bg-sky/20 text-sky px-3 py-1 rounded-full text-sm border-0">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Key Features */}
              {submission.features && submission.features.length > 0 && (
                <div>
                  <h3 className="font-heading font-semibold text-lg text-text-dark mb-4">Key Features</h3>
                  <ul className="space-y-2">
                    {submission.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-success rounded-full mt-2"></div>
                        <span className="text-text-muted text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </Card>

          {/* Scoring Interface */}
          <Card className="bg-white rounded-2xl p-8 shadow-soft border border-soft-gray">
            <div className="space-y-8">
              {/* Score Header */}
              <div className="text-center">
                <h2 className="font-heading font-bold text-2xl text-text-dark mb-2">Score Submission</h2>
                <p className="text-text-muted">Rate each criteria on a scale of 1-10</p>
              </div>

              {/* Scoring Criteria */}
              <div className="space-y-6">
                {criteriaConfig.map((criteria) => (
                  <div key={criteria.id} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 bg-${criteria.color} rounded-full flex items-center justify-center text-white`}>
                          {criteria.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold text-text-dark">{criteria.name}</h3>
                          <p className="text-text-muted text-xs">Weight: {criteria.weight}%</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-coral">{scores[criteria.id]}</div>
                        <div className="text-xs text-text-muted">/10</div>
                      </div>
                    </div>
                    
                    <p className="text-text-muted text-sm">{criteria.description}</p>
                    
                    <div className="px-2">
                      <Slider
                        value={[scores[criteria.id]]}
                        onValueChange={(value) => handleScoreChange(criteria.id, value)}
                        max={10}
                        min={1}
                        step={1}
                        className="w-full"
                        data-testid={`slider-${criteria.id}`}
                      />
                      <div className="flex justify-between text-xs text-text-muted mt-1">
                        <span>1 (Poor)</span>
                        <span>5 (Average)</span>
                        <span>10 (Excellent)</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total Score Display */}
              <div className="bg-soft-gray/30 rounded-xl p-6 text-center">
                <div className="text-sm text-text-muted mb-2">Weighted Total Score</div>
                <div className="text-4xl font-bold text-coral mb-2">{calculateTotal().toFixed(1)}</div>
                <div className="text-sm text-text-muted">out of 10.0</div>
                <Progress value={calculateTotal() * 10} className="h-3 mt-4" />
              </div>

              {/* Feedback */}
              <div>
                <h3 className="font-semibold text-text-dark mb-3">Feedback for Team</h3>
                <Textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Provide constructive feedback about the project. What did the team do well? What could be improved? Any suggestions for future development?"
                  rows={6}
                  className="border-soft-gray focus:ring-2 focus:ring-coral focus:border-transparent"
                  data-testid="textarea-feedback"
                />
                <p className="text-xs text-text-muted mt-2">
                  This feedback will be shared with the team after judging is complete.
                </p>
              </div>

              {/* Judging Tips */}
              <div className="bg-sky/10 rounded-xl p-4 border border-sky/20">
                <h4 className="font-medium text-text-dark mb-2 flex items-center gap-2">
                  <Star className="w-4 h-4 text-sky" />
                  Judging Tips
                </h4>
                <ul className="space-y-1 text-sm text-text-muted">
                  <li>• Consider the complexity and scope relative to the time constraint</li>
                  <li>• Look for clear problem-solution fit and real-world applicability</li>
                  <li>• Evaluate both what was built and how well it was executed</li>
                  <li>• Consider the learning curve and growth demonstrated</li>
                </ul>
              </div>

              {/* Status Indicator */}
              <div className={`text-center p-3 rounded-xl ${
                isDraft 
                  ? 'bg-yellow/10 border border-yellow/20' 
                  : 'bg-success/10 border border-success/20'
              }`}>
                <div className="flex items-center justify-center gap-2">
                  {isDraft ? (
                    <>
                      <Clock className="w-4 h-4 text-yellow" />
                      <span className="text-yellow font-medium">Draft - Not Submitted</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 text-success" />
                      <span className="text-success font-medium">Score Submitted</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Keyboard Shortcuts Helper */}
        <div className="fixed bottom-4 right-4 bg-white rounded-xl p-3 shadow-soft border border-soft-gray">
          <div className="text-xs text-text-muted space-y-1">
            <div><kbd className="bg-soft-gray px-1 rounded">Ctrl + S</kbd> Save draft</div>
            <div><kbd className="bg-soft-gray px-1 rounded">Ctrl + Enter</kbd> Submit</div>
          </div>
        </div>
      </div>
    </div>
  );
}
