import express from 'express';
import connectDB from './config/connectDB';
import configViewEngine from './config/viewEngine';
import initRoutes from './routes/web';
import bodyParser from 'body-parser';
import conectFlash from 'connect-flash';
import configSession from './config/session';
import passport from 'passport';
import pem from 'pem';
import https from 'https';

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
connectDB();
configSession(app);

configViewEngine(app);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(conectFlash());

app.use(passport.initialize());
app.use(passport.session());
initRoutes(app);

app.listen(process.env.APP_PORT, process.env.APP_HOST, function() {
  console.log('Server đã bắt đầu với port:  ' + process.env.APP_PORT);
});