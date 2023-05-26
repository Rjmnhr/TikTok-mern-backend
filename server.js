import express from "express";
import mongoose from "mongoose";
import Cors from "cors";
import Videos from "./model/db-model.js";
import Content from "./model/video-model.js";

import multer from "multer";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: "dsw1ubwyh",
  api_key: "828222755219982",
  api_secret: "MolGuQIrdoVwSH6cTgQdmPt0bak",
});

const upload = multer({ dest: "uploads/" });

const app = express();

const Connect_URL =
  "mongodb+srv://rj_mnhr:renjith@cluster0.pwnbzgn.mongodb.net/tiktokDB";

const port = process.env.PORT || 8003;

app.use(express.json());
app.use(Cors());

mongoose
  .connect(Connect_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })

  .then(() => console.log("Connected to DB"))
  .catch((err) => console.log(err));

app.post("/posts", (req, res) => {
  const dbVideos = req.body;
  Videos.create(dbVideos)
    .then((data) => res.status(200).send(data))
    .catch((err) => res.status(500).send(err));
});

app.get("/posts", (req, res) => {
  Videos.find({})
    .then((data) => res.status(200).send(data))
    .catch((err) => res.status(500).send(err));
});

app.post("/post/videos", upload.single("video"), async (req, res) => {
  if (!req.file) {
    res.status(400).send("No file uploaded");
    return;
  }

  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "video",
    });

    const content = new Content({
      title: req.body.title,
      desc: req.body.desc,
      video: result.secure_url,
    });
    const savedContent = await content.save();
    res.send(savedContent);
  } catch (err) {
    res.status(404).send(err);
  }
});

app.get("/post/videos", (req, res) => {
  Content.find({})
    .then((data) => res.status(200).send(data))
    .catch((err) => res.status(500).send(err));
});

app.listen(port, () => console.log(`server is up on ${port}`));
