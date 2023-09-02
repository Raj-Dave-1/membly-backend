// Dada Ki Jay Ho

import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";

import User from "../models/user";
import IUser from "../interfaces/user";
import { EUserStatus, EUserType } from "../constants/enums";
import ISignUpUser from "../interfaces/signupUser";
import RedisClient from "../utils/redis-client";

export const login = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // get email id / username and password from body
        const emailOrUserName: string = req.body.emailOrUserName;
        const password: string = req.body.password;

        if (!emailOrUserName) throw new Error("email or username not provided");

        if (!password) throw new Error("password is not provided");

        // check if user exists in database?
        let user: IUser | null;
        if (/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/.test(emailOrUserName))
            user = await User.findOne({ email: emailOrUserName });
        else user = await User.findOne({ username: emailOrUserName });

        if (!user) {
            throw new Error("User with this email / username not found");
        }

        // check if user blocked or not
        if (user.status === EUserStatus.blocked) {
            throw new Error("User is blocked");
        }

        const redisClient = RedisClient.getInstance().getClient();
        const tokenExists = await redisClient.exists(user.userId);
        if (tokenExists === 1) {
            const token = await redisClient.get(user.userId);
            return res.send({
                status: "success",
                message: "you are already logged in",
                token,
                user: user,
            });
        }

        const TOKEN_SECRET: string | undefined = process.env.TOKEN_SECRET;
        if (!TOKEN_SECRET) throw new Error("Token secret not found");
        // generate jwt token for user
        const token: string = jwt.sign(
            { userId: user.userId, userType: user.userType },
            TOKEN_SECRET
        );

        // add token to redis database
        const REDIS_EXP_TIME: number = Number.parseInt(
            process.env.REDIS_EXP_TIME || "30000"
        ); // default: 30 sec
        const result = await redisClient.setEx(
            user.userId,
            REDIS_EXP_TIME,
            token
        );
        console.log(result);

        return res.send({
            status: "success",
            redisResult: result,
            token: token,
            user: user,
        });
    } catch (error) {
        return res.status(500).send({
            status: "failed",
            message: error instanceof Error ? error.message : error,
        });
    }
};

export const signup = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // get data from body

        const userData: ISignUpUser = req.body as ISignUpUser;

        if (!userData.email) throw new Error("email or username not provided");

        if (!userData.password) throw new Error("password is not provided");

        // check if user exists in database?
        let user: IUser | null = await User.findOne({
            userName: userData.username,
        });

        if (user) {
            throw new Error("User with this email / username already exists");
        }

        const passwordSalt = bcrypt.genSaltSync(12);
        const passwordHash = bcrypt.hashSync(userData.password, passwordSalt);

        const newUser: IUser = new User({
            userId: uuidv4(),
            username: userData.username,
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            passwordHash: passwordHash,
            passwordSalt: passwordSalt,
            country: userData.country,
            locLat: userData.locLat,
            locLong: userData.locLong,
            isPremium: false,
            userType: EUserType.normal,
            status: EUserStatus.allowed,
        });

        await newUser.save();

        const TOKEN_SECRET: string | undefined = process.env.TOKEN_SECRET;
        if (!TOKEN_SECRET) throw new Error("Token secret not found");
        // generate jwt token for user
        const token: string = jwt.sign(
            { userId: newUser.userId, userType: newUser.userType },
            TOKEN_SECRET
        );

        // add token to redis database
        // add token to redis database
        const redisClient = RedisClient.getInstance().getClient();
        const REDIS_EXP_TIME: number = Number.parseInt(
            process.env.REDIS_EXP_TIME || "30000"
        ); // default: 30 sec
        const result = await redisClient.setEx(token, REDIS_EXP_TIME, "valid");
        console.log(result);

        return res.redirect(302, "/home");
    } catch (error) {
        return res.status(500).send({
            status: "failed",
            message: error instanceof Error ? error.message : error,
        });
    }
};
