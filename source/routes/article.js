'use strict';
let express = require('express');
let articleModel = require('../modules/article');
let router = express.Router();
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
      title: article.title,
      article: article,
      success: req.flash('success').toString(),
      error: req.flash('error').toString(),
      loginUser: req.session.user
    });
  });
});
router.post('/delArticle', (req, res, next) => {
  articleModel.get({ _id: req.body.pid }, (err, article) => {
    if (err) {
      req.flash('error', err);
      return res.redirect('/');
    }
    if (article.uid === req.session.user.uid || req.session.user.gropu === 'admin') {
      articleModel.removeArticle(req.body.pid, (err, article) => {
        req.flash('success', '删除成功');
        res.send('success');
      });
    }
  });
});

router.post('/pushComment', (req, res, next) => {
  if (!req.body.commentcontent || !(req.session.user || (req.body.commentname && req.body.commentemail))) {
    req.flash('error', '不能为空')
    return;
  }
  let comment = {
    uid: req.session.user && req.session.user.uid || null,
    name: req.session.user && req.session.user.name || req.body.commentname,
    content: req.body.commentcontent,
    email: req.body.commentemail
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
    let index;
    for (let i = 0; i < article.comment.length; i++) {
      if (article.comment[i]._id == req.body.cid && (article.comment[i].uid === req.session.user.uid || req.session.user.group === 'admin')) {
        article.removeComment(i, (err, article) => {
          if (err) {
            req.flash('error', err);
            return res.send('error');
          }
          req.flash('success', '删除成功');
          res.send('success')
        });
      }
    }
  });
});
module.exports = router;