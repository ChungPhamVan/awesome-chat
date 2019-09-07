import passport from 'passport';
import passportFacebook from 'passport-facebook';
import UserModel from './../../models/user.model';
import { transErrors, transSuccess } from './../../../lang/vi';
require('dotenv').config();

let facebookStrategy = passportFacebook.Strategy;
let fbAppId = process.env.FB_APP_ID;
let fbAppSecret = process.env.FB_APP_SECRET;
let fbAppCallbackUrl = process.env.FB_CALLBACK_URL;

let initPassportFacebook = () => {
  passport.use(new facebookStrategy({
    clientID: fbAppId,
    clientSecret: fbAppSecret,
    callbackURL: fbAppCallbackUrl,
    passReqToCallback: true,
    profileFields: ["email", "gender", "displayName"]
  }, async (req, accessToken, refreshToken, profile, done) => {
    try {
      let user = await UserModel.findByFacebookUseId(profile.id);
      if(user) {
        return done(null, user, req.flash('success', transSuccess.loginSuccess(user.username)));
      }
      let newUserItem = {
        username: profile.displayName,
        gender: profile.gender,
        local: {isActive: true},
        facebook: {
          uid: profile.id,
          token: accessToken,
          email: profile.emails[0].value
        }
      };
      let newUser = await UserModel.createNew(newUserItem);
      return done(null, newUser, req.flash('success', transSuccess.loginSuccess(newUser.username)));
    } catch (error) {
      
    }
  }));

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  passport.deserializeUser((id, done) => {
    UserModel.findUserByIdForSessionToUse(id)
      .then(user => {
        return done(null, user);
      })
      .catch(error => {
        return done(error, null);
      });
  });
};
module.exports = initPassportFacebook;