import express from "express";
import "dotenv/config";
import cors from "cors";
import bodyParser from "body-parser";

import { validateToken, user } from "./firebaseAuth.js";

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(
    cors({
        origin: ["http://localhost:5173"],
    })
);
app.use(validateToken);

app.get("/", (req, res) => {
    res.json(JSON.stringify(user));
});

app.listen(port, () => {
    console.log("Server listening on http://localhost:3000");
});
