import { Router } from "express";
import { createCountry, getCountry } from "./countryController.js";
const router = Router();
router.get("/", getCountry);
router.get("/:id", (req, res) => { });
router.post("/", createCountry);
export default router;
