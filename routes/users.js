const express = require("express");
const router = new express.Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const ExpressError = require("../expressError");
const bcrypt = require("bcryptjs");
const { ensureCorrectUser, ensureLoggedIn, authenticateJWT } = require("../middleware/auth");

/** GET / - get list of users.
 *
 * => {users: [{username, first_name, last_name, phone}, ...]}
 *
 **/

router.get("/", ensureLoggedIn , async function (req, res, next) {
    try {
        const users = await User.all();
        if (!users) {
            throw new ExpressError("No users found", 404);
        }
        return res.json({ users });
    } catch (err) {
        return next(err);
    }
});

/** GET /:username - get detail of users.
 *
 * => {user: {username, first_name, last_name, phone, join_at, last_login_at}}
 *
 **/

router.get("/:username", ensureCorrectUser, async function (req, res, next) {
    try {
        const user = await User.get(req.params.username);
        if (!user) {
            throw new ExpressError("No such user", 404);
        }
        return res.json({ user });
    } catch (err) {
        return next(err);
    }
});

/** GET /:username/to - get messages to user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 from_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/
router.get("/:username/to", ensureCorrectUser, async function (req, res, next) {
    try {
        const messages = await User.messagesTo(req.params.username);
        if (!messages) {
            throw new ExpressError("No messages found", 404);
        }
        return res.json({ messages });
    } catch (err) {
        return next(err);
    }
})

/** GET /:username/from - get messages from user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 to_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/

router.get("/:username/from", ensureCorrectUser, async function (req, res, next) {
    try {
        const messages = await User.messagesFrom(req.params.username);
        if (!messages) {
            throw new ExpressError("No messages found", 404);
        }
        return res.json({ messages });
    } catch (err) {
        return next(err);
    }
})

module.exports = router