"use strict";
// Dada Ki Jay Ho
Object.defineProperty(exports, "__esModule", { value: true });
// import Schema from mongoose
const mongoose_1 = require("mongoose");
const enums_1 = require("../constants/enums");
// create schema
const UserSchema = new mongoose_1.Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    passwordSalt: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        enum: enums_1.ECountry,
        required: true,
    },
    locLat: {
        type: Number,
        required: true,
    },
    locLong: {
        type: Number,
        required: true,
    },
    isPremium: {
        type: Boolean,
        required: true,
        default: false,
    },
    userType: {
        type: String,
        enum: enums_1.EUserType,
        required: true,
        default: enums_1.EUserType.normal,
    },
}, {
    timestamps: true,
});
// return model from schema
const User = (0, mongoose_1.model)("User", UserSchema);
exports.default = User;
