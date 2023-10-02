// Dada Ki Jay Ho

import { NextFunction, Request, Response } from "express";
import { EUserType } from "../constants/enums";

export default (req: Request, res: Response, next: NextFunction) => {
    if (req.headers.userType != EUserType.admin) {
        return res.status(401).send({
            status: "fail",
            message: "You are Unauthorized to access this resource",
        });
    }
    if (req.headers.userType === EUserType.admin) {
        next();
    }
};
