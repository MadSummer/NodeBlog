'use strict';
let express = require('express');
let articleModel = require('../modules/article');
let router = express.Router();
router.get('/', (req, res, next) => {
  res.render('index', {
    title: '首页',
    loginUser: req.session.user,
    success: req.flash('success').toString(),
    error: req.flash('error').toString()
  });
});
module.exports = router;
