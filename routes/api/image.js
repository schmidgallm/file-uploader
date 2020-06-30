// Dependencies
require('dotenv').config();
const router = require('express').Router();
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// config cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// init multer storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

// init multer upload function taking in storage engin config as param
const upload = multer({ storage });

// @route    POST api/v1/auth/images/upload
// @desc     UPLOAD images
// @access   Private
router.post('/upload', upload.array('productImages', 20), async (req, res) => {
  try {
    // store path to uploads folder in variable to use later
    const directory = path.join(__dirname, '../../uploads/');

    // read uploads directory and upload each image to cloudinary
    // once done remove from directory
    fs.readdir(directory, (err, files) => {
      if (err) {
        return res.status(400).json({ msg: 'No files found to upload' });
      }
      files.forEach(async file => {
        //  ignore .gitkeep file
        if (file.split('.')[1] === 'gitkeep') {
          return;
        }

        // post to cloudinary
        await cloudinary.uploader.upload(directory + file, {
          folder: 'uploads',
          public_id: file.split('.')[0],
          unique_filename: false
        });

        // remove files from temp uploads folder
        fs.unlink(directory + file, error => {
          if (error) {
            return res.status(400).json({ msg: 'Files could not be removed' });
          }
        });
      });
    });

    // return response once all done
    return res
      .status(200)
      .json({ msg: 'Product and Image saved successfully' });
  } catch (err) {
    return res.status(500).send('Server Error');
  }
});

module.exports = router;
