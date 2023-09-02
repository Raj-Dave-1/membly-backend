// Dada Ki Jay Ho

import { log } from "console";
import express from "express";
import bodyParser from "body-parser";
import * as redis from "redis";

import isAuth from "./middlewares/isAuth";
import RedisClient from "./utils/redis-client";

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// initialize redis database
RedisClient.getInstance().getClient();

app.use(isAuth);

app.use("/", (req, res, next) => {
    return res.send("SitaRam");
});

const port = process.env.PORT;
app.listen(port, () => {
    log(`Server is listening on port ${port} ...`);
});
