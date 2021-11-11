const express = require('express')

// 业务模块流程的控制
const controller = require('../controllers')
// 获取路由实例
const router = express.Router()

// 请求首页轮播图数据
router.get('/api/getlunbo', controller.getLunBo)

// 1.0 请求图文资讯
router.get('/api/getnewslist', controller.getNewsList)

// 2.0 根据资讯id获取资讯详细内容 动态传参 1 query获取 拼接 2 /article/:id params获取
router.get('/api/getnew/:newid', controller.getNewDetail)

// 3.0 图片分享
router.get('/api/getimages/:cateid', controller.getImages)
// 3.1 图片分享详情中的缩略图数组
router.get('/api/getthumimages/:imgid', controller.getImage)
// 3.2 获取图片分享中的图片详细介绍
router.get('/api/getimageInfo/:imgid', controller.getImageInfo)
// 3.3 图片分享分类
router.get('/api/getimgcategory', controller.getImgCategory)


// 4.0 获取评论内容
router.get('/api/getcomments/:artid', controller.getComments)
// 4.1 提交评论数据
router.post('/api/postcomment/:artid', controller.postComment)

// 5.0 获取商品列表数据
router.get('/api/getgoods', controller.getGoods)

// 6.2 获取详情页第二区域块（商品购物区 ,商品标题，价格等）和 参数区域块（商品参数）
router.get('/api/goods/getinfo/:id', controller.getGoodsInfo)

// 6.4 获取图文介绍 
router.get('/api/goods/getdesc/:id', controller.getGoodDesc)

// 6.7 获取购物车页面数据
router.get('/api/goods/getshopcarlist/:ids', controller.getShopSarList)

// 7.1获取品牌列表
router.get('/api/getprodlist', controller.getProdList);
// 7.2根据Id，删除品牌列表
router.get('/api/delproduct/:id', controller.delProduct);
// 7.3添加品牌数据
router.post('/api/addproduct', controller.addProduct)

// 8.1 获取评论列表
router.get('/api/getcmtlist', controller.getCmtList)
// 8.2 发表新评论
router.post('/api/postcmt', controller.postCmt)

// 测试 get 提交过来的数据
router.get('/api/get', (req, res) => {
  // 将 get 提交过来的数据，通过 getMsg 属性返回给客户端
  let obj = { message: 'get 请求 ok', data: req.query };
  res.end(JSON.stringify(obj));
})

router.all('/api/jsonp', (req, res) => {
	// 获取 提交过来的 callback 回调函数的名字
	let callbackFn = req.query.callback;

	// 组装数据对象，并将数据结果，序列化为 JSON 字符串
	let obj = { message: 'jsonp 请求 ok' };
	let jsonStr = JSON.stringify(obj);

	// 返回 JSONP 数据
	res.end(`${callbackFn}(${jsonStr})`);
});


// 暴露路由
module.exports = router