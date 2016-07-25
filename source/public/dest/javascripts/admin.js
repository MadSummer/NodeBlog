$().ready(()=>{
  var editor = new wangEditor('editor');
  editor.create();
  $('.postBtn').click(function(){
    $.ajax({
      url:'/post',
      type:'POST',
      data:{
        content:$('#editor').val(),
        title:$('input[name=title]').val(),
      },
      success:(res)=>{
        alert('/p/'+res._id);
        window.location = '/p/'+res._id;
      }
    })
  })
})