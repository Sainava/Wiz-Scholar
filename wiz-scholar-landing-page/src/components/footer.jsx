import { Sparkles, Twitter, Github, Mail, Heart } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-card border-t border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="p-2 bg-gradient-primary rounded-lg shadow-magical">
                <Sparkles className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold text-foreground">
                Wiz Scholar
              </span>
            </div>
            <p className="text-muted-foreground max-w-md leading-relaxed">
              Empowering the next generation of magical scholars with AI-powered tools 
              and enchanted learning experiences. Your gateway to academic excellence 
              in the wizarding world.
            </p>
            <div className="flex items-center space-x-4 mt-6">
              <a 
                href="#" 
                className="p-2 bg-muted rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="p-2 bg-muted rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="p-2 bg-muted rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#tools" className="text-muted-foreground hover:text-foreground transition-colors">
                  Magical Tools
                </a>
              </li>
              <li>
                <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#support" className="text-muted-foreground hover:text-foreground transition-colors">
                  Support
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Resources</h3>
            <ul className="space-y-3">
              <li>
                <a href="#docs" className="text-muted-foreground hover:text-foreground transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#api" className="text-muted-foreground hover:text-foreground transition-colors">
                  API Reference
                </a>
              </li>
              <li>
                <a href="#blog" className="text-muted-foreground hover:text-foreground transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#community" className="text-muted-foreground hover:text-foreground transition-colors">
                  Community
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-border/50 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-muted-foreground text-sm">
            © 2024 Wiz Scholar. All rights reserved. Made with magic and AI.
          </p>
          <div className="flex items-center space-x-1 text-sm text-muted-foreground mt-4 md:mt-0">
            <span>Crafted with</span>
            <Heart className="w-4 h-4 text-red-500 animate-pulse" />
            <span>for wizarding students</span>
          </div>
        </div>
      </div>
    </footer>
  );
};