import { pushSocketIdToArray, emitNotifyToArray, removeSocketIdFromArray } from '../../helpers/socketHelper.js'

let chatImage = (io) => {
  let clients = {};

  io.on('connection', (socket) => {
    let currentUserId = socket.request.user._id;
    clients = pushSocketIdToArray(clients, currentUserId, socket.id);
    //console.log(socket.request.user);

    socket.request.user.chatGroupIds.forEach(group => {
      clients = pushSocketIdToArray(clients, group._id, socket.id);
    });
    // console.log(clients);
    
    socket.on('chat-image', (data) => {
      if(data.groupId) {
        let response = {
          currentUserId: socket.request.user._id,
          message: data.message,
          currentGroupId: data.groupId
        };

        if(clients[data.groupId]) {
          emitNotifyToArray(clients, data.groupId, io, 'response-chat-image', response);
        }
      }
      if(data.contactId) {
        let response = {
          currentUserId: socket.request.user._id,
          message: data.message
        };

        if(clients[data.contactId]) {
          emitNotifyToArray(clients, data.contactId, io, 'response-chat-image', response);
        }
      }
      // let currentUser = {
      //   id: socket.request.user._id,
      //   username: socket.request.user.username,
      //   avatar: socket.request.user.avatar,
      //   address: (socket.request.user.address !== null) ? socket.request.user.address : ""
      // };
      
      
    });

    socket.on('disconnect', () => {
      clients = removeSocketIdFromArray(clients, currentUserId, socket);
      socket.request.user.chatGroupIds.forEach(group => {
        clients = removeSocketIdFromArray(clients, group._id, socket);
      });
    });
  });
};

module.exports = chatImage; 