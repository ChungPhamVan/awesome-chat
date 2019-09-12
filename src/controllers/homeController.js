import { notification, contact, message } from '../services/index';
import { bufferToBase64, lastItemOfArray, convertTimestampToHumanTime } from '../helpers/clientHelper';
import request from 'request';


let getICETurnServer = () => {
  return new Promise(async (resolve, reject) => {
    let o = {
      format: "urls"
    };

    let bodyString = JSON.stringify(o);
    let options = {
      url: 'https://global.xirsys.net/_turn/awesome-chat',
      method: "PUT",
      headers: {
          "Authorization": "Basic " + Buffer.from("ChungPham:928465de-d548-11e9-a40c-0242ac110002").toString("base64"),
          "Content-Type": "application/json",
          "Content-Length": bodyString.length
      }
    };

    request(options, (error, response, body) => {
      if(error) {
        console.log('Error when get ICE list: ', error)
        return reject(error);
      }
      let bodyJson = JSON.parse(body);
      resolve(bodyJson.v.iceServers);
    });
    
  });
};

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

  let allConversationWithMessages = getAllConversationItems.allConversationWithMessages;

  let iceServerList = await getICETurnServer();
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
    allConversationWithMessages: allConversationWithMessages,
    bufferToBase64: bufferToBase64,
    lastItemOfArray: lastItemOfArray,
    convertTimestampToHumanTime: convertTimestampToHumanTime,
    iceServerList: JSON.stringify(iceServerList)
  });
};
module.exports = {
  getHome: getHome,
  getICETurnServer
};