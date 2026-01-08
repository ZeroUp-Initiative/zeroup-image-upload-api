require("dotenv").config();
const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const stream = require("stream");

const app = express();
const port = process.env.PORT || 3000;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer (Memory Storage)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Serve static files from 'public' directory
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Upload Endpoint
app.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No image file provided" });
  }

  const uploadStream = cloudinary.uploader.upload_stream(
    { folder: "zeroup_uploads" }, // Optional: organize in a folder
    (error, result) => {
      if (error) {
        console.error("Cloudinary Upload Error:", error);
        return res
          .status(500)
          .json({ error: "Upload failed", details: error.message });
      }
      res.status(200).json({
        message: "Image uploaded successfully",
        url: result.secure_url,
        public_id: result.public_id,
      });
    }
  );

  // Pipe the buffer to the upload stream
  const bufferStream = new stream.PassThrough();
  bufferStream.end(req.file.buffer);
  bufferStream.pipe(uploadStream);
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
