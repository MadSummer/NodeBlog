'use strict';
let express = require('express');
let multer = require('multer');
let router = express.Router();
let fs = require('fs');
let common = require('../modules/common');
let storage = multer.diskStorage({
    destination: function (req, file, callback) {
        let today = common.FormatDate(new Date(), 4);
        let path = './upload/data/' + today;
        fs.exists(path, (exists) => {
            console.log(path)
            if (exists) {
                callback(null, path);
            }
            else {
                fs.mkdir(path, () => {
                    callback(null, path);
                });
            }
        });
    },
    filename: function (req, file, callback) {
        let temp = file.originalname;
        let array = temp.split('.');
        let format = array[array.length - 1];
        callback(null,  (new Date().getTime()+'.'+format))
    }
});
let upload = multer({
    storage: storage
});
router.get('/', (req, res, next) => {
    res.render('upload', {
        title: '上传demo',
        loginUser: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
    })
});
router.post('/', upload.array('fileimg', 5), function (req, res) {
    req.flash('success', '文件上传成功!');
    res.redirect('/upload');
});
module.exports = router