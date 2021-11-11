
const MsgResult = require('./msgResult')
const promiseFifty = require('../utils/promiseFifty')

// 部分资源域名
const domain = 'https://img0.baidu.com'

const successState = 0, // 表示成功
      failState = 1; // 表示失败

// 获取轮播列表
exports.getLunBo = (req, res) => {
  let data = [
    {
      id: 1,
      url: 'http://www.itcast.cn/subject/phoneweb/index.html',
      img: 'http://destiny001.gitee.io/image/ban1.jpg'
    }, {
    id: 2,
      url: 'http://www.itcast.cn/subject/phoneweb/index.html',
    img: 'http://destiny001.gitee.io/image/ban2.jpg'
    }, {
    id: 3,
      url: 'http://www.itcast.cn/subject/phoneweb/index.html',
    img: 'http://destiny001.gitee.io/image/ban3.jpg'
    },
    {
      id: 4,
      url: 'http://www.itcast.cn/subject/phoneweb/index.html',
      img: 'http://destiny001.gitee.io/image/ban4.jpg'
    }
  ]
  res.end(new MsgResult(successState, data).toJson())
}

// 1 获取图片新闻资讯列表
exports.getNewsList = (req, res) => {
  let sql = " SELECT id,title,add_time,left(zhaiyao,25) as zhaiyao,click,concat('" + domain + "',img_url) as img_url FROM dt_article where img_url > '' and channel_id = 6 limit 0,10 "
  // 1连接数据库
  promiseFifty('获取图文资讯', sql).then( data => {
    res.end(new MsgResult(successState, data).toJson())
  }).catch( error => {
    res.end(new MsgResult(failState, err.message).toJson())
  })
}

// 2 根据资讯id获取资讯详细内容
exports.getNewDetail = (req, res) => {
  // 1 获取参数
  let newId = req.params.newid
  let sql = 'select id,title,click,add_time,content from dt_article  where id=' + newId
  promiseFifty('获取资讯明细', sql).then( data => {
    res.end(new MsgResult(successState, data).toJson())
  }).catch( error => {
    res.end(new MsgResult(failState, err.message).toJson())
  })
}

// 3.0 图片分享
exports.getImages = (req, res) => {
  // 1 获取参数
  let cateId = req.params.cateid - 0
  let sql = ' select id,title,img_url,zhaiyao from dt_article where channel_id = 9 and category_id=' + cateId
  if (cateId <= 0) {
    sql = ' select * from dt_article where channel_id = 9 '
  }
  promiseFifty('获取图片分享', sql).then( data => {
      // 图片路径处理
      data.forEach(item => {
        item.img_url = domain + item.img_url
      })
      res.end(new MsgResult(successState, data).toJson())
  }).catch( err => {
      res.end(new MsgResult(failState, err.message).toJson())
  })
}

// 3.1 图片分享详情中的缩略图数组
exports.getImage = (req, res) => {
  // 1 获取参数
  let newId = req.params.imgid
  let sql = `select thumb_path as src  from dt_article_albums where article_id =${newId}`
  
  promiseFifty('获取图片分享明细中缩略图', sql).then( data => {
      // 图片路径处理
      data.forEach(item => {
        item.src = domain + item.src
      })
      res.end(new MsgResult(successState, data).toJson())
  }).catch( err => {
    res.end(new MsgResult(failState, err.message).toJson())
  })
}

// 3.2 获取图片分享中的图片详细介绍
exports.getImageInfo = (req, res) => {
  // 1 获取参数
  let newId = req.params.imgid
  let sql = `select thumb_path as src  from dt_article_albums where article_id =${newId}`
  
  promiseFifty('获取图片分享明细', sql).then( data => {
    res.end(new MsgResult(successState, data).toJson())
  }).catch( err => {
    res.end(new MsgResult(failState, err.message).toJson())
  })
}

// 3.3 图片分享分类
exports.getImgCategory = (req, res) => {
  // 1 获取参数
  let sql = ' select title,id from dtcmsdb4.dt_article_category where channel_id = 9 '
  
  promiseFifty('获取图片分享分类', sql).then( data => {
    res.end(new MsgResult(successState, data).toJson())
  }).catch( err => {
    res.end(new MsgResult(failState, err.message).toJson())
  })
}

// 4.0 获取评论内容
exports.getComments = (req, res) => {
  // 1 获取参数
  let artid = req.params.artid
  let pageindex = req.query.pageindex
  let pagesize = 10;
  let skipCount = (pageindex - 1) * pagesize

  let sql = `select user_name,add_time,content from dt_article_comment where article_id = ${artid} order by add_time desc limit ${skipCount},${pagesize}`

  promiseFifty('获取评论', sql).then( data => {
    res.end(new MsgResult(successState, data).toJson())
  }).catch( err => {
    res.end(new MsgResult(failState, err.message).toJson())
  })
}

// 4.1 提交评论数据
exports.postComment = (req, res) => {
  // 1 获取参数
  let artid = req.params.artid
  let commentObj = req.body;

  let sql = `insert into  dt_article_comment(channel_id,article_id,parent_id,user_id,user_name,user_ip,
                                  content,is_lock,add_time,is_reply,reply_content,reply_time)
                    values (7,${artid},0,0,'匿名用户','127.0.0.1','${commentObj.content}',0,NOW(),0,'',NOW())`
  
  promiseFifty('post提交评论', sql).then( data => {
    res.end(new MsgResult(successState, data).toJson())
  }).catch( err => {
    res.end(new MsgResult(failState, err.message).toJson())
  })
}

