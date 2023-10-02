// Dada Ki Jay Ho

import { Request, Response } from "express";
import IUser from "../interfaces/user";
import User from "../models/user";
import RedisClient from "../utils/redis-client";
import { EUserStatus } from "../constants/enums";

export const listUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find({});

        const redisClient = RedisClient.getInstance().getClient();
        const redisKeys: string[] = await redisClient.keys("user:*");
        const loggedInUsers: string[] = [];
        redisKeys.forEach((key) => {
            const userId: string = key.split(":")[1];
            loggedInUsers.push(userId);
        });

        const finalUserList = users.map((each) => {
            return {
                ...each.toObject(),
                currentlyLoggedIn: loggedInUsers.includes(each.userId),
            };
        });

        return res.send({
            status: "success",
            message: "List of Users",
            data: finalUserList,
        });
    } catch (error) {
        return res.send({
            status: "fail",
            message: error instanceof Error ? error.message : error,
        });
    }
};

export const listLoggedInUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find({});

        const redisClient = RedisClient.getInstance().getClient();
        const redisKeys: string[] = await redisClient.keys("user:*");
        const loggedInUsers: string[] = [];
        redisKeys.forEach((key) => {
            const userId: string = key.split(":")[1];
            loggedInUsers.push(userId);
        });

        const finalUserList = users.filter((each) => {
            return loggedInUsers.includes(each.userId);
        });

        return res.send({
            status: "success",
            message: "List of Users",
            data: finalUserList,
        });
    } catch (error) {
        return res.send({
            status: "fail",
            message: error instanceof Error ? error.message : error,
        });
    }
};

export const blockUser = async (req: Request, res: Response) => {
    try {
        const userId: string = req.params.userId;

        if (!userId) {
            throw new Error("Please provide userId");
        }

        const result = await User.findOneAndUpdate(
            { userId },
            {
                status: EUserStatus.blocked,
            }
        );

        if (!result) {
            throw new Error(
                "Can not update user. something went wrong. may be please check userId"
            );
        }

        // remove token entry from redis
        const redisClient = RedisClient.getInstance().getClient();
        await redisClient.del(`user:${userId}`);

        return res.send({
            status: "success",
            message: "User blocked successfully",
            data: result,
        });
    } catch (error) {
        return res.send({
            status: "fail",
            message: error instanceof Error ? error.message : error,
        });
    }
};

export const allowUser = async (req: Request, res: Response) => {
    try {
        const userId: string = req.params.userId;

        if (!userId) {
            throw new Error("Please provide userId");
        }

        const result = await User.findOneAndUpdate(
            { userId },
            {
                status: EUserStatus.allowed,
            }
        );

        if (!result) {
            throw new Error(
                "Can not update user. something went wrong. may be please check userId"
            );
        }

        return res.send({
            status: "success",
            message: "User allowed successfully",
            data: result,
        });
    } catch (error) {
        return res.send({
            status: "fail",
            message: error instanceof Error ? error.message : error,
        });
    }
};
