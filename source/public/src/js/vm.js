/*
@ common
you might not need  jquery:https://github.com/oneuijs/You-Dont-Need-jQuery/blob/master/README.zh-CN.md
*/
// 定义常用公共函数
'use strict';
let Vue = require('vue');
let common = require('./common');
let fastClick = require('fastclick');
Vue.use(require('vue-resource'));
Vue.use(require('vue-validator'));
let vm = new Vue({
  el: '#app',
  data: {
    state: {
      mobile: false,
      loading: false,
      none: false,
      sidebar: false,
      sign: false,
      signin: true,
      signup: false,
      scrollTop: false,
      sub: false
    },
    articles: [],
    page: 1
  },
  ready: function () {
    // faskclick
    fastClick(document.body);
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
    mask: function () {
      if (this.state.sidebar || this.state.sign || this.state.loading) {
        return true;
      }
      else {
        return false;
      }
    }
  },
  methods: {
    openSign: function () {
      this.state.sign = true;
      this.state.sidebar = false;
    },
    closeMask: function () {
      this.state.sidebar = false;
      this.state.sign = false;
    },
    toggleSign: function (e) {
      if (e.currentTarget.classList.contains('current')) return;
      this.state.signin = !this.state.signin;
      this.state.signup = !this.state.signup;
    },
    search: function() {
      if (!this.kw || this.kw.length < 1) return alert('不输入让我搜索啥？');
      window.location.href = '/getten?action=search&page=1&kw=' + this.kw;
    },
    signin: function () {
      this.$http.post('/user/signin', { 'signinuid': this.signinuid, 'signinpsw': this.signinpsw, 'signinrmb': this.signinrmb })
        .then(
        (res) => {
          window.location.href = window.location.href;
        }
        )
    },
    signup: function () {
      this.$http.post('/user/signup', { 'signupuid': this.signupuid, 'signuppsw': this.signuppsw, 'passwordre': this.passwordre, 'signupum': this.signupum })
        .then((res) => {
          window.location.href = window.location.href;
        })
    },
    load: function () {
      if (window.location.pathname === '/' && !this.loading) {
        this.state.loading = true;
        this.$http.get('/getten', { params: { 'action': 'index', 'page': this.page, } })
          .then(function (response) {
            let res = response.json();
            if (res.length === 0) {
              this.state.none = true;
              this.state.loading = false;
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
              let articleLink = '/article/' + pid;
              let tempDiv = document.createElement('div')
              tempDiv.innerHTML = content;
              let summary = tempDiv.textContent.slice(0, 80);
              let cover = tempDiv.querySelector('img') && tempDiv.querySelector('img').getAttribute('src') || '/assets/images/cover.jpg';
              let tags = res[i].tags && res[i].tags.replace(/\s+/g, '|').split('|') ||['vue','js'];
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
                cover,
                tags
              });
            }
            this.state.loading = false;
          });
      }
    }
  }
});
module.exports = vm;
