// Dada Ki Jay Ho

import express, { NextFunction, Request, Response } from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import promClient from "prom-client";
import resTime from "response-time";

import isAuth from "./middlewares/isAuth";
import publicRoutes from "./routes/public";
import RedisClient from "./utils/redis-client";
import {
    MONGO_PORT,
    MONGO_HOST,
    MONGO_PASSWORD,
    MONGO_USER,
} from "./config/config";
import { createUsers, removeAllUsers } from "./scripts/add users";
import isAdmin from "./middlewares/isAdmin";
import adminRoutes from "./routes/admin";

const collectDefaultMetrics = promClient.collectDefaultMetrics;
collectDefaultMetrics({ register: promClient.register });

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// REDIS: initialize redis database
RedisClient.getInstance().getClient();

// Monitoring things
const reqResTime = new promClient.Histogram({
    name: "membly_backend_req_res_time",
    help: "this is req-res time of memlby backend",
    labelNames: ["method", "route", "status_code"],
    buckets: [0, 50, 100, 200, 400, 600, 800, 1000, 1500, 2000],
});
const totalReqCounter = new promClient.Counter({
    name: "membly_backend_total_req_counter",
    help: "this is total number of request on memlby backend",
});
app.use(
    resTime((req: Request, res: Response, time) => {
        if (req.url != "/metrics") totalReqCounter.inc();
        reqResTime
            .labels({
                method: req.method,
                route: req.url,
                status_code: req.statusCode,
            })
            .observe(time);
    })
);

// Routse
app.use("/", async (req, res, next) => {
    console.log(req.url, req.originalUrl);
    next();
});

// TODO: secure this and other api so that unauthorized can not call it
app.get("/metrics", async (req: Request, res: Response) => {
    res.setHeader("Content-Type", promClient.register.contentType);
    const metrics = await promClient.register.metrics();
    return res.send(metrics);
});

app.use("/", publicRoutes);
app.use("/api", isAuth);
app.use("/api/admin", isAdmin, adminRoutes);

app.use("/", async (req, res, next) => {
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
            console.log(`Server is listening on port ${port} ...`);
        });
    })
    .catch((error) => console.log(error));
