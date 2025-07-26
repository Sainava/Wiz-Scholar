import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, FileText, Bot, X, Download, Eye, Loader2 } from "lucide-react";
import axios from 'axios';

const PDFSummarizerPanel = () => {
  const [uploadedPDF, setUploadedPDF] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [summary, setSummary] = useState(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [summaryType, setSummaryType] = useState('academic');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef(null);

  // PDF Upload Handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files.length > 0) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleFileSelect = (file) => {
    // Validate file type
    if (file.type !== 'application/pdf') {
      setError('Please select a PDF file');
      return;
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setError('File size must be less than 10MB');
      return;
    }

    setSelectedFile(file);
    setError('');
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(0);
    setError(''); // Clear any previous errors

    try {
      console.log('🚀 Starting upload for file:', selectedFile.name);
      console.log('📁 File size:', (selectedFile.size / 1024 / 1024).toFixed(2), 'MB');
      console.log('📄 File type:', selectedFile.type);

      const formData = new FormData();
      formData.append('pdf', selectedFile);

      console.log('📤 Sending request to: http://localhost:5001/api/pdf/upload');

      const response = await axios.post('http://localhost:5001/api/pdf/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(progress);
          console.log('📊 Upload progress:', progress + '%');
        },
      });

      console.log('✅ Upload response:', response.data);

      if (response.data.success) {
        setUploadedPDF(response.data.data);
        setSuccess(`✅ ${response.data.data.filename} uploaded successfully!`);
        setSelectedFile(null);
        setError('');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        console.error('❌ Upload failed (success=false):', response.data);
        setError(response.data.message || 'Upload failed');
      }
    } catch (error) {
      console.error('❌ Upload error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText
      });
      
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.response?.status) {
        setError(`Upload failed (${error.response.status}): ${error.response.statusText || 'Unknown error'}`);
      } else {
        setError('Failed to upload PDF. Please check your connection and try again.');
      }
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleNewUpload = () => {
    setUploadedPDF(null);
    setSelectedFile(null);
    setSummary(null);
    setError('');
    setSuccess('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // PDF Summarization
  const handleSummarize = async () => {
    if (!uploadedPDF?.cloudinaryUrl) {
      setError('No PDF available for summarization');
      return;
    }

    setIsLoadingSummary(true);
    setError('');
    setSummary(null);

    try {
      console.log('🤖 Starting summarization...');
      console.log('🔗 PDF URL:', uploadedPDF.cloudinaryUrl);
      console.log('📊 Summary type:', summaryType);

      const requestData = {
        pdf_url: uploadedPDF.cloudinaryUrl,
        summary_type: summaryType,
        filename: uploadedPDF.filename
      };

      console.log('📤 Sending summarization request:', requestData);

      const response = await axios.post('http://localhost:5001/api/pdf/summarize-pdf-url', requestData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('✅ Summarization response:', response.data);

      if (response.data.success) {
        setSummary(response.data.data);
        setError(''); // Clear any errors on success
      } else {
        console.error('❌ Summarization failed (success=false):', response.data);
        setError(response.data.message || 'Summarization failed');
      }
    } catch (error) {
      console.error('❌ Summarization error:', error);
      console.error('❌ Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      // More specific error handling
      if (error.response?.status === 422) {
        setError('Invalid request format. Please try uploading the PDF again.');
      } else if (error.response?.status === 500) {
        setError('Server error during summarization. Please try again.');
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.message?.includes('Network Error')) {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError('Failed to summarize PDF. Please try again.');
      }
    } finally {
      setIsLoadingSummary(false);
    }
  };

  // Function to intelligently parse and format text to proper markdown
  const parseMarkdownText = (text) => {
    if (!text) return [];
    
    // Split text into lines for processing
    const lines = text.split('\n');
    const elements = [];
    
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i].trim();
      
      // Skip empty lines but preserve spacing
      if (line === '') {
        elements.push({ type: 'space' });
        continue;
      }
      
      // Handle headers with **text:** or **text** format (more comprehensive)
      const headerMatch = line.match(/^\*\*([^*]+)\*\*:?\s*$/) || 
                         line.match(/^\*\*([^*]+?):\*\*\s*$/) ||
                         line.match(/^\*\*([^*]+?)\s*:\*\*\s*$/);
      if (headerMatch) {
        elements.push({
          type: 'header',
          text: headerMatch[1].trim(),
          level: 'h3'
        });
        continue;
      }
      
      // Handle bullet points that start with asterisks (preserve these)
      const bulletMatch = line.match(/^\*+\s*(.+)$/);
      if (bulletMatch && !line.includes('**')) {
        elements.push({
          type: 'bullet',
          text: bulletMatch[1].trim(),
          numbered: false
        });
        continue;
      }
      
      // Handle numbered lists
      const numberedMatch = line.match(/^\s*(\d+)\.\s*(.+)$/);
      if (numberedMatch) {
        elements.push({
          type: 'bullet',
          text: numberedMatch[2].trim(),
          numbered: true,
          number: numberedMatch[1]
        });
        continue;
      }
      
      // Handle lines that end with colon (likely headers) - clean asterisks
      if (line.endsWith(':') && line.length < 80 && !line.includes('.')) {
        const cleanedHeader = line.replace(/\*\*/g, '').replace(/:$/, '').trim();
        elements.push({
          type: 'header',
          text: cleanedHeader,
          level: line.length < 40 ? 'h3' : 'h4'
        });
        continue;
      }
      
      // Handle lines that look like section headers (all caps or title case) - clean asterisks
      const cleanLineForCheck = line.replace(/\*\*/g, '');
      if ((cleanLineForCheck === cleanLineForCheck.toUpperCase() && cleanLineForCheck.length > 3 && cleanLineForCheck.length < 60) || 
          (cleanLineForCheck.match(/^[A-Z][a-z]+(\s[A-Z][a-z]+)*:?$/) && cleanLineForCheck.length < 50)) {
        elements.push({
          type: 'header',
          text: cleanLineForCheck.replace(/:$/, '').trim(),
          level: 'h4'
        });
        continue;
      }
      
      // Handle lines with **text** in the middle (mixed content) - preserve bold formatting
      if (line.includes('**') && !line.match(/^\*\*([^*]+)\*\*:?\s*$/)) {
        // Split by **text** patterns and preserve them
        const parts = line.split(/(\*\*[^*]+\*\*)/g);
        elements.push({
          type: 'mixed',
          parts: parts.map(part => ({
            text: part.replace(/^\*\*|\*\*$/g, ''),
            bold: part.startsWith('**') && part.endsWith('**')
          }))
        });
        continue;
      }
      
      // Remove standalone asterisks and clean the line for regular paragraphs
      const cleanLine = line.replace(/^\*+\s*/, '').replace(/\*\*/g, '').trim();
      
      // Regular paragraph
      if (cleanLine.length > 0) {
        elements.push({
          type: 'paragraph',
          text: cleanLine
        });
      }
    }
    
    return elements;
  };

  // Function to render parsed markdown elements
  const renderMarkdownContent = (content) => {
    if (!content) return null;
    
    const elements = parseMarkdownText(content);
    
    return elements.map((element, index) => {
      switch (element.type) {
        case 'header':
          if (element.level === 'h3') {
            return (
              <h3 key={index} className="font-bold text-xl mt-6 mb-4 text-foreground border-b-2 border-primary/20 pb-2">
                {element.text}
              </h3>
            );
          } else {
            return (
              <h4 key={index} className="font-semibold text-lg mt-5 mb-3 text-foreground">
                {element.text}
              </h4>
            );
          }
          
        case 'bullet':
          return (
            <div key={index} className="flex items-start mb-3 ml-4">
              {element.numbered ? (
                <span className="text-primary font-semibold mr-3 mt-0.5 min-w-[24px]">
                  {element.number}.
                </span>
              ) : (
                <span className="text-primary font-bold mr-3 mt-1.5 text-lg leading-none">
                  •
                </span>
              )}
              <span className="text-foreground leading-relaxed flex-1">
                {element.text}
              </span>
            </div>
          );
          
        case 'mixed':
          return (
            <p key={index} className="mb-4 text-foreground leading-relaxed">
              {element.parts.map((part, partIndex) => 
                part.bold ? (
                  <strong key={partIndex} className="font-semibold">
                    {part.text}
                  </strong>
                ) : (
                  <span key={partIndex}>{part.text}</span>
                )
              )}
            </p>
          );
          
        case 'paragraph':
          return (
            <p key={index} className="mb-4 text-foreground leading-relaxed">
              {element.text}
            </p>
          );
          
        case 'space':
          return <div key={index} className="h-2" />;
          
        default:
          return null;
      }
    }).filter(Boolean);
  };

  // Error boundary wrapper to prevent black screen
  const handleComponentError = (error) => {
    console.error('React component error:', error);
    setError('An unexpected error occurred. Please refresh the page and try again.');
    setIsLoadingSummary(false);
    setIsUploading(false);
  };

  // Add error boundary effect
  React.useEffect(() => {
    const handleError = (event) => {
      handleComponentError(event.error);
    };
    
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-4">
          📄 Document Summarizer
        </h2>
        <p className="text-lg text-muted-foreground">
          Transform lengthy documents into concise, magical summaries with AI-powered intelligence
        </p>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <Card className="p-4 border-red-200 bg-red-50">
          <div className="flex items-center space-x-2 text-red-600">
            <X className="w-5 h-5" />
            <span>{error}</span>
          </div>
        </Card>
      )}

      {success && (
        <Card className="p-4 border-green-200 bg-green-50">
          <div className="flex items-center space-x-2 text-green-600">
            <FileText className="w-5 h-5" />
            <span>{success}</span>
          </div>
        </Card>
      )}

      {/* Upload Section */}
      {!uploadedPDF && (
        <Card className="p-8">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
              isDragging
                ? 'border-primary bg-primary/10'
                : 'border-muted-foreground/30 hover:border-primary/50'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">Upload PDF Document</h3>
            <p className="text-muted-foreground mb-4">
              Drag and drop your PDF file here, or click to browse
            </p>
            
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileInputChange}
              className="hidden"
            />
            
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              className="mb-4"
            >
              <Upload className="w-4 h-4 mr-2" />
              Choose PDF File
            </Button>

            {selectedFile && (
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-primary" />
                    <span className="font-medium">{selectedFile.name}</span>
                    <span className="text-sm text-muted-foreground">
                      ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  </div>
                  <Button
                    onClick={handleRemoveFile}
                    variant="ghost"
                    size="sm"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="mt-4 flex space-x-2">
                  <Button
                    onClick={handleUpload}
                    disabled={isUploading}
                    className="flex-1"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Uploading... {uploadProgress}%
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload PDF
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* PDF Viewer and Summarizer */}
      {uploadedPDF && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* PDF Viewer */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Document Viewer</h3>
              <Button
                onClick={handleNewUpload}
                variant="outline"
                size="sm"
              >
                <Upload className="w-4 h-4 mr-2" />
                New Upload
              </Button>
            </div>
            
            <div className="bg-muted rounded-lg p-4 mb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center space-x-2 min-w-0 flex-1">
                  <FileText className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="font-medium truncate">{uploadedPDF.filename}</span>
                </div>
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <Button
                    onClick={() => {
                      // Use Google Docs viewer to force PDF viewing instead of download
                      const viewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(uploadedPDF.cloudinaryUrl)}&embedded=false`;
                      window.open(viewerUrl, '_blank');
                    }}
                    variant="outline"
                    size="sm"
                    className="flex items-center"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View PDF
                  </Button>
                  <Button
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = uploadedPDF.cloudinaryUrl;
                      link.download = uploadedPDF.filename;
                      link.click();
                    }}
                    variant="outline"
                    size="sm"
                    className="flex items-center"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </div>

            <div className="border rounded-lg overflow-hidden bg-muted/30" style={{ height: '500px' }}>
              <div className="w-full h-full flex flex-col">
                {/* Try multiple PDF viewing methods */}
                <iframe
                  src={`https://docs.google.com/gview?url=${encodeURIComponent(uploadedPDF.cloudinaryUrl)}&embedded=true`}
                  className="w-full flex-1 border-0"
                  title="PDF Viewer"
                  onError={(e) => {
                    console.log('Google Docs viewer failed, trying direct PDF');
                    e.target.src = `${uploadedPDF.cloudinaryUrl}#toolbar=1&navpanes=1&scrollbar=1&view=FitH`;
                  }}
                  onLoad={(e) => {
                    console.log('PDF viewer loaded successfully');
                  }}
                />
                <div className="hidden w-full h-full flex-col items-center justify-center p-8 text-center bg-muted/50" id="pdf-fallback">
                  <FileText className="w-16 h-16 text-muted-foreground mb-4" />
                  <h4 className="text-lg font-semibold mb-2">PDF Preview Not Available</h4>
                  <p className="text-muted-foreground mb-4">
                    This PDF cannot be displayed inline. Use the buttons above to view or download it.
                  </p>
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => {
                        const viewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(uploadedPDF.cloudinaryUrl)}&embedded=false`;
                        window.open(viewerUrl, '_blank');
                      }}
                      variant="default"
                      size="sm"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Open in New Tab
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Summarizer Panel */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">AI Summarization</h3>
            
            {/* Summary Type Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-foreground">Summary Type</label>
              <select
                value={summaryType}
                onChange={(e) => setSummaryType(e.target.value)}
                className="w-full p-2 border rounded-md bg-background text-foreground border-input focus:border-primary focus:ring-1 focus:ring-primary"
              >
                <option value="academic">Academic Summary</option>
                <option value="brief">Brief Overview</option>
                <option value="detailed">Detailed Analysis</option>
                <option value="bullet_points">Bullet Points</option>
              </select>
            </div>

            <Button
              onClick={handleSummarize}
              disabled={isLoadingSummary}
              className="w-full mb-4"
            >
              {isLoadingSummary ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing Document...
                </>
              ) : (
                <>
                  <Bot className="w-4 h-4 mr-2" />
                  Generate Summary
                </>
              )}
            </Button>

            {/* Summary Display */}
            {summary && (
              <div className="space-y-4">
                <div className="border rounded-lg p-6 bg-muted/50">
                  <h4 className="font-semibold mb-4 text-lg">📋 {summary.type} Summary</h4>
                  <div className="prose prose-sm max-w-none">
                    <div className="space-y-2">
                      {renderMarkdownContent(summary.content)}
                    </div>
                  </div>
                </div>

                {summary.keyPoints && summary.keyPoints.length > 0 && (
                  <div className="border rounded-lg p-6 bg-muted/50">
                    <h4 className="font-semibold mb-4 text-lg">🔑 Key Points</h4>
                    <div className="space-y-2">
                      {summary.keyPoints.map((point, index) => (
                        <div key={index} className="flex items-start">
                          <span className="text-primary mr-2 mt-1">•</span>
                          <span className="text-foreground text-sm leading-relaxed">{point}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="text-xs text-muted-foreground p-3 bg-muted/30 rounded-lg border">
                  ✨ Summary generated with AI • {summary.wordCount} words • {summary.timestamp}
                </div>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
};

export default PDFSummarizerPanel;
