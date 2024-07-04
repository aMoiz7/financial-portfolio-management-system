import express from "express";
import dotenv from "dotenv"
import cors from "cors";
import { dbConnection } from "./db/connection.js";
import userRouter from "./routes/userRoutes.js"


const app = express();

dotenv.config()
app.use(cors({
    origin:"*",
    credentials:true
}))

app.use(express.json());

dbConnection()

app.get('/',(req,res)=>{
   res.json({
    status:200,
    message:"server connected"
   })
})

app.use("/api/v1/user", userRouter)

app.listen(process.env.PORT,()=>{
  console.log("connected on port ", process.env.PORT)
})
