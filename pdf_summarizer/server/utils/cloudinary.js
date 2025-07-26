const cloudinary = require('cloudinary').v2;

// Function to initialize Cloudinary with environment variables
const initializeCloudinary = () => {
  // Debug: Log environment variables
  console.log('🔧 Cloudinary Config Debug:');
  console.log('CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME);
  console.log('CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY ? '✅ Set' : '❌ Missing');
  console.log('CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? '✅ Set' : '❌ Missing');

  // Configure Cloudinary
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
  
  console.log('✅ Cloudinary initialized successfully');
};

module.exports = { cloudinary, initializeCloudinary };
