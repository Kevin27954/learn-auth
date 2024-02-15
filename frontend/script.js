const username = document.getElementById("username");
const password = document.getElementById("password");
const submitBtnFB = document.getElementById("submit-btn-fb");
const submitBtnA0 = document.getElementById("submit-btn-a0");
const submitBtnPA = document.getElementById("submit-btn-pa");
const btnAuthPA = document.getElementById("auth-pa");
const btnRefreshPA = document.getElementById("refresh-pa");
const authStatusDiv = document.getElementById("auth-status");

let server = "http://localhost:3000";
let ownAuthToken;
let ownRefreshToken;

function updateAuthStatusDiv(status, user) {
    console.log(status);
    authStatusDiv.className = status ? "is-authed" : "not-authed";
    authStatusDiv.textContent = status
        ? "is-authed " + user.username + " " + user.password + " " + user.iat
        : "not-authed";
}

submitBtnPA.addEventListener("click", async (e) => {
    e.preventDefault();
    let response;
    if (ownRefreshToken) {
        console.log("refresh")
        response = await fetch(`${server}/ownauth/refresh`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept-type": "application/json",
            },
            body: JSON.stringify({ refresh: ownRefreshToken }),
        });
        if (response.ok) {
            let token = await response.json();
            console.log(token.accessToken);
            ownAuthToken = token.accessToken;
        }
    } else {
        console.log("login")
        response = await fetch(`${server}/ownauth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept-type": "application/json",
            },
            body: JSON.stringify({
                user: {
                    username: username.value,
                    password: password.value,
                },
            }),
        });
        let token = await response.json();
        ownAuthToken = token.accessToken;
        ownRefreshToken = token.refreshToken;
    }

    updateAuthStatusDiv(response.ok, {
        username: username.value,
        password: password.value,
    });
    console.log("own auth: ", ownAuthToken);
    console.log("own refresh: ", ownRefreshToken);
});

btnAuthPA.addEventListener("click", async (e) => {
    let response = await fetch(`${server}/ownauth/user`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Accept-type": "application/json",
            authorization: `Bearer ${ownAuthToken}`,
        },
    });
    let userProfile;
    if (response.ok) userProfile = await response.json();
    updateAuthStatusDiv(response.ok, userProfile);
    console.log("token: ", userProfile);
});

btnRefreshPA.addEventListener("click", async () => {
    let response = await fetch(`${server}/ownauth/refresh`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept-type": "application/json",
        },
        body: JSON.stringify({ refresh: ownRefreshToken }),
    });

    if (response.ok) {
        let token = await response.json();
        console.log(token.accessToken);
        ownAuthToken = token.accessToken;
    }
});

submitBtnFB.addEventListener("click", (e) => {
    e.preventDefault();
});

submitBtnA0.addEventListener("click", (e) => {
    e.preventDefault();
});
