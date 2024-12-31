import { Request, Response } from 'express';
import Transaction from '../models/transaction';
import Budget from '../models/budget';

// Generate Financial Summaries
export const getFinancialSummary = async (req: Request, res: Response) => {
  try {
      const userId = req.user._id; // Assuming user ID is stored in req.user

    const totalIncome = await Transaction.aggregate([
      { $match: { ownerId: userId, amount: { $gt: 0 } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const totalExpenses = await Transaction.aggregate([
      { $match: { ownerId: userId, amount: { $lt: 0 } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const budgets = await Budget.find({ ownerId: userId });
    const remainingBudget = budgets.reduce((acc, budget) => acc + budget.total_amount, 0);

    const topSpendingCategories = await Transaction.aggregate([
      { $match: { ownerId: userId, amount: { $lt: 0 } } },
      { $group: { _id: "$category", total: { $sum: "$amount" } } },
      { $sort: { total: 1 } },
      { $limit: 5 },
    ]);

    res.status(200).json({
      total_income: totalIncome[0]?.total || 0,
      total_expenses: totalExpenses[0]?.total || 0,
      remaining_budget: remainingBudget,
      top_spending_categories: topSpendingCategories.map((c) => ({ category: c._id, amount: c.total })),
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to generate financial summary" });
  }
};

// Monthly Breakdown
export const getMonthlyBreakdown = async (req: Request, res: Response) => {
  try {
      const userId = req.user._id;

    const monthlyBreakdown = await Transaction.aggregate([
      { $match: { ownerId: userId } },
      {
        $group: {
          _id: { $month: "$date" },
          total_income: {
            $sum: { $cond: [{ $gt: ["$amount", 0] }, "$amount", 0] },
          },
          total_expenses: {
            $sum: { $cond: [{ $lt: ["$amount", 0] }, "$amount", 0] },
          },
        },
      },
      { $sort: { "_id": 1 } },
    ]);

    const breakdown = monthlyBreakdown.map((entry) => ({
      month: entry._id,
      total_income: entry.total_income,
      total_expenses: entry.total_expenses,
      net_savings: entry.total_income + entry.total_expenses,
    }));

    res.status(200).json({ months: breakdown });
  } catch (error) {
    res.status(500).json({ error: "Failed to generate monthly breakdown" });
  }
};

