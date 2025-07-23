import { Users, BookOpen, Zap, Trophy } from "lucide-react";

const stats = [
  {
    icon: Users,
    value: "1,000+",
    label: "Active Wizarding Students",
    description: "From Hogwarts to Beauxbatons"
  },
  {
    icon: BookOpen,
    value: "50,000+",
    label: "Documents Summarized",
    description: "Ancient tomes made simple"
  },
  {
    icon: Zap,
    value: "100+",
    label: "Magical Tools",
    description: "In our Hogwarts Suite"
  },
  {
    icon: Trophy,
    value: "95%",
    label: "Success Rate",
    description: "Student satisfaction"
  }
];

export const StatsSection = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
            Trusted by{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Magical Minds
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of students who have transformed their academic journey 
            with our enchanted tools.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div 
              key={stat.label}
              className="text-center group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-mystical shadow-mystical mb-6 group-hover:scale-110 transition-transform duration-300">
                <stat.icon className="w-8 h-8 text-foreground" />
              </div>
              
              <div className="space-y-2">
                <div className="text-4xl sm:text-5xl font-bold text-foreground group-hover:text-primary transition-colors">
                  {stat.value}
                </div>
                <div className="text-lg font-semibold text-foreground">
                  {stat.label}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};