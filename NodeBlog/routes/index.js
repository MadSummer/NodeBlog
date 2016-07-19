'use strict';
let express = require('express');
let articleModel = require('../modules/article');
let userModel = require('../modules/user');
let ObjectId = require('mongodb').ObjectID;
let async = require('async');
let crypto = require('crypto');
let router = express.Router();

router.get('/', (req, res, next) => {
  res.render('index', {
    title: '记笔',
    loginUser: req.session.user,
    success: req.flash('success').toString(),
    error: req.flash('error').toString()
  });
});
router.get('/load', (req, res, next) => {
  articleModel.load(req.query.page,(err, article) => {
    if (err) {
      req.flash('error', err)
      return;
    }
    res.send(article);
  });
});

router.post('/login', (req, res, next) => {
  userModel.get(req.body.uid, (err, user) => {
    if (err) {
      req.flash('error', err)
    }
    let md5 = crypto.createHash('md5'),
      password = md5.update(req.body.password).digest('hex');
    if (!user) {
      req.flash('error', '用户不存在');
      res.redirect('/');
    }
    else if (password === user.password) {
      req.flash('success', '登陆成功');
      req.session.user = user;
      res.redirect('/');
    }
    else {
      req.flash('error', '密码错误，请重新输入！');
      res.redirect('/');
    }
  });
})
router.post('/reg', (req, res) => {
  // let [uid,name,password,password_re] = [req.body.uid,req.body.username,req.body.password,req.body.password-repeat];
  let uid = req.body.uid;
  let name = req.body.username;
  let password = req.body.password;
  let password_re = req.body['password-repeat'];
  if (!(uid && name && password)) {
    req.flash('error', '不能为空!');
    return res.redirect('/');//返回注册页
  }
  //检验用户两次输入的密码是否一致
  if (password_re != password) {
    req.flash('error', '两次输入的密码不一致!');
    return res.redirect('/');//返回注册页
  }
  //生成密码的 md5 值
  let md5 = crypto.createHash('md5');
  password = md5.update(req.body.password).digest('hex');
  let newUser = new userModel({
    uid: uid,
    name: name,
    password: password,
  });
  //检查账户是否已经存在 
  userModel.get(newUser.uid, (err, user) => {
    if (err) {
      req.flash('error', err);
      return res.redirect('/');
    }
    if (user) {
      req.flash('error', '用户已存在!');
      return res.redirect('/');//返回注册页
    }
    //如果不存在则新增用户
    newUser.save((err, user) => {
      if (err) {
        req.flash('error', err);
        return res.redirect('/reg');//注册失败返回主册页
      }
      req.session.user = newUser;//用户信息存入 session
      req.flash('success', '注册成功!');
      res.redirect('/');//注册成功后返回主页
    });
  });
});
router.get('/logout', (req, res, next) => {
  req.session.user = null;
  req.flash('success', '退出成功！');
  res.redirect('/');
});
module.exports = router;