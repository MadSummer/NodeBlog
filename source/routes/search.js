'use strict';
let express = require('express');
let userModel = require('../modules/user');
let articleModel = require('../modules/article');
let router = express.Router();
router.get('/', (req, res, next) => {
  // req.query[''] 查找地址栏上的get
  // req.params.    查找router获取的如：/p/:pid
  articleModel.search(req.query.kw, req.query.page, (err, article) => {
    if (err) return req.flash('error', err);
    res.render('search', {
      title: '搜索' + req.query.kw + '的结果',
      loginUser: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString(),
      keyword: req.query.kw,
      article: article
    })
  });
});
module.exports = router;