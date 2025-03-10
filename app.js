import cors from "cors";
import cookieParser from "cookie-parser";
import express from "express";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(cookieParser())

import userRouter from "./routes/user.routes.js"

// app.post("/api/v1/users/register", (req, res) => {
//     console.log("Recieved data:", req.body);
//     res.json({message: "data recieved", data: req.body})
// })

app.use("/api/v1/users", userRouter)

export {app}