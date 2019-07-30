import express from 'express';
import connectDB from './config/connectDB';
import configViewEngine from './config/viewEngine';

let app = express();

connectDB();

configViewEngine(app);

app.get('/', (req, res, next) => {
  return res.render('main/master');
});
app.get('/login-register', (req, res, next) => {
  res.render("auth/loginRegister");
});

app.listen(process.env.APP_PORT, process.env.APP_HOST, function() {
  console.log('Server listening..., port: ' + process.env.APP_PORT);
});