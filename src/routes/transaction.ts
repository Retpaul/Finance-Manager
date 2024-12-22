import { Router } from "express";
import {
  createTransaction,
  deleteTransaction,
  getTransaction,
  getTransactions,
  updateTransaction,
} from "../controllers/transaction";
import { verifyJWT } from "../middlewares/auth";

const router = Router();
router.use(verifyJWT);

router.post("/", createTransaction);
router.get("/", getTransactions);
router.get("/:transactionId", getTransaction);
router.put("/:transactionId", updateTransaction);
router.delete("/:transactionId", deleteTransaction);

export default router;
