import { Router } from "express";
import { createForm, getall, getCandidates } from "./candidateController.js";
import { createRouteHandler } from "uploadthing/express";

const router = Router();

router.get("/", getCandidates);
router.get("/all", getall);

router.get("/:id", (req, res) => {
  // Implementasi GET single candidate
});

// POST route dengan middleware uploadthing
router.post("/", createForm);

export default router;
