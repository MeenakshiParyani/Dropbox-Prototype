// Dependencies

var express = require('express');
var cors = require('cors');
var router = express.Router();
var mysql = require('./mysql');
var bcrypt = require('./bcrypt');
var User = require('../models/user.js');


router.use(cors());
router.post('/', function(req,res){
  try{
    console.log('request is ' + JSON.stringify(req.body));
    var firstName = req.body.data.firstName;
  	var lastName = req.body.data.lastName;
  	var email = req.body.data.email;
  	var password = req.body.data.password;
    var newUser = new User({
      firstname : firstName,
      lastname : lastName,
      email    : email,
      password : password
    });
    console.log(newUser);
    User.createUser(newUser, function(err, user){
      if(err){
        console.log(err);
        if(err.code ==11000)
          res.status(300).send({'error' : 'User already exists, please choose another email'});
        if(err.code =='ECONNREFUSED')
          res.status(500).send({'error' : 'Server is down, please try again'});
      }
      else {
        console.log(user);
        res.status(200).send({'result' : 'User signed up successfully'});
      }
    });
  }catch(err){
    console.log(err);
    res.status(500).send({'error' : 'Server is down, please try again'});
  }
});

// Return Router
module.exports = router;
