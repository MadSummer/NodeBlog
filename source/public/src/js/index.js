/*
@ index
*/
let common = require('./common')
let fastClick = require('fastclick');
let vm = require('./vm');
let open = false;
// 定义mobile初始化函数
{
  let sidebar = document.getElementById('sidebar');
  let mMenu = document.getElementById('mobile-menu');
  document.body.addEventListener('click', (e) => {
    if (e.target !== mMenu && !sidebar.contains(e.target)) {
      vm.sidebar = false;
    }
  });
}
// 定义load函数
const load = function () {
  if (window.location.pathname === '/') {
    open = true;
    $.get('/load', { 'page': vm.page }, (res) => {
      if (res.length == 0) {
        vm.nomore = true;
        vm.load = false;
        return;
      }  
      vm.page = vm.page + 1;
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
        vm.articles.push({
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
      open = false;
      vm.load = false;
    });
  }
};
// fastclick消除mobile 300ms delay
fastClick(document.body);
// 初始加载数据
load();
// 初始mobile
window.onscroll = () => {
  // 两者document.documentElement.scrollTop||document.body.scrollTop有一个必定为0
  let scrollTop = (document.documentElement && document.documentElement.scrollTop) + document.body.scrollTop;
  let dh = document.documentElement.scrollHeight;
  let wh = window.innerHeight;
  if (wh + scrollTop === dh && !open) {
    vm.load = true;
    load();
  }
}


