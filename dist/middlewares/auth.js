import Jwt from "jsonwebtoken";
import { user } from "../model/userModel.js";
export const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization").replace("Bearer", "");
        if (!token) {
            res.status(500).json("token not found");
            console.error("error not found");
        }
        const decodedToken = Jwt.verify(token, process.env.SECRET_KEY);
        if (!decodedToken) {
            res.status(500).json("token not verify");
            console.error("token not verify");
        }
        const verifyUser = await user.findById(decodedToken.userId);
        if (!verifyUser) {
            res.status(500).json("user not found for Auth ");
            console.error("user not found for Auth ");
        }
        req.user = verifyUser._id;
        next();
    }
    catch (error) {
        res.status(500).json(error);
        console.error("Authnetication error");
    }
};
