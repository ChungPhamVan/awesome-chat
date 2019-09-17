import ContactModel from '../models/contact.model';
import UserModel from '../models/user.model';
import ChatGroupModel from '../models/chatGroup.model';
import MessageModel from '../models/message.model';
import _ from 'lodash';
import fsExtra from 'fs-extra';
import { transErrors } from '../../lang/vi';
import { app } from '../config/app';

const  LIMIT_CONVERSATION_TAKEN = 10;
const  LIMIT_MESSAGES_TAKEN = 15;


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

      //get messages to apply in screen chat
      let allConversationWithMessagesPromise = allConversations.map(async (conversation) => {
        conversation = conversation.toObject();
        if(conversation.members) {
          let getMessages = await MessageModel.model.getMessagesInGroup(conversation._id, LIMIT_MESSAGES_TAKEN);    
          conversation.messages = _.reverse(getMessages);


          let getIdMembersInGroup = [];
          conversation.members.map(member => {
            getIdMembersInGroup.push(member.userId);
          });
          let getMembersInGroup = await UserModel.findAllUsers(getIdMembersInGroup);
          conversation.getMembersInGroup = getMembersInGroup;
          
        } else {
          let getMessages = await MessageModel.model.getMessagesInPersonal(currentUserId, conversation._id, LIMIT_MESSAGES_TAKEN);
        
          conversation.messages = _.reverse(getMessages);
        }
        return conversation;
      });
      let allConversationWithMessages = await Promise.all(allConversationWithMessagesPromise);
      //sap xep lai
      allConversationWithMessages = _.sortBy(allConversationWithMessages, (item) => {
        return -item.updateAt;
      });

      resolve({
        allConversationWithMessages: allConversationWithMessages,
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

let addNewImage = (sender, receiverId, messageVal, isChatGroup) => {
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
        let imageBuffer = await fsExtra.readFile(messageVal.path);
        let imageContentType = messageVal.mimetype;
        let imageName = messageVal.originalname;
        let newMessageItem = {
          senderId: sender.id,
          receiverId: receiver.id,
          conversationType: MessageModel.conversationTypes.GROUP,
          messageType: MessageModel.messageType.IMAGE,
          sender: sender,
          receiver: receiver,
          file: {
            data: imageBuffer, 
            contentType: imageContentType,
            fileName: imageName
          },
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
        let imageBuffer = await fsExtra.readFile(messageVal.path);
        let imageContentType = messageVal.mimetype;
        let imageName = messageVal.originalname;
        let newMessageItem = {
          senderId: sender.id,
          receiverId: receiver.id,
          conversationType: MessageModel.conversationTypes.PERSONAL,
          messageType: MessageModel.messageType.IMAGE,
          sender: sender,
          receiver: receiver,
          file: {
            data: imageBuffer, 
            contentType: imageContentType,
            fileName: imageName
          },
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


let addNewAttachment = (sender, receiverId, messageVal, isChatGroup) => {
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
        let attachmentBuffer = await fsExtra.readFile(messageVal.path);
        let attachmentContentType = messageVal.mimetype;
        let attachmentName = messageVal.originalname;
        let newMessageItem = {
          senderId: sender.id,
          receiverId: receiver.id,
          conversationType: MessageModel.conversationTypes.GROUP,
          messageType: MessageModel.messageType.FILE,
          sender: sender,
          receiver: receiver,
          file: {
            data: attachmentBuffer, 
            contentType: attachmentContentType,
            fileName: attachmentName
          },
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
        let attachmentBuffer = await fsExtra.readFile(messageVal.path);
        let attachmentContentType = messageVal.mimetype;
        let attachmentName = messageVal.originalname;
        let newMessageItem = {
          senderId: sender.id,
          receiverId: receiver.id,
          conversationType: MessageModel.conversationTypes.PERSONAL,
          messageType: MessageModel.messageType.FILE,
          sender: sender,
          receiver: receiver,
          file: {
            data: attachmentBuffer, 
            contentType: attachmentContentType,
            fileName: attachmentName
          },
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

let readMoreAllChat = (currentUserId, skipPersonal, skipGroup) => {
  return new Promise(async (resolve, reject) => {
    try {
      let contacts = await ContactModel.readMoreContacts(currentUserId, skipPersonal, LIMIT_CONVERSATION_TAKEN);

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

      let groupConversations = await ChatGroupModel.readMoreChatGroups(currentUserId, skipGroup, LIMIT_CONVERSATION_TAKEN);

      let allConversations = userConversations.concat(groupConversations);
      allConversations = _.sortBy(allConversations, (item) => {
        return -item.updateAt;
      });

      //get messages to aply in screen chat
      let allConversationWithMessagesPromise = allConversations.map(async (conversation) => {
        conversation = conversation.toObject();
        if(conversation.members) {
          let getMessages = await MessageModel.model.getMessagesInGroup(conversation._id, LIMIT_MESSAGES_TAKEN);
        
          conversation.messages = _.reverse(getMessages);
        } else {
          let getMessages = await MessageModel.model.getMessagesInPersonal(currentUserId, conversation._id, LIMIT_MESSAGES_TAKEN);
        
          conversation.messages = _.reverse(getMessages);
        }
        
        
        return conversation;
      });
      let allConversationWithMessages = await Promise.all(allConversationWithMessagesPromise);
      //sap xep lai
      allConversationWithMessages = _.sortBy(allConversationWithMessages, (item) => {
        return -item.updateAt;
      });


      resolve(allConversationWithMessages);

      
    } catch (error) {
      reject(error);
    }
  });
};

let readMore = (currentUserId, skipMessage, targetId, chatInGroup) => {
  return new Promise(async (resolve, reject) => {
    try {
      if(chatInGroup) {
        let getMessages = await MessageModel.model.readMoreMessagesInGroup(targetId, skipMessage, LIMIT_MESSAGES_TAKEN);
        
        getMessages = _.reverse(getMessages);
        return resolve(getMessages);
      }
      let getMessages = await MessageModel.model.readMoreMessagesInPersonal(currentUserId, targetId, skipMessage, LIMIT_MESSAGES_TAKEN);

      getMessages = _.reverse(getMessages);
      return resolve(getMessages);
    
      
    } catch (error) {
      reject(error);
    }
  });
};

let findConversations = (allConversationIds, keyword) => {
  return new Promise(async (resolve, reject) => {
    let allConversations = [];
    let allConversationInGroup = await ChatGroupModel.findAllConversations(allConversationIds, keyword);
    let allConversationInContact = await UserModel.findAllConversations(allConversationIds, keyword);
    allConversations = allConversations.concat(allConversationInGroup).concat(allConversationInContact);
    resolve(allConversations);
  });
};
module.exports = {
  getAllConversationItems: getAllConversationItems,
  addNewTextEmoji: addNewTextEmoji,
  addNewImage: addNewImage,
  addNewAttachment: addNewAttachment,
  readMoreAllChat: readMoreAllChat,
  readMore: readMore,
  findConversations: findConversations
};