import mongoose from "mongoose";

const { Schema, model } = mongoose;
const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, unique: true },
    password: { type: String,required:true }
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);

export default User;
