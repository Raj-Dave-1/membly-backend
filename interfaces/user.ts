// Dada Ki Jay Ho

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
}
