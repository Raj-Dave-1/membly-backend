// Dada Ki Jay Ho

import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import IUser from "../interfaces/user";
import User from "../models/user";
import { EUserStatus } from "../constants/enums";
import RedisClient from "../utils/redis-client";

export default async (req: Request, res: Response, next: NextFunction) => {
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

        // get user and check if status is blocked
        const user: IUser | null = await User.findOne({ userId });
        if (!user) {
            return res.send({
                status: "fail",
                message: "User Does Not Exists",
            });
        }
        if (user.status === EUserStatus.blocked) {
            return res.send({
                status: "fail",
                message: "User is blocked",
            });
        }

        // check if user is logged in or not using redis
        const redisClient = RedisClient.getInstance().getClient();
        if ((await redisClient.exists(`user:${userId}`)) === 0) {
            return res.send({
                status: "fail",
                message: "Please login first",
            });
        }

        // check for token invalidation
        if ((await redisClient.get(`user:${userId}`)) !== token) {
            return res.send({
                status: "fail",
                message: "Token is invalidated",
            });
        }

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
