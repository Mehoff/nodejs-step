import mongoose from "mongoose";
const { Schema } = mongoose;

export const BookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: "user" },
  path: { type: String, required: true },
  uploadedAt: { type: Number, default: Date.now() },
  deleted: { type: Boolean, default: false, select: false },
});

export const Book = mongoose.model("book", BookSchema);
