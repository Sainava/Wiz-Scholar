const fs = require('fs');
const FormData = require('form-data');
const axios = require('axios');
const path = require('path');

async function testPDFUpload() {
  try {
    console.log('🧪 Testing PDF upload endpoint...');
    
    // Create a simple test PDF buffer (this is just for testing)
    const testPDFContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj
2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj
3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
>>
endobj
xref
0 4
0000000000 65535 f 
0000000010 00000 n 
0000000079 00000 n 
0000000173 00000 n 
trailer
<<
/Size 4
/Root 1 0 R
>>
startxref
301
%%EOF`;

    const testFile = Buffer.from(testPDFContent);
    
    // Create form data
    const formData = new FormData();
    formData.append('pdf', testFile, {
      filename: 'test.pdf',
      contentType: 'application/pdf'
    });

    console.log('📤 Sending test upload request...');
    
    const response = await axios.post('http://localhost:5001/api/pdf/upload', formData, {
      headers: {
        ...formData.getHeaders()
      }
    });

    console.log('✅ Upload successful!');
    console.log('📋 Response:', JSON.stringify(response.data, null, 2));

  } catch (error) {
    console.error('❌ Upload test failed:');
    console.error('Message:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Status Text:', error.response.statusText);
      console.error('Response Data:', error.response.data);
    }
  }
}

// Test health endpoint first
async function testHealth() {
  try {
    console.log('🔍 Testing health endpoint...');
    const response = await axios.get('http://localhost:5001/api/pdf/health');
    console.log('✅ Health check passed:', response.data);
    return true;
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
    return false;
  }
}

async function runTests() {
  const healthOk = await testHealth();
  if (healthOk) {
    await testPDFUpload();
  }
}

runTests();
