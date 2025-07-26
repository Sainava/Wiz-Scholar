import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bot, FileText, Zap, User, Sparkles, LogOut, ArrowLeft } from "lucide-react";
import sortingHatImage from "@/assets/sorting-hat.jpg";
import documentSummarizerImage from "@/assets/document-summarizer.jpg";
import hogwartsSuiteImage from "@/assets/hogwarts-suite.jpg";
import { useAuth } from "../AuthContext.jsx";
import { getAuth, signOut} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import PDFSummarizerPanel from "./PDFSummarizerPanel.jsx";
import HogwartsSuite from "./HogwartsSuite.jsx";

const auth = getAuth();

const features = [
  {
    title: "Sorting Hat AI",
    description: "Our intelligent AI assistant that understands your learning style and guides you to the right magical knowledge. Get personalized recommendations and answers to your academic questions.",
    image: sortingHatImage,
    icon: Bot,
    color: "from-yellow-400 to-amber-600",
  },
  {
    title: "Document Summarizer",
    description: "Transform lengthy scrolls and tomes into concise, magical summaries. Perfect for quick reviews of complex magical theories and historical texts.",
    image: documentSummarizerImage,
    icon: FileText,
    color: "from-purple-400 to-indigo-600",
  },
  {
    title: "Hogwarts Suite",
    description: "A complete collection of magical tools for modern wizarding students. From spell checkers to potion calculators, everything you need for academic success.",
    image: hogwartsSuiteImage,
    icon: Zap,
    color: "from-emerald-400 to-teal-600",
  },
];

