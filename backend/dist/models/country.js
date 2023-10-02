"use strict";
// Dada Ki Jay Ho
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const CountrySchema = new mongoose_1.Schema({
    countryId: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
        unique: true,
    },
}, {
    timestamps: true,
});
const Country = (0, mongoose_1.model)("Country", CountrySchema);
exports.default = Country;
