const express = require("express");
const router = new express.Router();
const User = require("../models/user");
const Message = require("../models/message");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const ExpressError = require("../expressError");
const bcrypt = require("bcryptjs");
const { ensureCorrectUser, ensureLoggedIn, authenticateJWT } = require("../middleware/auth");

/** GET /:id - get detail of message.
 *
 * => {message: {id,
 *               body,
 *               sent_at,
 *               read_at,
 *               from_user: {username, first_name, last_name, phone},
 *               to_user: {username, first_name, last_name, phone}}
 *
 * Make sure that the currently-logged-in users is either the to or from user.
 *
 **/
router.get("/:id", ensureCorrectUser, async function (req, res, next) {
    try {
        const result = await Message.get(req.params.id);
        if (!result) {
            throw new ExpressError("No such message", 404);
        }
        return res.json({ message: result });
    } catch (err) {
        return next(err);
    }
});

/** POST / - post message.
 *
 * {to_username, body} =>
 *   {message: {id, from_username, to_username, body, sent_at}}
 *
 **/

router.post("/", ensureCorrectUser, async function (req, res, next) {
    try {
        const result = await Message.create(req.body);
        if (!result) {
            throw new ExpressError("No such user", 404);
        }
        return res.json({ message: result });
    } catch (err) {
        return next(err);
    }
});

/** POST/:id/read - mark message as read:
 *
 *  => {message: {id, read_at}}
 *
 * Make sure that the only the intended recipient can mark as read.
 *
 **/

router.post("/:id/read", ensureCorrectUser, async function (req, res, next) {
    try {
        const result = await Message.markRead(req.params.id);
        if (!result) {
            throw new ExpressError("No such message", 404);
        }
        return res.json({ message: result });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;