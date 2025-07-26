/**
 * Cloudinary PDF Processor - Frontend Utility
 * Handles PDF uploads to the backend which stores them on Cloudinary
 * and processes them with Gemini 2.5 Pro
 */

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : '/api'; // Uses Vite proxy in development

/**
 * Upload PDF to Cloudinary and get summary
 * @param {File} pdfFile - PDF file to upload
 * @param {string} summaryType - Type of summary (academic, brief, detailed, bullet_points)
 * @returns {Promise<Object>} Processing result with Cloudinary URL and summary
 */
export const uploadAndSummarizePDF = async (pdfFile, summaryType = 'academic') => {
  if (!pdfFile) {
    throw new Error('PDF file is required');
  }

  if (pdfFile.type !== 'application/pdf') {
    throw new Error('Only PDF files are supported');
  }

  if (pdfFile.size > 10 * 1024 * 1024) { // 10MB
    throw new Error('File size must be less than 10MB');
  }

  const formData = new FormData();
  formData.append('pdf', pdfFile);
  formData.append('summaryType', summaryType);

  try {
    const response = await fetch(`${API_BASE_URL}/upload-pdf`, {
      method: 'POST',
      body: formData
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || result.error || 'Upload failed');
    }

    if (!result.success) {
      throw new Error(result.message || 'Processing failed');
    }

    return {
      success: true,
      document: result.data.document,
      summary: result.data.summary,
      extractedText: result.data.extractedText
    };

  } catch (error) {
    console.error('❌ PDF upload error:', error);
    throw error;
  }
};

/**
 * Ask a question about an uploaded PDF document
 * @param {string} documentId - ID of the uploaded document
 * @param {string} question - Question to ask
 * @param {string} answerStyle - Style of answer (concise, detailed, explanatory)
 * @returns {Promise<Object>} Answer from Gemini 2.5 Pro
 */
export const askQuestionAboutPDF = async (documentId, question, answerStyle = 'concise') => {
  if (!documentId) {
    throw new Error('Document ID is required');
  }

  if (!question?.trim()) {
    throw new Error('Question is required');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/ask-question`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        documentId,
        question: question.trim(),
        answerStyle
      })
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || result.error || 'Question processing failed');
    }

    if (!result.success) {
      throw new Error(result.message || 'Failed to get answer');
    }

    return result.data;

  } catch (error) {
    console.error('❌ Question processing error:', error);
    throw error;
  }
};

/**
 * Ask a question with custom context (without document ID)
 * @param {string} context - Text context for the question
 * @param {string} question - Question to ask
 * @param {string} answerStyle - Style of answer (concise, detailed, explanatory)
 * @returns {Promise<Object>} Answer from Gemini 2.5 Pro
 */
export const askQuestionWithContext = async (context, question, answerStyle = 'concise') => {
  if (!context?.trim()) {
    throw new Error('Context is required');
  }

  if (!question?.trim()) {
    throw new Error('Question is required');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/ask-question`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        context: context.trim(),
        question: question.trim(),
        answerStyle
      })
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || result.error || 'Question processing failed');
    }

    if (!result.success) {
      throw new Error(result.message || 'Failed to get answer');
    }

    return result.data;

  } catch (error) {
    console.error('❌ Question processing error:', error);
    throw error;
  }
};

/**
 * Get list of uploaded documents
 * @returns {Promise<Array>} List of uploaded documents
 */
export const getUploadedDocuments = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/documents`);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || result.error || 'Failed to fetch documents');
    }

    if (!result.success) {
      throw new Error(result.message || 'Failed to get documents');
    }

    return result.data;

  } catch (error) {
    console.error('❌ Documents fetch error:', error);
    throw error;
  }
};

/**
 * Summarize text directly (without file upload)
 * @param {string} text - Text to summarize
 * @param {string} summaryType - Type of summary
 * @returns {Promise<Object>} Summary result
 */
export const summarizeText = async (text, summaryType = 'academic') => {
  if (!text?.trim()) {
    throw new Error('Text is required');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/summarize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: text.trim(),
        summary_type: summaryType
      })
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.detail || result.error || 'Summarization failed');
    }

    return result;

  } catch (error) {
    console.error('❌ Text summarization error:', error);
    throw error;
  }
};

// Export all functions as default object
export default {
  uploadAndSummarizePDF,
  askQuestionAboutPDF,
  askQuestionWithContext,
  getUploadedDocuments,
  summarizeText
};
