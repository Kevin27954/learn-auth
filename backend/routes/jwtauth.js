import { Router } from "express";
import jwt from "jsonwebtoken";
import "dotenv/config";

const jwtAuthRouter = Router();

let refreshTokenDB = [];

jwtAuthRouter.post("/login", (req, res) => {
    const user = req.body.user;
    const accessToken = jwt.sign(user, process.env.secret_key, {
        expiresIn: "10s",
    });
    const refreshToken = jwt.sign(user, process.env.refresh_key);
    refreshTokenDB.push(refreshToken);
    res.json({ accessToken: accessToken, refreshToken: refreshToken });
});

jwtAuthRouter.get("/user", authenticate, (req, res) => {
    res.json(req.user);
});

jwtAuthRouter.post("/refresh", (req, res) => {
    const token = req.body.refresh;
    if(token == null) return res.sendStatus(401);
    if(!refreshTokenDB.includes(token)) return res.sendStatus(403);
    
    jwt.verify(token, process.env.refresh_key, (err, user) => {
        if (err) return res.sendStatus(401);
        console.log(user);
        let accessToken = jwt.sign({username: user.username, password: user.password}, process.env.secret_key, {
            expiresIn: "10s",
        });
        res.json({ accessToken: accessToken });
    });
});

function authenticate(req, res, next) {
    const reqHeader = req.headers.authorization;
    console.log(reqHeader);
    const token = reqHeader.split(" ")[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.secret_key, (err, user) => {
        if (err) return res.sendStatus(401);
        req.user = user;
        next();
    });
}

export default jwtAuthRouter;
