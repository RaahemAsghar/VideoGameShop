

module.exports.getAccount = (req,res)=>{
    res.render('my-account',{user:req.session.user})
}