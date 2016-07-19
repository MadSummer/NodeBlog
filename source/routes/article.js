'use strict';
let express = require('express');
let ObjectId = require('mongodb').ObjectID;
let articleModel = require('../modules/article');
let userModel = require('../modules/user');
let router = express.Router();
let fs = require('fs');
let eventproxy = require('eventproxy');
router.get('/insert', (req, res, next) => {
  let arr = [];
  fs.readFile('../upload/1.txt', 'utf-8', (err, data) => {
    if (err) return;
    for (let i = 1; i < 30000; i++) {
      let newArticle = new articleModel({
        title: data.slice((i - 1) * 300, i * 300).slice(0, 15),
        content: data.slice((i - 1) * 300, i * 300),
        uid: req.session.user.uid,
        name: req.session.user.name,
        comment: [],
        views: 0
      });
      console.log('i:' + i);
      newArticle.save((err, article) => {
        if (err) return;
      })
    }
  });
});
router.get('/:pid', (req, res, next) => {
  articleModel.get({ _id: req.params.pid }, (err, article) => {
    if (err) {
      req.flash('error', err);
      return res.redirect('/');
    }
    if (!article) {
      req.flash('error', '地址出错！');
      return res.redirect('/');
    }
    res.render('article', {
      title: article.title + '-记笔',
      article: article,
      success: req.flash('success').toString(),
      error: req.flash('error').toString(),
      loginUser: req.session.user
    });
  });
});
router.post('/delArticle', (req, res, next) => {
  console.log('recive post reuqest')
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
router.post('/pushComment', (req, res, next) => {
  if (!req.session.user) {
    req.flash('error', '登陆用户才能评论！');
    return res.send({ 'success': 'notLogin' });
  }
  let comment = {
    uid: req.session.user.uid,
    name: req.session.user.name,
    content: req.body.content
  }
  articleModel.get({ _id: req.body.pid }, (err, article) => {
    if (err) {
      return req.flash('error', err)
    }
    article.pushComment(comment, (err, article) => {
      req.flash('success', '评论成功');
      res.send('success');
    });
  });
});
router.post('/delComment', (req, res, next) => {
  articleModel.get({ _id: req.body.pid }, (err, article) => {
    if (err) {
      req.flash('error', err);
      return res.redirect('/');
    }
    for (let i = 0; i < article.comment.length; i++) {
      console.log(i)
      if (article.comment[i]._id == req.body.cid && article.comment[i].uid === req.session.user.uid) {
        article.removeComment(i, (err, article) => {
          if (err) {
            req.flash('error', err);
            return res.send('error');
          }
          req.flash('success', '删除成功');
          res.send('success')
        });
        break;
      }
    }
  });
});
module.exports = router;