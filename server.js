import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Use memory storage for serverless compatibility (Vercel)
const storage = multer.memoryStorage();
const upload = multer({ storage });

const uploadImage = async (file) => {
  if (!file) return null;
  
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "ZEROUP-PARTNERS-APP",
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result.secure_url);
        }
      }
    );
    uploadStream.end(file.buffer);
  });
};

app.get("/", (req, res) => {
  res.send("ZEROUP PARTNERS APP API is running");
});

app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const imageUrl = await uploadImage(req.file);
    res.json({ message: "Image uploaded successfully", url: imageUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Image upload failed",
      details: error.message,
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
