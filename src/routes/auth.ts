import { logoutUser, registerUser, userLogin } from "../controllers/auth";
import { Router } from "express";

const router = Router();
router.post("/register", registerUser);
router.post("/login", userLogin);
router.post("/logout", logoutUser);

export default router;
