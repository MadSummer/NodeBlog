'use strict';
let express = require('express');
let userModel = require('../modules/user');
let articleModel = require('../modules/article');
let router = express.Router();
let multer = require('multer');
let fs = require('fs');
let common = require('../modules/common');
let crypto = require('crypto');
let app = require('../app');
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
// 登陆
router.post('/signin', (req, res, next) => {
  if (!req.body.signinuid || !req.body.signinpsw) {
    req.flash('error', '不能为空');
    return res.send();
  }
  userModel.get(req.body.signinuid, (err, user) => {
    if (err) {
      req.flash('error', err);
      return res.send()
    }
    if (!user) {
      req.flash('error', '用户不存在');
      return res.send();
    }
    let md5 = crypto.createHash('md5'),
      password = md5.update(req.body.signinpsw).digest('hex');
    if (password !== user.password) {
      req.flash('error', '密码错误，请重新输入！');
      return res.send();
    }
    if (password === user.password) {
      req.flash('success', '登陆成功');
      req.session.user = user;
      res.send('/');
    }
    // rember me
    if (req.body.signinrmb) {
      req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 30;
      req.session.save();
    }
    if (!req.body.signinrmb) {
      req.session.cookie.expires = false;
      req.session.cookie.maxAge = null;
      req.session.save();
    }
  });
})
// 用户注册
router.post('/signup', (req, res, next) => {
  let uid = req.body.signupuid;
  let name = req.body.signupum;
  let password = req.body.signuppsw;
  let password_re = req.body.passwordre;
  if (!(uid && name && password)) {
    req.flash('error', '不能为空!');
    return res.send();//返回注册页
  }
  //检验用户两次输入的密码是否一致
  if (password_re != password) {
    req.flash('error', '两次输入的密码不一致!');
    return res.send();//返回注册页
  }
  //检查账户是否已经存在 
  userModel.get(uid, (err, user) => {
    if (err) {
      req.flash('error', err);
      return res.send();
    }
    if (user) {
      req.flash('error', '用户已存在!');
      return res.send();//返回注册页
    }
    //生成密码的 md5 值
    let md5 = crypto.createHash('md5');
    password = md5.update(password).digest('hex');
    let newUser = new userModel({
      uid: uid,
      name: name,
      password: password,
      group: 'user',
    });
    //如果不存在则新增用户
    newUser.save((err, user) => {
      if (err) {
        req.flash('error', err);
        return res.send();//注册失败返回主册页
      }
      req.session.user = newUser;//用户信息存入 session
      req.flash('success', '注册成功!');
      res.send();//注册成功后返回主页
    });
  });
});
// 登出
router.get('/signout', (req, res, next) => {
  req.session.user = null;
  req.flash('success', '退出成功！');
  res.redirect('/');
});
// 发布文章
router.get('/publish', (req, res, next) => {
  if (!req.session.user) {
    req.flash('error', '请先登录');
    return res.redirect('/');
  }
  res.render('publish', {
    title: '发布文章',
    loginUser: req.session.user,
    success: req.flash('success').toString(),
    error: req.flash('error').toString()
  });
});
router.post('/publish/upload', upload.array('uploadfile', 1), function (req, res) {
  let destination = req.files[0].destination.slice(9) + '/';
  console.log(req.files[0].destination)
  console.log(destination)
  console.log(req.files[0].filename)
  res.send(destination + req.files[0].filename)
});
router.post('/publish/submit', (req, res, next) => {
  if (!req.session.user) {
    req.flash('error', '请先登录！');
    return res.send(null);
  }
  console.log(req.body.title)
  console.log(req.body.content)
  console.log(req.body.tags)
  if (req.body.title.length < 1 || req.body.content.length < 1) {
    req.flash('error', '不能为空');
    return res.send(null);
  }
  let newArticle = new articleModel({
    title: req.body.title,
    content: req.body.content,
    uid: req.session.user.uid,
    name: req.session.user.name,
    tags: req.body.tags,
    comment: [],
    views: 0,
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
router.get('/:uid', (req, res, next) => {
  let uid = req.params.uid;
  userModel.get(uid, (err, user) => {
    if (err) {
      req.flash('error', err)
      return res.redirect('/');
    }
    if (!user) {
      req.flash('error', '没有此用户！');
      return res.redirect('/');
    }
    articleModel.get({ 'uid': uid }, (err, article) => {
      if (err) {
        req.flash('error', err);
        return res.redirect('/');
      }
      res.render('user', {
        title: user.name + '的个人主页-微博',
        loginUser: req.session.user,
        user: user,
        article: article,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
      });
    });
  });
});

module.exports = router;
