import express from 'express';
import http from 'http';
import socketio from 'socket.io';
import passpportSocketIo from 'passport.socketio';
import cookieParser from 'cookie-parser';
import session from './session';

let app = express();
let server = http.createServer(app);
let io = socketio(server);


let configSocketIo = () => {

  io.use(passpportSocketIo.authorize({
    cookieParser: cookieParser,
    key: process.env.SESSION_KEY,
    secret: process.env.SESSION_SECRET,
    store: session.sessionStore,
    success: (data, accept) => {
      if(!data.user.logged_in) {
        return accept("Invalid user.", false);
      }
      return accept(null, true);
    },
    fail: (data, message, error, accept) => {
      if(error) {
        console.log('failed connection', message);
        return accept(new Error(message), false);
      }
    }
  }));
};
module.exports = configSocketIo;