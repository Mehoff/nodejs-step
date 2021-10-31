import mongoose from "mongoose";

export const BookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  path: { type: String, required: true },
  uploadedAt: { type: Number, default: Date.now() },
  deleted: { type: Boolean, default: false },
});

export const Book = mongoose.model("book", BookSchema);
