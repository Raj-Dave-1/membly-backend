// Dada Ki Jay Ho

import { Document } from "mongoose";
import { EUserType, EUserStatus, ECountry } from "../constants/enums";

export default interface IUser extends Document {
    userId: string;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    passwordHash: string;
    passwordSalt: string;
    country: ECountry;
    locLat: number;
    locLong: number;
    isPremium: boolean;
    userType: EUserType;
    status: EUserStatus;
}
