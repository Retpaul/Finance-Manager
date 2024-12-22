import { Request, Response } from "express";
import { budgetValidation } from "../validation/budget";
import Budget from "../models/budget";

// @method POST
// @endpoint /api/budgets
// @type private

export const createBudget = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.user._id;
  const { error, value } = budgetValidation(req.body);
  if (error) {
    res.status(400).json({ error: error.message, errors: error.details });
    return;
  }
  const { total_amount, duration, title } = value;
  const newBudget = new Budget({
    total_amount,
    duration,
    title,
    ownerId: userId,
  });

  const savedBudget = await newBudget.save();
  if (!savedBudget) {
    res.status(400).json({ error: "Failed to create budget" });
    return;
  }

  res
    .status(201)
    .json({ message: "Budget created successfully", data: savedBudget });
};

// @method GET
// @endpoint /api/budgets
// @type private

export const getBudgets = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.user._id;
  //  console.log(user)
  const budgets = await Budget.find({ ownerId: userId });
  res.status(200).json(budgets);
};

// @method GET
// @endpoint /api/budgets/:budgetId
// @type private

export const getBudget = async (req: Request, res: Response): Promise<void> => {
  const budgetId = req.params.budgetId;
  const budget = await Budget.findById(budgetId);

  if (!budget) {
    res.status(404).json({ error: "Budget Not found" });
    return;
  }

  res.status(200).json(budget);
};

// @method PUT
// @endpoint /api/budgets/:budgetId
// @type private

export const updateBudget = async (
  req: Request,
  res: Response
): Promise<void> => {
  const budgetId = req.params.budgetId;
  const updatedbudget = await Budget.findByIdAndUpdate(
    budgetId,
    { ...req.body },
    { new: true }
  );
  if (!updatedbudget) {
    res.status(404).json({ error: "Budget Not found" });
    return;
  }

  res.status(200).json(updatedbudget);
};

// @method DELETE
// @endpoint /api/budgets/:budgetId
// @type private

export const deleteBudget = async (
  req: Request,
  res: Response
): Promise<void> => {
  const budgetId = req.params.budgetId;
  const deletedbudget = await Budget.findByIdAndDelete(budgetId, { new: true });
  if (!deletedbudget) {
    res.status(404).json({ error: "Budget Not found" });
    return;
  }

  res.status(200).json({ message: "Budget deleted succesfully" });
};
