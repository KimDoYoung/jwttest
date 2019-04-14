// api/auth.js
const router = require('express').Router();
const User = require('../models/user');
const util = require('../util');
const jwt  = require('jsonwebtoken');

//index 
router.post('/login',  function(req, res, next){
   let  isValid = true;
   let validationError = {
       name : 'ValidationError',
       errors : {}
   }
   var username = req.body.username;
   var password = req.body.password;
   console.log('username:', username);
   console.log('password:', password);
   if(!username) {
       isValid = false;
       validationError.errors.username =  validationError.errors.username = {message:'Username is required!'};
   }
   if(!password){
    isValid = false;
    validationError.errors.password = {message:'Password is required!'};
  }

  if(!isValid) return res.json(util.successFalse(validationError));
  else next();  

}, function(req, res, next){
    var username = req.body.username;
    var password = req.body.password;
    console.log('username:', username);
    console.log('password:', password);
   User.findOne({username : username})
            .select({password:1, username:1, name:1, email:1})
            .exec(function(err,user){
                console.log("222222222222222", user);
                if(err){
                    console.log("333333333333333333333");
                     return res.json(util.successFalse(err));
                }else if( user && !user.authenticate(password)){
                    console.log("4444444444444444444");
                  return res.json(util.successFalse(null,'Username or Password is invalid'));
                }else {
                    console.log("111111111111111111");
                    var payload = {
                        _id : user._id,
                        username : user.username
                    };
                    var secretKey = process.env.JWT_SECRET;
                    var options = {expiresIn : 60*60*24};
                    jwt.sign(payload, secretKey, options, function(err, token){
                        console.log('token:[', token , ']');
                        if(err) return res.json(util.successFalse(err));
                        res.json(util.successTrue(token));
                    });
                }
            });
}
);

module.exports = router;