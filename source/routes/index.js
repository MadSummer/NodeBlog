'use strict';
let express = require('express');
let articleModel = require('../modules/article');
let ObjectId = require('mongodb').ObjectID;
let async = require('async');
let router = express.Router();
router.get('/', (req, res, next) => {
  res.render('index', {
    title: '首页',
    loginUser: req.session.user,
    success: req.flash('success').toString(),
    error: req.flash('error').toString()
  });
});
router.get('/load', (req, res, next) => {
  articleModel.load(req.query.page, (err, article) => {
    if (err) {
      req.flash('error', err)
      return;
    }
    res.send(article);
  });
});
module.exports = router;
