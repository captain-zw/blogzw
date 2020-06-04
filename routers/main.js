const express = require("express");
const Category = require('../schema/category')
const Content = require('../schema/content')


const router = express.Router();


let data = {};

//处理通用的数据
router.use((req,res,next)=>{
    data.userInfo = req.userInfo;
    Category.find().then((categorys)=>{
        //从数据库中读取内容的数据
        data.categorys = categorys;
        next()
    })
})

//渲染首页
router.get("/",(req,res)=>{
    data.limit=2;
    data.page = +req.query.page||1;
    data.category = req.query.category;

    let where = {};

    //如果点击css.. 则where这个对象就存在分类信息 否则无
    if(req.query.category){
        where.category = req.query.category;
    }
    //从数据库中读取分类的数据

    Content.find(where).countDocuments().then((count)=>{
        data.count = count;
        data.pageMax = Math.ceil(data.count/data.limit);
        data.page = Math.min(data.pageMax,data.page);
        data.skip = (data.page-1)*data.limit //每页跳过的数据量
        return Content.find(where).limit(data.limit).skip(data.skip).sort({_id:-1}).populate('category');
    }).then((contents)=>{
        data.contents = contents  ;
        res.render("main/index",data);

    // Category.find().then((categorys)=>{
    //     //从数据库中读取内容的数据
    //     data.categorys = categorys
    //     return Content.find(where).countDocuments()
    // }).then((count)=>{
    //     data.count = count;
    //     data.pageMax = Math.ceil(data.count/data.limit);
    //     data.page = Math.min(data.pageMax,data.page);
    //     data.skip = (data.page-1)*data.limit //每页跳过的数据量
    //     return Content.find(where).limit(data.limit).skip(data.skip).sort({_id:-1}).populate('category');
    // }).then((contents)=>{
    //     data.contents = contents  ;
    //     res.render("main/index",data);
    })
});

//阅读全文的后台处理
router.get('/view',(req,res)=>{
    // console.log('1')
    let contentId = req.query.contentId;
    Content.findById({_id:contentId}).populate(['author','category']).then((content)=>{
       //这篇文章的阅读量++
        content.views++;
        //保存这篇文章
        content.save().then((content)=>{
            data.content = content;
            res.render('main/view',data)
        });
    })

})

//点击评论提交的后台处理
router.post('/comment',(req,res)=>{

    if(!req.userInfo){
        data.code = 1;
        data.message = '您还没有登录，请先登录';
        res.send(data);
        return
    }

    let {comment,contentId} = req.body;

    let commentData = {
        comment,
        //评论的时间
        time:new Date,
        //评论的用户名
        author:req.userInfo.username,
    }
    Content.findById(contentId).then((content)=>{
        content.comment.push(commentData)

        //保存这篇文章
        content.save().then((content)=>{
            //把评论发送给前台
            res.send(content.comment)
        })
    })
})

//当自动获取评论时的后台处理
router.get('/comment',(req,res)=>{
    let contentId = req.query.contentId;
    Content.findById(contentId).then((content)=>{
        res.send(content.comment)
    })
})

module.exports = router;