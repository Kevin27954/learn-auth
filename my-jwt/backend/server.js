import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import bodyParser from 'body-parser';

import fbAuthRouter from './routes/fb-auth.js';
import jwtAuthRouter from './routes/jwtauth.js';
import auth0Router from './routes/auth0.js';

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors({
    'origin': '*',
}));

app.use('/auth0', auth0Router);
app.use('/fbauth', fbAuthRouter);
app.use('/ownauth', jwtAuthRouter);

app.get('/', (req, res) => {
    res.send('Backend Auth server');
})

app.listen(port, () => {
    console.log("Server listening on http://localhost:3000");
})