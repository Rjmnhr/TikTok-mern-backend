import mongoose from "mongoose";

const ContentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
    },
    video: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Content", ContentSchema);
