// Dada Ki Jay Ho

// import Schema from mongoose
import { Schema, model } from "mongoose";
import IUser from "../interfaces/user";
import { ECountry, EUserStatus, EUserType } from "../constants/enums";

// create schema
const UserSchema = new Schema<IUser>(
    {
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
            enum: ECountry,
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
            enum: EUserType,
            required: true,
            default: EUserType.normal,
        },
        status: {
            type: String,
            enum: EUserStatus,
            default: EUserStatus.allowed,
        },
    },
    {
        timestamps: true,
    }
);

// return model from schema
const User = model<IUser>("User", UserSchema);

export default User;
