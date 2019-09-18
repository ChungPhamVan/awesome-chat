let callFindUsers = function(element) {
  if(element.which == 13 || element.type == "click") {
    let keyword = $('#input-find-users-contact').val();
    let regexKeyword = new RegExp(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/);
    
    
    if(!keyword.length) {
      alertify.notify('Chưa nhập nội dung tìm kiếm', "error", 7);
      return false;
    }
    if(!regexKeyword.test(keyword) || keyword.length > 17) { 
      alertify.notify("Lỗi từ khóa tìm kiếm, chỉ cho phép nhập chữ cái, số, khoảng cách và không quá 17 ký tự", "error", 7);
      return false;
    }
    $.get(`/contact/find-users?keyword=${keyword}&create=1`, function(data) {
      $('#find-user ul').html(data);
      addContact();
      removeRequestContactSent();
    }).fail(function(response) {
      alertify.notify(response.responseText, "error", 7);
    });

  }

  // $.get(`/contact/find-users/${keyword}`, function(data) {
  //   $('#find-user ul').html(data);
  //   addContact();
  //   removeRequestContactSent();
  // });
}


$(document).ready(function() {
  $('#input-find-users-contact').unbind('keypress').on("keypress", callFindUsers);
  $('#btn-find-users-contact').unbind('click').on('click', callFindUsers);
});