'use strict';
let express = require('express');
let userModel = require('../modules/user');
let articleModel = require('../modules/article');
let router = express.Router();
router.get('/', (req, res, next) => {
  if (!req.session.user || req.session.user.group !== 'admin') {
    req.flash('error', '没有权限！')
    return res.redirect('/');
  }
  res.render('admin', {
    title: '后台管理',
    success: req.flash('success').toString(),
    error: req.flash('error').toString(),
    loginUser: req.session.user
  })
})

module.exports = router;