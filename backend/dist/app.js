"use strict";
// Dada Ki Jay Ho
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
const prom_client_1 = __importDefault(require("prom-client"));
const response_time_1 = __importDefault(require("response-time"));
const isAuth_1 = __importDefault(require("./middlewares/isAuth"));
const public_1 = __importDefault(require("./routes/public"));
const redis_client_1 = __importDefault(require("./utils/redis-client"));
const config_1 = require("./config/config");
const isAdmin_1 = __importDefault(require("./middlewares/isAdmin"));
const admin_1 = __importDefault(require("./routes/admin"));
const collectDefaultMetrics = prom_client_1.default.collectDefaultMetrics;
collectDefaultMetrics({ register: prom_client_1.default.register });
const app = (0, express_1.default)();
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
// REDIS: initialize redis database
redis_client_1.default.getInstance().getClient();
// Monitoring things
const reqResTime = new prom_client_1.default.Histogram({
    name: "membly_backend_req_res_time",
    help: "this is req-res time of memlby backend",
    labelNames: ["method", "route", "status_code"],
    buckets: [0, 50, 100, 200, 400, 600, 800, 1000, 1500, 2000],
});
const totalReqCounter = new prom_client_1.default.Counter({
    name: "membly_backend_total_req_counter",
    help: "this is total number of request on memlby backend",
});
app.use((0, response_time_1.default)((req, res, time) => {
    if (req.url != "/metrics")
        totalReqCounter.inc();
    reqResTime
        .labels({
        method: req.method,
        route: req.url,
        status_code: req.statusCode,
    })
        .observe(time);
}));
// Routse
app.use("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.url, req.originalUrl);
    next();
}));
// TODO: secure this and other api so that unauthorized can not call it
app.get("/metrics", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.setHeader("Content-Type", prom_client_1.default.register.contentType);
    const metrics = yield prom_client_1.default.register.metrics();
    return res.send(metrics);
}));
app.use("/", public_1.default);
app.use("/api", isAuth_1.default);
app.use("/api/admin", isAdmin_1.default, admin_1.default);
app.use("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    return res.send("SitaRam");
}));
mongoose_1.default
    .connect(`mongodb://${config_1.MONGO_USER}:${config_1.MONGO_PASSWORD}@${config_1.MONGO_HOST}:${config_1.MONGO_PORT}/membly-mongo-database?authSource=admin`)
    .then(() => {
    console.log("Connected to mongodb database...");
    const port = process.env.PORT;
    app.listen(port, () => {
        console.log(`Server is listening on port ${port} ...`);
    });
})
    .catch((error) => console.log(error));
