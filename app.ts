// Dada Ki Jay Ho

import { log } from "console";
import express from "express";
import isAuth from "./middlewares/isAuth";

const app = express();

app.use(isAuth);

app.use("/", (req, res, next) => {
    return res.send("SitaRam");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    log(`Server is listening on port ${port} ...`);
});
