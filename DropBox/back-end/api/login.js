// Dependencies

var express = require('express');
var cors = require('cors');
var router = express.Router();
var mysql = require('./mysql');
var bcrypt = require('./bcrypt');
var passport = require('passport');
var User = require('../models/user.js');
var LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
	function(req, email, password, done) {
		//console.log(req);
		//console.log(password);
		User.getUserByEmail(email, function(err, user){
			if(err)
				console.log(err);
			if(!user){
				return done(null, false, {message : 'User does not exist'});
			}
			User.comparePassword(password, user.password,function(err, isMatch){
				if(err)
					console.log(err);
				if(isMatch){
					return done(null, user);
				}else{
					console.log("passwoerd mismatch");
					return done(null, false, {message : 'Password does not match'})
				}
			})
		});
}));

passport.serializeUser(function(user,done){
	done(null, user.id);
});

passport.deserializeUser(function(id, done){
	User.getUserById(function(err, user){
		done(err, user);
	})
})

//router.use(cors());
router.post('/', function(req, res, next ){
    passport.authenticate('local', function(err, user, info) {
      if (err) { return next(err) }
      if (!user) { return res.json( { message: info.message }) }
      req.session.userId = user._id;
      res.json({
				id : user._id,
				email : user.email,
				firstname : user.firstname
			});
    })(req, res, next);
});

router.get('/isLoggedIn', function(req, res, next ){
  if(req.session.userId){
    res.status(200).send({
      isLoggedIn :  true,
      userId     :  req.session.userId
    });
  }else{
    res.status(401).send({
      isLoggedIn :  false,
      userId     :  null
    })
  }
});

// Return Router
module.exports = router;
