import mongoose, { Schema } from "mongoose";
import { number } from "zod";



const TransactionModel = new Schema({
    type:{
        type:String,
        enum:["deposit" , "withdrawal" , "buy" , "sell"],
        require:true
    },
    amount:{
        type:number,
        required:true
    },

    asset:{
        type :String,
        require: function(){
            //@ts-ignore
           return this.type === 'buy' || this.type==='sell'
        }
    },
    price:{
        type :number,
        require: function(){
             //@ts-ignore
          return   this.type=== 'buy' || this.type==='sell'
        }
    },

    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        require :true
    }

},{timestamps:true})

export const Transaction = mongoose.model("Transaction" , TransactionModel)