'use strict';
let mongoose = require('./db');
let userSchema = mongoose.Schema({
    uid: String,
    name:String,
    password:String,
    avatar:String,
    summary:String,
    zhihu:String,
    other:String,
    follow:Array,
    group:String
});
userSchema.statics.get = function (uid,callback) {
  this.model('users').findOne({uid:uid},callback);
}
let userModel = mongoose.model('users',userSchema);
module.exports = userModel;