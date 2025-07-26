import { useState, useEffect } from 'react';
import './PDFViewer.css';

const PDFViewer = ({ pdfUrl, filename, directUrl, proxyUrl }) => {
  const [viewMode, setViewMode] = useState('pdfjs');
  const [urlMode, setUrlMode] = useState('proxy'); // 'proxy' or 'direct'
  const [pdfData, setPdfData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Choose which URL to use based on mode
  const getProxyUrl = (proxyPath) => {
    if (proxyPath && !proxyPath.startsWith('http')) {
      return `http://localhost:5001${proxyPath}`;
    }
    return proxyPath;
  };
  
  const currentUrl = urlMode === 'proxy' && proxyUrl ? getProxyUrl(proxyUrl) : (directUrl || pdfUrl);

  // Debug: Log the PDF URL being used
  console.log('🔍 PDFViewer received URLs:', { 
    pdfUrl, 
    directUrl, 
    proxyUrl, 
    fullProxyUrl: proxyUrl ? getProxyUrl(proxyUrl) : null,
    currentUrl,
    urlMode 
  });

  // Try to fetch PDF as blob for better compatibility
  useEffect(() => {
    if (currentUrl && viewMode === 'blob') {
      setLoading(true);
      console.log('🔄 Fetching PDF as blob:', currentUrl);
      fetch(currentUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/pdf,*/*',
        },
      })
        .then(response => {
          console.log('✅ Blob fetch response:', response.status, response.headers.get('content-type'));
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
          return response.blob();
        })
        .then(blob => {
          console.log('✅ PDF blob created:', blob.size, 'bytes, type:', blob.type);
          const url = URL.createObjectURL(blob);
          setPdfData(url);
          setLoading(false);
        })
        .catch(error => {
          console.error('❌ Failed to load PDF as blob:', error);
          setLoading(false);
        });
    }
  }, [currentUrl, viewMode]);

  if (!currentUrl && !pdfUrl) {
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
          {/* URL Mode Selector */}
          {proxyUrl && (
            <div className="url-mode-selector">
              <button 
                onClick={() => setUrlMode('proxy')} 
                className={`url-btn ${urlMode === 'proxy' ? 'active' : ''}`}
              >
                🔀 Proxy URL
              </button>
              <button 
                onClick={() => setUrlMode('direct')} 
                className={`url-btn ${urlMode === 'direct' ? 'active' : ''}`}
              >
                🔗 Direct URL
              </button>
            </div>
          )}
          
          <a
            href={currentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="control-btn"
          >
            🔗 Open in New Tab
          </a>
          <a
            href={currentUrl}
            download={filename}
            className="control-btn"
          >
            📥 Download
          </a>
        </div>
      </div>

      <div className="pdf-viewer-content">
        {/* Viewer Mode Selector */}
        <div className="viewer-mode-selector">
          <button 
            onClick={() => setViewMode('pdfjs')} 
            className={viewMode === 'pdfjs' ? 'active' : ''}
          >
            🔧 PDF.js Viewer
          </button>
          <button 
            onClick={() => setViewMode('blob')} 
            className={viewMode === 'blob' ? 'active' : ''}
          >
            💾 Blob Viewer
          </button>
        </div>

        {/* PDF Display Area */}
        <div className="pdf-display-area">
          {loading && (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading PDF...</p>
            </div>
          )}

          {viewMode === 'pdfjs' && !loading && (
            <div className="pdf-iframe-container">
              {/* Use PDF.js with our proxy URL for better CORS handling */}
              <iframe
                src={`https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(
                  urlMode === 'proxy' && proxyUrl ? getProxyUrl(proxyUrl) : currentUrl
                )}`}
                width="100%"
                height="700px"
                style={{ border: 'none' }}
                title="PDF Viewer"
                onError={(e) => {
                  console.error('PDF.js viewer failed to load:', e);
                }}
              />
              <div style={{ fontSize: '0.85rem', color: 'hsl(220 15% 65%)', marginTop: '12px', padding: '0.75rem', background: 'hsl(235 25% 10%)', borderRadius: '0.5rem', border: '1px solid hsl(235 25% 20%)' }}>
                ✨ <strong style={{ color: 'hsl(45 100% 85%)' }}>Magical Tip:</strong> PDF.js works best with the proxy URL. Switch to "Proxy URL" mode if you experience viewing issues.
              </div>
            </div>
          )}

          {viewMode === 'blob' && !loading && pdfData && (
            <div className="pdf-object-container">
              <object
                data={pdfData}
                type="application/pdf"
                width="100%"
                height="700px"
              >
                <p>Your browser doesn't support PDF viewing. 
                  <a href={currentUrl} target="_blank" rel="noopener noreferrer">
                    Click here to download the PDF.
                  </a>
                </p>
              </object>
            </div>
          )}
        </div>

        {/* Debug Information */}
        <details className="debug-section">
          <summary>🔧 Debug Information</summary>
          <div className="debug-info">
            <p><strong>Current URL:</strong> <code>{currentUrl}</code></p>
            <p><strong>URL Mode:</strong> {urlMode}</p>
            <p><strong>Viewer Mode:</strong> {viewMode}</p>
            <p><strong>Filename:</strong> {filename}</p>
            {proxyUrl && <p><strong>Proxy URL:</strong> <code>{proxyUrl}</code></p>}
            {directUrl && <p><strong>Direct URL:</strong> <code>{directUrl}</code></p>}
            
            <div className="debug-actions">
              <button 
                onClick={() => {
                  console.log('🧪 Testing PDF URL accessibility...');
                  fetch(currentUrl, { method: 'HEAD' })
                    .then(response => {
                      console.log('✅ HEAD request successful:', response.status);
                      console.log('Content-Type:', response.headers.get('content-type'));
                      console.log('Content-Length:', response.headers.get('content-length'));
                    })
                    .catch(error => {
                      console.error('❌ HEAD request failed:', error);
                    });
                }}
                className="debug-btn"
              >
                Test URL Access
              </button>
              
              <button 
                onClick={() => {
                  window.open(currentUrl, '_blank');
                }}
                className="debug-btn"
              >
                Open Direct URL
              </button>

              {proxyUrl && directUrl && (
                <button 
                  onClick={() => {
                    console.log('🔄 Testing both URLs...');
                    [proxyUrl, directUrl].forEach((url, index) => {
                      fetch(url, { method: 'HEAD' })
                        .then(response => {
                          console.log(`✅ URL ${index + 1} (${url.includes('proxy') ? 'proxy' : 'direct'}) - Status:`, response.status);
                        })
                        .catch(error => {
                          console.error(`❌ URL ${index + 1} failed:`, error);
                        });
                    });
                  }}
                  className="debug-btn"
                >
                  Compare URLs
                </button>
              )}
            </div>
          </div>
        </details>
      </div>
    </div>
  );
};

export default PDFViewer;
