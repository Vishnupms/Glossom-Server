import mongoose from "mongoose";
const adminSchema =new mongoose.Schema({
    username : {
        type :String,
        required : true
    },
    email : {
        type :String,
        require :true,
    },
    password :{
        type :String,
        require :true,
    },
})
    export default mongoose.model('adminData',adminSchema)