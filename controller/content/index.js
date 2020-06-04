const Content = require('../../schema/content');

exports.showIndex = function (req,res) {
    //从数据库中读取所有分类信息
    //渲染用户管理页面
    let page = +req.query.page||1;  //当前页数
    let limit = 2;  //每页显示的数据数量
    //从数据库中读取所有的用户信息

    Content.countDocuments().then((count)=>{
        //计算最大页数
        let pageMax = Math.ceil(count/limit);
        page = Math.min(pageMax,page);
        let skip = (page-1)*limit //每页跳过的数据量
        Content.find().limit(limit).skip(skip).sort({_id:-1}).populate(['category','author']).then((results)=>{
            // Model.populate('字段') 在本集合中查找指定字段
            //并且按照指定字段的ref代表的集合中进行跨集合查询
            // console.log(results);
            res.render('admin/content/index',{
                userInfo:req.userInfo,
                results,
                page,
                pageMax
            });
        })
    })
}