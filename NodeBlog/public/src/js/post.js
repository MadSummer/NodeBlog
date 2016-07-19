/*
@ post
*/
if ($('#editor').length >= 1) {
  var editor = new wangEditor('editor');
  editor.config.uploadImgUrl = '/post/upload';
  editor.config.uploadImgFileName = 'myFileName';
  editor.create();
  $('.postBtn').click(() => {
    if ($('input[name=title]').val().length < 1 || $('.textarea').val() < 1) {
      return alert('不能为空！');
    }
    $.ajax({
      url: '/post',
      type: 'POST',
      data: {
        title: $('input[name=title]').val(),
        content: $('.textarea').val()
      },
      success: function (res) {
        if (res) {
          window.location.href = '/p/' + res;
        }
        else {
          window.location.href = '/';
        }
      }
    });
  });
}