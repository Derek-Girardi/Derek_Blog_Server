const express = require("express");
const User = require("../models/users.model");

const router = express.Router();

router.route("/:username").get((req, res) => {
    User.findOne({ username: req.params.username },
        (err, result) => {
            if (err) return res.status(500).json({ msg: err });
            res.json({
                data: result,
                username: req.params.username,
            });
        })
});

router.route("/register").post((req, res) => {
    console.log("im inside the register");
    const user = new User({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
    });
    user
        .save() //store into mongodb
        .then(() => {
            console.log("user registered");
            res.status(200).json("ok");
        })  //if successful, send success status
        .catch((err) => {
            res.status(403).json({ msg: err })
        });
});

router.route("/login").post((req, res) => {
    User.findOne({ username: req.body.username }, (err, result) => {
        if (err) return res.status(500).json({ msg: err });
        if (result === null) {
            return res.status(403).json("Username is wrong");
        }
        if (result.password === req.body.password) {
            res.json("ok");
        }
        else {
            res.status(403).json("password is wrong");
        }
    });
});

router.route("/update/:username").patch((req, res) => {
    User.findOneAndUpdate(
        { username: req.params.username },
        { $set: { password: req.body.password } },
        (err, result) => {
            if (err) return res.status(500).json({ msg: err });
            const msg = {
                msg: "You have updated your password!",
                username: req.params.username,
            };
            return res.json(msg);
        }
    );
});

router.route("/delete/:username").delete((req, res) => {
    User.findOneAndDelete(
        { username: req.params.username }, (err, result) => {
            if (err) return res.status(500).json({ msg: err });
            const msg = {
                msg: "username deleted",
                username: req.params.username,
            };
            return res.json(msg);
        });
});

module.exports = router;