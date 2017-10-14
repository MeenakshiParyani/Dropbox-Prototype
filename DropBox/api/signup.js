// Dependencies

var express = require('express');
var cors = require('cors');
var router = express.Router();
var mysql = require('./mysql');


// router.get('/', function(req,res){
// 	res.send('Testing!!');
// });

router.use(cors());
router.post('/', function(req,res){
  console.log('request is ' + JSON.stringify(req.body));
  var firstName = req.body.data.firstName;
	var lastName = req.body.data.lastName;
	var email = req.body.data.email;
	var password = req.body.data.password;

  // console.log(req.body);
	var insertUser="INSERT INTO `user` (`first_name`, `last_name`, `email`, `password`)" +
			" VALUES ('"+ firstName + "', '" + lastName + "', ' " + email + "', ' " + password + "');";
	console.log(insertUser);
	try{
		mysql.fetchData(function(err,results){
			if(err){
				if(err.code =='ER_DUP_ENTRY')
					res.status(300).send({'error' : 'User already exists, please choose another email'});
				else if(err.code == 'ECONNREFUSED')
					res.status(500).send({'error' : 'Server is down, please try again'});
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
