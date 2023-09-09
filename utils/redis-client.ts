// Dada Ki Jay Ho

import * as redis from "redis";
import { REDIS_PASSWORD } from "../config/config";

export default class RedisClient {
    private static instance: RedisClient;
    private client: redis.RedisClientType;
    private constructor() {
        this.client = redis.createClient({
            url: `redis://:${REDIS_PASSWORD}@redis:6379`,
        });

        this.client.on("connect", (err) => {
            console.log("Client connected to Redis...");
        });

        this.client.on("error", (err) =>
            console.log("Redis Cluster Error", err)
        );
        this.initRedis();
    }

    private async initRedis() {
        await this.client.connect();
    }

    public static getInstance(): RedisClient {
        if (!RedisClient.instance) RedisClient.instance = new RedisClient();
        return RedisClient.instance;
    }

    public getClient(): redis.RedisClientType {
        return this.client;
    }
}
