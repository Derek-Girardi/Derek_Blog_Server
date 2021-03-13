const express = require("express");
const User = require("../models/users.model");
const auth = require("../middleware/auth");
const config = require("../config");
const jwt=require("jsonwebtoken");

const router = express.Router();

router.route("/:username").get(auth.authenticateToken, (req, res) => {
  User.findOne({ username: req.params.username }, (err, result) => {
    if (err) {
      return res.send(err);
    }
    return res.json({
      data: result,
      username: req.params.username,
    });
  });
});

router.route("/register").post((req, res) => {
  console.log("im inside the register");
  const user = new User({
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
  });
  req.user.save((err) => {
    if (err) {
      return res.send(err);
    }
    return res.json(user);
  }); //store into mongodb
});

router.route("/login").post((req, res) => {
  User.findOne({ username: req.body.username }, (err, result) => {
    if (err) {
      return res.send(err);
    }
    if (result === null) {
      return res.status(403).json("Username is wrong");
    }
    if (result.password === req.body.password) {
      let token = jwt.sign({ username: req.body.username }, config.key, {
        expiresIn: "24h",
      });
      res.json({ token: token });
    } else {
      res.status(403).json("password is wrong");
    }
  });
});

router.route("/update/:username").patch(auth.authenticateToken, (req, res) => {
  User.findOneAndUpdate(
    { username: req.params.username },
    { $set: { password: req.body.password } },
    (err) => {
      if (err) {
        return res.send(err);
      }
      const msg = {
        msg: "You have updated your password!",
        username: req.params.username,
      };
      return res.json(msg);
    }
  );
});

router.route("/delete/:username").delete(auth.authenticateToken, (req, res) => {
  User.findOneAndDelete({ username: req.params.username }, (err) => {
    if (err) {
      return res.send(err);
    }
    const msg = {
      msg: "username deleted",
      username: req.params.username,
    };
    return res.json(msg);
  });
});

module.exports = router;
