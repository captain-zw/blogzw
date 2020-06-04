const Content = require('../../schema/content');
const Category = require('../../schema/category');


//展示添加内容的页面
exports.showAdd = function (req,res) {

    //获取数据库中所有分类的信息
    Category.find().then((results)=>{
        res.render('admin/content/add',{
            userInfo:req.userInfo,
            results,
        });
    })
}

//接受添加内容的数据
exports.add = function (req,res) {
    // console.log(req.body)
   let {category,title,description,content}=req.body
    if(title==''){
        res.render('admin/error',{
            userInfo:req.userInfo,
            optionMessage:{
                location:'内容首页',
                option:'内容添加',
                message:'内容标题不能为空'
            },
        })
        return
    }
    if(description==''){
        res.render('admin/error',{
            userInfo:req.userInfo,
            optionMessage:{
                location:'内容首页',
                option:'内容添加',
                message:'内容简介不能为空'
            },
        })
        return
    }

    if(content==''){
        res.render('admin/error',{
            userInfo:req.userInfo,
            optionMessage:{
                location:'内容首页',
                option:'内容添加',
                message:'内容主体不能为空'
            },
        })
        return
    }

    //从数据库中查询有没有重复标题
    // 如果重复 则不添加内容
    //如果不存在该标题  则添加该标题

    Content.findOne({title}).then((result)=>{
        if(result){//如果没有找到该标题
            res.render('admin/error',{
                userInfo:req.userInfo,
                optionMessage:{
                    location:'内容首页',
                    option:'内容添加',
                    message:'该标题已存在，不可添加重复标题'
                },
            })
            return
        }

        new Content({
            title,
            description,
            content,
            category,
            author:req.userInfo.id,//保存用户id
        }).save().then(()=>{
            res.render('admin/success',{
                userInfo:req.userInfo,
                optionMessage:{
                    location:'内容首页',
                    option:'内容添加',
                    message:'这篇文章已成功添加',
                    href:'返回内容首页'
                },
                url:'/admin/content'
            })
        })

    })


}
