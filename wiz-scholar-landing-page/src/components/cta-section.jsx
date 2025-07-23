import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";

export const CTASection = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-mystical relative overflow-hidden">
      {/* Background magical elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/4 animate-sparkle">
          <Sparkles className="w-6 h-6 text-primary/30" />
        </div>
        <div className="absolute top-1/3 right-1/4 animate-sparkle" style={{ animationDelay: '1.5s' }}>
          <Sparkles className="w-4 h-4 text-accent/40" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="animate-fade-in-up">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Ready to Unlock Your{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Magical Potential?
            </span>
          </h2>
          
          <p className="text-xl sm:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Join the ranks of successful wizarding scholars and transform your 
            academic journey with our enchanted AI tools.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button variant="magical" size="lg" className="text-lg px-8 py-4 group">
              <Sparkles className="w-5 h-5 mr-2 group-hover:animate-spin" />
              Start Your Free Trial
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-4">
              View Pricing Plans
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm text-muted-foreground">
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full" />
              No credit card required
            </div>
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-accent rounded-full" />
              Cancel anytime
            </div>
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-secondary rounded-full" />
              24/7 magical support
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};