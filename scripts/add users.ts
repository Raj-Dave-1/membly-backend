// Dada Ki Jay Ho

import axios, { AxiosError } from "axios";
import { sampleUsers } from "./data";
import User from "../models/user";

export const createUsers = () => {
    sampleUsers.forEach(async (eachUser) => {
        try {
            const result = await axios.post(
                "http://localhost:4000/signup",
                eachUser,
                {
                    headers: {
                        "Content-type": "application/json; charset=UTF-8",
                    },
                }
            );
            console.log(result.data);
        } catch (error: AxiosError | unknown) {
            console.log(
                error instanceof AxiosError ? error.response?.data : error
            );
        }
    });
};

export const removeAllUsers = async () => {
    await User.deleteMany({});
};
