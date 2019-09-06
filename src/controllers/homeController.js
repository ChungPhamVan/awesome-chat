import { notification, contact, message } from '../services/index';

let getHome = async (req, res, next) => {
  let notifications = await notification.getNotifications(req.user._id);
  let countNotifUnread = await notification.countNotifUnread(req.user._id);
  //get contacts
  let contacts = await contact.getContacts(req.user._id);

  let contactsSent = await contact.getContactsSent(req.user._id);

  let contactsReceived = await contact.getContactsReceived(req.user._id);
  
  //count contacts
  let countAllContacts = await contact.countAllContacts(req.user._id);
  let countAllContactsSent = await contact.countAllContactsSent(req.user._id);
  let countAllContactsReceived = await contact.countAllContactsReceived(req.user._id);

  let getAllConversationItems = await message.getAllConversationItems(req.user._id);

  let allConversations = getAllConversationItems.allConversations;
  let userConversations = getAllConversationItems.userConversations;
  let groupConversations = getAllConversationItems.groupConversations;

  return res.render('main/home/home', {
    errors: req.flash('errors'),
    success: req.flash('success'), 
    user: req.user,
    notifications: notifications,
    countNotifUnread: countNotifUnread,
    contacts: contacts,
    contactsSent: contactsSent,
    contactsReceived: contactsReceived,
    countAllContacts: countAllContacts,
    countAllContactsSent: countAllContactsSent,
    countAllContactsReceived: countAllContactsReceived,
    allConversations: allConversations,
    userConversations: userConversations,
    groupConversations: groupConversations
  });
};
module.exports = {
  getHome: getHome
};