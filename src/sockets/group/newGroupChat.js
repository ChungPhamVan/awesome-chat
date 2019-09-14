import { pushSocketIdToArray, emitNotifyToArray, removeSocketIdFromArray } from '../../helpers/socketHelper.js'

let newGroupChat = (io) => {
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
      //console.log(clients);
      let response = {
        groupChat: data.groupChat
      };
      data.groupChat.members.forEach(member => {
        if(clients[member.userId] && member.userId != socket.request.user._id) {
          emitNotifyToArray(clients, member.userId, io, 'request-new-group-created', response);
        }
      });
    });
    socket.on('member-received-group-chat', function(data) {
      clients = pushSocketIdToArray(clients, data.groupChatId, socket.id);
    });

    socket.on('disconnect', () => {
      clients = removeSocketIdFromArray(clients, currentUserId, socket);
      socket.request.user.chatGroupIds.forEach(group => {
        clients = removeSocketIdFromArray(clients, group._id, socket);
      });
    });
  });
};

module.exports = newGroupChat; 