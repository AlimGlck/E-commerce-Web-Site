const User = require('../models/User');

module.exports = async (req, res, next) => {
  const user = await User.findById(req.session.userID);

  if(user.userRole === 'admin'){
    next();
  }
  else{
    return res.redirect('/');
  }
};