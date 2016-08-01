# 说明

# 项目预览地址：[blog.xhttkl.com](http://blog.xhttkl.com)

# 技术栈：

## 服务器端
1. 服务器语言：[nodejs](https://nodejs.org/en/)
2. web框架：[express](https://expressjs.com/)
3. 模板引擎：[ejs](http://www.embeddedjs.com/)

## 数据库
1. [Mongodb](https://www.mongodb.com/)

    mongodb是一个典型的NoSQL数据库，有专门的js驱动软件，譬如[RobMongo](https://robomongo.org/),学起来不是很费力
2. node模块：[mongoose](http://mongoosejs.com/)

## 前端

1. 主力[vue](http://cn.vuejs.org/)

    vue也是刚开始接触，比angular轻巧，只是一个view层，双向绑定很值得研究
2. 辅助jquery（富文本编辑器使用） 
3. 富文本编辑器：基于jquery的[wangEditor](http://wangeditor.github.io/)
4. jquery(逐渐用vue.js取代了，但是ajax部分还没有取代，暂时使用)
5. ajax使用[vue-resource](https://github.com/vuejs/vue-resource)
6. 表单验证 [vue-validate](https://github.com/vuejs/vue-validator)

# 简介
  本来是想学着写node的，结果发现既然做了出来不如就当成自己的个人博客来写，就写成了了现在这个样子，有点不伦不类，不过自己用起来还是挺舒服的。

## 功能

* 多用户登录/注册

  这一部分本来想去掉的，后来还是留下来了，只是把注册部分注解掉了--

* 管理员/普通用户

  用户分组管理员和普通用户，管理员可以删除任何文章和评论

* 文章评论

  本来使用多说，后来一想你这破小博客谁会留言，还不如写个自己的呢--

* 文章分类

  文章都有自己的标签，发布的时候用空格隔开即可，之后就可以通过标签查找文章

*   

## 2016年7月19日16:46:48
