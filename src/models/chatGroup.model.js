import mongoose from 'mongoose';
let Shema = mongoose.Schema;
let ChatGroupSchema = new Shema({
  name: String,
  userAmount: { type: Number, min: 3, max: 100 },
  messageAmount: { type: Number, default: 0 },
  userId: String,
  members: [
    { userId: String }
  ],
  createAt: { type: Number, default: Date.now },
  updateAt: { type: Number, default: Date.now },
  deleteAt: { type: Number, default: null },
});

ChatGroupSchema.statics = {
  getChatGroups(userId, limit) {
    return this.find({
      "members": {$elemMatch: {"userId": userId}}
    }).sort({ "updateAt": -1 }).limit(limit).exec();
  },
  getChatGroupById(id) {
    return this.findById(id).exec();
  },
  updateWhenHasNewMassage(idGroup, newMessageAmount) {
    return this.findByIdAndUpdate(idGroup, {
      "messageAmount": newMessageAmount,
      "updateAt": Date.now()
    }).exec();
  },
  getChatGroupIdsByUser(userId) {
    return this.find({
      "members": {$elemMatch: {"userId": userId}}
    }, {_id: 1}).exec();
  },
  createGroup(item) {
    return this.create(item);
  },
  checkGroupExist(groupChatName, userId) {
    return this.findOne({
      $and: [
        {"name": groupChatName},
        {"members": {$elemMatch: {"userId": userId}}}
      ]
    }).exec();
  },
  readMoreChatGroups(userId, skip, limit) {
    return this.find({
      "members": {$elemMatch: {"userId": userId}}
    }).sort({ "updateAt": -1 }).skip(skip).limit(limit).exec();
  },
  findAllConversations(allConversationIds, keyword) {
    return this.find({
      $and: [
        {"_id": {$in: allConversationIds}},
        {"name": {"$regex": new RegExp(keyword, "i") }}
      ]
    }, {_id: 1, name: 1, avatar: 1}).exec();
  },
  memberInGroup(idOfGroup) {
    return this.findById(idOfGroup, {_id: 1, members: 1}).exec();
  }
};
module.exports = mongoose.model("chat-group", ChatGroupSchema);