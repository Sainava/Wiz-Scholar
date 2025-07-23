import { Button } from "@/components/ui/button";
import { Sparkles, Wand2, BookOpen } from "lucide-react";
import heroBackground from "@/assets/hero-background.jpg";

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${heroBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="absolute inset-0 bg-gradient-hero opacity-90" />
      </div>

      {/* Floating magical elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 animate-magical-float">
          <Sparkles className="w-6 h-6 text-primary opacity-60" />
        </div>
        <div className="absolute top-40 right-32 animate-magical-float" style={{ animationDelay: '1s' }}>
          <Wand2 className="w-8 h-8 text-accent opacity-50" />
        </div>
        <div className="absolute bottom-32 left-40 animate-magical-float" style={{ animationDelay: '2s' }}>
          <BookOpen className="w-7 h-7 text-primary-glow opacity-40" />
        </div>
        <div className="absolute top-60 left-1/2 animate-sparkle" style={{ animationDelay: '0.5s' }}>
          <Sparkles className="w-4 h-4 text-accent" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="animate-fade-in-up">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
            Welcome to{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Wiz Scholar
            </span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Your magical gateway to academic excellence. Harness the power of AI and mystical tools 
            to transform your learning journey at Hogwarts and beyond.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button variant="magical" size="lg" className="text-lg px-8 py-4">
              <Wand2 className="w-5 h-5 mr-2" />
              Begin Your Journey
            </Button>
            <Button variant="mystical" size="lg" className="text-lg px-8 py-4">
              <BookOpen className="w-5 h-5 mr-2" />
              Explore Tools
            </Button>
          </div>

          <div className="mt-12 text-sm text-muted-foreground">
            <p>✨ Trusted by over 1,000 magical scholars worldwide</p>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary rounded-full flex justify-center">
          <div className="w-1 h-3 bg-primary rounded-full mt-2"></div>
        </div>
      </div>
    </section>
  );
};