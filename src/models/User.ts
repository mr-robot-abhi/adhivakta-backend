import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  role: { type: String, enum: ["client", "lawyer"], required: true },
  name: { type: String, required: true },
  expertise: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("User", UserSchema);