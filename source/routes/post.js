'use strict';
let express = require('express');
let articleModel = require('../modules/article');
let multer = require('multer');
let router = express.Router();
let fs = require('fs');
let common = require('../modules/common');
let storage = multer.diskStorage({
  destination: function (req, file, callback) {
    let today = common.FormatDate(new Date(), 4);
    let path = '../upload/data/' + today;
    fs.exists(path, (exists) => {
      if (exists) {
        callback(null, path);
      }
      else {
        fs.mkdir(path, () => {
          callback(null, path);
        });
      }
    });
  },
  filename: function (req, file, callback) {
    let temp = file.originalname;
    let array = temp.split('.');
    let format = array[array.length - 1];
    callback(null, (new Date().getTime() + '.' + format))
  }
});
let upload = multer({
  storage: storage
});
router.get('/', (req, res, next) => {
  if (!req.session.user) {
    req.flash('error', '请先登录');
    return res.redirect('/admin');
  }
  res.render('post', {
    title: '发布文章',
    loginUser: req.session.user,
    success: req.flash('success').toString(),
    error: req.flash('error').toString()
  });
});
router.post('/upload', upload.array('myFileName', 1), function (req, res) {
  console.log(req.files[0].destination + req.files[0].filename)
  console.log(req.files[0].destination)
  //../upload/data/2016-7-131468387858698.jpg
  let destination = req.files[0].destination.slice(9) + '/';
  console.log(destination)
  res.send(destination + req.files[0].filename)
});
router.post('/', (req, res, next) => {
  if (!req.session.user) {
    req.flash('error', '请先登录！');
    return res.send(null);
  }
  if (req.body.title.length < 1 || req.body.content.length < 1) {
    req.flash('error', '不能为空');
    return res.send(null);
  }
  let newArticle = new articleModel({
    title: req.body.title,
    content: req.body.content,
    uid: req.session.user.uid,
    name: req.session.user.name,
    comment: [],
    views: 0
  });
  newArticle.save((err, article) => {
    if (err) {
      req.flash('error', err);
      return res.send(null);
    }
    req.flash('success', '发布成功！');
    res.send(article._id);
  });
});
module.exports = router;