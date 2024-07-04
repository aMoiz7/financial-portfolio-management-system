import mongoose, { ObjectId } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { user } from "../model/userModel.js";
import { Apiresponse } from "../utils/apiResponse.js";



export const signUp = asyncHandler(async(req,res)=>{
   
    const {username  , password} =req.body
    console.log( username  , password, "body")
   

    if([username,password].some((val)=>val.trim()==="")){
    throw console.error("all feilds are required");
    
    }

    const checkuser = await user.findOne({username});

    if(checkuser){
     console.error("user already Exist")
     res.json({status :401 , message :"username already exist "})
    }

    const newuser = await user.create({
        username ,
        password
    })

    if(!newuser){
        console.error(" user not created  ")
     res.json({status :401 , message :" user not created  "})
    }

    res.json(new Apiresponse(200 , newuser , "success"));

}) 

 const generateaccessToken = async(id:mongoose.Types.ObjectId)=>{
    if(!id)  console.error("400 user id not found ");
      const finduser =  await user.findById(id);

      if(!finduser) {
        console.error("user not found in generating token")
      }
     
      //@ts-ignore
      const accessToken =  finduser!.generateAccessToken()
     

      if(!accessToken) {console.error(" accesstoken generating failed ")}

      return accessToken
 }


export const signIn = asyncHandler(async(req,res)=>{
   const {username , password} = req.body

   if([username , password].some((val)=>val.trim()==="")){
      res.json({status:400 , message :"all feilds are required"});
     console.error("all feild are required");
   }

   const getuser = await user.findOne({username});

   if(!getuser){
    res.json({status:400 , message :"not not found"});
    console.error("user not found");
   }
     
    //@ts-ignore
    const checkpassword =  getuser!.verifyPassword(password)
    
    if(!checkpassword){
        res.json({status:400 , message :"password not correct"});
    console.error("password not correct");
    }
     const userid = getuser!._id
    const accessToken = await generateaccessToken(userid)

    if(!accessToken) {
        res.json({status:400 , message :"accesstoken not  defind"});
        console.error("accesstoken not defind");
    }

     console.log(accessToken)
    const option = {
        httpOnly:true,
        secure :true
    }



    res.status(200).cookie("accessToken" , accessToken ,option).json(new Apiresponse(200 , accessToken , "success"))

})