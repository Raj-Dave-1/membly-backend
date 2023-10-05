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
const jwt = __importStar(require("jsonwebtoken"));
const user_1 = __importDefault(require("../models/user"));
const enums_1 = require("../constants/enums");
const redis_client_1 = __importDefault(require("../utils/redis-client"));
exports.default = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // get authorization from headers
    const authorization = req.get("Authorization");
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
        const token = authorization.split(" ")[1];
        const TOKEN_SECRET = process.env.TOKEN_SECRET;
        if (!TOKEN_SECRET) {
            throw new Error("Can not find TOKEN_SECRET");
        }
        // verify token and fetch data from it
        const decoded = jwt.verify(token, TOKEN_SECRET);
        const userId = decoded.userId;
        const userType = decoded.userType;
        if (!userId || !userType)
            throw new Error("Can not fetch user id or user type from token");
        // get user and check if status is blocked
        const user = yield user_1.default.findOne({ userId });
        if (!user) {
            return res.send({
                status: "fail",
                message: "User Does Not Exists",
            });
        }
        if (user.status === enums_1.EUserStatus.blocked) {
            return res.send({
                status: "fail",
                message: "User is blocked",
            });
        }
        // check if user is logged in or not using redis
        const redisClient = redis_client_1.default.getInstance().getClient();
        if ((yield redisClient.hExists("user", userId)) === false) {
            return res.send({
                status: "fail",
                message: "Please login first",
            });
        }
        // check for token invalidation
        if ((yield redisClient.get(`user:${userId}`)) !== token) {
            return res.send({
                status: "fail",
                message: "Token is invalidated",
            });
        }
        // save data to req headers
        req.headers.userId = userId;
        req.headers.userType = userType;
        next();
    }
    catch (error) {
        return res.status(500).send({
            status: "failed",
            message: error instanceof Error ? error.message : error,
        });
    }
});
