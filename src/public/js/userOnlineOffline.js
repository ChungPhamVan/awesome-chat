
socket.on('server-send-list-users-online', function(listUserIds) {  
  listUserIds.forEach(userId => {
    $(`.person[data-chat = ${userId}] .left-avatar`).find('div.dot').addClass('online');
    $(`.person[data-chat = ${userId}] .left-avatar`).find('img').addClass('avatar-online');
  });
});

socket.on('server-send-when-new-user-online', function(userId) {
  $(`.person[data-chat = ${userId}] .left-avatar`).find('div.dot').addClass('online');
  $(`.person[data-chat = ${userId}] .left-avatar`).find('img').addClass('avatar-online');
});

socket.on('server-send-when-new-user-offline', function(userId) {
  $(`.person[data-chat = ${userId}] .left-avatar`).find('div.dot').removeClass('online');
  $(`.person[data-chat = ${userId}] .left-avatar`).find('img').removeClass('avatar-online');
});