import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import Jwt from "jsonwebtoken";
const userSchema = new Schema({
    username: {
        type: String,
        unique: true,
        trim: true,
        require: true
    },
    password: {
        type: String,
        require: true
    }
}, { timestamps: true });
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    const hashPassword = await bcrypt.hash(this.password, 10);
    this.password = hashPassword;
    return next();
});
userSchema.methods.verifyPassword = async function (password) {
    return await bcrypt.compare(this.password, password);
};
const secret = process.env.SECRET_KEY;
console.log(secret);
userSchema.methods.generateAccessToken = async function () {
    return Jwt.sign({ username: this.username, userId: this._id }, secret, { expiresIn: "1D" });
};
export const user = mongoose.model("user", userSchema);
