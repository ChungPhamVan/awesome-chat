import express from 'express';
import connectDB from './config/connectDB';
import configViewEngine from './config/viewEngine';
import initRoutes from './routes/web';
import bodyParser from 'body-parser';
import conectFlash from 'connect-flash';
import configSession from './config/session';

let app = express();

connectDB();
configSession(app);

configViewEngine(app);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(conectFlash());
initRoutes(app);


app.listen(process.env.APP_PORT, process.env.APP_HOST, function() {
  console.log('Server listening..., port: ' + process.env.APP_PORT);
});