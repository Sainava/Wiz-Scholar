import { useState } from 'react';
import PDFUploader from './components/PDFUploader';
import PDFViewer from './components/PDFViewer';
import SummaryPanel from './components/SummaryPanel';
import './App.css';

function App() {
  const [uploadedPDF, setUploadedPDF] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleUploadSuccess = (pdfData) => {
    console.log('PDF uploaded successfully:', pdfData);
    setUploadedPDF(pdfData);
    setSuccess(`✅ ${pdfData.filename} uploaded successfully!`);
    setError('');
  };

  const handleUploadError = (errorMessage) => {
    console.error('Upload error:', errorMessage);
    setError(errorMessage);
    setSuccess('');
  };

  const handleNewUpload = () => {
    setUploadedPDF(null);
    setError('');
    setSuccess('');
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🧙‍♂️ Wiz-Scholar PDF Viewer</h1>
        <p>Upload and view PDF documents with AI-powered features</p>
      </header>

      <main className="app-main">
        {/* Messages */}
        {error && (
          <div className="message error-message">
            <span>❌</span>
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="message success-message">
            <span>✅</span>
            <span>{success}</span>
          </div>
        )}

        {/* Main Content */}
        <div className="app-content">
          {!uploadedPDF ? (
            <div className="upload-section">
              <PDFUploader 
                onUploadSuccess={handleUploadSuccess}
                onUploadError={handleUploadError}
              />
            </div>
          ) : (
            <div className="pdf-section">
              {/* Document Info */}
              <div className="document-info">
                <div className="doc-details">
                  <h3>📄 Document Details</h3>
                  <div className="info-grid">
                    <div className="info-item">
                      <span className="label">Filename:</span>
                      <span className="value">{uploadedPDF.filename}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">File Size:</span>
                      <span className="value">{(uploadedPDF.fileSize / 1024 / 1024).toFixed(2)} MB</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Uploaded:</span>
                      <span className="value">{new Date(uploadedPDF.uploadedAt).toLocaleString()}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Cloudinary URL:</span>
                      <a 
                        href={uploadedPDF.cloudinaryUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="url-link"
                      >
                        View Original
                      </a>
                    </div>
                  </div>
                </div>
                
                <button 
                  className="new-upload-btn"
                  onClick={handleNewUpload}
                >
                  📤 Upload New PDF
                </button>
              </div>

              {/* PDF Viewer */}
              <div className="viewer-section">
                <PDFViewer 
                  pdfUrl={uploadedPDF.cloudinaryUrl}
                  filename={uploadedPDF.filename}
                  directUrl={uploadedPDF.cloudinaryUrl}
                  proxyUrl={uploadedPDF.proxyUrl}
                />
              </div>

              {/* AI Summary Panel */}
              <div className="summary-section">
                <SummaryPanel
                  pdfUrl={uploadedPDF.cloudinaryUrl}
                  filename={uploadedPDF.filename}
                  directUrl={uploadedPDF.cloudinaryUrl}
                  proxyUrl={uploadedPDF.proxyUrl}
                />
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="app-footer">
        <p>Built with React, Vite, and Cloudinary | Wiz-Scholar © 2025</p>
      </footer>
    </div>
  );
}

export default App;
