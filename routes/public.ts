// Dada Ki Jay Ho

import { Router } from "express";
import * as publicController from "../controllers/public";

const router = Router();

router.post("/login", publicController.login);
router.use("/login", (req, res) => {
    return res.send("Please login first");
});
router.post("/signup", publicController.signup);

export default router;
