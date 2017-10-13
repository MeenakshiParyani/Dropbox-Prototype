// Dependencies

var express = require('express');
var cors = require('cors');
var router = express.Router();
var mysql = require('./mysql');


// router.get('/', function(req,res){
// 	res.send('Testing!!');
// });

router.use(cors());
router.get('/', function(req,res){
  var firstName = req.query.firstName;
	var lastName = req.query.lastName;
	var email = req.query.email;
	var password = req.query.password;
	var insertUser="INSERT INTO `user` (`first_name`, `last_name`, `email`, `password`)" +
			" VALUES ('"+ req.param("firstName") + "', '" + req.param("lastName") + "', ' " +
			req.param("email") + "', ' " + req.param("password") + "');";
	console.log(insertUser);
	try{
		mysql.fetchData(function(err,results){
			if(err){
				if(err.code =='ER_DUP_ENTRY'){
					res.status(300).send({'error' : 'User already exists, please choose another email'});
				}
			}else{
				res.status(200).send({'result' : 'User signed up successfully'});
			}
		},insertUser);
	}catch(err){
		res.status(500).send({'error' : 'Server is down, please try again'});
	}



});

// Return Router
module.exports = router;
