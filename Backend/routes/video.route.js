import express from "express";
const router = express.Router();
import multer from "multer";

import { spawn } from "child_process";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const resolutions = [
  { label: "144p", height: 144 },
  { label: "360p", height: 360 },
  { label: "480p", height: 480 },
  { label: "720p", height: 720 },
  { label: "1080p", height: 1080 },
];

const upload = multer({ storage });

router.post("/upload", upload.single("video"), (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json({ error: "No video uploaded" });

  const inputPath = file.path;
  const fileName = path.parse(file.originalname).name;

  resolutions.forEach(({ label, height }) => {
    const outputPath = `output/${fileName}_${label}.mp4`;

    const ffmpeg = spawn("ffmpeg", [
      "-i",
      inputPath,
      "-vf",
      `scale=-2:${height}`,
      "-c:a",
      "copy",
      outputPath,
    ]);

    ffmpeg.stderr.on("data", (data) => {
      console.error(`[${label}] stderr: ${data}`);
    });

    ffmpeg.on("close", (code) => {
      console.log(`[${label}] Conversion done. Exit code: ${code}`);
    });
  });

  res.json({ message: "Upload successful. Processing started." });
});

export default router;
