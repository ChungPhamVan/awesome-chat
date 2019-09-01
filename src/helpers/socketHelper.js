let pushSocketIdToArray = (clients, userId, socketId) => {
  if( clients[userId] ) {
    clients[userId].push(socketId);
  } else {
    clients[userId] = [socketId];
  }
  return clients;
};

let emitNotifyToArray = (clients, userId, io, eventName, data) => {
  clients[userId].forEach(socketId => 
    io.sockets.connected[socketId].emit(eventName, data)
  );
};

let removeSocketIdFromArray = (clients, userId, socket) => {
  clients[userId] = clients[userId].filter(socketId => socketId !== socket.id);

  if(!clients[userId].length) {
    delete clients[userId];
  }
  return clients;
};

module.exports = {
  pushSocketIdToArray: pushSocketIdToArray,
  emitNotifyToArray: emitNotifyToArray,
  removeSocketIdFromArray: removeSocketIdFromArray
}