/*
@ userpage
*/
$('.edit').click(() => {
  $('.editable').attr('contentEditable', true);
  if ($('.edit').parent().find('.userSave').length >= 1) {
    return;
  }
  $('.edit').parent().append('<button class="btn btn-success userSave">保存</button>')
});