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
  updateAt: { type: Number, default: null },
  deleteAt: { type: Number, default: null },
});

ChatGroupSchema.statics = {
  getChatGroups(userId, limit) {
    return this.find({
      "members": {$elemMatch: {"userId": userId}}
    }).sort({ "createAt": -1 }).limit(limit).exec();
  }
};
module.exports = mongoose.model("chat-group", ChatGroupSchema);