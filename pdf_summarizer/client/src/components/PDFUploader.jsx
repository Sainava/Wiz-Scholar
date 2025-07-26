import { useState, useRef } from 'react';
import axios from 'axios';
import './PDFUploader.css';

const PDFUploader = ({ onUploadSuccess, onUploadError }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

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
      onUploadError?.('Please select a PDF file');
      return;
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      onUploadError?.('File size must be less than 10MB');
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('pdf', selectedFile);

      const response = await axios.post('/api/upload-pdf', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(progress);
        },
      });

      if (response.data.success) {
        onUploadSuccess?.(response.data.data);
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        onUploadError?.(response.data.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      onUploadError?.(
        error.response?.data?.message || 'Failed to upload PDF'
      );
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

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="pdf-uploader">
      <div className="upload-header">
        <h3>📄 Upload PDF Document</h3>
        <p>Drag and drop your PDF file or click to browse</p>
      </div>

      <div
        className={`upload-area ${isDragging ? 'dragging' : ''} ${
          selectedFile ? 'has-file' : ''
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !selectedFile && fileInputRef.current?.click()}
      >
        {!selectedFile ? (
          <div className="upload-prompt">
            <div className="upload-icon">📁</div>
            <p className="upload-text">
              {isDragging ? 'Drop your PDF here' : 'Click to upload or drag PDF here'}
            </p>
            <p className="upload-subtext">PDF files only, max 10MB</p>
          </div>
        ) : (
          <div className="file-preview">
            <div className="file-info">
              <div className="file-icon">📄</div>
              <div className="file-details">
                <p className="file-name">{selectedFile.name}</p>
                <p className="file-size">{formatFileSize(selectedFile.size)}</p>
              </div>
              <button
                type="button"
                className="remove-file-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFile();
                }}
                disabled={isUploading}
              >
                ✕
              </button>
            </div>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleFileInputChange}
          style={{ display: 'none' }}
          disabled={isUploading}
        />
      </div>

      {selectedFile && (
        <div className="upload-actions">
          <button
            type="button"
            className="upload-btn"
            onClick={handleUpload}
            disabled={isUploading}
          >
            {isUploading ? 'Uploading...' : 'Upload to Cloudinary'}
          </button>
        </div>
      )}

      {isUploading && (
        <div className="upload-progress">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="progress-text">{uploadProgress}% uploaded</p>
        </div>
      )}
    </div>
  );
};

export default PDFUploader;
