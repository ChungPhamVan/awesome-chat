import session from 'express-session';
import connectMongo from 'connect-mongo';

let MongoStore = connectMongo(session);

let sessionStore = new MongoStore({
  url: `${process.env.DB_CONNECTION}://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  autoReconnect : true,
  autoRemove: "native"
});
let configSession = (app) => {
  app.use(session({
    key: "express.sid",
    secret: "mySuperSecret",
    store: sessionStore,
    resave: true,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 24 * 60 *60
    }
  }));
};
module.exports = configSession;