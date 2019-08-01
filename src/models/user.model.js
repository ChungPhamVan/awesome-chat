import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
let Shema = mongoose.Schema;
let UserSchema = new Shema({
  username: String,
  gender: { type: String, default: "male" },
  phone: { type: Number, default: null },
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
  findUserById(id) {
    return this.findById(id).exec();
  },
  findByFacebookUseId(uid) {
    return this.findOne({"facebook.uid": uid}).exec();
  },
  findByGoogleUseId(uid) {
    return this.findOne({"google.uid": uid}).exec();
  }
};

UserSchema.methods = {
  comparePassword(password) {
    return bcrypt.compare(password, this.local.password);
  }
};
module.exports = mongoose.model("user", UserSchema);