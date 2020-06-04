const mongoose = require("mongoose");

//定义用户数据格式
const userSchema = new mongoose.Schema({
    //用户名
    username:String,
    //用户密码
    password:String,

    isAdmin:{
        type:Boolean,
        default:false,
    }
})

//暴露用户模型
module.exports = mongoose.model("users",userSchema)