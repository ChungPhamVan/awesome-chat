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
            //buoc 0: check active
            console.log(targetId);
            let checkActive = $('#all-chat').find(`li[data-chat = ${targetId}]`).hasClass('active');
            //buoc 1: xoa ben trai
            $('#all-chat').find(`ul a[href = "#uid_${targetId}"]`).remove();
            $('#user-chat').find(`ul a[href = "#uid_${targetId}"]`).remove();
            //buoc 2: xoa ben phai
            $('#screen-chat').find(`div#to_${targetId}`).remove();
            //buoc 3: xoa image modal
            $('body').find(`div#imagesModal_${targetId}`).remove();
            //buoc 4: xoa attachment modal
            $('body').find(`div#aattachmentsModal_${targetId}`).remove();
            //buoc 5: click vao muc dau tien
            if(checkActive) {
              $('ul.people').find('a')[0].click();
            }

  
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
  //sau này thêm chức năng xóa cửa sổ chat
  //buoc 0:
  let checkActive = $('#all-chat').find(`li[data-chat = ${user.id}]`).hasClass('active');
  //buoc 1: xoa ben trai
  $('#all-chat').find(`ul a[href = "#uid_${user.id}"]`).remove();
  $('#user-chat').find(`ul a[href = "#uid_${user.id}"]`).remove();

  //buoc 2:
  $('#screen-chat').find(`div#to_${user.id}`).remove();
  //buoc 3: xoa image modal
  $('body').find(`div#imagesModal_${user.id}`).remove();
  //buoc 4: xoa attachment modal
  $('body').find(`div#aattachmentsModal_${user.id}`).remove();
  //buoc 5: click vao muc dau tien
  if(checkActive) {
    $('ul.people').find('a')[0].click();
  }
  
});

$(document).ready(function () {
  removeContact();
});