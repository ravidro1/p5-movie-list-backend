// Require the cloudinary library
const cloudinary = require("cloudinary").v2;

// Return "https" URLs by setting secure: true
cloudinary.config({
  secure: true,
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadImage = async (imageBase64, movie_id) => {
  try {
    const res = await cloudinary.uploader.upload(imageBase64, {
      unique_filename: true,
      //   filename_override: name,
      public_id: movie_id,
    });
    return res.url;
  } catch (error) {
    console.log(error);
    return error;
  }
};

const deleteImage = async (movie_id) => {
  try {
    const res = await cloudinary.uploader.destroy(movie_id);
    return res;
  } catch (error) {
    console.log(error);
    return error;
  }
};

module.exports = { uploadImage, deleteImage };
