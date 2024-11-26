import { Router } from "express";
import { createForm, getCandidates } from "./candidateController.js";
import { createRouteHandler } from "uploadthing/express";
import { uploadRouter } from "./uploadRouter.js";

const router = Router();

router.get("/", getCandidates);

router.get("/:id", (req, res) => {
  // Implementasi GET single candidate
});

// POST route dengan middleware uploadthing
router.post("/", createForm);

export default router;
