import addNewContact from './contact/addNewContact';

let initSockets = (io) => {
  addNewContact(io);
};

module.exports = initSockets;