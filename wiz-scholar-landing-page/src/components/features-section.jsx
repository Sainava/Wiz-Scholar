import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bot, FileText, Zap, User, Sparkles, LogOut } from "lucide-react";
import sortingHatImage from "@/assets/sorting-hat.jpg";
import documentSummarizerImage from "@/assets/document-summarizer.jpg";
import hogwartsSuiteImage from "@/assets/hogwarts-suite.jpg";
import { useAuth } from "../AuthContext.jsx";
import { getAuth, signOut} from "firebase/auth";
import { useNavigate } from "react-router-dom";

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


const handleLogout = async () => {
  try {
    await signOut(auth);
    // Redirect to home page
    navigate("/");
  } catch (error) {
    console.error("Error during logout:", error);
  }
}

  const { currentUser } = useAuth();

  // Get user display name or email
  const getUserDisplayName = () => {
    if (currentUser?.displayName) {
      return currentUser.displayName;
    }
    if (currentUser?.email) {
      return currentUser.email.split('@')[0];
    }
    return 'Scholar';
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    const displayName = getUserDisplayName();
    if (displayName === 'Scholar') return 'S';
    return displayName.split(' ').map(name => name[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <>
      {currentUser && (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
          <div className="max-w-7xl mx-auto">
            {/* Profile Card */}
            <div className="flex justify-between items-center mb-8">
              <Card className="bg-gradient-card border-border/50 shadow-magical p-4 hover:shadow-mystical transition-all duration-300">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12 border-2 border-primary/20">
                    <AvatarImage src={currentUser?.photoURL || undefined} />
                    <AvatarFallback className="bg-gradient-primary text-primary-foreground font-semibold">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-semibold text-foreground">
                        Welcome, {getUserDisplayName()}
                      </h3>
                      <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Magical Scholar
                    </p>
                  </div>
                </div>
              </Card>
              
              {/* Logout Button */}
              <Button 
                onClick={handleLogout}
                variant="outline" 
                size="sm"
                className="bg-gradient-card border-border/50 shadow-magical hover:shadow-mystical transition-all duration-300 hover:border-red-500/50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>

            <div className="text-center mb-16 animate-fade-in-up">
              <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
                Magical Tools for{" "}
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  Every Scholar
                </span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Discover our enchanted suite of AI-powered tools designed to enhance 
                your magical education and academic performance.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card 
                  key={feature.title}
                  className="relative overflow-hidden bg-gradient-card border-border/50 shadow-card hover:shadow-mystical transition-all duration-500 group hover:scale-105"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  {/* Background Image */}
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
                    
                    {/* Icon */}
                    <div className="absolute top-6 right-6">
                      <div className={`p-3 rounded-full bg-gradient-to-r ${feature.color} shadow-magical`}>
                        <feature.icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      {feature.description}
                    </p>
                    <Button 
                      variant="outline" 
                      className="w-full group-hover:border-primary/50 group-hover:bg-primary/5"
                    >
                      Explore {feature.title}
                    </Button>
                  </div>

                  {/* Magical glow effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-transparent to-accent/5" />
                  </div>
                </Card>
              ))}
            </div>

            {/* Call to action */}
            <div className="text-center mt-16">
              <Button variant="magical" size="lg" className="text-lg px-8 py-4">
                <Zap className="w-5 h-5 mr-2" />
                Start Your Magical Journey
              </Button>
            </div>
          </div>
        </section>
      )}
    </>
  );
};