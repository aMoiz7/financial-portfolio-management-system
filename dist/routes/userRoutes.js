import Router from "express";
import { signIn, signUp } from "../controllers/userController.js";
const router = Router();
router.route("/signup").post(signUp);
router.route("/signIn").post(signIn);
export default router;
