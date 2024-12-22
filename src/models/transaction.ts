import mongoose from "mongoose";

const { Schema, model } = mongoose;
const { ObjectId } = Schema.Types;
const transactionSchema = new Schema(
  {
    amount: { type: Number, required: true },
    category: { type: String, required: true, trim: true },
    narration: { type: String, required: true, trim: true },
    ownerId: { type: ObjectId, ref: "User" },
    budgetId: { type: ObjectId, ref: "Budget" },
  },
  {
    timestamps: true,
  }
);

const Transaction = model("Transaction", transactionSchema);

export default Transaction;