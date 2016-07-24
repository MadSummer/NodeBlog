/*
@ common
you might not need jquery:https://github.com/oneuijs/You-Dont-Need-jQuery/blob/master/README.zh-CN.md
*/
// 定义常用公共函数
'use strict';
let Vue = require('vue');
let vs = require('vue-resource');
let common = require('./common');
let fastClick = require('fastclick');
const loginPanel = document.getElementById('loginPanel');
const backtotop = document.getElementById('backtotop');
const logout = document.getElementById('logout');
const delArticle = document.getElementById('delArticle');
const delComment = document.getElementsByClassName('delComment');
const confirm = document.getElementById('confirm');
const commentText = document.querySelector('textarea[name=comment]');
const keyword = document.querySelectorAll('input[type=search]');
const sidebar = document.getElementById('sidebar');
const mMenu = document.getElementById('mobile-menu');
Vue.use(vs);
let vm = new Vue({
  el: '#app',
  data: {
    els: {
      'loginPanel': loginPanel,
      'backtotop': backtotop,
      'logout': logout,
      'delArticle': delArticle,
      'delComment': delComment,
      'commentText': commentText,
      'sidebar': sidebar,
      'mMenu': mMenu
    },
    scrollTop: false,
    articles: [],
    page: 1,
    loading: false,
    mask: false,
    nomore: false,
    searchPage: 1,
    searchRes: [],
    sidebar: false,
    isMobile: false
  },
  ready: function () {
    // faskclick
    fastClick(document.body);
    // resize
    if (document.body.clientWidth < 768) {
        this.isMobile = true;
        this.sidebar = false;
      }
    window.onresize = () => {
      if (document.body.clientWidth < 768) {
        this.isMobile = true;
        this.sidebar = false;
      }
      else{
        this.isMobile = false;
        this.sidebar = true;
      }
    };
    // to top
    window.onscroll = () => {
      // 两者document.documentElement.scrollTop||document.body.scrollTop有一个必定为0
      let scrollTop = (document.documentElement && document.documentElement.scrollTop) + document.body.scrollTop;
      if (scrollTop > 200) {
        this.scrollTop = true;
      }
      else {
        this.scrollTop = false;
      }
    }
    // index first load
    this.load();
  },
  computed: {

  },
  methods: {
    closeSidebar: function (e) {
      if (e.target !== this.els.mMenu && !this.els.sidebar.contains(e.target)) {
        this.sidebar = false;
      }
    },
    toggleSidebar: function () {
      this.sidebar = !this.sidebar;
    },
    search: () => {
      if (keyword[0].value.length < 1 && keyword[1].value.length < 1) return alert('不输入让我搜索啥？');
      let kw = keyword[0].value + keyword[1].value;
      window.location.href = '/search?page=1&kw=' + kw;
    },
    load: function () {
      if (window.location.pathname === '/' && !this.loading) {
        this.loading = true;
        this.mask = true;
        this.$http.get('/load', { params: { 'page': this.page } })
          .then(function (response) {
            let res = response.json();
            if (res.length === 0) {
              this.nomore = true;
              this.loading = false;
              return;
            }
            this.page++;
            for (let i = 0; i < res.length; i++) {
              let title = res[i].title;
              let content = res[i].content;
              let name = res[i].name;
              let pid = res[i]._id;
              let date = common.formatDate(pid, 2);
              let views = res[i].views;
              let comment = res[i].comment.length;
              let userLink = '/u/' + res[i].uid;
              let articleLink = '/p/' + pid;
              let tempDiv = document.createElement('div')
              tempDiv.innerHTML = content;
              let summary = tempDiv.textContent.slice(0, 80);
              let cover = tempDiv.querySelector('img') && tempDiv.querySelector('img').getAttribute('src') || '/assets/images/cover.jpg';
              this.articles.push({
                title,
                content,
                name,
                pid,
                date,
                views,
                comment,
                userLink,
                articleLink,
                summary,
                cover
              });
            }
            this.loading = false;
            this.mask = false;
          });
      }
    }
  }
});
module.exports = vm;
