'use strict';
let express = require('express');
let userModel = require('../modules/user');
let articleModel = require('../modules/article');
let router = express.Router();
router.get('/', (req, res, next) => {
  // req.query[''] 查找地址栏上的get
  // req.params.    查找router获取的如：/p/:pid
  let query = {
    action: req.query.action,
    page: req.query.page || 1,
    kw: req.query.kw,
    tag: req.query.tag
  }
  articleModel.getTen(query, (err, article) => {
    if (err) return req.flash('error', err);
    switch (query.action) {
      case 'index':
        res.send(article);
        break;
      case 'search':
        res.render('list', {
          title: '搜索' + query.kw + '的结果',
          loginUser: req.session.user,
          error: req.flash('error').toString(),
          success: req.flash('success').toString(),
          article: article,
          kw: query.kw,
          tag: undefined
        });
        break;
      case 'tag':
        res.render('list', {
          title: query.tag + '的所有文章',
          loginUser: req.session.user,
          error: req.flash('error').toString(),
          success: req.flash('success').toString(),
          article: article,
          tag: query.tag,
          kw: undefined
        });
        break;
      default:
        req.flash('error', '地址出现了一点点小问题');
        res.redirect('/')
        break;
    }
  });
});
module.exports = router;