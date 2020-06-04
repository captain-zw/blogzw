const Category = require('../../schema/category');

//展示删除分类的页面
exports.showDelete = function (req,res) {
    //获取删除的名字
    let category = req.query.category
    // console.log('update')
    res.render('admin/category/delete',{
        userInfo:req.userInfo,
        category
    });
}


//接收删除分类的数据
exports.delete = function (req,res) {
    //获取删除的名字
    let category = req.query.category
    // console.log('update')
    // res.render('admin/category/delete',{
    //     userInfo:req.userInfo,
    //     category
    // });
    if(req.body.category==''){
        res.render('admin/error',{
            userInfo:req.userInfo,
            optionMessage:{
                location:'分类首页',
                option:'分类删除',
                message:'分类名称不能为空'
            }
        })
        return
    }


    //从数据库中删除指定分类
    Category.deleteOne({
        name:category
    }).then((result)=>{
        if(!result.deletedCount){//如果删除数量为0，则分类不存在数据库中
            res.render('admin/error',{
                userInfo:req.userInfo,
                optionMessage:{
                    location:'分类首页',
                    option:'分类删除',
                    message:'当前分类不存在，不可删除'
                }
            })
            return
        }
        res.render('admin/success',{
            userInfo:req.userInfo,
            optionMessage:{
                location:'分类首页',
                option:'分类删除',
                message:'分类删除成功',
                href:'返回分类首页'
            },
            url:'/admin/category'
        })
    })
}