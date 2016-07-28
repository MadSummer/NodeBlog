'use strict';
let common = {
  formatDate: (_id, format) => {
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
  },
  getQ: (params) => {
    let reg = new RegExp("(^|&)" + params + "=([^&]*)(&|$)", "i");
    let r = window.location.search.substr(1).match(reg);  //获取url中"?"符后的字符串并正则匹配
    let context = "";
    if (r != null)
      context = r[2];
    reg = null;
    r = null;
    return context == null || context == "" || context == "undefined" ? "" : context;
  }
}
module.exports = common;