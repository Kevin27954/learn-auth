import admin from "firebase-admin";
import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

var serviceAccount = {
    type: process.env.type,
    project_id: process.env.project_id,
    private_key_id: process.env.private_key_id,
    private_key: process.env.private_key,
    client_email: process.env.client_email,
    client_id: process.env.client_id,
    auth_uri: process.env.auth_uri,
    token_uri: process.env.token_uri,
    auth_provider_x509_cert_url: process.env.auth_provider_x509_cert_url,
    client_x509_cert_url: process.env.client_x509_cert_url,
    universe_domain: process.env.universe_domain,
};

const app = initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

export var user;

const auth = getAuth(app);

export function validateToken(req, res, next) {
    const reqHeaderAuth = req.headers.authorization;
    if(reqHeaderAuth == null) return res.sendStatus(401);
    const token = reqHeaderAuth.split(" ")[1];
    if (token == null) return res.sendStatus(401);
    auth.verifyIdToken(token, true).then((decodedToken, error) => {
        if (error) {
            console.log(error.code, error.message);
            return res.sendStatus(401);
        }
        user = decodedToken;
        console.log(user);
        next();
    });
}
