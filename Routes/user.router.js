const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const UserModel = require("../Model/User.model");

const userRouter = express.Router();

userRouter.post("/signup", async (req, res) => {
  const { email, password,name } = req.body;
  const check_user = await UserModel.find({ email });

  try {
    if (check_user.length > 0) {
      res.send({ res: "user already exist please login" });
    } else {
      bcrypt.hash(password, 4, async function (err, hash) {
        const newUser = new UserModel({ name,email, password: hash });
        await newUser.save();
        res.send({ res: "Signup Successfully" });
      });
    }
  } catch (err) {
    res.send({ res: "Something went wrong somewhere" });
    console.log(err);
  }
});

userRouter.post("/login", async (req, res) => {
  let data = req.body;

  try {
    if (data.email && data.password) {
      let { email, password } = data;

      let user = await UserModel.findOne({ email });
      if (user) {
        let token = jwt.sign({ UserId: user._id }, "annoy");

        res.send({ res: "Login Successful", token });
      } else {
        res.send({ res: "Invalid Credentials" });
      }
    } else {
      res.send({ res: "Invalid Credentials" });
    }
  } catch (err) {
    res.send({ res: "Something went wrong somewhere" });
    console.log(err);
  }
});





module.exports = userRouter;
