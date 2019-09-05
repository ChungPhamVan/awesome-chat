function removeContact() {
  $('.user-remove-contact').unbind('click').on("click", function() {
    let targetId = $(this).data('uid');
    let username = $(this).parent().find('div.user-name p').text();
    Swal.fire({
      title: `Bạn có chắc muốn xóa liên hệ với ${username}?`,
      text: "Bạn không thể hoàn tác lại quá trình này!",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "##2ECC17",
      cancelButtonColor: "#FF7675",
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Hủy"
    }).then((result) => {
      if(!result.value) {
        return false;
      }
      $.ajax({
        url: '/contact/remove-contact',
        type: 'delete',
        data: {uid: targetId},
        success: function(data) {
          if(data.success) {
            $('#contacts').find(`ul li[data-uid = ${targetId}]`).remove();
            deIncreaseNumberNotifContact('count-contacts');
            //sau này thêm chức năng xóa cửa sổ chat
                     
  
  
            socket.emit('remove-contact', {
              contactId: targetId
            });
          }
        }
      });
    });
    
  });
}

socket.on('response-remove-contact', function(user) {
  $('#contacts').find(`ul li[data-uid = ${user.id}]`).remove();

  deIncreaseNumberNotifContact('count-contacts');
  
});

$(document).ready(function () {
  removeContact();
});