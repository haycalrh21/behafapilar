import { Router } from "express";
import { insertUserSchema, loginUserSchema } from "../../db/userSchema.js";
import { validateData } from "../../middlewares/validationMiddlewares.js";
import { registerUser, loginUser } from "./authController.js";
const router = Router();
router.post("/register", validateData(insertUserSchema), registerUser);
router.post("/login", validateData(loginUserSchema), loginUser);
export default router;
