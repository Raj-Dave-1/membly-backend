"use strict";
// Dada Ki Jay Ho
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
exports.allowUser = exports.blockUser = exports.listLoggedInUsers = exports.listUsers = void 0;
const user_1 = __importDefault(require("../models/user"));
const redis_client_1 = __importDefault(require("../utils/redis-client"));
const enums_1 = require("../constants/enums");
const listUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_1.default.find({});
        const redisClient = redis_client_1.default.getInstance().getClient();
        const redisKeys = yield redisClient.keys("user:*");
        const loggedInUsers = [];
        redisKeys.forEach((key) => {
            const userId = key.split(":")[1];
            loggedInUsers.push(userId);
        });
        const finalUserList = users.map((each) => {
            return Object.assign(Object.assign({}, each.toObject()), { currentlyLoggedIn: loggedInUsers.includes(each.userId) });
        });
        return res.send({
            status: "success",
            message: "List of Users",
            data: finalUserList,
        });
    }
    catch (error) {
        return res.send({
            status: "fail",
            message: error instanceof Error ? error.message : error,
        });
    }
});
exports.listUsers = listUsers;
const listLoggedInUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_1.default.find({});
        const redisClient = redis_client_1.default.getInstance().getClient();
        const redisKeys = yield redisClient.keys("user:*");
        const loggedInUsers = [];
        redisKeys.forEach((key) => {
            const userId = key.split(":")[1];
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
    }
    catch (error) {
        return res.send({
            status: "fail",
            message: error instanceof Error ? error.message : error,
        });
    }
});
exports.listLoggedInUsers = listLoggedInUsers;
const blockUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        if (!userId) {
            throw new Error("Please provide userId");
        }
        const result = yield user_1.default.findOneAndUpdate({ userId }, {
            status: enums_1.EUserStatus.blocked,
        });
        if (!result) {
            throw new Error("Can not update user. something went wrong. may be please check userId");
        }
        // remove token entry from redis
        const redisClient = redis_client_1.default.getInstance().getClient();
        yield redisClient.del(`user:${userId}`);
        return res.send({
            status: "success",
            message: "User blocked successfully",
            data: result,
        });
    }
    catch (error) {
        return res.send({
            status: "fail",
            message: error instanceof Error ? error.message : error,
        });
    }
});
exports.blockUser = blockUser;
const allowUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        if (!userId) {
            throw new Error("Please provide userId");
        }
        const result = yield user_1.default.findOneAndUpdate({ userId }, {
            status: enums_1.EUserStatus.allowed,
        });
        if (!result) {
            throw new Error("Can not update user. something went wrong. may be please check userId");
        }
        return res.send({
            status: "success",
            message: "User allowed successfully",
            data: result,
        });
    }
    catch (error) {
        return res.send({
            status: "fail",
            message: error instanceof Error ? error.message : error,
        });
    }
});
exports.allowUser = allowUser;
