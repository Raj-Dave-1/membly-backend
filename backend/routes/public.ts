// Dada Ki Jay Ho

import { Request, Response, Router } from "express";
import * as publicController from "../controllers/public";

const router = Router();

router.post("/login", publicController.login);
router.use("/login", (req: Request, res: Response) => {
    return res.send("Please login first");
});
router.post("/signup", publicController.signup);

export default router;
