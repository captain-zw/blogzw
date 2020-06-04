const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

//使用body-parser 中间件解析post数据
app.use(bodyParser.urlencoded({
    extended:false,
}));

//使用cookie-parser 中间件解析cookie数据
app.use(cookieParser());

//设置模板引擎ejs
app.set("view engine","ejs");
/*
* 根据不同模板  划分不同路由
*
*
*
* */

app.use((req,res,next)=>{
    if(req.cookies.userInfo){//用户已登录
        req.userInfo = JSON.parse(req.cookies.userInfo);
    }
    next();
});

//处理后台的服务
app.use("/admin",require("./routers/admin"));

//处理首页的服务
app.use("/",require("./routers/main"));

//处理注册登录的服务
app.use("/api",require("./routers/api"));

//为pulic目录下的所有文件自动设置路由
app.use(express.static("public"));


mongoose.connect("mongodb://localhost:27017/blogzw",{useNewUrlParser:true},(err)=>{
    if(err){
        console.log("链接数据库失败~~!");
        return;
    }
    console.log("链接数据库成功~~!");
    app.listen(80)
})

