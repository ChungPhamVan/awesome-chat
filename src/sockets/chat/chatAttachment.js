import { pushSocketIdToArray, emitNotifyToArray, removeSocketIdFromArray } from '../../helpers/socketHelper.js'

let chatAttachment = (io) => {
  let clients = {};

  io.on('connection', (socket) => {
    let currentUserId = socket.request.user._id;
    clients = pushSocketIdToArray(clients, currentUserId, socket.id);
    //console.log(socket.request.user);

    socket.request.user.chatGroupIds.forEach(group => {
      clients = pushSocketIdToArray(clients, group._id, socket.id);
    });
    // console.log(clients);
    socket.on('new-group-created', (data) => {
      clients = pushSocketIdToArray(clients, data.groupChat._id, socket.id);
    });

    socket.on('member-received-group-chat', function(data) {
      clients = pushSocketIdToArray(clients, data.groupChatId, socket.id);
    });
    
    socket.on('chat-attachment', (data) => {
      if(data.groupId) {
        let response = {
          currentUserId: socket.request.user._id,
          message: data.message,
          currentGroupId: data.groupId
        };

        if(clients[data.groupId]) {
          emitNotifyToArray(clients, data.groupId, io, 'response-chat-attachment', response);
        }
      }
      if(data.contactId) {
        let response = {
          currentUserId: socket.request.user._id,
          message: data.message
        };

        if(clients[data.contactId]) {
          emitNotifyToArray(clients, data.contactId, io, 'response-chat-attachment', response);
        }
      }

    });

    socket.on('disconnect', () => {
      clients = removeSocketIdFromArray(clients, currentUserId, socket);
      socket.request.user.chatGroupIds.forEach(group => {
        clients = removeSocketIdFromArray(clients, group._id, socket);
      });
    });
  });
};

module.exports = chatAttachment; 