import { pushSocketIdToArray, emitNotifyToArray, removeSocketIdFromArray } from '../../helpers/socketHelper.js'

let approveRequestContactReceived = (io) => {
  let clients = {};

  io.on('connection', (socket) => {
    let currentUserId = socket.request.user._id;
    clients = pushSocketIdToArray(clients, currentUserId, socket.id);
    socket.on('approve-request-contact-received', (data) => {
      let currentUser = {
        id: socket.request.user._id,
        username: socket.request.user.username,
        avatar: socket.request.user.avatar,
        address: (socket.request.user.address !== null) ? socket.request.user.address : ""
      };
      if(clients[data.contactId]) {
        emitNotifyToArray(clients, data.contactId, io, 'response-approve-request-contact-received', currentUser);
      }
      
    });

    socket.on('disconnect', () => {
      clients = removeSocketIdFromArray(clients, currentUserId, socket);
    });
  });
};

module.exports = approveRequestContactReceived; 