import mongoose from "mongoose";
const { Schema } = mongoose;

export const CommentSchema = new mongoose.Schema({
  text: { type: String, minlength: "1", maxlength: 128 },
  author: { type: Schema.Types.ObjectId, ref: "user" },
  uploadedAt: { type: Number, default: Date.now() },
  deleted: { type: Boolean, default: false, select: false },
});

export const Comment = mongoose.model("comment", CommentSchema);
