const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "cookify",
    allowedFormats: ["jpeg", "png", "jpg"],
    transformation: {
      aspect_ratio: "4:3",
      //height: 700,
      //width: 800,
      gravity: "auto",
      crop: "fill",
    },
  },
});

module.exports = {
  cloudinary,
  storage,
};
