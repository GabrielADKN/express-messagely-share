const express = require("express");
const router = new express.Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const ExpressError = require("../expressError");
const bcrypt = require("bcryptjs");
const { ensureCorrectUser, ensureLoggedIn, authenticateJWT } = require("../middleware/auth");

/** POST /login - login: {username, password} => {token}
 *
 * Make sure to update their last-login!
 *
 **/

router.post("/login", async function (req, res, next) {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            throw new ExpressError("Missing username or password", 400);
        }
        const user = await User.authenticate(username, password);
        if (!user) {
            throw new ExpressError("Invalid username or password", 400);
        }
        await User.updateLoginTimestamp(username);
        const token = jwt.sign({ username }, SECRET_KEY);
        return res.json({ token });
    } catch (err) {
        return next(err);
    }
});


/** POST /register - register user: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 *
 *  Make sure to update their last-login!
 */

router.post("/register", async function (req, res, next) {
    try {
        const { username, password, first_name, last_name, phone } = req.body;
        if (!username || !password || !first_name || !last_name || !phone) {
            throw new ExpressError("Missing required field", 400);
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = await User.register({ username, password: hashedPassword, first_name, last_name, phone });
        if (!user) {
            throw new ExpressError("Invalid username or password", 400);
        }
        await User.updateLoginTimestamp(username);
        const token = jwt.sign({ username }, SECRET_KEY);
        return res.json({ token });
    } catch (err) {
        return next(err);
    }
})

module.exports = router;