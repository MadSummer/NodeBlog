/*
@ common
you might not need jquery:https://github.com/oneuijs/You-Dont-Need-jQuery/blob/master/README.zh-CN.md
*/
// 定义常用公共函数
'use strict';
const loginPanel = document.getElementById('loginPanel');
const backtotop = document.getElementById('backtotop');
const logout = document.getElementById('logout');
const delArticle = document.getElementById('delArticle');
const delComment = document.getElementsByClassName('delComment');
const confirm = document.getElementById('confirm');
const commentText = document.querySelector('textarea[name=comment]');
const keyword = document.getElementsByClassName('searchInput')[0];
let vm = new Vue({
  el: '#app',
  data: {
    els: {
      'loginPanel': loginPanel,
      'backtotop': backtotop,
      'logout': logout,
      'delArticle': delArticle,
      'delComment': delComment,
      'commentText': commentText
    },
    scrollTop: false,
    articles: [],
    page: 1,
    load: false,
    nomore: false,
    searchPage: 1,
    searchRes: [],
    sidebar:false
  },
  methods: {
    toggleSidebar:function(){
      this.sidebar = !this.sidebar;
    },
    // 显示 /关闭登陆 
    toggleLoginPanel: function () {
      this.showLoginPanel = !this.showLoginPanel;
    },
    // 登陆/注册切换
    switchLoginReg: (e) => {
      let el = e.currentTarget;
      if (el.classList.contains('active')) return false;
      el.classList.add('active');
      Array.from(el.parentNode.children).filter((child) => child != el
      )[0].classList.remove('active');
      loginPanel.querySelector('div').classList.toggle('on')
    },
    // 设置ajax数据 
    setData: (e) => {
      let el = e.currentTarget;
      switch (el) {
        case logout:
          confirm.setAttribute('data-url', '/logout');
          confirm.setAttribute('data-type', 'GET');
          break;
        case delArticle:
          confirm.setAttribute('data-url', './delArticle');
          confirm.setAttribute('data-type', 'POST');
          confirm.setAttribute('data-pid', document.getElementsByClassName('article')[0].getAttribute('data-pid'))
          break;
        // 表达式必须和el相等才执行，indexOf返回存在元素的下标
        // case delComment[Array.from(delComment).indexOf(el)]:
        case Array.from(delComment).find((ele) => ele == el):
          confirm.setAttribute('data-url', './delComment');
          confirm.setAttribute('data-type', 'POST');
          confirm.setAttribute('data-pid', document.getElementsByClassName('article')[0].getAttribute('data-pid'))
          confirm.setAttribute('data-cid', el.parentNode.parentNode.getAttribute('data-cid'))
        default:
          break;
      }
    },
    sendAjax: () => {
      $.ajax({
        url: confirm.getAttribute('data-url'),
        type: confirm.getAttribute('data-type'),
        data: {
          pid: confirm.getAttribute('data-pid'),
          cid: confirm.getAttribute('data-cid')
        },
        success: (res) => {
          switch (confirm.getAttribute('data-url')) {
            case './delArticle':
              window.location.href = '/';
              break;
            case '/logout':
              window.location.href = '/';
              break;
            case './delComment':
              window.location.href = window.location.href;
              break;
          }
        }
      });
    },
    pushComment: () => {
      if (commentText.value.length < 1) {
        alert('不能为空！ ');
        return;
      }
      else {
        $.ajax({
          url: './pushComment',
          type: 'POST',
          data: {
            pid: document.getElementsByClassName('article')[0].getAttribute('data-pid'),
            content: commentText.value
          },
          success: () => {
            window.location.href = window.location.href;
          }
        });
      }
    },
    search: () => {
      if (keyword.value.length < 1) return alert('不输入让我搜索啥？');
      window.location.href = '/search?page=1&kw=' + keyword.value;
    }
  }
});
window.onscroll = () => {
  // 两者document.documentElement.scrollTop||document.body.scrollTop有一个必定为0
  let scrollTop = (document.documentElement && document.documentElement.scrollTop) + document.body.scrollTop;
  if (scrollTop > 200) {
    vm.scrollTop = true;
  }
  else {
    vm.scrollTop = false;
  }
}
module.exports = vm;
