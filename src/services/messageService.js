import ContactModel from '../models/contact.model';
import UserModel from '../models/user.model';
import ChatGroupModel from '../models/chatGroup.model';
import MessageModel from '../models/message.model';
import _ from 'lodash';

const  LIMIT_CONVERSATION_TAKEN = 15;
const  LIMIT_MESSAGES_TAKEN = 30;


let getAllConversationItems = (currentUserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let contacts = await ContactModel.getContacts(currentUserId, LIMIT_CONVERSATION_TAKEN);

      let userConversationsPromise = contacts.map(async (contact) => {
        if(contact.contactId == currentUserId) {
          let getUserContact = await UserModel.getNormalUserDataById(contact.userId);
          getUserContact.updateAt = contact.updateAt;
          return getUserContact;
        } else {
          let getUserContact = await UserModel.getNormalUserDataById(contact.contactId);
          getUserContact.updateAt = contact.updateAt;
          return getUserContact;
        }
      });
      let userConversations = await Promise.all(userConversationsPromise);
      let groupConversations = await ChatGroupModel.getChatGroups(currentUserId, LIMIT_CONVERSATION_TAKEN);

      let allConversations = userConversations.concat(groupConversations);
      allConversations = _.sortBy(allConversations, (item) => {
        return -item.updateAt;
      });

      //get messages to aply in screen chat
      let allConversationWithMessagesPromise = allConversations.map(async (conversation) => {
        let getMessages = await MessageModel.model.getMessages(currentUserId, conversation._id, LIMIT_MESSAGES_TAKEN);
        conversation = conversation.toObject();
        conversation.messages = getMessages;
        return conversation;
      });
      let allConversationWithMessages = await Promise.all(allConversationWithMessagesPromise);
      //sap xep lai
      allConversationWithMessages = _.sortBy(allConversationWithMessages, (item) => {
        return -item.updateAt;
      });


      resolve({
        userConversations: userConversations,
        groupConversations: groupConversations,
        allConversations: allConversations,
        allConversationWithMessages: allConversationWithMessages
      });

      
    } catch (error) {
      reject(error);
    }
  });
};
module.exports = {
  getAllConversationItems: getAllConversationItems
};