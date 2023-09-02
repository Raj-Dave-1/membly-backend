"use strict";
// Dada Ki Jay Ho
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const console_1 = require("console");
const express_1 = __importDefault(require("express"));
const isAuth_1 = __importDefault(require("./middlewares/isAuth"));
const app = (0, express_1.default)();
app.use(isAuth_1.default);
app.use("/", (req, res, next) => {
    return res.send("SitaRam");
});
const port = process.env.PORT || 3000;
app.listen(port, () => {
    (0, console_1.log)(`Server is listening on port ${port} ...`);
});
