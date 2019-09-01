import addNewContact from './contact/addNewContact';
import removeRequestContact from './contact/removeRequestContact';

let initSockets = (io) => {
  addNewContact(io);
  removeRequestContact(io);
};

module.exports = initSockets;