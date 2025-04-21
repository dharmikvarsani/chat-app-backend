import express from "express"
import dotenv from 'dotenv'
import authRoutes from './routes/auth.js'
import messageRoutes from './routes/message-route.js'
import { connectDB } from "./lib/db.js";
import cookieParser from 'cookie-parser'
import cors from 'cors';
import { app ,server } from "./lib/socket.js";

dotenv.config();
app.use(express.json({limit:'10mb'}))
app.use(cookieParser())
app.use(cors({
    origin:process.env.CORS_ORIGIN_PORT,  
    credentials: true                 
  }));

app.use("/api/auth", authRoutes)
app.use("/api/messages", messageRoutes)



const PORT = process.env.PORT;
server.listen(PORT, () => {
    // console.log(`Your Server Is Running On http://localhost:${PORT}`)
    connectDB()
})


