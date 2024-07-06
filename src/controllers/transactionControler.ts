import mongoose from "mongoose";
import { Transaction } from "../model/transactionModel.js";
import { Apiresponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { user } from "../model/userModel.js";


export const createNewTransaction =  asyncHandler(async(req,res)=>{
     
    const {type , amount , asset , price} = req.body;
    console.log(asset ,price)
    const userid = req.user;

    console.log(userid,"user")
    
    try {
    
        if(!type || !amount){
            console.error("all feild are required ")
           return  res.status(400).json("all feild are required");
        }

        if ((type === "buy" || type === "sell") && (!asset || !price || asset.trim() === "" )) {
            console.error("All fields are required for buy/sell transactions");
            return res.status(400).json("All fields are required for buy/sell transactions");
          }
         
        const getuser = await user.findById(userid);
 

        
         
        if(!getuser){
         return   res.status(401).json("unauthorized user");
            console.error("unauthorized user")
        }

        
        const newTransaction = await new Transaction({type , amount , asset , price , user :userid })
        
        console.log(newTransaction,"new")

       await  newTransaction.save();

      return  res.status(200).json(new Apiresponse(200 , newTransaction , "success"))
        
    } catch (error:any) {
        console.error(error)
    }

})


export const getPortfolio = asyncHandler(async(req,res)=>{
   console.log("all")
    try {
      const userId = req.user;

     //get all user transactions
      const allTransactions = await Transaction.find({user:userId})

     

      // create response portfolio
      
      const portfolio = {
        totalValue: 0, // Total money the user has
        profitLoss: 0, // Profit or loss the user has made
        assetAllocation: {}, // How the user's money is distributed among different assets
      };

      //demo assets

      const currentPrices = {
        AAPL: 150, 
        TSLA: 650, 
        GOOG: 2800,
        GTl: 200,
        TFL: 3000,
      };


      // for store assets

      const assetQuantities = {};

      allTransactions.forEach((transaction)=>{

        const { type, amount, asset, price } = transaction;

        if (type === 'deposit') {
          // Add deposited money to the total value
          portfolio.totalValue += amount;
        } else if (type === 'withdrawal') {
          // Subtract withdrawn money from the total value
          portfolio.totalValue -= amount;
        } else if (type === 'buy') {
          // Update the quantity and total spent on the asset
          if (!assetQuantities[asset]) {
            assetQuantities[asset] = { quantity: 0, totalSpent: 0 };
          }
          assetQuantities[asset].quantity += amount / price; // Increase asset quantity
          assetQuantities[asset].totalSpent += amount; // Increase total money spent on this asset
        } else if (type === 'sell') {
          // Update the quantity, total value, and profit/loss from selling the asset
          if (assetQuantities[asset]) {
            const quantitySold = amount / price;
            const costBasis = (quantitySold * assetQuantities[asset].totalSpent) / assetQuantities[asset].quantity;
            const profitFromSale = amount - costBasis;
  
            portfolio.totalValue += amount; // Add sale money to total value
            portfolio.profitLoss += profitFromSale; // Update profit/loss
  
            assetQuantities[asset].quantity -= quantitySold; // Decrease asset quantity
            assetQuantities[asset].totalSpent -= costBasis; // Decrease total money spent on this asset
          }
        }
      });
  
      // 8. Calculate the total value and asset allocation
      for (const asset in assetQuantities) {
        if (currentPrices[asset]) {
          const assetValue = assetQuantities[asset].quantity * currentPrices[asset];
          portfolio.totalValue += assetValue; // Add asset value to total value
  
          portfolio.assetAllocation[asset] = {
            value: assetValue, // Current value of the asset
            percentage: (assetValue / portfolio.totalValue) * 100, // Percentage of total value
          };
        }
      }
  
      // 9. Send the portfolio as a response
     return  res.json(portfolio);

    } catch (error) {
        console.error(error , "error")
        res.status(500).json(error)
    }

})



export const alltransaction = asyncHandler(async(req,res)=>{
  try {
    const userId = req.user
    const transactions = await Transaction.find({user:userId});
    res.status(200).json(transactions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
})