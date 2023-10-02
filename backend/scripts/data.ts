// Dada Ki Jay Ho

import { EUserType, ECountry, EUserStatus } from "../constants/enums";
import ISignUpUser from "../interfaces/signupUser";

export const sampleUsers: ISignUpUser[] = [
    {
        username: "john_doe",
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        password: "hashed_password_1",

        country: ECountry.unitedstates,
        locLat: 37.7749,
        locLong: -122.4194,
    },
    {
        username: "alice_smith",
        firstName: "Alice",
        lastName: "Smith",
        email: "alice@example.com",
        password: "hashed_password_2",

        country: ECountry.canada,
        locLat: 45.4215,
        locLong: -75.6919,
    },
    {
        username: "jane_davis",
        firstName: "Jane",
        lastName: "Davis",
        email: "jane@example.com",
        password: "hashed_password_3",

        country: ECountry.unitedkingdom,
        locLat: 51.5074,
        locLong: -0.1278,
    },
    {
        username: "michael_brown",
        firstName: "Michael",
        lastName: "Brown",
        email: "michael@example.com",
        password: "hashed_password_4",

        country: ECountry.australia,
        locLat: -33.8688,
        locLong: 151.2093,
    },
    {
        username: "linda_wilson",
        firstName: "Linda",
        lastName: "Wilson",
        email: "linda@example.com",
        password: "hashed_password_5",

        country: ECountry.canada,
        locLat: 45.4215,
        locLong: -75.6919,
    },
    {
        username: "william_jones",
        firstName: "William",
        lastName: "Jones",
        email: "william@example.com",
        password: "hashed_password_6",

        country: ECountry.unitedstates,
        locLat: 40.7128,
        locLong: -74.006,
    },
    {
        username: "susan_white",
        firstName: "Susan",
        lastName: "White",
        email: "susan@example.com",
        password: "hashed_password_7",

        country: ECountry.canada,
        locLat: 45.4215,
        locLong: -75.6919,
    },
    {
        username: "robert_taylor",
        firstName: "Robert",
        lastName: "Taylor",
        email: "robert@example.com",
        password: "hashed_password_8",

        country: ECountry.unitedkingdom,
        locLat: 51.5074,
        locLong: -0.1278,
    },
    {
        username: "sarah_anderson",
        firstName: "Sarah",
        lastName: "Anderson",
        email: "sarah@example.com",
        password: "hashed_password_9",

        country: ECountry.india,
        locLat: -33.8688,
        locLong: 151.2093,
    },
    {
        username: "james_jackson",
        firstName: "James",
        lastName: "Jackson",
        email: "james@example.com",
        password: "hashed_password_10",

        country: ECountry.india,
        locLat: 37.7749,
        locLong: -122.4194,
    },
    {
        username: "emily_harris",
        firstName: "Emily",
        lastName: "Harris",
        email: "emily@example.com",
        password: "hashed_password_11",

        country: ECountry.southafrica,
        locLat: 45.4215,
        locLong: -75.6919,
    },
    {
        username: "david_wilson",
        firstName: "David",
        lastName: "Wilson",
        email: "david@example.com",
        password: "hashed_password_12",

        country: ECountry.norway,
        locLat: 51.5074,
        locLong: -0.1278,
    },
    {
        username: "mary_thompson",
        firstName: "Mary",
        lastName: "Thompson",
        email: "mary@example.com",
        password: "hashed_password_13",

        country: ECountry.romania,
        locLat: -33.8688,
        locLong: 151.2093,
    },
    {
        username: "michael_martin",
        firstName: "Michael",
        lastName: "Martin",
        email: "michael@example.com",
        password: "hashed_password_14",

        country: ECountry.unitedstates,
        locLat: 40.7128,
        locLong: -74.006,
    },
    {
        username: "laura_roberts",
        firstName: "Laura",
        lastName: "Roberts",
        email: "laura@example.com",
        password: "hashed_password_15",

        country: ECountry.canada,
        locLat: 45.4215,
        locLong: -75.6919,
    },
];
