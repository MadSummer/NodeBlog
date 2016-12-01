'use strict';
//  mongodb的写法
 /*let settings = require('../settings'),
        Db = require('mongodb').Db,
        Connection = require('mongodb').Connection,
        Server = require('mongodb').Server;
    module.exports = new Db(settings.db, new Server(settings.host, settings.port),
 {safe: true});*/
//  mongoose的写法
let mongoose = require('mongoose');
let settings = require('../settings');
mongoose.connect('mongodb://' + settings.user + ':' + settings.pwd + '@' + 'localhost/' + settings.db);
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
    console.log('MongoDB Opened!');
});
module.exports = mongoose;
