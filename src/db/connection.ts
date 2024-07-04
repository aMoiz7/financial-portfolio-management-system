import mongoose from "mongoose"


export const dbConnection =async()=>{
 try {
     const connection = await mongoose.connect(process.env.DB_URI || "")
     
       console.log("db connected successfully" , connection.connection.host)
     
     
 } catch (error) {
    console.error(error , "error in db connection")
 }
}