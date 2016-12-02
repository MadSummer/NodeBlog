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
  tags: String
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
  // this 代表 instance  实例
  this.comment.push(newComment);
  this.save(callback);
}
// 加载10篇文章
articleSchema.statics.getTen = function (query, callback) {
  let condition = {};
  switch (query.action) {
    case 'index':
      condition = {};
      break;
    case 'tag':
      let tag = new RegExp(query.tag, 'i');
      condition = { 'tags': { $regex: tag } };
      break;
    case 'search':
      let reg = new RegExp(query.kw, 'i');
      condition = {
        $or: [{ 'title': { $regex: reg } }, { 'content': { $regex: reg } }]
      }
      break;
    default:
      break;
  }
  this.find(condition, null, { skip: (query.page - 1) * 10, limit: 10, sort: { _id: -1 } }, callback);
}
// 得到一篇文章或者用户所有文章
articleSchema.statics.get = function (query, callback) {
  // this.model('articles') === this ---> true 😶 but why?
  // this 代表的就是model
  if (query._id) {
    this.findByIdAndUpdate(query._id, { '$inc': { 'views': 1 } }, callback);
  }
  if (query.uid) {
    this.find({ uid: query.uid }, null, { skip: (1 - 1) * 10, limit: 10, sort: { _id: -1 } }, callback);
  }
}
// 删除文章
articleSchema.statics.removeArticle = function (_id, callback) {
  this.model('articles').findByIdAndRemove(_id, callback);
}
// 创建article的Model
let articleModel = mongoose.model('articles', articleSchema);
module.exports = articleModel;