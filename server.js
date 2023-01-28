const express = require("express");
require("dotenv").config();
const cors = require("cors")

const connection= require("./Config/db");
const userRouter = require("./Routes/user.router");

const server = express();

server.use(cors({origin:"*"}))


server.use(express.json());

server.get("/", (req, res) => {
  res.send({ msg: "Welcome to BMI Calculator API" });
});

server.use("/user", userRouter);

server.listen(process.env.PORT, async () => {
  try {
    await connection;
    console.log("db is connected successfully");
  } catch (err) {
    console.log("db is connected");
    console.log(err);
  }

  console.log(`Server listning on http://localhost:${process.env.PORT}`);
});
