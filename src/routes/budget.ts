import { Router } from "express";
import {
  createBudget,
  deleteBudget,
  getBudget,
  getBudgets,
  updateBudget,
} from "../controllers/budget";
import { verifyJWT } from "../middlewares/auth";

const router = Router();
router.use(verifyJWT);
router.post("/", createBudget);
router.get("/", getBudgets);
router.get("/:budgetId", getBudget);
router.put("/:budgetId", updateBudget);
router.delete("/:budgetId", deleteBudget);

export default router;
