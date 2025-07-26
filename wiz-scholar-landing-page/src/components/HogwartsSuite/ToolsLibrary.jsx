import React, { useState, useEffect } from 'react';
import './HogwartsSuite.css';

const ToolsLibrary = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(false);

  // Tools data with categories and networking tools
  const allTools = [
    // Development Tools
    {
      id: 1,
      name: "GitHub",
      category: "development",
      description: "World's leading software development platform for version control and collaboration",
      url: "https://github.com",
      logo: "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
    },
    {
      id: 2,
      name: "Visual Studio Code",
      category: "development",
      description: "Free source-code editor with support for debugging, syntax highlighting, and more",
      url: "https://code.visualstudio.com",
      logo: "https://code.visualstudio.com/favicon.ico"
    },
    {
      id: 3,
      name: "Stack Overflow",
      category: "development",
      description: "The largest online community for programmers to learn, share knowledge, and build careers",
      url: "https://stackoverflow.com",
      logo: "https://cdn.sstatic.net/Sites/stackoverflow/Img/apple-touch-icon.png"
    },
    {
      id: 4,
      name: "CodePen",
      category: "development",
      description: "Online code editor and community for front-end developers",
      url: "https://codepen.io",
      logo: "https://cpwebassets.codepen.io/assets/favicon/favicon-aec34940fbc1a6e787974dcd360f2c6b63348d4b1f4e06c77743096d55480f33.ico"
    },
    {
      id: 5,
      name: "Replit",
      category: "development",
      description: "Online IDE that lets you instantly code in 50+ languages",
      url: "https://replit.com",
      logo: "https://replit.com/public/images/favicon.ico"
    },
    {
      id: 6,
      name: "JSFiddle",
      category: "development",
      description: "Online playground for web developers to test HTML, CSS, and JavaScript code snippets",
      url: "https://jsfiddle.net",
      logo: "https://jsfiddle.net/favicon.png"
    },

    // Design Tools
    {
      id: 11,
      name: "Figma",
      category: "design",
      description: "Collaborative interface design tool for creating user interfaces and prototypes",
      url: "https://figma.com",
      logo: "https://static.figma.com/app/icon/1/favicon.ico"
    },
    {
      id: 12,
      name: "Canva",
      category: "design",
      description: "Graphic design platform for creating social media graphics, presentations, and more",
      url: "https://canva.com",
      logo: "https://static.canva.com/web/images/favicon.ico"
    },
    {
      id: 13,
      name: "Adobe Creative Cloud",
      category: "design",
      description: "Collection of creative apps including Photoshop, Illustrator, and InDesign",
      url: "https://adobe.com/creativecloud",
      logo: "https://www.adobe.com/favicon.ico"
    },
    {
      id: 14,
      name: "Unsplash",
      category: "design",
      description: "Platform for beautiful, free stock photos and images",
      url: "https://unsplash.com",
      logo: "https://unsplash.com/favicon-32x32.png"
    },
    {
      id: 15,
      name: "Color Hunt",
      category: "design",
      description: "Platform for color palettes and design inspiration",
      url: "https://colorhunt.co",
      logo: "https://colorhunt.co/img/color-hunt-icon-ios.png"
    },

    // Productivity Tools
    {
      id: 21,
      name: "Notion",
      category: "productivity",
      description: "All-in-one workspace for notes, tasks, wikis, and databases",
      url: "https://notion.so",
      logo: "https://www.notion.so/favicon.ico"
    },
    {
      id: 22,
      name: "Trello",
      category: "productivity",
      description: "Visual collaboration tool for organizing projects using boards and cards",
      url: "https://trello.com",
      logo: "https://trello.com/favicon.ico"
    },
    {
      id: 23,
      name: "Google Workspace",
      category: "productivity",
      description: "Suite of cloud computing, productivity and collaboration tools",
      url: "https://workspace.google.com",
      logo: "https://workspace.google.com/favicon.ico"
    },
    {
      id: 24,
      name: "Slack",
      category: "productivity",
      description: "Business communication platform for team collaboration",
      url: "https://slack.com",
      logo: "https://a.slack-edge.com/80588/marketing/img/icons/icon_slack_hash_colored.png"
    },

    // Learning Tools
    {
      id: 31,
      name: "Coursera",
      category: "learning",
      description: "Online courses from top universities and companies worldwide",
      url: "https://coursera.org",
      logo: "https://d3njjcbhbojbot.cloudfront.net/web/images/favicons/favicon-32x32.png"
    },
    {
      id: 32,
      name: "Khan Academy",
      category: "learning",
      description: "Free online courses, lessons and practice for students of all ages",
      url: "https://khanacademy.org",
      logo: "https://www.khanacademy.org/favicon.ico"
    },
    {
      id: 33,
      name: "edX",
      category: "learning",
      description: "Online courses from top institutions like Harvard and MIT",
      url: "https://edx.org",
      logo: "https://www.edx.org/favicon.ico"
    },
    {
      id: 34,
      name: "Udemy",
      category: "learning",
      description: "Online learning platform with thousands of courses on various topics",
      url: "https://udemy.com",
      logo: "https://www.udemy.com/staticx/udemy/images/v7/favicon.ico"
    },

    // Communication & Networking Tools
    {
      id: 41,
      name: "LinkedIn",
      category: "networking",
      description: "Professional networking platform for career development and business connections",
      url: "https://linkedin.com",
      logo: "https://static.licdn.com/sc/h/8s162nmbcnfkg7a0k8nq9wwqo"
    },
    {
      id: 42,
      name: "Discord",
      category: "networking",
      description: "Voice, video and text communication service for communities and friends",
      url: "https://discord.com",
      logo: "https://discord.com/assets/f8389ca1a741a115313bede9ac02e2c0.ico"
    },
    {
      id: 43,
      name: "Zoom",
      category: "networking",
      description: "Video conferencing and online meeting platform",
      url: "https://zoom.us",
      logo: "https://st1.zoom.us/zoom.ico"
    },
    {
      id: 44,
      name: "Microsoft Teams",
      category: "networking",
      description: "Collaboration app that helps teams stay organized and have conversations",
      url: "https://teams.microsoft.com",
      logo: "https://res-1.cdn.office.net/teams-modular-packages/assets/images/favicons/favicon-32x32.png"
    },
    {
      id: 45,
      name: "Meetup",
      category: "networking",
      description: "Platform for finding and building local communities through events",
      url: "https://meetup.com",
      logo: "https://secure.meetupstatic.com/next/images/app-icon.svg?w=32"
    },

    // Utility Tools
    {
      id: 51,
      name: "Google Drive",
      category: "utility",
      description: "Cloud storage service for file storage and synchronization",
      url: "https://drive.google.com",
      logo: "https://ssl.gstatic.com/docs/doclist/images/drive_2022q3_32dp.png"
    },
    {
      id: 52,
      name: "Dropbox",
      category: "utility",
      description: "Cloud storage service for file hosting and synchronization",
      url: "https://dropbox.com",
      logo: "https://cfl.dropboxstatic.com/static/images/favicon-vfl8lUR9B.ico"
    },
    {
      id: 53,
      name: "LastPass",
      category: "utility",
      description: "Password manager that stores encrypted passwords online",
      url: "https://lastpass.com",
      logo: "https://www.lastpass.com/favicon.ico"
    },
    {
      id: 54,
      name: "1Password",
      category: "utility",
      description: "Password manager and secure digital wallet for families and businesses",
      url: "https://1password.com",
      logo: "https://1password.com/favicon.ico"
    },

    // Additional Development Tools
    {
      id: 61,
      name: "GitLab",
      category: "development",
      description: "DevOps platform with Git repository management and CI/CD pipelines",
      url: "https://gitlab.com",
      logo: "https://gitlab.com/assets/favicon-72a2cad5025aa931d6ea56c3201d1f18e68a8cd39788c7c80d5b2b82aa5143ef.png"
    },
    {
      id: 62,
      name: "Postman",
      category: "development",
      description: "API development and testing platform for developers",
      url: "https://postman.com",
      logo: "https://www.postman.com/favicon.ico"
    },
    {
      id: 63,
      name: "npm",
      category: "development",
      description: "Package manager for JavaScript and Node.js development",
      url: "https://npmjs.com",
      logo: "https://static.npmjs.com/b0f1a8318363185cc2ea6a40ac23eeb2.png"
    },
    {
      id: 64,
      name: "Docker",
      category: "development",
      description: "Platform for developing, shipping, and running applications in containers",
      url: "https://docker.com",
      logo: "https://www.docker.com/favicon.ico"
    },
    {
      id: 65,
      name: "Heroku",
      category: "development",
      description: "Cloud platform for deploying and managing applications",
      url: "https://heroku.com",
      logo: "https://www.heroku.com/favicon.ico"
    },

    // Additional Design Tools
    {
      id: 71,
      name: "Sketch",
      category: "design",
      description: "Digital design toolkit for creating user interfaces and experiences",
      url: "https://sketch.com",
      logo: "https://www.sketch.com/favicon.ico"
    },
    {
      id: 72,
      name: "InVision",
      category: "design",
      description: "Digital product design platform for prototyping and collaboration",
      url: "https://invisionapp.com",
      logo: "https://www.invisionapp.com/favicon.ico"
    },
    {
      id: 73,
      name: "Dribbble",
      category: "design",
      description: "Community platform for showcasing and discovering creative work",
      url: "https://dribbble.com",
      logo: "https://dribbble.com/favicon.ico"
    },
    {
      id: 74,
      name: "Behance",
      category: "design",
      description: "Creative portfolios platform by Adobe for showcasing work",
      url: "https://behance.net",
      logo: "https://www.behance.net/favicon.ico"
    },

    // Additional Productivity Tools
    {
      id: 81,
      name: "Asana",
      category: "productivity",
      description: "Team collaboration and project management platform",
      url: "https://asana.com",
      logo: "https://asana.com/favicon.ico"
    },
    {
      id: 82,
      name: "Monday.com",
      category: "productivity",
      description: "Work management platform for teams and organizations",
      url: "https://monday.com",
      logo: "https://monday.com/favicon.ico"
    },
    {
      id: 83,
      name: "Todoist",
      category: "productivity",
      description: "Task management app for organizing work and life",
      url: "https://todoist.com",
      logo: "https://todoist.com/favicon.ico"
    },
    {
      id: 84,
      name: "Evernote",
      category: "productivity",
      description: "Note-taking and organization app for capturing ideas",
      url: "https://evernote.com",
      logo: "https://evernote.com/favicon.ico"
    },

    // Additional Learning Tools
    {
      id: 91,
      name: "Pluralsight",
      category: "learning",
      description: "Technology skills platform with expert-authored courses",
      url: "https://pluralsight.com",
      logo: "https://www.pluralsight.com/favicon.ico"
    },
    {
      id: 92,
      name: "LinkedIn Learning",
      category: "learning",
      description: "Professional development courses and skills training",
      url: "https://linkedin.com/learning",
      logo: "https://static.licdn.com/sc/h/8s162nmbcnfkg7a0k8nq9wwqo"
    },
    {
      id: 93,
      name: "Codecademy",
      category: "learning",
      description: "Interactive coding courses and programming tutorials",
      url: "https://codecademy.com",
      logo: "https://www.codecademy.com/favicon.ico"
    },
    {
      id: 94,
      name: "FreeCodeCamp",
      category: "learning",
      description: "Learn to code for free with hands-on projects and certifications",
      url: "https://freecodecamp.org",
      logo: "https://www.freecodecamp.org/favicon.ico"
    },

    // Additional Networking Tools
    {
      id: 95,
      name: "WhatsApp",
      category: "networking",
      description: "Messaging app for personal and business communication",
      url: "https://web.whatsapp.com",
      logo: "https://static.whatsapp.net/rsrc.php/v3/yP/r/rYZqPCBaG70.png"
    },
    {
      id: 96,
      name: "Telegram",
      category: "networking",
      description: "Cloud-based messaging app with focus on speed and security",
      url: "https://telegram.org",
      logo: "https://telegram.org/favicon.ico"
    }
  ];

  const categories = [
    { value: 'all', label: 'All Tools', count: allTools.length },
    { value: 'development', label: 'Development', count: allTools.filter(t => t.category === 'development').length },
    { value: 'design', label: 'Design', count: allTools.filter(t => t.category === 'design').length },
    { value: 'productivity', label: 'Productivity', count: allTools.filter(t => t.category === 'productivity').length },
    { value: 'learning', label: 'Learning', count: allTools.filter(t => t.category === 'learning').length },
    { value: 'networking', label: 'Networking', count: allTools.filter(t => t.category === 'networking').length },
    { value: 'utility', label: 'Utility', count: allTools.filter(t => t.category === 'utility').length }
  ];

  // Filter tools based on search term and category
  const filteredTools = allTools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tool.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Handle external link clicks
  const handleToolClick = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Simulate loading effect when changing categories
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [selectedCategory, searchTerm]);

  return (
    <div className="tools-library">
      {/* Header Section */}
      <div className="tools-header">
        <h2>🔧 Developer Tools Library</h2>
        <p>Discover and access essential tools for development, design, productivity, and learning</p>
      </div>

      {/* Search and Filter Controls */}
      <div className="tools-controls">
        <input
          type="text"
          placeholder="Search tools by name, description, or category..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <select
          className="category-filter"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map(category => (
            <option key={category.value} value={category.value}>
              {category.label} ({category.count})
            </option>
          ))}
        </select>
      </div>

      {/* Category Tabs */}
      <div className="category-tabs">
        {categories.map(category => (
          <button
            key={category.value}
            className={`category-tab ${selectedCategory === category.value ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category.value)}
          >
            {category.label} ({category.count})
          </button>
        ))}
      </div>

      {/* Tools Grid */}
      {isLoading ? (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading tools...</p>
        </div>
      ) : (
        <>
          {filteredTools.length > 0 ? (
            <div className="tools-cards-grid">
              {filteredTools.map(tool => (
                <div key={tool.id} className="tool-card">
                  <div className="tool-logo-section">
                    {tool.logo ? (
                      <img 
                        src={tool.logo} 
                        alt={`${tool.name} logo`}
                        className="tool-logo"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentNode.querySelector('.tool-logo-fallback').style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div 
                      className="tool-logo-fallback" 
                      style={{ display: tool.logo ? 'none' : 'flex' }}
                    >
                      {tool.name.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  
                  <div className="tool-info">
                    <div className="tool-category">
                      {tool.category}
                    </div>
                    <h3 className="tool-name">
                      <a href={tool.url} target="_blank" rel="noopener noreferrer">
                        {tool.name}
                      </a>
                    </h3>
                    <p className="tool-desc">{tool.description}</p>
                    <button 
                      className="tool-link"
                      onClick={() => handleToolClick(tool.url)}
                    >
                      Visit Tool →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-tools">
              <h3>🔍 No tools found</h3>
              <p>
                {searchTerm 
                  ? `No tools match "${searchTerm}" in the ${selectedCategory === 'all' ? 'all categories' : selectedCategory + ' category'}.`
                  : `No tools available in the ${selectedCategory} category.`
                }
              </p>
              <p>Try adjusting your search terms or selecting a different category.</p>
            </div>
          )}
        </>
      )}

      {/* Tools Statistics */}
      {!isLoading && filteredTools.length > 0 && (
        <div className="tools-stats">
          <p>
            Showing {filteredTools.length} of {allTools.length} tools
            {searchTerm && ` matching "${searchTerm}"`}
            {selectedCategory !== 'all' && ` in ${selectedCategory} category`}
          </p>
        </div>
      )}

      {/* Quick Access Shortcuts */}
      <div className="quick-shortcuts">
        <h3>🚀 Quick Access</h3>
        <div className="shortcuts-grid">
          <div className="shortcut-card" onClick={() => handleToolClick('https://linkedin.com')}>
            <div className="shortcut-logo">
              <img 
                src="https://static.licdn.com/sc/h/8s162nmbcnfkg7a0k8nq9wwqo" 
                alt="LinkedIn"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentNode.querySelector('.shortcut-fallback').style.display = 'flex';
                }}
              />
              <div className="shortcut-fallback" style={{ display: 'none' }}>LI</div>
            </div>
            <div className="shortcut-info">
              <h4>LinkedIn</h4>
              <span className="shortcut-badge networking">NETWORKING & JOBS</span>
            </div>
          </div>

          <div className="shortcut-card" onClick={() => handleToolClick('https://nextlevel.io')}>
            <div className="shortcut-logo">
              <div className="shortcut-fallback">N</div>
            </div>
            <div className="shortcut-info">
              <h4>Next Level</h4>
              <span className="shortcut-badge networking">NETWORKING & JOBS</span>
            </div>
          </div>

          <div className="shortcut-card" onClick={() => handleToolClick('https://communle.com')}>
            <div className="shortcut-logo">
              <img 
                src="https://communle.com/favicon.ico" 
                alt="Communle"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentNode.querySelector('.shortcut-fallback').style.display = 'flex';
                }}
              />
              <div className="shortcut-fallback" style={{ display: 'none' }}>👥</div>
            </div>
            <div className="shortcut-info">
              <h4>Communle</h4>
              <span className="shortcut-badge networking">NETWORKING & JOBS</span>
            </div>
          </div>

          <div className="shortcut-card" onClick={() => handleToolClick('https://github.com')}>
            <div className="shortcut-logo">
              <img 
                src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" 
                alt="GitHub"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentNode.querySelector('.shortcut-fallback').style.display = 'flex';
                }}
              />
              <div className="shortcut-fallback" style={{ display: 'none' }}>GH</div>
            </div>
            <div className="shortcut-info">
              <h4>GitHub</h4>
              <span className="shortcut-badge development">DEVELOPMENT</span>
            </div>
          </div>

          <div className="shortcut-card" onClick={() => handleToolClick('https://figma.com')}>
            <div className="shortcut-logo">
              <img 
                src="https://static.figma.com/app/icon/1/favicon.ico" 
                alt="Figma"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentNode.querySelector('.shortcut-fallback').style.display = 'flex';
                }}
              />
              <div className="shortcut-fallback" style={{ display: 'none' }}>F</div>
            </div>
            <div className="shortcut-info">
              <h4>Figma</h4>
              <span className="shortcut-badge design">DESIGN</span>
            </div>
          </div>

          <div className="shortcut-card" onClick={() => handleToolClick('https://notion.so')}>
            <div className="shortcut-logo">
              <img 
                src="https://www.notion.so/favicon.ico" 
                alt="Notion"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentNode.querySelector('.shortcut-fallback').style.display = 'flex';
                }}
              />
              <div className="shortcut-fallback" style={{ display: 'none' }}>N</div>
            </div>
            <div className="shortcut-info">
              <h4>Notion</h4>
              <span className="shortcut-badge productivity">PRODUCTIVITY</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolsLibrary;
