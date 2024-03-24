const mongoose = require("mongoose");

const UserSchema =  mongoose.Schema({
    
    username:{type:String, required:true, unique:true},
    password:{type:String,required:true},
    cartitems:[{
        product:{type:mongoose.Schema.Types.ObjectId,ref:"product"},
        quantity:{type:Number,default:1},
        size:{type:String,default:'L'}

    }]
})

 const UserModel = mongoose.model("users",UserSchema);

 module.exports=UserModel;