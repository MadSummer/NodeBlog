'use strict';
let gulp = require('gulp');
let less = require('gulp-less');
let minifyCss = require('gulp-minify-css');
let concat = require('gulp-concat');
let rename = require('gulp-rename');
let uglify = require('gulp-uglify');
let jshint = require('gulp-jshint');
let util = require('gulp-util');
let babel = require('gulp-babel');
let browserify = require('browserify');
let source = require('vinyl-source-stream');
let buffer = require('vinyl-buffer');
let sequence = require('gulp-sequence');
let ap = require('gulp-autoprefixer');
let del = require('del');
gulp.task('css', () => {
  return gulp.src(['./src/less/common.less', './src/less/index.less','./src/less/header.less', './src/less/article.less', './src/less/userpage.less', './src/less/post.less','./src/less/search.less'])
    .pipe(concat('all.less'))
    .pipe(less())
    .pipe(ap())
    .pipe(minifyCss())
    .pipe(rename('all.min.css'))
    .pipe(gulp.dest('./dest/stylesheets'))
});
gulp.task('concat', () => {
  return gulp.src(['./src/js/header.js', './src/js/index.js', './src/js/usepage.js', './src/js/article.js', './src/js/post.js', './src/js/vueModel.js'])
    .pipe(concat('all.js'))
    .pipe(gulp.dest('./src/js/'))
});
gulp.task('browserify', () => {
  var b = browserify({
    entries: "./src/js/all.js",
    debug: true
  });
  // 把jquery作为外部require 不打包
  // b.external('jquery');
  return b.bundle()
    .pipe(source("all.min.js"))
    .pipe(buffer())
    .pipe(gulp.dest("./dest/javascripts/"));
});
gulp.task('uglify', () => {
  return gulp.src('./dest/javascripts/all.min.js')
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(uglify().on('error', util.log))
    .pipe(gulp.dest('./dest/javascripts/'))
});
gulp.task('cleandest', () => {
  return del(['./dest/javascripts/all.min.js'])
});
gulp.task('cleanconcat', () => {
  return del(['./src/js/all.js'])
});
// thunk only run once,need callback function 
gulp.task('sequence', (cb) => {
  sequence('cleandest', 'concat', 'browserify', 'uglify', 'cleanconcat')(cb)
});
gulp.task('watch', () => {
  gulp.watch('./src/js/*.js', ['sequence']);
  gulp.watch('./src/less/*.less', ['css']);
});

