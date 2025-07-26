import React, { useState } from 'react';
import './HogwartsSuite.css';

const AcademicLibrary = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Static academic resources with working URLs
  const resources = [
    { 
      id: '1',
      title: 'Introduction to Algorithms (CLRS)', 
      type: 'PDF', 
      subject: 'Computer Science',
      downloadUrl: 'https://edutechlearners.com/download/Introduction_to_algorithms-3rd%20Edition.pdf',
      previewUrl: 'https://github.com/walkccc/CLRS',
      size: '15.2 MB',
      lastModified: '2024-01-15',
      icon: '📄'
    },
    { 
      id: '2',
      title: 'Clean Code: A Handbook of Agile Software Craftsmanship', 
      type: 'PDF', 
      subject: 'Computer Science',
      downloadUrl: 'https://github.com/jnguyen095/clean-code/raw/master/Clean%20Code.pdf',
      previewUrl: 'https://github.com/jnguyen095/clean-code',
      size: '8.7 MB',
      lastModified: '2024-01-10',
      icon: '📄'
    },
    { 
      id: '3',
      title: 'Linear Algebra and Its Applications', 
      type: 'PDF', 
      subject: 'Mathematics',
      downloadUrl: 'https://www.math.ucdavis.edu/~linear/linear-guest.pdf',
      previewUrl: 'https://www.math.ucdavis.edu/~linear/',
      size: '12.4 MB',
      lastModified: '2024-01-12',
      icon: '📄'
    },
    { 
      id: '4',
      title: 'Calculus Early Transcendentals', 
      type: 'PDF', 
      subject: 'Mathematics',
      downloadUrl: 'https://www.whitman.edu/mathematics/calculus_online/calculus.pdf',
      previewUrl: 'https://www.whitman.edu/mathematics/calculus_online/',
      size: '9.8 MB',
      lastModified: '2024-01-08',
      icon: '📄'
    },
    { 
      id: '5',
      title: 'University Physics with Modern Physics', 
      type: 'PDF', 
      subject: 'Physics',
      downloadUrl: 'https://phys.libretexts.org/@api/deki/files/67375/University_Physics_Volume_1.pdf',
      previewUrl: 'https://phys.libretexts.org/',
      size: '18.3 MB',
      lastModified: '2024-01-05',
      icon: '📄'
    },
    { 
      id: '6',
      title: 'Principles of Chemistry', 
      type: 'PDF', 
      subject: 'Chemistry',
      downloadUrl: 'https://chem.libretexts.org/@api/deki/files/145/Principles_of_Chemistry.pdf',
      previewUrl: 'https://chem.libretexts.org/',
      size: '14.7 MB',
      lastModified: '2024-01-03',
      icon: '📄'
    },
    { 
      id: '7',
      title: 'Python Programming Tutorial', 
      type: 'PDF', 
      subject: 'Computer Science',
      downloadUrl: 'https://automatetheboringstuff.com/2e/automate.pdf',
      previewUrl: 'https://automatetheboringstuff.com/',
      size: '7.2 MB',
      lastModified: '2024-01-01',
      icon: '📄'
    },
    { 
      id: '8',
      title: 'Statistics and Probability', 
      type: 'PDF', 
      subject: 'Mathematics',
      downloadUrl: 'https://stats.libretexts.org/@api/deki/files/143/Statistics_and_Probability.pdf',
      previewUrl: 'https://stats.libretexts.org/',
      size: '11.5 MB',
      lastModified: '2023-12-28',
      icon: '📄'
    },
    { 
      id: '9',
      title: 'Organic Chemistry Fundamentals', 
      type: 'PDF', 
      subject: 'Chemistry',
      downloadUrl: 'https://chem.libretexts.org/@api/deki/files/142/Organic_Chemistry.pdf',
      previewUrl: 'https://chem.libretexts.org/Bookshelves/Organic_Chemistry',
      size: '16.8 MB',
      lastModified: '2023-12-25',
      icon: '📄'
    },
    { 
      id: '10',
      title: 'Classical Mechanics', 
      type: 'PDF', 
      subject: 'Physics',
      downloadUrl: 'https://phys.libretexts.org/@api/deki/files/144/Classical_Mechanics.pdf',
      previewUrl: 'https://phys.libretexts.org/Bookshelves/Classical_Mechanics',
      size: '13.9 MB',
      lastModified: '2023-12-20',
      icon: '📄'
    },
    { 
      id: '11',
      title: 'Web Development with JavaScript', 
      type: 'PDF', 
      subject: 'Computer Science',
      downloadUrl: 'https://eloquentjavascript.net/Eloquent_JavaScript.pdf',
      previewUrl: 'https://eloquentjavascript.net/',
      size: '5.4 MB',
      lastModified: '2023-12-18',
      icon: '📄'
    },
    { 
      id: '12',
      title: 'Discrete Mathematics', 
      type: 'PDF', 
      subject: 'Mathematics',
      downloadUrl: 'https://math.libretexts.org/@api/deki/files/141/Discrete_Mathematics.pdf',
      previewUrl: 'https://math.libretexts.org/Bookshelves/Combinatorics_and_Discrete_Mathematics',
      size: '10.2 MB',
      lastModified: '2023-12-15',
      icon: '📄'
    }
  ];

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handlePreview = (resource) => {
    // Open preview URL in new tab
    if (resource.previewUrl && resource.previewUrl !== "#") {
      window.open(resource.previewUrl, '_blank');
    } else {
      alert(`Preview functionality would open: ${resource.title}`);
    }
  };

  const handleDownload = (resource) => {
    // Open download URL in new tab
    if (resource.downloadUrl && resource.downloadUrl !== "#") {
      window.open(resource.downloadUrl, '_blank');
    } else {
      alert(`Download functionality would download: ${resource.title}`);
    }
  };

  const filteredResources = resources.filter(resource => {
    const matchesSearchTerm = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             resource.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || resource.subject === selectedCategory;
    return matchesSearchTerm && matchesCategory;
  });

  const uniqueSubjects = [...new Set(resources.map(resource => resource.subject))].sort();

  return (
    <div className="academic-library">
      <div className="library-header">
        <h2>📚 Academic Library</h2>
        <p>Browse your study materials and resources</p>
        <small style={{color: '#ffd700', fontSize: '12px'}}>
          {resources.length} resources available
        </small>
      </div>
      
      <div className="library-controls">
        <div className="search-bar">
          <input 
            type="text" 
            placeholder="🔍 Search resources..." 
            className="search-input"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        
        <div className="category-filter">
          <select 
            className="category-select"
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            <option value="all">All Categories ({resources.length})</option>
            {uniqueSubjects.map(subject => (
              <option key={subject} value={subject}>
                {subject} ({resources.filter(r => r.subject === subject).length})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="resources-section">
        <div className="resources-stats">
          <span>Showing {filteredResources.length} of {resources.length} resources</span>
        </div>
        
        <div className="resources-grid">
          {filteredResources.length > 0 ? (
            filteredResources.map((resource) => (
              <div key={resource.id} className="resource-card">
                <div className="resource-header">
                  <div className="resource-icon">{resource.icon}</div>
                  <div className="resource-type-badge">{resource.type}</div>
                </div>
                
                <div className="resource-content">
                  <h3 className="resource-title">{resource.title}</h3>
                  <div className="resource-meta">
                    <span className="resource-subject">{resource.subject}</span>
                    <span className="resource-size">Size: {resource.size}</span>
                    <span className="resource-date">Added: {resource.lastModified}</span>
                  </div>
                </div>
                
                <div className="resource-actions">
                  <button 
                    onClick={() => handlePreview(resource)}
                    className="preview-btn"
                  >
                    👀 Preview
                  </button>
                  <button 
                    onClick={() => handleDownload(resource)}
                    className="download-btn"
                  >
                    📥 Download
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-resources">
              <div className="no-resources-icon">📚</div>
              <h3>No resources found</h3>
              <p>Try adjusting your search terms or category filter</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AcademicLibrary;
