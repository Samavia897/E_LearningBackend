import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  data: { type: String, required: true }, // Should contain path like "/uploads/filename.pdf"
  type: { type: String, enum: ["file", "link"], default: "file" }
});

const topicSchema = new mongoose.Schema({
  name: { type: String, required: true },
  files: [fileSchema]
});

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    topics: [topicSchema]
  },
  { timestamps: true }
);

export default mongoose.model("Course", courseSchema);