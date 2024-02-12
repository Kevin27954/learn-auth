import { Router } from 'express';

const fbAuthRouter = Router();

fbAuthRouter.post("/login", (req, res) => {
    res.send("Logging you in");
})

export default fbAuthRouter;