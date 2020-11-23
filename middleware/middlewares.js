module.exports.initSession = (req, res, next) => {
  if (req.session.isInit == undefined) {
    req.session.isInit = true;
    req.session.user = {};
    req.session.isAuth = false;
    req.session.isAdmin = false;
    req.session.isUser = false;
  } else {
  }
  next();
};

module.exports.resetSession = (req, res) => {
  req.session.isInit = true;
  req.session.user = {};
  req.session.isAuth = false;
  req.session.isAdmin = false;
  req.session.isUser = false;
};

module.exports.setGlobals = (req, res, next) => {
  res.locals.isAuth = req.session.isAuth;
  res.locals.isAdmin = req.session.isAdmin;
  res.locals.isUser = req.session.isUser;
  res.locals.user = req.session.user;
  next();
};


module.exports.protectedAdmin = function(req,res,next){
  if(!req.session.isAuth){
    res.redirect('/admin/login')  
  }
  else if(req.session.isAuth && req.session.isUser){
    res.redirect('/')   
  }
  else{
    next()
  }
}