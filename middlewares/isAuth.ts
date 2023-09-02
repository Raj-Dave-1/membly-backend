// Dada Ki Jay Ho

import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";

export default (req: Request, res: Response, next: NextFunction) => {
    // get authorization from headers
    const authorization: string | undefined = req.get("Authorization");

    if (!authorization) {
        return res.redirect("/login");
        // return res.status(401).send({
        //     status: "failed",
        //     message:
        //         "please login First! authorization is not found in headers",
        // });
    }

    try {
        // fetch token from authorization
        const token: string = authorization.split(" ")[1];

        const TOKEN_SECRET: string | undefined = process.env.TOKEN_SECRET;
        if (!TOKEN_SECRET) {
            throw new Error("Can not find TOKEN_SECRET");
        }
        // verify token and fetch data from it
        const decoded: jwt.JwtPayload = jwt.verify(
            token,
            TOKEN_SECRET
        ) as jwt.JwtPayload;

        const userId = decoded.userId;
        const userType = decoded.userType;

        if (!userId || !userType)
            throw new Error("Can not fetch user id or user type from token");

        // save data to req headers
        req.headers.userId = userId;
        req.headers.userType = userType;

        next();
    } catch (error) {
        return res.status(500).send({
            status: "failed",
            message: error instanceof Error ? error.message : error,
        });
    }
};
