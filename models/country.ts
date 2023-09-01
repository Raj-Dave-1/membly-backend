// Dada Ki Jay Ho

import { Schema, model } from "mongoose";
import ICountry from "../interfaces/country";

const CountrySchema = new Schema<ICountry>({
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
});

const Country = model<ICountry>("Country", CountrySchema);

export default Country;
