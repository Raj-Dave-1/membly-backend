// Dada Ki Jay Ho

import { log } from "console";
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";

import isAuth from "./middlewares/isAuth";
import publicRoutes from "./routes/public";
import RedisClient from "./utils/redis-client";
import {
    MONGO_PORT,
    MONGO_HOST,
    MONGO_PASSWORD,
    MONGO_USER,
} from "./config/config";

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// initialize redis database
RedisClient.getInstance().getClient();

app.use(publicRoutes);
app.use(isAuth);

app.use("/", (req, res, next) => {
    return res.send("SitaRam");
});

mongoose
    .connect(
        `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/membly-mongo-database?authSource=admin`
    )
    .then(() => {
        console.log("Connected to mongodb database...");

        const port = process.env.PORT;
        app.listen(port, () => {
            log(`Server is listening on port ${port} ...`);
        });
    })
    .catch((error) => console.log(error));
