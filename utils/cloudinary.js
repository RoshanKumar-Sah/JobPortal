const cloudinary = require('cloudinary').v2;

// cloudinary.config({ 
//     cloud_name: 'ddj9jdvx8', 
//     api_key: '826519739974783', 
//     api_secret: 'x1mtkdf201Pz-Z8S2MVLhsNFu0U'
//     // secure: true
//   });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
  // secure: true
});


module.exports = cloudinary