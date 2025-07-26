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
      logo: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png'
    },
    {
      category: 'networking',
      name: 'Next Level',
      description: 'Career advancement and networking platform',
      url: 'https://nextlevel.app/',
      logo: 'https://nextlevel.app/favicon.ico'
    },
    {
      category: 'networking',
      name: 'Commudle',
      description: 'Community platform for tech professionals',
      url: 'https://www.commudle.com/',
      logo: 'https://www.commudle.com/favicon.ico'
    },
    {
      category: 'networking',
      name: 'Lu.ma',
      description: 'Event discovery and networking platform',
      url: 'https://lu.ma/discover',
      logo: 'https://lu.ma/favicon.ico'
    },
    {
      category: 'networking',
      name: 'Eventbrite',
      description: 'Event hosting and discovery platform',
      url: 'https://www.eventbrite.com/',
      logo: 'https://cdn.evbstatic.com/s3-build/perm_001/b4175c/django/images/favicon.ico'
    },
    {
      category: 'networking',
      name: 'Prosple',
      description: 'Graduate career platform and job search',
      url: 'https://in.prosple.com/',
      logo: 'https://in.prosple.com/favicon.ico'
    },

    // Extended Reality XR
    {
      category: 'xr',
      name: 'XR Bazaar',
      description: 'Extended reality marketplace and resources',
      url: 'https://xrbazaar.co/',
      logo: 'https://xrbazaar.co/favicon.ico'
    },
    {
      category: 'xr',
      name: 'SnapChat Lens Studio',
      description: 'Create AR experiences for Snapchat',
      url: 'https://ar.snap.com/lens-studio',
      logo: 'https://ar.snap.com/favicon.ico'
    },
    {
      category: 'xr',
      name: 'Meta Spark Hub',
      description: 'Create AR effects for Meta platforms',
      url: 'https://spark.meta.com/',
      logo: 'https://spark.meta.com/favicon.ico'
    },
    {
      category: 'xr',
      name: 'TikTok Effect House',
      description: 'Create AR effects for TikTok',
      url: 'https://effecthouse.tiktok.com/',
      logo: 'https://effecthouse.tiktok.com/favicon.ico'
    },
    {
      category: 'xr',
      name: 'LensList',
      description: 'AR lens discovery and sharing platform',
      url: 'https://lenslist.co/',
      logo: 'https://lenslist.co/favicon.ico'
    },
    {
      category: 'xr',
      name: 'Road to VR',
      description: 'VR news and reviews',
      url: 'https://www.roadtovr.com/',
      logo: 'https://www.roadtovr.com/favicon.ico'
    },

    // Free Courses 🎓
    {
      category: 'courses',
      name: 'edX',
      description: 'Free online courses from top universities',
      url: 'https://www.edx.org/',
      logo: 'https://www.edx.org/favicon.ico'
    },
    {
      category: 'courses',
      name: 'Saylor Academy',
      description: 'Free online college courses',
      url: 'https://www.saylor.org/',
      logo: 'https://www.saylor.org/favicon.ico'
    },
    {
      category: 'courses',
      name: 'Udemy',
      description: 'Online learning platform with diverse courses',
      url: 'https://www.udemy.com/',
      logo: 'https://www.udemy.com/staticx/udemy/images/v7/favicon.ico'
    },
    {
      category: 'courses',
      name: 'Mind Luster',
      description: 'Free online courses and educational content',
      url: 'https://www.mindluster.com/',
      logo: 'https://www.mindluster.com/favicon.ico'
    },
    {
      category: 'courses',
      name: 'NPTEL Swayam',
      description: 'Indian government free online courses',
      url: 'https://swayam.gov.in/nc_details/NPTEL',
      logo: 'https://swayam.gov.in/favicon.ico'
    },
    {
      category: 'courses',
      name: 'Digital Defynd',
      description: 'Curated list of best online courses',
      url: 'https://digitaldefynd.com/',
      logo: 'https://digitaldefynd.com/favicon.ico'
    },

    // Content Literature Tools
    {
      category: 'content',
      name: 'Grammarly',
      description: 'Grammar correction and writing assistant',
      url: 'https://app.grammarly.com/',
      logo: 'https://static.grammarly.com/assets/files/5d8d4c0bccc78de6e8d6ba6cf2147897/favicon.ico'
    },
    {
      category: 'content',
      name: 'Hemingway App',
      description: 'Writing clarity and readability checker',
      url: 'https://hemingwayapp.com/',
      logo: 'https://hemingwayapp.com/favicon.ico'
    },
    {
      category: 'content',
      name: 'Bubble Mind Maps',
      description: 'Create mind maps and brainstorm ideas',
      url: 'https://bubbl.us/',
      logo: 'https://bubbl.us/favicon.ico'
    },
    {
      category: 'content',
      name: 'TinEye',
      description: 'Reverse image search to find image sources',
      url: 'https://tineye.com/',
      logo: 'https://tineye.com/favicon.ico'
    },
    {
      category: 'content',
      name: 'Google Translator',
      description: 'Language translator for text and documents',
      url: 'https://translate.google.com/',
      logo: 'https://ssl.gstatic.com/translate/favicon.ico'
    },

    // Marketing & Entrepreneurial
    {
      category: 'business',
      name: 'BBA Mantra',
      description: 'Business administration resources and guides',
      url: 'https://bbamantra.com/',
      logo: 'https://bbamantra.com/favicon.ico'
    },
    {
      category: 'business',
      name: 'Bloomberg Businessweek',
      description: 'Business news and market insights',
      url: 'https://www.bloomberg.com/businessweek',
      logo: 'https://www.bloomberg.com/favicon.ico'
    },
    {
      category: 'business',
      name: 'Financial Times',
      description: 'MBA and business education news',
      url: 'https://www.ft.com/mba',
      logo: 'https://www.ft.com/favicon.ico'
    },
    {
      category: 'business',
      name: 'Business Because',
      description: 'MBA and business school news',
      url: 'https://www.businessbecause.com/news/in-the-news',
      logo: 'https://www.businessbecause.com/favicon.ico'
    },

    // Commerce Resources
    {
      category: 'commerce',
      name: 'StatAnalytica',
      description: '150+ Project ideas for B.Com students',
      url: 'https://statanalytica.com/blog/simple-project-topics-for-b-com-students/',
      logo: 'https://statanalytica.com/favicon.ico'
    },
    {
      category: 'commerce',
      name: 'StudyNama',
      description: 'Free notes and ebooks for commerce students',
      url: 'https://www.studynama.com/community/forums/bcom-notes-ebook-download/',
      logo: 'https://www.studynama.com/favicon.ico'
    },

    // Coding 💻
    {
      category: 'coding',
      name: 'FreeCodeCamp',
      description: 'Learn coding through interactive lessons',
      url: 'https://www.freecodecamp.org/learn/',
      logo: 'https://www.freecodecamp.org/favicon.ico'
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
      name: 'NeetCode',
      description: 'Coding interview preparation platform',
      url: 'https://neetcode.io/',
      logo: 'https://neetcode.io/favicon.ico'
    },
    {
      category: 'coding',
      name: 'The Odin Project',
      description: 'Full-stack web development curriculum',
      url: 'https://www.theodinproject.com/dashboard',
      logo: 'https://www.theodinproject.com/favicon.ico'
    },
    {
      category: 'coding',
      name: 'Kaggle',
      description: 'Data science competitions and datasets',
      url: 'https://www.kaggle.com/',
      logo: 'https://www.kaggle.com/favicon.ico'
    },
    {
      category: 'coding',
      name: 'GeeksforGeeks',
      description: 'Computer science projects and tutorials',
      url: 'https://www.geeksforgeeks.org/',
      logo: 'https://www.geeksforgeeks.org/favicon.ico'
    },
    {
      category: 'coding',
      name: 'GitHub',
      description: 'Version control and code collaboration',
      url: 'https://github.com/',
      logo: 'https://github.com/favicon.ico'
    },
    {
      category: 'coding',
      name: 'HackerRank',
      description: 'Coding challenges and skill assessment',
      url: 'https://www.hackerrank.com/',
      logo: 'https://www.hackerrank.com/favicon.ico'
    },
    {
      category: 'coding',
      name: 'CodePen',
      description: 'Online code editor and sharing platform',
      url: 'https://codepen.io/',
      logo: 'https://codepen.io/favicon.ico'
    },
    {
      category: 'coding',
      name: 'Coding Game',
      description: 'Learn programming through games',
      url: 'https://www.codinggame.com/start/',
      logo: 'https://www.codinggame.com/favicon.ico'
    },

    // Student Discounts 🛍
    {
      category: 'discounts',
      name: 'UniDays',
      description: 'Student discounts and exclusive offers',
      url: 'https://www.myunidays.com/',
      logo: 'https://www.myunidays.com/favicon.ico'
    },
    {
      category: 'discounts',
      name: 'Student Peeps',
      description: 'Student community and discount platform',
      url: 'https://studentpeeps.club/',
      logo: 'https://studentpeeps.club/favicon.ico'
    },

    // Designing 🎨
    {
      category: 'design',
      name: 'Behance',
      description: 'Creative portfolio showcase platform',
      url: 'https://www.behance.net/',
      logo: 'https://a5.behance.net/favicon.ico'
    },
    {
      category: 'design',
      name: 'Canva',
      description: 'User-friendly online graphic design tool',
      url: 'https://www.canva.com/',
      logo: 'https://static.canva.com/web/images/favicon.ico'
    },
    {
      category: 'design',
      name: 'Figma',
      description: 'Collaborative interface design tool',
      url: 'https://www.figma.com/',
      logo: 'https://static.figma.com/app/icon/1/favicon.ico'
    },
    {
      category: 'design',
      name: 'Adobe Color',
      description: 'Color palette generator and color wheel',
      url: 'https://color.adobe.com/create/color-wheel',
      logo: 'https://color.adobe.com/favicon.ico'
    },
    {
      category: 'design',
      name: 'Color Hunt',
      description: 'Beautiful color palettes for designers',
      url: 'https://colorhunt.co/',
      logo: 'https://colorhunt.co/favicon.ico'
    },
    {
      category: 'design',
      name: 'Dribbble',
      description: 'Design inspiration and portfolio platform',
      url: 'https://dribbble.com/',
      logo: 'https://cdn.dribbble.com/assets/favicon-b38525134603b5c0d0c75e36c5140ac9.ico'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Tools', count: toolsData.length },
    { id: 'networking', name: 'Networking & Jobs', count: toolsData.filter(tool => tool.category === 'networking').length },
    { id: 'xr', name: 'Extended Reality', count: toolsData.filter(tool => tool.category === 'xr').length },
    { id: 'courses', name: 'Free Courses', count: toolsData.filter(tool => tool.category === 'courses').length },
    { id: 'content', name: 'Content Tools', count: toolsData.filter(tool => tool.category === 'content').length },
    { id: 'business', name: 'Business', count: toolsData.filter(tool => tool.category === 'business').length },
    { id: 'commerce', name: 'Commerce', count: toolsData.filter(tool => tool.category === 'commerce').length },
    { id: 'coding', name: 'Coding', count: toolsData.filter(tool => tool.category === 'coding').length },
    { id: 'design', name: 'Design', count: toolsData.filter(tool => tool.category === 'design').length },
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
        <h2>🛠️ Digital Tools Library</h2>
        <p>Essential digital tools organized for students and professionals</p>
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