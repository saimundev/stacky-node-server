import express from "express";
import * as dotenv from 'dotenv'
import cors from "cors"
import dbConnect from "./models/db.js";
import authRouter from "./routers/authRouter.js"
import nodeRouter from "./routers/nodeRouter.js"
import profileRouter from "./routers/profileRouter.js";


//INIT APP
const app = express();

//ENV CONFIGE
dotenv.config()

//DB CONNECT
dbConnect();

//PORT
const port = process.env.PORT || 5050;

//MIDDLEWEAR
app.use(express.json());
app.use(cors());
app.use(express.static("public/upload"))

//ROUTER
app.use("/api/auth", authRouter);
app.use("/api/node", nodeRouter);
app.use("/api/profile", profileRouter);


//SERVER
app.listen(port, () => {
    console.log(`server is raning the port is ${port}`);
})