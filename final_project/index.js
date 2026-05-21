const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer", session({ secret: "fingerprint_customer", resave: true, saveUninitialized: true }))

app.use("/customer/auth/*", function auth(req, res, next) {
    // Check if the user has an active session and an authorization token stored
    if (req.session && req.session.authorization) {
        const token = req.session.authorization['accessToken']; // Access token from session

        // Verify the JWT token
        jwt.verify(token, "access", (err, user) => {
            if (!err) {
                req.user = user; // Store the decoded user payload in the request object
                next(); // User is authenticated, proceed to the next route handler
            } else {
                return res.status(403).json({ message: "User not authenticated. Invalid or expired token." });
            }
        });
    } else {
        return res.status(403).json({ message: "User not logged in. Please sign in to access this resource." });
    }
});
 
const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));
