// Dada Ki Jay Ho

import { log } from "console";
import express from "express";

const app = express();

app.use("/", (req, res, next) => {
    return res.send("SitaRam");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    log(`Server is listening on port${port} ...`);
});
