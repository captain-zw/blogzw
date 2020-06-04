let commentArea = document.getElementById('comment');
let hidden = document.getElementById('hidden');
let commentBtn = document.getElementById('commentBtn');
let discussList = document.querySelector('.discuss_list');
let disAmount = document.querySelector('.disAmount');
let previous = document.querySelector('.previous');
let next = document.querySelector('.next');
let commentDetail = document.querySelector('.comment_detail');

commentBtn.onclick = function () {
    ajax({
        url:'/comment',
        type:'post',
        data:{
            //评论的数据
            comment:commentArea.value,
            //当前这篇文章的id
            contentId:hidden.value,
        },
        success(msg){

            if(JSON.parse(msg).code === 1){
                alert(JSON.parse(msg).message);
                return
            }

             //清空文本域
            commentArea.value = '';
             //获取评论
             comments = JSON.parse(msg).reverse();
             renderComment(comments,page,limit);
        }
    })
};

//一旦加载自动获取评论
ajax({
    url:'/comment',
    type:'get',
    data:{
        //当前这篇文章的id
        contentId:hidden.value,
    },
    success(msg){
        comments = JSON.parse(msg).reverse();
        renderComment(comments,page,limit);
    }
})

//当前页数
let page = 1;
//每页显示的数据量
let limit = 2;

//存储评论
let commemt = [];

//点击下一页
next.onclick = function () {
    page++;
    renderComment(comments,page,limit)
}

//点击上一页
previous.onclick = function () {
    page--;
    renderComment(comments,page,limit)
}
//显示评论
function renderComment(comments,page,limit) {
    // console.log(comments)
    let html = '';

    //存储最大页码
    let pageMax = Math.ceil(comments.length/limit);
    //限制页码
    page = Math.min(page,pageMax)
    page = Math.max(page,1)


    //设置每页起点
    let start = (page-1)*limit;

    //设置每页终点
    let end = Math.min(start + limit,comments.length);
    for(let i = start;i<end;i++){
        html+= `
        <li>
            <p class="discuss_user"><span>${comments[i].author}</span><i>发表于 ${new Date(comments[i].time).toLocaleString()}</i></p>
            <div class="discuss_userMain">
                ${comments[i].comment}
            </div>
        </li>
        `
    }

    discussList.innerHTML = html;
    disAmount.innerText = comments.length;

    if(comments.length){
        commentDetail.innerText = page + '/' + pageMax
    }
        commentDetail.innerText = '0/0'

}