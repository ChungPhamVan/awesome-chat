import mongoose from 'mongoose';
let Shema = mongoose.Schema;
let MessageSchema = new Shema({
  senderId: String,
  receiverId: String,
  conversationType: String,
  messageType: String,
  sender: {
    id: String,
    username: String,
    avatar: String
  },
  receiver: {
    id: String,
    username: String,
    avatar: String
  },
  text: String,
  file: {
    data: Buffer, 
    contentType: String,
    fileName: String
  },
  createAt: { type: Number, default: Date.now },
  updateAt: { type: Number, default: null },
  deleteAt: { type: Number, default: null },
});
MessageSchema.statics = {
  getMessages(senderId, receiverId, limit) {
    return this.find({
      $or: [
        {$and: [
          {"senderId": senderId},
          {"receiverId": receiverId}
        ]},
        {$and: [
          {"senderId": receiverId},
          {"receiverId": senderId}
        ]}
      ]
    }).sort({ 'createAt': 1 }).limit(limit).exec();
  }
};
const MESSAGE_CONVERSATION_TYPES = {
  PERSONAL: 'personal',
  GROUP: 'group'
};

const MESSAGE_TYPES = {
  TXT: 'text',
  IMAGE: 'image',
  FILE: 'file'
};
module.exports = {
  model: mongoose.model("message", MessageSchema),
  conversationTypes: MESSAGE_CONVERSATION_TYPES,
  messageType: MESSAGE_TYPES
}