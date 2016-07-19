/*app.js是整个express应用程序的入口*/
'use strict';
let express = require('express');
let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let multer = require('multer');
/*session对话模块*/
let session = require('express-session');
let MongoStore = require('connect-mongo')(session);

/*加载路由模块*/
let index = require('./routes/index');
let settings = require('./settings');
let flash = require('connect-flash');
let article = require('./routes/article');
let userpage = require('./routes/userpage');
let post = require('./routes/post');
let upload = require('./routes/upload');
let search = require('./routes/search');
let admin = require('./routes/admin');
/*实例化app为一个express应用*/
let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(session({
  secret: settings.cookieSecret,
  key: settings.db,//cookie name
  cookie: { maxAge: 1000 * 60 * 60 * 24 * 30 },//30 days
  store: new MongoStore({
    url: 'mongodb://localhost/blog'
  })
}));
app.use(flash());
// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'upload')));
// router control
app.use('/', index);
app.use('/logout', index);
app.use('/u', userpage);
app.use('/p', article);
app.use('/post', post);
app.use('/upload', upload);
app.use('/search', search);
app.use('/admin',admin);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});
app.locals['formatDate'] = (_id, format) => {
  'use strict';
  let stamp = new Date(parseInt(_id.toString().substring(0, 8), 16) * 1000);
  let year = stamp.getFullYear();
  let month = stamp.getMonth() + 1;
  let day = stamp.getDate();
  let hour = stamp.getHours();
  let minute = stamp.getMinutes();
  let second = stamp.getSeconds();
  if (second < 10) {
    second = '0' + second;
  }
  if (minute < 10) {
    minute = '0' + minute;
  }
  if (hour < 10) {
    hour = '0' + hour;
  }
  switch (format) {
    case 1: return year + '年' + month + '月' + day + '日' + hour + '时' + minute + '分' + second + '秒';
    case 2: return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
    case 3: return year + '/' + month + '/' + day + '/' + hour + '/' + minute + '/' + second;
    default: return year + '年' + month + '月' + day + '日' + hour + '时' + minute + '分' + second + '秒';
  }
};
module.exports = app;
