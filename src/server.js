import express from 'express';
import connectDB from './config/connectDB';
import configViewEngine from './config/viewEngine';
import initRoutes from './routes/web';

let app = express();

connectDB();

configViewEngine(app);
initRoutes(app);


app.listen(process.env.APP_PORT, process.env.APP_HOST, function() {
  console.log('Server listening..., port: ' + process.env.APP_PORT);
});