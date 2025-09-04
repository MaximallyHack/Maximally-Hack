import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CrayonSquiggle } from "@/components/ui/floating-elements";
import { 
  Search,
  HelpCircle,
  Users,
  Calendar,
  Trophy,
  Shield,
  Code,
  MessageCircle,
  FileText,
  Settings,
  ExternalLink,
  BookOpen,
  Video,
  ChevronRight
} from "lucide-react";

const helpCategories = [
  {
    id: "getting-started",
    title: "Getting Started",
    icon: <BookOpen className="w-6 h-6" />,
    color: "sky",
    description: "Learn the basics of using Maximally Hack",
    articles: [
      { title: "How to create your first hackathon", readTime: "5 min" },
      { title: "Setting up your profile", readTime: "3 min" },
      { title: "Understanding event types", readTime: "4 min" },
      { title: "Joining your first event", readTime: "2 min" }
    ]
  },
  {
    id: "organizing",
    title: "Event Organizing",
    icon: <Calendar className="w-6 h-6" />,
    color: "coral",
    description: "Everything you need to run successful hackathons",
    articles: [
      { title: "Planning your hackathon timeline", readTime: "8 min" },
      { title: "Setting up judging criteria", readTime: "6 min" },
      { title: "Managing team formation", readTime: "4 min" },
      { title: "Publishing results", readTime: "3 min" }
    ]
  },
  {
    id: "participating",
    title: "Participating",
    icon: <Users className="w-6 h-6" />,
    color: "mint",
    description: "Make the most of your hackathon experience",
    articles: [
      { title: "Building great teams", readTime: "5 min" },
      { title: "Project submission guide", readTime: "7 min" },
      { title: "Presenting to judges", readTime: "6 min" },
      { title: "Networking tips", readTime: "4 min" }
    ]
  },
  {
    id: "judging",
    title: "Judging",
    icon: <Trophy className="w-6 h-6" />,
    color: "yellow",
    description: "Guide for judges and scoring",
    articles: [
      { title: "Becoming a judge", readTime: "3 min" },
      { title: "Scoring rubric explained", readTime: "5 min" },
      { title: "Providing constructive feedback", readTime: "6 min" },
      { title: "Best practices for fair judging", readTime: "4 min" }
    ]
  },
  {
    id: "technical",
    title: "Technical",
    icon: <Code className="w-6 h-6" />,
    color: "sky",
    description: "Technical help and troubleshooting",
    articles: [
      { title: "Uploading project files", readTime: "4 min" },
      { title: "Setting up live demos", readTime: "6 min" },
      { title: "Common issues and fixes", readTime: "5 min" },
      { title: "Platform limitations", readTime: "3 min" }
    ]
  },
  {
    id: "account",
    title: "Account & Privacy",
    icon: <Shield className="w-6 h-6" />,
    color: "mint",
    description: "Managing your account and privacy settings",
    articles: [
      { title: "Account settings", readTime: "3 min" },
      { title: "Privacy controls", readTime: "4 min" },
      { title: "Data export", readTime: "2 min" },
      { title: "Deleting your account", readTime: "2 min" }
    ]
  }
];

const faqs = [
  {
    question: "How do I create my first hackathon?",
    answer: "Click 'Organize' in the top navigation, then 'Create Event'. Follow our step-by-step wizard to set up your event details, timeline, and judging criteria. Don't worry - you can always edit everything later!"
  },
  {
    question: "Can I participate in multiple hackathons at once?",
    answer: "Yes! There's no limit to how many hackathons you can join. Just make sure you can commit the time needed for each event."
  },
  {
    question: "How does the judging process work?",
    answer: "Judges score projects based on criteria set by organizers. Common criteria include innovation, technical implementation, design, and impact. Scores are aggregated to determine winners."
  },
  {
    question: "Can I submit projects to multiple tracks?",
    answer: "Usually, you can only submit to one track per hackathon. Check the specific event rules as some organizers allow multi-track submissions."
  },
  {
    question: "What happens to my data when I delete my account?",
    answer: "All your personal data is permanently deleted. Published projects may remain for historical purposes unless you specifically request their removal."
  },
  {
    question: "How do I become a verified judge?",
    answer: "Complete your judge profile with your expertise areas and professional background. Active judges who receive positive feedback get verified status over time."
  },
  {
    question: "Can I edit my project after submission?",
    answer: "It depends on the hackathon rules. Most events lock submissions after the deadline, but you can usually edit until then."
  },
  {
    question: "How are winners selected?",
    answer: "Judges score projects independently, and winners are determined by the highest average scores. Some hackathons also include public voting components."
  }
];

