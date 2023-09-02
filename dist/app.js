"use strict";
// Dada Ki Jay Ho
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const console_1 = require("console");
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const isAuth_1 = __importDefault(require("./middlewares/isAuth"));
const redis_client_1 = __importDefault(require("./utils/redis-client"));
const app = (0, express_1.default)();
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
// initialize redis database
redis_client_1.default.getInstance().getClient();
app.use(isAuth_1.default);
app.use("/", (req, res, next) => {
    return res.send("SitaRam");
});
const port = process.env.PORT;
app.listen(port, () => {
    (0, console_1.log)(`Server is listening on port ${port} ...`);
});
