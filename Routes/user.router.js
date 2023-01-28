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



userRouter.get("/getProfile", async (req,res)=>{
  // console.log(req.headers.token)
  let token = req.headers.token;

  try{
     var decoded = jwt.verify(token, "annoy");
    //  console.log(decoded)
     let {UserId} = decoded;

     let userDetails = await UserModel.findOne({UserId})
    //  console.log(userDetails)
     res.send({res:{
      "name" : userDetails.name,
      "email" : userDetails.email
     }})
  }

  catch(err){
     res.send({ res: "Something went wrong somewhere" });
     console.log(err);

  }



});



userRouter.get("/calculateBMI", async(req,res)=>{
  let {height,weight} = req.body;
    let token = req.headers.token;
  // console.log(req.body)

  try{
    let heightInMeter = height/3
    heightInMeter = heightInMeter.toFixed(2)
    // console.log( "Height :", heightInMeter)
    let bmi = weight / heightInMeter;
    bmi = bmi.toFixed(2)
      // console.log( "bmi :", bmi);

     let decoded = jwt.verify(token, "annoy");
    //  console.log(decoded)
     let {UserId} = decoded;

     let userDetails = await UserModel.findOne({UserId})
     let { bmiHistory } = userDetails;
     let data = {height,weight,bmi}
      bmiHistory.push(data)
        // console.log(userDetails);

        await UserModel.findByIdAndUpdate({_id:UserId},userDetails);
         res.status(200).send({ res : bmi});

  }
  catch(err){
    res.send({ res: "Something went wrong somewhere" });
    console.log(err);

  }


} );




userRouter.get("/getCalculation", async(req,res)=>{
      let token = req.headers.token;

  try{
    let decoded = jwt.verify(token, "annoy");
    let { UserId } = decoded;

    let userDetails = await UserModel.findOne({ UserId });
    console.log(userDetails);
    res.send({bmiHistory:  userDetails.bmiHistory})
  }
  catch(err){
       res.send({ res: "Something went wrong somewhere" });
       console.log(err);


  }


} );






module.exports = userRouter;
