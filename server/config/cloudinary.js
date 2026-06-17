// server/config/cloudinary.js
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'djzarpmvq',
  api_key: '846924871865992',
  api_secret: 'h7JRclYu3oRdltOe94HFVGgwkYs'
});

module.exports = cloudinary;