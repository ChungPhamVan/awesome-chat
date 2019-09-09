
function textAndEmojiChat(divId) {
  $('.emojionearea').unbind('keyup').on('keyup', function(element) {
    let curentEmojioneArea = $(this);
    if(element.which === 13) {
      let targetId = $(`#write-chat-${divId}`).data('chat');
      let messageVal = $(`#write-chat-${divId}`).val();
      if(!targetId.length || !messageVal.length) {
        return false;
      }

      let dataTextEmojiForSend = {
        uid: targetId,
        messageVal: messageVal
      };
      if($(`#write-chat-${divId}`).hasClass('chat-in-group')) {
        dataTextEmojiForSend.isChatGroup = true;
      }

      $.post("/message/add-new-text-emoji", dataTextEmojiForSend, function(data) {
        //success
        //console.log(data.message);
        let dataToEmit = {
          message: data.message
        };


        let messageOfMe = $(`<div class="bubble me" data-mess-id="${data.message._id}"></div>`);
        messageOfMe.text(data.message.text);
        let convertEmojiMessage = emojione.toImage(messageOfMe.html());

        if(dataTextEmojiForSend.isChatGroup) {
          let senderAvatar = `<img src="/images/users/${data.message.sender.avatar}" class="avatar-small" title="${data.message.sender.name}" />`;
          messageOfMe.html(`${senderAvatar} ${convertEmojiMessage}`);
          increaseNumberMessageGroup(divId);
          dataToEmit.groupId = targetId;
        } else {
          messageOfMe.html(convertEmojiMessage);
          dataToEmit.contactId = targetId;
        }
        //console.log(convertEmojiMessage);

        $(`.right .chat[data-chat = ${divId}]`).append(messageOfMe);
        nineScrollRight(divId);


        $(`#write-chat-${divId}`).val('');
        curentEmojioneArea.find('.emojionearea-editor').text('');

        $(`.person[data-chat = ${divId}]`).find('span.time').removeClass('message-time-realtime').html(moment(data.message.createAt).locale('vi').startOf('seconds').fromNow());
        $(`.person[data-chat = ${divId}]`).find('span.preview').html(emojione.toImage(data.message.text));

        $(`.person[data-chat = ${divId}]`).on('vanchung.moveConversationToTheTop', function() {
          let dataToMove = $(this).parent();
          $(this).closest('ul').prepend(dataToMove);
          $(this).off('vanchung.moveConversationToTheTop');
        });
        $(`.person[data-chat = ${divId}]`).trigger('vanchung.moveConversationToTheTop');

        socket.emit('chat-text-emoji', dataToEmit);

        typingOff(divId);

        let checkTyping = $(`.chat[data-chat = ${divId}]`).find('div.bubble-typing-gif');
        if(checkTyping.length) {
          checkTyping.remove();
        }

      }).fail(function(response) {
        //error
        alertify.notify(response.responseText, 'error', 7);
      });
    }
  });
};
$(document).ready(function () {
  socket.on('response-chat-text-emoji', function(response) {
    let divId = "";

    let messageOfYou = $(`<div class="bubble you" data-mess-id="${response.message._id}"></div>`);
    messageOfYou.text(response.message.text);
    let convertEmojiMessage = emojione.toImage(messageOfYou.html());

    if(response.currentGroupId) {
      let senderAvatar = `<img src="/images/users/${response.message.sender.avatar}" class="avatar-small" title="${response.message.sender.name}" />`;
      messageOfYou.html(`${senderAvatar} ${convertEmojiMessage}`);
      divId = response.currentGroupId;
      
      if(response.currentUserId !== $('#dropdown-navbar-user').data('uid')) {
        increaseNumberMessageGroup(divId);
      }
      
    } else {
      messageOfYou.html(convertEmojiMessage);
      divId = response.currentUserId;
    }
    if(response.currentUserId !== $('#dropdown-navbar-user').data('uid')) {
      $(`.right .chat[data-chat = ${divId}]`).append(messageOfYou);
      nineScrollRight(divId);
      $(`.person[data-chat = ${divId}]`).find('span.time').addClass('message-time-realtime')
    }
    


    $(`.person[data-chat = ${divId}]`).find('span.time').html(moment(response.message.createAt).locale('vi').startOf('seconds').fromNow());
    $(`.person[data-chat = ${divId}]`).find('span.preview').html(emojione.toImage(response.message.text));


    $(`.person[data-chat = ${divId}]`).on('vanchung.moveConversationToTheTop', function() {
      let dataToMove = $(this).parent();
      $(this).closest('ul').prepend(dataToMove);
      $(this).off('vanchung.moveConversationToTheTop');
    });
    $(`.person[data-chat = ${divId}]`).trigger('vanchung.moveConversationToTheTop');

  });
});