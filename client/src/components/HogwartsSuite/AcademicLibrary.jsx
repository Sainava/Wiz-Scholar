import React, { useState, useEffect } from 'react';

const AcademicLibrary = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [folders, setFolders] = useState([]);

  // Your Google Drive folder ID
  const MAIN_FOLDER_ID = '1S33U7pbt-TbrIEGDQpf8dLzRcfZRCzUw';
  
  // Replace with your actual Google Drive API key
  const API_KEY = process.env.REACT_APP_GOOGLE_DRIVE_API_KEY || 'YOUR_GOOGLE_DRIVE_API_KEY';

  useEffect(() => {
    fetchGoogleDriveContent();
  }, []);

  const fetchGoogleDriveContent = async () => {
    try {
      // First, fetch folders
      await fetchFolders();
      // Then fetch all files
      await fetchAllFiles();
    } catch (error) {
      console.error('Error fetching Google Drive content:', error);
      setResources(getStaticResources());
    } finally {
      setLoading(false);
    }
  };

  const fetchFolders = async () => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files?q='${MAIN_FOLDER_ID}' in parents and mimeType='application/vnd.google-apps.folder'&key=${API_KEY}&fields=files(id,name)`
      );
      
      const data = await response.json();
      if (data.files) {
        setFolders(data.files);
      }
    } catch (error) {
      console.error('Error fetching folders:', error);
    }
  };

  const fetchAllFiles = async () => {
    try {
      let allFiles = [];
      
      // Fetch files from main folder
      const mainFolderFiles = await fetchFilesFromFolder(MAIN_FOLDER_ID);
      allFiles = [...mainFolderFiles];

      // Fetch files from subfolders
      for (const folder of folders) {
        const folderFiles = await fetchFilesFromFolder(folder.id, folder.name);
        allFiles = [...allFiles, ...folderFiles];
      }

      const formattedResources = allFiles.map(file => ({
        id: file.id,
        title: file.name,
        type: getFileType(file.mimeType),
        subject: file.folderName || extractSubjectFromName(file.name),
        downloadUrl: `https://drive.google.com/file/d/${file.id}/view`,
        directDownload: `https://drive.google.com/uc?export=download&id=${file.id}`,
        previewUrl: `https://drive.google.com/file/d/${file.id}/preview`,
        thumbnail: file.thumbnailLink,
        size: formatFileSize(file.size),
        lastModified: new Date(file.modifiedTime).toLocaleDateString(),
        mimeType: file.mimeType,
        icon: getFileIcon(file.mimeType)
      }));
      
      setResources(formattedResources);
    } catch (error) {
      console.error('Error fetching all files:', error);
    }
  };

  const fetchFilesFromFolder = async (folderId, folderName = '') => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files?q='${folderId}' in parents and mimeType!='application/vnd.google-apps.folder'&key=${API_KEY}&fields=files(id,name,mimeType,webViewLink,thumbnailLink,size,modifiedTime)&orderBy=modifiedTime desc`
      );
      
      const data = await response.json();
      
      if (data.files) {
        return data.files.map(file => ({
          ...file,
          folderName: folderName
        }));
      }
      return [];
    } catch (error) {
      console.error(`Error fetching files from folder ${folderId}:`, error);
      return [];
    }
  };

  const getFileType = (mimeType) => {
    const typeMap = {
      'application/pdf': 'PDF',
      'application/vnd.ms-powerpoint': 'PPT',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'PPTX',
      'application/msword': 'DOC',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
      'text/plain': 'TXT',
      'image/jpeg': 'JPG',
      'image/png': 'PNG',
      'application/vnd.ms-excel': 'XLS',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'XLSX',
      'video/mp4': 'MP4',
      'video/avi': 'AVI'
    };
    return typeMap[mimeType] || 'FILE';
  };

  const getFileIcon = (mimeType) => {
    const iconMap = {
      'application/pdf': '📄',
      'application/vnd.ms-powerpoint': '📊',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': '📊',
      'application/msword': '📝',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '📝',
      'text/plain': '📃',
      'image/jpeg': '🖼️',
      'image/png': '🖼️',
      'application/vnd.ms-excel': '📊',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '📊',
      'video/mp4': '🎥',
      'video/avi': '🎥'
    };
    return iconMap[mimeType] || '📁';
  };

  const extractSubjectFromName = (fileName) => {
    const name = fileName.toLowerCase();
    if (name.includes('math') || name.includes('mathematics') || name.includes('calculus') || name.includes('algebra')) return 'Mathematics';
    if (name.includes('physics') || name.includes('mechanics') || name.includes('thermodynamics')) return 'Physics';
    if (name.includes('chemistry') || name.includes('organic') || name.includes('inorganic')) return 'Chemistry';
    if (name.includes('computer') || name.includes('programming') || name.includes('cs') || name.includes('java') || name.includes('python')) return 'Computer Science';
    if (name.includes('biology') || name.includes('bio') || name.includes('anatomy')) return 'Biology';
    if (name.includes('english') || name.includes('literature') || name.includes('grammar')) return 'English';
    if (name.includes('history') || name.includes('historical')) return 'History';
    if (name.includes('economics') || name.includes('finance') || name.includes('business')) return 'Economics';
    if (name.includes('engineering') || name.includes('mechanical') || name.includes('electrical')) return 'Engineering';
    return 'General';
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'Unknown';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getStaticResources = () => [
    { 
      id: '1',
      title: 'Sample Mathematics Notes', 
      type: 'PDF', 
      subject: 'Mathematics',
      downloadUrl: 'https://drive.google.com/drive/folders/1S33U7pbt-TbrIEGDQpf8dLzRcfZRCzUw',
      size: '2.3 MB',
      lastModified: '2024-01-15',
      icon: '📄'
    },
    { 
      id: '2',
      title: 'Sample Physics Lab Manual', 
      type: 'PDF', 
      subject: 'Physics',
      downloadUrl: 'https://drive.google.com/drive/folders/1S33U7pbt-TbrIEGDQpf8dLzRcfZRCzUw',
      size: '1.8 MB',
      lastModified: '2024-01-10',
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
    if (resource.previewUrl) {
      window.open(resource.previewUrl, '_blank');
    } else {
      window.open(resource.downloadUrl, '_blank');
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
        <p>Access your study materials from Google Drive</p>
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

      {loading ? (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading resources from Google Drive...</p>
        </div>
      ) : (
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
                      href={resource.directDownload} 
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
      )}
    </div>
  );
};

export default AcademicLibrary;