import UserModel from './../models/user.model';
import ContactModel from './../models/contact.model';
import _ from 'lodash';

let findUsersContact = (currentUserId, keyword) => {
  return new Promise(async (resolve, reject) => {
    let deprecatedUserIds = [currentUserId];
    let contactByUser = await ContactModel.findAllByUser(currentUserId);
    contactByUser.forEach(contact => {
      deprecatedUserIds.push(contact.userId);
      deprecatedUserIds.push(contact.contactId);
    });
    
    deprecatedUserIds = _.uniqBy(deprecatedUserIds); 
    //console.log(deprecatedUserIds); 
    let users = await UserModel.findAllForAddContact(deprecatedUserIds, keyword);
    resolve(users);
  });
};


let addNew = (currentUserId, contactId) => {
  return new Promise(async (resolve, reject) => {
    let contactExists = await ContactModel.checkExists(currentUserId, contactId);
    if(contactExists) {
      return reject(false);
    }

    let newContactItem = {
      userId: currentUserId,
      contactId: contactId
    };
    let newContact = await ContactModel.createNew(newContactItem);
    resolve(newContact);
  });
};

let removeRequestContact = (currentUserId, contactId) => {
  return new Promise(async (resolve, reject) => {
    let removeReq = await ContactModel.removeRequestContact(currentUserId, contactId);
    if(removeReq.result.n === 0) {
      return reject(false);
    }
    resolve(true);
  });
};

module.exports = {
  findUsersContact: findUsersContact,
  addNew: addNew,
  removeRequestContact: removeRequestContact
};