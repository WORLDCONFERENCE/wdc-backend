const express = require("express");
const userSchema = require("../models/UserSchema");
const bcrypt = require("bcrypt");
const CreateError = require("../utils/CreateError");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const path = require("path");

const router = express.Router();

router.post("/register", async (req, res, next) => {
  try {
    const username = req.body.email.slice(0, 4);
    const age = req.body.age.slice(8, 10) + req.body.age.slice(5, 7);

    const passwordss = username + "@" + age;


    console.log("passwords", passwordss);

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(passwordss, salt);

    req.body.password = username;

    const Users = new userSchema({
      ...req.body,
      password: hash
    });

    const savedUser = await Users.save();

    // const emails={email:req.body.email}
    // const update = { $set: {
    //   ...req.body,
    //   password: hash,
    // }};
    // const options = {upsert: true};
    // const savedUser=await userSchema.updateOne(emails, update, options)


    console.log(savedUser);

    res.status(200).json(savedUser);
  } catch (err) {
    next(err);
    console.log(err);
  }
});


router.post("/login", async (req, res, next) => {
  try {
    const user = await userSchema.findOne({ email: req.body.email });

    console.log(user.email);

    if (!user) {
      return next(CreateError("401", "User not found"));
    }

    const passwords = await bcrypt.compare(req.body.password, user.password);

    if (!passwords) {
      return next(CreateError("401", "Password is not corrected"));
    }

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.SECRET_KEY,
      { expiresIn: "5d" }
    );

    const { password, isAdmin, ...othersDetail } = user._doc;

    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json({ details: { ...othersDetail }, isAdmin });
  } catch (err) {
    next(err);
  }
});

router.post("/adminlogin", async (req, res, next) => {
  try {
    const user = await userSchema.findOne({ email: req.body.email });

    console.log(user.email);

    if (!user) {
      return next(CreateError("401", "User not found"));
    }

    if (!user.isAdmin) {
      return next(CreateError("401", "Only admin can allowed"))
    }

    const passwords = await bcrypt.compare(req.body.password, user.password);

    if (!passwords) {
      return next(CreateError("401", "Password is not corrected"));
    }

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.SECRET_KEY,
      { expiresIn: "5d" }
    );

    const { password, isAdmin, ...othersDetail } = user._doc;

    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json({ details: { ...othersDetail }, isAdmin });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
