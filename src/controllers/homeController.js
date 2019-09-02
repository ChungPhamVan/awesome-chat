import { notification } from '../services/index';

let getHome = async (req, res, next) => {
  let notifications = await notification.getNotifications(req.user._id);
  let countNotifUnread = await notification.countNotifUnread(req.user._id);
  return res.render('main/home/home', {
    errors: req.flash('errors'),
    success: req.flash('success'), 
    user: req.user,
    notifications: notifications,
    countNotifUnread: countNotifUnread
  });
};
module.exports = {
  getHome: getHome
};