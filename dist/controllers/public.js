"use strict";
// Dada Ki Jay Ho
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signup = exports.login = void 0;
const jwt = __importStar(require("jsonwebtoken"));
const uuid_1 = require("uuid");
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_1 = __importDefault(require("../models/user"));
const enums_1 = require("../constants/enums");
const redis_client_1 = __importDefault(require("../utils/redis-client"));
const config_1 = require("../config/config");
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // get email id / username and password from body
        const emailOrUserName = req.body.emailOrUserName;
        const password = req.body.password;
        if (!emailOrUserName)
            throw new Error("email or username not provided");
        if (!password)
            throw new Error("password is not provided");
        // check if user exists in database?
        let user;
        if (/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/.test(emailOrUserName))
            user = yield user_1.default.findOne({ email: emailOrUserName });
        else
            user = yield user_1.default.findOne({ username: emailOrUserName });
        if (!user) {
            throw new Error("User with this email / username not found");
        }
        // check if user blocked or not
        if (user.status === enums_1.EUserStatus.blocked) {
            throw new Error("User is blocked");
        }
        const redisClient = redis_client_1.default.getInstance().getClient();
        const tokenExists = yield redisClient.exists(user.userId);
        if (tokenExists === 1) {
            const token = yield redisClient.get(user.userId);
            return res.send({
                status: "success",
                message: "you are already logged in",
                token,
                user: user,
            });
        }
        const TOKEN_SECRET = process.env.TOKEN_SECRET;
        if (!TOKEN_SECRET)
            throw new Error("Token secret not found");
        // generate jwt token for user
        const token = jwt.sign({ userId: user.userId, userType: user.userType }, TOKEN_SECRET);
        // add token to redis database
        const redisExpTime = Number.parseInt(process.env.REDIS_EXP_TIME || config_1.REDIS_EXP_TIME);
        const result = yield redisClient.hSet("user", user.userId, token);
        redisClient.expire(`user:${user.userId}`, redisExpTime);
        console.log(result);
        return res.send({
            status: "success",
            redisResult: result,
            token: token,
            user: user,
        });
    }
    catch (error) {
        return res.status(500).send({
            status: "failed",
            message: error instanceof Error ? error.message : error,
        });
    }
});
exports.login = login;
const signup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // get data from body
        const userData = req.body;
        if (!userData.email)
            throw new Error("email or username not provided");
        if (!userData.password)
            throw new Error("password is not provided");
        // check if user exists in database?
        let user = yield user_1.default.findOne({
            userName: userData.username,
        });
        if (user) {
            throw new Error("User with this email / username already exists");
        }
        const passwordSalt = bcrypt_1.default.genSaltSync(12);
        const passwordHash = bcrypt_1.default.hashSync(userData.password, passwordSalt);
        const newUser = new user_1.default({
            userId: (0, uuid_1.v4)(),
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
            userType: enums_1.EUserType.normal,
            status: enums_1.EUserStatus.allowed,
        });
        yield newUser.save();
        const TOKEN_SECRET = process.env.TOKEN_SECRET;
        if (!TOKEN_SECRET)
            throw new Error("Token secret not found");
        // generate jwt token for user
        const token = jwt.sign({ userId: newUser.userId, userType: newUser.userType }, TOKEN_SECRET);
        // add token to redis database
        const redisClient = redis_client_1.default.getInstance().getClient();
        const redisExpTime = Number.parseInt(process.env.REDIS_EXP_TIME || config_1.REDIS_EXP_TIME);
        const result = yield redisClient.hSet("user", newUser.userId, token);
        redisClient.expire(`user:${newUser.userId}`, redisExpTime);
        console.log(result);
        return res.redirect(302, "/home");
    }
    catch (error) {
        return res.status(500).send({
            status: "failed",
            message: error instanceof Error ? error.message : error,
        });
    }
});
exports.signup = signup;
