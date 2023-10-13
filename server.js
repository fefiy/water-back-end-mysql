const express = require('express')
const cors = require('cors')
const helmet = require("helmet")
const cookieParser = require("cookie-parser")
require('dotenv').config();
const app = express()
app.use(express.json());
app.use(cookieParser()) 
app.use(helmet())
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Credentials", true);
    next();
  });
  app.use(
    cors({
      origin:true,
    })
  );

 // Use the appropriate digital pin number

  // Define API endpoint to control the solenoid valve
  
//  import routes//
const authRouter = require("./routes/auth")
const userRouter = require("./routes/user")
const waterRouter = require("./routes/water")
const payRouter = require("./routes/pay")

app.use("/api", authRouter)
app.use("/api", userRouter)
app.use("/api", waterRouter)
app.use("/api", payRouter)
// 
app.listen(3004 , ()=>{
    console.log("app is connected on 3004")
})