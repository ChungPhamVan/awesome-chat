$(document).ready(function () {
  $('#link-read-more-all-chat').bind("click", function () { 
    let skipPersonal = $('#all-chat').find('li:not(.group-chat)').length;
    let skipGroup = $('#all-chat').find('li.group-chat').length;
    
    $('#link-read-more-all-chat').css('display', 'none');
    $('.read-more-all-chat-loader').css('display', 'block');
    setTimeout(function() {
      $.get(`/message/read-more-all-chat?skipPersonal=${skipPersonal}&skipGroup=${skipGroup}`, function(data) {
        if(data.leftSideData.trim() === '') {
          alertify.notify('Bạn đã hết cuộc trò chuyện...', 'error', 7);
          $('#link-read-more-all-chat').css('display', 'inline-block');
          $('.read-more-all-chat-loader').css('display', 'none');
          return false;
        }
        //buoc 1: phan ben trai
        $('#all-chat').find('ul').append(data.leftSideData);
        //buoc 2: goi lai scroll
        resizeNineScrollLeft();
        nineScrollLeft();
        //buoc 3: xu ly ben phai
        $('#screen-chat').append(data.rightSideData);
        //buoc 4: goi screenChat
        changeScreenChat();
        //buoc 5: xu ly icon emoji
        convertEmoji();
        //buoc 6: xu ly imageModal;
        $('body').append(data.imageModalData);
        //buoc 7: goi gridPhotos
        gridPhotos(5);
        //buoc 8: xu ly attachmentModal
        $('body').append(data.attachmentModalData);
        //buoc 9: kiem tra online
        socket.emit('check-status');

        //buoc 10: 
        $('#link-read-more-all-chat').css('display', 'inline-block');
        $('.read-more-all-chat-loader').css('display', 'none');
        // buoc 11: 
        readMoreMessages();
      });
    }, 500);
    
  });
});