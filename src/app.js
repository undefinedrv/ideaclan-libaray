const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit")


const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 500
}); 
const app = express();

app.use(cors());
app.use(express.json()); 
app.use(cookieParser());   
app.use(limiter);
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  try {
    res.send("API is Live, go to /graphql");
  } catch (error) {
    console.log("Server down, error occurred", error);
  }
});
 
module.exports = { app };
