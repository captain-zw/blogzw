const express = require("express");
const User = require("../schema/users");

const router = express.Router();

//统一后台返回的格式
let responseDate = {};

//注册的后台处理
router.post("/register",(req,res)=>{
    let {username,password,repassword} = req.body;

    if(username == ""){
        responseDate.code = 1;
        responseDate.message = "用户名不能为空";
        res.send(responseDate);
        return
    }

    if(password == ""){
        responseDate.code = 2;
        responseDate.message = "密码不能为空";
        res.send(responseDate);
        return
    }

    if(password != repassword){
        responseDate.code = 3;
        responseDate.message = "两次密码不一致";
        res.send(responseDate);
        return
    }

    //从数据库中查询用户名是否被注册了 如果已经被注册了则注册失败
    User.findOne({username}).then((somebody)=>{
        if(somebody){
            responseDate.code = 4;
            responseDate.message = "该用户已经注册";
            res.send(responseDate);
            return;
        }

        new User({ //保存注册的用户
            username,
            password,
        }).save().then(()=>{//返回前台信息
            responseDate.code = 0;
            responseDate.message = "注册成功";
            res.send(responseDate);
        })
    })

});

//登录的后台处理
router.post("/login",(req,res)=>{
    let {username,password} = req.body;
    if(username == ""){
        responseDate.code = 1;
        responseDate.message = "用户名不能为空";
        res.send(responseDate);
        return
    }

    if(password == ""){
        responseDate.code = 2;
        responseDate.message = "密码不能为空";
        res.send(responseDate);
        return
    }

    //从数据库中查询有没有注册过，如果注册过 登录成功
    User.findOne({
        username,
        password,
    }).then((somebody)=>{
        if(!somebody){ //如果没有注册过
            responseDate.code = 3;
            responseDate.message = "密码或用户名错误，请重新输入";
            res.send(responseDate);
            return;
        }
        responseDate.code = 0;
        responseDate.message = "登录成功";
        responseDate.userInfo = {
            id:somebody._id,
            username:somebody.username,
            isAdmin: somebody.isAdmin,
        }

        //用户每次登录成功后，就设置cookie
        res.cookie("userInfo",JSON.stringify(responseDate.userInfo),{
            maxAge:90000000,
        })
        res.send(responseDate);
    })
})

//退出的后台处理
router.get("/loginout",(req,res)=>{
    //清除cookie
    res.cookie("userInfo","");
    res.send("cookie清除了")
})

module.exports = router;