export const FeaturesSection = () => {
  const navigate = useNavigate();
  const [showPDFSummarizer, setShowPDFSummarizer] = React.useState(false);
  const [showHogwartsSuite, setShowHogwartsSuite] = React.useState(false);
  
  const handleFeatureClick = (featureTitle) => {
    if (featureTitle === "Sorting Hat AI") {
      navigate("/sorting-hat");
    } else if (featureTitle === "Document Summarizer") {
      setShowPDFSummarizer(true);
    } else if (featureTitle === "Hogwarts Suite") {
      setShowHogwartsSuite(true);
    }
    // Add more feature navigation here as needed
  };
  const { user, firstTimeDone, handleCompleteFirstTimeStep } = useAuth();
  
  // Local state for testing when no user is logged in
  const [localShowAll, setLocalShowAll] = React.useState(true);
  
  // Determine if we should show all features
  // Use Firebase state for logged-in users, fallback to local state if Firebase fails
  const showAll = user ? (firstTimeDone === true || localShowAll) : localShowAll;
  
  // Show only first feature initially, then only the rest 2 after skip
  const featuresToShow = showAll ? features.slice(1) : [features[0]];

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const handleSkip = async () => {
    // Always set local state immediately for instant feedback
    setLocalShowAll(true);
    
    if (user && handleCompleteFirstTimeStep) {
      // Also try Firebase for persistence, but don't block on it
      try {
        await handleCompleteFirstTimeStep();
      } catch (error) {
        // Firebase failed, but local state already set - silent fallback
      }
    }
  };

  // Get user display name
  const getUserDisplayName = () => {
    if (user?.displayName) return user.displayName;
    if (user?.email) return user.email.split('@')[0];
    return 'Scholar';
  };

  // Get user initials
  const getUserInitials = () => {
    const displayName = getUserDisplayName();
    if (displayName === 'Scholar') return 'S';
    return displayName.split(' ').map(name => name[0]).join('').toUpperCase().slice(0, 2);
  };
  
  return (
    <section className="min-h-screen py-8 px-2 sm:px-4 lg:px-6 xl:px-8 bg-gradient-to-br from-background via-background/95 to-background/90 flex flex-col justify-center">
      <div className="max-w-[95vw] xl:max-w-[90vw] 2xl:max-w-[85vw] mx-auto w-full">
        
        {/* Show PDF Summarizer Panel if activated */}
        {showPDFSummarizer ? (
          <div className="space-y-6">
            {/* Back Button */}
            <div className="flex items-center justify-between mb-8">
              <Button
                onClick={() => setShowPDFSummarizer(false)}
                variant="outline"
                size="lg"
                className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/30 hover:border-primary/50"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Dashboard
              </Button>
              
              {/* Logout Button */}
              <Button 
                onClick={handleLogout}
                variant="outline" 
                size="lg"
                className="bg-gradient-to-r from-red-500/10 to-red-600/10 border-red-500/30 shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-red-500/50 hover:bg-red-500/20 text-red-600 hover:text-red-700 px-6 py-3"
              >
                <LogOut className="w-5 h-5 mr-2" />
                Logout
              </Button>
            </div>
            
            {/* PDF Summarizer Component */}
            <PDFSummarizerPanel />
          </div>
        ) : showHogwartsSuite ? (
          <div className="space-y-6">
            {/* Hogwarts Suite Component */}
            <HogwartsSuite onBack={() => setShowHogwartsSuite(false)} />
          </div>
        ) : (
          // Original Dashboard Content
          <>
            {/* Profile Card - Centered and Enhanced */}
            <div className="flex justify-center items-center mb-16">
              <Card className="bg-gradient-to-r from-gradient-card via-card to-gradient-card border-border/30 shadow-2xl p-8 hover:shadow-mystical transition-all duration-500 transform hover:scale-105 backdrop-blur-sm max-w-2xl w-full">
                <div className="flex items-center justify-center space-x-6">
                  <Avatar className="h-16 w-16 border-4 border-primary/30 shadow-xl">
                    <AvatarImage src={user?.photoURL || undefined} />
                    <AvatarFallback className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-bold text-lg">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-xl font-bold text-foreground">
                        Welcome, {getUserDisplayName()}
                      </h3>
                      <Sparkles className="w-5 h-5 text-primary" />
                    </div>
                    <p className="text-base text-muted-foreground font-medium">
                      Magical Scholar
                    </p>
                  </div>
                </div>
              </Card>
              
              {/* Logout Button - Enhanced */}
              <Button 
                onClick={handleLogout}
                variant="outline" 
                size="lg"
                className="ml-8 bg-gradient-to-r from-red-500/10 to-red-600/10 border-red-500/30 shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-red-500/50 hover:bg-red-500/20 text-red-600 hover:text-red-700 px-6 py-3"
              >
                <LogOut className="w-5 h-5 mr-2" />
                Logout
              </Button>
            </div>        {/* Header - Enhanced */}
        <div className="text-center mb-24">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground mb-8 leading-tight">
            Magical Tools for{" "}
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Every Scholar
            </span>
          </h2>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed font-medium px-4">
              {showAll
                ? "🎉 Here are your remaining magical tools! Master these advanced features to complete your wizarding education and unlock the full power of WizScholar."
                : "✨ Welcome to WizScholar! Let's start with our flagship tool - the Sorting Hat AI. Click 'Skip' to explore the other magical tools and discover your full potential."
              }
            </p>
          </div>
          
          {/* Decorative magical sparkles */}
          <div className="flex justify-center mt-12 space-x-6">
            <Sparkles className="w-10 h-10 text-primary" />
            <Sparkles className="w-8 h-8 text-accent" />
            <Sparkles className="w-10 h-10 text-primary" />
          </div>
        </div>

        {/* Features Grid - Enhanced and Much Wider */}
        <div className="grid grid-cols-1 gap-6 lg:gap-8 w-full max-w-5xl mx-auto">
          {featuresToShow.map((feature, index) => (
            <Card 
              key={feature.title}
              className={`relative overflow-hidden bg-gradient-to-br from-card via-gradient-card to-card border-border/30 shadow-2xl hover:shadow-mystical transition-all duration-300 group backdrop-blur-sm w-full`}
            >
              {/* Background Image - Enhanced */}
              <div className={`relative overflow-hidden ${
                featuresToShow.length === 1 
                  ? 'h-48 lg:h-64' 
                  : 'h-48 lg:h-64'
              }`}>
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 filter"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent group-hover:from-card/70" />
                
                {/* Icon - Enhanced */}
                <div className="absolute top-4 right-4">
                  <div className={`p-3 rounded-2xl bg-gradient-to-r ${feature.color} shadow-xl group-hover:scale-105 transition-transform duration-300`}>
                    <feature.icon className="w-6 h-6 text-white drop-shadow-lg" />
                  </div>
                </div>
                
                {/* Floating magical particles */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Sparkles className="absolute top-8 left-4 w-3 h-3 text-primary" />
                  <Sparkles className="absolute bottom-8 right-8 w-2 h-2 text-accent" />
                  <Sparkles className="absolute top-16 right-16 w-3 h-3 text-primary" />
                </div>
              </div>

              {/* Content - Enhanced */}
              <div className={`${
                featuresToShow.length === 1 
                  ? 'p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center' 
                  : 'p-6 lg:p-8'
              }`}>
                <div className="space-y-4 lg:space-y-6">
                  <h3 className={`font-bold text-foreground group-hover:text-primary transition-colors duration-300 leading-tight ${
                    featuresToShow.length === 1 
                      ? 'text-2xl lg:text-3xl' 
                      : 'text-2xl lg:text-3xl'
                  }`}>
                    {feature.title}
                  </h3>
                  <p className={`text-muted-foreground leading-relaxed font-medium ${
                    featuresToShow.length === 1 
                      ? 'text-base lg:text-lg' 
                      : 'text-base lg:text-lg'
                  }`}>
                    {feature.description}
                  </p>
                </div>
                <div className="flex justify-center mt-6">
                  <Button
                    onClick={() => handleFeatureClick(feature.title)}
                    variant="outline"
                    size="lg"
                    className={`group-hover:border-primary group-hover:bg-primary/10 group-hover:text-primary transition-all duration-300 font-semibold shadow-lg hover:shadow-xl ${
                      featuresToShow.length === 1 
                        ? 'text-base lg:text-lg px-6 lg:px-8 py-3 lg:py-4 w-full lg:w-auto' 
                        : 'text-base py-3 w-full'
                    }`}
                  >
                    <Bot className={`mr-3 ${
                      featuresToShow.length === 1 
                        ? 'w-5 h-5 lg:w-6 lg:h-6' 
                        : 'w-5 h-5'
                    }`} />
                    Explore {feature.title}
                  </Button>
                </div>
              </div>

              {/* Enhanced magical glow effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-transparent to-accent/10 rounded-lg" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent" />
              </div>
              
              {/* Border glow effect */}
              <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className={`absolute inset-0 rounded-lg border-2 bg-gradient-to-r ${feature.color} opacity-20 blur-sm`} />
              </div>
            </Card>
          ))}
        </div>

        {/* Skip Button - Enhanced */}
        {!showAll && (
          <div className="text-center mt-24">
            <div className="max-w-4xl mx-auto mb-12">
              <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-3xl p-8 border border-primary/20 backdrop-blur-sm">
                <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">Ready for More Magic? ✨</h3>
                <p className="text-base lg:text-lg text-muted-foreground leading-relaxed">
                  Unlock the full power of WizScholar! Click below to reveal Document Summarizer and Hogwarts Suite - your complete magical toolkit awaits.
                </p>
              </div>
            </div>
            
            <Button 
              onClick={handleSkip}
              size="lg" 
              className="text-base lg:text-lg px-8 lg:px-12 py-4 lg:py-6 bg-gradient-to-r from-primary via-accent to-primary hover:from-primary/90 hover:via-accent/90 hover:to-primary/90 text-white border-0 shadow-2xl hover:shadow-mystical transition-all duration-300 transform hover:scale-105 font-bold"
            >
              <Zap className="w-5 h-5 mr-3" />
              Skip - Show All Tools
              <Sparkles className="w-5 h-5 ml-3" />
            </Button>
            
            <div className="mt-6 flex justify-center items-center space-x-4">
              <div className="flex space-x-2">
                {[...Array(5)].map((_, i) => (
                  <Sparkles key={i} className="w-3 h-3 text-primary" />
                ))}
              </div>
              <p className="text-base lg:text-lg text-muted-foreground font-medium mx-4">
                Discover Document Summarizer and Hogwarts Suite!
              </p>
              <div className="flex space-x-2">
                {[...Array(5)].map((_, i) => (
                  <Sparkles key={i} className="w-3 h-3 text-accent" />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Call to action - Enhanced */}
        {showAll && (
          <div className="text-center mt-24">
            <div className="max-w-4xl mx-auto">
              <div className="mb-8 p-8 bg-gradient-to-r from-green-400/20 via-green-500/20 to-green-400/20 rounded-3xl border-2 border-green-500/30 backdrop-blur-sm shadow-2xl">
                <div className="flex justify-center mb-4">
                  <div className="bg-green-500 rounded-full p-3">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl lg:text-3xl font-bold text-green-700 mb-4">🎉 Congratulations, Magical Scholar!</h3>
                <p className="text-base lg:text-lg text-green-800 font-semibold leading-relaxed">
                  You've successfully explored all the magical tools! Your wizarding education toolkit is now complete and ready to unlock infinite possibilities.
                </p>
              </div>
              
             
              
              
            </div>
          </div>
        )}

        </>
        )}
      </div>
    </section>
  );
};




























                  