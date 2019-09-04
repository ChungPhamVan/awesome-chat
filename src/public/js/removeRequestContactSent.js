function removeRequestContactSent() {
  $('.user-remove-request-contact-sent').unbind('click').on("click", function() {
    let targetId = $(this).data('uid');
    $.ajax({
      url: '/contact/remove-request-contact-sent',
      type: 'delete',
      data: {uid: targetId},
      success: function(data) {
        if(data.success) {
          $('#find-user').find(`div.user-remove-request-contact-sent[data-uid = ${targetId}]`).hide();
          $('#find-user').find(`div.user-add-new-contact[data-uid = ${targetId}]`).css("display", "inline-block");

          deIncreaseNumberNotification('noti_contact_counter', 1);
          
          deIncreaseNumberNotifContact('count-request-contact-sent');

          $('#request-contact-sent').find(`li[data-uid = ${targetId}]`).remove();


          socket.emit('remove-request-contact-sent', {
            contactId: targetId
          });
        }
      }
    });
  });
}

socket.on('response-remove-request-contact-sent', function(user) {
  $('.noti_content').find(`div[data-uid = ${user.id}]`).remove();
  $('ul.list-notifications').find( `li>div[data-uid = ${user.id}]`).parent().remove();

  $('#request-contact-received').find(`li[data-uid = ${user.id}]`).remove();
  deIncreaseNumberNotifContact('count-request-contact-received');

  deIncreaseNumberNotification('noti_contact_counter', 1);

  deIncreaseNumberNotification('noti_counter', 1);

});

$(document).ready(function () {
  removeRequestContactSent();
});