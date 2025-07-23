const { cloudinary } = require('../utils/cloudinary');
const pdfParse = require('pdf-parse');

/**
 * Upload PDF to Cloudinary
 * @param {Buffer} fileBuffer - PDF file buffer
 * @param {string} fileName - Original file name
 * @returns {Promise<Object>} Cloudinary upload result
 */
const uploadPDFToCloudinary = async (fileBuffer, fileName) => {
  try {
    console.log('📤 Starting Cloudinary upload...');
    console.log('🔧 Cloudinary config check:', {
      cloud_name: cloudinary.config().cloud_name,
      api_key: cloudinary.config().api_key ? '✅ Set' : '❌ Missing'
    });
    
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'raw', // Use 'raw' for PDF files
          folder: 'wiz-scholar/pdfs',
          public_id: `pdf_${Date.now()}_${fileName.replace(/\.[^/.]+$/, "")}`,
          use_filename: true,
          unique_filename: false
        },
        (error, result) => {
          if (error) {
            console.error('❌ Cloudinary upload error:', error);
            reject(error);
          } else {
            console.log('✅ Cloudinary upload success:', result.secure_url);
            resolve(result);
          }
        }
      ).end(fileBuffer);
    });
  } catch (error) {
    console.error('❌ Upload function error:', error);
    throw new Error(`Cloudinary upload failed: ${error.message}`);
  }
};

/**
 * Extract text from PDF buffer
 * @param {Buffer} fileBuffer - PDF file buffer
 * @returns {Promise<string>} Extracted text
 */
const extractTextFromPDF = async (fileBuffer) => {
  try {
    const data = await pdfParse(fileBuffer);
    return data.text;
  } catch (error) {
    throw new Error(`PDF text extraction failed: ${error.message}`);
  }
};

/**
 * Send text to Gemini API for summarization
 * @param {string} text - Text to summarize
 * @param {string} summaryType - Type of summary (academic, brief, detailed, bullet_points)
 * @returns {Promise<Object>} Summary response
 */
const summarizeWithGemini = async (text, summaryType = 'academic') => {
  try {
    const response = await fetch(`${process.env.AI_SERVER_URL}/api/summarize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: text,
        summary_type: summaryType
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Summarization failed');
    }

    return await response.json();
  } catch (error) {
    throw new Error(`Gemini API call failed: ${error.message}`);
  }
};

/**
 * Ask question based on PDF content using Gemini
 * @param {string} context - PDF text content
 * @param {string} question - Question to ask
 * @param {string} answerStyle - Style of answer (concise, detailed, explanatory)
 * @returns {Promise<Object>} Answer response
 */
const askQuestionFromPDF = async (context, question, answerStyle = 'concise') => {
  try {
    const response = await fetch(`${process.env.AI_SERVER_URL}/api/question-answer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        context: context,
        question: question,
        answer_style: answerStyle
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Question answering failed');
    }

    return await response.json();
  } catch (error) {
    throw new Error(`Gemini Q&A call failed: ${error.message}`);
  }
};

module.exports = {
  uploadPDFToCloudinary,
  extractTextFromPDF,
  summarizeWithGemini,
  askQuestionFromPDF
};
