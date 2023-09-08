"use strict";
// Dada Ki Jay Ho
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const console_1 = require("console");
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
const isAuth_1 = __importDefault(require("./middlewares/isAuth"));
const public_1 = __importDefault(require("./routes/public"));
const redis_client_1 = __importDefault(require("./utils/redis-client"));
const config_1 = require("./config/config");
const app = (0, express_1.default)();
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
// initialize redis database
redis_client_1.default.getInstance().getClient();
app.use("/", (req, res, next) => {
    console.log(req.url, req.originalUrl);
    next();
});
app.use(public_1.default);
app.use(isAuth_1.default);
app.use("/", (req, res, next) => {
    return res.send("SitaRam");
});
mongoose_1.default
    .connect(`mongodb://${config_1.MONGO_USER}:${config_1.MONGO_PASSWORD}@${config_1.MONGO_HOST}:${config_1.MONGO_PORT}/membly-mongo-database?authSource=admin`)
    .then(() => {
    console.log("Connected to mongodb database...");
    const port = process.env.PORT;
    app.listen(port, () => {
        (0, console_1.log)(`Server is listening on port ${port} ...`);
    });
})
    .catch((error) => console.log(error));
