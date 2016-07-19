'use strict';
let express = require('express');
let userModel= require('../modules/user');
let articleModel = require('../modules/article');
let router = express.Router();

router.get('/:uid', (req, res, next)=>{
  let uid = req.params.uid;
  userModel.get(uid,(err, user)=>{
    if(err){
      req.flash('error',err)
      return res.redirect('/');
    }
    if(!user){
      req.flash('error','没有此用户！');
      return res.redirect('/');
    }
    articleModel.get({'uid':uid},(err, article)=>{
      if(err){
        req.flash('error',err);
        return res.redirect('/');
      }
      res.render('userpage',{
        title: user.name + '的个人主页-微博',
        loginUser:req.session.user,
        user: user,
        article:article,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
      });
    });
  }); 
});

module.exports = router;
