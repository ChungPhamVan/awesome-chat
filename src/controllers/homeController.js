let getHome = (req, res, next) => {
  return res.render('main/home/home');
};
module.exports = {
  getHome: getHome
};