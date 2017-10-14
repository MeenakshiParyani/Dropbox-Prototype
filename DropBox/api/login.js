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
	var email = req.query.email;
	var password = req.query.password;
  var getUser="select * from `" + mysql.database + "`.`user` where email='"+email+"' and password='" + password +"'";
	console.log("Query is: "+ getUser);
	try{
		mysql.fetchData(function(err,results){
			if(err){
				// console.log('error2');
				if(err.code == 'ECONNREFUSED')
					res.status(500).send({'error' : 'Server is down, please try again'});
			}else{
        if(results.length > 0)
				    res.status(200).send({'result' : 'Logged In!!'});
				else
						res.status(300).send({'error' : 'User does not exist'});
			}
		},getUser);
	}catch(err){
		// console.log('error1');
		res.status(500).send({'error' : 'Server is down, please try again'});
	}

});

// Return Router
module.exports = router;
