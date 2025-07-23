import React, { useState } from 'react';
import './PDFViewer.css';

const PDFViewer = ({ pdfUrl, filename }) => {
  const [viewMode, setViewMode] = useState('embed');

  console.log('🔍 PDFViewer received URL:', pdfUrl);

  if (!pdfUrl) {
    return (
      <div className="pdf-viewer">
        <div className="empty-state">
          <div className="empty-icon">📄</div>
          <h3>No PDF Selected</h3>
          <p>Upload a PDF file to view it here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pdf-viewer">
      <div className="pdf-viewer-header">
        <div className="pdf-info">
          <h3>📄 {filename || 'PDF Document'}</h3>
        </div>
        
        <div className="pdf-controls">
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="control-btn"
          >
            🔗 Open in New Tab
          </a>
          <a
            href={pdfUrl}
            download={filename}
            className="control-btn"
          >
            📥 Download
          </a>
        </div>
      </div>

      <div className="pdf-viewer-content">
        <div className="viewer-mode-selector">
          <button 
            onClick={() => setViewMode('embed')} 
            className={viewMode === 'embed' ? 'active' : ''}
          >
            📄 Direct Embed
          </button>
          <button 
            onClick={() => setViewMode('pdfjs')} 
            className={viewMode === 'pdfjs' ? 'active' : ''}
          >
            🔧 PDF.js Viewer
          </button>
        </div>

        <div className="pdf-display-area">
          {viewMode === 'embed' && (
            <div className="pdf-embed-container">
              <embed
                src={pdfUrl}
                type="application/pdf"
                width="100%"
                height="700px"
                style={{ border: 'none' }}
              />
            </div>
          )}

          {viewMode === 'pdfjs' && (
            <div className="pdf-iframe-container">
              <iframe
                src={`https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(pdfUrl)}`}
                width="100%"
                height="700px"
                style={{ border: 'none' }}
                title="PDF Viewer"
              />
            </div>
          )}
        </div>

        <details className="debug-section">
          <summary>🔧 Debug Information</summary>
          <div className="debug-info">
            <p><strong>PDF URL:</strong> <code>{pdfUrl}</code></p>
            <p><strong>Viewer Mode:</strong> {viewMode}</p>
            <p><strong>Filename:</strong> {filename}</p>
            
            <button 
              onClick={() => {
                console.log('🧪 Testing PDF URL accessibility...');
                fetch(pdfUrl, { method: 'HEAD' })
                  .then(response => {
                    console.log('✅ HEAD request successful:', response.status);
                    console.log('Content-Type:', response.headers.get('content-type'));
                  })
                  .catch(error => {
                    console.error('❌ HEAD request failed:', error);
                  });
              }}
              className="debug-btn"
            >
              Test URL Access
            </button>
          </div>
        </details>
      </div>
    </div>
  );
};

export default PDFViewer;
