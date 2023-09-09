"use strict";
// Dada Ki Jay Ho
Object.defineProperty(exports, "__esModule", { value: true });
const enums_1 = require("../constants/enums");
exports.default = (req, res, next) => {
    if (req.headers.userType != enums_1.EUserType.admin) {
        return res.status(401).send({
            status: "fail",
            message: "You are Unauthorized to access this resource",
        });
    }
    if (req.headers.userType === enums_1.EUserType.admin) {
        next();
    }
};
