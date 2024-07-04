import express from "express";
import dotenv from "dotenv"
import cors from "cors";


const app = express();

dotenv.config()
app.use(cors({
    origin:"*",
    credentials:true
}))



app.get('/',(req,res)=>{
   res.json({
    status:200,
    message:"server connected"
   })
})

app.listen(process.env.PORT,()=>{
  console.log("connected on port ", process.env.PORT)
})


