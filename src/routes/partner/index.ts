import { Router } from "express";

import {
  createPartner,
  getAllPartners,
  getPartners,
} from "./partnerController.js";

const router = Router();

router.get("/", getPartners);
router.get("/all", getAllPartners);
router.get("/:id");
router.post("/", createPartner);

export default router;
