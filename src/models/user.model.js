import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
let Schema = mongoose.Schema;
let UserSchema = new Schema({
  username: String,
  gender: { type: String, default: "male" },
  phone: { type: String, default: null },
  address: { type: String, default: null },
  avatar: { type: String, default: "avatar-default.jpg" },
  role: { type: String, default: "user" },
  local: { 
    email: { type: String, trim: true },
    password: String,
    isActive: { type: Boolean, default: false },
    verifyToken: String
  },
  facebook: {
    uid: String,
    token: String,
    email: { type: String, trim: true }
  },
  google: {
    uid: String,
    token: String,
    email: { type: String, trim: true }
  },
  createAt: { type: Number, default: Date.now },
  updateAt: { type: Number, default: null },
  deleteAt: { type: Number, default: null },
});

UserSchema.statics = {
  createNew(item) {
    return this.create(item);
  },
  findByEmail(email) {
    return this.findOne({"local.email": email}).exec();
  },
  removeById(id) {
    return this.findByIdAndRemove(id).exec();
  },
  findByToken(token) {
    return this.findOne({"local.verifyToken": token}).exec();
  },
  verify(token) {
    return this.findOneAndUpdate(
      {"local.verifyToken": token},
      {"local.isActive": true, "local.verifyToken": null}
    ).exec();
  },
  findUserByIdToUpdatePassword(id) {
    return this.findById(id).exec();
  },
  findUserByIdForSessionToUse(id) {
    return this.findById(id, {"local.password": 0}).exec();
  },
  findByFacebookUseId(uid) {
    return this.findOne({"facebook.uid": uid}).exec();
  },
  findByGoogleUseId(uid) {
    return this.findOne({"google.uid": uid}).exec();
  },
  updateUser(id, item) {
    return this.findByIdAndUpdate(id, item).exec();
  },
  updatePassword(id, hashedPassword) {
    return this.findByIdAndUpdate(id, {"local.password": hashedPassword}).exec();
  },

  findAllForAddContact(deprecatedUserIds, keyword) {
    return this.find({
      $and: [
        {"_id": {$nin: deprecatedUserIds}},
        {"local.isActive": true},
        {$or: [
          {"username": {"$regex": new RegExp(keyword, "i") }},
          {"local.email": {"$regex": new RegExp(keyword, "i") }},
          {"facebook.email": {"$regex": new RegExp(keyword, "i") }},
          {"google.email": {"$regex": new RegExp(keyword, "i") }}
        ]}
      ]
    }, {_id: 1, username: 1, address: 1, avatar: 1}).exec();
  },
  getNormalUserDataById(id) {
    return this.findById(id, {_id: 1, username: 1, address: 1, avatar: 1}).exec();
  },
  findAllToAddGroupChat(friendIds, keyword) {
    return this.find({
      $and: [
        {"_id": {$in: friendIds}},
        {"local.isActive": true},
        {$or: [
          {"username": {"$regex": new RegExp(keyword, "i") }},
          {"local.email": {"$regex": new RegExp(keyword, "i") }},
          {"facebook.email": {"$regex": new RegExp(keyword, "i") }},
          {"google.email": {"$regex": new RegExp(keyword, "i") }}
        ]}
      ]
    }, {_id: 1, username: 1, address: 1, avatar: 1}).exec();
  }
};

UserSchema.methods = {
  comparePassword(password) {
    return bcrypt.compare(password, this.local.password);
  }
};
module.exports = mongoose.model("user", UserSchema);