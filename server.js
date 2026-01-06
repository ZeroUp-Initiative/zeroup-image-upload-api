// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import fs from "fs";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


const upload = multer({ dest: "/tmp" });


const uploadImage = async (file) => {
  if (!file) return null;
  const result = await cloudinary.uploader.upload(file.path, {
    folder: "ZEROUP-PARTNERS-APP",
  });
  fs.unlinkSync(file.path); 
  return result.secure_url;
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
