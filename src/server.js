import express from 'express';
import connectDB from './config/connectDB';
import configViewEngine from './config/viewEngine';
import initRoutes from './routes/web';
import bodyParser from 'body-parser';
import conectFlash from 'connect-flash';
import session from './config/session';
import passport from 'passport';
import pem from 'pem';
import http from 'http';
import socketio from 'socket.io';
import initSockets from './sockets/index';
import passpportSocketIo from 'passport.socketio';
import cookieParser from 'cookie-parser';

// pem.config({
//   pathOpenSSL: '../node_modules/pem/lib/openssl'
// });
// pem.createCertificate({ days: 1, selfSigned: true }, function (err, keys) {
//   if (err) {
//     throw err
//   }
//   let app = express();
//   connectDB();
//   configSession(app);

//   configViewEngine(app);
//   app.use(bodyParser.urlencoded({ extended: true }));
//   app.use(conectFlash());

//   app.use(passport.initialize());
//   app.use(passport.session());
//   initRoutes(app);
//   https.createServer({ key: keys.serviceKey, cert: keys.certificate }, app).listen(process.env.APP_PORT, process.env.APP_HOST, function() {
//     console.log('Server đã bắt đầu với port: ' + process.env.APP_PORT);
//   });
// });

let app = express();
let server = http.createServer(app);
let io = socketio(server);
connectDB();
session.config(app);

configViewEngine(app);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(conectFlash());
app.use(cookieParser());


app.use(passport.initialize());
app.use(passport.session());


initRoutes(app);
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

initSockets(io);



server.listen(process.env.APP_PORT, process.env.APP_HOST, function() {
  console.log('Server đã bắt đầu với port:  ' + process.env.APP_PORT);
});