export default function Help() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredCategories = helpCategories.filter(category =>
    category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.articles.some(article => 
      article.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const filteredFAQs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-cream py-8 px-4" data-testid="help-page">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-sky rounded-full flex items-center justify-center mx-auto mb-4">
            <HelpCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-heading font-bold text-4xl text-text-dark mb-2">Help Center</h1>
          <CrayonSquiggle className="mx-auto mb-4" />
          <p className="text-text-muted text-lg max-w-2xl mx-auto">
            Find answers, learn best practices, and get the most out of Maximally Hack
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-12">
          <div className="relative max-w-lg mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-muted w-5 h-5" />
            <Input
              type="text"
              placeholder="Search for help articles, guides, and FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-soft-gray rounded-2xl focus:ring-2 focus:ring-sky focus:border-transparent text-lg"
              data-testid="input-search-help"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="outline" className="border-coral text-coral hover:bg-coral/10">
              <Video className="w-4 h-4 mr-2" />
              Video Tutorials
            </Button>
            <Button variant="outline" className="border-sky text-sky hover:bg-sky/10">
              <MessageCircle className="w-4 h-4 mr-2" />
              Contact Support
            </Button>
            <Button variant="outline" className="border-mint text-mint hover:bg-mint/10">
              <FileText className="w-4 h-4 mr-2" />
              Documentation
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Help Categories */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <h2 className="font-heading font-bold text-2xl text-text-dark mb-6">Browse by Category</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredCategories.map((category) => (
                  <Card 
                    key={category.id}
                    className="bg-white rounded-2xl p-6 shadow-soft border border-soft-gray hover-scale cursor-pointer transition-all"
                    onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
                    data-testid={`category-${category.id}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 bg-${category.color} rounded-xl flex items-center justify-center text-white`}>
                        {category.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-heading font-semibold text-lg text-text-dark mb-2">
                          {category.title}
                        </h3>
                        <p className="text-text-muted text-sm mb-4">
                          {category.description}
                        </p>
                        <div className="flex items-center text-coral text-sm font-medium">
                          <span>{category.articles.length} articles</span>
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </div>
                      </div>
                    </div>

                    {/* Article List */}
                    {selectedCategory === category.id && (
                      <div className="mt-6 pt-6 border-t border-soft-gray space-y-3">
                        {category.articles.map((article, index) => (
                          <div 
                            key={index}
                            className="flex items-center justify-between p-3 rounded-lg hover:bg-soft-gray/50 cursor-pointer transition-colors"
                            data-testid={`article-${category.id}-${index}`}
                          >
                            <div className="flex items-center gap-3">
                              <FileText className="w-4 h-4 text-text-muted" />
                              <span className="text-text-dark font-medium">{article.title}</span>
                            </div>
                            <Badge className="bg-soft-gray text-text-muted border-0 text-xs">
                              {article.readTime}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </div>

            {/* Featured Articles */}
            <div className="mb-8">
              <h2 className="font-heading font-bold text-2xl text-text-dark mb-6">Popular Articles</h2>
              
              <div className="space-y-4">
                {[
                  { title: "Complete guide to organizing your first hackathon", category: "Organizing", readTime: "12 min", featured: true },
                  { title: "How to build winning hackathon projects", category: "Participating", readTime: "8 min", featured: true },
                  { title: "Best practices for judging hackathons", category: "Judging", readTime: "6 min", featured: true },
                  { title: "Setting up effective team formation", category: "Organizing", readTime: "5 min", featured: false }
                ].map((article, index) => (
                  <Card 
                    key={index}
                    className="bg-white rounded-xl p-4 shadow-soft border border-soft-gray hover-scale cursor-pointer transition-all"
                    data-testid={`featured-article-${index}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-text-muted" />
                        <div>
                          <h4 className="font-medium text-text-dark">{article.title}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className="bg-sky/10 text-sky border-0 text-xs">
                              {article.category}
                            </Badge>
                            <span className="text-text-muted text-xs">{article.readTime}</span>
                            {article.featured && (
                              <Badge className="bg-yellow/10 text-yellow border-0 text-xs">
                                ⭐ Popular
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-text-muted" />
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* FAQ Section */}
            <div>
              <h2 className="font-heading font-bold text-xl text-text-dark mb-6">Frequently Asked Questions</h2>
              
              <Accordion type="single" collapsible className="space-y-3">
                {filteredFAQs.slice(0, 6).map((faq, index) => (
                  <AccordionItem 
                    key={index} 
                    value={`faq-${index}`}
                    className="bg-white rounded-xl border border-soft-gray overflow-hidden"
                  >
                    <AccordionTrigger className="px-4 py-3 text-left hover:bg-soft-gray/50 [&[data-state=open]]:bg-soft-gray/30">
                      <span className="font-medium text-text-dark text-sm">{faq.question}</span>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <p className="text-text-muted text-sm leading-relaxed">{faq.answer}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            {/* Contact Support */}
            <Card className="bg-white rounded-2xl p-6 shadow-soft border border-soft-gray">
              <div className="text-center">
                <div className="w-12 h-12 bg-coral rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-heading font-semibold text-lg text-text-dark mb-2">
                  Still need help?
                </h3>
                <p className="text-text-muted text-sm mb-4">
                  Our support team is here to help you succeed
                </p>
                <Button className="w-full bg-coral text-white hover:bg-coral/80" data-testid="button-contact-support">
                  Contact Support
                </Button>
              </div>
            </Card>

            {/* Quick Links */}
            <Card className="bg-white rounded-2xl p-6 shadow-soft border border-soft-gray">
              <h3 className="font-heading font-semibold text-lg text-text-dark mb-4">Quick Links</h3>
              <div className="space-y-3">
                {[
                  { label: "Community Guidelines", icon: <Users className="w-4 h-4" /> },
                  { label: "Terms of Service", icon: <FileText className="w-4 h-4" /> },
                  { label: "Privacy Policy", icon: <Shield className="w-4 h-4" /> },
                  { label: "API Documentation", icon: <Code className="w-4 h-4" /> }
                ].map((link, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-soft-gray/50 cursor-pointer transition-colors"
                    data-testid={`quick-link-${index}`}
                  >
                    <div className="text-text-muted">
                      {link.icon}
                    </div>
                    <span className="text-text-dark text-sm">{link.label}</span>
                    <ExternalLink className="w-3 h-3 text-text-muted ml-auto" />
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}