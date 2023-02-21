import express from "express";
import { emailVarefide, forgetPassword, forgetPasswordEmailVarefecation, loginUser, regusterUser } from "../controllers/authController.js";
const router = express.Router();

router.post("/reguster", regusterUser);
router.post("/login", loginUser);
router.get("/verify/:token", emailVarefide);
router.post("/forget-password", forgetPasswordEmailVarefecation);
router.put("/forget-password/:id/:token", forgetPassword);

export default router;