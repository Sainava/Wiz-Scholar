import React, { useState } from 'react';

const AcademicLibrary = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Static academic resources
  const resources = [
    { 
      id: '1',
      title: 'Sample Mathematics Notes', 
      type: 'PDF', 
      subject: 'Mathematics',
      downloadUrl: '#',
      size: '2.3 MB',
      lastModified: '2024-01-15',
      icon: '📄'
    },
    { 
      id: '2',
      title: 'Sample Physics Lab Manual', 
      type: 'PDF', 
      subject: 'Physics',
      downloadUrl: '#',
      size: '1.8 MB',
      lastModified: '2024-01-10',
      icon: '📄'
    },
    { 
      id: '3',
      title: 'Chemistry Study Guide', 
      type: 'PDF', 
      subject: 'Chemistry',
      downloadUrl: '#',
      size: '3.1 MB',
      lastModified: '2024-01-12',
      icon: '📄'
    },
    { 
      id: '4',
      title: 'Computer Science Programming Guide', 
      type: 'PDF', 
      subject: 'Computer Science',
      downloadUrl: '#',
      size: '4.2 MB',
      lastModified: '2024-01-08',
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
    // Since we're using static data, just show an alert for demo purposes
    alert(`Preview functionality would open: ${resource.title}`);
  };

  const filteredResources = resources.filter(resource => {
    const matchesSearchTerm = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             resource.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || resource.subject === selectedCategory;
    return matchesSearchTerm && matchesCategory;
  });

  const uniqueSubjects = [...new Set(resources.map(resource => resource.subject))].sort();

  console.log('Academic Library State:', { 
    resourcesCount: resources.length, 
    filteredCount: filteredResources.length,
    searchTerm,
    selectedCategory 
  });

  return (
    <div className="academic-library">
      <div className="library-header">
        <h2>📚 Academic Library</h2>
        <p>Browse your study materials and resources</p>
        <small style={{color: '#666', fontSize: '12px'}}>
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
          <span>Found {filteredResources.length} resources</span>
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
                    <span className="resource-size">{resource.size}</span>
                    <span className="resource-date">{resource.lastModified}</span>
                  </div>
                </div>
                
                <div className="resource-actions">
                  <button 
                    onClick={() => handlePreview(resource)}
                    className="preview-btn"
                  >
                    👀 Preview
                  </button>
                  <a 
                    href={resource.downloadUrl} 
                    className="download-btn" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    📥 Download
                  </a>
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