'use strict';
let express = require('express');
let ObjectId = require('mongodb').ObjectID;
let articleModel = require('../modules/article');
let userModel = require('../modules/user');
let fs = require('fs');
let crypto = require('crypto');
let multer = require('multer');
let common = require('../modules/common');
let router = express.Router();
// multer上传配置
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
  console.log(req.session.user)
  if(req.session.user){
    res.render('admin', {
    })
  }
  else{
    res.render('login',{
    })
  }
});
// 删除文章
router.post('/delArticle', (req, res, next) => {
  articleModel.get({ _id: req.body.pid }, (err, article) => {
    if (err) {
      req.flash('error', err);
      return res.redirect('/');
    }
    if (article.uid === req.session.user.uid) {
      articleModel.removeArticle(req.body.pid, (err, article) => {
        req.flash('success', '删除成功');
        res.send('success');
      });
    }
  });
});
module.exports = router;