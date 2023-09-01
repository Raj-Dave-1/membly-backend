// Dada Ki Jay Ho

import { EUserType } from "../constants/enums";

export default interface IUser {
    userId: string;
    name: string;
    email: string;
    passwordHash: string;
    passwordSalt: string;
    country: string;
    locLat: number;
    locLong: number;
    isPremium: boolean;
    userType: EUserType;
}
