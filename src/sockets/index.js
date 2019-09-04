import addNewContact from './contact/addNewContact';
import removeRequestContactSent from './contact/removeRequestContactSent';

let initSockets = (io) => {
  addNewContact(io);
  removeRequestContactSent(io);
};

module.exports = initSockets;