
function readMoreMessages() {
  $('.right .chat').scroll(function() {
    let firstMessage = $(this).find('.bubble:first');
    let currentOffset = firstMessage.offset().top - $(this).scrollTop();
    
    if($(this).scrollTop() === 0) {
      let messageLoading = '<img src="images/chat/image-loader.gif" class="message-loading" />';
      $(this).prepend(messageLoading);
      let thisDom = $(this);

      let targetId = $(this).data('chat');
      let skipMessage = $(this).find('div.bubble').length;
      let chatInGroup = $(this).hasClass('chat-in-group') ? true : false;

      setTimeout(function() {
        $.get(`/message/read-more?skipMessage=${skipMessage}&targetId=${targetId}&chatInGroup=${chatInGroup}`, function(data) {
          //console.log(data);
          console.log(typeof targetId);
          
          if(data.rightSideData.trim() === '') {
            alertify.notify('Bạn đã hết tin nhắn trong cuộc trò chuyện...', 'error', 7);
            thisDom.find('img.message-loading').remove();
            return false;
          }
          // buoc 1: xu ly ben trai
          $(`.right .chat[data-chat = "${targetId}"`).prepend(data.rightSideData);
          // buoc 2: scroll
          $(`.right .chat[data-chat = "${targetId}"`).scrollTop(firstMessage.offset().top - currentOffset);
          // buoc 3: text& emoji
          convertEmoji();
          // buoc 4: xu ly imageModal
          $(`#imagesModal_${targetId}`).find('div.all-images').append(data.imageModalData);
          // buoc 5: gridPhotos
          gridPhotos(5);
          // buoc 6: xu ly attachment modal
          $(`#attachmentsModal_${targetId}`).find('ul.list-attachments').append(data.attachmentModalData);
          // buoc 7: xoa message loading
          thisDom.find('img.message-loading').remove();

        });
      }, 400);
      
    }
    
  });
}
$(document).ready(function () {
  readMoreMessages();
});