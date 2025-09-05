import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { CheckCircle, Sparkles, Users, Calendar, ArrowRight } from "lucide-react";

interface SuccessScreenProps {
  onClose: () => void;
  isTestMode: boolean;
}

export function SuccessScreen({ onClose, isTestMode }: SuccessScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-full p-8 text-center bg-gradient-to-br from-mint/10 via-sky/5 to-coral/10">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-mint to-sky rounded-full flex items-center justify-center animate-pulse">
            <CheckCircle className="w-16 h-16 text-white" />
          </div>
          <h1 className="font-heading font-bold text-4xl text-text-dark mb-4">
            {isTestMode ? '🧪 Test Application Submitted!' : '🎉 Application Submitted Successfully!'}
          </h1>
          <p className="text-lg text-text-muted leading-relaxed">
            {isTestMode 
              ? "This was a test submission - your application data has been logged to the console for demonstration purposes."
              : "Thank you for your interest in becoming a judge! We'll review your application and get back to you soon."
            }
          </p>
        </div>

        {!isTestMode && (
          <>
            <div className="bg-white rounded-2xl p-8 shadow-soft mb-8">
              <h2 className="font-heading font-bold text-2xl text-text-dark mb-6">What happens next?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-coral/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-6 h-6 text-coral" />
                  </div>
                  <h3 className="font-heading font-semibold text-lg mb-2">Review Process</h3>
                  <p className="text-text-muted text-sm">Our team will review your application within 3-5 business days</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-sky/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-6 h-6 text-sky" />
                  </div>
                  <h3 className="font-heading font-semibold text-lg mb-2">Onboarding</h3>
                  <p className="text-text-muted text-sm">If accepted, we'll send judge guidelines and training materials</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-mint/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-6 h-6 text-mint" />
                  </div>
                  <h3 className="font-heading font-semibold text-lg mb-2">Start Judging</h3>
                  <p className="text-text-muted text-sm">Begin reviewing amazing projects and making an impact!</p>
                </div>
              </div>
            </div>

            <div className="bg-sky/10 rounded-2xl p-6 border border-sky/30 mb-8">
              <h3 className="font-heading font-semibold text-lg mb-3 text-sky">
                📧 Check Your Email
              </h3>
              <p className="text-text-muted text-sm">
                We've sent a confirmation email to your inbox. If you don't see it in a few minutes, 
                please check your spam folder or contact us at{" "}
                <a href="mailto:judges@maximallyhack.com" className="text-sky hover:underline">
                  judges@maximallyhack.com
                </a>
              </p>
            </div>
          </>
        )}

        {isTestMode && (
          <div className="bg-yellow/10 rounded-2xl p-6 border border-yellow/30 mb-8">
            <h3 className="font-heading font-semibold text-lg mb-3 text-yellow-700">
              🧪 Test Mode Complete
            </h3>
            <p className="text-yellow-700 text-sm mb-4">
              You've successfully tested the judge application flow! In a real application:
            </p>
            <ul className="text-yellow-700 text-sm text-left space-y-1">
              <li>• Application would be saved to the database</li>
              <li>• Confirmation email would be sent</li>
              <li>• Admin team would be notified</li>
              <li>• Applicant would receive status updates</li>
            </ul>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={onClose}
            className="bg-mint text-white px-8 py-4 rounded-full font-medium text-lg hover-scale hover:bg-mint/80 transition-colors"
            data-testid="button-close"
          >
            {isTestMode ? 'Try Again' : 'Back to Home'}
          </Button>
          
          {isTestMode && (
            <Link href="/judge/dashboard">
              <Button
                variant="outline"
                className="border-2 border-sky text-sky px-8 py-4 rounded-full font-medium text-lg hover-scale hover:bg-sky/20 transition-colors"
                data-testid="button-judge-dashboard"
              >
                Preview Judge Dashboard
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          )}
        </div>
        
        <p className="text-text-muted text-sm mt-8">
          Questions about the process?{" "}
          <a href="mailto:support@maximallyhack.com" className="text-sky hover:underline">
            Contact our support team
          </a>
        </p>
      </div>
    </div>
  );
}