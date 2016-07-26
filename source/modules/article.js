'use strict';
let mongoose = require('./db');
let ObjectId = mongoose.Schema.Types.ObjectId;
let userModel = require('./user');
let common = require('./common');
let eventproxy = require('eventproxy');
let ep = new eventproxy();
let fs = require('fs');
// mongoose 
// 创建comment的骨架(schema),作为文章的sub-docs
let commentSchema = mongoose.Schema({
  uid: String,
  name: String,
  content: String,
});
let commentModel = mongoose.model('comments', commentSchema);
// 创建article的骨架(schema)
let articleSchema = mongoose.Schema({
  title: String,
  content: String,
  uid: String,
  name: String,
  comment: [commentSchema],
  views: Number,
  tags:Array
});
// 删除评论
articleSchema.methods.removeComment = function (i, callback) {
  this.comment.splice(i, 1);
  this.save(callback);
}
// 增加评论
articleSchema.methods.pushComment = function (comment, callback) {
  let newComment = new commentModel({
    uid: comment.uid,
    name: comment.name,
    content: comment.content
  });
  this.comment.push(newComment);
  this.save(callback);
}
// 批量插入数据

// 文章搜索
articleSchema.statics.search = function (kw, page, callback) {
  let reg = new RegExp(kw, 'i');
  this.model('articles').find(
    {
      $or: [{ 'title': { $regex: reg } }, { 'content': { $regex: reg } }]
    },
    null,
    {
      skip: (page - 1) * 10,
      limit: 10,
      sort: { _id: -1 }
    },
    callback
  )
}
// 首页加载
articleSchema.statics.load = function (page, callback) {
  this.model('articles').find({}, null, { skip: (page - 1) * 10, limit: 10, sort: { _id: -1 } }, callback);
}
// 得到一篇文章或者用户所有文章
articleSchema.statics.get = function (query, callback) {
  if (query._id) {
    this.model('articles').findByIdAndUpdate(query._id, { '$inc': { 'views': 1 } }, callback);
  }
  if (query.uid) {
    this.model('articles').find({ uid: query.uid }, null, { skip: (1 - 1) * 10, limit: 10, sort: { _id: -1 } },callback);
  }
}
// 删除文章
articleSchema.statics.removeArticle = function (_id, callback) {
  this.model('articles').findByIdAndRemove(_id, callback);
}
// 创建article的Model
let articleModel = mongoose.model('articles', articleSchema);
module.exports = articleModel;