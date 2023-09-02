// Dada Ki Jay Ho

import { Router } from "express";
import * as publicController from "../controllers/public";

const router = Router();

router.post("/login", publicController.login);
router.post("/signup", publicController.signup);

export default router;
