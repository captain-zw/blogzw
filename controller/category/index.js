const Category = require('../../schema/category');
exports.showIndex = function (req,res) {
    //从数据库中读取所有分类信息
    //渲染用户管理页面
        let page = +req.query.page||1;  //当前页数
        let limit = 2;  //每页显示的数据数量
        //从数据库中读取所有的用户信息

        Category.countDocuments().then((count)=>{
            //计算最大页数
            let pageMax = Math.ceil(count/limit);
            page = Math.min(pageMax,page);
            let skip = (page-1)*limit //每页跳过的数据量
            Category.find().limit(limit).skip(skip).sort({_id:-1}).then((results)=>{
                // console.log(results);
                res.render('admin/category/index',{
                    userInfo:req.userInfo,
                    results,
                    page,
                    pageMax
                });
            })
        })
    // res.send("hh")
}