import { pushSocketIdToArray, emitNotifyToArray, removeSocketIdFromArray } from '../../helpers/socketHelper.js'

let typingOff = (io) => {
  let clients = {};

  io.on('connection', (socket) => {
    let currentUserId = socket.request.user._id;
    clients = pushSocketIdToArray(clients, currentUserId, socket.id);
    //console.log(socket.request.user);

    socket.request.user.chatGroupIds.forEach(group => {
      clients = pushSocketIdToArray(clients, group._id, socket.id);
    });
    // console.log(clients);
    
    socket.on('user-is-not-typing', (data) => {
      if(data.groupId) {
        let response = {
          currentUserId: socket.request.user._id,
          currentGroupId: data.groupId
        };

        if(clients[data.groupId]) {
          emitNotifyToArray(clients, data.groupId, io, 'response-user-is-not-typing', response);
        }
      }
      if(data.contactId) {
        let response = {
          currentUserId: socket.request.user._id,
        };

        if(clients[data.contactId]) {
          emitNotifyToArray(clients, data.contactId, io, 'response-user-is-not-typing', response);
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

module.exports = typingOff; 