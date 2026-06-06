import mongoose from "mongoose";
const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
    },
    email:{
        type:String,
        required:true,
    },

    password:{
        type:String,
        required:false,
        default: null,
    },
    confirmPassword:{
        type:String
    }
},{
    timestamps:true});
const User=mongoose.model('User',userSchema);
export default User;