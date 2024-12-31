import { Request, Response } from "express";
import { transactionValidation } from "../validation/transaction";
import Transaction from "../models/transaction";

// @method POST
// @endpoint /api/transactions
// @type private

export const createTransaction = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.user._id;
  const { error, value } = transactionValidation(req.body);
  if (error) {
    res.status(400).json({ error: error.message, errors: error.details });
    return;
  }
  const { amount, narration, category } = value;
  const newTransaction = new Transaction({
    amount,
    narration,
    category,
    ownerId: userId,
  });

  const savedTransaction = await newTransaction.save();
  if (!savedTransaction) {
    res.status(400).json({ error: "Failed to create transaction" });
    return;
  }

  res
    .status(201)
    .json({
      message: "Transaction created successfully",
      data: savedTransaction,
    });
};

// @method GET
// @endpoint /api/transactions
// @type private

export const getTransactions = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.user._id;
  //  console.log(user)

  const transactions = await Transaction.find({ ownerId: userId });

  res.status(200).json(transactions);
};

// @method GET
// @endpoint /api/transactions/:transactionId
// @type private

export const getTransaction = async (
  req: Request,
  res: Response
): Promise<void> => {
  const transactionId = req.params.transactionId;
  const transaction = await Transaction.findById(transactionId);
  if (!transaction) {
    res.status(404).json({ error: "Transaction Not found" });
    return;
  }

  res.status(200).json(transaction);
};

// @method PUT
// @endpoint /api/transactions/:transactionId
// @type private

export const updateTransaction = async (
  req: Request,
  res: Response
): Promise<void> => {
  const transactionId = req.params.transactionId;
  const updatedtransaction = await Transaction.findByIdAndUpdate(
    transactionId,
    { ...req.body },
    { new: true }
  );
  if (!updatedtransaction) {
    res.status(404).json({ error: "Transaction Not found" });
    return;
  }

  res.status(200).json({ data: updatedtransaction });
};

// @method DELETE
// @endpoint /api/transactions/:transactionId
// @type private

export const deleteTransaction = async (
  req: Request,
  res: Response
): Promise<void> => {
  const transactionId = req.params.transactionId;
  const deletedtransaction = await Transaction.findByIdAndDelete(
    transactionId,
    { new: true }
  );
  if (!deletedtransaction) {
    res.status(404).json({ error: "Transaction Not found" });
    return;
  }

  res.status(200).json({ message: "Transaction deleted succesfully" });
};
