'use strict';
let common = {
  FormatDate: function(stamp, format){
    let year = stamp.getFullYear();
    let month = stamp.getMonth() + 1;
    let day = stamp.getDate();
    let hour = stamp.getHours();
    let minute = stamp.getMinutes();
    let second = stamp.getSeconds();
    if(second < 10){
      second = '0' + second ;
    }
    if(minute < 10){
      minute = '0' + minute ; 
    }
    if(hour < 10){
      hour = '0' + hour ; 
    }
    switch (format){
      case 1 : return year + '年' + month + '月' + day + '日' + hour + '时' + minute + '分' + second + '秒';
      case 2 : return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
      case 3 : return year + '/' + month + '/' + day + '/' + hour + '/' + minute + '/' + second;
      case 4 : return year + '-' + month + '-' + day ;
      default: return year + '年' + month + '月' + day + '日' + hour + '时' + minute + '分' + second + '秒';
    }
  }
}

module.exports = common;