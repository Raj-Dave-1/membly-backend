// Dada Ki Jay Ho

import { Router } from "express";
import * as adminController from "../controllers/admin";

const router = Router();

router.get("/listUsers", adminController.listUsers);

router.get("/listLoggedInUsers", adminController.listLoggedInUsers);

router.post("/blockUser/:userId", adminController.blockUser);

router.post("/allowUser/:userId", adminController.allowUser);

export default router;
