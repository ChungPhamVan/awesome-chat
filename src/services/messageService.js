import ContactModel from '../models/contact.model';
import UserModel from '../models/user.model';
import ChatGroupModel from '../models/chatGroup.model';
import MessageModel from '../models/message.model';
import _ from 'lodash';
import { transErrors } from '../../lang/vi';
import { app } from '../config/app';

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
        conversation = conversation.toObject();
        if(conversation.members) {
          let getMessages = await MessageModel.model.getMessagesInGroup(conversation._id, LIMIT_MESSAGES_TAKEN);
        
          conversation.messages = getMessages;
        } else {
          let getMessages = await MessageModel.model.getMessagesInPersonal(currentUserId, conversation._id, LIMIT_MESSAGES_TAKEN);
        
          conversation.messages = getMessages;
        }
        
        
        return conversation;
      });
      let allConversationWithMessages = await Promise.all(allConversationWithMessagesPromise);
      //sap xep lai
      allConversationWithMessages = _.sortBy(allConversationWithMessages, (item) => {
        return -item.updateAt;
      });


      resolve({
        allConversationWithMessages: allConversationWithMessages
      });

      
    } catch (error) {
      reject(error);
    }
  });
};
let addNewTextEmoji = (sender, receiverId, messageVal, isChatGroup) => {
  return new Promise(async (resolve, reject) => {
    try {
      if(isChatGroup) {
        let getChatGroupReceiver = await ChatGroupModel.getChatGroupById(receiverId);
        if(!getChatGroupReceiver) {
          return reject(transErrors.conversation_not_found);
        }
        let receiver = {
          id: getChatGroupReceiver._id,
          name: getChatGroupReceiver.name,
          avatar: app.general_avatar_group_chat
        };
        let newMessageItem = {
          senderId: sender.id,
          receiverId: receiver.id,
          conversationType: MessageModel.conversationTypes.GROUP,
          messageType: MessageModel.messageType.TEXT,
          sender: sender,
          receiver: receiver,
          text: messageVal,
          createAt: Date.now()
        };
        let newMessage = await MessageModel.model.createNew(newMessageItem);
        await ChatGroupModel.updateWhenHasNewMassage(getChatGroupReceiver._id, getChatGroupReceiver.messageAmount + 1);

        resolve(newMessage);
      } else {
        let getUserReceiver = await UserModel.getNormalUserDataById(receiverId);
        
        if(!getUserReceiver) {
          return reject(transErrors.conversation_not_found);
        }
        let receiver = {
          id: getUserReceiver._id,
          name: getUserReceiver.username,
          avatar: getUserReceiver.avatar
        };
        let newMessageItem = {
          senderId: sender.id,
          receiverId: receiverId,
          conversationType: MessageModel.conversationTypes.PERSONAL,
          messageType: MessageModel.messageType.TEXT,
          sender: sender,
          receiver: receiver,
          text: messageVal,
          createAt: Date.now()
        };
        let newMessage = await MessageModel.model.createNew(newMessageItem);
        await ContactModel.updateWhenHasNewMassage(sender.id, getUserReceiver._id);
        resolve(newMessage);
      }
    } catch (error) {
      reject(error);
    }
  });
};
module.exports = {
  getAllConversationItems: getAllConversationItems,
  addNewTextEmoji: addNewTextEmoji
};