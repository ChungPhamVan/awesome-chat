import { contact } from './../services/index';
import { validationResult } from 'express-validator/check';

let findUsersContact = async (req, res, next) => {
  
  let errorArr = [];
  let validationErrors = validationResult(req);

  if(!validationErrors.isEmpty()) {
    let errors = Object.values(validationErrors.mapped());
    errors.forEach(item => {
      errorArr.push(item.msg);
    });

    return res.status(500).send(errorArr);
  }

  try {
    let currentUserId = req.user._id;
    let keyword = req.params.keyword;
    let users = await contact.findUsersContact(currentUserId, keyword);
    // console.log(users);
    
    return res.render('main/contact/sections/_findUsersContact', {users});
  } catch (error) {
    return res.status(500).send(error);
  }
};


let addNew = async (req, res, next) => {
  try {
    let currentUserId = req.user._id;
    let contactId = req.body.uid;
    let newContact = await contact.addNew(currentUserId, contactId);
    return res.status(200).send({success: !!newContact});
  } catch (error) {
    return res.status(500).send(error);
  }
};

let removeContact = async (req, res, next) => {
  try {
    let currentUserId = req.user._id;
    let contactId = req.body.uid;

    let removeContact = await contact.removeContact(currentUserId, contactId);

    return res.status(200).send({success: !!removeContact});
  } catch (error) {
    return res.status(500).send(error);
  }
};


let removeRequestContactSent = async (req, res, next) => {
  try {
    let currentUserId = req.user._id;
    let contactId = req.body.uid;

    let removeReq = await contact.removeRequestContactSent(currentUserId, contactId);

    return res.status(200).send({success: !!removeReq});
  } catch (error) {
    return res.status(500).send(error);
  }
};

let removeRequestContactReceived = async (req, res, next) => {
  try {
    let currentUserId = req.user._id;
    let contactId = req.body.uid;

    let removeReq = await contact.removeRequestContactReceived(currentUserId, contactId);

    return res.status(200).send({success: !!removeReq});
  } catch (error) {
    return res.status(500).send(error);
  }
};

let approveRequestContactReceived = async (req, res, next) => {
  try {
    let currentUserId = req.user._id;
    let contactId = req.body.uid;

    let approveReq = await contact.approveRequestContactReceived(currentUserId, contactId);

    return res.status(200).send({success: !!approveReq});
  } catch (error) {
    return res.status(500).send(error);
  }
};

let readMoreContacts = async (req, res) => {
  try {
    let skipNumberContacts = +(req.query.skipNumber);
    let newContactUsers = await contact.readMoreContacts(req.user._id, skipNumberContacts);
    return res.status(200).send(newContactUsers);
  } catch (error) {
    return res.status(500).send(error);
  }
};


let readMoreContactsSent = async (req, res) => {
  try {
    let skipNumberContacts = +(req.query.skipNumber);
    let newContactUsers = await contact.readMoreContactsSent(req.user._id, skipNumberContacts);
    return res.status(200).send(newContactUsers);
  } catch (error) {
    return res.status(500).send(error);
  }
};

let readMoreContactsReceived = async (req, res) => {
  try {
    let skipNumberContacts = +(req.query.skipNumber);
    let newContactUsers = await contact.readMoreContactsReceived(req.user._id, skipNumberContacts);
    return res.status(200).send(newContactUsers);
  } catch (error) {
    return res.status(500).send(error);
  }
};

let searchFriends = async (req, res, next) => {
  let errorArr = [];
  let validationErrors = validationResult(req);

  if(!validationErrors.isEmpty()) {
    let errors = Object.values(validationErrors.mapped());
    errors.forEach(item => {
      errorArr.push(item.msg);
    });

    return res.status(500).send(errorArr);
  }

  try {
    let currentUserId = req.user._id;
    let keyword = req.params.keyword;
    let users = await contact.searchFriends(currentUserId, keyword);
    // console.log(users);
    
    return res.render('main/groupChat/sections/_searchFriends', {users});
  } catch (error) {
    return res.status(500).send(error);
  }
};
module.exports = {
  findUsersContact: findUsersContact,
  addNew: addNew,
  removeContact: removeContact,
  removeRequestContactSent: removeRequestContactSent,
  removeRequestContactReceived: removeRequestContactReceived,
  approveRequestContactReceived: approveRequestContactReceived,
  readMoreContacts: readMoreContacts,
  readMoreContactsSent: readMoreContactsSent,
  readMoreContactsReceived: readMoreContactsReceived,
  searchFriends: searchFriends
}