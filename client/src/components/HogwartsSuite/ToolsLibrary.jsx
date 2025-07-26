import React, { useState } from 'react';

const ToolsLibrary = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const toolsData = [
    // Networking & Job 💼
    {
      category: 'networking',
      name: 'LinkedIn',
      description: 'Professional networking platform for career opportunities',
      url: 'https://www.linkedin.com/',
      logo: 'https://content.linkedin.com/content/dam/me/business/en-us/amp/brand-site/v2/bg/LI-Bug.svg.original.svg'
    },
    {
      category: 'networking',
      name: 'AngelList',
      description: 'Startup jobs and networking platform',
      url: 'https://angel.co/',
      logo: 'https://angel.co/images/shared/angellist_logo_512.png'
    },
    {
      category: 'networking',
      name: 'Commudle',
      description: 'Community platform for tech professionals',
      url: 'https://www.commudle.com/',
      logo: 'https://www.commudle.com/assets/images/commudle-logo192.png'
    },
    {
      category: 'networking',
      name: 'Lu.ma',
      description: 'Event discovery and networking platform',
      url: 'https://lu.ma/discover',
      logo: 'https://lu.ma/favicon-192x192.png'
    },
    {
      category: 'networking',
      name: 'Eventbrite',
      description: 'Event hosting and discovery platform',
      url: 'https://www.eventbrite.com/',
      logo: 'https://cdn.evbstatic.com/s3-build/perm_001/259cc8/django/images/logo.png'
    },
    {
      category: 'networking',
      name: 'Meetup',
      description: 'Find and join local events and groups',
      url: 'https://www.meetup.com/',
      logo: 'https://secure.meetupstatic.com/next/images/shared/meetup-logo--red.svg'
    },

    // Extended Reality XR
    {
      category: 'xr',
      name: 'SnapChat Lens Studio',
      description: 'Create AR experiences for Snapchat',
      url: 'https://ar.snap.com/lens-studio',
      logo: 'https://ar.snap.com/images/lens-studio-icon.png'
    },
    {
      category: 'xr',
      name: 'Meta Spark Studio',
      description: 'Create AR effects for Meta platforms',
      url: 'https://sparkar.facebook.com/',
      logo: 'https://sparkar.facebook.com/ar-studio/img/favicon/favicon-96x96.png'
    },
    {
      category: 'xr',
      name: 'TikTok Effect House',
      description: 'Create AR effects for TikTok',
      url: 'https://effecthouse.tiktok.com/',
      logo: 'https://sf16-website-login.neutral.ttwstatic.com/obj/tiktok_web_login_static/tiktok/webapp/main/webapp-desktop/images/logo.png'
    },
    {
      category: 'xr',
      name: 'Blender',
      description: 'Free 3D creation suite for modeling and animation',
      url: 'https://www.blender.org/',
      logo: 'https://www.blender.org/wp-content/uploads/2019/07/blender_logo_socket.png'
    },

    // Free Courses 🎓
    {
      category: 'courses',
      name: 'Coursera',
      description: 'Free courses from top universities and companies',
      url: 'https://www.coursera.org/',
      logo: 'https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://coursera-course-photos.s3.amazonaws.com/fb/2dcb00d6f011e682d8b14eeb7fefff/Coursera_Wordmark_Square_Blue_300x300.png'
    },
    {
      category: 'courses',
      name: 'edX',
      description: 'Free online courses from top universities',
      url: 'https://www.edx.org/',
      logo: 'https://www.edx.org/images/logos/edx-logo-elm.svg'
    },
    {
      category: 'courses',
      name: 'Khan Academy',
      description: 'Free educational videos and exercises',
      url: 'https://www.khanacademy.org/',
      logo: 'https://cdn.kastatic.org/images/khan-logo-dark-background-2.png'
    },
    {
      category: 'courses',
      name: 'MIT OpenCourseWare',
      description: 'Free MIT course materials online',
      url: 'https://ocw.mit.edu/',
      logo: 'https://ocw.mit.edu/images/mit-logo.gif'
    },
    {
      category: 'courses',
      name: 'NPTEL',
      description: 'Indian government free online courses',
      url: 'https://nptel.ac.in/',
      logo: 'https://nptel.ac.in/img/nptel-logo.png'
    },
    {
      category: 'courses',
      name: 'Codecademy',
      description: 'Interactive coding lessons for beginners',
      url: 'https://www.codecademy.com/',
      logo: 'https://www.codecademy.com/favicon.ico'
    },

    // Content & Productivity Tools
    {
      category: 'content',
      name: 'Grammarly',
      description: 'Grammar correction and writing assistant',
      url: 'https://app.grammarly.com/',
      logo: 'https://static.grammarly.com/assets/files/afe4b0eabc09c3ddbbb72ec9c0e90bb6/favicon.svg'
    },
    {
      category: 'content',
      name: 'Remove.bg',
      description: 'Remove image backgrounds automatically',
      url: 'https://www.remove.bg/',
      logo: 'https://www.remove.bg/favicon-194x194.png'
    },
    {
      category: 'content',
      name: 'QuillBot',
      description: 'AI-powered paraphrasing and writing tool',
      url: 'https://quillbot.com/',
      logo: 'https://quillbot.com/favicon.png'
    },
    {
      category: 'content',
      name: 'Notion',
      description: 'All-in-one workspace for notes and collaboration',
      url: 'https://www.notion.so/',
      logo: 'https://www.notion.so/images/favicon.ico'
    },
    {
      category: 'content',
      name: 'Hemingway Editor',
      description: 'Make your writing clear and readable',
      url: 'https://hemingwayapp.com/',
      logo: 'https://hemingwayapp.com/img/favicon.ico'
    },
    {
      category: 'content',
      name: 'Canva',
      description: 'Free graphic design tool for students',
      url: 'https://www.canva.com/education/',
      logo: 'https://static.canva.com/web/images/favicon.ico'
    },
    {
      category: 'content',
      name: 'Google Translate',
      description: 'Language translator for text and documents',
      url: 'https://translate.google.com/',
      logo: 'https://ssl.gstatic.com/translate/favicon.ico'
    },
    {
      category: 'content',
      name: 'TinyPNG',
      description: 'Compress PNG and JPEG images without quality loss',
      url: 'https://tinypng.com/',
      logo: 'https://tinypng.com/images/favicon.ico'
    },
    {
      category: 'content',
      name: 'PDF24',
      description: 'Free PDF tools for merging, splitting, and editing',
      url: 'https://tools.pdf24.org/en/',
      logo: 'https://tools.pdf24.org/static/img/pdf24-logo.svg'
    },

    // Research & Academic Tools
    {
      category: 'academic',
      name: 'Google Scholar',
      description: 'Academic search engine for scholarly literature',
      url: 'https://scholar.google.com/',
      logo: 'https://scholar.google.com/favicon.ico'
    },
    {
      category: 'academic',
      name: 'ResearchGate',
      description: 'Social network for scientists and researchers',
      url: 'https://www.researchgate.net/',
      logo: 'https://www.researchgate.net/favicon.ico'
    },
    {
      category: 'academic',
      name: 'Zotero',
      description: 'Free reference management software',
      url: 'https://www.zotero.org/',
      logo: 'https://www.zotero.org/static/images/favicon.ico'
    },
    {
      category: 'academic',
      name: 'Sci-Hub',
      description: 'Free access to scientific papers',
      url: 'https://sci-hub.se/',
      logo: 'https://sci-hub.se/favicon.ico'
    },

    // Business & Entrepreneurship
    {
      category: 'business',
      name: 'Startup School by Y Combinator',
      description: 'Free online course on building startups',
      url: 'https://www.startupschool.org/',
      logo: 'https://www.ycombinator.com/assets/favicon.ico'
    },
    {
      category: 'business',
      name: 'Harvard Business Review',
      description: 'Business insights and case studies',
      url: 'https://hbr.org/',
      logo: 'https://hbr.org/favicon.ico'
    },
    {
      category: 'business',
      name: 'Lean Canvas',
      description: 'Free business model canvas tool',
      url: 'https://leanstack.com/leancanvas',
      logo: 'https://leanstack.com/favicon.ico'
    },

    // Student Life & Finance
    {
      category: 'finance',
      name: 'Splitwise',
      description: 'Split bills and expenses with friends',
      url: 'https://www.splitwise.com/',
      logo: 'https://assets.splitwise.com/assets/core/logo-square.svg'
    },
    {
      category: 'finance',
      name: 'Mint',
      description: 'Free personal finance and budgeting tool',
      url: 'https://mint.intuit.com/',
      logo: 'https://mint.intuit.com/favicon.ico'
    },
    {
      category: 'finance',
      name: 'Student Loan Hero',
      description: 'Student loan management and advice',
      url: 'https://studentloanhero.com/',
      logo: 'https://studentloanhero.com/favicon.ico'
    },

    // Coding & Development 💻
    {
      category: 'coding',
      name: 'Visual Studio Code',
      description: 'Free code editor with extensive extensions',
      url: 'https://code.visualstudio.com/',
      logo: 'https://code.visualstudio.com/favicon.ico'
    },
    {
      category: 'coding',
      name: 'GitHub',
      description: 'Version control and code collaboration platform',
      url: 'https://github.com/',
      logo: 'https://github.githubassets.com/favicons/favicon.svg'
    },
    {
      category: 'coding',
      name: 'FreeCodeCamp',
      description: 'Learn coding through interactive lessons',
      url: 'https://www.freecodecamp.org/learn/',
      logo: 'https://www.freecodecamp.org/news/content/images/2019/05/fcc_primary_large_24X210.svg'
    },
    {
      category: 'coding',
      name: 'LeetCode',
      description: 'Practice coding problems and algorithms',
      url: 'https://leetcode.com/',
      logo: 'https://leetcode.com/favicon.ico'
    },
    {
      category: 'coding',
      name: 'Replit',
      description: 'Online coding environment and collaboration',
      url: 'https://replit.com/',
      logo: 'https://replit.com/favicon.ico'
    },
    {
      category: 'coding',
      name: 'CodePen',
      description: 'Online code editor for web development',
      url: 'https://codepen.io/',
      logo: 'https://cpwebassets.codepen.io/assets/favicon/favicon-touch-de50acbf5d634ec6791894eba4ba9cf490f709b3d742597c6fc4b734e6492a5a.png'
    },
    {
      category: 'coding',
      name: 'Stack Overflow',
      description: 'Programming Q&A community',
      url: 'https://stackoverflow.com/',
      logo: 'https://cdn.sstatic.net/Sites/stackoverflow/Img/favicon.ico'
    },
    {
      category: 'coding',
      name: 'HackerRank',
      description: 'Coding challenges and skill assessment',
      url: 'https://www.hackerrank.com/',
      logo: 'https://hrcdn.net/fcore/assets/favicon-ddc852f75a.png'
    },
    {
      category: 'coding',
      name: 'GeeksforGeeks',
      description: 'Computer science tutorials and practice',
      url: 'https://www.geeksforgeeks.org/',
      logo: 'https://www.geeksforgeeks.org/favicon.ico'
    },

    // Student Discounts & Deals 🛍
    {
      category: 'discounts',
      name: 'GitHub Student Pack',
      description: 'Free developer tools and services for students',
      url: 'https://education.github.com/pack',
      logo: 'https://github.githubassets.com/favicons/favicon.svg'
    },
    {
      category: 'discounts',
      name: 'UniDays',
      description: 'Student discounts and exclusive offers',
      url: 'https://www.myunidays.com/',
      logo: 'https://assets.myunidays.com/logos/v1.2.0/app-icon-gradient-blue.png'
    },
    {
      category: 'discounts',
      name: 'Student Beans',
      description: 'Student discounts on popular brands',
      url: 'https://www.studentbeans.com/',
      logo: 'https://www.studentbeans.com/favicon.ico'
    },
    {
      category: 'discounts',
      name: 'Adobe Creative Cloud',
      description: '60% student discount on Creative Suite',
      url: 'https://www.adobe.com/creativecloud/buy/students.html',
      logo: 'https://www.adobe.com/favicon.ico'
    },
    {
      category: 'discounts',
      name: 'Spotify Premium Student',
      description: '50% off music streaming for students',
      url: 'https://www.spotify.com/student/',
      logo: 'https://open.spotifycdn.com/cdn/images/favicon32.b64ecc03.png'
    },

    // Design & Creative Tools 🎨
    {
      category: 'design',
      name: 'Figma',
      description: 'Free collaborative design tool',
      url: 'https://www.figma.com/',
      logo: 'https://static.figma.com/app/icon/1/favicon.svg'
    },
    {
      category: 'design',
      name: 'Canva',
      description: 'Easy graphic design with student templates',
      url: 'https://www.canva.com/',
      logo: 'https://static.canva.com/web/images/favicon.ico'
    },
    {
      category: 'design',
      name: 'Unsplash',
      description: 'Free high-quality stock photos',
      url: 'https://unsplash.com/',
      logo: 'https://unsplash.com/favicon-32x32.png'
    },
    {
      category: 'design',
      name: 'Dribbble',
      description: 'Design inspiration and portfolio showcase',
      url: 'https://dribbble.com/',
      logo: 'https://cdn.dribbble.com/assets/favicon-b26bd371b48dee92a3a8d6e96bb8e18a6b7b25ba1dcf221b45e5bfa6daaac5db.ico'
    },
    {
      category: 'design',
      name: 'Adobe Color',
      description: 'Create and explore color palettes',
      url: 'https://color.adobe.com/',
      logo: 'https://color.adobe.com/favicon.ico'
    },
    {
      category: 'design',
      name: 'GIMP',
      description: 'Free alternative to Photoshop',
      url: 'https://www.gimp.org/',
      logo: 'https://www.gimp.org/images/wilber-outline.svg'
    },
    {
      category: 'design',
      name: 'Pexels',
      description: 'Free stock photos and videos',
      url: 'https://www.pexels.com/',
      logo: 'https://www.pexels.com/favicon.ico'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Tools', count: toolsData.length },
    { id: 'networking', name: 'Networking & Jobs', count: toolsData.filter(tool => tool.category === 'networking').length },
    { id: 'xr', name: 'Extended Reality', count: toolsData.filter(tool => tool.category === 'xr').length },
    { id: 'courses', name: 'Free Courses', count: toolsData.filter(tool => tool.category === 'courses').length },
    { id: 'content', name: 'Content & Productivity', count: toolsData.filter(tool => tool.category === 'content').length },
    { id: 'academic', name: 'Research & Academic', count: toolsData.filter(tool => tool.category === 'academic').length },
    { id: 'business', name: 'Business & Startup', count: toolsData.filter(tool => tool.category === 'business').length },
    { id: 'finance', name: 'Finance & Budget', count: toolsData.filter(tool => tool.category === 'finance').length },
    { id: 'coding', name: 'Coding & Development', count: toolsData.filter(tool => tool.category === 'coding').length },
    { id: 'design', name: 'Design & Creative', count: toolsData.filter(tool => tool.category === 'design').length },
    { id: 'discounts', name: 'Student Discounts', count: toolsData.filter(tool => tool.category === 'discounts').length }
  ];

  const filteredTools = toolsData.filter(tool => {
    const matchesCategory = activeCategory === 'all' || tool.category === activeCategory;
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="tools-library">
      <div className="tools-header">
        <h2>The Room of Requirement</h2>
        <p><i>Forged in the fires of need and sharpened by time, these essential digital relics stand ready — crafted for both the inquisitive student and the battle-worn professional.</i></p>
      </div>

      <div className="tools-search">
        <input
          type="text"
          placeholder="🔍 Search tools..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="category-tabs">
        {categories.map(category => (
          <button
            key={category.id}
            className={`category-tab ${activeCategory === category.id ? 'active' : ''}`}
            onClick={() => setActiveCategory(category.id)}
          >
            {category.name} ({category.count})
          </button>
        ))}
      </div>

      <div className="tools-cards-grid">
        {filteredTools.map((tool, index) => (
          <div key={index} className="tool-card">
            <div className="tool-logo-section">
              <img 
                src={tool.logo} 
                alt={tool.name}
                className="tool-logo"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="tool-logo-fallback" style={{display: 'none'}}>
                {tool.name.charAt(0)}
              </div>
            </div>
            
            <div className="tool-info">
              <h3 className="tool-name">
                <a href={tool.url} target="_blank" rel="noopener noreferrer">
                  {tool.name}
                </a>
              </h3>
              
              <div className="tool-category">
                {categories.find(cat => cat.id === tool.category)?.name || 'Tool'}
              </div>
              
              <p className="tool-desc">{tool.description}</p>
              
              <a 
                href={tool.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="tool-link"
              >
                🚀 Open Tool
              </a>
            </div>
          </div>
        ))}
      </div>

      {filteredTools.length === 0 && (
        <div className="no-results">
          <p>No tools found matching your criteria</p>
        </div>
      )}
    </div>
  );
};

export default ToolsLibrary;
