import { pushSocketIdToArray, emitNotifyToArray, removeSocketIdFromArray } from '../../helpers/socketHelper';

let removeContact = (io) => {
  let clients = {};

  io.on('connection', (socket) => {
    let currentUserId = socket.request.user._id;
    clients = pushSocketIdToArray(clients, currentUserId, socket.id);
    socket.on('remove-contact', (data) => {
      let currentUser = {
        id: socket.request.user._id
      };
      if(clients[data.contactId]) {
        emitNotifyToArray(clients, data.contactId, io, 'response-remove-contact', currentUser);
      }
      
    });

    socket.on('disconnect', () => {
      clients = removeSocketIdFromArray(clients, currentUserId, socket);
    });
  });
};

module.exports = removeContact; 