import mongoose from "mongoose";

interface BudgetDocument extends Document {
  title: string;
  total_amount: number;
  duration: string; // weekly, monthly, etc.
  ownerId: string;
 
}
const { Schema, model } = mongoose;
const { ObjectId } = Schema.Types;
const budgetSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    total_amount: { type: Number, required: true },
    duration: {
      type: String,
      enum: ["daily", "weekly", "monthly", "yearly"],
      default: "daily",
    },
    ownerId: { type: ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

const Budget = model("Budget", budgetSchema);

export default Budget;
