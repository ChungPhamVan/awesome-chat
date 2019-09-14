import { pushSocketIdToArray, emitNotifyToArray, removeSocketIdFromArray } from '../../helpers/socketHelper.js'

let userOnlineOffline = (io) => {
  let clients = {};

  io.on('connection', (socket) => {
    let currentUserId = socket.request.user._id;
    clients = pushSocketIdToArray(clients, currentUserId, socket.id);
    //console.log(socket.request.user);

    socket.request.user.chatGroupIds.forEach(group => {
      clients = pushSocketIdToArray(clients, group._id, socket.id);
    });
    //console.log(Object.keys(clients));

    socket.on('new-group-created', (data) => {
      clients = pushSocketIdToArray(clients, data.groupChat._id, socket.id);
    });
    socket.on('member-received-group-chat', function(data) {
      clients = pushSocketIdToArray(clients, data.groupChatId, socket.id);
    });

    socket.on('check-status', () => {
      //buoc 1: gui ve cho nguoi dung
      socket.emit('server-send-list-users-online', Object.keys(clients));
      //buoc 2
      socket.broadcast.emit('server-send-when-new-user-online', socket.request.user._id);
    });

    socket.on('disconnect', () => {
      clients = removeSocketIdFromArray(clients, currentUserId, socket);
      socket.request.user.chatGroupIds.forEach(group => {
        clients = removeSocketIdFromArray(clients, group._id, socket);
      });
      //buoc 3:
      socket.broadcast.emit('server-send-when-new-user-offline', socket.request.user._id);
    });
  });
};

module.exports = userOnlineOffline; 