//  5.0 获取商品列表数据
exports.getGoods = (req, res) => {
  // 1 获取参数
  let pageindex = req.query.pageindex
  if (!pageindex) {
    pageindex = 1;
  }
  let pagesize = 10
  let skipcount = (pageindex - 1) * pagesize

  let sql = `SELECT a.id,a.title,a.add_time,left(a.zhaiyao,25) as zhaiyao,a.click,concat('${domain}',a.img_url) as img_url,b.sell_price,b.market_price,b.stock_quantity FROM dt_article as a,dt_article_attribute_value b where a.id = b.article_id and a.channel_id = 7 limit ${skipcount},${pagesize} `
  
  promiseFifty('获取商品列表数据', sql).then( data => {
    res.end(new MsgResult(successState, data).toJson())
  }).catch( err => {
    res.end(new MsgResult(failState, err.message).toJson())
  })
}

//  6.2 获取详情页第二区域块
exports.getGoodsInfo = (req, res) => {
  // 1 获取参数
  let id = req.params.id;
  let sql = ` SELECT da.id,da.title,da.add_time,daa.goods_no,daa.stock_quantity,daa.market_price,daa.sell_price FROM dt_article da , dt_article_attribute_value daa 
				WHERE  da.id = daa.article_id and da.id = ${id} `

  promiseFifty('获取商品获取商品标题，价格，参数区数据', sql).then( data => {
    res.end(new MsgResult(successState, data).toJson())
  }).catch( err => {
    res.end(new MsgResult(failState, err.message).toJson())
  })
}

//  6.4 获取图文介绍 
exports.getGoodDesc = (req, res) => {
  // 1 获取参数
  let id = req.params.id;
  let sql = ` SELECT title,content FROM dt_article da WHERE da.id = ${id} `

  promiseFifty('获取商品图文描述', sql).then( data => {
    res.end(new MsgResult(successState, data).toJson())
  }).catch( err => {
    res.end(new MsgResult(failState, err.message).toJson())
  })
}

//  6.7 获取购物车页面数据
exports.getShopSarList = (req, res) => {
  // 1 获取参数
  let ids = req.params.ids

  let sql = `
  			  SELECT count(distinct tb1.id) as cou, tb1.* FROM (
				SELECT  da.id,da.title,daa.sell_price,alb.thumb_path
				  FROM dt_article da 
				  LEFT JOIN dt_article_attribute_value daa ON (da.id = daa.article_id)
				  LEFT JOIN dt_article_albums alb ON (da.id = alb.article_id)
				WHERE  da.id IN(${ids}) ) AS tb1 GROUP BY tb1.id
  `
  promiseFifty('获取购物车列表', sql).then( data => {
    // 拼接数据
    data.forEach(item => item.thumb_path = domain + item.thumb_path)
    res.end(new MsgResult(successState, data).toJson())
  }).catch( err => {
    res.end(new MsgResult(failState, err.message).toJson())
  })
}

//  7.1 获取品牌列表
exports.getProdList = (req, res) => {
  // 1 获取参数
  let sql = 'select * from dt_brands order by id';

  promiseFifty('获取品牌列表', sql).then( data => {
    res.end(new MsgResult(successState, data).toJson())
  }).catch( err => {
    res.end(new MsgResult(failState, err.message).toJson())
  })
}

//  7.2 根据Id，删除品牌列表
exports.delProduct = (req, res) => {
  // 1 获取参数
  let id = req.params.id;

  let sql = 'delete from dt_brands where id=' + id;

  promiseFifty('删除品牌数据', sql).then( data => {
    res.end(new MsgResult(successState, data).toJson())
  }).catch( err => {
    res.end(new MsgResult(failState, err.message).toJson())
  })
}

//  7.3 添加品牌数据
exports.addProduct = (req, res) => {
  // 1 获取参数
  let info = req.body;
  // var sql = 'insert into dt_brands (name, ctime) values ("' + info.name + '", "' + new Date() + '")';
  let sql = 'insert into dt_brands (name, ctime) values (?, ?)';

  promiseFifty('添加品牌数据', sql).then( data => {
    res.end(new MsgResult(successState, data).toJson())
  }).catch( err => {
    res.end(new MsgResult(failState, err.message).toJson())
  })
}

// 8.1 获取评论列表
exports.getCmtList = (req, res) => {
  // 1 获取参数
  let sql = "select * from dt_comments order by id desc limit 0, 10"

  promiseFifty('获取评论列表', sql).then( data => {
    res.end(new MsgResult(successState, data).toJson())
  }).catch( err => {
    res.end(new MsgResult(failState, err.message).toJson())
  })
}
// 8.2 发表新评论
exports.postCmt = (req, res) => {
  // 1 获取参数
  let info = req.body;
	let sql = "insert into dt_comments (name, content) values(?,?)"

  promiseFifty('发表新评论', sql).then( data => {
    res.end(new MsgResult(successState, data).toJson())
  }).catch( err => {
    res.end(new MsgResult(failState, err.message).toJson())
  })
}
