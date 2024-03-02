import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";


const app = express ()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    Credentials:true
}))

app.use(express.json({limit:"50kb"}));
app.use(express.urlencoded({extended:true, limit:"50kb"}))

app.use(express.static("public"))
app.use(cookieParser())

// Routes Import

import userRouter from './routes/User.routes.js'

//routes declaration
app.use("/api/v1/users", userRouter)
// https://localhost:3001/api/v1/users/register

export {app}