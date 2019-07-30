let getLoginRegister = (req, res, next) => {
  return res.render('auth/master');
};
module.exports = {
  getLoginRegister: getLoginRegister
};