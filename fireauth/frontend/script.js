import { initializeApp } from "firebase/app";
import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
} from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCkop0ZbzkfoDULPZNwlmwH1DLsHFwh43w",
    authDomain: "learn-auth-f32e5.firebaseapp.com",
    projectId: "learn-auth-f32e5",
    storageBucket: "learn-auth-f32e5.appspot.com",
    messagingSenderId: "937430501861",
    appId: "1:937430501861:web:8e1677e3865a42a3dd870c",
    measurementId: "G-VFGVFNNT03",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

var stsTokenManager;
var server = "http://localhost:3000";

// DOM Manipulation
const username = document.getElementById("username");
const password = document.getElementById("password");
const btnSubmitRegister = document.getElementById("submit-btn-fb-register");
const btnSubmitLogin = document.getElementById("submit-btn-fb-login");
const btnAuthFB = document.getElementById("auth-fb");
const authStatusDiv = document.getElementById("auth-status");
const btnLogout = document.getElementById("btn-logout");
const tokenDisplay = document.getElementById("own-token");
const btnFetchServer = document.getElementById("fetch-server");

function handleRegister() {
    createUserWithEmailAndPassword(auth, username.value, password.value)
        .then((userCredential) => {
            var user = userCredential.user;
            stsTokenManager = user.stsTokenManager;
            modifyTokenDisplay();
            modifyIsAuthDiv(true, user.uid);
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorCode, errorMessage);
            modifyIsAuthDiv(false);
        });
}

function handleLogin() {
    signInWithEmailAndPassword(auth, username.value, password.value)
        .then((userCredential) => {
            var user = userCredential.user;
            stsTokenManager = user.stsTokenManager;
            modifyTokenDisplay();
            modifyIsAuthDiv(true, user.uid);
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorCode, errorMessage);
            modifyIsAuthDiv(false);
        });
}

function handleLogout() {
    auth.signOut()
        .then(() => {
            console.log("Successfully signed out");
            modifyIsAuthDiv(false);
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorCode, errorMessage);
        });
}

function getUserInfo() {
    let timeLeftMS = modifyTokenDisplay();

    timeLeftMS > 0
        ? modifyIsAuthDiv(true, auth.currentUser.uid)
        : modifyIsAuthDiv(false);
}

function modifyTokenDisplay() {
    let expirationTime = auth.currentUser?.stsTokenManager.expirationTime;
    let expirationTimeDate = new Date(expirationTime);

    let currDate = new Date();

    let timeLeftMS = expirationTimeDate.getTime() - currDate.getTime();
    let timeLeftFormatted =
        timeLeftMS > 0 ? msToTime(timeLeftMS) : "0:00:00.000";

    tokenDisplay.textContent = `Token Expire In: ${timeLeftFormatted}`;

    return timeLeftMS;
}

function msToTime(s) {
    var ms = s % 1000;
    s = (s - ms) / 1000;
    var secs = s % 60;
    s = (s - secs) / 60;
    var mins = s % 60;
    var hrs = (s - mins) / 60;

    return hrs + ":" + mins + ":" + secs + "." + ms;
}

function modifyIsAuthDiv(trueOrFalse, uid) {
    authStatusDiv.className = trueOrFalse ? "is-authed" : "not-authed";
    authStatusDiv.innerHTML = trueOrFalse ? `is-Authed<br>${uid}` : "";
}

async function testBackend() {
    let accessToken = await auth.currentUser.getIdToken();

    fetch(`${server}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Accept-type": "application/json",
            authorization: `Bearer ${accessToken}`,
        },
    })
        .then((res) => {
            if (!res.ok) {
                throw new Error("Network response was not ok");
            }
            return res.json();
        })
        .then((resData) => {
            let data = JSON.parse(resData);
            console.log(data);
        })
        .catch((error) => console.log(error));
}

btnSubmitRegister.addEventListener("click", (e) => {
    e.preventDefault();
    handleRegister();
});

btnSubmitLogin.addEventListener("click", (e) => {
    e.preventDefault();
    handleLogin();
});

btnLogout.addEventListener("click", () => {
    handleLogout();
});

btnAuthFB.addEventListener("click", () => {
    console.log("Current User:", auth.currentUser);
    getUserInfo();
});

btnFetchServer.addEventListener("click", () => {
    testBackend();
});

