import mongoose from "mongoose";
import validator from "validator";

export const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, validate: validator.isEmail },
  password: { type: String, minlength: 6, required: true },
  createdAt: { type: Number, default: Date.now() },
  deleted: { type: Boolean, default: false, select: false },
  authorizations: { type: [Number], default: [], select: false },
});

export const User = mongoose.model("user", UserSchema);
