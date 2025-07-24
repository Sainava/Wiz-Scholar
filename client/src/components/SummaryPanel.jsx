import { useState } from 'react';
import './SummaryPanel.css';

const SummaryPanel = ({ pdfUrl, filename, directUrl, proxyUrl }) => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [summaryType, setSummaryType] = useState('academic');

  // Choose which URL to use for AI processing
  const getProcessingUrl = () => {
    // Prefer direct URL for AI processing to avoid additional proxy overhead
    return directUrl || pdfUrl || proxyUrl;
  };

  const summarizePDF = async () => {
    const processingUrl = getProcessingUrl();
    
    if (!processingUrl) {
      setError('No PDF URL available for summarization');
      return;
    }

    setLoading(true);
    setError(null);
    setSummary(null);

    try {
      console.log('🤖 Starting PDF summarization...', { url: processingUrl, type: summaryType });

      const formData = new FormData();
      formData.append('pdf_url', processingUrl);
      formData.append('summary_type', summaryType);
      formData.append('filename', filename || 'PDF Document');

      const response = await fetch('http://localhost:8001/api/summarize-pdf-url', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `Server error: ${response.status}`);
      }

      const summaryData = await response.json();
      console.log('✅ Summarization successful:', summaryData);
      
      setSummary(summaryData);
    } catch (err) {
      console.error('❌ Summarization failed:', err);
      setError(err.message || 'Failed to summarize PDF');
    } finally {
      setLoading(false);
    }
  };

  const formatCompressionRatio = (ratio) => {
    return `${(100 - ratio * 100).toFixed(1)}% reduction`;
  };

  const getSummaryTypeLabel = (type) => {
    const labels = {
      academic: '🎓 Academic',
      brief: '⚡ Brief',
      detailed: '📋 Detailed',
      bullet_points: '📝 Bullet Points'
    };
    return labels[type] || type;
  };

  return (
    <div className="summary-panel">
      <div className="summary-header">
        <h3>🤖 AI Summary</h3>
        {!summary && !loading && (
          <p className="summary-description">
            Generate an AI-powered summary of your PDF using advanced language models.
          </p>
        )}
      </div>

      {!summary && !loading && (
        <div className="summary-controls">
          <div className="summary-type-selector">
            <label htmlFor="summaryType">Summary Style:</label>
            <select 
              id="summaryType"
              value={summaryType} 
              onChange={(e) => setSummaryType(e.target.value)}
              className="summary-type-select"
            >
              <option value="academic">🎓 Academic - Formal and comprehensive</option>
              <option value="brief">⚡ Brief - Quick overview</option>
              <option value="detailed">📋 Detailed - In-depth analysis</option>
              <option value="bullet_points">📝 Bullet Points - Key highlights</option>
            </select>
          </div>
          
          <button 
            onClick={summarizePDF}
            className="summarize-btn"
            disabled={!getProcessingUrl()}
          >
            <span className="btn-icon">🚀</span>
            Generate Summary
          </button>
        </div>
      )}

      {loading && (
        <div className="summary-loading">
          <div className="ai-spinner">
            <div className="spinner-brain">🧠</div>
          </div>
          <p>AI is analyzing your PDF...</p>
          <div className="loading-steps">
            <div className="step active">📥 Downloading PDF</div>
            <div className="step active">📄 Extracting text</div>
            <div className="step active">🤖 Generating summary</div>
          </div>
        </div>
      )}

      {error && (
        <div className="summary-error">
          <div className="error-icon">⚠️</div>
          <div className="error-content">
            <h4>Summarization Failed</h4>
            <p>{error}</p>
            <button onClick={summarizePDF} className="retry-btn">
              🔄 Try Again
            </button>
          </div>
        </div>
      )}

      {summary && (
        <div className="summary-result">
          <div className="summary-meta">
            <div className="meta-item">
              <span className="meta-label">Type:</span>
              <span className="meta-value">{getSummaryTypeLabel(summary.summary_type)}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Compression:</span>
              <span className="meta-value">{formatCompressionRatio(summary.compression_ratio)}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Model:</span>
              <span className="meta-value">🧠 {summary.model_used}</span>
            </div>
          </div>

          <div className="summary-content">
            <h4>📋 Summary</h4>
            <div className="summary-text">
              {summary.summary}
            </div>
          </div>

          <div className="summary-stats">
            <div className="stat">
              <span className="stat-label">Original:</span>
              <span className="stat-value">{summary.original_length.toLocaleString()} chars</span>
            </div>
            <div className="stat">
              <span className="stat-label">Summary:</span>
              <span className="stat-value">{summary.summary_length.toLocaleString()} chars</span>
            </div>
          </div>

          <div className="summary-actions">
            <button 
              onClick={() => {
                setSummary(null);
                setError(null);
              }}
              className="new-summary-btn"
            >
              ✨ Generate New Summary
            </button>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(summary.summary);
              }}
              className="copy-btn"
            >
              📋 Copy Summary
            </button>
          </div>
        </div>
      )}

      {/* Debug Info */}
      <details className="summary-debug">
        <summary>🔧 Debug Information</summary>
        <div className="debug-info">
          <p><strong>Processing URL:</strong> <code>{getProcessingUrl()}</code></p>
          <p><strong>Summary Type:</strong> {summaryType}</p>
          <p><strong>Filename:</strong> {filename}</p>
          <p><strong>AI Server:</strong> http://localhost:8001</p>
        </div>
      </details>
    </div>
  );
};

export default SummaryPanel;
